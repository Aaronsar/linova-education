/**
 * Réponses correctes du QCM d'admission BTS Biologie Médicale.
 *
 * ⚠️ FICHIER PRIVÉ — utilisé UNIQUEMENT côté serveur (API route).
 * Ne jamais l'importer dans un composant client (pas de "use client" ne
 * doit jamais en dépendre). Le fichier `admission-qcm-questions.ts`
 * (sans réponses) est seul exposable au client.
 *
 * Le scoring est strict : on attribue 1 point si la sélection
 * correspond exactement à l'ensemble des bonnes réponses, 0 sinon.
 */

export type AnswerLetter = 'A' | 'B' | 'C' | 'D';

/** Bonnes réponses par question (lettres triées). */
export const QCM_CORRECT: Record<string, AnswerLetter[]> = {
  Q1: ['B', 'C'],
  Q2: ['A', 'B'],
  Q3: ['C', 'D'],
  Q4: ['A', 'C'],
  Q5: ['A'],
  Q6: ['A', 'B'],
  Q7: ['B', 'C'],
  Q8: ['A', 'D'],
  Q9: ['A', 'C'],
  Q10: ['A', 'B'],
  Q11: ['A'],
  Q12: ['A', 'C'],
  Q13: ['A'],
  Q14: ['A'],
  Q15: ['C'],
  Q16: ['A', 'C'],
  Q17: ['B'],
  Q18: ['A', 'C'],
  Q19: ['A', 'C'],
  Q20: ['C', 'D'],
};

interface SubmittedAnswer {
  id: string;
  selected: AnswerLetter[];
}

export interface PerQuestionResult {
  id: string;
  selected: AnswerLetter[];
  correct: AnswerLetter[];
  isCorrect: boolean;
}

export interface ScoringResult {
  score: number;
  maxScore: number;
  perQuestion: PerQuestionResult[];
}

/** Calcule le score d'une soumission. Sélection exacte = 1 point ; sinon 0. */
export function scoreSubmission(answers: SubmittedAnswer[]): ScoringResult {
  const perQuestion: PerQuestionResult[] = [];
  let score = 0;

  for (const [qId, correct] of Object.entries(QCM_CORRECT)) {
    const submitted = answers.find((a) => a.id === qId);
    const selected = (submitted?.selected || []).slice().sort();
    const sortedCorrect = correct.slice().sort();
    const isCorrect =
      selected.length === sortedCorrect.length &&
      selected.every((v, i) => v === sortedCorrect[i]);
    if (isCorrect) score++;
    perQuestion.push({
      id: qId,
      selected: selected as AnswerLetter[],
      correct: sortedCorrect,
      isCorrect,
    });
  }

  return { score, maxScore: Object.keys(QCM_CORRECT).length, perQuestion };
}
