/**
 * Création de RDV d'admission depuis un CRM externe.
 *
 * Auth : header Authorization: Bearer <LINOVA_EXTERNAL_API_KEY>
 * Comparaison timing-safe pour éviter les attaques temporelles.
 *
 * Flow identique à /api/rendez-vous/book (form public) :
 *   1. Validation des champs
 *   2. Vérification créneau disponible (anti-conflit)
 *   3. INSERT dans linova_appointments avec external_id + source
 *   4. Création event Google Agenda admissions@ (non bloquant)
 *   5. Envoi email confirmation candidat + notif admissions@ (non bloquant)
 *
 * Le CRM stocke l'appointmentId retourné pour pouvoir relier les futurs
 * webhooks de changement de statut.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'crypto';
import { createCalendarEvent } from '@/lib/google-calendar';
import { sendConfirmationToCandidate, sendNotificationToAdmissions } from '@/lib/resend-emails';

const TYPE_LABELS: Record<string, string> = {
  initial: 'Formation Initiale',
  alternance: 'Alternance',
};

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isValidDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isValidTime = (s: string) => /^\d{2}:\d{2}$/.test(s);

interface ExternalBookingBody {
  appointmentType?: string;
  date?: string;
  timeSlot?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  currentStudies?: string;
  message?: string;
  source?: string;
  externalId?: string;
}

function bearerTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/** Comparaison timing-safe (évite les attaques par mesure de temps). */
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  // 1. Auth API Key
  const expectedKey = process.env.LINOVA_EXTERNAL_API_KEY;
  if (!expectedKey) {
    console.error('[external/appointments] LINOVA_EXTERNAL_API_KEY manquant côté serveur');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  const providedKey = bearerTokenFromHeader(request.headers.get('authorization'));
  if (!providedKey || !safeCompare(providedKey, expectedKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse body
  let body: ExternalBookingBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const appointmentType = (body.appointmentType || '').toLowerCase();
  const date = (body.date || '').trim();
  const timeSlot = (body.timeSlot || '').trim();
  const firstName = (body.firstName || '').trim();
  const lastName = (body.lastName || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const currentStudies = (body.currentStudies || '').trim() || null;
  const message = (body.message || '').trim() || null;
  const source = (body.source || '').trim() || 'crm-external';
  const externalId = (body.externalId || '').trim() || null;

  // 3. Validation
  if (!appointmentType || !date || !timeSlot || !firstName || !lastName || !email || !phone) {
    return NextResponse.json(
      { error: 'Missing required fields (appointmentType, date, timeSlot, firstName, lastName, email, phone)' },
      { status: 400 }
    );
  }
  if (!['initial', 'alternance'].includes(appointmentType)) {
    return NextResponse.json(
      { error: 'Invalid appointmentType (must be "initial" or "alternance")' },
      { status: 400 }
    );
  }
  if (!isValidDate(date)) {
    return NextResponse.json({ error: 'Invalid date format (must be YYYY-MM-DD)' }, { status: 400 });
  }
  if (!isValidTime(timeSlot)) {
    return NextResponse.json({ error: 'Invalid timeSlot format (must be HH:MM)' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 4. Vérification créneau disponible
  const { data: existing } = await supabase
    .from('linova_appointments')
    .select('id')
    .eq('date', date)
    .eq('time_slot', timeSlot)
    .eq('status', 'confirmed')
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: 'Slot already booked', date, timeSlot },
      { status: 409 }
    );
  }

  // 5. INSERT
  const { data: appointment, error: dbError } = await supabase
    .from('linova_appointments')
    .insert({
      appointment_type: appointmentType,
      date,
      time_slot: timeSlot,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      current_studies: currentStudies,
      message,
      status: 'confirmed',
      source,
      external_id: externalId,
    })
    .select('id, date, time_slot')
    .single();

  if (dbError || !appointment) {
    console.error('[external/appointments] DB insert error:', dbError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // 6. Google Calendar (non bloquant)
  let googleEventId: string | null = null;
  try {
    const typeLabel = TYPE_LABELS[appointmentType] || appointmentType;
    googleEventId = await createCalendarEvent({
      summary: `Entretien d'admission — ${firstName} ${lastName} (${typeLabel})`,
      description: [
        `Candidat : ${firstName} ${lastName}`,
        `Email : ${email}`,
        `Téléphone : ${phone}`,
        currentStudies ? `Études actuelles : ${currentStudies}` : '',
        message ? `\nMessage : ${message}` : '',
        '',
        `BTS Biologie Médicale — ${typeLabel}`,
        externalId ? `\n[Source : ${source} · external_id : ${externalId}]` : `\n[Source : ${source}]`,
      ]
        .filter(Boolean)
        .join('\n'),
      date,
      timeSlot,
      durationMinutes: 45,
      attendeeEmail: email,
      attendeeName: `${firstName} ${lastName}`,
    });

    if (googleEventId) {
      await supabase
        .from('linova_appointments')
        .update({ google_event_id: googleEventId })
        .eq('id', appointment.id);
    }
  } catch (calendarError) {
    console.error('[external/appointments] Google Calendar error (non-blocking):', calendarError);
  }

  // 7. Emails (non bloquant)
  try {
    const emailParams = {
      firstName,
      lastName,
      email,
      phone,
      appointmentType,
      date,
      timeSlot,
      currentStudies: currentStudies || undefined,
      message: message || undefined,
    };
    await Promise.all([
      sendConfirmationToCandidate(emailParams),
      sendNotificationToAdmissions(emailParams),
    ]);
  } catch (emailError) {
    console.error('[external/appointments] Email error (non-blocking):', emailError);
  }

  // 8. Construction scheduledAt ISO (date + time + Paris TZ — UTC approximation +2h CEST)
  const scheduledAtIso = `${date}T${timeSlot}:00+02:00`;

  return NextResponse.json(
    {
      success: true,
      appointmentId: appointment.id,
      googleEventId,
      scheduledAt: scheduledAtIso,
    },
    { status: 201 }
  );
}
