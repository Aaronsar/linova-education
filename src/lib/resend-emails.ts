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

/**
 * Si EMAIL_TEST_REDIRECT est défini, redirige tous les emails vers cette
 * adresse et préfixe le sujet avec [TEST → vrai-destinataire@…]. Pratique
 * pour valider les nouveaux templates avant de les activer en prod.
 */
function resolveRecipient(to: { email: string; name?: string }, subject: string) {
  const testTo = process.env.EMAIL_TEST_REDIRECT?.trim();
  if (!testTo) return { to, subject };
  return {
    to: { email: testTo, name: to.name },
    subject: `[TEST → ${to.email}] ${subject}`,
  };
}

async function sendBrevoEmail(payload: {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('Missing BREVO_API_KEY');

  const { to, subject } = resolveRecipient(payload.to, payload.subject);

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

// ─── Emails post-entretien ───────────────────────────────────────────────────

/** Layout HTML commun (header navy + footer signature) */
function emailLayout(opts: { title: string; iconBg: string; icon: string; intro: string; body: string; footerNote?: string }) {
  return `<!DOCTYPE html>
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
              <div style="display:inline-block;background-color:${opts.iconBg};border-radius:50%;width:56px;height:56px;line-height:56px;font-size:24px;margin-bottom:16px;">${opts.icon}</div>
              <h2 style="margin:0 0 8px;color:#182D3C;font-size:24px;font-weight:700;">${opts.title}</h2>
              <p style="margin:0;color:#666;font-size:15px;line-height:1.5;">${opts.intro}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;color:#222;font-size:14px;line-height:1.6;">
              ${opts.body}
            </td>
          </tr>
          ${opts.footerNote ? `<tr><td style="padding:0 40px 24px;"><div style="background-color:#EEE4D8;border-radius:8px;padding:16px 20px;color:#182D3C;font-size:13px;line-height:1.6;">${opts.footerNote}</div></td></tr>` : ''}
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
</html>`;
}

/** Email envoyé immédiatement quand le statut passe à "inscrit". */
export async function sendInscriptionConfirmation(params: BookingEmailParams) {
  const typeLabel = TYPE_LABELS[params.appointmentType] || params.appointmentType;
  const isAlternance = params.appointmentType === 'alternance';

  const alternanceBlock = isAlternance
    ? `
    <div style="background-color:#EEE4D8;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;font-weight:700;color:#182D3C;font-size:15px;">🎯 Étape clé : trouvez votre entreprise d'accueil</p>
      <p style="margin:0 0 12px;color:#444;">
        Votre inscription est validée — il vous reste maintenant à <strong>décrocher votre contrat d'alternance</strong>.
        Sans entreprise d'accueil, le démarrage de la formation ne peut être finalisé. Lancez la recherche dès maintenant !
      </p>
      <ul style="padding-left:20px;color:#444;margin:0;">
        <li style="margin-bottom:6px;">Postulez en priorité dans les <strong>laboratoires d'analyses médicales</strong> (Cerba, Biogroup, Eurofins, laboratoires hospitaliers, EFS, centres de recherche).</li>
        <li style="margin-bottom:6px;">Mobilisez votre réseau, LinkedIn, et envoyez des candidatures spontanées ciblées.</li>
        <li style="margin-bottom:6px;">Notre équipe vous accompagne : envoyez votre CV à <a href="mailto:admissions@linova-education.fr" style="color:#182D3C;">admissions@linova-education.fr</a>, nous vous transmettrons des contacts et conseils personnalisés.</li>
      </ul>
      <p style="margin:12px 0 0;color:#444;font-size:13px;">
        <strong>Bon à savoir :</strong> en alternance, votre formation est intégralement prise en charge par l'OPCO et vous percevez une rémunération mensuelle.
      </p>
    </div>
  `
    : '';

  const body = `
    <p>Bonjour <strong>${params.firstName}</strong>,</p>
    <p>Toute l'équipe de Linova Éducation a le plaisir de vous confirmer votre <strong>inscription au BTS Biologie Médicale — ${typeLabel}</strong>. Bienvenue parmi nous !</p>
    ${alternanceBlock}
    <p style="margin:24px 0 12px;font-weight:700;color:#182D3C;">Les prochaines étapes :</p>
    <ul style="padding-left:20px;color:#444;">
      ${
        isAlternance
          ? `<li style="margin-bottom:8px;"><strong>Trouvez votre entreprise d'accueil</strong> dès que possible (voir ci-dessus) — sans contrat signé, votre place ne peut être garantie.</li>`
          : ''
      }
      <li style="margin-bottom:8px;">Vous recevrez prochainement votre <strong>convocation officielle</strong> précisant la date de rentrée.</li>
      <li style="margin-bottom:8px;">Notre équipe administrative reviendra vers vous pour finaliser le dossier (paiement, attestation CVEC, signature du contrat de formation).</li>
      <li style="margin-bottom:8px;">Un kit de bienvenue contenant l'emploi du temps, les ressources pédagogiques et l'accès à l'extranet vous sera transmis avant la rentrée.</li>
    </ul>
    <p style="margin-top:24px;">Pour toute question, n'hésitez pas à nous écrire à <a href="mailto:admissions@linova-education.fr" style="color:#6DA3A4;">admissions@linova-education.fr</a> ou à nous appeler au <strong>01 89 71 99 44</strong>.</p>
    <p>À très vite,<br><strong>L'équipe admissions Linova</strong></p>
  `;
  await sendBrevoEmail({
    to: { email: params.email, name: `${params.firstName} ${params.lastName}` },
    subject: 'Confirmation de votre inscription au BTS Biologie Médicale — Linova',
    htmlContent: emailLayout({
      title: 'Bienvenue chez Linova !',
      iconBg: '#E6DC40',
      icon: '🎓',
      intro: isAlternance
        ? `Votre inscription au BTS Biologie Médicale est validée. Prochaine étape : décrocher votre alternance.`
        : `Votre inscription au BTS Biologie Médicale est officiellement validée.`,
      body,
      footerNote: `<strong>Prochain rendez-vous :</strong> rentrée mi-septembre · 85 Avenue Ledru-Rollin, 75012 Paris.`,
    }),
  });
}

/** Email envoyé 24 h après le passage à "dossier_accepte" — contient le dossier d'inscription. */
export async function sendDossierAdmission(params: BookingEmailParams) {
  const typeLabel = TYPE_LABELS[params.appointmentType] || params.appointmentType;
  const dossierUrl = 'https://linova-education.fr/dossier-inscription-alternance';
  const body = `
    <p>Bonjour <strong>${params.firstName}</strong>,</p>
    <p>Suite à votre entretien d'admission au <strong>BTS Biologie Médicale — ${typeLabel}</strong>, nous avons le plaisir de vous informer que <strong>votre candidature a été retenue</strong>. Bravo !</p>
    <p>Pour officialiser votre admission, merci de remplir le <strong>dossier d'inscription</strong> en cliquant sur le lien ci-dessous :</p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${dossierUrl}" style="display:inline-block;background-color:#182D3C;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:9999px;font-weight:700;font-size:15px;">Compléter mon dossier d'inscription</a>
    </p>
    <p style="margin:24px 0 12px;font-weight:700;color:#182D3C;">Pièces à préparer :</p>
    <ul style="padding-left:20px;color:#444;">
      <li style="margin-bottom:6px;">Pièce d'identité (CNI ou passeport en cours de validité)</li>
      <li style="margin-bottom:6px;">Photo d'identité récente</li>
      <li style="margin-bottom:6px;">Dernier diplôme obtenu et derniers bulletins scolaires</li>
      <li style="margin-bottom:6px;">CV à jour</li>
      <li style="margin-bottom:6px;">Attestation CVEC (à obtenir sur cvec.etudiant.gouv.fr)</li>
    </ul>
    <p style="margin-top:24px;">Merci de finaliser votre dossier <strong>sous 14 jours</strong> pour garantir votre place.</p>
    <p>Une question ? Nous sommes à votre disposition à <a href="mailto:admissions@linova-education.fr" style="color:#6DA3A4;">admissions@linova-education.fr</a> ou au <strong>01 89 71 99 44</strong>.</p>
    <p>À très vite,<br><strong>L'équipe admissions Linova</strong></p>
  `;
  await sendBrevoEmail({
    to: { email: params.email, name: `${params.firstName} ${params.lastName}` },
    subject: 'Votre dossier d\'admission BTS Biologie Médicale — Linova',
    htmlContent: emailLayout({
      title: 'Votre admission est confirmée !',
      iconBg: '#6DA3A4',
      icon: '📋',
      intro: `Félicitations ${params.firstName}, votre candidature au BTS Biologie Médicale est retenue.`,
      body,
      footerNote: `<strong>Délai de retour :</strong> 14 jours · <strong>Lieu :</strong> 85 Avenue Ledru-Rollin, 75012 Paris.`,
    }),
  });
}

/** Email envoyé immédiatement quand le statut passe à "dossier_refuse". */
export async function sendCandidatureRejected(params: BookingEmailParams) {
  const body = `
    <p>Bonjour <strong>${params.firstName}</strong>,</p>
    <p>Nous avons étudié avec attention votre candidature au BTS Biologie Médicale, et nous vous remercions sincèrement de l'intérêt que vous portez à Linova Éducation.</p>
    <p>Après analyse, nous sommes au regret de vous informer que <strong>votre candidature n'a pas été retenue</strong> pour cette session.</p>
    <p>Cette décision ne remet en aucun cas en cause vos qualités personnelles ou votre parcours. Le nombre de places étant limité, nous avons dû opérer une sélection difficile parmi de très nombreuses candidatures de qualité.</p>
    <p style="margin:24px 0 12px;font-weight:700;color:#182D3C;">Et maintenant ?</p>
    <ul style="padding-left:20px;color:#444;">
      <li style="margin-bottom:8px;">D'autres formations en biologie médicale ou en santé peuvent correspondre à votre projet — nous vous invitons à les explorer.</li>
      <li style="margin-bottom:8px;">Vous pouvez recandidater l'année prochaine si votre profil évolue (nouvelle expérience, formation complémentaire, projet précisé).</li>
      <li style="margin-bottom:8px;">Notre équipe reste disponible pour échanger sur les pistes d'orientation possibles.</li>
    </ul>
    <p style="margin-top:24px;">Nous vous souhaitons sincèrement <strong>beaucoup de succès dans la suite de votre parcours</strong>. Quel que soit le chemin choisi, nous sommes convaincus que votre détermination vous portera loin.</p>
    <p>Avec nos meilleurs encouragements,<br><strong>L'équipe admissions Linova</strong></p>
  `;
  await sendBrevoEmail({
    to: { email: params.email, name: `${params.firstName} ${params.lastName}` },
    subject: 'Suite donnée à votre candidature — Linova Éducation',
    htmlContent: emailLayout({
      title: 'Suite à votre candidature',
      iconBg: '#EEE4D8',
      icon: '✉️',
      intro: `Merci pour votre candidature et votre intérêt pour notre école.`,
      body,
      footerNote: `Pour échanger : <a href="mailto:admissions@linova-education.fr" style="color:#182D3C;">admissions@linova-education.fr</a> · 01 89 71 99 44`,
    }),
  });
}
