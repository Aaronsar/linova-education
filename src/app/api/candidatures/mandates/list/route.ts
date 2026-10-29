/** Admin : liste les mandats SEPA d'une candidature + prélèvements planifiés. */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, requireAuthUser } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const user = await requireAuthUser(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const candidatureId = req.nextUrl.searchParams.get('candidatureId') || '';
  if (!candidatureId) {
    return NextResponse.json({ error: 'candidatureId manquant.' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('candidature_mandates')
    .select('*')
    .eq('candidature_id', candidatureId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ mandates: data || [] });
}
