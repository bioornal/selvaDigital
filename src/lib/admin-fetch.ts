import { supabase } from './supabase';

/**
 * Wrapper de fetch que automáticamente agrega el JWT de Supabase Auth
 * como Authorization: Bearer <token>.
 *
 * Si no hay sesión activa, redirige a /admin/login.
 */
export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = '/admin/login';
    throw new Error('No active session');
  }

  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${session.access_token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(input, { ...init, headers });

  // Si el token expiró o es inválido, forzar re-login
  if (res.status === 401) {
    await supabase.auth.signOut().catch(() => {});
    window.location.href = '/admin/login';
  }

  return res;
}
