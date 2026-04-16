import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createCalendarEvent } from '@/lib/google-calendar';
import { sendConfirmationToCandidate, sendNotificationToAdmissions } from '@/lib/resend-emails';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TYPE_LABELS: Record<string, string> = {
  initial: 'Formation Initiale',
  alternance: 'Alternance',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      appointmentType,
      date,
      timeSlot,
      firstName,
      lastName,
      email,
      phone,
      currentStudies,
      message,
    } = body;

    // Validate required fields
    if (!appointmentType || !date || !timeSlot || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['initial', 'alternance'].includes(appointmentType)) {
      return NextResponse.json({ error: 'Invalid appointment type' }, { status: 400 });
    }

    // Check if slot is still available (race condition protection)
    const { data: existing } = await supabase
      .from('linova_appointments')
      .select('id')
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .eq('status', 'confirmed')
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Ce créneau vient d\'être réservé. Veuillez en choisir un autre.' },
        { status: 409 }
      );
    }

    // Save to Supabase
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
        current_studies: currentStudies || null,
        message: message || null,
        status: 'confirmed',
      })
      .select()
      .single();

    if (dbError || !appointment) {
      console.error('DB insert error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Create Google Calendar event (non-blocking — don't fail booking if this fails)
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
        ]
          .filter(Boolean)
          .join('\n'),
        date,
        timeSlot,
        durationMinutes: 45,
        attendeeEmail: email,
        attendeeName: `${firstName} ${lastName}`,
      });

      // Update record with Google event ID
      await supabase
        .from('linova_appointments')
        .update({ google_event_id: googleEventId })
        .eq('id', appointment.id);
    } catch (calendarError) {
      console.error('Google Calendar error (non-blocking):', calendarError);
    }

    // Send emails (non-blocking)
    const emailParams = {
      firstName,
      lastName,
      email,
      phone,
      appointmentType,
      date,
      timeSlot,
      currentStudies,
      message,
    };

    try {
      await Promise.all([
        sendConfirmationToCandidate(emailParams),
        sendNotificationToAdmissions(emailParams),
      ]);
    } catch (emailError) {
      console.error('Email error (non-blocking):', emailError);
    }

    return NextResponse.json({
      success: true,
      appointmentId: appointment.id,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
