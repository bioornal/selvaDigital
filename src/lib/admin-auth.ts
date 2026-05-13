import { supabaseAdmin } from './supabase-server';

/**
 * Verifica que el request tenga un JWT válido de Supabase Auth.
 * Si no, devuelve una Response 401 lista para retornar desde la API route.
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
    return new Response(JSON.stringify({ error: 'Unauthorized: missing token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized: invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return null; // OK, autenticado
}
