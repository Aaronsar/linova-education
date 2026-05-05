'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { QCM_QUESTIONS } from '@/lib/admission-qcm-questions';

type Letter = 'A' | 'B' | 'C' | 'D';

interface PerQuestion {
  id: string;
  selected: Letter[];
  correct: Letter[];
  isCorrect: boolean;
}

interface AdmissionTest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  score: number;
  max_score: number;
  per_question: PerQuestion[];
  linked_appointment_id: string | null;
  started_at: string | null;
  time_expired: boolean;
  created_at: string;
}

function formatDuration(startIso: string | null, endIso: string): string {
  if (!startIso) return '—';
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  if (ms < 0) return '—';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m} min ${String(s).padStart(2, '0')}`;
}

const QUESTION_BY_ID = Object.fromEntries(QCM_QUESTIONS.map((q) => [q.id, q]));

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function scoreColor(score: number, max: number): string {
  const ratio = score / max;
  if (ratio >= 0.7) return 'text-green-600 bg-green-50';
  if (ratio >= 0.5) return 'text-teal-700 bg-teal/10';
  if (ratio >= 0.3) return 'text-yellow-700 bg-yellow/20';
  return 'text-red-600 bg-red-50';
}

export default function AdmissionTestsPage() {
  const [tests, setTests] = useState<AdmissionTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdmissionTest | null>(null);

  const fetchTests = useCallback(async () => {
    const { data, error } = await supabase
      .from('linova_admission_tests')
      .select('id, first_name, last_name, email, phone, score, max_score, per_question, linked_appointment_id, started_at, time_expired, created_at')
      .order('created_at', { ascending: false });
    if (!error && data) setTests(data as AdmissionTest[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const filtered = tests.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.first_name.toLowerCase().includes(q) ||
      t.last_name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.phone.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: tests.length,
    avgScore: tests.length
      ? (tests.reduce((s, t) => s + t.score, 0) / tests.length).toFixed(1)
      : '—',
    above50: tests.filter((t) => t.score / t.max_score >= 0.5).length,
    linked: tests.filter((t) => t.linked_appointment_id).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-[var(--font-outfit)] text-2xl font-bold text-dark">Tests d&apos;admission</h1>
        <p className="text-gray-500 text-sm mt-1">QCM remplis par les prospects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total tests</p>
          <p className="text-3xl font-bold text-dark">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Score moyen</p>
          <p className="text-3xl font-bold text-teal">{stats.avgScore}<span className="text-base text-gray-400"> / 20</span></p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">≥ 50 %</p>
          <p className="text-3xl font-bold text-green-600">{stats.above50}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Liés à un RDV</p>
          <p className="text-3xl font-bold text-navy">{stats.linked}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Rechercher par nom, email ou téléphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal bg-white"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Chargement...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-sm">
            {search ? 'Aucun test ne correspond.' : 'Aucun test soumis pour le moment.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidat</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">RDV lié</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelected(t)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {(t.first_name?.[0] || '').toUpperCase()}
                        {(t.last_name?.[0] || '').toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-dark">{t.first_name} {t.last_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-gray-600">{t.email}</p>
                    <p className="text-xs text-gray-400">{t.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${scoreColor(t.score, t.max_score)}`}>
                      {t.score} / {t.max_score}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {t.linked_appointment_id ? (
                      <span className="inline-flex items-center gap-1 text-xs text-teal-700">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 015.656 0m-1.414 1.414a2 2 0 010 2.828L13 19.485M10.172 13.828a4 4 0 01-5.656 0M5.929 12.414a2 2 0 010-2.828L11 4.515" />
                        </svg>
                        Lié
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">{formatDateTime(t.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <svg className="w-4 h-4 text-gray-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-dark text-lg">{selected.first_name} {selected.last_name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {selected.email} · {selected.phone}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Soumis le {formatDateTime(selected.created_at)}
                  {selected.started_at && (
                    <> · Durée : <strong>{formatDuration(selected.started_at, selected.created_at)}</strong></>
                  )}
                  {selected.time_expired && (
                    <span className="ml-2 inline-flex px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-[10px] font-bold">
                      ⏱ Temps écoulé
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-bold ${scoreColor(selected.score, selected.max_score)}`}>
                  {selected.score} / {selected.max_score}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {selected.per_question.map((pq, idx) => {
                const q = QUESTION_BY_ID[pq.id];
                return (
                  <div
                    key={pq.id}
                    className={`rounded-xl p-4 border ${
                      pq.isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          pq.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {pq.isCorrect ? '✓' : '✗'}
                      </span>
                      <p className="text-sm font-semibold text-navy">
                        Q{idx + 1}. {q?.text || pq.id}
                      </p>
                    </div>
                    <div className="pl-8 text-xs space-y-1">
                      <p>
                        <span className="text-gray-400">Réponse(s) :</span>{' '}
                        <span className="font-semibold text-dark">
                          {pq.selected.length ? pq.selected.join(', ') : '—'}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-400">Bonne(s) réponse(s) :</span>{' '}
                        <span className="font-semibold text-teal-700">{pq.correct.join(', ')}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 text-center py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-dark transition-colors"
              >
                Envoyer un email
              </a>
              <a
                href={`tel:${selected.phone}`}
                className="flex-1 text-center py-2.5 border border-navy text-navy rounded-xl text-sm font-semibold hover:bg-navy hover:text-white transition-colors"
              >
                Appeler
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
