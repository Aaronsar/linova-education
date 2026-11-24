/**
 * Candidature avec CV (BTS NDRC en alternance).
 *
 * Reçoit le formulaire en multipart/form-data, vérifie les champs et le
 * fichier, puis envoie :
 *  1. un mail à recrutement@linova-education.fr avec le CV en pièce jointe ;
 *  2. un accusé de réception au candidat.
 *
 * Le CV n'est pas stocké sur le serveur : il part uniquement en pièce jointe.
 */

import { NextResponse } from 'next/server';
import { sendCandidatureCvAccuse, sendCandidatureCvToRecrutement } from '@/lib/resend-emails';
import { submitToDiplomaCrm } from '@/lib/diploma-crm';

const FORMATIONS: Record<string, string> = {
  'bts-ndrc': 'BTS NDRC en alternance (à distance)',
};

function text(form: FormData, key: string, max = 300): string {
  const v = form.get(key);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Formulaire invalide.' }, { status: 400 });
  }

  // Honeypot : un robot remplit ce champ, un humain ne le voit pas.
  if (text(form, 'hp')) {
    return NextResponse.json({ success: true });
  }

  const firstName = text(form, 'firstname', 80);
  const lastName = text(form, 'lastname', 80);
  const email = text(form, 'email', 160);
  const phone = text(form, 'phone', 30);
  const formation = FORMATIONS[text(form, 'formation', 40)];

  if (!firstName || !lastName || !email || !phone) {
    return NextResponse.json({ error: 'Merci de remplir tous les champs obligatoires.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
  }
  if (!formation) {
    return NextResponse.json({ error: 'Formation inconnue.' }, { status: 400 });
  }
  if (text(form, 'consent') !== 'oui') {
    return NextResponse.json({ error: 'Merci de cocher la case de consentement.' }, { status: 400 });
  }

  const params = {
    firstName,
    lastName,
    email,
    phone,
    formation,
    birthDate: text(form, 'birthdate', 20),
    city: text(form, 'city', 80),
    diploma: text(form, 'diploma', 80),
    availability: text(form, 'availability', 80),
    message: text(form, 'message', 2000),
    sourceUrl: text(form, 'source_url', 500),
  };

  try {
    await sendCandidatureCvToRecrutement(params);
  } catch (err) {
    console.error('[candidature-cv] Envoi au recrutement impossible :', err);
    return NextResponse.json(
      { error: "Votre candidature n'a pas pu être envoyée. Réessayez ou écrivez-nous à recrutement@linova-education.fr." },
      { status: 502 }
    );
  }

  // L'accusé de réception ne doit pas faire échouer la candidature.
  try {
    await sendCandidatureCvAccuse(params);
  } catch (err) {
    console.error('[candidature-cv] Accusé de réception non envoyé :', err);
  }

  try {
    await submitToDiplomaCrm({
      form: 'candidatureNdrc',
      sourceUrl: params.sourceUrl,
      data: {
        firstname: firstName,
        lastname: lastName,
        email,
        phone,
        city: params.city,
        last_diploma: params.diploma,
        formation,
        motivation_candidature: params.message,
      },
    });
  } catch (err) {
    console.error('[candidature-cv] Envoi CRM Diploma impossible :', err);
  }

  return NextResponse.json({ success: true });
}
