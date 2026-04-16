'use client';

import { ArticleSection } from '@/lib/admin/analyzeSEO';

interface Props {
  section: ArticleSection;
  onUpdate: (id: string, updates: Partial<ArticleSection>) => void;
}

export default function ListBlock({ section, onUpdate }: Props) {
  const items = section.items || [''];

  const updateItem = (idx: number, value: string) => {
    const newItems = [...items];
    newItems[idx] = value;
    onUpdate(section.id, { items: newItems });
  };

  const addItem = () => {
    onUpdate(section.id, { items: [...items, ''] });
  };

  const removeItem = (idx: number) => {
    const newItems = items.filter((_, i) => i !== idx);
    onUpdate(section.id, { items: newItems.length > 0 ? newItems : [''] });
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="text-teal font-bold text-sm shrink-0">•</span>
          <input
            type="text"
            value={item}
            onChange={e => updateItem(idx, e.target.value)}
            placeholder={`Élément ${idx + 1}...`}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-red-400 hover:text-red-600 transition-colors cursor-pointer p-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="text-sm text-teal hover:text-teal/80 font-medium flex items-center gap-1 cursor-pointer mt-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un élément
      </button>
    </div>
  );
}
