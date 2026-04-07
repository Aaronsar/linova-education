import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Blog',
  description: "Actualités, conseils et guides sur le BTS Biologie Médicale, les métiers de la santé et la formation en alternance.",
};

const articles = [
  {
    title: 'Linova Formation obtient la certification Qualiopi',
    date: '10 décembre 2025',
    categories: ['Actualité'],
    excerpt: "La certification Qualiopi atteste de la qualité de nos processus de formation et de notre engagement envers l'excellence pédagogique.",
  },
  {
    title: 'Les qualités indispensables pour devenir technicien(ne) de laboratoire',
    date: '3 octobre 2025',
    categories: ['Débouchés'],
    excerpt: "Rigueur, précision, sens de l'observation... Découvrez les qualités essentielles pour réussir dans ce métier en tension.",
  },
  {
    title: 'Stage en BTS Biologie Médicale : comment le réussir et en tirer le meilleur ?',
    date: '3 octobre 2025',
    categories: ['BTS Biologie Médicale'],
    excerpt: "Conseils pratiques pour tirer le maximum de votre stage en laboratoire et construire votre réseau professionnel.",
  },
  {
    title: 'BTS Biologie Médicale ou Licence Sciences de la Vie : que choisir ?',
    date: '2 octobre 2025',
    categories: ['Débouchés'],
    excerpt: "Comparaison détaillée entre ces deux formations pour vous aider à faire le bon choix selon votre projet professionnel.",
  },
  {
    title: "Comment s'inscrire à un BTS Biologie Médicale ?",
    date: '2 octobre 2025',
    categories: ['BTS Biologie Médicale'],
    excerpt: "Guide complet des étapes d'inscription, des prérequis aux délais, pour intégrer cette formation porteuse.",
  },
  {
    title: 'BTS Biologie Médicale : matières, cours et programme détaillé',
    date: '2 octobre 2025',
    categories: ['BTS Biologie Médicale'],
    excerpt: "Tout savoir sur le programme de formation : matières générales, enseignements professionnels et stages.",
  },
  {
    title: 'BTS Biologie Médicale Paris : quelle école choisir ?',
    date: '11 novembre 2025',
    categories: ['Actualité'],
    excerpt: "Critères de choix et comparaison des écoles proposant le BTS Biologie Médicale à Paris.",
  },
  {
    title: 'Biologie médicale et intelligence artificielle : quels impacts ?',
    date: '16 septembre 2025',
    categories: ['Actualité'],
    excerpt: "L'IA transforme le secteur de la biologie médicale. Quels sont les impacts pour les futurs techniciens de laboratoire ?",
  },
  {
    title: "Devenir technicien(ne) de laboratoire : portrait d'un métier en tension",
    date: '16 septembre 2025',
    categories: ['Débouchés'],
    excerpt: "Immersion dans le quotidien d'un technicien de laboratoire : missions, environnement, perspectives d'évolution.",
  },
  {
    title: 'Quel salaire après un BTS Biologie Médicale ?',
    date: '16 septembre 2025',
    categories: ['Débouchés'],
    excerpt: "Grille de salaires, évolutions de carrière et facteurs qui influencent la rémunération dans ce secteur.",
  },
];

export default function Blog() {
  return (
    <>
      <PageHero
        title="Le blog"
        highlight="Linova"
        description="Actualités, conseils et guides pour votre orientation dans les métiers de la santé."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <article
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group border border-gray-100"
              >
                <div className="aspect-[16/9] bg-light flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.categories.map((cat, j) => (
                      <span key={j} className="px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-lg font-bold text-dark group-hover:text-teal transition-colors mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{article.date}</span>
                    <span className="text-teal text-sm font-semibold group-hover:underline">
                      Lire la suite →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
