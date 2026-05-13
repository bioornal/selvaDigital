import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * Lee una variable de entorno desde import.meta.env (Astro) o process.env (Node runtime).
 * Tira un error explícito si no existe — mejor fallar al boot que dar respuestas vacías.
 */
function requireEnvVar(key: string): string {
  // Astro inyecta vars en import.meta.env durante build/SSR
  const fromImportMeta = (import.meta.env as Record<string, string | undefined>)[key];
  if (fromImportMeta) return fromImportMeta;

  // Fallback runtime (Vercel functions, scripts Node)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }

  throw new Error(
    `Missing environment variable: ${key}. ` +
    `Set it in Vercel → Project → Settings → Environment Variables.`
  );
}

const supabaseUrl = requireEnvVar('PUBLIC_SUPABASE_URL');
const supabaseServiceRoleKey = requireEnvVar('SUPABASE_SERVICE_ROLE_KEY');

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
