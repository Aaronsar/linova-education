'use client';

import { ArticleSection } from '@/lib/admin/analyzeSEO';

interface Props {
  section: ArticleSection;
  onUpdate: (id: string, updates: Partial<ArticleSection>) => void;
}

export default function ParagraphBlock({ section, onUpdate }: Props) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
        <span>HTML accepté :</span>
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">&lt;a href="..."&gt;</code>
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">&lt;strong&gt;</code>
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">&lt;em&gt;</code>
      </div>
      <textarea
        value={section.content || ''}
        onChange={e => onUpdate(section.id, { content: e.target.value })}
        placeholder="Rédigez votre paragraphe ici... (HTML accepté)"
        rows={4}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none font-mono leading-relaxed"
      />
      {section.content && (
        <div className="text-xs text-gray-400 text-right">
          {section.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length} mots
        </div>
      )}
    </div>
  );
}
