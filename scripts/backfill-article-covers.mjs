/**
 * Backfill — assigne une cover Unsplash aux articles existants qui n'en ont pas.
 *
 * Exécution : node scripts/backfill-article-covers.mjs
 *
 * Variables requises dans .env.local :
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - UNSPLASH_ACCESS_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envLines = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8').split('\n');
const env = {};
for (const line of envLines) {
  const idx = line.indexOf('=');
  if (idx === -1 || line.trim().startsWith('#')) continue;
  env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^"(.*)"$/s, '$1');
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const UNSPLASH_KEY = env.UNSPLASH_ACCESS_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Variables Supabase manquantes');
  process.exit(1);
}
if (!UNSPLASH_KEY) {
  console.error('UNSPLASH_ACCESS_KEY manquante dans .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function searchUnsplash(query) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('per_page', '5');
  url.searchParams.set('content_filter', 'high');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}`, 'Accept-Version': 'v1' },
  });
  if (!res.ok) {
    console.warn(`  ⚠️  Unsplash ${res.status}: ${await res.text()}`);
    return null;
  }
  const data = await res.json();
  if (!data.results?.length) return null;
  const photo = data.results[Math.floor(Math.random() * data.results.length)];
  return {
    url: `${photo.urls.regular}&utm_source=linova_education&utm_medium=referral`,
    credit: `Photo de ${photo.user.name} sur Unsplash (${photo.user.links.html}?utm_source=linova_education&utm_medium=referral)`,
  };
}

async function findCover({ focusKeyword, category, title }) {
  const queries = [
    `${focusKeyword} medical laboratory`,
    focusKeyword,
    title?.split(/\s+/).slice(0, 4).join(' ') + ' laboratory',
    'medical laboratory microscope',
  ].filter(Boolean);

  for (const q of queries) {
    const cover = await searchUnsplash(q);
    if (cover) return cover;
    await new Promise((r) => setTimeout(r, 800)); // rate limit safety
  }
  return null;
}

async function main() {
  console.log('🔍 Récupération des articles sans cover...');
  const { data: articles, error } = await supabase
    .from('linova_articles')
    .select('id, slug, title, focus_keyword, category')
    .is('cover_image_url', null)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Erreur Supabase:', error.message);
    process.exit(1);
  }
  if (!articles?.length) {
    console.log('Aucun article sans cover. Rien à faire.');
    return;
  }

  console.log(`${articles.length} articles à mettre à jour.\n`);
  let success = 0;
  let failed = 0;

  for (const article of articles) {
    console.log(`📄 ${article.slug}`);
    const cover = await findCover({
      focusKeyword: article.focus_keyword,
      category: article.category,
      title: article.title,
    });

    if (!cover) {
      console.log('  ❌ Aucune cover trouvée');
      failed++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('linova_articles')
      .update({
        cover_image_url: cover.url,
        cover_image_credit: cover.credit,
      })
      .eq('id', article.id);

    if (updateError) {
      console.log(`  ❌ Update error: ${updateError.message}`);
      failed++;
    } else {
      console.log(`  ✅ Cover assignée`);
      success++;
    }

    // Pause anti rate-limit (50 req/h = 1 req toutes les 72s en pic, mais on est large)
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n──────────────────────────`);
  console.log(`✅ Succès : ${success}`);
  console.log(`❌ Échecs : ${failed}`);
}

main().catch((err) => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
