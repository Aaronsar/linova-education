'use client';

import { ArticleSection } from '@/lib/admin/analyzeSEO';

interface Props {
  section: ArticleSection;
  onUpdate: (id: string, updates: Partial<ArticleSection>) => void;
}

export default function HeadingBlock({ section, onUpdate }: Props) {
  return (
    <div className="flex gap-3 items-start">
      <select
        value={section.level || 'h2'}
        onChange={e => onUpdate(section.id, { level: e.target.value as 'h2' | 'h3' })}
        className="text-xs border border-gray-200 rounded-lg px-2 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal/30 bg-white shrink-0"
      >
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </select>
      <input
        type="text"
        value={section.content || ''}
        onChange={e => onUpdate(section.id, { content: e.target.value })}
        placeholder={section.level === 'h3' ? 'Sous-titre H3...' : 'Titre H2...'}
        className={`flex-1 border-0 border-b-2 border-gray-200 focus:border-teal focus:outline-none py-1 bg-transparent placeholder-gray-400 ${
          section.level === 'h2'
            ? 'text-xl font-bold text-navy'
            : 'text-lg font-semibold text-navy/80'
        }`}
      />
    </div>
  );
}
