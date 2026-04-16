// Email sending via Brevo (ex-Sendinblue) REST API.
// File kept named "resend-emails.ts" for backwards-compat with imports.

const FROM_NAME = 'Linova Éducation';
const FROM_EMAIL = 'admissions@linova-education.fr';
const ADMISSIONS_EMAIL = 'admissions@linova-education.fr';

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
    year: 'numeric',
  });
}

async function sendBrevoEmail(payload: {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
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
      replyTo: payload.replyTo,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error ${res.status}: ${text}`);
  }
}

export interface BookingEmailParams {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appointmentType: string;
  date: string;
  timeSlot: string;
  currentStudies?: string;
  message?: string;
}

export async function sendConfirmationToCandidate(params: BookingEmailParams) {
  const typeLabel = TYPE_LABELS[params.appointmentType] || params.appointmentType;
  const formattedDate = formatDate(params.date);

  await sendBrevoEmail({
    to: { email: params.email, name: `${params.firstName} ${params.lastName}` },
    subject: `Votre rendez-vous d'admission est confirmé — Linova Éducation`,
    htmlContent: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#F9F9F9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#182D3C;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Linova Éducation</h1>
              <p style="margin:4px 0 0;color:#6DA3A4;font-size:13px;">École des métiers de la santé</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <div style="display:inline-block;background-color:#E6DC40;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:24px;margin-bottom:16px;">✓</div>
              <h2 style="margin:0 0 8px;color:#182D3C;font-size:24px;font-weight:700;">Rendez-vous confirmé !</h2>
              <p style="margin:0;color:#666;font-size:15px;">Bonjour ${params.firstName}, votre entretien d'admission est bien enregistré.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;border-radius:12px;padding:24px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:16px;border-bottom:1px solid #EFEFEF;">
                          <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Type d'entretien</p>
                          <p style="margin:0;color:#182D3C;font-size:15px;font-weight:600;">BTS Biologie Médicale — ${typeLabel}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #EFEFEF;">
                          <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Date</p>
                          <p style="margin:0;color:#182D3C;font-size:15px;font-weight:600;">${formattedDate}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:16px;">
                          <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Heure</p>
                          <p style="margin:0;color:#182D3C;font-size:15px;font-weight:600;">${params.timeSlot}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px;">
              <div style="background-color:#EEE4D8;border-radius:8px;padding:16px 20px;">
                <p style="margin:0;color:#182D3C;font-size:13px;line-height:1.6;">
                  <strong>Lieu :</strong> 85 Avenue Ledru-Rollin, 75012 Paris<br>
                  Présentez-vous 5 minutes avant l'heure prévue. En cas d'empêchement, contactez-nous à <a href="mailto:admissions@linova-education.fr" style="color:#182D3C;">admissions@linova-education.fr</a>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#182D3C;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#6DA3A4;font-size:12px;">© 2025 Linova Éducation · 85 Av. Ledru-Rollin, 75012 Paris</p>
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

export async function sendNotificationToAdmissions(params: BookingEmailParams) {
  const typeLabel = TYPE_LABELS[params.appointmentType] || params.appointmentType;
  const formattedDate = formatDate(params.date);

  await sendBrevoEmail({
    to: { email: ADMISSIONS_EMAIL, name: 'Linova Admissions' },
    replyTo: { email: params.email, name: `${params.firstName} ${params.lastName}` },
    subject: `Nouveau RDV d'admission — ${params.firstName} ${params.lastName} (${typeLabel})`,
    htmlContent: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#F9F9F9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#182D3C;padding:24px 40px;">
              <h1 style="margin:0;color:#E6DC40;font-size:18px;font-weight:700;">Nouveau rendez-vous d'admission</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:20px;">
                    <h3 style="margin:0 0 16px;color:#182D3C;font-size:16px;">Candidat</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;border-radius:8px;padding:16px;">
                      <tr><td style="padding-bottom:8px;color:#555;font-size:14px;"><strong style="color:#182D3C;">Nom :</strong> ${params.firstName} ${params.lastName}</td></tr>
                      <tr><td style="padding-bottom:8px;color:#555;font-size:14px;"><strong style="color:#182D3C;">Email :</strong> <a href="mailto:${params.email}" style="color:#6DA3A4;">${params.email}</a></td></tr>
                      <tr><td style="padding-bottom:8px;color:#555;font-size:14px;"><strong style="color:#182D3C;">Téléphone :</strong> ${params.phone}</td></tr>
                      ${params.currentStudies ? `<tr><td style="color:#555;font-size:14px;"><strong style="color:#182D3C;">Études actuelles :</strong> ${params.currentStudies}</td></tr>` : ''}
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:20px;">
                    <h3 style="margin:0 0 16px;color:#182D3C;font-size:16px;">Rendez-vous</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;border-radius:8px;padding:16px;">
                      <tr><td style="padding-bottom:8px;color:#555;font-size:14px;"><strong style="color:#182D3C;">Type :</strong> BTS Biologie Médicale — ${typeLabel}</td></tr>
                      <tr><td style="padding-bottom:8px;color:#555;font-size:14px;"><strong style="color:#182D3C;">Date :</strong> ${formattedDate}</td></tr>
                      <tr><td style="color:#555;font-size:14px;"><strong style="color:#182D3C;">Heure :</strong> ${params.timeSlot}</td></tr>
                    </table>
                  </td>
                </tr>
                ${params.message ? `
                <tr>
                  <td>
                    <h3 style="margin:0 0 16px;color:#182D3C;font-size:16px;">Message</h3>
                    <div style="background-color:#EEE4D8;border-radius:8px;padding:16px;color:#555;font-size:14px;line-height:1.6;">${params.message}</div>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#182D3C;padding:16px 40px;text-align:center;">
              <p style="margin:0;color:#6DA3A4;font-size:12px;">Linova Éducation — Système de prise de RDV automatisé</p>
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
