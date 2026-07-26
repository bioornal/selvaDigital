export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase-server';
import { supabase } from '../../lib/supabase';

// Keep-alive para Supabase free tier: los proyectos gratuitos se pausan
// tras 7 días de inactividad. Vercel Cron o GitHub Actions llaman a este endpoint
// para realizar una consulta SQL SELECT real que reinicie el contador de inactividad de Supabase.
//
// Seguridad: si CRON_SECRET está configurado en Vercel/env, se exige el header
// Authorization: Bearer <CRON_SECRET> o parámetro ?secret=<CRON_SECRET>.
export const GET: APIRoute = async ({ request, url }) => {
  const cronSecret =
    (import.meta.env as Record<string, string | undefined>).CRON_SECRET ||
    (typeof process !== 'undefined' ? process.env.CRON_SECRET : undefined);

  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    const querySecret = url.searchParams.get('secret');
    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` || querySecret === cronSecret;

    if (!isAuthorized) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    console.warn('[keep-alive] CRON_SECRET no configurado — endpoint público.');
  }

  let success = false;
  let clientUsed = 'admin';
  let queryError: string | null = null;

  // 1. Intentar consulta SELECT real con supabaseAdmin (Service Role)
  try {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('id')
      .limit(1);

    if (error) {
      queryError = `${error.code}: ${error.message}`;
      console.warn('[keep-alive] supabaseAdmin query warning, probando cliente anon fallback:', queryError);
    } else {
      success = true;
    }
  } catch (err: any) {
    queryError = err?.message || String(err);
  }

  // 2. Fallback a supabase (Anon key) si supabaseAdmin no trajo data
  if (!success && supabase) {
    try {
      const { error: anonErr } = await supabase
        .from('clients')
        .select('id')
        .limit(1);

      if (!anonErr) {
        success = true;
        clientUsed = 'anon';
        queryError = null;
      } else {
        queryError = `Admin: ${queryError} | Anon: ${anonErr.code} ${anonErr.message}`;
      }
    } catch (err: any) {
      queryError = `Admin: ${queryError} | Anon: ${err?.message || String(err)}`;
    }
  }

  if (!success) {
    console.error('[keep-alive] Ambas consultas a Supabase fallaron:', queryError);
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Supabase ping query failed',
        details: queryError,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      clientUsed,
      message: 'Supabase ping successful (SQL SELECT executed)',
      timestamp: new Date().toISOString(),
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

