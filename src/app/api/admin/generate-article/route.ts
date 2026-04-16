import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// ─── Base de liens internes Linova ───────────────────────────────────────────
const INTERNAL_LINKS_MAP = `
PAGES PRINCIPALES (utiliser en priorité) :
- <a href="/formations/bts-biologie-medicale">BTS Biologie Médicale</a>
- <a href="/formations/bts-biologie-medicale">notre formation en biologie médicale</a>
- <a href="/formations/bts-biologie-medicale">BTS Biologie Médicale à Paris</a>
- <a href="/infos-pratiques/admission">candidater à Linova</a>
- <a href="/infos-pratiques/admission">procédure d'admission</a>
- <a href="/infos-pratiques/tarifs">tarifs et financement</a>
- <a href="/infos-pratiques/tarifs">financement OPCO</a>
- <a href="/infos-pratiques/campus">notre campus parisien</a>
- <a href="/ecole/pourquoi-linova">pourquoi choisir Linova</a>
- <a href="/ecole/qualiopi">certification Qualiopi</a>
- <a href="/entreprises">nos entreprises partenaires</a>

ARTICLES BLOG (lier selon la pertinence du sujet traité) :
- <a href="/blog/technicien-laboratoire-medical">technicien de laboratoire médical</a>
- <a href="/blog/preleveur-laboratoire">préleveur de laboratoire</a>
- <a href="/blog/technicien-microbiologie">technicien en microbiologie</a>
- <a href="/blog/technicien-hematologie">technicien en hématologie</a>
- <a href="/blog/technicien-anatomopathologie">technicien en anatomopathologie</a>
- <a href="/blog/technicien-biologie-reproduction">technicien en biologie de la reproduction</a>
- <a href="/blog/technicien-qualite-laboratoire">technicien qualité laboratoire</a>
- <a href="/blog/technicien-recherche-biomedicale">technicien en recherche biomédicale</a>
- <a href="/blog/technicien-toxicologie">technicien en toxicologie</a>
- <a href="/blog/technicien-efs">technicien à l'EFS</a>
- <a href="/blog/salaire-bts-biologie-medicale">salaire d'un diplômé BTS Biologie Médicale</a>
- <a href="/blog/stage-bts-biologie-medicale">stage en BTS Biologie Médicale</a>
- <a href="/blog/programme-bts-biologie-medicale">programme du BTS Biologie Médicale</a>
- <a href="/blog/inscription-bts-biologie-medicale">s'inscrire en BTS Biologie Médicale</a>
- <a href="/blog/bts-biologie-medicale-ou-licence">BTS ou licence en biologie médicale</a>
- <a href="/blog/qualites-technicien-laboratoire">qualités d'un bon technicien de labo</a>
- <a href="/blog/certification-qualiopi">certification Qualiopi en formation</a>
`;

// ─── Prompt : Génération complète ────────────────────────────────────────────
const GENERATE_PROMPT = (title: string, focusKeyword: string, category: string) => `
Tu es un expert en rédaction SEO/GEO pour Linova Éducation, école parisienne spécialisée BTS Biologie Médicale.

SUJET : "${title}"
MOT-CLÉ FOCUS : "${focusKeyword || title}"
CATÉGORIE : ${category}

CONTEXTE LINOVA :
- BTS Biologie Médicale (RNCP 40027), 2 ans, Paris
- Alternance disponible : financement OPCO = 0 € pour l'étudiant
- Certification Qualiopi | Tél : 01 89 71 99 44

═══════════════════════════════════════════════
RÈGLES MAILLAGE INTERNE (OBLIGATOIRE)
═══════════════════════════════════════════════
Tu DOIS insérer minimum 8 liens internes cliquables dans les paragraphes.
Utilise EXACTEMENT ces balises HTML dans le champ "content" des paragraphes :

${INTERNAL_LINKS_MAP}

RÈGLES de placement des liens :
1. Le lien vers /formations/bts-biologie-medicale DOIT apparaître au moins 2 fois
2. Les liens doivent être intégrés NATURELLEMENT dans le texte, pas en liste à la fin
3. Varie les ancres : ne répète pas deux fois le même texte d'ancre
4. Au moins 1 lien dans les réponses de la FAQ

═══════════════════════════════════════════════
EXIGENCES CONTENU
═══════════════════════════════════════════════
- 7 à 8 sections H2
- 2 à 3 sous-titres H3
- Minimum 1000 mots de contenu textuel
- 1 section FAQ avec exactement 6 questions
- 2 callouts (un "conseil", un "info")
- 2 listes à puces minimum
- 1 lien externe vers source officielle (ONISEP, sante.fr, legifrance.fr)
- Données chiffrées : salaires €, durées semaines/mois, taux insertion %
- Au moins 1 H2 formulé comme une question
- Ton : expert accessible, pas corporate, jamais "il est important de noter"

═══════════════════════════════════════════════
FORMAT JSON (répondre UNIQUEMENT avec ce JSON)
═══════════════════════════════════════════════
{
  "title": "Titre H1 complet",
  "slug": "slug-seo-sans-accents",
  "metaTitle": "Méta-titre 50-60 caractères exactement avec mot-clé | Linova",
  "metaDescription": "Description 150-160 caractères avec mot-clé focus naturellement intégré.",
  "excerpt": "Résumé 1-2 phrases pour la liste blog.",
  "readTime": "X min",
  "sections": [
    { "id": "s1", "type": "heading", "level": "h2", "content": "Premier titre H2" },
    { "id": "s2", "type": "paragraph", "content": "Texte avec <a href='/formations/bts-biologie-medicale'>BTS Biologie Médicale</a> et autres liens." },
    { "id": "s3", "type": "callout", "variant": "info", "content": "Texte encadré informatif." },
    { "id": "s4", "type": "list", "items": ["Élément 1", "Élément 2", "Élément 3"] },
    { "id": "s5", "type": "heading", "level": "h3", "content": "Sous-titre H3" },
    { "id": "s6", "type": "faq", "questions": [
      { "question": "Question 1 ?", "answer": "Réponse avec <a href='/formations/bts-biologie-medicale'>lien interne</a>." },
      { "question": "Question 2 ?", "answer": "Réponse détaillée." }
    ]}
  ]
}
`;

