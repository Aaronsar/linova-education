import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// All possible time slots (Mon-Fri, 9h-12h and 14h-17h, every 30 min)
// Last slot starts at 16:30 to allow 30-min appointments ending at 17:00
export const ALL_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

// Holidays where the school is closed (YYYY-MM-DD)
const CLOSED_DATES = [
  '2026-05-01', '2026-05-08', '2026-05-21', '2026-06-01',
  '2026-07-14', '2026-08-15', '2026-11-01', '2026-11-11',
  '2026-12-25', '2026-01-01', '2026-04-01',
  // Summer closure
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }

  // Check if it's a weekend
  const d = new Date(date + 'T12:00:00');
  const dayOfWeek = d.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return NextResponse.json({ slots: [] });
  }

  // Check if it's a closed date
  if (CLOSED_DATES.includes(date)) {
    return NextResponse.json({ slots: [] });
  }

  // Check if it's in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) {
    return NextResponse.json({ slots: [] });
  }

  // Get already booked slots for this date
  const { data: booked, error } = await supabase
    .from('linova_appointments')
    .select('time_slot')
    .eq('date', date)
    .eq('status', 'confirmed');

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  const bookedSlots = new Set((booked || []).map((b) => b.time_slot));

  // If today, filter out past slots
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  const availableSlots = ALL_SLOTS.filter((slot) => {
    if (bookedSlots.has(slot)) return false;
    if (isToday) {
      const [h, m] = slot.split(':').map(Number);
      const slotMinutes = h * 60 + m;
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      // Require at least 30 min buffer
      if (slotMinutes <= nowMinutes + 30) return false;
    }
    return true;
  });

  return NextResponse.json({ slots: availableSlots });
}
