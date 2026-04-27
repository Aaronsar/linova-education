/**
 * Génère une image de couverture SVG unique par slug d'article.
 *
 * Chaque slug produit déterministiquement :
 * - Une palette de 2 couleurs (gradient)
 * - Un motif décoratif (cercles aux positions hash-driven)
 * - Une "monogram" basée sur les initiales du titre
 *
 * Les couleurs sont choisies dans la palette Linova (teal/navy/yellow/beige).
 * Le SVG est encodé en data URI pour pouvoir être passé à <img src>.
 */

interface CoverOptions {
  slug: string;
  title: string;
  category?: string;
}

// Palette Linova (teints navy/teal/yellow/beige)
const PALETTES: Array<{ from: string; to: string; accent: string; ink: string }> = [
  { from: '#0F2542', to: '#2C7A7B', accent: '#FFD93D', ink: '#FFFFFF' }, // navy → teal
  { from: '#2C7A7B', to: '#0F2542', accent: '#F2E2C4', ink: '#FFFFFF' }, // teal → navy
  { from: '#1A4A4A', to: '#5BB5A8', accent: '#FFD93D', ink: '#FFFFFF' }, // teal foncé → teal clair
  { from: '#0F2542', to: '#3D5C7C', accent: '#5BB5A8', ink: '#FFFFFF' }, // navy → navy clair
  { from: '#5BB5A8', to: '#0F2542', accent: '#FFD93D', ink: '#FFFFFF' }, // teal clair → navy
  { from: '#FFD93D', to: '#0F2542', accent: '#FFFFFF', ink: '#0F2542' }, // yellow → navy (ink dark)
  { from: '#F2E2C4', to: '#2C7A7B', accent: '#0F2542', ink: '#0F2542' }, // beige → teal (ink dark)
  { from: '#3D5C7C', to: '#0F2542', accent: '#5BB5A8', ink: '#FFFFFF' }, // bleu → navy
  { from: '#2C7A7B', to: '#5BB5A8', accent: '#FFD93D', ink: '#FFFFFF' }, // teal duo
  { from: '#0F2542', to: '#1A4A4A', accent: '#F2E2C4', ink: '#FFFFFF' }, // navy → teal foncé
];

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function initials(title: string): string {
  const cleaned = title
    .replace(/[«»"'(),.?!:;]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(
    (w) => w.length > 2 && !['les', 'des', 'pour', 'avec', 'dans', 'une', 'sur', 'aux'].includes(w.toLowerCase())
  );
  const first = words[0]?.[0] || 'L';
  const second = words[1]?.[0] || words[0]?.[1] || 'I';
  return (first + second).toUpperCase();
}

/**
 * Génère un SVG complet (data URI) — image de couverture brandée.
 * Format 1600×900 pour qu'on conserve une bonne qualité en grande taille.
 */
export function generateArticleCover({ slug, title, category }: CoverOptions): string {
  const h = hash(slug);
  const palette = PALETTES[h % PALETTES.length];
  const mono = initials(title);

  // Positions pseudo-aléatoires des cercles décoratifs
  const c1x = 100 + (h % 600);
  const c1y = 100 + ((h >> 3) % 400);
  const c1r = 220 + ((h >> 5) % 180);
  const c2x = 900 + ((h >> 7) % 500);
  const c2y = 200 + ((h >> 9) % 500);
  const c2r = 180 + ((h >> 11) % 200);
  const c3x = 200 + ((h >> 13) % 1100);
  const c3y = 600 + ((h >> 15) % 250);
  const c3r = 120 + ((h >> 17) % 140);

  // Angle du gradient varié selon le hash
  const angle = (h % 90) + 45; // 45° à 135°

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${palette.from}"/>
      <stop offset="100%" stop-color="${palette.to}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <g opacity="0.18">
    <circle cx="${c1x}" cy="${c1y}" r="${c1r}" fill="${palette.accent}"/>
    <circle cx="${c2x}" cy="${c2y}" r="${c2r}" fill="${palette.ink}"/>
    <circle cx="${c3x}" cy="${c3y}" r="${c3r}" fill="${palette.accent}"/>
  </g>
  <g opacity="0.08">
    <circle cx="${(c1x + 800) % 1600}" cy="${(c1y + 400) % 900}" r="${c1r * 0.6}" fill="${palette.ink}"/>
    <circle cx="${(c2x + 600) % 1600}" cy="${(c2y + 300) % 900}" r="${c2r * 0.7}" fill="${palette.accent}"/>
  </g>
  <text x="80" y="220" font-family="Outfit, system-ui, sans-serif" font-weight="800" font-size="280" fill="${palette.ink}" opacity="0.95">${mono}</text>
  <rect x="80" y="260" width="120" height="6" fill="${palette.accent}" rx="3"/>
  ${category ? `<text x="80" y="780" font-family="Outfit, system-ui, sans-serif" font-weight="600" font-size="36" fill="${palette.ink}" opacity="0.85" letter-spacing="2">${escapeXml(category.toUpperCase())}</text>` : ''}
  <text x="80" y="840" font-family="Outfit, system-ui, sans-serif" font-weight="700" font-size="42" fill="${palette.accent}" letter-spacing="3">LINOVA</text>
</svg>`;

  // data: URI (UTF-8 SVG sans base64, plus léger)
  const encoded = encodeURIComponent(svg).replace(/%20/g, ' ');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
}
