/**
 * Met à jour le statut d'une candidature + déclenche l'email associé.
 *
 * - statut='accepte' (Inscrit) → email "Confirmation d'inscription" immédiat
 * - statut='refuse' → email "Candidature non retenue" envoyé 24 h après
 *   (relayé par le cron appointment-reminders)
 * - autres statuts → pas d'email
 *
 * Auth : token Supabase utilisateur (cookie/Bearer).
 * Écriture DB : service role (bypass RLS).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendInscriptionConfirmation } from '@/lib/resend-emails';

type CandidatureStatus =
  | 'nouveau'
  | 'en_cours'
  | 'entretien'
  | 'accepte'            // legacy (avant split)
  | 'accepte_alternance' // Inscrit en alternance
  | 'accepte_initial'    // Inscrit en initial
  | 'refuse';

const VALID_STATUSES: CandidatureStatus[] = [
  'nouveau',
  'en_cours',
  'entretien',
  'accepte',
  'accepte_alternance',
  'accepte_initial',
  'refuse',
];

const ACCEPTED_STATUSES: CandidatureStatus[] = ['accepte', 'accepte_alternance', 'accepte_initial'];

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  // Auth via token Bearer (session Supabase)
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

  let body: { candidatureId?: string; newStatus?: CandidatureStatus };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { candidatureId, newStatus } = body;
  if (!candidatureId || !newStatus) {
    return NextResponse.json({ error: 'Missing candidatureId or newStatus' }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(newStatus)) {
    return NextResponse.json({ error: `Invalid status: ${newStatus}` }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: cand, error: fetchError } = await supabase
    .from('candidatures')
    .select('*')
    .eq('id', candidatureId)
    .single();

  if (fetchError || !cand) {
    return NextResponse.json({ error: 'Candidature not found' }, { status: 404 });
  }

  // Update de base
  const updates: Record<string, string | null> = { statut: newStatus };
  const now = new Date().toISOString();
  const in24h = new Date(Date.now() + TWENTY_FOUR_HOURS_MS).toISOString();

  // Programmation de l'email "refuse" à J+24h
  if (newStatus === 'refuse' && !cand.refuse_email_sent_at) {
    updates.refuse_email_send_at = in24h;
  }

  const { error: updateError } = await supabase
    .from('candidatures')
    .update(updates)
    .eq('id', candidatureId);

  if (updateError) {
    console.error('[candidatures/update-status] update error:', updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Envoi immédiat de l'email d'inscription (sur tous les statuts "accepte*")
  if (ACCEPTED_STATUSES.includes(newStatus) && !cand.inscription_email_sent_at) {
    // Détermine le type d'inscription pour adapter le template (bloc alternance ou non).
    // 'accepte' legacy = alternance par défaut (les anciens dossiers le sont).
    const appointmentType: 'alternance' | 'initial' =
      newStatus === 'accepte_initial' ? 'initial' : 'alternance';
    try {
      await sendInscriptionConfirmation({
        firstName: cand.prenom,
        lastName: cand.nom,
        email: cand.email,
        phone: cand.telephone,
        appointmentType,
        date: '',
        timeSlot: '',
        currentStudies: cand.niveau_etudes || undefined,
      });
      await supabase
        .from('candidatures')
        .update({ inscription_email_sent_at: now })
        .eq('id', candidatureId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      console.error('[candidatures/update-status] sendInscriptionConfirmation failed:', message);
      return NextResponse.json({
        success: true,
        status: newStatus,
        emailWarning: `Email d'inscription non envoyé : ${message}`,
      });
    }
  }

  return NextResponse.json({ success: true, status: newStatus });
}
