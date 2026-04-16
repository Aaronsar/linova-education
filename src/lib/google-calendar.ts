import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!email || !key || !calendarId) {
    throw new Error('Missing Google Calendar environment variables');
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: SCOPES,
  });

  return { auth, calendarId };
}

export interface CreateEventParams {
  summary: string;
  description: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  durationMinutes: number;
  attendeeEmail: string;
  attendeeName: string;
}

export async function createCalendarEvent(params: CreateEventParams): Promise<string> {
  const { auth, calendarId } = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const startDate = new Date(`${params.date}T${params.timeSlot}:00`);
  const endDate = new Date(startDate.getTime() + params.durationMinutes * 60 * 1000);

  const formatDateTime = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  };

  const event = {
    summary: params.summary,
    description: params.description,
    start: {
      dateTime: formatDateTime(startDate),
      timeZone: 'Europe/Paris',
    },
    end: {
      dateTime: formatDateTime(endDate),
      timeZone: 'Europe/Paris',
    },
    attendees: [
      { email: calendarId, displayName: 'Linova Admissions' },
      { email: params.attendeeEmail, displayName: params.attendeeName },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
    conferenceData: undefined,
  };

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event,
    sendUpdates: 'all',
  });

  return response.data.id || '';
}

export async function cancelCalendarEvent(eventId: string): Promise<void> {
  const { auth, calendarId } = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  await calendar.events.delete({
    calendarId,
    eventId,
    sendUpdates: 'all',
  });
}
