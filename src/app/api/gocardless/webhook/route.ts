import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Webhook GoCardless.
 * À enregistrer dans le dashboard : https://linova-education.fr/api/gocardless/webhook
 * Secret → env GOCARDLESS_WEBHOOK_SECRET
 *
 * Le dossier est surtout finalisé au retour navigateur ; ce webhook journalise
 * et confirme les événements mandat / paiement.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get('Webhook-Signature') || '';
  const secret = process.env.GOCARDLESS_WEBHOOK_SECRET?.trim();

  if (secret) {
    if (!verifyGoCardlessSignature(rawBody, signatureHeader, secret)) {
      console.warn('[gocardless/webhook] signature invalide');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 498 });
    }
  } else {
    console.warn('[gocardless/webhook] GOCARDLESS_WEBHOOK_SECRET manquant — signature non vérifiée');
  }

  let payload: {
    events?: {
      id: string;
      action?: string;
      resource_type?: string;
      links?: Record<string, string>;
    }[];
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  for (const event of payload.events || []) {
    console.info(
      '[gocardless/webhook]',
      event.resource_type,
      event.action,
      event.id,
      event.links || {}
    );
  }

  return NextResponse.json({ received: true });
}

/** GoCardless : HMAC-SHA256(secret, body) en hex = header Webhook-Signature. */
function verifyGoCardlessSignature(body: string, header: string, secret: string): boolean {
  if (!header) return false;
  const computed = createHmac('sha256', secret).update(body, 'utf8').digest('hex');
  const their = header.trim();
  try {
    const a = Buffer.from(computed, 'utf8');
    const b = Buffer.from(their, 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
