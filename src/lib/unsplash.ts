/**
 * Recherche d'images sur Unsplash pour les couvertures d'articles.
 *
 * Utilise l'endpoint /search/photos pour récupérer une photo libre de droits
 * pertinente vis-à-vis du titre/mot-clé de l'article.
 *
 * Documentation : https://unsplash.com/documentation#search-photos
 * Tier gratuit : 50 requêtes/h (suffisant pour 1 article/jour).
 *
 * Variable d'environnement requise : UNSPLASH_ACCESS_KEY
 */

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string; // ~1080px (idéal pour cover blog)
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    links: { html: string };
  };
  alt_description?: string | null;
  description?: string | null;
}

export interface CoverImage {
  url: string;
  credit: string;
}

/**
 * Recherche la 1re photo paysage pertinente sur Unsplash.
 * Retourne null si aucun résultat ou si la clé API est absente.
 */
export async function searchUnsplashCover(query: string): Promise<CoverImage | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn('[unsplash] UNSPLASH_ACCESS_KEY missing');
    return null;
  }

  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('per_page', '5');
  url.searchParams.set('content_filter', 'high');

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        'Accept-Version': 'v1',
      },
    });
    if (!res.ok) {
      console.warn('[unsplash] Search failed:', res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as UnsplashSearchResponse;
    if (!data.results || data.results.length === 0) return null;

    // Prend une photo aléatoirement parmi les top 5 pour varier d'un appel à l'autre
    const photo = data.results[Math.floor(Math.random() * data.results.length)];
    return {
      url: `${photo.urls.regular}&utm_source=linova_education&utm_medium=referral`,
      credit: `Photo de ${photo.user.name} sur Unsplash (${photo.user.links.html}?utm_source=linova_education&utm_medium=referral)`,
    };
  } catch (err) {
    console.warn('[unsplash] Network error:', err);
    return null;
  }
}

/**
 * Pipeline de recherche avec plusieurs requêtes en cascade :
 * on essaie d'abord le mot-clé spécifique, puis des termes plus génériques.
 */
export async function findArticleCover(opts: {
  focusKeyword: string;
  category?: string;
  title?: string;
}): Promise<CoverImage | null> {
  const queries = buildSearchQueries(opts);
  for (const q of queries) {
    const cover = await searchUnsplashCover(q);
    if (cover) return cover;
  }
  return null;
}

function buildSearchQueries({
  focusKeyword,
  category,
  title,
}: {
  focusKeyword: string;
  category?: string;
  title?: string;
}): string[] {
  const queries: string[] = [];

  // 1. Mot-clé enrichi avec contexte labo médical
  queries.push(`${focusKeyword} medical laboratory`);

  // 2. Mot-clé seul
  queries.push(focusKeyword);

  // 3. Premiers mots du titre
  if (title) {
    const cleaned = title.replace(/[?!:.,]/g, '').trim();
    const firstWords = cleaned.split(/\s+/).slice(0, 4).join(' ');
    queries.push(`${firstWords} laboratory`);
  }

  // 4. Fallback par catégorie
  if (category) {
    const lower = category.toLowerCase();
    if (lower.includes('formation')) queries.push('students laboratory science');
    else if (lower.includes('alternance')) queries.push('apprenticeship medical lab');
    else if (lower.includes('métier') || lower.includes('metier')) queries.push('medical lab technician');
    else queries.push('medical laboratory');
  }

  // 5. Fallback ultime générique
  queries.push('medical laboratory microscope');
  queries.push('biology research lab');

  return queries;
}
