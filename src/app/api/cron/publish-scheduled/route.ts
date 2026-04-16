import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Ce cron est appelé par Vercel toutes les 5 minutes.
// Il publie automatiquement les articles dont scheduled_at <= maintenant.

export async function GET(req: NextRequest) {
  // Initialisation lazy du client Supabase (évite l'erreur au build)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhopwqpbaiyjfoggvcaf.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  // Vérification du secret cron (Vercel l'envoie dans l'Authorization header)
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date().toISOString();

  // Récupérer les articles programmés dont la date est passée
  const { data: articlesToPublish, error: fetchError } = await supabase
    .from('linova_articles')
    .select('id, title, slug, scheduled_at')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now);

  if (fetchError) {
    console.error('[cron] Erreur fetch:', fetchError.message);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!articlesToPublish || articlesToPublish.length === 0) {
    return NextResponse.json({
      message: 'Aucun article à publier',
      checkedAt: now,
      published: 0,
    });
  }

  // Publier chaque article
  const ids = articlesToPublish.map(a => a.id);
  const { error: updateError } = await supabase
    .from('linova_articles')
    .update({ status: 'published', updated_at: now })
    .in('id', ids);

  if (updateError) {
    console.error('[cron] Erreur update:', updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const published = articlesToPublish.map(a => ({ id: a.id, title: a.title, slug: a.slug, scheduledAt: a.scheduled_at }));
  console.log(`[cron] ${published.length} article(s) publié(s):`, published.map(a => a.slug).join(', '));

  return NextResponse.json({
    message: `${published.length} article(s) publié(s) avec succès`,
    checkedAt: now,
    published,
  });
}
