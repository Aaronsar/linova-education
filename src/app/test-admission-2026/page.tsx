'use client';

import { useState } from 'react';
import { QCM_QUESTIONS, type QcmQuestion } from '@/lib/admission-qcm-questions';

type Letter = 'A' | 'B' | 'C' | 'D';

interface Identity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default function TestAdmissionPage() {
  const [step, setStep] = useState<'identity' | 'qcm' | 'done'>('identity');
  const [identity, setIdentity] = useState<Identity>({ firstName: '', lastName: '', email: '', phone: '' });
  const [answers, setAnswers] = useState<Record<string, Letter[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canStartQcm =
    identity.firstName.trim() &&
    identity.lastName.trim() &&
    isValidEmail(identity.email) &&
    identity.phone.trim().length >= 8;

  const allAnswered = QCM_QUESTIONS.every((q) => (answers[q.id]?.length ?? 0) > 0);

  function toggleAnswer(qId: string, letter: Letter) {
    setAnswers((prev) => {
      const current = prev[qId] || [];
      const next = current.includes(letter)
        ? current.filter((l) => l !== letter)
        : [...current, letter];
      return { ...prev, [qId]: next };
    });
  }

  async function submitTest() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/test-admission/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: identity.firstName.trim(),
          lastName: identity.lastName.trim(),
          email: identity.email.trim(),
          phone: identity.phone.trim(),
          answers: Object.entries(answers).map(([id, selected]) => ({ id, selected })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue. Veuillez réessayer.');
        return;
      }
      setStep('done');
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-light py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-4">
            Test d&apos;admission 2026
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
            QCM d&apos;admission BTS Biologie Médicale
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            20 questions, durée libre. Une ou deux réponses possibles par question.
          </p>
        </div>

        {step === 'identity' && (
          <IdentityStep
            identity={identity}
            setIdentity={setIdentity}
            canStart={!!canStartQcm}
            onStart={() => setStep('qcm')}
          />
        )}

        {step === 'qcm' && (
          <QcmStep
            answers={answers}
            toggleAnswer={toggleAnswer}
            allAnswered={allAnswered}
            submitting={submitting}
            error={error}
            onSubmit={submitTest}
          />
        )}

        {step === 'done' && <DoneStep firstName={identity.firstName} />}
      </div>
    </div>
  );
}

// ─── Step 1 — Identité ─────────────────────────────────────────────────────

function IdentityStep({
  identity,
  setIdentity,
  canStart,
  onStart,
}: {
  identity: Identity;
  setIdentity: (id: Identity) => void;
  canStart: boolean;
  onStart: () => void;
}) {
  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all text-dark text-sm placeholder-gray-400';

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
      <h2 className="text-xl font-bold text-navy mb-2">Vos informations</h2>
      <p className="text-sm text-gray-500 mb-6">
        Avant de commencer, indiquez-nous vos coordonnées. Le numéro de téléphone permettra
        de retrouver votre rendez-vous d&apos;admission s&apos;il a déjà été pris.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canStart) onStart();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Prénom <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={identity.firstName}
              onChange={(e) => setIdentity({ ...identity, firstName: e.target.value })}
              placeholder="Marie"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Nom <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={identity.lastName}
              onChange={(e) => setIdentity({ ...identity, lastName: e.target.value })}
              placeholder="Dupont"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={identity.email}
            onChange={(e) => setIdentity({ ...identity, email: e.target.value })}
            placeholder="marie.dupont@gmail.com"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            Téléphone <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={identity.phone}
            onChange={(e) => setIdentity({ ...identity, phone: e.target.value })}
            placeholder="06 12 34 56 78"
            className={inputClass}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!canStart}
          className="w-full bg-navy text-white py-3.5 rounded-xl font-bold text-sm hover:bg-navy-dark transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          Commencer le test
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <p className="text-[10px] text-gray-400 text-center mt-2">
          Vos résultats sont transmis exclusivement à l&apos;équipe Linova. Vos données
          sont traitées conformément à notre politique de confidentialité.
        </p>
      </form>
    </div>
  );
}

// ─── Step 2 — QCM ──────────────────────────────────────────────────────────

function QcmStep({
  answers,
  toggleAnswer,
  allAnswered,
  submitting,
  error,
  onSubmit,
}: {
  answers: Record<string, Letter[]>;
  toggleAnswer: (qId: string, letter: Letter) => void;
  allAnswered: boolean;
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
}) {
  // Regroupe par catégorie pour l'affichage
  const grouped = QCM_QUESTIONS.reduce<Record<string, QcmQuestion[]>>((acc, q) => {
    (acc[q.category] = acc[q.category] || []).push(q);
    return acc;
  }, {});

  const answeredCount = QCM_QUESTIONS.filter((q) => (answers[q.id]?.length ?? 0) > 0).length;

  return (
    <>
      {/* Sticky progress */}
      <div className="sticky top-0 z-10 bg-light/95 backdrop-blur py-3 mb-4 -mx-4 px-4">
        <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-navy">
            {answeredCount} / {QCM_QUESTIONS.length} questions
          </span>
          <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal transition-all"
              style={{ width: `${(answeredCount / QCM_QUESTIONS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 hidden sm:inline">Plusieurs réponses possibles</span>
        </div>
      </div>

      {Object.entries(grouped).map(([category, questions]) => (
        <section key={category} className="mb-8">
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-teal rounded-full" />
            {category}
          </h2>
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const globalIdx = QCM_QUESTIONS.findIndex((x) => x.id === q.id) + 1;
              const selected = answers[q.id] || [];
              return (
                <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="font-semibold text-navy mb-4 text-sm">
                    <span className="text-teal mr-2">Q{globalIdx}.</span> {q.text}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const isSelected = selected.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleAnswer(q.id, opt.value)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all text-sm cursor-pointer ${
                            isSelected
                              ? 'border-teal bg-teal/10 text-navy font-semibold'
                              : 'border-gray-200 hover:border-teal/50 text-dark'
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center text-xs font-bold ${
                              isSelected
                                ? 'border-teal bg-teal text-white'
                                : 'border-gray-300 text-gray-500'
                            }`}
                          >
                            {isSelected ? '✓' : opt.value}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                  {idx >= 0 && null}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {error && (
        <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!allAnswered || submitting}
        className="w-full bg-navy text-white py-4 rounded-xl font-bold text-base hover:bg-navy-dark transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            Soumettre mes réponses
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </>
        )}
      </button>

      {!allAnswered && (
        <p className="text-center text-xs text-gray-400 mt-3">
          Répondez à toutes les questions pour pouvoir soumettre.
        </p>
      )}
    </>
  );
}

// ─── Step 3 — Confirmation (sans résultat) ─────────────────────────────────

function DoneStep({ firstName }: { firstName: string }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-10 border border-gray-100 text-center">
      <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-navy mb-3">
        Merci{firstName ? `, ${firstName}` : ''} !
      </h2>
      <p className="text-gray-600 mb-2 max-w-md mx-auto">
        Votre test a bien été enregistré.
      </p>
      <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
        Notre équipe d&apos;admissions analyse votre soumission et reviendra vers vous
        dans les meilleurs délais. Aucune note n&apos;est communiquée immédiatement.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-navy text-navy font-semibold rounded-full hover:bg-navy hover:text-white transition-all text-sm"
      >
        Retour à l&apos;accueil
      </a>
    </div>
  );
}
