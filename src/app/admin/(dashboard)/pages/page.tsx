import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pages du site | Linova Admin',
};

const SITE_PAGES = [
  {
    section: 'Pages principales',
    pages: [
      { url: '/', label: 'Accueil', description: 'Page d\'accueil du site', status: 'published' },
      { url: '/entreprises', label: 'Entreprises', description: 'Page partenaires entreprises', status: 'published' },
      { url: '/dossier-inscription-alternance', label: 'Dossier inscription alternance', description: 'Formulaire de dossier', status: 'published' },
      { url: '/inscription-initial', label: 'Dossier inscription initiale', description: 'Formulaire formation initiale 2026-2028 (6 000 €)', status: 'published' },
      { url: '/inscription-initial-2a', label: 'Inscription initiale — 2e année', description: 'Entrée en 2ᵉ année BTS BM · 5 000 € / an · 4 000 € boursiers', status: 'published' },
    ],
  },
  {
    section: 'Formation',
    pages: [
      { url: '/formations/bts-biologie-medicale', label: 'BTS Biologie Médicale', description: 'Page principale de la formation RNCP 40027', status: 'published' },
    ],
  },
  {
    section: 'École',
    pages: [
      { url: '/ecole/pourquoi-linova', label: 'Pourquoi Linova ?', description: 'Arguments différenciants de l\'école', status: 'published' },
      { url: '/ecole/notre-expertise', label: 'Notre expertise', description: 'Expertise pédagogique de Linova', status: 'published' },
      { url: '/ecole/demarche-qualite', label: 'Démarche qualité', description: 'Engagement qualité et processus', status: 'published' },
      { url: '/ecole/qualiopi', label: 'Certification Qualiopi', description: 'Certification qualité Qualiopi', status: 'published' },
      { url: '/ecole/accessibilite', label: 'Accessibilité', description: 'Engagement accessibilité PMR', status: 'published' },
    ],
  },
  {
    section: 'Informations pratiques',
    pages: [
      { url: '/infos-pratiques/admission', label: 'Admission', description: 'Procédure d\'admission et Parcoursup', status: 'published' },
      { url: '/infos-pratiques/tarifs', label: 'Tarifs', description: 'Coûts de formation et financement', status: 'published' },
      { url: '/infos-pratiques/campus', label: 'Campus', description: 'Localisation et infrastructure', status: 'published' },
      { url: '/infos-pratiques/handicap-accessibilite', label: 'Handicap & Accessibilité', description: 'Accompagnement des étudiants en situation de handicap', status: 'published' },
    ],
  },
  {
    section: 'Espace candidature',
    pages: [
      { url: '/espace-candidature', label: 'Gestion des candidatures', description: 'Back office des inscriptions (séparé)', status: 'private', isPrivate: true },
      { url: '/espace-candidature/login', label: 'Login candidatures', description: 'Page de connexion espace candidature', status: 'private', isPrivate: true },
    ],
  },
];

export default function PagesOverview() {
  const totalPages = SITE_PAGES.reduce((acc, s) => acc + s.pages.length, 0);

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Pages du site</h1>
        <p className="text-sm text-gray-500 mt-1">
          {totalPages} pages statiques — éditables via le code source
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="text-2xl shrink-0">ℹ️</div>
        <div>
          <div className="font-semibold text-blue-900 text-sm">Pages statiques</div>
          <p className="text-sm text-blue-700 mt-1">
            Ces pages sont intégrées directement dans le code Next.js. Pour modifier leur contenu ou leur SEO, il faut éditer les fichiers <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">page.tsx</code> correspondants dans <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">src/app/</code>.
            Les articles de blog créés via le générateur IA sont gérés dans la section <Link href="/admin/articles" className="underline">Articles</Link>.
          </p>
        </div>
      </div>

      {/* Pages by section */}
      <div className="space-y-6">
        {SITE_PAGES.map(section => (
          <div key={section.section}>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">{section.section}</h2>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-50">
                  {section.pages.map(page => (
                    <tr key={page.url} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-navy text-sm">{page.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5 font-mono">{page.url}</div>
                        <div className="text-xs text-gray-500 mt-1">{page.description}</div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {'isPrivate' in page && page.isPrivate ? (
                          <span className="inline-block text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
                            Privée
                          </span>
                        ) : (
                          <span className="inline-block text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
                            Publiée
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {'isPrivate' in page && page.isPrivate ? (
                          <a
                            href={page.url}
                            className="text-xs text-gray-400 hover:text-teal transition-colors flex items-center gap-1 justify-end"
                          >
                            Accéder
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-teal transition-colors flex items-center gap-1 justify-end"
                          >
                            Voir la page
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
