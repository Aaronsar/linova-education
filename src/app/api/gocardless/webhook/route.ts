import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

/**
 * Webhook GoCardless.
 * Signature : HMAC-SHA256(secret, body) en hex = header Webhook-Signature.
 * Persiste les changements d'état sur les mandats et paiements liés
 * aux candidatures (table candidature_mandates).
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
    console.warn(
      '[gocardless/webhook] GOCARDLESS_WEBHOOK_SECRET manquant — signature non vérifiée'
    );
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
    try {
      await persistEvent(event);
    } catch (err) {
      console.error('[gocardless/webhook] persistEvent error', event.id, err);
    }
  }

  return NextResponse.json({ received: true });
}

async function persistEvent(event: {
  action?: string;
  resource_type?: string;
  links?: Record<string, string>;
}) {
  const admin = getSupabaseAdmin();

  if (event.resource_type === 'mandates' && event.links?.mandate) {
    const mandateId = event.links.mandate;
    const action = event.action || '';
    const nowIso = new Date().toISOString();

    if (action === 'cancelled' || action === 'failed' || action === 'expired') {
      await admin
        .from('candidature_mandates')
        .update({
          status: action === 'failed' ? 'failed' : 'cancelled',
          cancelled_at: nowIso,
        })
        .eq('gocardless_mandate_id', mandateId)
        .in('status', ['pending', 'active']);
    } else if (action === 'active' || action === 'submitted') {
      await admin
        .from('candidature_mandates')
        .update({ status: 'active' })
        .eq('gocardless_mandate_id', mandateId)
        .eq('status', 'pending');
    }
  }

  if (event.resource_type === 'payments' && event.links?.payment && event.links?.mandate) {
    const paymentId = event.links.payment;
    const mandateId = event.links.mandate;
    const action = event.action || '';
    const nextStatus = mapPaymentAction(action);
    if (!nextStatus) return;

    const { data: row } = await admin
      .from('candidature_mandates')
      .select('id, payments')
      .eq('gocardless_mandate_id', mandateId)
      .maybeSingle();
    if (!row) return;
    const payments = Array.isArray(row.payments) ? row.payments : [];
    const next = payments.map((p: { id: string; status?: string }) =>
      p.id === paymentId ? { ...p, status: nextStatus } : p
    );
    await admin.from('candidature_mandates').update({ payments: next }).eq('id', row.id);
  }
}

function mapPaymentAction(action: string): string | null {
  switch (action) {
    case 'created':
      return 'pending_submission';
    case 'submitted':
      return 'submitted';
    case 'confirmed':
      return 'confirmed';
    case 'paid_out':
      return 'paid_out';
    case 'failed':
      return 'failed';
    case 'cancelled':
      return 'cancelled';
    case 'charged_back':
      return 'charged_back';
    default:
      return null;
  }
}

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
