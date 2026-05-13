import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import { WebSocket as WSWebSocket } from 'ws';

function readEnvVar(key: string): string {
  const fromImportMeta = (import.meta.env as Record<string, string | undefined>)[key];
  if (fromImportMeta) return fromImportMeta;
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
}

const supabaseUrl = readEnvVar('PUBLIC_SUPABASE_URL');
const supabaseServiceRoleKey = readEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    '[supabase-server] Missing env vars. ' +
    `PUBLIC_SUPABASE_URL=${supabaseUrl ? 'OK' : 'MISSING'}, ` +
    `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceRoleKey ? 'OK' : 'MISSING'}. ` +
    'API routes that need the service role key will fail with 500.'
  );
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl || 'https://invalid.supabase.co',
  supabaseServiceRoleKey || 'invalid-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    // Node 20 no tiene WebSocket nativo; supabase-js exige uno para inicializar
    // el cliente realtime aunque nunca lo usemos.
    // @ts-expect-error - transport está permitido en runtime
    realtime: { transport: WSWebSocket },
  }
);
