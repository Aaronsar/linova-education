/**
 * Admin : au retour du flow GoCardless, finalise le mandat :
 *   - résout l'ID GoCardless du mandat
 *   - crée les prélèvements planifiés
 *   - persiste tout en DB
 *   - si c'est un changement de RIB (previousMandateId) : annule l'ancien mandat GC
 *     + ses paiements en attente, puis marque la ligne précédente `replaced`.
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  cancelMandate,
  cancelPendingPayments,
  createScheduledPayments,
  fetchMandateDetails,
  metadataToPlan,
  resolveMandateFromBillingRequest,
} from '@/lib/gocardless-mandate';
import { isGoCardlessConfigured } from '@/lib/gocardless';
import { getSupabaseAdmin, requireAuthUser } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  if (!isGoCardlessConfigured()) {
    return NextResponse.json({ error: 'GoCardless non configuré.' }, { status: 503 });
  }

  const user = await requireAuthUser(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const billingRequestId =
    typeof body.billingRequestId === 'string' ? body.billingRequestId.trim() : '';
  const candidatureId =
    typeof body.candidatureId === 'string' ? body.candidatureId.trim() : '';
  const previousMandateRowId =
    typeof body.previousMandateId === 'string' && body.previousMandateId
      ? body.previousMandateId
      : null;

  if (!billingRequestId.startsWith('BRQ')) {
    return NextResponse.json({ error: 'billingRequestId manquant.' }, { status: 400 });
  }
  if (!candidatureId) {
    return NextResponse.json({ error: 'candidatureId manquant.' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  const { data: cand } = await admin
    .from('candidatures')
    .select('id, email')
    .eq('id', candidatureId)
    .single();
  if (!cand) {
    return NextResponse.json({ error: 'Candidature introuvable.' }, { status: 404 });
  }

  const { data: existingRow } = await admin
    .from('candidature_mandates')
    .select('id, status, gocardless_mandate_id, payments')
    .eq('billing_request_id', billingRequestId)
    .eq('candidature_id', candidatureId)
    .maybeSingle();

  if (existingRow?.status === 'active' && existingRow.gocardless_mandate_id) {
    return NextResponse.json({
      reused: true,
      mandateRowId: existingRow.id,
      mandateId: existingRow.gocardless_mandate_id,
      payments: existingRow.payments || [],
    });
  }

  try {
    const { mandateId, customerId, metadata } =
      await resolveMandateFromBillingRequest(billingRequestId);
    const plan = metadataToPlan(metadata);
    const details = await fetchMandateDetails(mandateId).catch(() => ({
      status: 'active',
      ibanLast4: null,
      customerBankAccountId: null,
    }));

    const payments = await createScheduledPayments(
      mandateId,
      plan,
      cand.email || '',
      { label: previousMandateRowId ? 'solde scolarité (nouveau RIB)' : 'solde scolarité' }
    );

    const rowPayload = {
      candidature_id: candidatureId,
      gocardless_mandate_id: mandateId,
      gocardless_customer_id: customerId,
      billing_request_id: billingRequestId,
      iban_last4: details.ibanLast4,
      status: 'active' as const,
      nb_prelevements: plan.nb,
      solde_cents: plan.soldeCents,
      start_date: plan.startDate,
      payments,
    };

    let mandateRowId = existingRow?.id;
    if (existingRow) {
      const { error: upErr } = await admin
        .from('candidature_mandates')
        .update(rowPayload)
        .eq('id', existingRow.id);
      if (upErr) {
        console.error('[mandates/finalize] update error', upErr.message);
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }
    } else {
      const { data: inserted, error: insErr } = await admin
        .from('candidature_mandates')
        .insert(rowPayload)
        .select('id')
        .single();
      if (insErr) {
        console.error('[mandates/finalize] insert error', insErr.message);
        return NextResponse.json({ error: insErr.message }, { status: 500 });
      }
      mandateRowId = inserted!.id;
    }

    if (previousMandateRowId && mandateRowId) {
      const { data: prev } = await admin
        .from('candidature_mandates')
        .select('id, gocardless_mandate_id, status')
        .eq('id', previousMandateRowId)
        .eq('candidature_id', candidatureId)
        .maybeSingle();
      if (prev && prev.gocardless_mandate_id && prev.status !== 'replaced') {
        try {
          await cancelPendingPayments(prev.gocardless_mandate_id);
        } catch (e) {
          console.warn('[mandates/finalize] cancel pending payments', e);
        }
        try {
          await cancelMandate(prev.gocardless_mandate_id);
        } catch (e) {
          console.warn('[mandates/finalize] cancel old mandate', e);
        }
        await admin
          .from('candidature_mandates')
          .update({
            status: 'replaced',
            replaced_by_mandate_id: mandateRowId,
            cancelled_at: new Date().toISOString(),
          })
          .eq('id', prev.id);
      }
    }

    return NextResponse.json({
      reused: false,
      mandateRowId,
      mandateId,
      ibanLast4: details.ibanLast4,
      payments,
    });
  } catch (err) {
    const code = (err as Error & { code?: string }).code;
    console.error('[mandates/finalize]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur finalisation', code },
      { status: code === 'MANDATE_NOT_FULFILLED' ? 400 : 500 }
    );
  }
}
