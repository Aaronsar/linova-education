'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Mandate = {
  id: string;
  candidature_id: string;
  gocardless_mandate_id: string | null;
  billing_request_id: string | null;
  iban_last4: string | null;
  status: 'pending' | 'active' | 'cancelled' | 'replaced' | 'failed';
  nb_prelevements: number;
  solde_cents: number;
  start_date: string | null;
  payments: { id: string; amount: number; charge_date: string; status: string }[];
  created_at: string;
  cancelled_at: string | null;
  replaced_by_mandate_id: string | null;
};

function formatEuros(cents: number): string {
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';
}
function formatDate(iso: string | null): string {
  if (!iso) return '--';
  const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

const STATUS_LABEL: Record<Mandate['status'], { label: string; cls: string }> = {
  pending: { label: 'En attente de signature', cls: 'bg-yellow-100 text-yellow-800' },
  active: { label: 'Actif', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulé', cls: 'bg-gray-200 text-gray-700' },
  replaced: { label: 'Remplacé', cls: 'bg-blue-100 text-blue-700' },
  failed: { label: 'Échoué', cls: 'bg-red-100 text-red-700' },
};

const PAYMENT_LABEL: Record<string, { label: string; cls: string }> = {
  pending_submission: { label: 'À venir', cls: 'bg-gray-100 text-gray-700' },
  pending_customer_approval: { label: 'À venir', cls: 'bg-gray-100 text-gray-700' },
  submitted: { label: 'Envoyé en banque', cls: 'bg-blue-50 text-blue-700' },
  confirmed: { label: 'Confirmé', cls: 'bg-green-50 text-green-700' },
  paid_out: { label: 'Reçu', cls: 'bg-green-100 text-green-800' },
  failed: { label: 'Échec', cls: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Annulé', cls: 'bg-gray-100 text-gray-500' },
  charged_back: { label: 'Rejeté', cls: 'bg-red-100 text-red-700' },
};

export default function MandatesPanel({
  candidatureId,
  defaultSoldeCents,
}: {
  candidatureId: string;
  defaultSoldeCents: number;
}) {
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [modal, setModal] = useState<{ kind: 'setup' | 'replace'; previousMandateId?: string } | null>(null);
  const [nb, setNb] = useState(7);
  const [soldeEuros, setSoldeEuros] = useState(
    (defaultSoldeCents / 100).toFixed(2)
  );
  const [lastLink, setLastLink] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; error: boolean } | null>(null);

  const fetchMandates = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch(
        `/api/candidatures/mandates/list?candidatureId=${encodeURIComponent(candidatureId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) setMandates(data.mandates || []);
    } finally {
      setLoading(false);
    }
  }, [candidatureId]);

  useEffect(() => {
    void fetchMandates();
  }, [fetchMandates]);

  // Après retour GoCardless (query ?gocardless=ok&replace_prev=…)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const ok = url.searchParams.get('gocardless');
    if (ok !== 'ok') return;
    const previousMandateRowId = url.searchParams.get('replace_prev');
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const pending = mandates.find((m) => m.status === 'pending' && m.billing_request_id);
      if (!pending?.billing_request_id) return;
      setMsg({ text: 'Finalisation du mandat en cours…', error: false });
      const res = await fetch('/api/candidatures/mandates/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          candidatureId,
          billingRequestId: pending.billing_request_id,
          previousMandateId: previousMandateRowId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ text: `Erreur finalisation : ${data.error || 'inconnue'}`, error: true });
        return;
      }
      setMsg({ text: 'Mandat SEPA actif · prélèvements planifiés', error: false });
      void fetchMandates();
      url.searchParams.delete('gocardless');
      url.searchParams.delete('replace_prev');
      window.history.replaceState({}, '', url.toString());
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandates.length]);

  const openSetup = () => {
    setModal({ kind: 'setup' });
    setSoldeEuros((defaultSoldeCents / 100).toFixed(2));
    setNb(7);
    setLastLink(null);
  };
  const openReplace = (previousMandateId: string, previousSoldeCents: number, previousNb: number) => {
    setModal({ kind: 'replace', previousMandateId });
    setSoldeEuros((previousSoldeCents / 100).toFixed(2));
    setNb(previousNb || 7);
    setLastLink(null);
  };

  const closeModal = () => setModal(null);

  const submit = async () => {
    if (!modal) return;
    const soldeCents = Math.round(parseFloat(soldeEuros.replace(',', '.')) * 100);
    if (!(soldeCents > 100)) {
      setMsg({ text: 'Montant invalide.', error: true });
      return;
    }
    setLaunching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setMsg({ text: 'Session expirée.', error: true });
        return;
      }
      const res = await fetch('/api/candidatures/mandates/create-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          candidatureId,
          nb_prelevements: nb,
          solde_cents: soldeCents,
          previousMandateId: modal.previousMandateId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ text: `Erreur : ${data.error || 'création du mandat échouée'}`, error: true });
        return;
      }
      setLastLink(data.authorisationUrl);
      setMsg({ text: 'Lien GoCardless généré.', error: false });
      void fetchMandates();
    } finally {
      setLaunching(false);
    }
  };

  const sendByEmail = async () => {
    if (!lastLink || !modal) return;
    setLaunching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch('/api/candidatures/mandates/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          candidatureId,
          authorisationUrl: lastLink,
          kind: modal.kind,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ text: `Erreur email : ${data.error || 'inconnue'}`, error: true });
        return;
      }
      setMsg({ text: 'Email envoyé à l’élève avec le lien de signature.', error: false });
      closeModal();
    } finally {
      setLaunching(false);
    }
  };

  const active = mandates.find((m) => m.status === 'active');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-[var(--font-outfit)] text-lg font-bold text-dark">Prélèvements SEPA</h2>
          <p className="text-xs text-gray-500 mt-1">
            Mandats GoCardless et échéancier du solde de scolarité.
          </p>
        </div>
        <div className="flex gap-2">
          {!active && (
            <button
              type="button"
              onClick={openSetup}
              className="px-3 py-2 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-teal/90"
            >
              Mettre en place le prélèvement
            </button>
          )}
          {active && (
            <button
              type="button"
              onClick={() => openReplace(active.id, active.solde_cents, active.nb_prelevements)}
              className="px-3 py-2 rounded-lg border border-navy text-navy text-xs font-semibold hover:bg-navy/5"
            >
              Changer le RIB
            </button>
          )}
        </div>
      </div>

      {msg && (
        <div
          className={`mb-4 text-xs px-3 py-2 rounded-lg ${
            msg.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}
        >
          {msg.text}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : mandates.length === 0 ? (
        <p className="text-sm text-gray-500">
          Aucun mandat SEPA pour l’instant. Cliquez sur <strong>Mettre en place le prélèvement</strong> pour
          envoyer à l’élève le lien de signature GoCardless.
        </p>
      ) : (
        <div className="space-y-4">
          {mandates.map((m) => {
            const st = STATUS_LABEL[m.status];
            return (
              <div key={m.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${st.cls}`}>
                      {st.label}
                    </span>
                    <span className="text-sm text-gray-700">
                      {m.iban_last4 ? (
                        <>IBAN **** {m.iban_last4}</>
                      ) : m.status === 'pending' ? (
                        <>En attente de signature</>
                      ) : (
                        <>IBAN inconnu</>
                      )}
                    </span>
                    <span className="text-xs text-gray-400">
                      créé le {formatDate(m.created_at)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {m.nb_prelevements} prélèvement{m.nb_prelevements > 1 ? 's' : ''} · solde{' '}
                    {formatEuros(m.solde_cents)} · 1er {formatDate(m.start_date)}
                  </div>
                </div>
                {m.payments?.length > 0 && (
                  <table className="w-full mt-3 text-xs">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th className="font-normal py-1">#</th>
                        <th className="font-normal py-1">Date</th>
                        <th className="font-normal py-1">Montant</th>
                        <th className="font-normal py-1">État</th>
                      </tr>
                    </thead>
                    <tbody>
                      {m.payments.map((p, i) => {
                        const pl = PAYMENT_LABEL[p.status] || {
                          label: p.status,
                          cls: 'bg-gray-100 text-gray-700',
                        };
                        return (
                          <tr key={p.id} className="border-t border-gray-50">
                            <td className="py-1 text-gray-500">{i + 1}</td>
                            <td className="py-1">{formatDate(p.charge_date)}</td>
                            <td className="py-1">{formatEuros(p.amount)}</td>
                            <td className="py-1">
                              <span className={`px-2 py-0.5 rounded-full ${pl.cls}`}>{pl.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="font-[var(--font-outfit)] text-lg font-bold text-dark mb-1">
              {modal.kind === 'replace' ? 'Changer le RIB' : 'Mettre en place le prélèvement'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {modal.kind === 'replace'
                ? 'Un nouveau mandat sera signé par l’élève. À la signature, l’ancien RIB sera révoqué et les prélèvements re-planifiés sur le nouveau.'
                : 'Précisez le solde restant à prélever et le nombre d’échéances.'}
            </p>

            {!lastLink ? (
              <>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500">Solde restant (€)</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={soldeEuros}
                      onChange={(e) => setSoldeEuros(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500">
                      Nombre de prélèvements (1 à 7)
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={7}
                      value={nb}
                      onChange={(e) => setNb(parseInt(e.target.value) || 1)}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50"
                    />
                  </label>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={submit}
                    disabled={launching}
                    className="px-3 py-2 rounded-lg bg-teal text-white text-sm font-semibold disabled:opacity-50"
                  >
                    {launching ? 'Création…' : 'Générer le lien'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-2 p-3 rounded-lg bg-gray-50 text-xs break-all">
                  <a href={lastLink} target="_blank" rel="noreferrer" className="text-teal underline">
                    {lastLink}
                  </a>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Transmettez ce lien à l’élève, ou envoyez-le par email directement.
                </p>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(lastLink);
                      setMsg({ text: 'Lien copié dans le presse-papier.', error: false });
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                  >
                    Copier le lien
                  </button>
                  <button
                    onClick={sendByEmail}
                    disabled={launching}
                    className="px-3 py-2 rounded-lg bg-navy text-white text-sm font-semibold disabled:opacity-50"
                  >
                    {launching ? 'Envoi…' : 'Envoyer par email'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
