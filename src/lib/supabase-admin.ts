/** Client Supabase service-role (côté serveur uniquement). Bypasse RLS. */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseAdmin(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/** Vérifie un Bearer token Supabase et renvoie l'utilisateur ou null. */
export async function requireAuthUser(authHeader: string | null): Promise<{
  userId: string;
  email: string | null;
} | null> {
  const accessToken = authHeader?.replace(/^Bearer\s+/i, '');
  if (!accessToken) return null;
  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
  const { data, error } = await anon.auth.getUser(accessToken);
  if (error || !data?.user) return null;
  return { userId: data.user.id, email: data.user.email || null };
}
