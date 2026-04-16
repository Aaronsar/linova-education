'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface TodoArticle {
  id: number;
  title: string;
  focusKeyword: string;
  category: 'Métiers' | 'Formation' | 'Alternance' | 'Vie étudiante';
  priority: 'haute' | 'moyenne' | 'longue-traine';
  description: string;
  slug: string; // slug anticipé pour vérifier si déjà publié
}

const TODO_ARTICLES: TodoArticle[] = [
  // 🔥 Priorité haute
  {
    id: 1,
    title: 'BTS Biologie Médicale en alternance : tout ce qu\'il faut savoir',
    focusKeyword: 'bts biologie médicale alternance',
    category: 'Alternance',
    priority: 'haute',
    description: 'Fort volume de recherche — attire directement les candidats à l\'alternance.',
    slug: 'bts-biologie-medicale-alternance',
  },
  {
    id: 2,
    title: 'BTS Biologie Médicale Paris : les meilleures écoles en 2025',
    focusKeyword: 'bts biologie médicale paris',
    category: 'Formation',
    priority: 'haute',
    description: 'Mot-clé local très ciblé — positionne Linova face à la concurrence parisienne.',
    slug: 'bts-biologie-medicale-paris',
  },
  {
    id: 3,
    title: 'BTS Biologie Médicale sur Parcoursup : comment candidater ?',
    focusKeyword: 'bts biologie médicale parcoursup',
    category: 'Formation',
    priority: 'haute',
    description: 'Pic de recherche annuel en janvier-mars — trafic qualifié d\'étudiants en lycée.',
    slug: 'bts-biologie-medicale-parcoursup',
  },
  {
    id: 4,
    title: 'Débouchés du BTS Biologie Médicale : métiers et salaires',
    focusKeyword: 'débouchés bts biologie médicale',
    category: 'Formation',
    priority: 'haute',
    description: 'Question clé de tout futur étudiant — fort potentiel de conversion.',
    slug: 'debouches-bts-biologie-medicale',
  },
  {
    id: 5,
    title: 'Après un BTS Biologie Médicale : poursuites d\'études possibles',
    focusKeyword: 'poursuite études bts biologie médicale',
    category: 'Formation',
    priority: 'haute',
    description: 'Capture les lycéens qui hésitent et veulent voir les perspectives long terme.',
    slug: 'poursuite-etudes-bts-biologie-medicale',
  },
  // 🟡 Priorité moyenne
  {
    id: 6,
    title: 'Comment trouver une alternance en biologie médicale ?',
    focusKeyword: 'alternance biologie médicale',
    category: 'Alternance',
    priority: 'moyenne',
    description: 'Guide pratique pour trouver un maître d\'apprentissage en labo médical.',
    slug: 'trouver-alternance-biologie-medicale',
  },
  {
    id: 7,
    title: 'Financement du BTS Biologie Médicale en alternance : OPCO, CPF…',
    focusKeyword: 'financement bts biologie médicale',
    category: 'Alternance',
    priority: 'moyenne',
    description: 'Argument décisif : montrer que la formation est gratuite en alternance.',
    slug: 'financement-bts-biologie-medicale',
  },
  {
    id: 8,
    title: 'BTS Biologie Médicale est-il difficile ? Niveau et matières',
    focusKeyword: 'bts biologie médicale difficile',
    category: 'Formation',
    priority: 'moyenne',
    description: 'Question anxiogène très recherchée — rassurer et donner des clés concrètes.',
    slug: 'bts-biologie-medicale-difficile',
  },
  {
    id: 9,
    title: 'Technicien en immunologie : missions, salaire et formation',
    focusKeyword: 'technicien immunologie',
    category: 'Métiers',
    priority: 'moyenne',
    description: 'Spécialité manquante dans le blog — complète la couverture des métiers.',
    slug: 'technicien-immunologie',
  },
  {
    id: 10,
    title: 'Technicien en génétique médicale : un métier d\'avenir',
    focusKeyword: 'technicien génétique médicale',
    category: 'Métiers',
    priority: 'moyenne',
    description: 'Spécialité en forte croissance avec les tests génétiques prénataux.',
    slug: 'technicien-genetique-medicale',
  },
  {
    id: 11,
    title: 'Technicien en parasitologie-mycologie : rôle et formation',
    focusKeyword: 'technicien parasitologie',
    category: 'Métiers',
    priority: 'moyenne',
    description: 'Complète la couverture des disciplines du BTS — faible concurrence.',
    slug: 'technicien-parasitologie',
  },
  {
    id: 12,
    title: 'Journée type d\'un technicien de biologie médicale',
    focusKeyword: 'journée technicien biologie médicale',
    category: 'Métiers',
    priority: 'moyenne',
    description: 'Format storytelling très partagé — immersion dans le quotidien du labo.',
    slug: 'journee-type-technicien-biologie-medicale',
  },
  {
    id: 13,
    title: 'BTS Biologie Médicale ou BTS Analyses de Biologie Médicale ?',
    focusKeyword: 'bts analyses biologie médicale',
    category: 'Formation',
    priority: 'moyenne',
    description: 'Comparatif pour les étudiants qui hésitent entre les deux formations.',
    slug: 'bts-biologie-medicale-ou-analyses',
  },
  // 🟢 Longue traîne
  {
    id: 14,
    title: 'BTS Biologie Médicale après un Bac STL : le guide complet',
    focusKeyword: 'bts biologie médicale bac stl',
    category: 'Formation',
    priority: 'longue-traine',
    description: 'Longue traîne ciblée sur le profil STL — faible concurrence.',
    slug: 'bts-biologie-medicale-bac-stl',
  },
  {
    id: 15,
    title: 'Quel bac pour faire un BTS Biologie Médicale ?',
    focusKeyword: 'bac pour bts biologie médicale',
    category: 'Formation',
    priority: 'longue-traine',
    description: 'Question posée par les 3e/2nde — article de sensibilisation précoce.',
    slug: 'quel-bac-bts-biologie-medicale',
  },
  {
    id: 16,
    title: 'Technicien en laboratoire d\'analyses médicales : statut et convention collective',
    focusKeyword: 'convention collective laboratoire médical',
    category: 'Métiers',
    priority: 'longue-traine',
    description: 'Article technique très recherché par les professionnels en poste.',
    slug: 'convention-collective-laboratoire-medical',
  },
  {
    id: 17,
    title: 'Travailler dans un laboratoire de ville : le quotidien du technicien',
    focusKeyword: 'technicien laboratoire ville',
    category: 'Métiers',
    priority: 'longue-traine',
    description: 'Différenciation labo ville vs hôpital — complément utile au blog.',
    slug: 'technicien-laboratoire-ville',
  },
  {
    id: 18,
    title: 'Technicien en biochimie médicale : spécialités et débouchés',
    focusKeyword: 'technicien biochimie médicale',
    category: 'Métiers',
    priority: 'longue-traine',
    description: 'Spécialité manquante — biochimie est une discipline majeure du BTS.',
    slug: 'technicien-biochimie-medicale',
  },
  {
    id: 19,
    title: 'Le BTS Biologie Médicale en apprentissage : avantages et témoignages',
    focusKeyword: 'bts biologie médicale apprentissage',
    category: 'Alternance',
    priority: 'longue-traine',
    description: 'Format témoignage — contenu très engageant et partageable.',
    slug: 'bts-biologie-medicale-apprentissage',
  },
  {
    id: 20,
    title: 'Technicien hospitalier en biologie médicale : carrière à l\'hôpital',
    focusKeyword: 'technicien hospitalier biologie médicale',
    category: 'Métiers',
    priority: 'longue-traine',
    description: 'Segment hospitalier peu couvert — différenciation secteur public/privé.',
    slug: 'technicien-hospitalier-biologie-medicale',
  },
];

