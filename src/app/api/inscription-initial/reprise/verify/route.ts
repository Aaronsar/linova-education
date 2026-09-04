import { NextResponse } from 'next/server';
import { ACOMPTE_CENTS } from '@/lib/acompte';
import { getStripeServer, isStripeConfiguredServer } from '@/lib/stripe-server';

/** Vérifie qu’un PaymentIntent acompte est bien payé (reprise après bug). */
export async function POST(request: Request) {
  if (!isStripeConfiguredServer()) {
    return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 503 });
  }
  const stripe = getStripeServer();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe indisponible.' }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const piId = typeof body.payment_intent_id === 'string' ? body.payment_intent_id.trim() : '';
    if (!piId.startsWith('pi_')) {
      return NextResponse.json({ error: 'Identifiant de paiement invalide.' }, { status: 400 });
    }

    const pi = await stripe.paymentIntents.retrieve(piId);
    if (pi.status !== 'succeeded' && pi.status !== 'processing') {
      return NextResponse.json(
        { error: `Paiement non confirmé (statut : ${pi.status}).` },
        { status: 400 }
      );
    }
    if (pi.amount !== ACOMPTE_CENTS) {
      return NextResponse.json(
        { error: 'Ce paiement ne correspond pas à l’acompte de pré-inscription.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      paymentIntentId: pi.id,
      amount: pi.amount,
      email: (pi.metadata?.email || pi.receipt_email || '').trim().toLowerCase(),
      prenom: (pi.metadata?.prenom || '').trim(),
      nom: (pi.metadata?.nom || '').trim(),
      paidAt: pi.created ? new Date(pi.created * 1000).toISOString() : null,
    });
  } catch (err) {
    console.error('[reprise/verify]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Vérification impossible.' },
      { status: 500 }
    );
  }
}
