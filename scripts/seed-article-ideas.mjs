/**
 * Seed la banque d'idées d'articles SEO pour Linova.
 * Idempotent : ON CONFLICT (slug) DO NOTHING.
 *
 * Exécution :
 *   node scripts/seed-article-ideas.mjs
 */

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

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Variables Supabase manquantes dans .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Banque d'idées (ordre = priorité de publication) ────────────────────────
// 50 sujets SEO BTS Biologie Médicale, organisés par catégorie.
// Plus la priority est basse, plus l'idée est piochée tôt.
const IDEAS = [
  // ── Formation : programme, examens, admission (priorité haute)
  { title: "Programme du BTS Biologie Médicale : matières et coefficients", slug: 'programme-bts-biologie-medicale-detaille', focusKeyword: 'programme bts biologie médicale', category: 'Formation' },
  { title: "Examen du BTS Biologie Médicale : épreuves et coefficients en 2026", slug: 'examen-bts-biologie-medicale-epreuves', focusKeyword: 'examen bts biologie médicale', category: 'Formation' },
  { title: "Admission en BTS Biologie Médicale : comment être accepté ?", slug: 'admission-bts-biologie-medicale', focusKeyword: 'admission bts biologie médicale', category: 'Formation' },
  { title: "Lettre de motivation BTS Biologie Médicale : exemple et conseils", slug: 'lettre-motivation-bts-biologie-medicale', focusKeyword: 'lettre motivation bts biologie médicale', category: 'Formation' },
  { title: "Entretien d'admission en BTS Biologie Médicale : questions et préparation", slug: 'entretien-admission-bts-biologie-medicale', focusKeyword: 'entretien bts biologie médicale', category: 'Formation' },
  { title: "Combien coûte un BTS Biologie Médicale en école privée ?", slug: 'cout-bts-biologie-medicale-ecole-privee', focusKeyword: 'prix bts biologie médicale', category: 'Formation' },
  { title: "Bourse étudiante pour un BTS Biologie Médicale : guide 2026", slug: 'bourse-bts-biologie-medicale', focusKeyword: 'bourse bts biologie médicale', category: 'Formation' },
  { title: "BTS Biologie Médicale en 1 an : est-ce possible ?", slug: 'bts-biologie-medicale-en-un-an', focusKeyword: 'bts biologie médicale 1 an', category: 'Formation' },

  // ── Comparatifs (volume de recherche fort)
  { title: "BTS Biologie Médicale ou DUT Génie Biologique : que choisir ?", slug: 'bts-biologie-medicale-vs-dut', focusKeyword: 'bts biologie médicale ou dut', category: 'Formation' },
  { title: "BTS Biologie Médicale ou BTSA Anabiotec : quelles différences ?", slug: 'bts-biologie-medicale-vs-anabiotec', focusKeyword: 'bts biologie médicale anabiotec', category: 'Formation' },
  { title: "BTS Biologie Médicale ou prépa BCPST : quel parcours ?", slug: 'bts-biologie-medicale-vs-prepa-bcpst', focusKeyword: 'bts biologie médicale prépa', category: 'Formation' },
  { title: "Licence pro biologie médicale après un BTS : comment continuer ?", slug: 'licence-pro-biologie-medicale-apres-bts', focusKeyword: 'licence pro biologie médicale', category: 'Formation' },

  // ── Métiers spécialisés (longue traîne — débouchés)
  { title: "Technicien en hémostase : un expert de la coagulation sanguine", slug: 'technicien-hemostase', focusKeyword: 'technicien hémostase', category: 'Métiers' },
  { title: "Technicien en virologie : missions, salaire et formation", slug: 'technicien-virologie', focusKeyword: 'technicien virologie', category: 'Métiers' },
  { title: "Technicien en cytologie : un métier au cœur du diagnostic", slug: 'technicien-cytologie', focusKeyword: 'technicien cytologie', category: 'Métiers' },
  { title: "Technicien en cytogénétique : analyser les chromosomes", slug: 'technicien-cytogenetique', focusKeyword: 'technicien cytogénétique', category: 'Métiers' },
  { title: "Technicien en biologie moléculaire : PCR, séquençage et carrière", slug: 'technicien-biologie-moleculaire', focusKeyword: 'technicien biologie moléculaire', category: 'Métiers' },
  { title: "Technicien en bactériologie : identifier les agents infectieux", slug: 'technicien-bacteriologie', focusKeyword: 'technicien bactériologie', category: 'Métiers' },
  { title: "Technicien en sérologie : diagnostic des maladies infectieuses", slug: 'technicien-serologie', focusKeyword: 'technicien sérologie', category: 'Métiers' },
  { title: "Technicien en endocrinologie médicale : hormones et bilans", slug: 'technicien-endocrinologie', focusKeyword: 'technicien endocrinologie', category: 'Métiers' },
  { title: "Technicien en pharmacologie clinique : suivi thérapeutique", slug: 'technicien-pharmacologie-clinique', focusKeyword: 'technicien pharmacologie', category: 'Métiers' },
  { title: "Technicien en allergologie : tests et diagnostic des allergies", slug: 'technicien-allergologie', focusKeyword: 'technicien allergologie', category: 'Métiers' },
  { title: "Technicien en assistance médicale à la procréation (PMA)", slug: 'technicien-pma', focusKeyword: 'technicien PMA', category: 'Métiers' },
  { title: "Technicien préleveur sanguin : formation et missions", slug: 'technicien-preleveur-sanguin', focusKeyword: 'préleveur sanguin', category: 'Métiers' },
  { title: "Technicien d'analyses vétérinaires : un débouché méconnu", slug: 'technicien-analyses-veterinaires', focusKeyword: 'technicien analyses vétérinaires', category: 'Métiers' },

  // ── Salaires et carrière (forte intention de recherche)
  { title: "Salaire d'un technicien de laboratoire débutant en 2026", slug: 'salaire-technicien-laboratoire-debutant', focusKeyword: 'salaire technicien laboratoire débutant', category: 'Métiers' },
  { title: "Évolution de carrière après un BTS Biologie Médicale", slug: 'evolution-carriere-bts-biologie-medicale', focusKeyword: 'carrière bts biologie médicale', category: 'Métiers' },
  { title: "Devenir cadre de laboratoire après un BTS Biologie Médicale", slug: 'devenir-cadre-laboratoire', focusKeyword: 'cadre laboratoire médical', category: 'Métiers' },
  { title: "Reconversion vers un BTS Biologie Médicale : guide complet", slug: 'reconversion-bts-biologie-medicale', focusKeyword: 'reconversion bts biologie médicale', category: 'Formation' },
  { title: "Travailler à l'étranger avec un BTS Biologie Médicale", slug: 'travailler-etranger-bts-biologie-medicale', focusKeyword: 'bts biologie médicale étranger', category: 'Métiers' },

  // ── Alternance / Apprentissage (cible OPCO + Pôle emploi)
  { title: "Contrat d'apprentissage en biologie médicale : démarches et droits", slug: 'contrat-apprentissage-biologie-medicale', focusKeyword: 'contrat apprentissage biologie médicale', category: 'Alternance' },
  { title: "Contrat de professionnalisation BTS Biologie Médicale : conditions", slug: 'contrat-professionnalisation-biologie-medicale', focusKeyword: 'contrat professionnalisation biologie médicale', category: 'Alternance' },
  { title: "Rythme d'alternance en BTS Biologie Médicale : 2j/3j ou 1 sem./1 sem. ?", slug: 'rythme-alternance-bts-biologie-medicale', focusKeyword: 'rythme alternance bts biologie médicale', category: 'Alternance' },
  { title: "Salaire d'un alternant en BTS Biologie Médicale en 2026", slug: 'salaire-alternant-bts-biologie-medicale', focusKeyword: 'salaire alternance bts biologie médicale', category: 'Alternance' },
  { title: "Comment convaincre un laboratoire de vous prendre en alternance", slug: 'convaincre-laboratoire-alternance', focusKeyword: 'trouver maitre apprentissage laboratoire', category: 'Alternance' },
  { title: "Réseau Cerba, Biogroup, Eurofins : qui recrute des alternants ?", slug: 'laboratoires-recruteurs-alternance', focusKeyword: 'laboratoires recruteurs alternance', category: 'Alternance' },

  // ── Stage et professionnalisation
  { title: "Trouver un stage en biologie médicale : laboratoires et hôpitaux", slug: 'trouver-stage-biologie-medicale', focusKeyword: 'stage biologie médicale', category: 'Formation' },
  { title: "Rapport de stage BTS Biologie Médicale : structure et exemples", slug: 'rapport-stage-bts-biologie-medicale', focusKeyword: 'rapport stage bts biologie médicale', category: 'Formation' },

  // ── Géo (Paris + grandes villes)
  { title: "Étudier le BTS Biologie Médicale à Paris 12e : pourquoi Linova ?", slug: 'bts-biologie-medicale-paris-12', focusKeyword: 'bts biologie médicale paris 12', category: 'Formation' },
  { title: "BTS Biologie Médicale en Île-de-France : où s'inscrire en 2026 ?", slug: 'bts-biologie-medicale-ile-de-france', focusKeyword: 'bts biologie médicale île de france', category: 'Formation' },
  { title: "BTS Biologie Médicale à distance : est-ce possible ?", slug: 'bts-biologie-medicale-a-distance', focusKeyword: 'bts biologie médicale distance', category: 'Formation' },

  // ── Compétences techniques / matériel
  { title: "Quelles compétences développer en BTS Biologie Médicale ?", slug: 'competences-bts-biologie-medicale', focusKeyword: 'compétences bts biologie médicale', category: 'Formation' },
  { title: "Les techniques de laboratoire enseignées en BTS Biologie Médicale", slug: 'techniques-laboratoire-bts-biologie-medicale', focusKeyword: 'techniques laboratoire biologie médicale', category: 'Formation' },
  { title: "Automates de laboratoire : les équipements à maîtriser", slug: 'automates-laboratoire-medical', focusKeyword: 'automate laboratoire', category: 'Métiers' },
  { title: "Hygiène et sécurité en laboratoire de biologie médicale", slug: 'hygiene-securite-laboratoire-medical', focusKeyword: 'hygiène laboratoire médical', category: 'Métiers' },
  { title: "Norme ISO 15189 : le référentiel qualité en biologie médicale", slug: 'iso-15189-biologie-medicale', focusKeyword: 'iso 15189', category: 'Métiers' },

  // ── Vie étudiante & insertion
  { title: "Témoignages d'étudiants en BTS Biologie Médicale chez Linova", slug: 'temoignages-etudiants-linova', focusKeyword: 'avis bts biologie médicale linova', category: 'École' },
  { title: "Que faire après un BTS Biologie Médicale sans poursuivre d'études ?", slug: 'apres-bts-biologie-medicale-sans-etudes', focusKeyword: 'apres bts biologie médicale', category: 'Métiers' },
  { title: "Taux d'insertion professionnelle après un BTS Biologie Médicale", slug: 'insertion-professionnelle-bts-biologie-medicale', focusKeyword: 'insertion bts biologie médicale', category: 'Métiers' },
  { title: "Travailler en EHPAD comme technicien de biologie : missions et salaire", slug: 'technicien-biologie-ehpad', focusKeyword: 'technicien biologie ehpad', category: 'Métiers' },
];

// ─── Insert ──────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Seed de ${IDEAS.length} idées dans linova_article_ideas...\n`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < IDEAS.length; i++) {
    const idea = IDEAS[i];
    const priority = 100 + i; // ordre stable

    const { error } = await supabase
      .from('linova_article_ideas')
      .insert({
        title: idea.title,
        slug: idea.slug,
        focus_keyword: idea.focusKeyword,
        category: idea.category,
        priority,
        status: 'pending',
      });

    if (error) {
      if (error.code === '23505') {
        skipped++;
        console.log(`  ⏭️  ${idea.slug} (déjà présent)`);
      } else {
        failed++;
        console.error(`  ❌ ${idea.slug} → ${error.message}`);
      }
    } else {
      inserted++;
      console.log(`  ✅ [${priority}] ${idea.slug}`);
    }
  }

  console.log(`\n──────────────────────────`);
  console.log(`Insérés : ${inserted}`);
  console.log(`Ignorés : ${skipped}`);
  console.log(`Échecs  : ${failed}`);
}

main().catch((err) => {
  console.error('Erreur fatale :', err);
  process.exit(1);
});
