'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  ACOMPTE_LABEL,
  STRIPE_PUBLISHABLE_KEY,
} from '@/lib/acompte';

interface StripeAcompteBlockProps {
  email: string;
  prenom: string;
  nom: string;
  onPaid: (paymentIntentId: string) => void;
  disabled?: boolean;
  /** Chemin de retour après 3DS / redirect (défaut : page courante). */
  returnPath?: string;
  /** Appelé juste avant confirmPayment (sauvegarde dossier si 3DS redirige). */
  onBeforeConfirm?: () => Promise<void>;
}

const PUBLISHABLE_KEY =
  STRIPE_PUBLISHABLE_KEY || 'pk_live_zORywa2gPbUKO9G3GHQJjM6p00ZHsuGZ7d';

function CheckoutForm({
  onPaid,
  disabled,
  returnPath,
  onBeforeConfirm,
}: {
  onPaid: (paymentIntentId: string) => void;
  disabled?: boolean;
  returnPath?: string;
  onBeforeConfirm?: () => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || disabled) return;

    setBusy(true);
    setError('');

    try {
      if (onBeforeConfirm) await onBeforeConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de sauvegarder le dossier avant paiement.');
      setBusy(false);
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Vérifiez vos informations de paiement.');
      setBusy(false);
      return;
    }

    const path =
      returnPath ||
      (typeof window !== 'undefined' ? window.location.pathname : '/inscription-initial');

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url:
          typeof window !== 'undefined'
            ? `${window.location.origin}${path}?paiement=ok`
            : undefined,
      },
    });

    if (confirmError) {
      setError(confirmError.message || 'Le paiement a échoué.');
      setBusy(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
      onPaid(paymentIntent.id);
      return;
    }

    setError('Paiement non finalisé. Veuillez réessayer.');
    setBusy(false);
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            business: { name: 'Linova Éducation' },
            wallets: { applePay: 'never', googlePay: 'auto' },
          }}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || busy || disabled}
        className="w-full py-4 bg-yellow text-dark font-bold rounded-xl hover:brightness-95 transition-all text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy
          ? 'Paiement en cours…'
          : `Payer ${ACOMPTE_LABEL} ici — commande avec obligation de paiement`}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Paiement sécurisé Stripe, sans quitter cette page. Droit de rétractation 14 jours (art. 6).
      </p>
    </form>
  );
}

export default function StripeAcompteBlock({
  email,
  prenom,
  nom,
  onPaid,
  disabled,
  returnPath,
  onBeforeConfirm,
}: StripeAcompteBlockProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [finalizingReturn, setFinalizingReturn] = useState(false);

  const stripePromise = useMemo<Promise<Stripe | null>>(
    () => loadStripe(PUBLISHABLE_KEY),
    []
  );

  const createIntent = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await fetch('/api/inscription-initial/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prenom, nom }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Impossible de préparer le paiement.');
      }
      setClientSecret(data.clientSecret);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Erreur de préparation Stripe.');
    } finally {
      setLoading(false);
    }
  }, [email, prenom, nom]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paiement') === 'ok' || params.get('payment_intent')) {
      setFinalizingReturn(true);
      setLoading(false);
      return;
    }
    void createIntent();
  }, [createIntent]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
        Préparation du paiement sécurisé…
      </div>
    );
  }

  if (finalizingReturn) {
    return (
      <div className="rounded-xl border border-teal/30 bg-teal/5 p-6 text-center text-sm text-gray-700">
        Paiement reçu — finalisation du dossier…
      </div>
    );
  }

  if (loadError || !clientSecret) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-3">
        <p className="text-sm text-amber-950 font-semibold">Paiement intégré indisponible</p>
        <p className="text-sm text-amber-900">
          {loadError ||
            'Ajoutez STRIPE_SECRET_KEY (clé secrète sk_live_…) sur Vercel pour afficher les champs carte ici.'}
        </p>
        <button
          type="button"
          onClick={() => void createIntent()}
          className="text-sm font-semibold text-teal underline cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 text-center">
        Règlement de l&apos;acompte <strong className="text-dark">{ACOMPTE_LABEL}</strong> —
        saisissez votre carte ci-dessous.
      </p>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0d9488',
              borderRadius: '12px',
            },
          },
          locale: 'fr',
        }}
      >
        <CheckoutForm
          onPaid={onPaid}
          disabled={disabled}
          returnPath={returnPath}
          onBeforeConfirm={onBeforeConfirm}
        />
      </Elements>
    </div>
  );
}
