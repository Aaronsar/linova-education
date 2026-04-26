/**
 * Article generator — pipeline Claude réutilisable.
 *
 * Pipeline : generate → SEO → GEO → humanise.
 * Logique reprise du script `scripts/generate-all-articles.mjs` (one-shot des 20 articles initiaux).
 * Utilisé par l'endpoint cron `/api/cron/generate-daily-article`.
 */

import Anthropic from '@anthropic-ai/sdk';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArticleIdea {
  title: string;
  slug: string;
  focusKeyword: string;
  category: string;
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  focusKeyword: string;
  sections: Section[];
  readTime: string;
}

type Section =
  | { id: string; type: 'heading'; level: 'h2' | 'h3'; content: string }
  | { id: string; type: 'paragraph'; content: string }
  | { id: string; type: 'callout'; variant: 'info' | 'tip' | 'warning'; content: string }
  | { id: string; type: 'list'; items: string[] }
  | { id: string; type: 'faq'; questions: { question: string; answer: string }[] };

interface DraftState {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  readTime: string;
  sections: Section[];
}

// ─── Liens internes (pour densité de maillage) ───────────────────────────────

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

// ─── Prompts ──────────────────────────────────────────────────────────────────

const generatePrompt = (title: string, keyword: string, category: string) => `
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

const seoPrompt = (title: string, keyword: string, current: DraftState, failedChecks: string) => `
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

const geoPrompt = (title: string, keyword: string, current: DraftState, failedChecks: string) => `
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

const humanizePrompt = (title: string, current: DraftState) => `
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAnthropic(): Anthropic {
  const key = (process.env.ANTHROPIC_API_KEY || '').replace(/\s/g, '');
  if (!key) throw new Error('ANTHROPIC_API_KEY missing');
  return new Anthropic({ apiKey: key });
}

