'use client';

import { ArticleSection } from '@/lib/admin/analyzeSEO';
import { ArticleEditorState, ArticleCategory } from '@/lib/admin/useArticleEditor';
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import CalloutBlock from './blocks/CalloutBlock';
import ListBlock from './blocks/ListBlock';
import FAQBlock from './blocks/FAQBlock';

const CATEGORIES: ArticleCategory[] = ['Métiers', 'Formation', 'Alternance', 'Vie étudiante'];

const BLOCK_TYPES: { type: ArticleSection['type']; label: string; icon: string }[] = [
  { type: 'heading', label: 'Titre', icon: 'H' },
  { type: 'paragraph', label: 'Paragraphe', icon: '¶' },
  { type: 'callout', label: 'Encadré', icon: '💡' },
  { type: 'list', label: 'Liste', icon: '•' },
  { type: 'faq', label: 'FAQ', icon: '?' },
];

const BLOCK_LABELS: Record<string, string> = {
  heading: 'Titre',
  paragraph: 'Paragraphe',
  callout: 'Encadré',
  list: 'Liste',
  faq: 'FAQ',
};

interface Props {
  state: ArticleEditorState;
  setField: <K extends keyof ArticleEditorState>(field: K, value: ArticleEditorState[K]) => void;
  addBlock: (type: ArticleSection['type']) => void;
  updateBlock: (id: string, updates: Partial<ArticleSection>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
}

function BlockWrapper({
  section,
  index,
  total,
  onUpdate,
  onDelete,
  onMove,
}: {
  section: ArticleSection;
  index: number;
  total: number;
  onUpdate: (id: string, updates: Partial<ArticleSection>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: 'up' | 'down') => void;
}) {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl p-4 hover:border-teal/30 transition-colors">
      {/* Block header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {BLOCK_LABELS[section.type] || section.type}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(section.id, 'up')}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Monter"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(section.id, 'down')}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Descendre"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(section.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
            title="Supprimer"
          >
            <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Block content */}
      {section.type === 'heading' && <HeadingBlock section={section} onUpdate={onUpdate} />}
      {section.type === 'paragraph' && <ParagraphBlock section={section} onUpdate={onUpdate} />}
      {section.type === 'callout' && <CalloutBlock section={section} onUpdate={onUpdate} />}
      {section.type === 'list' && <ListBlock section={section} onUpdate={onUpdate} />}
      {section.type === 'faq' && <FAQBlock section={section} onUpdate={onUpdate} />}
    </div>
  );
}

export default function ArticleEditor({ state, setField, addBlock, updateBlock, deleteBlock, moveBlock }: Props) {
  return (
    <div className="space-y-6">
      {/* Metadata */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-bold text-navy uppercase tracking-wide">Métadonnées</h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Titre de l&apos;article <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={state.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="Ex : Technicien en bactériologie : rôle, missions et salaire"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Slug (URL)
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <span className="px-3 py-3 bg-gray-50 text-xs text-gray-400 border-r border-gray-200 shrink-0">
                /blog/
              </span>
              <input
                type="text"
                value={state.slug}
                onChange={e => setField('slug', e.target.value)}
                placeholder="mon-article-slug"
                className="flex-1 px-3 py-3 text-sm focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Category + Focus keyword */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Catégorie</label>
              <select
                value={state.category}
                onChange={e => setField('category', e.target.value as ArticleCategory)}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 bg-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mot-clé focus (SEO)</label>
              <input
                type="text"
                value={state.focusKeyword}
                onChange={e => setField('focusKeyword', e.target.value)}
                placeholder="Ex : BTS biologie médicale Paris"
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
              />
            </div>
          </div>

          {/* Meta title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Méta-titre
              <span className={`ml-2 font-normal ${
                state.metaTitle.length >= 50 && state.metaTitle.length <= 60 ? 'text-green-500' : 'text-gray-400'
              }`}>
                ({state.metaTitle.length}/60 car.)
              </span>
            </label>
            <input
              type="text"
              value={state.metaTitle}
              onChange={e => setField('metaTitle', e.target.value)}
              placeholder="Ex : Technicien en bactériologie : métier, salaire | Linova"
              maxLength={80}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
          </div>

          {/* Meta description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Méta-description
              <span className={`ml-2 font-normal ${
                state.metaDescription.length >= 140 && state.metaDescription.length <= 160 ? 'text-green-500' : 'text-gray-400'
              }`}>
                ({state.metaDescription.length}/160 car.)
              </span>
            </label>
            <textarea
              value={state.metaDescription}
              onChange={e => setField('metaDescription', e.target.value)}
              placeholder="Courte description pour les moteurs de recherche (140-160 caractères)..."
              maxLength={200}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Extrait (résumé court)</label>
            <textarea
              value={state.excerpt}
              onChange={e => setField('excerpt', e.target.value)}
              placeholder="Résumé affiché dans la liste des articles..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
            />
          </div>

          {/* Status + Read time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Statut</label>
              <select
                value={state.status}
                onChange={e => setField('status', e.target.value as 'draft' | 'published' | 'archived' | 'scheduled')}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 bg-white"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="scheduled">⏰ Programmé</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Temps de lecture</label>
              <input
                type="text"
                value={state.readTime}
                onChange={e => setField('readTime', e.target.value)}
                placeholder="Ex : 7 min"
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
              />
            </div>
          </div>

          {/* Scheduled date — visible only when status = scheduled */}
          {state.status === 'scheduled' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <label className="block text-xs font-semibold text-amber-700 mb-1.5">
                📅 Date de publication programmée
              </label>
              <input
                type="datetime-local"
                value={state.scheduledAt || ''}
                onChange={e => setField('scheduledAt', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full border border-amber-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 bg-white"
              />
              <p className="text-xs text-amber-600 mt-1.5">
                Le cron vérifie toutes les 5 minutes et publiera automatiquement l&apos;article à la date choisie.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content blocks */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-navy uppercase tracking-wide">
            Contenu
            <span className="ml-2 text-xs font-normal text-gray-400">{state.sections.length} bloc(s)</span>
          </h2>
        </div>

        {state.sections.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">✍️</div>
            <p className="text-sm">Aucun bloc. Ajoutez du contenu ci-dessous.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.sections.map((section, idx) => (
              <BlockWrapper
                key={section.id}
                section={section}
                index={idx}
                total={state.sections.length}
                onUpdate={updateBlock}
                onDelete={deleteBlock}
                onMove={moveBlock}
              />
            ))}
          </div>
        )}

        {/* Add block buttons */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="text-xs text-gray-400 mb-3 font-medium">Ajouter un bloc :</div>
          <div className="flex flex-wrap gap-2">
            {BLOCK_TYPES.map(bt => (
              <button
                key={bt.type}
                type="button"
                onClick={() => addBlock(bt.type)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:border-teal hover:text-teal hover:bg-teal/5 transition-colors cursor-pointer"
              >
                <span>{bt.icon}</span>
                {bt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
