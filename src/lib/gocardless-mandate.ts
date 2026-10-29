/**
 * Partage la logique de mandat SEPA GoCardless entre :
 *  - l'inscription initiale (/inscription-initial, /inscription-initial-2a)
 *  - les flux post-inscription côté admin (acompte espèces → prélèvement, changement de RIB)
 */

import {
  ECHEANCES_PRELEVEMENT_MAX,
  addMonthsIso,
  computeFirstPrelevementDate,
  gocardlessFetch,
  packBillingMetadata,
  splitSoldeCents,
  unpackBillingMetadata,
} from './gocardless';

export type MandatePlan = {
  nb: number;
  soldeCents: number;
  amounts: number[];
  startDate: string;
};

export type CreateMandateFlowOpts = {
  email: string;
  prenom: string;
  nom: string;
  nb: number;
  soldeCents: number;
  startDate?: string;
  basePath: string; // Chemin de retour (ex. /espace-candidature/<id>)
  description?: string;
  previousMandateId?: string; // Pour un changement de RIB
};

export type CreateMandateFlowResult = {
  billingRequestId: string;
  authorisationUrl: string;
  plan: MandatePlan;
};

export function clampNb(nb: number): number {
  return Math.min(ECHEANCES_PRELEVEMENT_MAX, Math.max(1, Math.floor(nb) || 1));
}

export function buildMandatePlan(
  soldeCents: number,
  nb: number,
  startDate?: string
): MandatePlan {
  const safeNb = clampNb(nb);
  const safeSolde = Math.max(0, Math.round(soldeCents));
  const start = startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)
    ? startDate
    : computeFirstPrelevementDate();
  const amounts = splitSoldeCents(safeSolde, safeNb);
  return { nb: safeNb, soldeCents: safeSolde, amounts, startDate: start };
}

export async function createMandateFlow(
  opts: CreateMandateFlowOpts
): Promise<CreateMandateFlowResult> {
  const plan = buildMandatePlan(opts.soldeCents, opts.nb, opts.startDate);

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://linova-education.fr');

  const basePath = opts.basePath.startsWith('/') ? opts.basePath : `/${opts.basePath}`;
  const returnQs = new URLSearchParams({ gocardless: 'ok' });
  const exitQs = new URLSearchParams({ gocardless: 'exit' });
  if (opts.previousMandateId) {
    returnQs.set('replace_prev', opts.previousMandateId);
    exitQs.set('replace_prev', opts.previousMandateId);
  }
  const redirectUri = `${origin}${basePath}?${returnQs.toString()}`;
  const exitUri = `${origin}${basePath}?${exitQs.toString()}`;

  const metadata = packBillingMetadata({
    email: opts.email,
    prenom: opts.prenom,
    nom: opts.nom,
    nb: plan.nb,
    soldeCents: plan.soldeCents,
    amounts: plan.amounts,
    startDate: plan.startDate,
    basePath,
  });

  const description =
    opts.description ||
    `Linova — solde scolarité (${plan.nb} prélèvement${plan.nb > 1 ? 's' : ''}, 1er ${plan.startDate})`;

  const brRes = await gocardlessFetch<{ billing_requests: { id: string } }>(
    '/billing_requests',
    {
      method: 'POST',
      body: JSON.stringify({
        billing_requests: {
          mandate_request: {
            currency: 'EUR',
            scheme: 'sepa_core',
            description,
          },
          metadata,
        },
      }),
    }
  );
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
          given_name: opts.prenom,
          family_name: opts.nom,
          email: opts.email,
        },
        links: { billing_request: billingRequestId },
      },
    }),
  });

  return {
    billingRequestId,
    authorisationUrl: flowRes.billing_request_flows.authorisation_url,
    plan,
  };
}

type BillingRequest = {
  id: string;
  status: string;
  metadata?: Record<string, string>;
  links?: {
    mandate_request?: string;
    mandate?: string;
    customer?: string;
    mandate_request_mandate?: string;
  };
  mandate_request?: { links?: { mandate?: string } };
};