// ─── Prompt : Amélioration SEO ───────────────────────────────────────────────
const IMPROVE_SEO_PROMPT = (
  title: string,
  keyword: string,
  failedChecks: string,
  feedback: string,
  currentContent: { metaTitle: string; metaDescription: string; sections: object[] }
) => `
Tu es un expert SEO. Tu dois réécrire cet article pour corriger TOUS les points listés ci-dessous et atteindre un score SEO de 80+.

ARTICLE : "${title}"
MOT-CLÉ FOCUS : "${keyword}"

═══════════════════════════════════════════════
POINTS SEO À CORRIGER (chacun OBLIGATOIRE)
═══════════════════════════════════════════════
${failedChecks || 'Optimiser globalement : maillage interne, densité mot-clé, méta.'}

${feedback ? `INSTRUCTIONS SUPPLÉMENTAIRES : ${feedback}` : ''}

═══════════════════════════════════════════════
RÈGLES STRICTES D'APPLICATION
═══════════════════════════════════════════════

1. MÉTA-TITRE : Doit faire exactement entre 50 et 60 caractères.
   - Commencer par le mot-clé focus : "${keyword}"
   - Finir par "| Linova" ou "| Linova Éducation"
   - Exemple correct (55 car.) : "${keyword.slice(0, 35)} à Paris | Linova Éducation"

2. MÉTA-DESCRIPTION : Doit faire exactement entre 140 et 160 caractères.
   - Contenir le mot-clé "${keyword}" dans les 30 premiers mots
   - Terminer par un appel à l'action (Découvrez, Candidatez, Formez-vous...)
   - Compter PRÉCISÉMENT les caractères avant de répondre

3. MAILLAGE INTERNE : Minimum 5 liens <a href="...">...</a> dans les paragraphes.
   Utilise ces liens EXACTEMENT (copie-les tels quels dans les paragraphes) :
${INTERNAL_LINKS_MAP}
   RÈGLE : chaque lien doit être intégré naturellement dans une phrase, pas en fin de section.
   RÈGLE : /formations/bts-biologie-medicale doit apparaître au moins 2 fois.

4. DENSITÉ MOT-CLÉ : Le mot-clé "${keyword}" doit apparaître entre 0.5% et 2.5% du total des mots.
   - Si l'article fait 800 mots → 4 à 20 occurrences du mot-clé
   - Intègre-le naturellement dans les titres H2/H3 ET dans les paragraphes

5. LONGUEUR : Minimum 600 mots de contenu textuel (hors balises HTML).

6. STRUCTURE : Minimum 4 titres H2 et 2 titres H3.

CONTENU ACTUEL À AMÉLIORER :
Méta-titre actuel : "${currentContent.metaTitle}"
Méta-description actuelle : "${currentContent.metaDescription}"
Sections : ${JSON.stringify(currentContent.sections)}

═══════════════════════════════════════════════
AVANT DE RÉPONDRE, VÉRIFIE :
═══════════════════════════════════════════════
□ Méta-titre : ${keyword} présent + longueur 50-60 car. ?
□ Méta-description : ${keyword} présent + longueur 140-160 car. ?
□ Liens internes : au moins 5 balises <a href="/..."> présentes dans les sections ?
□ Mot-clé "${keyword}" dans plusieurs paragraphes ?
□ Au moins 4 H2 et 2 H3 ?

Réponds UNIQUEMENT avec ce JSON (aucun texte avant/après) :
{
  "metaTitle": "...",
  "metaDescription": "...",
  "sections": [/* TOUTES les sections réécrites avec liens internes intégrés */]
}
`;

