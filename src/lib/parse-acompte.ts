/** Parse l’acompte de pré-inscription depuis le champ `remarques` d’une candidature. */

import { ACOMPTE_LABEL } from '@/lib/acompte';

export type AcompteMode = 'carte' | 'cheque' | 'especes' | null;
export type ManualAcompteMode = 'especes' | 'cheque';

export type ParsedAcompte = {
  hasAcompteLine: boolean;
  mode: AcompteMode;
  /** Acompte déclaré payé dans le dossier (carte, espèces, chèque reçu — hors vérif Stripe live). */
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
  const especes = /esp[eè]ces/i.test(line);
  const cheque = /ch[eè]que/i.test(line);
  const chequeRecu = cheque && /re[cç]u/i.test(line);
  const paidCarte = carte && (/pay[eé]/i.test(line) || Boolean(piMatch) || Boolean(csMatch) || buyButton);
  const paidEspeces = especes && /pay[eé]/i.test(line);
  const paid = paidCarte || paidEspeces || chequeRecu;

  return {
    hasAcompteLine: true,
    mode: carte ? 'carte' : especes ? 'especes' : cheque ? 'cheque' : null,
    paid,
    pendingCheque: cheque && !chequeRecu && !carte,
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

export type AcompteDisplayKind =
  | 'paye_stripe'
  | 'paye_especes'
  | 'paye_cheque'
  | 'cheque'
  | 'non_concerne'
  | 'inconnu';

export function isAcomptePayeKind(kind: AcompteDisplayKind): boolean {
  return kind === 'paye_stripe' || kind === 'paye_especes' || kind === 'paye_cheque';
}

export function acompteDisplayKind(
  parsed: ParsedAcompte,
  stripe: StripeAcompteLive | null | undefined
): AcompteDisplayKind {
  if (stripe?.paid || (parsed.paid && parsed.mode === 'carte')) return 'paye_stripe';
  if (parsed.paid && parsed.mode === 'especes') return 'paye_especes';
  if (parsed.paid && parsed.mode === 'cheque') return 'paye_cheque';
  if (parsed.paid) return 'paye_stripe';
  if (parsed.pendingCheque || parsed.mode === 'cheque') return 'cheque';
  if (!parsed.hasAcompteLine) return 'non_concerne';
  return 'inconnu';
}

export const ACOMPTE_BADGE: Record<
  AcompteDisplayKind,
  { label: string; bg: string; text: string }
> = {
  paye_stripe: { label: 'Acompte payé', bg: 'bg-green-100', text: 'text-green-700' },
  paye_especes: { label: 'Payé espèces', bg: 'bg-green-100', text: 'text-green-700' },
  paye_cheque: { label: 'Chèque reçu', bg: 'bg-green-100', text: 'text-green-700' },
  cheque: { label: 'Chèque en attente', bg: 'bg-amber-100', text: 'text-amber-800' },
  non_concerne: { label: '—', bg: 'bg-gray-100', text: 'text-gray-500' },
  inconnu: { label: 'Acompte inconnu', bg: 'bg-gray-100', text: 'text-gray-600' },
};

const ACOMPTE_LINE_RE = /^Acompte pré-inscription/i;

export function upsertManualAcompteLine(
  remarques: string | null | undefined,
  mode: ManualAcompteMode,
  when = new Date()
): string {
  const date = when.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const line =
    mode === 'especes'
      ? `Acompte pré-inscription (${ACOMPTE_LABEL}) : payé en espèces · saisi manuellement le ${date}`
      : `Acompte pré-inscription (${ACOMPTE_LABEL}) : chèque reçu · saisi manuellement le ${date}`;

  const lines = (remarques || '').split('\n');
  const idx = lines.findIndex((l) => ACOMPTE_LINE_RE.test(l.trim()));
  if (idx >= 0) {
    lines[idx] = line;
    return lines.join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
  }
  const base = (remarques || '').trim();
  return base ? `${base}\n${line}` : line;
}
