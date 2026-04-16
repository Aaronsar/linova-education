'use client';

import { ArticleSection } from '@/lib/admin/analyzeSEO';

interface Props {
  section: ArticleSection;
  onUpdate: (id: string, updates: Partial<ArticleSection>) => void;
}

export default function FAQBlock({ section, onUpdate }: Props) {
  const questions = section.questions || [{ question: '', answer: '' }];

  const updateQuestion = (idx: number, field: 'question' | 'answer', value: string) => {
    const newQ = [...questions];
    newQ[idx] = { ...newQ[idx], [field]: value };
    onUpdate(section.id, { questions: newQ });
  };

  const addQuestion = () => {
    onUpdate(section.id, { questions: [...questions, { question: '', answer: '' }] });
  };

  const removeQuestion = (idx: number) => {
    const newQ = questions.filter((_, i) => i !== idx);
    onUpdate(section.id, { questions: newQ.length > 0 ? newQ : [{ question: '', answer: '' }] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-teal"></div>
        <span className="text-xs font-medium text-gray-500">{questions.length} question(s) — cible : 5 minimum pour un bon score GEO</span>
      </div>

      {questions.map((q, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal bg-teal/10 px-2.5 py-1 rounded-full">
              Q{idx + 1}
            </span>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(idx)}
                className="text-red-400 hover:text-red-600 transition-colors cursor-pointer text-xs"
              >
                Supprimer
              </button>
            )}
          </div>
          <input
            type="text"
            value={q.question}
            onChange={e => updateQuestion(idx, 'question', e.target.value)}
            placeholder="Question..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          />
          <textarea
            value={q.answer}
            onChange={e => updateQuestion(idx, 'answer', e.target.value)}
            placeholder="Réponse détaillée..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="text-sm text-teal hover:text-teal/80 font-medium flex items-center gap-1 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Ajouter une question
      </button>
    </div>
  );
}