export async function resolveMandateFromBillingRequest(billingRequestId: string): Promise<{
  mandateId: string;
  customerId: string | null;
  metadata: Record<string, string>;
}> {
  const brRes = await gocardlessFetch<{ billing_requests: BillingRequest }>(
    `/billing_requests/${billingRequestId}`
  );
  const br = brRes.billing_requests;
  if (br.status !== 'fulfilled') {
    const err = new Error(`Mandat non finalisé (statut : ${br.status}).`);
    (err as Error & { code?: string }).code = 'MANDATE_NOT_FULFILLED';
    throw err;
  }

  let mandateId =
    br.links?.mandate ||
    br.links?.mandate_request_mandate ||
    br.mandate_request?.links?.mandate ||
    '';

  if (!mandateId && br.links?.mandate_request) {
    const mr = await gocardlessFetch<{
      mandate_requests: { links?: { mandate?: string } };
    }>(`/mandate_requests/${br.links.mandate_request}`);
    mandateId = mr.mandate_requests.links?.mandate || '';
  }

  if (!mandateId && br.links?.customer) {
    const list = await gocardlessFetch<{
      mandates: { id: string; created_at: string }[];
    }>(`/mandates?customer=${encodeURIComponent(br.links.customer)}&limit=5`);
    const latest = [...(list.mandates || [])].sort((a, b) =>
      a.created_at < b.created_at ? 1 : -1
    )[0];
    mandateId = latest?.id || '';
  }

  if (!mandateId) {
    throw new Error('Mandat introuvable après signature.');
  }

  return {
    mandateId,
    customerId: br.links?.customer || null,
    metadata: br.metadata || {},
  };
}

export async function fetchMandateDetails(mandateId: string): Promise<{
  status: string;
  ibanLast4: string | null;
  customerBankAccountId: string | null;
}> {
  const res = await gocardlessFetch<{
    mandates: {
      status: string;
      links?: { customer_bank_account?: string };
    };
  }>(`/mandates/${mandateId}`);
  const m = res.mandates;
  const cbaId = m.links?.customer_bank_account || null;
  let ibanLast4: string | null = null;
  if (cbaId) {
    try {
      const cba = await gocardlessFetch<{
        customer_bank_accounts: { account_number_ending?: string };
      }>(`/customer_bank_accounts/${cbaId}`);
      ibanLast4 = cba.customer_bank_accounts.account_number_ending || null;
    } catch {
      // non bloquant
    }
  }
  return {
    status: m.status,
    ibanLast4,
    customerBankAccountId: cbaId,
  };
}

export type ScheduledPayment = {
  id: string;
  amount: number;
  charge_date: string;
  status: string;
};

export async function createScheduledPayments(
  mandateId: string,
  plan: MandatePlan,
  email: string,
  opts: { startIndex?: number; totalCount?: number; label?: string } = {}
): Promise<ScheduledPayment[]> {
  const amounts = plan.amounts.length > 0 ? plan.amounts : splitSoldeCents(plan.soldeCents, plan.nb);
  const startIndex = opts.startIndex ?? 0;
  const totalCount = opts.totalCount ?? amounts.length;
  const label = opts.label || 'solde scolarité';

  const results: ScheduledPayment[] = [];
  for (let i = startIndex; i < amounts.length; i++) {
    const chargeDate = addMonthsIso(plan.startDate, i);
    const amount = amounts[i];
    const pay = await gocardlessFetch<{
      payments: { id: string; charge_date: string; status: string };
    }>('/payments', {
      method: 'POST',
      body: JSON.stringify({
        payments: {
          amount: String(amount),
          currency: 'EUR',
          charge_date: chargeDate,
          description: `Linova — ${label} ${i + 1}/${totalCount}`,
          retry_if_possible: true,
          metadata: {
            t: 'solde',
            i: `${i + 1}/${totalCount}`,
            e: (email || '').slice(0, 200),
          },
          links: { mandate: mandateId },
        },
      }),
    });
    results.push({
      id: pay.payments.id,
      amount,
      charge_date: pay.payments.charge_date || chargeDate,
      status: pay.payments.status || 'pending_submission',
    });
  }
  return results;
}

export async function cancelMandate(mandateId: string): Promise<void> {
  await gocardlessFetch(`/mandates/${mandateId}/actions/cancel`, { method: 'POST' });
}

export async function cancelPendingPayments(mandateId: string): Promise<{ cancelled: string[] }> {
  const res = await gocardlessFetch<{
    payments: { id: string; status: string; charge_date: string }[];
  }>(`/payments?mandate=${encodeURIComponent(mandateId)}&limit=100`);
  const cancellable = (res.payments || []).filter((p) =>
    ['pending_customer_approval', 'pending_submission'].includes(p.status)
  );
  const cancelled: string[] = [];
  for (const p of cancellable) {
    try {
      await gocardlessFetch(`/payments/${p.id}/actions/cancel`, { method: 'POST' });
      cancelled.push(p.id);
    } catch (err) {
      console.warn('[gocardless-mandate] cancel payment', p.id, err);
    }
  }
  return { cancelled };
}

export function metadataToPlan(metadata: Record<string, string>): MandatePlan {
  const u = unpackBillingMetadata(metadata);
  return {
    nb: u.nb,
    soldeCents: u.soldeCents,
    amounts: u.amounts.length > 0 ? u.amounts : splitSoldeCents(u.soldeCents, u.nb),
    startDate: u.startDate,
  };
}
