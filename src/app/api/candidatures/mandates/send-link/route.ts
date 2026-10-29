/** Admin : envoie à l'élève par email le lien GoCardless pour signer son mandat. */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, requireAuthUser } from '@/lib/supabase-admin';
import { sendMandateInviteEmail } from '@/lib/mandate-emails';

export async function POST(req: NextRequest) {
  const user = await requireAuthUser(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const candidatureId = typeof body.candidatureId === 'string' ? body.candidatureId : '';
  const authorisationUrl = typeof body.authorisationUrl === 'string' ? body.authorisationUrl : '';
  const kind: 'setup' | 'replace' = body.kind === 'replace' ? 'replace' : 'setup';

  if (!candidatureId || !authorisationUrl.startsWith('https://')) {
    return NextResponse.json({ error: 'Paramètres manquants.' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: cand } = await admin
    .from('candidatures')
    .select('prenom, nom, email')
    .eq('id', candidatureId)
    .single();
  if (!cand?.email) {
    return NextResponse.json({ error: 'Email candidat introuvable.' }, { status: 404 });
  }

  try {
    await sendMandateInviteEmail({
      email: cand.email,
      prenom: cand.prenom || '',
      nom: cand.nom || '',
      authorisationUrl,
      kind,
    });
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error('[mandates/send-link]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Envoi email échoué' },
      { status: 500 }
    );
  }
}
