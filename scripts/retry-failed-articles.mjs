/**
 * Relance les 5 articles ayant échoué lors de la génération initiale
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const envLines = readFileSync(envPath, 'utf-8').split('\n');
const env = {};
for (const line of envLines) {
  const idx = line.indexOf('=');
  if (idx === -1 || line.trim().startsWith('#')) continue;
  const key = line.slice(0, idx).trim();
  const val = line.slice(idx + 1).trim().replace(/^"(.*)"$/s, '$1').replace(/\\n/g, '\n');
  env[key] = val;
}

const ANTHROPIC_KEY = (env.ANTHROPIC_API_KEY || '').replace(/\s/g, '');
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Les 5 articles ratés avec leurs dates/heures originales
const FAILED_ARTICLES = [
  { title: "Après un BTS Biologie Médicale : poursuites d'études possibles",              keyword: 'poursuite études bts biologie médicale',     category: 'Formation',  slug: 'poursuite-etudes-bts-biologie-medicale',         scheduledAt: '2026-04-21T05:42:00.000Z' },
  { title: "Quel bac pour faire un BTS Biologie Médicale ?",                              keyword: 'bac pour bts biologie médicale',             category: 'Formation',  slug: 'quel-bac-bts-biologie-medicale',                 scheduledAt: '2026-05-01T06:38:00.000Z' },
  { title: "Technicien en laboratoire d'analyses médicales : statut et convention collective", keyword: 'convention collective laboratoire médical', category: 'Métiers',  slug: 'convention-collective-laboratoire-medical',       scheduledAt: '2026-05-02T06:19:00.000Z' },
  { title: "Travailler dans un laboratoire de ville : le quotidien du technicien",        keyword: 'technicien laboratoire ville',               category: 'Métiers',    slug: 'technicien-laboratoire-ville',                   scheduledAt: '2026-05-03T06:21:00.000Z' },
  { title: "Technicien en biochimie médicale : spécialités et débouchés",                 keyword: 'technicien biochimie médicale',              category: 'Métiers',    slug: 'technicien-biochimie-medicale',                  scheduledAt: '2026-05-04T05:22:00.000Z' },
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callClaude(systemPrompt, userPrompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const msg = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 8000,
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt,
      });
      return msg.content[0].text;
    } catch (err) {
      if (attempt < retries) {
        console.log(`    ⚠️  Tentative ${attempt} échouée, retry dans 10s...`);
        await sleep(10000);
      } else {
        throw err;
      }
    }
  }
}

function parseJSON(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = match ? match[1] : text;
  return JSON.parse(raw.trim());
}

async function generateArticle(article) {
  const systemGenerate = `Tu es un expert en rédaction SEO et GEO pour le secteur de la santé en France.
Tu rédiges des articles de blog pour Linova, une école de BTS Biologie Médicale à Paris.
Réponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "metaTitle": "...",
  "metaDescription": "...",
  "excerpt": "...",
  "sections": [
    { "id": "uuid", "type": "heading", "level": 2, "content": "..." },
    { "id": "uuid", "type": "paragraph", "content": "..." },
    { "id": "uuid", "type": "list", "items": ["...", "..."] },
    { "id": "uuid", "type": "faq", "question": "...", "answer": "..." }
  ]
}
Types valides : heading, paragraph, callout, list, faq.
Pour heading : level (2 ou 3) + content.
Pour paragraph : content (texte riche, 100-200 mots).
Pour list : items (tableau de strings).
Pour callout : content (conseil ou info importante).
Pour faq : question + answer.
Génère 15-20 sections minimum pour un article complet et approfondi.`;

  const userGenerate = `Génère un article complet sur : "${article.title}"
Mot-clé focus : ${article.keyword}
Catégorie : ${article.category}
Public cible : lycéens, étudiants et jeunes professionnels en France cherchant des infos sur le BTS Biologie Médicale.
L'article doit être informatif, pratique, avec des données chiffrées, des exemples concrets et des conseils actionnables.`;

  const raw = await callClaude(systemGenerate, userGenerate);
  return parseJSON(raw);
}

async function optimizeSEO(article, content) {
  const systemSEO = `Tu es un expert SEO. Optimise le contenu JSON fourni pour atteindre un score SEO de 80+.
Réponds UNIQUEMENT en JSON valide avec la même structure (metaTitle, metaDescription, sections).`;
  const userSEO = `Article : "${article.title}" — Mot-clé : ${article.keyword}
Optimise ce contenu pour le SEO (mot-clé dans le titre H1, meta, premier paragraphe, sous-titres) :
${JSON.stringify(content)}`;
  const raw = await callClaude(systemSEO, userSEO);
  return parseJSON(raw);
}

async function optimizeGEO(article, content) {
  const systemGEO = `Tu es un expert GEO (Generative Engine Optimization). Optimise le contenu pour les IA comme ChatGPT, Perplexity, Google SGE.
Réponds UNIQUEMENT en JSON valide avec la même structure.`;
  const userGEO = `Article : "${article.title}"
Ajoute : définitions claires, listes structurées, FAQ enrichie, données chiffrées, réponses directes aux questions.
Contenu actuel : ${JSON.stringify(content)}`;
  const raw = await callClaude(systemGEO, userGEO);
  return parseJSON(raw);
}

async function humanize(article, content) {
  const systemHuman = `Tu es un expert en rédaction naturelle. Réécris le contenu pour qu'il semble écrit par un humain passionné.
Supprime tout style IA (formules génériques, transitions artificielles). Ajoute du vécu, des anecdotes, un ton authentique.
Réponds UNIQUEMENT en JSON valide avec la même structure.`;
  const userHuman = `Article : "${article.title}"
Humanise ce contenu, rends-le naturel et engageant : ${JSON.stringify(content)}`;
  const raw = await callClaude(systemHuman, userHuman);
  return parseJSON(raw);
}

function estimateReadTime(sections) {
  const words = sections.reduce((acc, s) => {
    if (s.content) return acc + s.content.split(' ').length;
    if (s.items) return acc + s.items.join(' ').split(' ').length;
    if (s.answer) return acc + s.answer.split(' ').length;
    return acc;
  }, 0);
  return `${Math.max(3, Math.round(words / 200))} min`;
}

async function processArticle(article, index, total) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📄 [${index}/${total}] ${article.title}`);
  const parisTime = new Date(article.scheduledAt).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  console.log(`⏰  Programmé : ${parisTime.replace(',', '')}`);

  // Check si slug déjà en base
  const { data: existing } = await supabase.from('linova_articles').select('id').eq('slug', article.slug).single();
  if (existing) {
    console.log(`  ⏭️  Déjà existant — ignoré`);
    return { skipped: true };
  }

  try {
    console.log('  🤖 Génération...');
    let content = await generateArticle(article);
    await sleep(3000);

    console.log('  🔍 Optimisation SEO...');
    content = await optimizeSEO(article, content);
    await sleep(3000);

    console.log('  🌐 Optimisation GEO...');
    content = await optimizeGEO(article, content);
    await sleep(3000);

    console.log('  ✍️  Humanisation...');
    content = await humanize(article, content);

    console.log('  💾 Sauvegarde Supabase...');
    const { data, error } = await supabase.from('linova_articles').insert({
      slug: article.slug,
      title: article.title,
      meta_title: content.metaTitle || article.title,
      meta_description: content.metaDescription || '',
      excerpt: content.excerpt || '',
      category: article.category,
      focus_keyword: article.keyword,
      sections: content.sections || [],
      read_time: estimateReadTime(content.sections || []),
      status: 'scheduled',
      scheduled_at: article.scheduledAt,
      source: 'auto',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).select('id').single();

    if (error) throw new Error(error.message);
    console.log(`  ✅ Sauvegardé ! ID : ${data.id} — Slug : ${article.slug}`);
    return { success: true };
  } catch (err) {
    console.log(`  ❌ Erreur : ${err.message}`);
    return { error: err.message };
  }
}

async function main() {
  console.log('🔄 Linova — Relance des 5 articles échoués\n');

  let success = 0, skipped = 0, failed = 0;

  for (let i = 0; i < FAILED_ARTICLES.length; i++) {
    const result = await processArticle(FAILED_ARTICLES[i], i + 1, FAILED_ARTICLES.length);
    if (result.success) success++;
    else if (result.skipped) skipped++;
    else failed++;

    if (i < FAILED_ARTICLES.length - 1) {
      console.log('\n⏳ Pause 10 secondes...');
      await sleep(10000);
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🎉 Terminé !`);
  console.log(`   ✅ Générés : ${success}`);
  console.log(`   ⏭️  Ignorés : ${skipped}`);
  console.log(`   ❌ Échecs  : ${failed}`);
}

main().catch(console.error);