// ─── Prompt : Amélioration GEO ───────────────────────────────────────────────
const IMPROVE_GEO_PROMPT = (
  title: string,
  keyword: string,
  failedChecks: string,
  feedback: string,
  currentContent: { metaTitle: string; metaDescription: string; sections: object[] }
) => `
Tu es un expert en GEO (Generative Engine Optimization) — optimisation pour Google SGE, ChatGPT, Perplexity.

ARTICLE : "${title}"
MOT-CLÉ : "${keyword}"

═══════════════════════════════════════════════
POINTS GEO À CORRIGER
═══════════════════════════════════════════════
${failedChecks || 'Optimiser globalement pour les moteurs IA.'}

${feedback ? `INSTRUCTIONS SUPPLÉMENTAIRES : ${feedback}` : ''}

═══════════════════════════════════════════════
RÈGLES STRICTES GEO
═══════════════════════════════════════════════

1. FAQ : Doit contenir exactement 6 questions minimum dans la section type "faq".
   - Questions formulées comme les utilisateurs les tapent dans Google/ChatGPT
   - Réponses complètes et autonomes (200+ mots chacune)
   - Au moins 2 réponses contiennent un lien interne vers /formations/bts-biologie-medicale

2. H2 EN QUESTIONS : Au moins 2 titres H2 doivent être formulés comme questions.
   Exemples : "Comment devient-on ${keyword} ?" / "Quel salaire après un ${keyword} ?" / "Pourquoi choisir ${keyword} ?"

3. DONNÉES CHIFFRÉES : Chaque section doit contenir au moins 1 donnée chiffrée.
   - Salaires (ex : 2 100 € brut/mois en entrée de carrière)
   - Durées (ex : 14 semaines de stage sur 2 ans)
   - Taux (ex : 87 % d'insertion professionnelle)
   - Dates (ex : dépôt de dossier avant le 15 mars)

4. DÉFINITION DIRECTE : Le premier paragraphe doit définir le sujet en 1-2 phrases claires.
   Format : "[Sujet] est/désigne/consiste en..."

5. ENCADRÉS : Minimum 2 callouts (type "callout") dans l'article.
   - variant "conseil" : recommandation pratique
   - variant "info" : chiffre ou fait marquant

6. LISTES : Minimum 3 sections de type "list" avec des éléments énumérables.

7. MAILLAGE INTERNE dans les réponses FAQ :
   Intègre ces liens dans les réponses des questions :
${INTERNAL_LINKS_MAP}

CONTENU ACTUEL :
${JSON.stringify(currentContent.sections)}

═══════════════════════════════════════════════
AVANT DE RÉPONDRE, VÉRIFIE :
═══════════════════════════════════════════════
□ 6+ questions dans la FAQ ?
□ 2+ H2 formulés comme questions ?
□ Données chiffrées dans chaque section ?
□ Définition directe dans le premier paragraphe ?
□ 2+ callouts présents ?
□ Liens internes dans les réponses FAQ ?

Réponds UNIQUEMENT avec ce JSON :
{
  "metaTitle": "...",
  "metaDescription": "...",
  "sections": [/* sections réoptimisées GEO avec FAQ complète et données chiffrées */]
}
`;

