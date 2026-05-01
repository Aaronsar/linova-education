import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import PageHero from '@/components/PageHero';
import { generateArticleCover } from '@/lib/article-cover';

export const metadata: Metadata = {
  title: 'Blog - Metiers, formation et debouches en biologie medicale',
  description:
    "Decouvrez les metiers de la biologie medicale, les debouches apres un BTS, les salaires, et nos conseils pour reussir votre formation. Articles et guides par Linova Education.",
  keywords: ['blog biologie medicale', 'metiers laboratoire', 'debouches BTS biologie', 'salaire technicien laboratoire'],
  alternates: { canonical: '/blog' },
};

// Re-fetch toutes les heures pour récupérer les nouveaux articles publiés
export const revalidate = 3600;

interface BlogCard {
  title: string;
  slug: string;
  /** ISO date for sorting */
  publishedAt: string;
  /** Display date (FR locale) */
  dateLabel: string;
  categories: string[];
  excerpt: string;
  image: string;
}

const FR_MONTHS: Record<string, number> = {
  janvier: 0, fevrier: 1, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, aout: 7, août: 7, septembre: 8, octobre: 9, novembre: 10,
  decembre: 11, décembre: 11,
};

/** Parse "15 mars 2026" → ISO string */
function parseFrDate(str: string): string {
  const parts = str.toLowerCase().trim().split(/\s+/);
  if (parts.length !== 3) return '1970-01-01T00:00:00Z';
  const day = parseInt(parts[0], 10);
  const month = FR_MONTHS[parts[1]];
  const year = parseInt(parts[2], 10);
  if (Number.isNaN(day) || month === undefined || Number.isNaN(year)) {
    return '1970-01-01T00:00:00Z';
  }
  return new Date(Date.UTC(year, month, day, 12)).toISOString();
}

function formatFrDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Extrait une clé d'identification stable à partir d'une URL d'image.
 * Pour Unsplash, on isole l'ID de la photo (`photo-XXX-YYY`) — deux URLs
 * peuvent renvoyer la même photo avec des paramètres ixid différents.
 * Pour les autres, on garde l'URL complète.
 */
function imageKey(url: string): string {
  if (!url) return '';
  const unsplashMatch = url.match(/\/photo-([a-z0-9-]+)/i);
  if (unsplashMatch) return `unsplash:${unsplashMatch[1]}`;
  // SVG data URI : on hashe le contenu encodé pour avoir une clé courte
  if (url.startsWith('data:image/svg+xml')) return url.slice(0, 200);
  return url;
}

