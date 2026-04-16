'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useArticleEditor, estimateReadTime } from '@/lib/admin/useArticleEditor';
import { analyzeSEO } from '@/lib/admin/analyzeSEO';
import ArticleEditor from '@/components/admin/ArticleEditor';
import SEOPanel from '@/components/admin/SEOPanel';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { state, setField, addBlock, updateBlock, deleteBlock, moveBlock, loadArticle } = useArticleEditor();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [improving, setImproving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('linova_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Article introuvable.');
        setLoading(false);
        return;
      }

      loadArticle({
        id: data.id,
        slug: data.slug,
        title: data.title,
        metaTitle: data.meta_title || '',
        metaDescription: data.meta_description || '',
        excerpt: data.excerpt || '',
        category: data.category || 'Métiers',
        focusKeyword: data.focus_keyword || '',
        sections: data.sections || [],
        readTime: data.read_time || '5 min',
        status: data.status || 'draft',
        source: data.source || 'manual',
        scheduledAt: data.scheduled_at
          ? new Date(data.scheduled_at).toISOString().slice(0, 16)
          : '',
      });
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  const handleImprove = async (action: 'seo' | 'geo' | 'humanize' | 'maillage', feedback?: string) => {
    setImproving(action);
    setError('');

    const analysis = analyzeSEO({
      title: state.title,
      metaTitle: state.metaTitle,
      metaDescription: state.metaDescription,
      slug: state.slug,
      focusKeyword: state.focusKeyword,
      sections: state.sections,
    });

    const failedChecks = analysis.checks.filter(c => !c.passed).map(c => `- ${c.label}: ${c.message}`).join('\n');

    try {
      const res = await fetch('/api/admin/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: state.title,
          focusKeyword: state.focusKeyword,
          category: state.category,
          action,
          currentContent: {
            metaTitle: state.metaTitle,
            metaDescription: state.metaDescription,
            sections: state.sections,
          },
          failedChecks,
          feedback: feedback || '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'amélioration.');
        return;
      }

      if (data.sections && data.sections.length > 0) {
        loadArticle({
          ...state,
          sections: data.sections,
          metaTitle: data.metaTitle || state.metaTitle,
          metaDescription: data.metaDescription || state.metaDescription,
        });
      }

      const labels: Record<string, string> = { seo: 'SEO', geo: 'GEO', humanize: 'Humanisation', maillage: 'Maillage interne' };
      setSuccess(`${labels[action] || action} appliqué avec succès !`);
    } catch {
      setError('Erreur réseau.');
    } finally {
      setImproving(null);
    }
  };

  const handleSave = async (publish = false) => {
    if (!state.title.trim() || !state.slug.trim()) {
      setError('Le titre et le slug sont obligatoires.');
      return;
    }

    setSaving(true);
    setError('');

    const analysis = analyzeSEO({
      title: state.title,
      metaTitle: state.metaTitle,
      metaDescription: state.metaDescription,
      slug: state.slug,
      focusKeyword: state.focusKeyword,
      sections: state.sections,
    });

    const readTime = estimateReadTime(state.sections);

    const finalStatus = publish ? 'published' : state.status;
    const { error: supabaseError } = await supabase
      .from('linova_articles')
      .update({
        slug: state.slug,
        title: state.title,
        meta_title: state.metaTitle,
        meta_description: state.metaDescription,
        excerpt: state.excerpt,
        category: state.category,
        focus_keyword: state.focusKeyword,
        sections: state.sections,
        read_time: readTime,
        seo_score: analysis.seoScore,
        geo_score: analysis.geoScore,
        status: finalStatus,
        scheduled_at: finalStatus === 'scheduled' && state.scheduledAt
          ? new Date(state.scheduledAt).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (supabaseError) {
      setError(supabaseError.message.includes('duplicate')
        ? `Le slug "${state.slug}" existe déjà.`
        : supabaseError.message
      );
      setSaving(false);
      return;
    }

    setSuccess(publish ? 'Article publié !' : 'Sauvegardé.');
    setTimeout(() => setSuccess(''), 3000);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <svg className="animate-spin h-8 w-8 text-teal" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <a href="/admin/articles" className="hover:text-teal transition-colors">Articles</a>
            <span>›</span>
            <span className="truncate max-w-xs">{state.title || 'Éditer'}</span>
          </div>
          <h1 className="text-2xl font-bold text-navy">Éditer l&apos;article</h1>
        </div>
        <div className="flex items-center gap-3">
          {state.slug && (
            <a
              href={`/blog/${state.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-teal transition-colors flex items-center gap-1"
            >
              Voir
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-gray-300 transition-colors text-sm cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-5 py-2.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all text-sm cursor-pointer disabled:opacity-50"
          >
            🚀 Publier
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}
      {success && (
        <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{success}</div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ArticleEditor
            state={state}
            setField={setField}
            addBlock={addBlock}
            updateBlock={updateBlock}
            deleteBlock={deleteBlock}
            moveBlock={moveBlock}
          />
        </div>
        <div className="xl:col-span-1">
          <SEOPanel
            title={state.title}
            metaTitle={state.metaTitle}
            metaDescription={state.metaDescription}
            slug={state.slug}
            focusKeyword={state.focusKeyword}
            sections={state.sections}
            onImprove={handleImprove}
            improving={improving}
          />
        </div>
      </div>
    </div>
  );
}
