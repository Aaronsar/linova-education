'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalArticles: number;
  published: number;
  drafts: number;
  totalCandidatures: number;
}

function StatCard({ label, value, color, href }: { label: string; value: number; color: string; href?: string }) {
  const inner = (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow ${href ? 'cursor-pointer' : ''}`}>
      <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalArticles: 0, published: 0, drafts: 0, totalCandidatures: 0 });
  const [recentArticles, setRecentArticles] = useState<{ id: string; title: string; status: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [articlesRes, candidaturesRes] = await Promise.all([
        supabase.from('linova_articles').select('id, title, status, created_at').order('created_at', { ascending: false }),
        supabase.from('candidatures').select('id', { count: 'exact', head: true }),
      ]);

      const articles = articlesRes.data || [];
      setRecentArticles(articles.slice(0, 5));
      setStats({
        totalArticles: articles.length + 17, // 17 static articles
        published: articles.filter(a => a.status === 'published').length + 17,
        drafts: articles.filter(a => a.status === 'draft').length,
        totalCandidatures: candidaturesRes.count || 0,
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  const quickActions = [
    { label: 'Nouvel article', href: '/admin/articles/new', icon: '✍️', color: 'bg-teal text-white' },
    { label: 'Tous les articles', href: '/admin/articles', icon: '📋', color: 'bg-navy text-white' },
    { label: 'Pages du site', href: '/admin/pages', icon: '🗂️', color: 'bg-white border border-gray-200 text-navy' },
    { label: 'Candidatures', href: '/espace-candidature', icon: '👥', color: 'bg-yellow text-navy' },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenue dans le back office Linova Éducation</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Articles au total" value={stats.totalArticles} color="text-navy" href="/admin/articles" />
          <StatCard label="Articles publiés" value={stats.published} color="text-green-600" href="/admin/articles" />
          <StatCard label="Brouillons" value={stats.drafts} color="text-yellow-600" href="/admin/articles" />
          <StatCard label="Candidatures" value={stats.totalCandidatures} color="text-teal" href="/espace-candidature" />
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-sm transition-all hover:scale-105 ${action.color}`}
            >
              <span className="text-xl">{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Derniers articles créés</h2>
          <Link href="/admin/articles" className="text-xs text-teal hover:underline">Voir tout →</Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-500 text-sm">Aucun article créé via le back office pour l&apos;instant.</p>
            <Link href="/admin/articles/new" className="mt-4 inline-block px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:brightness-95 transition-all">
              Créer le premier article
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Titre</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Statut</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-right px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentArticles.map(article => (
                  <tr key={article.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-medium text-navy">{article.title}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        article.status === 'published' ? 'bg-green-100 text-green-700' :
                        article.status === 'draft' ? 'bg-yellow/20 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {article.status === 'published' ? 'Publié' : article.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-xs text-gray-400">
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/admin/articles/${article.id}`} className="text-xs text-teal hover:underline">
                        Éditer →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Site overview */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Structure du site</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { section: 'Formation', count: 1, pages: ['BTS Biologie Médicale'], color: 'border-l-teal' },
            { section: 'École', count: 5, pages: ['Pourquoi Linova', 'Notre expertise', 'Démarche qualité', 'Qualiopi', 'Accessibilité'], color: 'border-l-navy' },
            { section: 'Infos pratiques', count: 4, pages: ['Admission', 'Tarifs', 'Campus', 'Handicap'], color: 'border-l-yellow' },
          ].map(s => (
            <div key={s.section} className={`bg-white border border-gray-200 border-l-4 ${s.color} rounded-2xl p-5`}>
              <div className="font-bold text-navy text-sm mb-2">{s.section}</div>
              <div className="text-xs text-gray-400 mb-3">{s.count} page(s)</div>
              <ul className="space-y-1">
                {s.pages.map(p => (
                  <li key={p} className="text-xs text-gray-500">• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
