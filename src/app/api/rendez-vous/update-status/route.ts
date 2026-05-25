/**
 * Met à jour le statut d'un rendez-vous + déclenche les emails associés.
 *
 * Workflow post-entretien :
 * - confirmed / cancelled / completed → pas d'email
 * - dossier_accepte → email "Dossier d'admission" envoyé 24h après (cron)
 * - dossier_refuse → email "Candidature non retenue" envoyé 24h après (cron)
 * - inscrit → email "Confirmation d'inscription" envoyé immédiatement
 *
 * Auth : token Supabase utilisateur (cookie).
 * Écriture DB : service role (bypass RLS).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendInscriptionConfirmation } from '@/lib/resend-emails';
import { notifyCrmStatusChanged } from '@/lib/crm-webhook';

type AppointmentStatus =
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'dossier_accepte'
  | 'dossier_refuse'
  | 'inscrit';

const VALID_STATUSES: AppointmentStatus[] = [
  'confirmed',
  'cancelled',
  'completed',
  'dossier_accepte',
  'dossier_refuse',
  'inscrit',
];

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  // Vérifie l'authentification utilisateur via token Supabase
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.replace(/^Bearer\s+/i, '');
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
  const { data: userData, error: userErr } = await anonClient.auth.getUser(accessToken);
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse body
  let body: { appointmentId?: string; newStatus?: AppointmentStatus };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { appointmentId, newStatus } = body;
  if (!appointmentId || !newStatus) {
    return NextResponse.json({ error: 'Missing appointmentId or newStatus' }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(newStatus)) {
    return NextResponse.json({ error: `Invalid status: ${newStatus}` }, { status: 400 });
  }

  // Service role pour bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Charger l'appointment
  const { data: appt, error: fetchError } = await supabase
    .from('linova_appointments')
    .select('*')
    .eq('id', appointmentId)
    .single();

  if (fetchError || !appt) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  // Mise à jour de base
  const updates: Record<string, string | null> = { status: newStatus };
  const now = new Date().toISOString();
  const in24h = new Date(Date.now() + TWENTY_FOUR_HOURS_MS).toISOString();

  // Programmation des emails différés
  if (newStatus === 'dossier_accepte') {
    if (!appt.dossier_admission_email_sent_at) {
      updates.dossier_admission_email_send_at = in24h;
    }
  } else if (newStatus === 'dossier_refuse') {
    if (!appt.dossier_refuse_email_sent_at) {
      updates.dossier_refuse_email_send_at = in24h;
    }
  }

  const { error: updateError } = await supabase
    .from('linova_appointments')
    .update(updates)
    .eq('id', appointmentId);

  if (updateError) {
    console.error('[update-status] Update error:', updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Envoi immédiat pour "inscrit" (les autres sont différés via cron)
  if (newStatus === 'inscrit' && !appt.inscription_email_sent_at) {
    try {
      await sendInscriptionConfirmation({
        firstName: appt.first_name,
        lastName: appt.last_name,
        email: appt.email,
        phone: appt.phone,
        appointmentType: appt.appointment_type,
        date: appt.date,
        timeSlot: appt.time_slot,
        currentStudies: appt.current_studies || undefined,
        message: appt.message || undefined,
      });
      await supabase
        .from('linova_appointments')
        .update({ inscription_email_sent_at: now })
        .eq('id', appointmentId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      console.error('[update-status] sendInscriptionConfirmation failed:', message);
      // Statut déjà mis à jour — on retourne quand même 200 mais on signale
      return NextResponse.json({
        success: true,
        status: newStatus,
        emailWarning: `Email d'inscription non envoyé : ${message}`,
      });
    }
  }

  // Webhook sortant vers le CRM (non bloquant, ne fait rien si pas d'external_id)
  await notifyCrmStatusChanged({
    appointmentId,
    externalId: appt.external_id || null,
    previousStatus: (appt.status as AppointmentStatus) || null,
    newStatus,
  });

  return NextResponse.json({ success: true, status: newStatus });
}
