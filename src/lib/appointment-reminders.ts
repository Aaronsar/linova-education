import { sendSms } from './sms-factor';

// Email sending via Brevo — same pattern as resend-emails.ts
const FROM_NAME = 'Linova Éducation';
const FROM_EMAIL = 'admissions@linova-education.fr';

const TYPE_LABELS: Record<string, string> = {
  initial: 'Formation Initiale',
  alternance: 'Alternance',
};

function formatDate(date: string): string {
  const d = new Date(date + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatShortDate(date: string): string {
  const d = new Date(date + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  });
}

async function sendBrevoEmail(payload: {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('Missing BREVO_API_KEY');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [payload.to],
      subject: payload.subject,
      htmlContent: payload.htmlContent,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error ${res.status}: ${text}`);
  }
}

// ─── J-1 EMAIL ───────────────────────────────────────────────────────────────

export async function sendReminder24hEmail(params: {
  firstName: string;
  lastName: string;
  email: string;
  appointmentType: string;
  date: string;
  timeSlot: string;
}) {
  const typeLabel = TYPE_LABELS[params.appointmentType] || params.appointmentType;
  const formattedDate = formatDate(params.date);

  await sendBrevoEmail({
    to: { email: params.email, name: `${params.firstName} ${params.lastName}` },
    subject: `Rappel : votre RDV d'admission demain à ${params.timeSlot} — Linova`,
    htmlContent: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F9F9F9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#182D3C;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Linova Éducation</h1>
              <p style="margin:4px 0 0;color:#6DA3A4;font-size:13px;">Rappel de rendez-vous</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 12px;color:#182D3C;font-size:22px;font-weight:700;">C'est demain ${params.firstName} !</h2>
              <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                Un petit rappel pour votre entretien d'admission prévu <strong>${formattedDate}</strong> à <strong>${params.timeSlot}</strong>.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;border-radius:12px;padding:20px;margin-bottom:20px;">
                <tr>
                  <td style="padding-bottom:12px;border-bottom:1px solid #EFEFEF;">
                    <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Entretien</p>
                    <p style="margin:0;color:#182D3C;font-size:15px;font-weight:600;">BTS Biologie Médicale — ${typeLabel}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #EFEFEF;">
                    <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Quand</p>
                    <p style="margin:0;color:#182D3C;font-size:15px;font-weight:600;">${formattedDate} à ${params.timeSlot}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:12px;">
                    <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Où</p>
                    <p style="margin:0 0 6px;color:#182D3C;font-size:15px;font-weight:600;">85 Avenue Ledru-Rollin, 75012 Paris</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=85+Avenue+Ledru-Rollin+75012+Paris" style="display:inline-block;color:#6DA3A4;font-size:13px;text-decoration:none;">📍 Ouvrir dans Google Maps</a>
                  </td>
                </tr>
              </table>

              <div style="background-color:#EEE4D8;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                <p style="margin:0 0 10px;color:#182D3C;font-size:13px;font-weight:700;">À prévoir</p>
                <ul style="margin:0;padding-left:20px;color:#182D3C;font-size:13px;line-height:1.7;">
                  <li>Votre CV ou vos derniers bulletins scolaires</li>
                  <li>Une pièce d'identité</li>
                  <li>Vos questions sur la formation</li>
                </ul>
              </div>

              <p style="margin:0;color:#888;font-size:13px;line-height:1.6;">
                Empêchement ? Répondez à cet email ou contactez-nous au <a href="tel:+33189719944" style="color:#6DA3A4;">01 89 71 99 44</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#182D3C;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#6DA3A4;font-size:12px;">À demain !<br>L'équipe Linova Éducation</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
}

// ─── J-1 SMS ─────────────────────────────────────────────────────────────────

export async function sendReminder24hSms(params: {
  firstName: string;
  phone: string;
  date: string;
  timeSlot: string;
}) {
  const shortDate = formatShortDate(params.date);
  const text = `Bonjour ${params.firstName}, rappel de votre entretien d'admission Linova demain ${shortDate} a ${params.timeSlot} (85 Av. Ledru-Rollin, Paris 12e). A demain ! 01 89 71 99 44`;
  return sendSms({ to: params.phone, text });
}

// ─── J-0 SMS (2h avant) ──────────────────────────────────────────────────────

export async function sendReminder2hSms(params: {
  firstName: string;
  phone: string;
  timeSlot: string;
}) {
  const text = `Linova : rappel de votre RDV dans 2h (${params.timeSlot}) au 85 Av. Ledru-Rollin, 75012 Paris. A tout a l'heure ${params.firstName} !`;
  return sendSms({ to: params.phone, text });
}
