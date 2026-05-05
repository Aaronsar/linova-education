/**
 * Soumission du QCM d'admission BTS Biologie Médicale.
 *
 * - Reçoit { firstName, lastName, email, phone, answers }
 * - Calcule le score CÔTÉ SERVEUR (les bonnes réponses ne sortent jamais
 *   du serveur)
 * - Tente de relier au rendez-vous existant via le téléphone normalisé
 * - Sauvegarde tout dans `linova_admission_tests`
 * - Renvoie au client uniquement { success: true, submissionId }
 *   → JAMAIS le score
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { scoreSubmission, type AnswerLetter } from '@/lib/admission-qcm-answers';

interface SubmitBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  answers?: { id: string; selected: AnswerLetter[] }[];
  startedAt?: string;       // ISO date — début du QCM côté client
  timeExpired?: boolean;    // true si auto-submit après 40 min
}

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** Garde uniquement les chiffres, retire le préfixe pays "33" français pour matcher "06..." vs "+33 6..." */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D+/g, '');
  if (digits.startsWith('33') && digits.length >= 11) return '0' + digits.slice(2);
  if (digits.startsWith('0033') && digits.length >= 13) return '0' + digits.slice(4);
  return digits;
}

export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const firstName = (body.firstName || '').trim();
  const lastName = (body.lastName || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const answers = Array.isArray(body.answers) ? body.answers : [];

  if (!firstName || !lastName || !email || !phone) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
  }
  if (!answers.length) {
    return NextResponse.json({ error: 'Réponses manquantes' }, { status: 400 });
  }

  // Sanitize answers : on ne garde que A/B/C/D
  const sanitizedAnswers = answers.map((a) => ({
    id: String(a.id || ''),
    selected: (Array.isArray(a.selected) ? a.selected : [])
      .filter((v): v is AnswerLetter => ['A', 'B', 'C', 'D'].includes(v as string)),
  }));

  // Calcul du score (server-side)
  const { score, maxScore, perQuestion } = scoreSubmission(sanitizedAnswers);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Recherche d'un rendez-vous existant via le téléphone normalisé
  const phoneNormalized = normalizePhone(phone);
  let linkedAppointmentId: string | null = null;
  if (phoneNormalized) {
    const { data: appointments } = await supabase
      .from('linova_appointments')
      .select('id, phone, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    const match = (appointments || []).find(
      (a) => normalizePhone(a.phone || '') === phoneNormalized
    );
    if (match) linkedAppointmentId = match.id;
  }

  const startedAt = body.startedAt && !Number.isNaN(Date.parse(body.startedAt))
    ? new Date(body.startedAt).toISOString()
    : null;

  const { data: inserted, error: insertError } = await supabase
    .from('linova_admission_tests')
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      phone_normalized: phoneNormalized,
      answers: sanitizedAnswers,
      score,
      max_score: maxScore,
      per_question: perQuestion,
      linked_appointment_id: linkedAppointmentId,
      started_at: startedAt,
      time_expired: !!body.timeExpired,
      user_agent: req.headers.get('user-agent') || null,
    })
    .select('id')
    .single();

  if (insertError || !inserted) {
    console.error('[test-admission/submit] insert error:', insertError?.message);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }

  // ⚠️ On ne renvoie JAMAIS le score au client
  return NextResponse.json({ success: true, submissionId: inserted.id });
}
