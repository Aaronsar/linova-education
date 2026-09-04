import { NextResponse } from 'next/server';
import {
  addMonthsIso,
  gocardlessFetch,
  isGoCardlessConfigured,
  splitSoldeCents,
  unpackBillingMetadata,
} from '@/lib/gocardless';

type BillingRequest = {
  id: string;
  status: string;
  metadata?: Record<string, string>;
  links?: {
    mandate_request?: string;
    mandate?: string;
    customer?: string;
  };
  mandate_request?: {
    links?: { mandate?: string };
  };
};

/**
 * Après retour du flux GoCardless : vérifie le mandat, crée les prélèvements planifiés,
 * renvoie les IDs pour l’envoi du dossier.
 */
export async function POST(request: Request) {
  if (!isGoCardlessConfigured()) {
    return NextResponse.json({ error: 'GoCardless non configuré.' }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const billingRequestId =
      typeof body.billing_request_id === 'string' ? body.billing_request_id.trim() : '';
    if (!billingRequestId.startsWith('BRQ')) {
      return NextResponse.json({ error: 'billing_request_id manquant.' }, { status: 400 });
    }

    const brRes = await gocardlessFetch<{ billing_requests: BillingRequest }>(
      `/billing_requests/${billingRequestId}`
    );
    const br = brRes.billing_requests;

    if (br.status !== 'fulfilled') {
      return NextResponse.json(
        {
          error: `Mandat non finalisé (statut : ${br.status}). Reprenez le prélèvement ou choisissez le règlement par chèque.`,
          status: br.status,
        },
        { status: 400 }
      );
    }

    const mandateId =
      br.links?.mandate ||
      (br.links as { mandate_request_mandate?: string } | undefined)?.mandate_request_mandate ||
      br.mandate_request?.links?.mandate ||
      '';

    if (!mandateId) {
      const mrId = br.links?.mandate_request;
      if (mrId) {
        try {
          const mr = await gocardlessFetch<{
            mandate_requests: { links?: { mandate?: string } };
          }>(`/mandate_requests/${mrId}`);
          const mid = mr.mandate_requests.links?.mandate;
          if (mid) return finalizeWithMandate(mid, br.metadata || {});
        } catch (e) {
          console.warn('[gocardless/finalize] mandate_request lookup', e);
        }
      }
      const customerId = br.links?.customer;
      if (customerId) {
        const list = await gocardlessFetch<{ mandates: { id: string; created_at: string }[] }>(
          `/mandates?customer=${encodeURIComponent(customerId)}&limit=5`
        );
        const latest = [...(list.mandates || [])].sort((a, b) =>
          a.created_at < b.created_at ? 1 : -1
        )[0];
        if (latest?.id) return finalizeWithMandate(latest.id, br.metadata || {});
      }
      return NextResponse.json({ error: 'Mandat introuvable après signature.' }, { status: 400 });
    }

    return finalizeWithMandate(mandateId, br.metadata || {});
  } catch (err) {
    console.error('[gocardless/finalize]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur finalisation GoCardless' },
      { status: 500 }
    );
  }
}

async function finalizeWithMandate(mandateId: string, metadata: Record<string, string>) {
  const existing = await gocardlessFetch<{
    payments: { id: string; amount: number; charge_date: string; description?: string }[];
  }>(`/payments?mandate=${encodeURIComponent(mandateId)}&limit=20`);

  const already = (existing.payments || []).filter((p) =>
    (p.description || '').includes('Linova — solde')
  );
  if (already.length > 0) {
    return NextResponse.json({
      mandateId,
      paymentIds: already.map((p) => p.id),
      amounts: already.map((p) => p.amount),
      chargeDates: already.map((p) => p.charge_date),
      reused: true,
    });
  }

  const plan = unpackBillingMetadata(metadata);
  const amounts =
    plan.amounts.length > 0 ? plan.amounts : splitSoldeCents(plan.soldeCents, plan.nb);

  if (amounts.length === 0) {
    return NextResponse.json({ error: 'Montants de prélèvement invalides.' }, { status: 400 });
  }

  const paymentIds: string[] = [];
  const chargeDates: string[] = [];

  for (let i = 0; i < amounts.length; i++) {
    const chargeDate = addMonthsIso(plan.startDate, i);
    const amount = amounts[i];
    const pay = await gocardlessFetch<{ payments: { id: string; charge_date: string } }>(
      '/payments',
      {
        method: 'POST',
        body: JSON.stringify({
          payments: {
            amount: String(amount),
            currency: 'EUR',
            charge_date: chargeDate,
            description: `Linova — solde scolarité ${i + 1}/${amounts.length}`,
            retry_if_possible: true,
            // Max 3 metadata keys
            metadata: {
              t: 'solde',
              i: `${i + 1}/${amounts.length}`,
              e: (plan.email || '').slice(0, 200),
            },
            links: { mandate: mandateId },
          },
        }),
      }
    );
    paymentIds.push(pay.payments.id);
    chargeDates.push(pay.payments.charge_date || chargeDate);
  }

  return NextResponse.json({
    mandateId,
    paymentIds,
    amounts,
    chargeDates,
    reused: false,
  });
}
