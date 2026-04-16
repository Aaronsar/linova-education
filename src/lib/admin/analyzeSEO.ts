// Moteur d'analyse SEO + GEO pour Linova Education

export interface SEOCheck {
  id: string;
  label: string;
  passed: boolean;
  message: string;
  category: 'basic' | 'content' | 'links' | 'geo';
}

export interface SEOAnalysis {
  seoScore: number;
  geoScore: number;
  checks: SEOCheck[];
}

export interface ArticleSection {
  id: string;
  type: 'heading' | 'paragraph' | 'callout' | 'list' | 'faq' | 'grid';
  content?: string;
  level?: 'h2' | 'h3';
  variant?: string;
  items?: string[];
  questions?: { question: string; answer: string }[];
  columns?: { title: string; description: string }[];
}

// --- Helpers ---

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function extractText(sections: ArticleSection[]): string {
  let text = '';
  for (const s of sections) {
    if (s.type === 'paragraph' || s.type === 'callout') {
      text += ' ' + stripHtml(s.content || '');
    }
    if (s.type === 'heading') {
      text += ' ' + (s.content || '');
    }
    if (s.type === 'list' && s.items) {
      text += ' ' + s.items.join(' ');
    }
    if (s.type === 'faq' && s.questions) {
      for (const q of s.questions) {
        text += ' ' + q.question + ' ' + q.answer;
      }
    }
  }
  return text.trim();
}

function extractLinks(sections: ArticleSection[]): { internal: number; external: number } {
  let internal = 0;
  let external = 0;
  const hrefRegex = /href="([^"]+)"/g;
  for (const s of sections) {
    const content = s.content || '';
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
      const href = match[1];
      if (href.startsWith('/') || href.includes('linova-education.fr')) {
        internal++;
      } else if (href.startsWith('http')) {
        external++;
      }
    }
  }
  return { internal, external };
}

function countH2s(sections: ArticleSection[]): number {
  return sections.filter(s => s.type === 'heading' && s.level === 'h2').length;
}

function countH3s(sections: ArticleSection[]): number {
  return sections.filter(s => s.type === 'heading' && s.level === 'h3').length;
}

function getFAQCount(sections: ArticleSection[]): number {
  const faqSection = sections.find(s => s.type === 'faq');
  return faqSection?.questions?.length || 0;
}

function hasLists(sections: ArticleSection[]): boolean {
  return sections.some(s => s.type === 'list' && s.items && s.items.length > 0);
}

function hasCallouts(sections: ArticleSection[]): boolean {
  return sections.some(s => s.type === 'callout');
}

function hasNumbers(text: string): boolean {
  // Checks for numbers like percentages, prices, years, salaries
  return /\d+[\s,.]?\d*\s*(€|%|ans?|mois|h\b|heures?|semaines?|RNCP|euros?)/i.test(text);
}

function hasQuestionH2(sections: ArticleSection[]): boolean {
  return sections.some(s => s.type === 'heading' && s.level === 'h2' && (s.content || '').includes('?'));
}

function hasDirectDefinition(text: string): boolean {
  return /\b(est|sont|désigne|se définit|consiste|correspond)\b/i.test(text);
}

function keywordDensity(text: string, keyword: string): number {
  if (!keyword) return 0;
  const normalizedText = normalize(text);
  const normalizedKw = normalize(keyword);
  const words = normalizedText.split(/\s+/);
  const count = words.filter(w => w.includes(normalizedKw)).length;
  return words.length > 0 ? (count / words.length) * 100 : 0;
}

// --- Main analyzer ---

