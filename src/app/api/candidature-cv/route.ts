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

// Limite du corps de requête sur Vercel : 4,5 Mo. On garde une marge.
const MAX_CV_BYTES = 4 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];

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

/** Vérifie que le début du fichier correspond bien à un PDF ou à un document Word. */
function looksLikeCv(bytes: Uint8Array, ext: string): boolean {
  const startsWith = (sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (ext === 'pdf') return startsWith([0x25, 0x50, 0x44, 0x46]); // %PDF
  if (ext === 'docx') return startsWith([0x50, 0x4b]); // archive zip
  if (ext === 'doc') return startsWith([0xd0, 0xcf, 0x11, 0xe0]); // ancien format Office
  return false;
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

  const cv = form.get('cv');
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: 'Merci de joindre votre CV.' }, { status: 400 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json({ error: 'Votre CV dépasse 4 Mo. Merci de joindre un fichier plus léger.' }, { status: 413 });
  }
  const ext = (cv.name.split('.').pop() || '').toLowerCase();
  const bytes = new Uint8Array(await cv.arrayBuffer());
  if (!ALLOWED_EXTENSIONS.includes(ext) || !looksLikeCv(bytes, ext)) {
    return NextResponse.json({ error: 'Format de CV non accepté. Formats acceptés : PDF, DOC, DOCX.' }, { status: 400 });
  }

  const safe = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');

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
    cv: {
      name: `CV-${safe(lastName)}-${safe(firstName)}.${ext}`,
      contentBase64: Buffer.from(bytes).toString('base64'),
    },
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

  return NextResponse.json({ success: true });
}
