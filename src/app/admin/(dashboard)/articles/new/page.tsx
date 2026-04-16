'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useArticleEditor, estimateReadTime, ArticleCategory } from '@/lib/admin/useArticleEditor';
import { analyzeSEO, ArticleSection } from '@/lib/admin/analyzeSEO';
import ArticleEditor from '@/components/admin/ArticleEditor';
import SEOPanel from '@/components/admin/SEOPanel';

export default function NewArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, setField, addBlock, updateBlock, deleteBlock, moveBlock, loadArticle } = useArticleEditor();
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [improving, setImproving] = useState<string | null>(null);
  const [generateForm, setGenerateForm] = useState({ title: '', focusKeyword: '', category: 'Métiers' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const title = searchParams.get('title') || '';
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || 'Métiers';
    if (title) setGenerateForm({ title, focusKeyword: keyword, category });
  }, [searchParams]);

  // ─── Appel API amélioration ──────────────────────────────────────────────────
  const callImproveAPI = async (
    action: string,
    articleTitle: string,
    articleKeyword: string,
    articleCategory: string,
    content: { metaTitle: string; metaDescription: string; sections: ArticleSection[] }
  ) => {
    const analysis = analyzeSEO({
      title: articleTitle,
      metaTitle: content.metaTitle,
      metaDescription: content.metaDescription,
      slug: articleTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      focusKeyword: articleKeyword,
      sections: content.sections,
    });
    const failedChecks = analysis.checks
      .filter(c => !c.passed)
      .map(c => `- ${c.label}: ${c.message}`)
      .join('\n');

    const res = await fetch('/api/admin/generate-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: articleTitle,
        focusKeyword: articleKeyword,
        category: articleCategory,
        action,
        currentContent: content,
        failedChecks: action !== 'humanize' ? failedChecks : '',
        feedback: '',
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || `Erreur lors de l'étape ${action}.`);
    }
    return res.json();
  };

  // ─── Pipeline complet : SEO → GEO → Humaniser ───────────────────────────────
  const handleAutoOptimize = async (initial?: {
    title: string;
    focusKeyword: string;
    category: string;
    metaTitle: string;
    metaDescription: string;
    sections: ArticleSection[];
    excerpt?: string;
    readTime?: string;
    slug?: string;
  }) => {
    const base = initial || {
      title: state.title,
      focusKeyword: state.focusKeyword,
      category: state.category,
      metaTitle: state.metaTitle,
      metaDescription: state.metaDescription,
      sections: state.sections,
      excerpt: state.excerpt,
      readTime: state.readTime,
      slug: state.slug,
    };

    setError('');
    let current = { metaTitle: base.metaTitle, metaDescription: base.metaDescription, sections: base.sections };

    try {
      setImproving('auto-seo');
      const seoResult = await callImproveAPI('seo', base.title, base.focusKeyword, base.category, current);
      current = {
        metaTitle: seoResult.metaTitle || current.metaTitle,
        metaDescription: seoResult.metaDescription || current.metaDescription,
        sections: seoResult.sections?.length ? seoResult.sections : current.sections,
      };

      setImproving('auto-geo');
      const geoResult = await callImproveAPI('geo', base.title, base.focusKeyword, base.category, current);
      current = {
        metaTitle: geoResult.metaTitle || current.metaTitle,
        metaDescription: geoResult.metaDescription || current.metaDescription,
        sections: geoResult.sections?.length ? geoResult.sections : current.sections,
      };

      setImproving('auto-humanize');
      const humanizeResult = await callImproveAPI('humanize', base.title, base.focusKeyword, base.category, current);
      current = {
        metaTitle: humanizeResult.metaTitle || current.metaTitle,
        metaDescription: humanizeResult.metaDescription || current.metaDescription,
        sections: humanizeResult.sections?.length ? humanizeResult.sections : current.sections,
      };

      loadArticle({
        ...state,
        title: base.title,
        slug: base.slug || base.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        focusKeyword: base.focusKeyword,
        category: base.category as ArticleCategory,
        excerpt: base.excerpt || state.excerpt,
        readTime: base.readTime || state.readTime,
        metaTitle: current.metaTitle,
        metaDescription: current.metaDescription,
        sections: current.sections,
        source: 'ai_generated',
      });

      setSuccess('Article optimisé : SEO 80+, GEO 80+, humanisé ! Relisez et publiez.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'optimisation.');
    } finally {
      setImproving(null);
    }
  };

  // ─── Génération + optimisation automatique ───────────────────────────────────
  const handleGenerate = async () => {
    if (!generateForm.title.trim()) {
      setError('Veuillez saisir un titre pour la génération.');
      return;
    }
    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/admin/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generateForm.title,
          focusKeyword: generateForm.focusKeyword,
          category: generateForm.category,
          action: 'generate',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la génération. Vérifiez la clé API Anthropic.');
        setGenerating(false);
        return;
      }

      // Charger l'article brut d'abord
      loadArticle({
        title: data.title || generateForm.title,
        slug: data.slug || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        excerpt: data.excerpt || '',
        category: generateForm.category as ArticleCategory,
        focusKeyword: generateForm.focusKeyword,
        sections: data.sections || [],
        readTime: data.readTime || '7 min',
        status: 'draft',
        source: 'ai_generated',
      });

      setSuccess('Article généré ! Optimisation SEO + GEO + Humanisation en cours...');
      setGenerating(false);

      // Lancer le pipeline automatique
      await handleAutoOptimize({
        title: data.title || generateForm.title,
        slug: data.slug || '',
        focusKeyword: generateForm.focusKeyword,
        category: generateForm.category,
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        sections: data.sections || [],
        excerpt: data.excerpt || '',
        readTime: data.readTime || '7 min',
      });
    } catch {
      setError('Erreur réseau. Réessayez.');
      setGenerating(false);
    }
  };

  // ─── Amélioration manuelle étape par étape ───────────────────────────────────
  const handleImprove = async (action: 'seo' | 'geo' | 'humanize' | 'maillage', feedback?: string) => {
    setImproving(action);
    setError('');

    const analysis = analyzeSEO({
      title: state.title, metaTitle: state.metaTitle, metaDescription: state.metaDescription,
      slug: state.slug, focusKeyword: state.focusKeyword, sections: state.sections,
    });
    const failedChecks = analysis.checks.filter(c => !c.passed).map(c => `- ${c.label}: ${c.message}`).join('\n');

    try {
      const res = await fetch('/api/admin/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: state.title, focusKeyword: state.focusKeyword, category: state.category,
          action, currentContent: { metaTitle: state.metaTitle, metaDescription: state.metaDescription, sections: state.sections },
          failedChecks, feedback: feedback || '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'amélioration.');
        return;
      }

      if (data.metaTitle) setField('metaTitle', data.metaTitle);
      if (data.metaDescription) setField('metaDescription', data.metaDescription);
      if (data.sections?.length > 0) {
        loadArticle({ ...state, sections: data.sections, metaTitle: data.metaTitle || state.metaTitle, metaDescription: data.metaDescription || state.metaDescription });
      }

      const labels: Record<string, string> = { seo: 'SEO', geo: 'GEO', humanize: 'Humanisation', maillage: 'Maillage interne' };
      setSuccess(`${labels[action] || action} amélioré avec succès !`);
    } catch {
      setError('Erreur réseau.');
    } finally {
      setImproving(null);
    }
  };

  // ─── Sauvegarde ──────────────────────────────────────────────────────────────
  const handleSave = async (publish = false) => {
    if (!state.title.trim() || !state.slug.trim()) {
      setError('Le titre et le slug sont obligatoires.');
      return;
    }
    setSaving(true);
    setError('');

    const analysis = analyzeSEO({
      title: state.title, metaTitle: state.metaTitle, metaDescription: state.metaDescription,
      slug: state.slug, focusKeyword: state.focusKeyword, sections: state.sections,
    });
    const readTime = estimateReadTime(state.sections);
    const finalStatus = publish ? 'published' : state.status;

    const { data, error: supabaseError } = await supabase
      .from('linova_articles')
      .insert({
        slug: state.slug, title: state.title, meta_title: state.metaTitle,
        meta_description: state.metaDescription, excerpt: state.excerpt, category: state.category,
        focus_keyword: state.focusKeyword, sections: state.sections, read_time: readTime,
        seo_score: analysis.seoScore, geo_score: analysis.geoScore, status: finalStatus,
        source: state.source || 'manual',
        scheduled_at: finalStatus === 'scheduled' && state.scheduledAt ? new Date(state.scheduledAt).toISOString() : null,
      })
      .select('id')
      .single();

    if (supabaseError) {
      setError(supabaseError.message.includes('duplicate') ? `Le slug "${state.slug}" existe déjà. Modifiez-le.` : supabaseError.message);
      setSaving(false);
      return;
    }

    setSuccess(publish ? 'Article publié avec succès !' : 'Article sauvegardé comme brouillon.');
    setTimeout(() => router.push(`/admin/articles/${data.id}`), 1000);
  };

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <a href="/admin/articles" className="hover:text-teal transition-colors">Articles</a>
            <span>›</span>
            <span>Nouvel article</span>
          </div>
          <h1 className="text-2xl font-bold text-navy">Créer un article</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-gray-300 transition-colors text-sm cursor-pointer disabled:opacity-50">
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="px-5 py-2.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all text-sm cursor-pointer disabled:opacity-50">
            {saving ? 'Publication...' : '🚀 Publier'}
          </button>
        </div>
      </div>

      {error && <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
      {success && <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{success}</div>}

      {/* AI Generator panel */}
      <div className="mb-6 bg-gradient-to-r from-navy to-navy/90 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🤖</span>
          <h2 className="font-bold">Générateur d&apos;article IA</h2>
          <span className="text-xs bg-teal/30 text-teal px-2 py-0.5 rounded-full">Claude Opus</span>
          <span className="text-xs bg-yellow/20 text-yellow px-2 py-0.5 rounded-full">Auto SEO + GEO + Humanisé</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Titre <span className="text-red-400">*</span></label>
            <input type="text" value={generateForm.title} onChange={e => setGenerateForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Ex : Technicien en bactériologie"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal/50" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Mot-clé focus</label>
            <input type="text" value={generateForm.focusKeyword} onChange={e => setGenerateForm(p => ({ ...p, focusKeyword: e.target.value }))}
              placeholder="Ex : BTS biologie médicale Paris"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal/50" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Catégorie</label>
            <select value={generateForm.category} onChange={e => setGenerateForm(p => ({ ...p, category: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal/50">
              <option value="Métiers">Métiers</option>
              <option value="Formation">Formation</option>
              <option value="Alternance">Alternance</option>
              <option value="Vie étudiante">Vie étudiante</option>
            </select>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={generating || !!improving}
          className="flex items-center gap-2 px-6 py-3 bg-yellow text-navy font-bold rounded-xl hover:brightness-95 transition-all text-sm cursor-pointer disabled:opacity-60">
          {generating ? (
            <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Génération...</>
          ) : <>✨ Générer &amp; optimiser (SEO 80+ · GEO 80+ · Humanisé)</>}
        </button>
        <p className="text-xs text-white/40 mt-2">Génération + 3 passes d&apos;optimisation automatiques · ~4 min au total</p>
      </div>

      {/* Editor + SEO Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ArticleEditor state={state} setField={setField} addBlock={addBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} moveBlock={moveBlock} />
        </div>
        <div className="xl:col-span-1">
          <SEOPanel
            title={state.title} metaTitle={state.metaTitle} metaDescription={state.metaDescription}
            slug={state.slug} focusKeyword={state.focusKeyword} sections={state.sections}
            onImprove={handleImprove}
            onAutoOptimize={handleAutoOptimize}
            improving={improving}
          />
        </div>
      </div>
    </div>
  );
}
