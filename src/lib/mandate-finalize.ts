/**
 * Finalise un mandat post-inscription sans session admin : l'élève signe seul,
 * GoCardless prévient le webhook (billing_requests / fulfilled).
 *
 * Ne touche qu'aux lignes `pending` sans mandat GoCardless. Laisse la ligne
 * telle quelle, pour reprise par un admin, si :
 *  - la candidature a déjà un mandat actif (changement de RIB : l'ancien mandat
 *    doit être annulé avant, ce que fait la route admin) ;
 *  - une échéance est sous MIN_ECHEANCE_CENTS (solde mal saisi).
 */
import {
  createScheduledPayments,
  fetchMandateDetails,
  metadataToPlan,
  resolveMandateFromBillingRequest,
} from '@/lib/gocardless-mandate';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const MIN_ECHEANCE_CENTS = 5000;

export async function finalizePendingMandate(billingRequestId: string): Promise<void> {
  const admin = getSupabaseAdmin();

  const { data: row } = await admin
    .from('candidature_mandates')
    .select('id, candidature_id, status, gocardless_mandate_id')
    .eq('billing_request_id', billingRequestId)
    .maybeSingle();
  if (!row || row.status !== 'pending' || row.gocardless_mandate_id) return;

  const { data: active } = await admin
    .from('candidature_mandates')
    .select('id')
    .eq('candidature_id', row.candidature_id)
    .eq('status', 'active')
    .limit(1);
  if (active && active.length > 0) {
    console.warn('[mandate-finalize] mandat actif existant, à reprendre par un admin', row.id);
    return;
  }

  const { mandateId, customerId, metadata } =
    await resolveMandateFromBillingRequest(billingRequestId);
  const plan = metadataToPlan(metadata);
  if (plan.amounts.length === 0 || plan.amounts.some((a) => a < MIN_ECHEANCE_CENTS)) {
    console.warn('[mandate-finalize] échéance trop faible, à reprendre par un admin', row.id);
    return;
  }

  const { data: cand } = await admin
    .from('candidatures')
    .select('email')
    .eq('id', row.candidature_id)
    .single();

  const details = await fetchMandateDetails(mandateId).catch(() => ({
    status: 'active',
    ibanLast4: null,
    customerBankAccountId: null,
  }));

  const payments = await createScheduledPayments(mandateId, plan, cand?.email || '', {
    label: 'solde scolarité',
    idempotencyPrefix: billingRequestId,
  });

  const { error } = await admin
    .from('candidature_mandates')
    .update({
      gocardless_mandate_id: mandateId,
      gocardless_customer_id: customerId,
      iban_last4: details.ibanLast4,
      status: 'active',
      nb_prelevements: plan.nb,
      solde_cents: plan.soldeCents,
      start_date: plan.startDate,
      payments,
    })
    .eq('id', row.id);
  if (error) {
    console.error('[mandate-finalize] update error', row.id, error.message);
    throw new Error(error.message);
  }
}
