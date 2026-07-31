import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripeServer(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: '2026-07-29.dahlia',
      typescript: true,
    });
  }
  return stripeClient;
}

export function isStripeConfiguredServer(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}
