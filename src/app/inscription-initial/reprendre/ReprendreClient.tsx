'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SignaturePad from '@/components/SignaturePad';
import {
  ACOMPTE_CENTS,
  ACOMPTE_LABEL,
  FRAIS_ANNUELS_CENTS,
  FRAIS_ANNUELS_LABEL,
} from '@/lib/acompte';
import {
  ECHEANCES_PRELEVEMENT_MAX,
  computeFirstPrelevementDate,
  formatDateFr,
  listPrelevementSchedule,
  montantParPrelevementEuros,
} from '@/lib/gocardless';

const DRAFT_PREFIX = 'linova_reprise_mandat_';

type Draft = {
  payment_intent_id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  code_postal: string;
  ville: string;
  nb_prelevements: number;
  signature_prelevement_nom: string;
  signature_prelevement_image: string;
  billing_request_id?: string;
};

export default function ReprendreMandatPage() {
  const params = useSearchParams();
  const piFromUrl = params.get('pi') || params.get('payment_intent') || '';
  const gcOk = params.get('gocardless') === 'ok';
  const gcExit = params.get('gocardless') === 'exit';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ reference: string; id: string } | null>(null);
  const [verified, setVerified] = useState<{
    paymentIntentId: string;
    email: string;
    prenom: string;
    nom: string;
  } | null>(null);

  const [form, setForm] = useState<Draft>({
    payment_intent_id: '',
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    code_postal: '',
    ville: '',
    nb_prelevements: 7,
    signature_prelevement_nom: '',
    signature_prelevement_image: '',
  });

  const firstDate = computeFirstPrelevementDate();
  const schedule = useMemo(
    () =>
      listPrelevementSchedule(
        form.nb_prelevements,
        FRAIS_ANNUELS_CENTS,
        ACOMPTE_CENTS,
        firstDate
      ),
    [form.nb_prelevements, firstDate]
  );

  const signatureOk = (() => {
    const expected = `${form.prenom} ${form.nom}`.trim().toLowerCase().replace(/\s+/g, ' ');
    const typed = form.signature_prelevement_nom.trim().toLowerCase().replace(/\s+/g, ' ');
    return typed.length > 0 && typed === expected && Boolean(form.signature_prelevement_image);
  })();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pi =
        piFromUrl ||
        (() => {
          try {
            return sessionStorage.getItem(`${DRAFT_PREFIX}last_pi`) || '';
          } catch {
            return '';
          }
        })();

      if (!pi.startsWith('pi_')) {
        setError('Lien invalide : identifiant de paiement manquant.');
        setLoading(false);
        return;
      }

      try {
        const raw = sessionStorage.getItem(`${DRAFT_PREFIX}${pi}`);
        if (raw) {
          const draft = JSON.parse(raw) as Draft;
          if (!cancelled) setForm((prev) => ({ ...prev, ...draft, payment_intent_id: pi }));
        }
      } catch {
        /* ignore */
      }

      try {
        const res = await fetch('/api/inscription-initial/reprise/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_intent_id: pi }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Paiement introuvable.');
        if (cancelled) return;
        setVerified({
          paymentIntentId: data.paymentIntentId,
          email: data.email,
          prenom: data.prenom,
          nom: data.nom,
        });
        setForm((prev) => ({
          ...prev,
          payment_intent_id: data.paymentIntentId,
          email: prev.email || data.email || '',
          prenom: prev.prenom || data.prenom || '',
          nom: prev.nom || data.nom || '',
        }));
        sessionStorage.setItem(`${DRAFT_PREFIX}last_pi`, data.paymentIntentId);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Vérification impossible.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [piFromUrl]);

  useEffect(() => {
    if (!gcOk || loading || !verified || done) return;
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError('');
      try {
        const pi = verified.paymentIntentId;
        const raw = sessionStorage.getItem(`${DRAFT_PREFIX}${pi}`);
        const draft = raw ? (JSON.parse(raw) as Draft) : form;
        const brq =
          draft.billing_request_id ||
          sessionStorage.getItem(`${DRAFT_PREFIX}${pi}_brq`) ||
          '';
        if (!brq.startsWith('BRQ')) {
          throw new Error('Référence de mandat manquante. Relancez la signature du mandat.');
        }
        const res = await fetch('/api/inscription-initial/reprise/finalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...draft,
            billing_request_id: brq,
            payment_intent_id: pi,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Finalisation impossible.');
        if (cancelled) return;
        sessionStorage.removeItem(`${DRAFT_PREFIX}${pi}`);
        sessionStorage.removeItem(`${DRAFT_PREFIX}${pi}_brq`);
        setDone({
          id: data.id,
          reference: data.reference || `INI-${String(data.id).slice(0, 8).toUpperCase()}`,
        });
        window.history.replaceState(
          {},
          '',
          `/inscription-initial/reprendre?pi=${encodeURIComponent(pi)}`
        );
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur après signature du mandat.');
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gcOk, loading, verified]);

  const saveDraft = (next: Draft) => {
    setForm(next);
    try {
      sessionStorage.setItem(`${DRAFT_PREFIX}${next.payment_intent_id}`, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const startMandate = async () => {
    if (!verified) return;
    if (!form.telephone.trim()) {
      setError('Indiquez votre téléphone.');
      return;
    }
    if (!signatureOk) {
      setError('Signez avec votre prénom et nom exacts, puis dessinez votre signature.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const draft: Draft = { ...form, payment_intent_id: verified.paymentIntentId };
      saveDraft(draft);
      const res = await fetch('/api/inscription-initial/gocardless/create-mandate-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: draft.email,
          prenom: draft.prenom,
          nom: draft.nom,
          basePath: '/inscription-initial/reprendre',
          nb_prelevements: draft.nb_prelevements,
          frais_annuels_cents: FRAIS_ANNUELS_CENTS,
          start_date: computeFirstPrelevementDate(),
          payment_intent_id: verified.paymentIntentId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Impossible de démarrer GoCardless.');
      if (data.billingRequestId) {
        const withBrq = { ...draft, billing_request_id: String(data.billingRequestId) };
        saveDraft(withBrq);
        sessionStorage.setItem(
          `${DRAFT_PREFIX}${verified.paymentIntentId}_brq`,
          String(data.billingRequestId)
        );
      }
      if (!data.authorisationUrl) throw new Error('URL de mandat manquante.');
      window.location.href = data.authorisationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur GoCardless.');
      setBusy(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal';

  if (loading) {
    return (
      <main className="min-h-screen bg-light flex items-center justify-center p-6">
        <p className="text-gray-500 text-sm">Vérification du paiement…</p>
      </main>
    );
  }

  if (done) {
    return (
      <main className="min-h-screen bg-light flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm p-8 text-center space-y-3">
          <h1 className="text-2xl font-bold text-dark">Mandat signé — dossier enregistré</h1>
          <p className="text-gray-600 text-sm">
            Votre prélèvement SEPA est en place et relié à votre acompte déjà payé.
          </p>
          <p className="text-sm text-gray-500">
            Référence :{' '}
            <span className="font-mono font-semibold text-dark">{done.reference}</span>
          </p>
        </div>
      </main>
    );
  }

  if (error && !verified) {
    return (
      <main className="min-h-screen bg-light flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm p-8 space-y-3">
          <h1 className="text-xl font-bold text-dark">Lien de reprise invalide</h1>
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-sm text-gray-500">
            Contactez admissions@linova-education.fr avec votre preuve de paiement.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-light py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        <div>
          <p className="text-xs font-semibold text-teal uppercase tracking-wide mb-1">
            Reprise — acompte déjà payé
          </p>
          <h1 className="text-2xl font-bold text-dark">Signer le mandat de prélèvement SEPA</h1>
          <p className="text-sm text-gray-500 mt-2">
            Votre acompte de {ACOMPTE_LABEL} a bien été reçu. Il reste à mettre en place le
            prélèvement pour le solde ({FRAIS_ANNUELS_LABEL} − {ACOMPTE_LABEL}), sans repayer.
          </p>
          {verified && (
            <p className="text-xs text-gray-400 mt-2 font-mono break-all">
              Stripe : {verified.paymentIntentId}
            </p>
          )}
        </div>

        {gcExit && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
            Signature GoCardless annulée. Vous pouvez réessayer ci-dessous.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Prénom *</label>
            <input
              className={inputClass}
              value={form.prenom}
              onChange={(e) => saveDraft({ ...form, prenom: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Nom *</label>
            <input
              className={inputClass}
              value={form.nom}
              onChange={(e) => saveDraft({ ...form, nom: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">E-mail *</label>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => saveDraft({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Téléphone *</label>
          <input
            className={inputClass}
            value={form.telephone}
            onChange={(e) => saveDraft({ ...form, telephone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Adresse</label>
          <input
            className={inputClass}
            value={form.adresse}
            onChange={(e) => saveDraft({ ...form, adresse: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Code postal</label>
            <input
              className={inputClass}
              value={form.code_postal}
              onChange={(e) => saveDraft({ ...form, code_postal: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Ville</label>
            <input
              className={inputClass}
              value={form.ville}
              onChange={(e) => saveDraft({ ...form, ville: e.target.value })}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-dark mb-2">
            Nombre de prélèvements (1 à {ECHEANCES_PRELEVEMENT_MAX}) — 1er le{' '}
            {formatDateFr(firstDate)}
          </p>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: ECHEANCES_PRELEVEMENT_MAX }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => saveDraft({ ...form, nb_prelevements: n })}
                className={`py-2.5 rounded-xl border-2 text-sm font-semibold ${
                  form.nb_prelevements === n
                    ? 'border-teal bg-teal/5 text-teal'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Environ{' '}
            <strong>
              {montantParPrelevementEuros(
                form.nb_prelevements,
                FRAIS_ANNUELS_CENTS,
                ACOMPTE_CENTS
              ).toFixed(2)}{' '}
              €
            </strong>{' '}
            / prélèvement.
          </p>
          <ul className="mt-3 text-xs text-gray-600 space-y-1">
            {schedule.map((e) => (
              <li key={e.index}>
                {e.index}
                {e.index === 1 ? 'er' : 'e'} — {formatDateFr(e.date)} — {e.euros} €
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3">
          <p className="font-semibold text-dark text-sm">Signature — engagement de prélèvement</p>
          <input
            className={inputClass}
            placeholder={`${form.prenom} ${form.nom}`.trim() || 'Prénom Nom'}
            value={form.signature_prelevement_nom}
            onChange={(e) => saveDraft({ ...form, signature_prelevement_nom: e.target.value })}
          />
          <SignaturePad
            value={form.signature_prelevement_image}
            onChange={(dataUrl) =>
              saveDraft({ ...form, signature_prelevement_image: dataUrl })
            }
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={busy || !signatureOk}
          onClick={() => void startMandate()}
          className="w-full py-4 bg-yellow text-dark font-bold rounded-xl hover:brightness-95 disabled:opacity-50"
        >
          {busy ? 'Redirection GoCardless…' : 'Signer le mandat SEPA (sans repayer)'}
        </button>
      </div>
    </main>
  );
}