const PRIORITY_CONFIG = {
  haute: { label: '🔥 Priorité haute', badge: 'bg-red-100 text-red-700', order: 0 },
  moyenne: { label: '🟡 Priorité moyenne', badge: 'bg-yellow/20 text-yellow-700', order: 1 },
  'longue-traine': { label: '🟢 Longue traîne', badge: 'bg-green-100 text-green-700', order: 2 },
};

const CATEGORY_COLORS: Record<string, string> = {
  'Métiers': 'bg-teal/10 text-teal',
  'Formation': 'bg-navy/10 text-navy',
  'Alternance': 'bg-yellow/20 text-yellow-800',
  'Vie étudiante': 'bg-purple-100 text-purple-700',
};

export default function TodoArticlesPage() {
  const [publishedSlugs, setPublishedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  useEffect(() => {
    const fetchPublished = async () => {
      const { data } = await supabase
        .from('linova_articles')
        .select('slug')
        .in('status', ['published', 'scheduled', 'draft']);
      if (data) {
        setPublishedSlugs(new Set(data.map((a: { slug: string }) => a.slug)));
      }
      setLoading(false);
    };
    fetchPublished();
  }, []);

  const getStatus = (article: TodoArticle) => {
    if (publishedSlugs.has(article.slug)) return 'exist';
    return 'todo';
  };

  const filtered = TODO_ARTICLES.filter(a => {
    const matchPriority = !filterPriority || a.priority === filterPriority;
    const matchCat = !filterCategory || a.category === filterCategory;
    return matchPriority && matchCat;
  });

  const done = TODO_ARTICLES.filter(a => publishedSlugs.has(a.slug)).length;
  const todo = TODO_ARTICLES.length - done;

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Articles à créer</h1>
          <p className="text-sm text-gray-500 mt-1">
            Plan de contenu SEO — {todo} restants · {done} créés
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Générer un article
        </Link>
      </div>

      {/* Progression */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-navy">Progression</span>
          <span className="text-sm font-bold text-teal">{done}/{TODO_ARTICLES.length}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal rounded-full transition-all duration-700"
            style={{ width: `${(done / TODO_ARTICLES.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-6 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-teal"></div>
            {done} créés
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
            {todo} à faire
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal/30"
        >
          <option value="">Toutes priorités</option>
          <option value="haute">🔥 Priorité haute</option>
          <option value="moyenne">🟡 Priorité moyenne</option>
          <option value="longue-traine">🟢 Longue traîne</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal/30"
        >
          <option value="">Toutes catégories</option>
          <option value="Métiers">Métiers</option>
          <option value="Formation">Formation</option>
          <option value="Alternance">Alternance</option>
          <option value="Vie étudiante">Vie étudiante</option>
        </select>
        <span className="text-xs text-gray-400 flex items-center">{filtered.length} article(s) affiché(s)</span>
      </div>

      {/* Articles list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-teal" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(article => {
            const status = getStatus(article);
            const priorityConf = PRIORITY_CONFIG[article.priority];

            return (
              <div
                key={article.id}
                className={`bg-white border rounded-2xl p-5 transition-all ${
                  status === 'exist' ? 'border-green-200 opacity-75' : 'border-gray-200 hover:border-teal/30 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Number + status */}
                  <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    status === 'exist' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {status === 'exist' ? '✓' : article.id}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={`font-semibold text-sm leading-tight ${status === 'exist' ? 'text-gray-500 line-through' : 'text-navy'}`}>
                        {article.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConf.badge}`}>
                        {priorityConf.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[article.category]}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        🔑 {article.focusKeyword}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">{article.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2">
                    {status === 'exist' ? (
                      <a
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 font-semibold flex items-center gap-1 hover:underline"
                      >
                        Voir
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={`/admin/articles/new?title=${encodeURIComponent(article.title)}&keyword=${encodeURIComponent(article.focusKeyword)}&category=${encodeURIComponent(article.category)}`}
                        className="flex items-center gap-1.5 px-3 py-2 bg-teal text-white text-xs font-semibold rounded-xl hover:brightness-95 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Générer
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
