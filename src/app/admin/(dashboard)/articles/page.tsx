'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ArticlesList, { ArticleRow } from '@/components/admin/ArticlesList';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('linova_articles')
      .select('id, slug, title, category, status, seo_score, geo_score, created_at, source')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setArticles(data as ArticleRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('linova_articles').delete().eq('id', id);
    if (!error) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Articles & Blog</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez tous les articles du site Linova</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvel article
        </Link>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs font-medium">Statique</span>
          <span>Article intégré en code — non éditable via le back office</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-teal"></span>
          <span>Article dynamique — créé et géré via le back office</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-teal" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <ArticlesList dynamicArticles={articles} onDelete={handleDelete} />
      )}
    </div>
  );
}
