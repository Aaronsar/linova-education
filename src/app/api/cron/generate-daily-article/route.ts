/**
 * Cron quotidien — génère 1 article par jour à partir de la banque d'idées.
 *
 * Flow :
 * 1. Idempotence — si un article généré aujourd'hui, skip
 * 2. Pioche la prochaine idée (priority ASC, created_at ASC) en status='pending'
 * 3. Génère via le pipeline Claude (4 étapes)
 * 4. Insère en `linova_articles` avec status='scheduled' à une heure aléatoire 7h-19h Paris
 * 5. Marque l'idée comme 'used' (ou 'failed' avec failure_reason en cas d'erreur)
 *
 * Le cron `publish-scheduled` (toutes les 5 min) prendra le relais pour publier.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateArticleFull } from '@/lib/article-generator';

// Allow up to 5 min — la pipeline Claude prend ~3 min
export const maxDuration = 300;

interface ArticleIdeaRow {
  id: string;
  title: string;
  slug: string;
  focus_keyword: string;
  category: string;
}

/**
 * Heure aléatoire entre 7h00 et 19h00 Paris pour aujourd'hui.
 * Si l'heure tirée est déjà passée (ex : cron à 8h, tirage 7h30) → décale à demain
 * pour éviter une publication immédiate (= pattern visible).
 */
function randomScheduledAt(): Date {
  // Heure Paris CEST = UTC+2 (été). En hiver UTC+1, marge acceptable.
  // On tire entre 5h UTC (7h Paris) et 17h UTC (19h Paris).
  const now = new Date();
  const candidate = new Date(now);
  candidate.setUTCHours(5, 0, 0, 0);
  const minutesRange = 12 * 60; // 5h → 17h UTC
  const offset = Math.floor(Math.random() * minutesRange);
  candidate.setUTCMinutes(offset);

  // Si l'heure tirée est déjà passée, décale à demain
  if (candidate.getTime() <= now.getTime() + 5 * 60 * 1000) {
    candidate.setUTCDate(candidate.getUTCDate() + 1);
  }

  return candidate;
}

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Auth — pattern repris de publish-scheduled
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Idempotence — un seul article généré par jour
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count: todayCount, error: countError } = await supabase
    .from('linova_articles')
    .select('id', { count: 'exact', head: true })
    .eq('source', 'ai_generated_daily')
    .gte('created_at', todayStart.toISOString());

  if (countError) {
    console.error('[generate-daily] Count error:', countError.message);
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((todayCount ?? 0) > 0) {
    return NextResponse.json({
      skipped: true,
      reason: 'already_generated_today',
      checkedAt: new Date().toISOString(),
    });
  }

  // 2. Pioche la prochaine idée
  const { data: idea, error: ideaError } = await supabase
    .from('linova_article_ideas')
    .select('id, title, slug, focus_keyword, category')
    .eq('status', 'pending')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle<ArticleIdeaRow>();

  if (ideaError) {
    console.error('[generate-daily] Idea fetch error:', ideaError.message);
    return NextResponse.json({ error: ideaError.message }, { status: 500 });
  }

  if (!idea) {
    console.warn('[generate-daily] Banque vide — aucune idée pending.');
    return NextResponse.json({
      skipped: true,
      reason: 'no_ideas_left',
      hint: 'Ajouter des sujets dans linova_article_ideas (status=pending).',
    });
  }

  // 3. Vérifie collision slug
  const { data: existingArticle } = await supabase
    .from('linova_articles')
    .select('id')
    .eq('slug', idea.slug)
    .maybeSingle();

  if (existingArticle) {
    await supabase
      .from('linova_article_ideas')
      .update({ status: 'used', used_at: new Date().toISOString(), failure_reason: 'slug_already_exists' })
      .eq('id', idea.id);
    return NextResponse.json({
      skipped: true,
      reason: 'slug_collision',
      slug: idea.slug,
    });
  }

  // 4. Calcule scheduled_at
  const scheduledAt = randomScheduledAt();

  // 5. Génère via le pipeline Claude
  let article;
  try {
    article = await generateArticleFull({
      title: idea.title,
      slug: idea.slug,
      focusKeyword: idea.focus_keyword,
      category: idea.category,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    console.error('[generate-daily] Generation failed:', message);
    await supabase
      .from('linova_article_ideas')
      .update({ status: 'failed', failure_reason: message.slice(0, 500) })
      .eq('id', idea.id);
    // 200 pour éviter le retry agressif Vercel — on log et on passera à l'idée suivante demain
    return NextResponse.json({
      skipped: true,
      reason: 'generation_failed',
      error: message,
      ideaId: idea.id,
    });
  }

  // 6. Insère l'article
  const { data: inserted, error: insertError } = await supabase
    .from('linova_articles')
    .insert({
      slug: article.slug,
      title: article.title,
      meta_title: article.metaTitle,
      meta_description: article.metaDescription,
      excerpt: article.excerpt,
      category: article.category,
      focus_keyword: article.focusKeyword,
      sections: article.sections,
      read_time: article.readTime,
      seo_score: 0,
      geo_score: 0,
      status: 'scheduled',
      source: 'ai_generated_daily',
      scheduled_at: scheduledAt.toISOString(),
    })
    .select('id, slug, scheduled_at')
    .single();

  if (insertError || !inserted) {
    const message = insertError?.message || 'insert_failed';
    console.error('[generate-daily] Insert error:', message);
    await supabase
      .from('linova_article_ideas')
      .update({ status: 'failed', failure_reason: message.slice(0, 500) })
      .eq('id', idea.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // 7. Marque l'idée comme utilisée
  await supabase
    .from('linova_article_ideas')
    .update({ status: 'used', used_at: new Date().toISOString() })
    .eq('id', idea.id);

  console.log(`[generate-daily] Article généré : ${inserted.slug} → publication ${inserted.scheduled_at}`);

  return NextResponse.json({
    generated: inserted,
    idea: { id: idea.id, title: idea.title },
    scheduledAtParis: new Date(inserted.scheduled_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
  });
}