// ─── Prompt : Maillage interne ───────────────────────────────────────────────
const MAILLAGE_PROMPT = (
  title: string,
  keyword: string,
  feedback: string,
  currentContent: { sections: object[] }
) => `
Tu es un expert en maillage interne SEO. Ta mission : enrichir cet article avec des liens internes Linova sans modifier le sens du texte.

ARTICLE : "${title}"
MOT-CLÉ : "${keyword}"
${feedback ? `INSTRUCTIONS : ${feedback}` : ''}

═══════════════════════════════════════════════
LIENS INTERNES DISPONIBLES (utilise-les TOUS si pertinent)
═══════════════════════════════════════════════
${INTERNAL_LINKS_MAP}

═══════════════════════════════════════════════
RÈGLES STRICTES
═══════════════════════════════════════════════
1. Insère minimum 8 liens internes répartis dans TOUT l'article
2. /formations/bts-biologie-medicale : minimum 3 fois avec ancres différentes
3. Intègre les liens dans les phrases existantes — ne change PAS le contenu
4. Ajoute des liens dans les réponses FAQ aussi
5. Varie les ancres (textes différents pour le même lien)
6. Chaque paragraphe de plus de 100 mots doit contenir au moins 1 lien

EXEMPLES DE BONNE INTÉGRATION :
❌ MAUVAIS : "Voir la formation BTS ici."
✓ BON : "La <a href='/formations/bts-biologie-medicale'>formation BTS Biologie Médicale</a> de Linova prépare à ce métier en 2 ans."

❌ MAUVAIS : [lien en fin de paragraphe isolé]
✓ BON : lien intégré au milieu d'une phrase naturelle

CONTENU ACTUEL À ENRICHIR :
${JSON.stringify(currentContent.sections)}

Réponds UNIQUEMENT avec ce JSON :
{
  "sections": [/* sections identiques mais avec les liens internes ajoutés */]
}
`;

// ─── Prompt : Humanisation ───────────────────────────────────────────────────
const HUMANIZE_PROMPT = (
  title: string,
  feedback: string,
  currentContent: { sections: object[] }
) => `
Tu es un rédacteur humain expert. Rends cet article plus naturel, vivant et engageant.

ARTICLE : "${title}"
${feedback ? `INSTRUCTIONS : ${feedback}` : ''}

RÈGLES D'HUMANISATION :
- Supprimer TOUTES ces tournures IA : "il est important de noter", "en conclusion", "à l'ère de", "dans ce contexte", "il convient de", "nous pouvons voir que", "en définitive"
- Ajouter exemples concrets : "Imaginez...", "En pratique...", "Prenons l'exemple de..."
- Varier longueur des phrases : courtes (5 mots) + longues (25 mots) alternées
- Questions rhétoriques : "Mais alors, comment..."
- Anecdotes plausibles du quotidien du labo
- Conserver ABSOLUMENT tous les liens <a href="..."> existants
- Conserver toutes les données chiffrées
- Ton : professeur passionné qui explique à ses étudiants, pas une brochure corporate

CONTENU ACTUEL :
${JSON.stringify(currentContent.sections)}

Réponds UNIQUEMENT avec ce JSON :
{
  "sections": [/* sections humanisées, liens internes conservés */]
}
`;

// ─── Handler principal ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Clé API Anthropic manquante. Configurez ANTHROPIC_API_KEY dans .env.local et sur Vercel.' },
      { status: 500 }
    );
  }

  const body = await req.json();
  const {
    title,
    focusKeyword = '',
    category = 'Métiers',
    action = 'generate',
    currentContent,
    failedChecks = '',
    feedback = '',
  } = body;

  if (!title) {
    return NextResponse.json({ error: 'Le titre est requis.' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  let prompt: string;
  switch (action) {
    case 'seo':
      prompt = IMPROVE_SEO_PROMPT(title, focusKeyword, failedChecks, feedback, currentContent || { metaTitle: '', metaDescription: '', sections: [] });
      break;
    case 'geo':
      prompt = IMPROVE_GEO_PROMPT(title, focusKeyword, failedChecks, feedback, currentContent || { metaTitle: '', metaDescription: '', sections: [] });
      break;
    case 'maillage':
      prompt = MAILLAGE_PROMPT(title, focusKeyword, feedback, currentContent || { sections: [] });
      break;
    case 'humanize':
      prompt = HUMANIZE_PROMPT(title, feedback, currentContent || { sections: [] });
      break;
    default:
      prompt = GENERATE_PROMPT(title, focusKeyword, category);
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawContent = message.content[0];
    if (rawContent.type !== 'text') {
      return NextResponse.json({ error: 'Réponse inattendue du modèle.' }, { status: 500 });
    }

    let jsonStr = rawContent.text.trim();

    // Strip markdown code fences if present
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Find first { and last } to extract clean JSON
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      jsonStr = jsonStr.slice(start, end + 1);
    }

    const parsed = JSON.parse(jsonStr);
    return NextResponse.json(parsed);

  } catch (err) {
    console.error('[generate-article]', err);
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    if (message.includes('JSON') || message.includes('parse')) {
      return NextResponse.json(
        { error: 'Le modèle a retourné un format invalide. Réessayez ou ajoutez des instructions dans le champ texte.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: `Erreur API: ${message}` }, { status: 500 });
  }
}
