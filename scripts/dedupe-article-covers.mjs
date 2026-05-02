/**
 * Dédoublonne les cover_image_url des articles publiés.
 *
 * 1. Charge tous les articles publiés (DB) + leurs IDs photos Unsplash
 * 2. Charge les IDs photos utilisés par les articles statiques (hardcodés dans
 *    src/app/blog/page.tsx — on les liste ici en dur, sync manuelle)
 * 3. Pour chaque article dynamique en collision (avec un autre dynamique ou
 *    avec un statique), refetch une nouvelle photo Unsplash en excluant
 *    explicitement les IDs déjà utilisés (on tape jusqu'à 5 résultats puis
 *    élargit la requête)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = {};
for (const line of readFileSync(resolve(__dirname, '../.env.local'), 'utf-8').split('\n')) {
  const i = line.indexOf('=');
  if (i === -1 || line.trim().startsWith('#')) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/s, '$1');
}
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const UNSPLASH_KEY = env.UNSPLASH_ACCESS_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY || !UNSPLASH_KEY) {
  console.error('Variables manquantes (Supabase ou Unsplash)');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// IDs photos utilisés par les articles statiques (sync manuelle avec page.tsx)
const STATIC_PHOTO_IDS = new Set([
  'photo-1631556760646-50241850eb25',
  'photo-1596978759889-91e1a654faca',
  'photo-1631816290961-733476b453f3',
  'photo-1733119883210-04f09d5f86df',
  'photo-1716833323097-626f97a4dfc7',
  'photo-1580377968562-5f0225d15785',
  'photo-1732690233982-1d4567384ea1',
  'photo-1576670262660-05cf76d53da3',
  'photo-1758685848544-625ddba413e4',
  'photo-1771946309002-80d0d41affa7',
  'photo-1776039325185-8fd3d46af4e6',
  'photo-1630959305790-4c956ce6c0b6',
  'photo-1618053448701-5220304dc9ae',
  'photo-1650632989475-5da50879fb50',
  'photo-1762330474636-637ce87b268b',
  'photo-1731983568664-9c1d8a87e7a2',
  'photo-1657581443324-eafb54f644d6',
]);

function extractPhotoId(url) {
  if (!url) return null;
  const m = url.match(/\/photo-([a-z0-9-]+)/i);
  return m ? `photo-${m[1]}` : null;
}

async function searchUnsplash(query, excludeIds, perPage = 30) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('content_filter', 'high');
  const r = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } });
  if (!r.ok) {
    console.warn(`  ⚠️  Unsplash ${r.status}: ${await r.text()}`);
    return null;
  }
  const data = await r.json();
  if (!data.results?.length) return null;

  // Filtre les IDs déjà utilisés
  const candidates = data.results.filter((p) => !excludeIds.has(extractPhotoId(p.urls.regular)));
  if (!candidates.length) return null;

  const photo = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    url: `${photo.urls.regular}&utm_source=linova_education&utm_medium=referral`,
    credit: `Photo de ${photo.user.name} sur Unsplash (${photo.user.links.html}?utm_source=linova_education&utm_medium=referral)`,
    photoId: extractPhotoId(photo.urls.regular),
  };
}

function buildQueries({ focus_keyword, category, title }) {
  const queries = [];
  if (focus_keyword) {
    queries.push(`${focus_keyword} medical laboratory`);
    queries.push(focus_keyword);
  }
  if (title) {
    const cleaned = title.replace(/[?!:.,]/g, '').trim();
    queries.push(cleaned.split(/\s+/).slice(0, 4).join(' ') + ' laboratory');
  }
  if (category) {
    const lower = category.toLowerCase();
    if (lower.includes('formation')) queries.push('students medical lab');
    else if (lower.includes('alternance')) queries.push('apprenticeship medical lab');
    else if (lower.includes('métier') || lower.includes('metier')) queries.push('medical lab technician');
  }
  // Fallbacks variés
  queries.push('biology research lab', 'medical laboratory equipment', 'lab scientist work', 'laboratory glassware', 'medical analysis lab', 'science research equipment');
  return queries;
}

async function findUniqueCover(article, excludeIds) {
  const queries = buildQueries(article);
  for (const q of queries) {
    const cover = await searchUnsplash(q, excludeIds);
    if (cover) return cover;
    await new Promise((r) => setTimeout(r, 800));
  }
  return null;
}

async function main() {
  console.log('🔍 Chargement articles publiés...');
  const { data: articles, error } = await supabase
    .from('linova_articles')
    .select('id, slug, title, focus_keyword, category, cover_image_url')
    .eq('status', 'published');

  if (error) {
    console.error('❌', error.message);
    process.exit(1);
  }

  // Compte les IDs utilisés (statiques + dynamiques)
  const idCount = new Map();
  for (const id of STATIC_PHOTO_IDS) idCount.set(id, (idCount.get(id) || 0) + 1);
  for (const a of articles) {
    const id = extractPhotoId(a.cover_image_url);
    if (id) idCount.set(id, (idCount.get(id) || 0) + 1);
  }

  // Articles à ré-assigner : ceux dont l'ID est déjà utilisé ailleurs
  // (i.e. count > 1, ou si l'ID est dans static)
  const toReassign = articles.filter((a) => {
    const id = extractPhotoId(a.cover_image_url);
    if (!id) return true; // pas de cover → réassigne
    return STATIC_PHOTO_IDS.has(id) || idCount.get(id) > 1;
  });

  console.log(`${toReassign.length} articles avec cover en collision.\n`);

  const usedIds = new Set([...STATIC_PHOTO_IDS]);
  // Marque comme utilisés les articles QUI N'ONT PAS de collision (ils gardent leur cover)
  for (const a of articles) {
    const id = extractPhotoId(a.cover_image_url);
    if (id && !STATIC_PHOTO_IDS.has(id) && idCount.get(id) === 1) {
      usedIds.add(id);
    }
  }

  let success = 0;
  let failed = 0;
  for (const article of toReassign) {
    console.log(`📄 ${article.slug}`);
    const cover = await findUniqueCover(article, usedIds);
    if (!cover) {
      console.log('  ❌ Aucune cover unique trouvée');
      failed++;
      continue;
    }

    const { error: upd } = await supabase
      .from('linova_articles')
      .update({ cover_image_url: cover.url, cover_image_credit: cover.credit })
      .eq('id', article.id);
    if (upd) {
      console.log(`  ❌ Update: ${upd.message}`);
      failed++;
    } else {
      usedIds.add(cover.photoId);
      console.log(`  ✅ ${cover.photoId}`);
      success++;
    }
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
