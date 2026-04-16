'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  seo_score: number;
  geo_score: number;
  created_at: string;
  source: string;
  isStatic?: boolean;
}

const STATIC_ARTICLES: ArticleRow[] = [
  { id: 'static-1', slug: 'technicien-laboratoire-medical', title: 'Technicien de laboratoire médical', category: 'Métiers', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-2', slug: 'preleveur-laboratoire', title: 'Préleveur de laboratoire', category: 'Métiers', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-3', slug: 'technicien-microbiologie', title: 'Technicien en microbiologie', category: 'Métiers', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-4', slug: 'technicien-hematologie', title: 'Technicien en hématologie', category: 'Métiers', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-5', slug: 'technicien-anatomopathologie', title: 'Technicien en anatomopathologie', category: 'Métiers', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-6', slug: 'technicien-biologie-reproduction', title: 'Technicien en biologie de la reproduction', category: 'Métiers', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-7', slug: 'technicien-qualite-laboratoire', title: 'Technicien qualité laboratoire', category: 'Métiers', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-8', slug: 'technicien-recherche-biomedicale', title: 'Technicien en recherche biomédicale', category: 'Métiers', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-9', slug: 'technicien-toxicologie', title: 'Technicien en toxicologie', category: 'Métiers', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-10', slug: 'technicien-efs', title: 'Technicien à l\'EFS', category: 'Métiers', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-04-06', source: 'static', isStatic: true },
  { id: 'static-11', slug: 'certification-qualiopi', title: 'Certification Qualiopi', category: 'Formation', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-12', slug: 'qualites-technicien-laboratoire', title: 'Qualités du technicien de laboratoire', category: 'Formation', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-13', slug: 'stage-bts-biologie-medicale', title: 'Stage BTS Biologie Médicale', category: 'Formation', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-14', slug: 'bts-biologie-medicale-ou-licence', title: 'BTS Biologie Médicale ou Licence ?', category: 'Formation', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-15', slug: 'inscription-bts-biologie-medicale', title: 'Inscription BTS Biologie Médicale', category: 'Formation', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-16', slug: 'programme-bts-biologie-medicale', title: 'Programme BTS Biologie Médicale', category: 'Formation', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
  { id: 'static-17', slug: 'salaire-bts-biologie-medicale', title: 'Salaire BTS Biologie Médicale', category: 'Formation', status: 'published', seo_score: 0, geo_score: 0, created_at: '2026-01-01', source: 'static', isStatic: true },
];

const STATUS_CONFIG = {
  published: { label: 'Publié', bg: 'bg-green-100', text: 'text-green-700' },
  draft: { label: 'Brouillon', bg: 'bg-yellow/20', text: 'text-yellow-700' },
  archived: { label: 'Archivé', bg: 'bg-gray-100', text: 'text-gray-600' },
};

function ScoreBadge({ score, type }: { score: number; type: 'seo' | 'geo' }) {
  if (score === 0) return <span className="text-gray-300 text-xs">—</span>;
  const color = score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-500';
  return (
    <span className={`text-xs font-bold ${color}`}>
      {score}
      <span className="text-gray-400 font-normal">/100</span>
    </span>
  );
}

interface Props {
  dynamicArticles: ArticleRow[];
  onDelete: (id: string) => Promise<void>;
}

export default function ArticlesList({ dynamicArticles, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const allArticles = [...dynamicArticles, ...STATIC_ARTICLES];

  const filtered = allArticles.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q);
    const matchCat = !filterCategory || a.category === filterCategory;
    const matchStatus = !filterStatus || a.status === filterStatus;
    const matchSource = !filterSource || (filterSource === 'static' ? a.isStatic : !a.isStatic);
    return matchSearch && matchCat && matchStatus && matchSource;
  });

  const categories = [...new Set(allArticles.map(a => a.category))];

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer l'article "${title}" ?`)) return;
    setDeleting(id);
    await onDelete(id);
    setDeleting(null);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
          </div>
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white text-gray-600"
        >
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white text-gray-600"
        >
          <option value="">Tous statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
          <option value="archived">Archivé</option>
        </select>

        <select
          value={filterSource}
          onChange={e => setFilterSource(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white text-gray-600"
        >
          <option value="">Toutes sources</option>
          <option value="dynamic">Dynamiques</option>
          <option value="static">Statiques</option>
        </select>
      </div>

      {/* Count */}
      <div className="text-xs text-gray-500">
        {filtered.length} article(s) affiché(s) — {dynamicArticles.length} dynamique(s) + {STATIC_ARTICLES.length} statique(s)
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Titre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Catégorie</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">SEO</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">GEO</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(article => {
                const statusConf = STATUS_CONFIG[article.status];
                return (
                  <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-start gap-2">
                        <div>
                          <div className="font-medium text-navy text-sm leading-tight">{article.title}</div>
                          <div className="text-xs text-gray-400 mt-0.5 font-mono">/blog/{article.slug}</div>
                        </div>
                        {article.isStatic && (
                          <span className="shrink-0 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">Statique</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-gray-600">{article.category}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${statusConf.bg} ${statusConf.text}`}>
                        {statusConf.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <ScoreBadge score={article.seo_score} type="seo" />
                    </td>
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <ScoreBadge score={article.geo_score} type="geo" />
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-gray-400">
                      {formatDate(article.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-teal transition-colors"
                          title="Voir"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        {!article.isStatic && (
                          <>
                            <Link
                              href={`/admin/articles/${article.id}`}
                              className="text-xs text-gray-500 hover:text-navy transition-colors"
                              title="Éditer"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(article.id, article.title)}
                              disabled={deleting === article.id}
                              className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer"
                              title="Supprimer"
                            >
                              {deleting === article.id ? (
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                    Aucun article trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
