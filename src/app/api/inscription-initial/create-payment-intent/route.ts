import { NextResponse } from 'next/server';
import { ACOMPTE_CENTS, ACOMPTE_CURRENCY } from '@/lib/acompte';
import { getStripeServer, isStripeConfiguredServer } from '@/lib/stripe-server';

export async function POST(request: Request) {
  if (!isStripeConfiguredServer()) {
    return NextResponse.json(
      {
        error:
          'Stripe n’est pas encore configuré. Ajoutez STRIPE_SECRET_KEY et NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.',
        code: 'STRIPE_NOT_CONFIGURED',
      },
      { status: 503 }
    );
  }

  const stripe = getStripeServer();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe indisponible.' }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const prenom = typeof body.prenom === 'string' ? body.prenom.trim() : '';
    const nom = typeof body.nom === 'string' ? body.nom.trim() : '';

    const paymentIntent = await stripe.paymentIntents.create({
      amount: ACOMPTE_CENTS,
      currency: ACOMPTE_CURRENCY,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      receipt_email: email || undefined,
      description: 'Acompte pré-inscription BTS Biologie Médicale — formation initiale 2026-2028',
      metadata: {
        formation: 'bts-biologie-medicale-initial',
        cycle: '2026-2028',
        type: 'acompte_preinscription',
        prenom,
        nom,
        email,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: ACOMPTE_CENTS,
    });
  } catch (err) {
    console.error('[create-payment-intent]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur Stripe' },
      { status: 500 }
    );
  }
}
