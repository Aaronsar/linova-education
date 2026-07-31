/** Acompte de pré-inscription (en centimes) — carte ou chèque. */
export const ACOMPTE_CENTS = 40_000; // 400,00 €
export const ACOMPTE_LABEL = '400 €';
export const ACOMPTE_CURRENCY = 'eur';

/** Solde annuel : frais annuels − acompte (indicatif, hors tarif boursier). */
export const FRAIS_ANNUELS_CENTS = 600_000; // 6 000 €
export const FRAIS_ANNUELS_LABEL = '6 000 €';

/** Nombre max de chèques pour le solde annuel. */
export const ECHEANCES_CHEQUE_MAX = 10;

export type ModeAcompte = 'carte' | 'cheque';

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || '';

export function isStripeConfiguredClient(): boolean {
  return STRIPE_PUBLISHABLE_KEY.length > 0;
}

/** Montant indicatif par chèque du solde (après acompte), en euros. */
export function montantParChequeEuros(n: number): number {
  const solde = FRAIS_ANNUELS_CENTS - ACOMPTE_CENTS;
  if (n < 1) return solde / 100;
  return Math.round(solde / n) / 100;
}
