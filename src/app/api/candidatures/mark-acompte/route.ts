/**
 * Marque manuellement l’acompte comme payé (espèces, virement ou chèque reçu).
 * Auth : token Supabase utilisateur (cookie/Bearer).
 * Écriture DB : service role (bypass RLS).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  parseAcompteFromRemarques,
  upsertManualAcompteLine,
  type ManualAcompteMode,
} from '@/lib/parse-acompte';

const VALID_MODES: ManualAcompteMode[] = ['especes', 'virement', 'cheque'];

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.replace(/^Bearer\s+/i, '');
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
  const { data: userData, error: userErr } = await anonClient.auth.getUser(accessToken);
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { candidatureId?: string; mode?: ManualAcompteMode };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { candidatureId, mode } = body;
  if (!candidatureId || !mode) {
    return NextResponse.json({ error: 'Missing candidatureId or mode' }, { status: 400 });
  }
  if (!VALID_MODES.includes(mode)) {
    return NextResponse.json({ error: `Invalid mode: ${mode}` }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: cand, error: fetchError } = await supabase
    .from('candidatures')
    .select('id, remarques')
    .eq('id', candidatureId)
    .single();

  if (fetchError || !cand) {
    return NextResponse.json({ error: 'Candidature not found' }, { status: 404 });
  }

  const parsed = parseAcompteFromRemarques(cand.remarques);
  if (parsed.mode === 'carte' && parsed.paid) {
    return NextResponse.json(
      { error: 'Acompte déjà payé par carte (Stripe).' },
      { status: 409 }
    );
  }

  const remarques = upsertManualAcompteLine(cand.remarques, mode);
  const { error: updateError } = await supabase
    .from('candidatures')
    .update({ remarques })
    .eq('id', candidatureId);

  if (updateError) {
    console.error('[candidatures/mark-acompte] update error:', updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    mode,
    remarques,
    parsed: parseAcompteFromRemarques(remarques),
  });
}
