import type { NextConfig } from "next";

/**
 * Liste des redirects 301 — anciennes URLs (legacy WordPress) vers les
 * équivalents actuels du site Next.js. Indispensable pour le SEO :
 * Google a indexé ces URLs et continue de les explorer (cf. Search Console).
 */
type Redirect = {
  source: string;
  destination: string;
  permanent: true;
};

const LEGACY_REDIRECTS: Redirect[] = [
  // ── Anciens articles blog (URL "wp" date-prefixée) ──────────────────
  { source: "/2025/09/17/bts-biologie-medicale-paris-linova-education", destination: "/formations/bts-biologie-medicale", permanent: true },
  { source: "/2025/10/02/bts-biologie-medicale-ou-licence-sciences-de-la-vie", destination: "/blog/bts-biologie-medicale-ou-licence", permanent: true },
  { source: "/2025/10/03/stage-bts-biologie-medicale", destination: "/blog/stage-bts-biologie-medicale", permanent: true },
  { source: "/2025/10/02/sinscrire-bts-biologie-medicale", destination: "/blog/inscription-bts-biologie-medicale", permanent: true },
  { source: "/2025/10/02/bts-biologie-medicale-matieres-details", destination: "/blog/programme-bts-biologie-medicale", permanent: true },
  { source: "/2025/10/03/qualites-technicien-laboratoire", destination: "/blog/qualites-technicien-laboratoire", permanent: true },
  { source: "/2025/12/10/certification-qualiopi", destination: "/blog/certification-qualiopi", permanent: true },
  { source: "/2025/09/16/technicien-laboratoire-metier-tension", destination: "/blog/qualites-technicien-laboratoire", permanent: true },
  { source: "/2025/04/19/conseils-pour-reussir-le-bts-bm", destination: "/blog/qualites-technicien-laboratoire", permanent: true },
  { source: "/2025/04/19/actualites-et-evolutions-du-secteur-biomedical", destination: "/blog", permanent: true },
  { source: "/2025/04/19/que-faire-apres-un-refus-en-pass", destination: "/blog/inscription-bts-biologie-medicale", permanent: true },
  { source: "/2025/04/19/etudes-de-sante-en-europe-apres-un-bts-conditions-et-parcours", destination: "/blog/bts-biologie-medicale-ou-licence", permanent: true },
  { source: "/2025/04/19/bts-bm-en-alternance-fonctionnement-avantages", destination: "/blog/bts-biologie-medicale-alternance", permanent: true },

  // ── Pages canoniques renommées ──────────────────────────────────────
  { source: "/pourquoi-linova", destination: "/ecole/pourquoi-linova", permanent: true },
  { source: "/qualiopi", destination: "/ecole/qualiopi", permanent: true },
  { source: "/demarche-qualite", destination: "/ecole/demarche-qualite", permanent: true },
  { source: "/professeurs", destination: "/ecole/notre-expertise", permanent: true },
  { source: "/admission", destination: "/infos-pratiques/admission", permanent: true },
  { source: "/tarifs-et-financements", destination: "/infos-pratiques/tarifs", permanent: true },
  { source: "/handicap-accessibilite", destination: "/infos-pratiques/handicap-accessibilite", permanent: true },
  { source: "/contact-handicap", destination: "/infos-pratiques/handicap-accessibilite", permanent: true },
  { source: "/preparations/bts-biologie-medicale", destination: "/formations/bts-biologie-medicale", permanent: true },
  { source: "/contact-alternant", destination: "/rendez-vous", permanent: true },
  { source: "/faq-generales", destination: "/infos-pratiques/admission", permanent: true },

  // ── Pages "remerciement" (formulaires / brochures) ──────────────────
  { source: "/remerciement-brochure", destination: "/", permanent: true },
  { source: "/remerciement-candidature", destination: "/", permanent: true },

  // ── CGU / mentions légales (pas de page dédiée actuelle) ────────────
  { source: "/conditions-generales-de-services", destination: "/", permanent: true },

  // ── Pages auteur (legacy WordPress) ─────────────────────────────────
  { source: "/author/:slug*", destination: "/blog", permanent: true },
];

const nextConfig: NextConfig = {
  async redirects() {
    return LEGACY_REDIRECTS;
  },
};

export default nextConfig;
