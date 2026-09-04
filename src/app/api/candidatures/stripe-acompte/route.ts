/**
 * Relie les acomptes Stripe aux dossiers de l’espace candidature.
 *
 * GET ?id=… → vérifie un dossier (PaymentIntent / Checkout Session).
 * GET         → liste les paiements Stripe récents + matching par PI / e-mail.
 *
 * Auth : token Supabase utilisateur (Bearer).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ACOMPTE_CENTS } from '@/lib/acompte';
import {
  isStripePaidStatus,
  normalizeEmail,
  parseAcompteFromRemarques,
  stripeDashboardUrl,
  type StripeAcompteLive,
} from '@/lib/parse-acompte';
import { getStripeServer, isStripeConfiguredServer } from '@/lib/stripe-server';

async function requireUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.replace(/^Bearer\s+/i, '');
  if (!accessToken) return null;

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
  const { data: userData, error } = await anonClient.auth.getUser(accessToken);
  if (error || !userData?.user) return null;
  return userData.user;
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function liveFromPaymentIntent(pi: {
  id: string;
  status: string;
  amount: number;
  currency: string;
  created: number;
  livemode: boolean;
  receipt_email?: string | null;
  metadata?: Record<string, string> | null;
}): StripeAcompteLive {
  const email = normalizeEmail(pi.metadata?.email || pi.receipt_email);
  return {
    id: pi.id,
    kind: 'payment_intent',
    status: pi.status,
    paid: isStripePaidStatus(pi.status),
    amount: pi.amount,
    currency: pi.currency,
    email,
    prenom: (pi.metadata?.prenom || '').trim(),
    nom: (pi.metadata?.nom || '').trim(),
    created: pi.created,
    livemode: pi.livemode,
    dashboardUrl: stripeDashboardUrl(pi.id, pi.livemode),
  };
}

function liveFromCheckoutSession(cs: {
  id: string;
  status: string | null;
  payment_status: string;
  amount_total: number | null;
  currency: string | null;
  created: number;
  livemode: boolean;
  customer_email?: string | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  payment_intent?: string | { id: string } | null;
  metadata?: Record<string, string> | null;
}): StripeAcompteLive {
  const email = normalizeEmail(
    cs.metadata?.email || cs.customer_details?.email || cs.customer_email
  );
  const name = (cs.customer_details?.name || '').trim();
  const [prenom, ...rest] = name.split(/\s+/);
  const piId =
    typeof cs.payment_intent === 'string'
      ? cs.payment_intent
      : cs.payment_intent?.id || cs.id;
  return {
    id: piId,
    kind: 'checkout_session',
    status: cs.payment_status || cs.status || 'unknown',
    paid: isStripePaidStatus(cs.payment_status) || cs.payment_status === 'paid',
    amount: cs.amount_total || 0,
    currency: cs.currency || 'eur',
    email,
    prenom: (cs.metadata?.prenom || prenom || '').trim(),
    nom: (cs.metadata?.nom || rest.join(' ')).trim(),
    created: cs.created,
    livemode: cs.livemode,
    dashboardUrl: stripeDashboardUrl(cs.id, cs.livemode),
    checkoutSessionId: cs.id,
  };
}

function isAcomptePayment(opts: {
  amount?: number | null;
  metadata?: Record<string, string> | null;
  description?: string | null;
}): boolean {
  if (opts.metadata?.type === 'acompte_preinscription') return true;
  if (opts.description && /acompte/i.test(opts.description)) return true;
  if (opts.amount === ACOMPTE_CENTS) return true;
  return false;
}

async function retrieveLiveForParsed(
  parsed: ReturnType<typeof parseAcompteFromRemarques>
): Promise<StripeAcompteLive | null> {
  const stripe = getStripeServer();
  if (!stripe) return null;

  if (parsed.paymentIntentId) {
    try {
      const pi = await stripe.paymentIntents.retrieve(parsed.paymentIntentId);
      return liveFromPaymentIntent(pi);
    } catch (err) {
      console.error('[stripe-acompte] retrieve PI', parsed.paymentIntentId, err);
    }
  }

  if (parsed.checkoutSessionId) {
    try {
      const cs = await stripe.checkout.sessions.retrieve(parsed.checkoutSessionId);
      return liveFromCheckoutSession(cs);
    } catch (err) {
      console.error('[stripe-acompte] retrieve CS', parsed.checkoutSessionId, err);
    }
  }

  return null;
}

async function listRecentStripePayments(): Promise<{
  payments: StripeAcompteLive[];
  error: string | null;
}> {
  const stripe = getStripeServer();
  if (!stripe) return { payments: [], error: 'Stripe non configuré.' };

  const payments: StripeAcompteLive[] = [];
  const seen = new Set<string>();
  let listError: string | null = null;

  try {
    let startingAfter: string | undefined;
    for (let page = 0; page < 3; page++) {
      const res = await stripe.paymentIntents.list({
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      });
      for (const pi of res.data) {
        if (!isAcomptePayment({ amount: pi.amount, metadata: pi.metadata, description: pi.description })) {
          continue;
        }
        if (!isStripePaidStatus(pi.status)) continue;
        if (seen.has(pi.id)) continue;
        seen.add(pi.id);
        payments.push(liveFromPaymentIntent(pi));
      }
      if (!res.has_more || res.data.length === 0) break;
      startingAfter = res.data[res.data.length - 1]?.id;
    }
  } catch (err) {
    listError = err instanceof Error ? err.message : 'Impossible de lister les PaymentIntents Stripe.';
    console.error('[stripe-acompte] list PI', err);
  }

  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    for (const cs of sessions.data) {
      if (cs.payment_status !== 'paid' && cs.status !== 'complete') continue;
      if (!isAcomptePayment({ amount: cs.amount_total, metadata: cs.metadata })) continue;
      const live = liveFromCheckoutSession(cs);
      if (seen.has(live.id)) continue;
      seen.add(live.id);
      payments.push(live);
    }
  } catch (err) {
    console.error('[stripe-acompte] list checkout sessions', err);
    if (!listError) {
      listError = err instanceof Error ? err.message : 'Impossible de lister les sessions Stripe.';
    }
  }

  payments.sort((a, b) => b.created - a.created);
  return { payments, error: listError };
}

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const candidatureId = req.nextUrl.searchParams.get('id')?.trim() || '';
  const stripeConfigured = isStripeConfiguredServer();
  const supabase = serviceClient();

  if (candidatureId) {
    const { data: cand, error } = await supabase
      .from('candidatures')
      .select('id, prenom, nom, email, remarques')
      .eq('id', candidatureId)
      .single();

    if (error || !cand) {
      return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 });
    }

    const parsed = parseAcompteFromRemarques(cand.remarques);
    const stripe = stripeConfigured ? await retrieveLiveForParsed(parsed) : null;

    return NextResponse.json({
      stripeConfigured,
      parsed,
      stripe,
      candidature: {
        id: cand.id,
        prenom: cand.prenom,
        nom: cand.nom,
        email: cand.email,
      },
    });
  }

  const { data: candidatures, error } = await supabase
    .from('candidatures')
    .select('id, prenom, nom, email, remarques, entreprise_trouvee')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { payments, error: stripeError } = stripeConfigured
    ? await listRecentStripePayments()
    : { payments: [] as StripeAcompteLive[], error: null };

  const stripe = getStripeServer();
  if (stripe && stripeConfigured) {
    const listed = new Set(payments.map((p) => p.id));
    const extraIds = [
      ...new Set(
        (candidatures || [])
          .map((c) => parseAcompteFromRemarques(c.remarques).paymentIntentId)
          .filter((id): id is string => typeof id === 'string' && id.length > 0 && !listed.has(id))
      ),
    ].slice(0, 30);
    const extras = await Promise.all(
      extraIds.map(async (id) => {
        try {
          const pi = await stripe.paymentIntents.retrieve(id);
          return liveFromPaymentIntent(pi);
        } catch {
          return null;
        }
      })
    );
    for (const extra of extras) {
      if (extra) payments.push(extra);
    }
  }

  const byRef = new Map<string, StripeAcompteLive>();
  const byEmail = new Map<string, StripeAcompteLive>();
  for (const p of payments) {
    byRef.set(p.id, p);
    if (p.checkoutSessionId) byRef.set(p.checkoutSessionId, p);
    if (p.email && !byEmail.has(p.email)) byEmail.set(p.email, p);
  }

  const matchedIds = new Set<string>();
  const items = (candidatures || []).map((c) => {
    const parsed = parseAcompteFromRemarques(c.remarques);
    const email = normalizeEmail(c.email);
    const isInitiale = String(c.entreprise_trouvee || '')
      .toLowerCase()
      .includes('initial');
    const stripe =
      (parsed.paymentIntentId && byRef.get(parsed.paymentIntentId)) ||
      (parsed.checkoutSessionId && byRef.get(parsed.checkoutSessionId)) ||
      (email && (parsed.hasAcompteLine || isInitiale) ? byEmail.get(email) : undefined) ||
      null;
    if (stripe) matchedIds.add(stripe.id);
    return {
      id: c.id,
      email: c.email as string,
      prenom: c.prenom as string,
      nom: c.nom as string,
      parsed,
      stripe,
    };
  });

  const unmatched = payments.filter((p) => !matchedIds.has(p.id));

  return NextResponse.json({
    stripeConfigured,
    stripeError,
    items,
    unmatched,
  });
}