// ─── Articles statiques ──────────────────────────────────────────────────────
const STATIC_ARTICLES: BlogCard[] = [
  // Métiers
  { title: 'Devenir technicien de laboratoire medical : missions, salaire, formation', slug: 'technicien-laboratoire-medical', dateLabel: '15 mars 2026', publishedAt: parseFrDate('15 mars 2026'), categories: ['Debouches'], excerpt: "Le metier de technicien de laboratoire medical en detail : missions quotidiennes, grille salariale de 1 800 a 2 800 euros, formation requise et perspectives d'evolution.", image: 'https://images.unsplash.com/photo-1631556760646-50241850eb25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Preleveur en laboratoire : un metier de contact et de precision', slug: 'preleveur-laboratoire', dateLabel: '22 mars 2026', publishedAt: parseFrDate('22 mars 2026'), categories: ['Debouches'], excerpt: "Tout savoir sur le metier de preleveur : techniques de prelevement sanguin, relation patient, salaire et formation pour y acceder.", image: 'https://images.unsplash.com/photo-1596978759889-91e1a654faca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Technicien en microbiologie : traquer les bacteries au quotidien', slug: 'technicien-microbiologie', dateLabel: '28 mars 2026', publishedAt: parseFrDate('28 mars 2026'), categories: ['Debouches'], excerpt: "Bacteries, virus, champignons : le technicien en microbiologie est un detective du vivant. Decouvrez ce metier fascinant et ses debouches.", image: 'https://images.unsplash.com/photo-1631816290961-733476b453f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Technicien en hematologie : le specialiste du sang', slug: 'technicien-hematologie', dateLabel: '2 avril 2026', publishedAt: parseFrDate('2 avril 2026'), categories: ['Debouches'], excerpt: "NFS, groupes sanguins, hemostase : le technicien en hematologie est au coeur du diagnostic medical. Missions, salaire et formation.", image: 'https://images.unsplash.com/photo-1733119883210-04f09d5f86df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Technicien en anatomopathologie : un role cle dans le diagnostic', slug: 'technicien-anatomopathologie', dateLabel: '5 avril 2026', publishedAt: parseFrDate('5 avril 2026'), categories: ['Debouches'], excerpt: "L'anatomopathologie, c'est l'etude des tissus et cellules pour diagnostiquer des maladies. Un metier de precision et de rigueur.", image: 'https://images.unsplash.com/photo-1716833323097-626f97a4dfc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Technicien en biologie de la reproduction : au coeur de la PMA', slug: 'technicien-biologie-reproduction', dateLabel: '24 mars 2026', publishedAt: parseFrDate('24 mars 2026'), categories: ['Debouches'], excerpt: "FIV, ICSI, cryoconservation : le technicien PMA accompagne les couples dans leur projet parental. Un metier porteur de sens.", image: 'https://images.unsplash.com/photo-1580377968562-5f0225d15785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Technicien qualite laboratoire : le garant de la fiabilite', slug: 'technicien-qualite-laboratoire', dateLabel: '27 mars 2026', publishedAt: parseFrDate('27 mars 2026'), categories: ['Debouches'], excerpt: "ISO 15189, COFRAC, audits : le technicien qualite veille a ce que chaque resultat d'analyse soit fiable et conforme. Un profil tres recherche.", image: 'https://images.unsplash.com/photo-1732690233982-1d4567384ea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Technicien de recherche biomedicale : contribuer aux avancees scientifiques', slug: 'technicien-recherche-biomedicale', dateLabel: '1 avril 2026', publishedAt: parseFrDate('1 avril 2026'), categories: ['Debouches'], excerpt: "INSERM, CNRS, essais cliniques : le technicien de recherche est un maillon essentiel de la decouverte medicale. Missions et salaire.", image: 'https://images.unsplash.com/photo-1576670262660-05cf76d53da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Technicien en toxicologie : entre science et enquete', slug: 'technicien-toxicologie', dateLabel: '3 avril 2026', publishedAt: parseFrDate('3 avril 2026'), categories: ['Debouches'], excerpt: "Depistage, pharmacovigilance, medecine legale : la toxicologie offre des debouches varies et passionnants apres un BTS Biologie Medicale.", image: 'https://images.unsplash.com/photo-1758685848544-625ddba413e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: "Technicien a l'EFS : sauver des vies grace au don du sang", slug: 'technicien-efs', dateLabel: '6 avril 2026', publishedAt: parseFrDate('6 avril 2026'), categories: ['Debouches'], excerpt: "L'Etablissement Francais du Sang recrute des techniciens pour la qualification biologique des dons. Un metier utile avec de bonnes conditions.", image: 'https://images.unsplash.com/photo-1771946309002-80d0d41affa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },

  // Anciens articles
  { title: 'Linova obtient la certification Qualiopi : ce que ca change pour vous', slug: 'certification-qualiopi', dateLabel: '10 decembre 2025', publishedAt: parseFrDate('10 decembre 2025'), categories: ['Actualite'], excerpt: "La certification Qualiopi atteste de la qualite de nos formations. Decouvrez les 7 criteres evalues et ce que cela signifie pour votre parcours.", image: 'https://images.unsplash.com/photo-1776039325185-8fd3d46af4e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Les qualites indispensables pour devenir technicien de laboratoire', slug: 'qualites-technicien-laboratoire', dateLabel: '3 octobre 2025', publishedAt: parseFrDate('3 octobre 2025'), categories: ['Debouches'], excerpt: "Rigueur, precision, sens de l'observation... Decouvrez les qualites essentielles pour reussir dans ce metier en tension.", image: 'https://images.unsplash.com/photo-1630959305790-4c956ce6c0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Stage en BTS Biologie Medicale : guide complet pour le reussir', slug: 'stage-bts-biologie-medicale', dateLabel: '3 octobre 2025', publishedAt: parseFrDate('3 octobre 2025'), categories: ['BTS Biologie Medicale'], excerpt: "12 semaines de stage obligatoire : comment trouver, reussir et tirer le meilleur de votre immersion en laboratoire.", image: 'https://images.unsplash.com/photo-1618053448701-5220304dc9ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'BTS Biologie Medicale ou Licence Sciences de la Vie : que choisir ?', slug: 'bts-biologie-medicale-ou-licence', dateLabel: '2 octobre 2025', publishedAt: parseFrDate('2 octobre 2025'), categories: ['Debouches'], excerpt: "Comparaison detaillee entre ces deux formations : insertion, contenu, poursuites d'etudes. Pour quel profil ?", image: 'https://images.unsplash.com/photo-1650632989475-5da50879fb50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: "Comment s'inscrire en BTS Biologie Medicale : le guide etape par etape", slug: 'inscription-bts-biologie-medicale', dateLabel: '2 octobre 2025', publishedAt: parseFrDate('2 octobre 2025'), categories: ['BTS Biologie Medicale'], excerpt: "Parcoursup ou candidature directe, dossier, entretien de motivation : tout savoir pour candidater sereinement.", image: 'https://images.unsplash.com/photo-1762330474636-637ce87b268b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'BTS Biologie Medicale : programme complet, matieres et cours detailles', slug: 'programme-bts-biologie-medicale', dateLabel: '2 octobre 2025', publishedAt: parseFrDate('2 octobre 2025'), categories: ['BTS Biologie Medicale'], excerpt: "510h d'enseignement general, 1335h de professionnel, TP en laboratoire, stages : le programme complet decortique.", image: 'https://images.unsplash.com/photo-1731983568664-9c1d8a87e7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
  { title: 'Quel salaire apres un BTS Biologie Medicale ? Grille complete 2026', slug: 'salaire-bts-biologie-medicale', dateLabel: '16 septembre 2025', publishedAt: parseFrDate('16 septembre 2025'), categories: ['Debouches'], excerpt: "De 1 800 a 2 800 euros : grille de salaires par secteur, evolution de carriere et facteurs d'augmentation.", image: 'https://images.unsplash.com/photo-1657581443324-eafb54f644d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=linova_education&utm_medium=referral' },
];

// Pool d'images utilisées pour les articles dynamiques (Supabase) sans visuel propre.
// On choisit l'image en hashant le slug pour garantir une image stable par article
// tout en variant les visuels d'un article à l'autre.
const DYNAMIC_IMAGE_POOL = [
  '/images/photos/etudiants-labo.png',
  '/images/photos/techniques-analyse.png',
  '/images/photos/boite-petri.png',
  '/images/photos/hematologie.png',
  '/images/photos/microscope.png',
  '/images/photos/travail-binome.png',
  '/images/photos/prof-cours.jpg',
  '/images/photos/tp-concentration.png',
  '/images/photos/cours-amphi.png',
  '/images/photos/future-etudiante.png',
  '/images/photos/etudiants-contents.png',
  '/images/photos/etudiante-bts.png',
  '/images/photos/etudiants-pause.png',
  '/images/photos/campus-vie.png',
];

async function getDynamicArticles(): Promise<BlogCard[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhopwqpbaiyjfoggvcaf.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const { data, error } = await supabase
    .from('linova_articles')
    .select('slug, title, excerpt, category, updated_at, scheduled_at, created_at, cover_image_url')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  if (error || !data) return [];

  const staticSlugs = new Set(STATIC_ARTICLES.map((a) => a.slug));

  return data
    .filter((a) => !staticSlugs.has(a.slug))
    .map((a) => {
      const publishedAt = (a.scheduled_at || a.updated_at || a.created_at) as string;
      return {
        title: a.title,
        slug: a.slug,
        publishedAt,
        dateLabel: formatFrDate(publishedAt),
        categories: [a.category || 'Article'],
        excerpt: a.excerpt || '',
        // Cover Unsplash si dispo, sinon fallback géré côté render
        image: (a.cover_image_url as string | null) || '',
      };
    });
}

export default async function Blog() {
  const dynamicArticles = await getDynamicArticles();

  // Fusion + tri DESC (plus récent en premier)
  const sorted: BlogCard[] = [...dynamicArticles, ...STATIC_ARTICLES].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt)
  );

  // RÈGLE ABSOLUE — aucun article ne doit avoir la même photo qu'un autre.
  //
  // On dédoublonne sur l'ID Unsplash (la partie /photo-XXX), pas sur l'URL
  // complète, car deux recherches Unsplash différentes peuvent renvoyer la
  // même photo avec des paramètres ixid distincts.
  // Si collision détectée → fallback sur cover SVG brandée par slug
  // (unique par construction).
  const usedImageKeys = new Set<string>();
  const allArticles: BlogCard[] = sorted.map((article) => {
    let image = article.image && article.image.length > 0 ? article.image : '';
    let key = imageKey(image);

    if (!image || usedImageKeys.has(key)) {
      image = generateArticleCover({
        slug: article.slug,
        title: article.title,
        category: article.categories[0],
      });
      key = imageKey(image);
    }

    usedImageKeys.add(key);
    return { ...article, image };
  });

  return (
    <>
      <PageHero
        title="Le blog"
        highlight="Linova"
        description="Metiers, debouches, salaires, conseils : tout ce qu'il faut savoir sur la biologie medicale et les carrieres apres un BTS."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-4">
                {allArticles.length} articles
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark">Tous nos articles</h2>
              <p className="text-gray-500 mt-2">Du plus récent au plus ancien.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group border border-gray-100 block"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.categories.map((cat, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-dark group-hover:text-teal transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 capitalize">{article.dateLabel}</span>
                    <span className="text-teal text-sm font-semibold group-hover:underline">Lire →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
