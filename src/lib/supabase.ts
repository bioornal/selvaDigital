import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Node 20 (Vercel) no tiene WebSocket nativo y supabase-js inicializa
// el cliente realtime al crear el client. Polyfill solo en SSR para
// evitar crashes; en browser ya existe globalThis.WebSocket.
let wsTransport: unknown = undefined;
if (import.meta.env.SSR) {
  const ws = await import('ws');
  // @ts-expect-error - tipos de ws no matchean exactamente la interface esperada
  wsTransport = ws.WebSocket || ws.default;
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  // @ts-expect-error - transport está permitido en runtime aunque tipos sean estrictos
  realtime: wsTransport ? { transport: wsTransport } : undefined,
});