async function callClaude<T = unknown>(prompt: string): Promise<T> {
  const anthropic = getAnthropic();
  const msg = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = msg.content[0];
  if (!block || block.type !== 'text') throw new Error('Unexpected response from Claude');

  let text = block.text.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
  return JSON.parse(text) as T;
}

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getFailedChecks(title: string, keyword: string, content: DraftState): string {
  const text = content.sections
    .map((s) => {
      let t = '';
      if ('content' in s && s.content) t += s.content.replace(/<[^>]+>/g, ' ');
      if ('items' in s && s.items) t += ' ' + s.items.join(' ');
      if ('questions' in s && s.questions) {
        s.questions.forEach((q) => {
          t += ' ' + q.question + ' ' + q.answer;
        });
      }
      return t;
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = text.split(/\s+/).filter(Boolean).length;
  const kw = normalize(keyword);
  const normalizedText = normalize(text);
  const kwFirst = kw.split(' ')[0];
  const kwCount = normalizedText.split(/\s+/).filter((w) => w.includes(kwFirst)).length;
  const density = words > 0 ? (kwCount / words) * 100 : 0;
  const h2Count = content.sections.filter((s) => s.type === 'heading' && s.level === 'h2').length;
  const h3Count = content.sections.filter((s) => s.type === 'heading' && s.level === 'h3').length;
  const faqSection = content.sections.find((s) => s.type === 'faq');
  const faqCount = faqSection && faqSection.type === 'faq' ? faqSection.questions.length : 0;
  const internalLinks = (JSON.stringify(content.sections).match(/href="\/[^"]+"/g) || []).length;

  const metaTitleLen = (content.metaTitle || '').length;
  const metaDescLen = (content.metaDescription || '').length;
  const metaTitleLower = normalize(content.metaTitle || '');
  const metaDescLower = normalize(content.metaDescription || '');
  const titleLower = normalize(title);

  const checks: string[] = [];
  if (!metaTitleLower.includes(kwFirst)) checks.push('- Mot-clé absent du méta-titre');
  if (metaTitleLen < 50 || metaTitleLen > 60) checks.push(`- Méta-titre : ${metaTitleLen} car. (cible 50-60)`);
  if (!metaDescLower.includes(kwFirst)) checks.push('- Mot-clé absent de la méta-description');
  if (metaDescLen < 140 || metaDescLen > 160) checks.push(`- Méta-description : ${metaDescLen} car. (cible 140-160)`);
  if (!titleLower.includes(kwFirst)) checks.push('- Mot-clé absent du titre H1');
  if (words < 600) checks.push(`- Seulement ${words} mots (min 600)`);
  if (density < 0.5 || density > 2.5) checks.push(`- Densité mot-clé : ${density.toFixed(1)}% (cible 0.5-2.5%)`);
  if (h2Count < 4) checks.push(`- ${h2Count} H2 (min 4)`);
  if (h3Count < 2) checks.push(`- ${h3Count} H3 (min 2)`);
  if (internalLinks < 3) checks.push(`- ${internalLinks} lien(s) interne(s) (min 3)`);
  if (faqCount < 5) checks.push(`- FAQ : ${faqCount} question(s) (min 5)`);
  if (!content.sections.some((s) => s.type === 'list')) checks.push('- Pas de liste à puces');
  if (!content.sections.some((s) => s.type === 'callout')) checks.push('- Pas de callout');

  return checks.join('\n');
}

function estimateReadTime(sections: Section[]): string {
  let text = '';
  for (const s of sections) {
    if ('content' in s && s.content) text += ' ' + s.content.replace(/<[^>]+>/g, '');
    if ('items' in s && s.items) text += ' ' + s.items.join(' ');
    if ('questions' in s && s.questions) {
      s.questions.forEach((q) => {
        text += ' ' + q.question + ' ' + q.answer;
      });
    }
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

interface PartialResult {
  metaTitle?: string;
  metaDescription?: string;
  sections?: Section[];
}

function merge(current: DraftState, result: PartialResult): DraftState {
  return {
    ...current,
    metaTitle: result.metaTitle || current.metaTitle,
    metaDescription: result.metaDescription || current.metaDescription,
    sections: result.sections?.length ? result.sections : current.sections,
  };
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Pipeline complet ─────────────────────────────────────────────────────────

export async function generateArticleFull(idea: ArticleIdea): Promise<GeneratedArticle> {
  const { title, focusKeyword, category, slug: ideaSlug } = idea;

  // 1. Génération initiale
  const generated = await callClaude<{
    title?: string;
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    excerpt?: string;
    readTime?: string;
    sections?: Section[];
  }>(generatePrompt(title, focusKeyword, category));

  let current: DraftState = {
    title: generated.title || title,
    slug: generated.slug || ideaSlug,
    metaTitle: generated.metaTitle || '',
    metaDescription: generated.metaDescription || '',
    excerpt: generated.excerpt || '',
    readTime: generated.readTime || '7 min',
    sections: generated.sections || [],
  };
  await sleep(2000);

  // 2. Optimisation SEO
  const failedSEO = getFailedChecks(current.title, focusKeyword, current);
  const seoResult = await callClaude<PartialResult>(seoPrompt(current.title, focusKeyword, current, failedSEO));
  current = merge(current, seoResult);
  await sleep(2000);

  // 3. Optimisation GEO
  const failedGEO = getFailedChecks(current.title, focusKeyword, current);
  const geoResult = await callClaude<PartialResult>(geoPrompt(current.title, focusKeyword, current, failedGEO));
  current = merge(current, geoResult);
  await sleep(2000);

  // 4. Humanisation
  const humanResult = await callClaude<PartialResult>(humanizePrompt(current.title, current));
  if (humanResult.sections?.length) current.sections = humanResult.sections;

  return {
    title: current.title,
    slug: current.slug || ideaSlug,
    metaTitle: current.metaTitle,
    metaDescription: current.metaDescription,
    excerpt: current.excerpt,
    category,
    focusKeyword,
    sections: current.sections,
    readTime: estimateReadTime(current.sections),
  };
}
