/**
 * Proxy vers l'API HubSpot Forms (Forms Submissions API).
 *
 * Permet d'envoyer un formulaire custom (avec notre design) vers HubSpot
 * sans charger le script `js-eu1.hsforms.net` ni l'iframe HubSpot.
 *
 * Doc : https://legacydocs.hubspot.com/docs/methods/forms/submit_form_v3
 */

import { NextRequest, NextResponse } from 'next/server';

const HUBSPOT_PORTAL_ID = '26711031';
const HUBSPOT_FORM_ID = '214e4f18-6c73-4398-be44-a10b6bd399f2';
const HUBSPOT_ENDPOINT = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

interface SubmissionPayload {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  formationType?: string;       // 'initial' | 'alternance'
  pageUri?: string;
  pageName?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: SubmissionPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const firstname = (body.firstname || '').trim();
  const lastname = (body.lastname || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();

  if (!firstname || !lastname || !email || !phone) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
  }

  const fields: { objectTypeId: string; name: string; value: string }[] = [
    { objectTypeId: '0-1', name: 'firstname', value: firstname },
    { objectTypeId: '0-1', name: 'lastname', value: lastname },
    { objectTypeId: '0-1', name: 'email', value: email },
    { objectTypeId: '0-1', name: 'phone', value: phone },
  ];

  // Champ optionnel : type de formation (à condition que le contact possède
  // un champ correspondant dans HubSpot ; sinon HubSpot l'ignore silencieusement
  // ou retourne un 400 — on ne l'envoie que si fourni).
  if (body.formationType) {
    fields.push({ objectTypeId: '0-1', name: 'type_de_formation', value: body.formationType });
  }

  const hubspotPayload = {
    fields,
    context: {
      pageUri: body.pageUri || '',
      pageName: body.pageName || '',
    },
  };

  try {
    const res = await fetch(HUBSPOT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hubspotPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[hubspot/submit] HubSpot error:', res.status, errText);
      // Si HubSpot rejette à cause du champ custom, on retente sans
      if (body.formationType && res.status >= 400 && res.status < 500) {
        const fallbackPayload = {
          ...hubspotPayload,
          fields: fields.filter((f) => f.name !== 'type_de_formation'),
        };
        const retry = await fetch(HUBSPOT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fallbackPayload),
        });
        if (retry.ok) {
          return NextResponse.json({ success: true });
        }
      }
      return NextResponse.json(
        { error: 'Erreur lors de la soumission. Veuillez réessayer.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[hubspot/submit] Network error:', err);
    return NextResponse.json(
      { error: 'Erreur réseau. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
