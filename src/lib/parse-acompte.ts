/** Parse l’acompte de pré-inscription depuis le champ `remarques` d’une candidature. */

export type AcompteMode = 'carte' | 'cheque' | null;

export type ParsedAcompte = {
  hasAcompteLine: boolean;
  mode: AcompteMode;
  /** Acompte carte déclaré payé dans le dossier (hors vérif Stripe live). */
  paid: boolean;
  pendingCheque: boolean;
  paymentIntentId: string | null;
  checkoutSessionId: string | null;
  stripeRef: string | null;
  detail: string | null;
};

export type StripeAcompteLive = {
  id: string;
  kind: 'payment_intent' | 'checkout_session';
  status: string;
  paid: boolean;
  amount: number;
  currency: string;
  email: string;
  prenom: string;
  nom: string;
  created: number;
  livemode: boolean;
  dashboardUrl: string;
  checkoutSessionId?: string;
};

export function parseAcompteFromRemarques(remarques: string | null | undefined): ParsedAcompte {
  const empty: ParsedAcompte = {
    hasAcompteLine: false,
    mode: null,
    paid: false,
    pendingCheque: false,
    paymentIntentId: null,
    checkoutSessionId: null,
    stripeRef: null,
    detail: null,
  };
  if (!remarques) return empty;

  const line =
    remarques.split('\n').find((l) => /^Acompte pré-inscription/i.test(l.trim()))?.trim() || '';
  if (!line) return empty;

  const piMatch = line.match(/\b(pi_[A-Za-z0-9]+)/);
  const csMatch = line.match(/\b(cs_[A-Za-z0-9]+)/);
  const refMatch = line.match(/ref=([A-Za-z0-9_]+)/i);
  const buyButton = /Stripe Buy Button/i.test(line);
  const carte = /carte/i.test(line) || buyButton || Boolean(piMatch) || Boolean(csMatch);
  const cheque = /ch[eè]que/i.test(line);
  const paid = carte && (/pay[eé]/i.test(line) || Boolean(piMatch) || Boolean(csMatch) || buyButton);

  return {
    hasAcompteLine: true,
    mode: carte ? 'carte' : cheque ? 'cheque' : null,
    paid,
    pendingCheque: cheque && !carte,
    paymentIntentId: piMatch?.[1] || null,
    checkoutSessionId: csMatch?.[1] || null,
    stripeRef: piMatch?.[1] || csMatch?.[1] || refMatch?.[1] || null,
    detail: line,
  };
}

export function stripeDashboardUrl(id: string, livemode = true): string {
  const base = livemode ? 'https://dashboard.stripe.com' : 'https://dashboard.stripe.com/test';
  if (id.startsWith('pi_')) return `${base}/payments/${id}`;
  if (id.startsWith('cs_')) return `${base}/checkout/sessions/${id}`;
  return `${base}/search?query=${encodeURIComponent(id)}`;
}

export function isStripePaidStatus(status: string): boolean {
  return status === 'succeeded' || status === 'processing' || status === 'paid' || status === 'complete';
}

export function normalizeEmail(email: string | null | undefined): string {
  return (email || '').trim().toLowerCase();
}

export type AcompteDisplayKind = 'paye_stripe' | 'cheque' | 'non_concerne' | 'inconnu';

export function acompteDisplayKind(
  parsed: ParsedAcompte,
  stripe: StripeAcompteLive | null | undefined
): AcompteDisplayKind {
  if (stripe?.paid || parsed.paid) return 'paye_stripe';
  if (parsed.pendingCheque || parsed.mode === 'cheque') return 'cheque';
  if (!parsed.hasAcompteLine) return 'non_concerne';
  return 'inconnu';
}

export const ACOMPTE_BADGE: Record<
  AcompteDisplayKind,
  { label: string; bg: string; text: string }
> = {
  paye_stripe: { label: 'Acompte payé', bg: 'bg-green-100', text: 'text-green-700' },
  cheque: { label: 'Chèque en attente', bg: 'bg-amber-100', text: 'text-amber-800' },
  non_concerne: { label: '—', bg: 'bg-gray-100', text: 'text-gray-500' },
  inconnu: { label: 'Acompte inconnu', bg: 'bg-gray-100', text: 'text-gray-600' },
};
