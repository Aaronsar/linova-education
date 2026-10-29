/** Emails de signature de mandat SEPA (via Brevo). */

const FROM_NAME = 'Linova Éducation';
const FROM_EMAIL = 'admissions@linova-education.fr';
const LOGO_URL = 'https://linova-education.fr/images/logos/logo-baseline-email.png';

async function sendBrevo(payload: {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('Missing BREVO_API_KEY');
  const testTo = process.env.EMAIL_TEST_REDIRECT?.trim();
  const to = testTo ? { email: testTo, name: payload.to.name } : payload.to;
  const subject = testTo ? `[TEST → ${payload.to.email}] ${payload.subject}` : payload.subject;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [to],
      subject,
      htmlContent: payload.htmlContent,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error ${res.status}: ${text}`);
  }
}

export async function sendMandateInviteEmail(params: {
  email: string;
  prenom: string;
  nom: string;
  authorisationUrl: string;
  kind: 'setup' | 'replace';
}) {
  const isReplace = params.kind === 'replace';
  const title = isReplace
    ? 'Changement de RIB — Linova'
    : 'Mise en place de votre prélèvement — Linova';
  const subject = isReplace
    ? 'Changement de RIB — signez votre nouveau mandat SEPA'
    : 'Mise en place de votre prélèvement — signez votre mandat SEPA';
  const intro = isReplace
    ? `Vous nous avez indiqué souhaiter changer le RIB utilisé pour vos prélèvements.`
    : `Pour régler le solde de votre scolarité par prélèvement SEPA, merci de signer votre mandat.`;
  const ctaLabel = isReplace ? 'Signer le nouveau mandat' : 'Signer le mandat SEPA';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F9F9F9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid #EFEFEF;">
          <img src="${LOGO_URL}" alt="Linova Éducation" width="160" style="display:block;margin:0 auto;max-width:160px;height:auto;border:0;" />
        </td></tr>
        <tr><td style="padding:32px 40px 0;text-align:center;">
          <div style="display:inline-block;background-color:#6DA3A4;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:24px;margin-bottom:16px;color:#fff;">🔐</div>
          <h2 style="margin:0 0 8px;color:#182D3C;font-size:22px;font-weight:700;">${title}</h2>
          <p style="margin:0;color:#666;font-size:15px;line-height:1.5;">${intro}</p>
        </td></tr>
        <tr><td style="padding:24px 40px;color:#222;font-size:14px;line-height:1.6;">
          <p>Bonjour <strong>${params.prenom}</strong>,</p>
          <p>Cliquez sur le bouton ci-dessous pour signer votre mandat de prélèvement SEPA. L'opération est sécurisée et prend 2 minutes&nbsp;: munissez-vous de votre <strong>RIB (IBAN)</strong>.</p>
          <p style="text-align:center;margin:28px 0;">
            <a href="${params.authorisationUrl}" style="display:inline-block;background-color:#182D3C;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:9999px;font-weight:700;font-size:15px;">${ctaLabel}</a>
          </p>
          <p style="font-size:12px;color:#888;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br><a href="${params.authorisationUrl}" style="color:#6DA3A4;word-break:break-all;">${params.authorisationUrl}</a></p>
          ${isReplace ? '<p style="margin-top:18px;">Les prélèvements à venir seront re-planifiés sur votre nouveau RIB dès la signature. L\'ancien mandat sera révoqué automatiquement.</p>' : ''}
          <p style="margin-top:24px;">Une question&nbsp;? Écrivez-nous à <a href="mailto:admissions@linova-education.fr" style="color:#6DA3A4;">admissions@linova-education.fr</a> ou appelez-nous au <strong>01 89 71 99 44</strong>.</p>
          <p>À très vite,<br><strong>L'équipe administrative Linova</strong></p>
        </td></tr>
        <tr><td style="background-color:#182D3C;padding:24px 40px;text-align:center;">
          <p style="margin:0;color:#6DA3A4;font-size:12px;">© Linova Éducation · 85 Av. Ledru-Rollin, 75012 Paris</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendBrevo({
    to: { email: params.email, name: `${params.prenom} ${params.nom}` },
    subject,
    htmlContent: html,
  });
}
