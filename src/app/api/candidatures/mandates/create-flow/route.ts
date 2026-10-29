/**
 * Admin : lance un flow GoCardless pour mettre en place le prélèvement SEPA
 * du solde (scénario A : acompte espèces → prélèvement) ou pour changer de RIB
 * (scénario B : passer `previousMandateId`).
 */
import { NextRequest, NextResponse } from 'next/server';
import { createMandateFlow, clampNb } from '@/lib/gocardless-mandate';
import { isGoCardlessConfigured } from '@/lib/gocardless';
import { getSupabaseAdmin, requireAuthUser } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  if (!isGoCardlessConfigured()) {
    return NextResponse.json(
      { error: 'GoCardless n’est pas configuré.' },
      { status: 503 }
    );
  }

  const user = await requireAuthUser(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const candidatureId = typeof body.candidatureId === 'string' ? body.candidatureId : '';
  const nb = clampNb(Number(body.nb_prelevements) || 1);
  const soldeCents = Math.max(0, Math.round(Number(body.solde_cents) || 0));
  const startDate = typeof body.start_date === 'string' ? body.start_date : undefined;
  const previousMandateId =
    typeof body.previousMandateId === 'string' && body.previousMandateId
      ? body.previousMandateId
      : undefined;

  if (!candidatureId) {
    return NextResponse.json({ error: 'candidatureId manquant.' }, { status: 400 });
  }
  if (soldeCents < 100) {
    return NextResponse.json({ error: 'Montant du solde invalide.' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: cand, error: candErr } = await admin
    .from('candidatures')
    .select('id, prenom, nom, email')
    .eq('id', candidatureId)
    .single();
  if (candErr || !cand) {
    return NextResponse.json({ error: 'Candidature introuvable.' }, { status: 404 });
  }
  if (!cand.email || !cand.prenom || !cand.nom) {
    return NextResponse.json({ error: 'Identité candidat incomplète.' }, { status: 400 });
  }

  let previousGcMandateId: string | undefined;
  if (previousMandateId) {
    const { data: prev } = await admin
      .from('candidature_mandates')
      .select('gocardless_mandate_id, candidature_id')
      .eq('id', previousMandateId)
      .maybeSingle();
    if (!prev || prev.candidature_id !== candidatureId) {
      return NextResponse.json(
        { error: 'Mandat précédent introuvable pour cette candidature.' },
        { status: 400 }
      );
    }
    previousGcMandateId = prev.gocardless_mandate_id || undefined;
  }

  try {
    const result = await createMandateFlow({
      email: cand.email.trim().toLowerCase(),
      prenom: cand.prenom.trim(),
      nom: cand.nom.trim(),
      nb,
      soldeCents,
      startDate,
      basePath: `/espace-candidature/${candidatureId}`,
      previousMandateId: previousGcMandateId,
      description: previousMandateId
        ? `Linova — changement de RIB (${nb} prélèvement${nb > 1 ? 's' : ''})`
        : undefined,
    });

    const { data: inserted, error: insErr } = await admin
      .from('candidature_mandates')
      .insert({
        candidature_id: candidatureId,
        billing_request_id: result.billingRequestId,
        status: 'pending',
        nb_prelevements: result.plan.nb,
        solde_cents: result.plan.soldeCents,
        start_date: result.plan.startDate,
      })
      .select('id')
      .single();

    if (insErr) {
      console.error('[mandates/create-flow] insert error', insErr.message);
    }

    return NextResponse.json({
      mandateRowId: inserted?.id || null,
      billingRequestId: result.billingRequestId,
      authorisationUrl: result.authorisationUrl,
      plan: result.plan,
      previousMandateId: previousMandateId || null,
    });
  } catch (err) {
    console.error('[mandates/create-flow]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur GoCardless' },
      { status: 500 }
    );
  }
}
