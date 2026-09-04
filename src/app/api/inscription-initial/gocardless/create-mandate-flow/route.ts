import { NextResponse } from 'next/server';
import {
  ECHEANCES_PRELEVEMENT_MAX,
  computeFirstPrelevementDate,
  gocardlessFetch,
  isGoCardlessConfigured,
  packBillingMetadata,
  splitSoldeCents,
} from '@/lib/gocardless';
import { ACOMPTE_CENTS } from '@/lib/acompte';

export async function POST(request: Request) {
  if (!isGoCardlessConfigured()) {
    return NextResponse.json(
      { error: 'GoCardless n’est pas configuré.', code: 'GOCARDLESS_NOT_CONFIGURED' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const prenom = typeof body.prenom === 'string' ? body.prenom.trim() : '';
    const nom = typeof body.nom === 'string' ? body.nom.trim() : '';
    const basePath =
      typeof body.basePath === 'string' && body.basePath.startsWith('/inscription-initial')
        ? body.basePath
        : '/inscription-initial';
    const nb = Math.min(
      ECHEANCES_PRELEVEMENT_MAX,
      Math.max(1, Number(body.nb_prelevements) || 1)
    );
    const fraisAnnuelsCents = Math.max(0, Number(body.frais_annuels_cents) || 0);
    const soldeCents = Math.max(0, fraisAnnuelsCents - ACOMPTE_CENTS);
    const startDate =
      typeof body.start_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.start_date)
        ? body.start_date
        : computeFirstPrelevementDate();
    const paymentIntentId =
      typeof body.payment_intent_id === 'string' && body.payment_intent_id.startsWith('pi_')
        ? body.payment_intent_id.trim()
        : '';

    if (!email.includes('@') || !prenom || !nom) {
      return NextResponse.json({ error: 'Identité incomplète pour le mandat.' }, { status: 400 });
    }
    if (soldeCents < 100) {
      return NextResponse.json({ error: 'Montant du solde invalide.' }, { status: 400 });
    }

    const amounts = splitSoldeCents(soldeCents, nb);
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://linova-education.fr');

    const returnQs = new URLSearchParams({ gocardless: 'ok' });
    if (basePath.includes('reprendre') && paymentIntentId) {
      returnQs.set('pi', paymentIntentId);
    } else {
      returnQs.set('etape', 'paiement');
    }
    const exitQs = new URLSearchParams({ gocardless: 'exit' });
    if (basePath.includes('reprendre') && paymentIntentId) {
      exitQs.set('pi', paymentIntentId);
    } else {
      exitQs.set('etape', 'paiement');
    }
    const redirectUri = `${origin}${basePath}?${returnQs.toString()}`;
    const exitUri = `${origin}${basePath}?${exitQs.toString()}`;

    // GoCardless n’autorise que 3 clés de metadata sur billing_requests.
    const metadata = packBillingMetadata({
      email,
      prenom,
      nom,
      nb,
      soldeCents,
      amounts,
      startDate,
      basePath,
    });

    const brRes = await gocardlessFetch<{
      billing_requests: { id: string };
    }>('/billing_requests', {
      method: 'POST',
      body: JSON.stringify({
        billing_requests: {
          mandate_request: {
            currency: 'EUR',
            scheme: 'sepa_core',
            description: `Linova — solde scolarité (${nb} prélèvement${nb > 1 ? 's' : ''}, 1er ${startDate})`,
          },
          metadata,
        },
      }),
    });

    const billingRequestId = brRes.billing_requests.id;

    const flowRes = await gocardlessFetch<{
      billing_request_flows: { id: string; authorisation_url: string };
    }>('/billing_request_flows', {
      method: 'POST',
      body: JSON.stringify({
        billing_request_flows: {
          auto_fulfil: true,
          lock_customer_details: false,
          redirect_uri: redirectUri,
          exit_uri: exitUri,
          prefilled_customer: {
            given_name: prenom,
            family_name: nom,
            email,
          },
          links: {
            billing_request: billingRequestId,
          },
        },
      }),
    });

    return NextResponse.json({
      billingRequestId,
      authorisationUrl: flowRes.billing_request_flows.authorisation_url,
      nb,
      soldeCents,
      amounts,
      startDate,
    });
  } catch (err) {
    console.error('[gocardless/create-mandate-flow]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur GoCardless' },
      { status: 500 }
    );
  }
}
