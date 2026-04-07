import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Blog - Metiers, formation et debouches en biologie medicale',
  description: "Decouvrez les metiers de la biologie medicale, les debouches apres un BTS, les salaires, et nos conseils pour reussir votre formation. Articles et guides par Linova Education.",
  keywords: ['blog biologie medicale', 'metiers laboratoire', 'debouches BTS biologie', 'salaire technicien laboratoire'],
  alternates: { canonical: '/blog' },
};

const careerArticles = [
  {
    title: 'Devenir technicien de laboratoire medical : missions, salaire, formation',
    slug: 'technicien-laboratoire-medical',
    date: '15 mars 2026',
    categories: ['Debouches'],
    excerpt: "Le metier de technicien de laboratoire medical en detail : missions quotidiennes, grille salariale de 1 800 a 2 800 euros, formation requise et perspectives d'evolution.",
    image: '/images/photos/etudiants-labo.png',
  },
  {
    title: 'Preleveur en laboratoire : un metier de contact et de precision',
    slug: 'preleveur-laboratoire',
    date: '22 mars 2026',
    categories: ['Debouches'],
    excerpt: "Tout savoir sur le metier de preleveur : techniques de prelevement sanguin, relation patient, salaire et formation pour y acceder.",
    image: '/images/photos/techniques-analyse.png',
  },
  {
    title: 'Technicien en microbiologie : traquer les bacteries au quotidien',
    slug: 'technicien-microbiologie',
    date: '28 mars 2026',
    categories: ['Debouches'],
    excerpt: "Bacteries, virus, champignons : le technicien en microbiologie est un detective du vivant. Decouvrez ce metier fascinant et ses debouches.",
    image: '/images/photos/boite-petri.png',
  },
  {
    title: 'Technicien en hematologie : le specialiste du sang',
    slug: 'technicien-hematologie',
    date: '2 avril 2026',
    categories: ['Debouches'],
    excerpt: "NFS, groupes sanguins, hemostase : le technicien en hematologie est au coeur du diagnostic medical. Missions, salaire et formation.",
    image: '/images/photos/hematologie.png',
  },
  {
    title: 'Technicien en anatomopathologie : un role cle dans le diagnostic',
    slug: 'technicien-anatomopathologie',
    date: '5 avril 2026',
    categories: ['Debouches'],
    excerpt: "L'anatomopathologie, c'est l'etude des tissus et cellules pour diagnostiquer des maladies. Un metier de precision et de rigueur.",
    image: '/images/photos/microscope.png',
  },
  {
    title: 'Technicien en biologie de la reproduction : au coeur de la PMA',
    slug: 'technicien-biologie-reproduction',
    date: '24 mars 2026',
    categories: ['Debouches'],
    excerpt: "FIV, ICSI, cryoconservation : le technicien PMA accompagne les couples dans leur projet parental. Un metier porteur de sens.",
    image: '/images/photos/microscope.png',
  },
  {
    title: 'Technicien qualite laboratoire : le garant de la fiabilite',
    slug: 'technicien-qualite-laboratoire',
    date: '27 mars 2026',
    categories: ['Debouches'],
    excerpt: "ISO 15189, COFRAC, audits : le technicien qualite veille a ce que chaque resultat d'analyse soit fiable et conforme. Un profil tres recherche.",
    image: '/images/photos/techniques-analyse.png',
  },
  {
    title: 'Technicien de recherche biomedicale : contribuer aux avancees scientifiques',
    slug: 'technicien-recherche-biomedicale',
    date: '1 avril 2026',
    categories: ['Debouches'],
    excerpt: "INSERM, CNRS, essais cliniques : le technicien de recherche est un maillon essentiel de la decouverte medicale. Missions et salaire.",
    image: '/images/photos/boite-petri.png',
  },
  {
    title: 'Technicien en toxicologie : entre science et enquete',
    slug: 'technicien-toxicologie',
    date: '3 avril 2026',
    categories: ['Debouches'],
    excerpt: "Depistage, pharmacovigilance, medecine legale : la toxicologie offre des debouches varies et passionnants apres un BTS Biologie Medicale.",
    image: '/images/photos/hematologie.png',
  },
  {
    title: "Technicien a l'EFS : sauver des vies grace au don du sang",
    slug: 'technicien-efs',
    date: '6 avril 2026',
    categories: ['Debouches'],
    excerpt: "L'Etablissement Francais du Sang recrute des techniciens pour la qualification biologique des dons. Un metier utile avec de bonnes conditions.",
    image: '/images/photos/travail-binome.png',
  },
];

