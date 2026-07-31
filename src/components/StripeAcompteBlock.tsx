'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ACOMPTE_LABEL,
  STRIPE_BUY_BUTTON_ID,
  STRIPE_PUBLISHABLE_KEY,
  isStripeConfiguredClient,
} from '@/lib/acompte';

interface StripeAcompteBlockProps {
  email: string;
  prenom: string;
  nom: string;
  clientReferenceId?: string;
  /** Appelé juste avant le clic Stripe (sauvegarde du brouillon, uploads…). */
  onBeforeCheckout?: () => void | Promise<void>;
  disabled?: boolean;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'buy-button-id': string;
        'publishable-key': string;
        'customer-email'?: string;
        'client-reference-id'?: string;
      };
    }
  }
}

export default function StripeAcompteBlock({
  email,
  prenom,
  nom,
  clientReferenceId,
  onBeforeCheckout,
  disabled,
}: StripeAcompteBlockProps) {
  const configured = isStripeConfiguredClient();
  const [scriptReady, setScriptReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!configured) return;

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.stripe.com/v3/buy-button.js"]'
    );
    if (existing) {
      setScriptReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
  }, [configured]);

  /** Sauvegarde le brouillon dès qu'on interagit avec le bouton Stripe. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !onBeforeCheckout) return;

    const handler = () => {
      void onBeforeCheckout();
    };
    el.addEventListener('pointerdown', handler, true);
    el.addEventListener('click', handler, true);
    return () => {
      el.removeEventListener('pointerdown', handler, true);
      el.removeEventListener('click', handler, true);
    };
  }, [onBeforeCheckout, scriptReady]);

  if (!configured) {
    return (
      <div className="rounded-xl border border-dashed border-teal/40 bg-teal/5 p-6 space-y-3">
        <p className="font-semibold text-dark text-sm">Stripe Buy Button non configuré</p>
        <p className="text-xs text-gray-500 font-mono">
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY · NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID
        </p>
      </div>
    );
  }

  if (!scriptReady) {
    return (
      <div className="rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
        Chargement du paiement sécurisé…
      </div>
    );
  }

  const refId =
    clientReferenceId ||
    `${prenom}-${nom}`.trim().replace(/\s+/g, '-').slice(0, 80) ||
    undefined;

  return (
    <div
      ref={wrapRef}
      className={`space-y-4 ${disabled ? 'pointer-events-none opacity-50' : ''}`}
    >
      <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col items-center gap-3">
        <p className="text-sm text-gray-600 text-center">
          Règlement de l&apos;acompte de pré-inscription{' '}
          <strong className="text-dark">{ACOMPTE_LABEL}</strong> — commande avec obligation de
          paiement.
        </p>
        <stripe-buy-button
          buy-button-id={STRIPE_BUY_BUTTON_ID}
          publishable-key={STRIPE_PUBLISHABLE_KEY}
          customer-email={email || undefined}
          client-reference-id={refId}
        />
      </div>
      <p className="text-xs text-gray-400 text-center">
        Paiement sécurisé Stripe. Après règlement, vous revenez automatiquement pour finaliser le
        dossier. Droit de rétractation 14 jours (art. 6).
      </p>
    </div>
  );
}
