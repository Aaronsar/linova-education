/**
 * Linova — Génération automatique des 20 articles programmés
 * Exécuter : node scripts/generate-all-articles.mjs
 *
 * → Génère chaque article avec Claude (generate → SEO → GEO → Humanise)
 * → Enregistre en Supabase avec statut "scheduled"
 * → 1 article par jour du 17 avril au 6 mai 2026
 * → Heure aléatoire entre 7h00 et 8h59 (heure de Paris), jamais identique
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ─── Charger .env.local ──────────────────────────────────────────────────────
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

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Variables manquantes dans .env.local');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Liste des 20 articles (ordre de priorité = ordre de publication) ────────
const ARTICLES = [
  { id: 1,  title: "BTS Biologie Médicale en alternance : tout ce qu'il faut savoir",             keyword: 'bts biologie médicale alternance',          category: 'Alternance', slug: 'bts-biologie-medicale-alternance' },
  { id: 2,  title: "BTS Biologie Médicale Paris : les meilleures écoles en 2025",                 keyword: 'bts biologie médicale paris',                category: 'Formation',  slug: 'bts-biologie-medicale-paris' },
  { id: 3,  title: "BTS Biologie Médicale sur Parcoursup : comment candidater ?",                 keyword: 'bts biologie médicale parcoursup',           category: 'Formation',  slug: 'bts-biologie-medicale-parcoursup' },
  { id: 4,  title: "Débouchés du BTS Biologie Médicale : métiers et salaires",                    keyword: 'débouchés bts biologie médicale',            category: 'Formation',  slug: 'debouches-bts-biologie-medicale' },
  { id: 5,  title: "Après un BTS Biologie Médicale : poursuites d'études possibles",              keyword: 'poursuite études bts biologie médicale',     category: 'Formation',  slug: 'poursuite-etudes-bts-biologie-medicale' },
  { id: 6,  title: "Comment trouver une alternance en biologie médicale ?",                       keyword: 'alternance biologie médicale',               category: 'Alternance', slug: 'trouver-alternance-biologie-medicale' },
  { id: 7,  title: "Financement du BTS Biologie Médicale en alternance : OPCO, CPF…",             keyword: 'financement bts biologie médicale',          category: 'Alternance', slug: 'financement-bts-biologie-medicale' },
  { id: 8,  title: "BTS Biologie Médicale est-il difficile ? Niveau et matières",                 keyword: 'bts biologie médicale difficile',            category: 'Formation',  slug: 'bts-biologie-medicale-difficile' },
  { id: 9,  title: "Technicien en immunologie : missions, salaire et formation",                   keyword: 'technicien immunologie',                     category: 'Métiers',    slug: 'technicien-immunologie' },
  { id: 10, title: "Technicien en génétique médicale : un métier d'avenir",                       keyword: 'technicien génétique médicale',              category: 'Métiers',    slug: 'technicien-genetique-medicale' },
  { id: 11, title: "Technicien en parasitologie-mycologie : rôle et formation",                   keyword: 'technicien parasitologie',                   category: 'Métiers',    slug: 'technicien-parasitologie' },
  { id: 12, title: "Journée type d'un technicien de biologie médicale",                           keyword: 'journée technicien biologie médicale',       category: 'Métiers',    slug: 'journee-type-technicien-biologie-medicale' },
  { id: 13, title: "BTS Biologie Médicale ou BTS Analyses de Biologie Médicale ?",               keyword: 'bts analyses biologie médicale',             category: 'Formation',  slug: 'bts-biologie-medicale-ou-analyses' },
  { id: 14, title: "BTS Biologie Médicale après un Bac STL : le guide complet",                   keyword: 'bts biologie médicale bac stl',              category: 'Formation',  slug: 'bts-biologie-medicale-bac-stl' },
  { id: 15, title: "Quel bac pour faire un BTS Biologie Médicale ?",                              keyword: 'bac pour bts biologie médicale',             category: 'Formation',  slug: 'quel-bac-bts-biologie-medicale' },
  { id: 16, title: "Technicien en laboratoire d'analyses médicales : statut et convention collective", keyword: 'convention collective laboratoire médical', category: 'Métiers', slug: 'convention-collective-laboratoire-medical' },
  { id: 17, title: "Travailler dans un laboratoire de ville : le quotidien du technicien",        keyword: 'technicien laboratoire ville',               category: 'Métiers',    slug: 'technicien-laboratoire-ville' },
  { id: 18, title: "Technicien en biochimie médicale : spécialités et débouchés",                 keyword: 'technicien biochimie médicale',              category: 'Métiers',    slug: 'technicien-biochimie-medicale' },
  { id: 19, title: "Le BTS Biologie Médicale en apprentissage : avantages et témoignages",        keyword: 'bts biologie médicale apprentissage',        category: 'Alternance', slug: 'bts-biologie-medicale-apprentissage' },
  { id: 20, title: "Technicien hospitalier en biologie médicale : carrière à l'hôpital",          keyword: 'technicien hospitalier biologie médicale',  category: 'Métiers',    slug: 'technicien-hospitalier-biologie-medicale' },
];

// ─── Dates de publication (17 avril → 6 mai 2026, 7h-9h Paris = 5h-7h UTC) ──
// On génère 20 heures uniques aléatoires dans [7h00, 8h59] Paris = [5h00, 6h59] UTC
function generatePublishDates(startDate, count) {
  const usedMinutes = new Set();
  const dates = [];

  for (let i = 0; i < count; i++) {
    const day = new Date(startDate);
    day.setDate(day.getDate() + i);

    // Heure unique : 0–119 minutes après 5h00 UTC (= 7h00 Paris CEST)
    let totalMinutes;
    do {
      totalMinutes = Math.floor(Math.random() * 120); // 0 à 119 minutes
    } while (usedMinutes.has(totalMinutes));
    usedMinutes.add(totalMinutes);

    const hours = 5 + Math.floor(totalMinutes / 60);   // 5 ou 6 UTC
    const minutes = totalMinutes % 60;

    day.setUTCHours(hours, minutes, 0, 0);
    dates.push(day.toISOString());
  }
  return dates;
}

// ─── Prompts ──────────────────────────────────────────────────────────────────
const INTERNAL_LINKS = `
- <a href="/formations/bts-biologie-medicale">BTS Biologie Médicale</a>
- <a href="/formations/bts-biologie-medicale">notre formation en biologie médicale</a>
- <a href="/formations/bts-biologie-medicale">BTS Biologie Médicale à Paris</a>
- <a href="/infos-pratiques/admission">candidater à Linova</a>
- <a href="/infos-pratiques/tarifs">tarifs et financement</a>
- <a href="/infos-pratiques/tarifs">financement OPCO</a>
- <a href="/infos-pratiques/campus">notre campus parisien</a>
- <a href="/ecole/pourquoi-linova">pourquoi choisir Linova</a>
- <a href="/ecole/qualiopi">certification Qualiopi</a>
- <a href="/entreprises">nos entreprises partenaires</a>
- <a href="/blog/technicien-laboratoire-medical">technicien de laboratoire médical</a>
- <a href="/blog/preleveur-laboratoire">préleveur de laboratoire</a>
- <a href="/blog/technicien-microbiologie">technicien en microbiologie</a>
- <a href="/blog/technicien-hematologie">technicien en hématologie</a>
- <a href="/blog/technicien-anatomopathologie">technicien en anatomopathologie</a>
- <a href="/blog/salaire-bts-biologie-medicale">salaire d'un diplômé BTS Biologie Médicale</a>
- <a href="/blog/stage-bts-biologie-medicale">stage en BTS Biologie Médicale</a>
- <a href="/blog/programme-bts-biologie-medicale">programme du BTS Biologie Médicale</a>
- <a href="/blog/inscription-bts-biologie-medicale">s'inscrire en BTS Biologie Médicale</a>
- <a href="/blog/bts-biologie-medicale-ou-licence">BTS ou licence en biologie médicale</a>
`;

const generatePrompt = (title, keyword, category) => `
Tu es un expert en rédaction SEO/GEO pour Linova Éducation, école parisienne BTS Biologie Médicale.

SUJET : "${title}"
MOT-CLÉ : "${keyword}"
CATÉGORIE : ${category}

CONTEXTE : BTS Biologie Médicale (RNCP 40027), 2 ans, Paris. Alternance disponible : 0€ via OPCO. Certification Qualiopi.

LIENS INTERNES OBLIGATOIRES (min 8) :
${INTERNAL_LINKS}

EXIGENCES :
- 7-8 H2, 2-3 H3, min 1000 mots
- 1 FAQ (6 questions), 2 callouts, 2 listes, 1 lien externe
- Données chiffrées (€, %, durées)
- Au moins 1 H2 sous forme de question
- Ton : expert accessible, jamais "il est important de noter"

FORMAT JSON UNIQUEMENT :
{"title":"...","slug":"...","metaTitle":"50-60 car. avec mot-clé | Linova","metaDescription":"150-160 car. avec mot-clé","excerpt":"1-2 phrases","readTime":"X min","sections":[{"id":"s1","type":"heading","level":"h2","content":"..."},{"id":"s2","type":"paragraph","content":"... <a href='/formations/bts-biologie-medicale'>lien</a> ..."},{"id":"s3","type":"callout","variant":"info","content":"..."},{"id":"s4","type":"list","items":["...","..."]},{"id":"s5","type":"faq","questions":[{"question":"...?","answer":"..."}]}]}
`;

const seoPrompt = (title, keyword, current, failedChecks) => `
Tu es expert SEO. Corrige TOUS ces points et atteins SEO 80+.

ARTICLE : "${title}" | MOT-CLÉ : "${keyword}"

POINTS À CORRIGER :
${failedChecks || 'Optimiser globalement'}

RÈGLES :
1. Méta-titre : ${keyword} présent, 50-60 car., finir par "| Linova"
2. Méta-description : ${keyword} présent, 140-160 car., appel à l'action
3. Min 5 liens internes <a href="..."> dans les paragraphes
4. Densité mot-clé : 0.5%-2.5%
5. Min 600 mots, min 4 H2, min 2 H3

LIENS DISPONIBLES :${INTERNAL_LINKS}

CONTENU ACTUEL :
Méta-titre : "${current.metaTitle}"
Méta-description : "${current.metaDescription}"
Sections : ${JSON.stringify(current.sections)}

Réponds UNIQUEMENT JSON : {"metaTitle":"...","metaDescription":"...","sections":[...]}
`;

const geoPrompt = (title, keyword, current, failedChecks) => `
Tu es expert GEO (Google SGE, ChatGPT, Perplexity).

ARTICLE : "${title}" | MOT-CLÉ : "${keyword}"

POINTS À CORRIGER :
${failedChecks || 'Optimiser pour les moteurs IA'}

RÈGLES :
1. FAQ : 6 questions min, réponses 200+ mots, liens internes dans 2 réponses
2. H2 en questions : au moins 2 titres sous forme de question
3. Données chiffrées dans chaque section (€, %, durées)
4. Premier paragraphe = définition directe "[Sujet] est/désigne..."
5. Min 2 callouts (conseil + info), min 3 listes

LIENS :${INTERNAL_LINKS}

CONTENU ACTUEL :
${JSON.stringify(current.sections)}

Réponds UNIQUEMENT JSON : {"metaTitle":"...","metaDescription":"...","sections":[...]}
`;

const humanizePrompt = (title, current) => `
Tu es un rédacteur humain expert. Rends ce texte naturel et vivant.

ARTICLE : "${title}"

RÈGLES :
- Supprimer : "il est important de noter", "en conclusion", "à l'ère de", "il convient de", "nous pouvons voir que"
- Ajouter : "Imaginez...", "En pratique...", exemples concrets du quotidien du labo
- Varier longueur des phrases (courtes 5 mots + longues 25 mots)
- Questions rhétoriques : "Mais alors, comment..."
- Conserver ABSOLUMENT tous les liens <a href="..."> et données chiffrées
- Ton : professeur passionné, pas brochure corporate

CONTENU :
${JSON.stringify(current.sections)}

Réponds UNIQUEMENT JSON : {"sections":[...]}
`;

// ─── Appel Claude ─────────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const msg = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  });

  let text = msg.content[0].text.trim();
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) text = match[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
  return JSON.parse(text);
}

// ─── Analyse SEO basique pour extraire les points échoués ────────────────────
function getFailedChecks(title, keyword, content) {
  const text = content.sections
    .map(s => {
      let t = '';
      if (s.content) t += s.content.replace(/<[^>]+>/g, ' ');
      if (s.items) t += ' ' + s.items.join(' ');
      if (s.questions) s.questions.forEach(q => { t += ' ' + q.question + ' ' + q.answer; });
      return t;
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = text.split(/\s+/).filter(Boolean).length;
  const kw = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalizedText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const kwCount = normalizedText.split(/\s+/).filter(w => w.includes(kw.split(' ')[0])).length;
  const density = words > 0 ? (kwCount / words) * 100 : 0;
  const h2Count = content.sections.filter(s => s.type === 'heading' && s.level === 'h2').length;
  const h3Count = content.sections.filter(s => s.type === 'heading' && s.level === 'h3').length;
  const faqCount = content.sections.find(s => s.type === 'faq')?.questions?.length || 0;
  const internalLinks = (JSON.stringify(content.sections).match(/href="\/[^"]+"/g) || []).length;

  const metaTitleLen = (content.metaTitle || '').length;
  const metaDescLen = (content.metaDescription || '').length;
  const metaTitleLower = (content.metaTitle || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const metaDescLower = (content.metaDescription || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const titleLower = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const checks = [];
  if (!metaTitleLower.includes(kw.split(' ')[0])) checks.push('- Mot-clé absent du méta-titre');
  if (metaTitleLen < 50 || metaTitleLen > 60) checks.push(`- Méta-titre : ${metaTitleLen} car. (cible 50-60)`);
  if (!metaDescLower.includes(kw.split(' ')[0])) checks.push('- Mot-clé absent de la méta-description');
  if (metaDescLen < 140 || metaDescLen > 160) checks.push(`- Méta-description : ${metaDescLen} car. (cible 140-160)`);
  if (!titleLower.includes(kw.split(' ')[0])) checks.push('- Mot-clé absent du titre H1');
  if (words < 600) checks.push(`- Seulement ${words} mots (min 600)`);
  if (density < 0.5 || density > 2.5) checks.push(`- Densité mot-clé : ${density.toFixed(1)}% (cible 0.5-2.5%)`);
  if (h2Count < 4) checks.push(`- ${h2Count} H2 (min 4)`);
  if (h3Count < 2) checks.push(`- ${h3Count} H3 (min 2)`);
  if (internalLinks < 3) checks.push(`- ${internalLinks} lien(s) interne(s) (min 3)`);
  if (faqCount < 5) checks.push(`- FAQ : ${faqCount} question(s) (min 5)`);
  if (!content.sections.some(s => s.type === 'list')) checks.push('- Pas de liste à puces');
  if (!content.sections.some(s => s.type === 'callout')) checks.push('- Pas de callout');

  return checks.join('\n');
}

// ─── Estimer le temps de lecture ─────────────────────────────────────────────
function estimateReadTime(sections) {
  let text = '';
  for (const s of sections) {
    if (s.content) text += ' ' + s.content.replace(/<[^>]+>/g, '');
    if (s.items) text += ' ' + s.items.join(' ');
    if (s.questions) s.questions.forEach(q => { text += ' ' + q.question + ' ' + q.answer; });
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

// ─── Pipeline complet pour un article ────────────────────────────────────────
async function processArticle(article, scheduledAt, index) {
  const { title, keyword, category, slug } = article;
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📄 [${index + 1}/20] ${title}`);
  console.log(`⏰  Programmé : ${new Date(scheduledAt).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })} (Paris)`);

  // Vérifier si le slug existe déjà
  const { data: existing } = await supabase
    .from('linova_articles')
    .select('id, status')
    .eq('slug', slug)
    .single();

  if (existing) {
    console.log(`⏭️  Déjà existant (${existing.status}) — ignoré`);
    return null;
  }

  let current;

  try {
    // Étape 1 : Génération
    console.log('  🤖 Génération...');
    const generated = await callClaude(generatePrompt(title, keyword, category));
    current = {
      metaTitle: generated.metaTitle || '',
      metaDescription: generated.metaDescription || '',
      sections: generated.sections || [],
      excerpt: generated.excerpt || '',
      readTime: generated.readTime || '7 min',
      slug: generated.slug || slug,
      title: generated.title || title,
    };
    await sleep(3000);

    // Étape 2 : SEO
    console.log('  🔍 Optimisation SEO...');
    const failedSEO = getFailedChecks(current.title, keyword, current);
    const seoResult = await callClaude(seoPrompt(current.title, keyword, current, failedSEO));
    current = merge(current, seoResult);
    await sleep(3000);

    // Étape 3 : GEO
    console.log('  🌐 Optimisation GEO...');
    const failedGEO = getFailedChecks(current.title, keyword, current);
    const geoResult = await callClaude(geoPrompt(current.title, keyword, current, failedGEO));
    current = merge(current, geoResult);
    await sleep(3000);

    // Étape 4 : Humanisation
    console.log('  ✍️  Humanisation...');
    const humanResult = await callClaude(humanizePrompt(current.title, current));
    if (humanResult.sections?.length) current.sections = humanResult.sections;
    await sleep(2000);

    // Étape 5 : Sauvegarde Supabase
    console.log('  💾 Sauvegarde Supabase...');
    const readTime = estimateReadTime(current.sections);

    const { data, error } = await supabase
      .from('linova_articles')
      .insert({
        slug: current.slug || slug,
        title: current.title,
        meta_title: current.metaTitle,
        meta_description: current.metaDescription,
        excerpt: current.excerpt,
        category: category,
        focus_keyword: keyword,
        sections: current.sections,
        read_time: readTime,
        seo_score: 0, // sera recalculé à l'affichage
        geo_score: 0,
        status: 'scheduled',
        source: 'ai_generated',
        scheduled_at: scheduledAt,
      })
      .select('id')
      .single();

    if (error) {
      console.error(`  ❌ Erreur Supabase : ${error.message}`);
      return null;
    }

    console.log(`  ✅ Sauvegardé ! ID : ${data.id} — Slug : ${current.slug || slug}`);
    return data.id;

  } catch (err) {
    console.error(`  ❌ Erreur : ${err.message}`);
    return null;
  }
}

function merge(current, result) {
  return {
    ...current,
    metaTitle: result.metaTitle || current.metaTitle,
    metaDescription: result.metaDescription || current.metaDescription,
    sections: result.sections?.length ? result.sections : current.sections,
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Linova — Génération des 20 articles programmés');
  console.log('═'.repeat(60));

  // Dates : du 17 avril au 6 mai 2026
  const startDate = new Date('2026-04-17T00:00:00Z');
  const publishDates = generatePublishDates(startDate, 20);

  console.log('\n📅 Planning de publication :');
  publishDates.forEach((date, i) => {
    const local = new Date(date).toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'short', timeStyle: 'short' });
    console.log(`   ${String(i + 1).padStart(2, '0')}. ${ARTICLES[i].slug.slice(0, 40).padEnd(40)} → ${local}`);
  });

  console.log('\nDémarrage dans 3 secondes...');
  await sleep(3000);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < ARTICLES.length; i++) {
    const result = await processArticle(ARTICLES[i], publishDates[i], i);
    if (result === null) {
      // Check if it was skipped (already exists) or failed
      const { data } = await supabase.from('linova_articles').select('id').eq('slug', ARTICLES[i].slug).single();
      if (data) skipped++;
      else failed++;
    } else {
      success++;
    }

    // Pause entre les articles pour éviter le rate limit
    if (i < ARTICLES.length - 1) {
      console.log(`\n⏳ Pause 10 secondes avant le prochain article...`);
      await sleep(10000);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 Terminé !');
  console.log(`   ✅ Générés et programmés : ${success}`);
  console.log(`   ⏭️  Ignorés (déjà existants) : ${skipped}`);
  console.log(`   ❌ Échecs : ${failed}`);
  console.log('\nLes articles seront publiés automatiquement par le cron Vercel.');
}

main().catch(err => {
  console.error('Erreur fatale :', err);
  process.exit(1);
});
