import { supabaseAdmin } from './supabase-server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AdminDatabase } from '../types/admin';

const adminDb = supabaseAdmin as unknown as SupabaseClient<AdminDatabase>;

/**
 * Verifica el JWT de Supabase Auth y la pertenencia a admin_users.
 * Devuelve 401 sin sesión válida, 403 sin permisos o 500 si falla la consulta.
 *
 * Uso típico:
 *   export const GET: APIRoute = async ({ request }) => {
 *     const unauthorized = await requireAuth(request);
 *     if (unauthorized) return unauthorized;
 *     // ... lógica de la ruta
 *   };
 */
export async function requireAuth(request: Request): Promise<Response | null> {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return new Response(JSON.stringify({ error: 'Falta el token de acceso' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    return new Response(JSON.stringify({ error: 'La sesión no es válida' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: admin, error: adminError } = await adminDb
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (adminError) {
    return new Response(JSON.stringify({ error: 'No pude verificar los permisos de administración' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!admin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return null;
}
