import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendReminder24hEmail,
  sendReminder24hSms,
  sendReminder2hSms,
} from '@/lib/appointment-reminders';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  appointment_type: string;
  date: string;
  time_slot: string;
  status: string;
  reminder_24h_sent_at: string | null;
  reminder_2h_sent_at: string | null;
}

// Build the Paris datetime for a booking and return hours-until-now.
// All slots are in Europe/Paris TZ.
function hoursUntilAppointment(date: string, timeSlot: string): number {
  // Format: date = 'YYYY-MM-DD', timeSlot = 'HH:MM'
  // Build an ISO string with +01:00 / +02:00 offset based on France DST
  const isoLocal = `${date}T${timeSlot}:00`;
  // Approximate Paris offset (simplification: use current offset)
  const parisDate = new Date(
    new Date(isoLocal).toLocaleString('en-US', { timeZone: 'Europe/Paris' })
  );
  const now = new Date();
  return (parisDate.getTime() - now.getTime()) / (1000 * 60 * 60);
}

export async function GET(request: NextRequest) {
  // Auth: Vercel Cron sends Authorization: Bearer CRON_SECRET
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all confirmed upcoming appointments for the next 48h
  const today = new Date().toISOString().split('T')[0];
  const twoDaysLater = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const { data: appointments, error } = await supabase
    .from('linova_appointments')
    .select('*')
    .eq('status', 'confirmed')
    .gte('date', today)
    .lte('date', twoDaysLater)
    .returns<Appointment[]>();

  if (error) {
    console.error('[cron/appointment-reminders] DB error:', error);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  const results = {
    processed: appointments?.length || 0,
    email24h: 0,
    sms24h: 0,
    sms2h: 0,
    errors: [] as string[],
  };

  for (const appt of appointments || []) {
    const hoursUntil = hoursUntilAppointment(appt.date, appt.time_slot);

    // J-1: window between 23h and 25h before appointment
    if (
      !appt.reminder_24h_sent_at &&
      hoursUntil >= 23 &&
      hoursUntil <= 25
    ) {
      // Send email
      try {
        await sendReminder24hEmail({
          firstName: appt.first_name,
          lastName: appt.last_name,
          email: appt.email,
          appointmentType: appt.appointment_type,
          date: appt.date,
          timeSlot: appt.time_slot,
        });
        results.email24h++;
      } catch (err) {
        results.errors.push(
          `Email 24h ${appt.id}: ${err instanceof Error ? err.message : 'unknown'}`
        );
      }

      // Send SMS
      const smsResult = await sendReminder24hSms({
        firstName: appt.first_name,
        phone: appt.phone,
        date: appt.date,
        timeSlot: appt.time_slot,
      });
      if (smsResult.success) {
        results.sms24h++;
      } else {
        results.errors.push(`SMS 24h ${appt.id}: ${smsResult.error}`);
      }

      // Mark as sent (even if partial — we don't retry to avoid spam)
      await supabase
        .from('linova_appointments')
        .update({ reminder_24h_sent_at: new Date().toISOString() })
        .eq('id', appt.id);
    }

    // J-0: window between 1h30 and 2h30 before appointment
    if (
      !appt.reminder_2h_sent_at &&
      hoursUntil >= 1.5 &&
      hoursUntil <= 2.5
    ) {
      const smsResult = await sendReminder2hSms({
        firstName: appt.first_name,
        phone: appt.phone,
        timeSlot: appt.time_slot,
      });
      if (smsResult.success) {
        results.sms2h++;
      } else {
        results.errors.push(`SMS 2h ${appt.id}: ${smsResult.error}`);
      }

      await supabase
        .from('linova_appointments')
        .update({ reminder_2h_sent_at: new Date().toISOString() })
        .eq('id', appt.id);
    }
  }

  console.log('[cron/appointment-reminders]', results);
  return NextResponse.json(results);
}