export function analyzeSEO(params: {
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  focusKeyword: string;
  sections: ArticleSection[];
}): SEOAnalysis {
  const { title, metaTitle, metaDescription, slug, focusKeyword, sections } = params;

  const fullText = extractText(sections);
  const wordCount = countWords(fullText);
  const links = extractLinks(sections);
  const h2Count = countH2s(sections);
  const h3Count = countH3s(sections);
  const faqCount = getFAQCount(sections);
  const density = keywordDensity(fullText, focusKeyword);
  const normalizedKw = normalize(focusKeyword || '');
  const normalizedMeta = normalize(metaTitle || '');
  const normalizedDesc = normalize(metaDescription || '');
  const normalizedTitle = normalize(title || '');

  const checks: SEOCheck[] = [];

  // --- BASIC CHECKS ---
  checks.push({
    id: 'kw-in-meta-title',
    label: 'Mot-clé dans le méta-titre',
    passed: !!focusKeyword && normalizedMeta.includes(normalizedKw),
    message: focusKeyword
      ? normalizedMeta.includes(normalizedKw)
        ? 'Présent dans le méta-titre ✓'
        : 'Absent du méta-titre — à ajouter'
      : 'Aucun mot-clé défini',
    category: 'basic',
  });

  checks.push({
    id: 'kw-in-meta-desc',
    label: 'Mot-clé dans la méta-description',
    passed: !!focusKeyword && normalizedDesc.includes(normalizedKw),
    message: focusKeyword
      ? normalizedDesc.includes(normalizedKw)
        ? 'Présent dans la méta-description ✓'
        : 'Absent de la méta-description'
      : 'Aucun mot-clé défini',
    category: 'basic',
  });

  checks.push({
    id: 'kw-in-h1',
    label: 'Mot-clé dans le titre H1',
    passed: !!focusKeyword && normalizedTitle.includes(normalizedKw),
    message: focusKeyword
      ? normalizedTitle.includes(normalizedKw)
        ? 'Présent dans le titre ✓'
        : 'Absent du titre H1'
      : 'Aucun mot-clé défini',
    category: 'basic',
  });

  const metaTitleLen = metaTitle?.length || 0;
  checks.push({
    id: 'meta-title-length',
    label: 'Longueur méta-titre (50-60 car.)',
    passed: metaTitleLen >= 50 && metaTitleLen <= 60,
    message: metaTitleLen === 0
      ? 'Méta-titre manquant'
      : metaTitleLen < 50
        ? `Trop court : ${metaTitleLen} caractères (min 50)`
        : metaTitleLen > 60
          ? `Trop long : ${metaTitleLen} caractères (max 60)`
          : `Parfait : ${metaTitleLen} caractères ✓`,
    category: 'basic',
  });

  const metaDescLen = metaDescription?.length || 0;
  checks.push({
    id: 'meta-desc-length',
    label: 'Longueur méta-description (140-160 car.)',
    passed: metaDescLen >= 140 && metaDescLen <= 160,
    message: metaDescLen === 0
      ? 'Méta-description manquante'
      : metaDescLen < 140
        ? `Trop court : ${metaDescLen} caractères (min 140)`
        : metaDescLen > 160
          ? `Trop long : ${metaDescLen} caractères (max 160)`
          : `Parfait : ${metaDescLen} caractères ✓`,
    category: 'basic',
  });

  const slugOk = /^[a-z0-9-]+$/.test(slug || '');
  checks.push({
    id: 'slug-ok',
    label: 'Slug SEO-friendly',
    passed: slugOk && !!slug,
    message: slugOk && slug ? `/${slug} ✓` : 'Slug manquant ou contient des caractères invalides',
    category: 'basic',
  });

  // --- CONTENT CHECKS ---
  checks.push({
    id: 'word-count',
    label: 'Nombre de mots (min 600)',
    passed: wordCount >= 600,
    message: `${wordCount} mots${wordCount >= 600 ? ' ✓' : ' — insuffisant'}`,
    category: 'content',
  });

  checks.push({
    id: 'kw-density',
    label: 'Densité mot-clé (0.5% – 2.5%)',
    passed: !!focusKeyword && density >= 0.5 && density <= 2.5,
    message: focusKeyword
      ? `${density.toFixed(1)}%${density >= 0.5 && density <= 2.5 ? ' ✓' : density < 0.5 ? ' — trop faible' : ' — trop élevée'}`
      : 'Aucun mot-clé défini',
    category: 'content',
  });

  checks.push({
    id: 'h2-count',
    label: 'Nombre de H2 (min 4)',
    passed: h2Count >= 4,
    message: `${h2Count} H2${h2Count >= 4 ? ' ✓' : ' — ajouter des sous-sections'}`,
    category: 'content',
  });

  checks.push({
    id: 'h3-count',
    label: 'Nombre de H3 (min 2)',
    passed: h3Count >= 2,
    message: `${h3Count} H3${h3Count >= 2 ? ' ✓' : ' — ajouter des sous-titres'}`,
    category: 'content',
  });

  // --- LINK CHECKS ---
  checks.push({
    id: 'internal-links',
    label: 'Liens internes (min 3)',
    passed: links.internal >= 3,
    message: `${links.internal} lien(s) interne(s)${links.internal >= 3 ? ' ✓' : ' — insuffisant'}`,
    category: 'links',
  });

  checks.push({
    id: 'external-links',
    label: 'Lien(s) externe(s) (min 1)',
    passed: links.external >= 1,
    message: `${links.external} lien(s) externe(s)${links.external >= 1 ? ' ✓' : ' — ajouter une source externe'}`,
    category: 'links',
  });

  // --- GEO CHECKS ---
  checks.push({
    id: 'faq-count',
    label: 'FAQ (min 5 questions)',
    passed: faqCount >= 5,
    message: `${faqCount} question(s)${faqCount >= 5 ? ' ✓' : ' — compléter la FAQ'}`,
    category: 'geo',
  });

  checks.push({
    id: 'has-lists',
    label: 'Listes ou tableaux',
    passed: hasLists(sections),
    message: hasLists(sections) ? 'Liste(s) détectée(s) ✓' : 'Ajouter des listes à puces',
    category: 'geo',
  });

  checks.push({
    id: 'has-numbers',
    label: 'Données chiffrées (salaires, durées…)',
    passed: hasNumbers(fullText),
    message: hasNumbers(fullText) ? 'Données chiffrées présentes ✓' : 'Ajouter des chiffres concrets (€, %, durées)',
    category: 'geo',
  });

  checks.push({
    id: 'question-h2',
    label: 'H2 sous forme de question',
    passed: hasQuestionH2(sections),
    message: hasQuestionH2(sections) ? 'Question(s) en H2 ✓' : 'Reformuler au moins un H2 sous forme de question',
    category: 'geo',
  });

  checks.push({
    id: 'has-callouts',
    label: 'Encadrés conseils / info',
    passed: hasCallouts(sections),
    message: hasCallouts(sections) ? 'Encadré(s) présent(s) ✓' : 'Ajouter un callout conseil ou info',
    category: 'geo',
  });

  checks.push({
    id: 'word-count-geo',
    label: 'Contenu long (min 800 mots)',
    passed: wordCount >= 800,
    message: `${wordCount} mots${wordCount >= 800 ? ' ✓' : ' — compléter le contenu'}`,
    category: 'geo',
  });

  checks.push({
    id: 'direct-definition',
    label: 'Définition directe présente',
    passed: hasDirectDefinition(fullText),
    message: hasDirectDefinition(fullText) ? 'Définition détectée ✓' : 'Commencer par une définition directe ("Le BTS... est...")',
    category: 'geo',
  });

  // --- CALCULATE SCORES ---
  const basicChecks = checks.filter(c => c.category === 'basic');
  const contentChecks = checks.filter(c => c.category === 'content');
  const linkChecks = checks.filter(c => c.category === 'links');
  const geoChecks = checks.filter(c => c.category === 'geo');

  const passedBasic = basicChecks.filter(c => c.passed).length;
  const passedContent = contentChecks.filter(c => c.passed).length;
  const passedLinks = linkChecks.filter(c => c.passed).length;
  const passedGeo = geoChecks.filter(c => c.passed).length;

  // SEO: basic (40pts) + content (40pts) + links (20pts)
  const seoScore = Math.round(
    (passedBasic / basicChecks.length) * 40 +
    (passedContent / contentChecks.length) * 40 +
    (passedLinks / linkChecks.length) * 20
  );

  // GEO: all geo checks equally weighted
  const geoScore = Math.round((passedGeo / geoChecks.length) * 100);

  return { seoScore, geoScore, checks };
}
