'use client';

import { useMemo, useState } from 'react';
import { analyzeSEO, SEOCheck, ArticleSection } from '@/lib/admin/analyzeSEO';

interface Props {
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  focusKeyword: string;
  sections: ArticleSection[];
  onImprove?: (action: 'seo' | 'geo' | 'humanize' | 'maillage', feedback?: string) => Promise<void>;
  onAutoOptimize?: () => Promise<void>;
  improving?: string | null;
}

function ScoreGauge({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-navy">{score}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function CheckItem({ check }: { check: SEOCheck }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${check.passed ? 'bg-green-100' : 'bg-red-50'}`}>
        {check.passed ? (
          <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-2.5 h-2.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-medium ${check.passed ? 'text-gray-700' : 'text-gray-600'}`}>{check.label}</div>
        <div className="text-xs text-gray-400 mt-0.5">{check.message}</div>
      </div>
    </div>
  );
}

const categoryLabels = { basic: 'Basique', content: 'Contenu', links: 'Liens', geo: 'GEO (IA)' };

const AUTO_STEPS: Record<string, string> = {
  'auto-seo': '🔍 Optimisation SEO...',
  'auto-geo': '🤖 Optimisation GEO...',
  'auto-humanize': '✍️ Humanisation...',
};

function Spinner() {
  return (
    <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function SEOPanel({
  title, metaTitle, metaDescription, slug, focusKeyword, sections,
  onImprove, onAutoOptimize, improving,
}: Props) {
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'links' | 'geo'>('basic');

  const analysis = useMemo(
    () => analyzeSEO({ title, metaTitle, metaDescription, slug, focusKeyword, sections }),
    [title, metaTitle, metaDescription, slug, focusKeyword, sections]
  );

  const { seoScore, geoScore, checks } = analysis;
  const seoColor = seoScore >= 70 ? '#22c55e' : seoScore >= 40 ? '#f59e0b' : '#ef4444';
  const geoColor = geoScore >= 70 ? '#6DA3A4' : geoScore >= 40 ? '#f59e0b' : '#ef4444';
  const filteredChecks = checks.filter(c => c.category === activeTab);
  const failedCount = checks.filter(c => !c.passed).length;
  const isAutoRunning = improving?.startsWith('auto-');
  const currentAutoStep = improving ? AUTO_STEPS[improving] : null;
  const allGood = seoScore >= 80 && geoScore >= 80;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-4">
      {/* Scores */}
      <div className="p-5 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-bold text-navy mb-4">Analyse SEO & GEO</h3>
        <div className="flex items-center justify-around">
          <ScoreGauge score={seoScore} label="SEO" color={seoColor} />
          <div className="w-px h-20 bg-gray-200"></div>
          <ScoreGauge score={geoScore} label="GEO" color={geoColor} />
        </div>
        {failedCount > 0 && (
          <div className="mt-3 text-center text-xs text-gray-500">{failedCount} point(s) à améliorer</div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map(cat => {
          const catChecks = checks.filter(c => c.category === cat);
          const passed = catChecks.filter(c => c.passed).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-1 px-2 py-2.5 text-xs font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === cat ? 'border-teal text-teal' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {categoryLabels[cat]}
              <span className={`ml-1 text-xs ${passed === catChecks.length ? 'text-green-500' : 'text-red-400'}`}>
                {passed}/{catChecks.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Checks */}
      <div className="p-4 divide-y divide-gray-50 max-h-64 overflow-y-auto">
        {filteredChecks.map(check => <CheckItem key={check.id} check={check} />)}
      </div>

      {/* AI Actions */}
      {(onImprove || onAutoOptimize) && (
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Amélioration IA</div>

          {/* Bouton principal : tout optimiser */}
          {onAutoOptimize && (
            <div>
              {isAutoRunning ? (
                <div className="w-full py-3 px-3 bg-gradient-to-r from-navy to-teal text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2">
                  <Spinner />
                  {currentAutoStep || 'Optimisation en cours...'}
                  <span className="ml-1 opacity-60 text-[10px]">
                    {improving === 'auto-seo' ? '1/3' : improving === 'auto-geo' ? '2/3' : '3/3'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={onAutoOptimize}
                  disabled={!!improving}
                  className={`w-full py-3 px-3 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${
                    allGood
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gradient-to-r from-navy to-teal hover:brightness-110'
                  }`}
                >
                  {allGood ? '✅ Tout est optimisé (relancer ?)' : '🚀 Tout optimiser (SEO + GEO + Humaniser)'}
                </button>
              )}
              <p className="text-center text-xs text-gray-400 mt-1.5">3 étapes automatiques · ~3 min</p>
            </div>
          )}

          {/* Boutons individuels */}
          {onImprove && (
            <div className="grid grid-cols-1 gap-2 pt-1 border-t border-gray-100">
              <div className="text-xs text-gray-400 font-medium">Ou étape par étape :</div>

              <button
                onClick={() => onImprove('seo', feedback)}
                disabled={!!improving}
                className="w-full py-2.5 px-3 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {improving === 'seo' ? <><Spinner />Optimisation SEO...</> : '🔍 Améliorer SEO → 80+'}
              </button>

              <button
                onClick={() => onImprove('geo', feedback)}
                disabled={!!improving}
                className="w-full py-2.5 px-3 bg-teal text-white text-xs font-semibold rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {improving === 'geo' ? <><Spinner />Optimisation GEO...</> : '🤖 Améliorer GEO → 80+'}
              </button>

              <button
                onClick={() => onImprove('maillage', feedback)}
                disabled={!!improving}
                className="w-full py-2.5 px-3 bg-[#182D3C] border-2 border-teal text-teal text-xs font-semibold rounded-xl hover:bg-teal/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {improving === 'maillage' ? <><Spinner />Maillage en cours...</> : '🔗 Ajouter maillage interne'}
              </button>

              <button
                onClick={() => onImprove('humanize', feedback)}
                disabled={!!improving}
                className="w-full py-2.5 px-3 bg-yellow text-navy text-xs font-semibold rounded-xl hover:bg-yellow/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {improving === 'humanize' ? <><Spinner />Humanisation...</> : '✍️ Humaniser le texte'}
              </button>
            </div>
          )}

          <div>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Instructions spécifiques pour l'IA (optionnel)..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
