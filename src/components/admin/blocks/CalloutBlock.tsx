'use client';

import { ArticleSection } from '@/lib/admin/analyzeSEO';

interface Props {
  section: ArticleSection;
  onUpdate: (id: string, updates: Partial<ArticleSection>) => void;
}

export default function CalloutBlock({ section, onUpdate }: Props) {
  const variant = section.variant || 'info';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-600">Type :</span>
        <div className="flex gap-1">
          {['info', 'conseil', 'attention'].map(v => (
            <button
              key={v}
              type="button"
              onClick={() => onUpdate(section.id, { variant: v })}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                variant === v
                  ? v === 'info'
                    ? 'bg-teal text-white'
                    : v === 'conseil'
                      ? 'bg-yellow text-navy'
                      : 'bg-red-400 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {v === 'info' ? '💡 Info' : v === 'conseil' ? '✅ Conseil' : '⚠️ Attention'}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`rounded-xl p-1 ${
          variant === 'info'
            ? 'bg-teal/10 border border-teal/30'
            : variant === 'conseil'
              ? 'bg-yellow/10 border border-yellow/40'
              : 'bg-red-50 border border-red-200'
        }`}
      >
        <textarea
          value={section.content || ''}
          onChange={e => onUpdate(section.id, { content: e.target.value })}
          placeholder="Contenu de l'encadré... (HTML accepté)"
          rows={3}
          className="w-full bg-transparent px-3 py-2 text-sm text-gray-700 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
