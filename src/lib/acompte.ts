/** Acompte de pré-inscription (en centimes) — carte ou chèque. */
export const ACOMPTE_CENTS = 40_000; // 400,00 €
export const ACOMPTE_LABEL = '400 €';
export const ACOMPTE_CURRENCY = 'eur';

/** Solde annuel : frais annuels − acompte (indicatif, hors tarif boursier). */
export const FRAIS_ANNUELS_CENTS = 600_000; // 6 000 €
export const FRAIS_ANNUELS_LABEL = '6 000 €';
export const FRAIS_BOURSIERS_CENTS = 500_000; // 5 000 €
export const FRAIS_BOURSIERS_LABEL = '5 000 €';

/** Variante /inscription-initial-2a — tarif annuel 5 000 € (4 000 € boursiers). */
export const FRAIS_ANNUELS_2A_CENTS = 500_000; // 5 000 €
export const FRAIS_ANNUELS_2A_LABEL = '5 000 €';
export const FRAIS_BOURSIERS_2A_CENTS = 400_000; // 4 000 €
export const FRAIS_BOURSIERS_2A_LABEL = '4 000 €';

/** Nombre max de chèques pour le solde annuel. */
export const ECHEANCES_CHEQUE_MAX = 10;

export type ModeAcompte = 'carte' | 'cheque';

/** Stripe Buy Button — frais d'inscription. */
export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ||
  'pk_live_zORywa2gPbUKO9G3GHQJjM6p00ZHsuGZ7d';

export const STRIPE_BUY_BUTTON_ID =
  process.env.NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID?.trim() ||
  'buy_btn_1TzHvhJlLyuMN0ehzX1yEQWv';

export const INSCRIPTION_DRAFT_KEY = 'linova_inscription_initial_draft';

export function isStripeConfiguredClient(): boolean {
  return STRIPE_PUBLISHABLE_KEY.length > 0 && STRIPE_BUY_BUTTON_ID.length > 0;
}

/** Montant indicatif par chèque du solde (après acompte), en euros. */
export function montantParChequeEuros(
  n: number,
  fraisAnnuelsCents: number = FRAIS_ANNUELS_CENTS
): number {
  const solde = Math.max(0, fraisAnnuelsCents - ACOMPTE_CENTS);
  if (n < 1) return solde / 100;
  return Math.round(solde / n) / 100;
}
