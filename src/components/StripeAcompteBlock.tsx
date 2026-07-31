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
  isStripeConfiguredClient,
} from '@/lib/acompte';

interface StripeAcompteBlockProps {
  email: string;
  prenom: string;
  nom: string;
  onPaid: (paymentIntentId: string) => void;
  disabled?: boolean;
}

function CheckoutForm({
  onPaid,
  disabled,
}: {
  onPaid: (paymentIntentId: string) => void;
  disabled?: boolean;
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

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Vérifiez vos informations de paiement.');
      setBusy(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url:
          typeof window !== 'undefined'
            ? `${window.location.origin}/inscription-initial?paiement=ok`
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
          : `Payer l'acompte de ${ACOMPTE_LABEL} par carte — commande avec obligation de paiement`}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Paiement sécurisé Stripe · droit de rétractation 14 jours (art. 6).
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
}: StripeAcompteBlockProps) {
  const configured = isStripeConfiguredClient();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);

  const stripePromise = useMemo<Promise<Stripe | null> | null>(() => {
    if (!configured) return null;
    return loadStripe(STRIPE_PUBLISHABLE_KEY);
  }, [configured]);

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
    if (configured) {
      void createIntent();
    }
  }, [configured, createIntent]);

  if (!configured) {
    return (
      <div className="rounded-xl border border-dashed border-teal/40 bg-teal/5 p-6 space-y-3">
        <p className="font-semibold text-dark text-sm">Bloc Stripe prêt à brancher</p>
        <p className="text-sm text-gray-600">
          Le paiement par carte sera activé dès que les clés Stripe seront renseignées :
        </p>
        <ul className="text-xs text-gray-500 font-mono space-y-1 list-disc list-inside">
          <li>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</li>
          <li>STRIPE_SECRET_KEY</li>
        </ul>
        <p className="text-xs text-gray-500">
          En attendant les clés, le parcours (choix du paiement annuel + acompte carte) est déjà
          structuré dans le formulaire.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
        Préparation du paiement sécurisé…
      </div>
    );
  }

  if (loadError || !clientSecret || !stripePromise) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 space-y-3">
        <p className="text-sm text-red-700">{loadError || 'Paiement indisponible.'}</p>
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
      <CheckoutForm onPaid={onPaid} disabled={disabled} />
    </Elements>
  );
}