const legacyArticles = [
  {
    title: 'Linova Formation obtient la certification Qualiopi',
    date: '10 decembre 2025',
    categories: ['Actualite'],
    excerpt: "La certification Qualiopi atteste de la qualite de nos processus de formation et de notre engagement envers l'excellence pedagogique.",
    image: '/images/photos/prof-cours.jpg',
    href: '/ecole/qualiopi',
  },
  {
    title: 'Les qualites indispensables pour devenir technicien(ne) de laboratoire',
    date: '3 octobre 2025',
    categories: ['Debouches'],
    excerpt: "Rigueur, precision, sens de l'observation... Decouvrez les qualites essentielles pour reussir dans ce metier en tension.",
    image: '/images/photos/tp-concentration.png',
    href: '/blog/technicien-laboratoire-medical',
  },
  {
    title: 'Stage en BTS Biologie Medicale : comment le reussir ?',
    date: '3 octobre 2025',
    categories: ['BTS Biologie Medicale'],
    excerpt: "Conseils pratiques pour tirer le maximum de votre stage en laboratoire et construire votre reseau professionnel.",
    image: '/images/photos/etudiants-labo.png',
    href: '/formations/bts-biologie-medicale',
  },
  {
    title: 'BTS Biologie Medicale ou Licence Sciences de la Vie : que choisir ?',
    date: '2 octobre 2025',
    categories: ['Debouches'],
    excerpt: "Comparaison detaillee entre ces deux formations pour vous aider a faire le bon choix selon votre projet professionnel.",
    image: '/images/photos/cours-amphi.png',
    href: '/formations/bts-biologie-medicale',
  },
  {
    title: "Comment s'inscrire a un BTS Biologie Medicale ?",
    date: '2 octobre 2025',
    categories: ['BTS Biologie Medicale'],
    excerpt: "Guide complet des etapes d'inscription, des prerequis aux delais, pour integrer cette formation porteuse.",
    image: '/images/photos/future-etudiante.png',
    href: '/infos-pratiques/admission',
  },
  {
    title: 'BTS Biologie Medicale : matieres, cours et programme detaille',
    date: '2 octobre 2025',
    categories: ['BTS Biologie Medicale'],
    excerpt: "Tout savoir sur le programme de formation : matieres generales, enseignements professionnels et stages.",
    image: '/images/photos/techniques-analyse.png',
    href: '/formations/bts-biologie-medicale',
  },
  {
    title: 'Quel salaire apres un BTS Biologie Medicale ?',
    date: '16 septembre 2025',
    categories: ['Debouches'],
    excerpt: "Grille de salaires, evolutions de carriere et facteurs qui influencent la remuneration dans ce secteur.",
    image: '/images/photos/etudiants-contents.png',
    href: '/blog/technicien-laboratoire-medical',
  },
];

export default function Blog() {
  return (
    <>
      <PageHero
        title="Le blog"
        highlight="Linova"
        description="Metiers, debouches, salaires, conseils : tout ce qu'il faut savoir sur la biologie medicale et les carrieres apres un BTS."
      />

      {/* Featured: Career articles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-4">Nouveaux articles</span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark">Les metiers apres un BTS Biologie Medicale</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careerArticles.map((article, i) => (
              <Link
                key={i}
                href={`/blog/${article.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group border border-gray-100 block"
              >
                <div className="relative aspect-[16/9]">
                  <Image src={article.image} alt={article.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.categories.map((cat, j) => (
                      <span key={j} className="px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-dark group-hover:text-teal transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{article.date}</span>
                    <span className="text-teal text-sm font-semibold group-hover:underline">
                      Lire →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Older articles */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-12">Tous nos articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legacyArticles.map((article, i) => (
              <Link
                key={i}
                href={article.href}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group border border-gray-100 block"
              >
                <div className="relative aspect-[16/9]">
                  <Image src={article.image} alt={article.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.categories.map((cat, j) => (
                      <span key={j} className="px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-dark group-hover:text-teal transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{article.date}</span>
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
