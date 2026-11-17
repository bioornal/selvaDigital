// Cliente de Supabase con service role tipado para las tablas del panel
// (database.ts no coincide con supabase-js; ver CLAUDE.md, Phase 12).
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from './supabase-server';
import type { AdminDatabase } from '../types/admin';

export const adminDb = supabaseAdmin as unknown as SupabaseClient<AdminDatabase>;

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** 'YYYY-MM-DD' válido en el calendario. */
export function esFecha(valor: unknown): valor is string {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const [y, m, d] = valor.split('-').map(Number);
  const f = new Date(Date.UTC(y, m - 1, d));
  return f.getUTCFullYear() === y && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
}
