import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-server';
import { requireAuth } from '../../../lib/admin-auth';
import { validarPrecios } from '../../../lib/pricing';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
});

/** URL del Deploy Hook de Vercel: al llamarla, Vercel recompila la web con los precios nuevos. */
function deployHookUrl(): string {
  return (import.meta.env.VERCEL_DEPLOY_HOOK_URL as string | undefined)
    || (typeof process !== 'undefined' ? process.env.VERCEL_DEPLOY_HOOK_URL ?? '' : '');
}

export const GET: APIRoute = async ({ request }) => {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('value, updated_at')
    .eq('key', 'precios')
    .maybeSingle();

  if (error) {
    console.error('[admin/precios] GET:', error);
    const falta = error.code === '42P01' || error.code === 'PGRST205';
    return json({ error: falta ? 'Falta crear la tabla site_settings en Supabase (supabase/migration_site_settings.sql).' : 'No pude leer los precios.' }, 500);
  }

  return json({
    precios: data?.value ?? null,
    actualizado: data?.updated_at ?? null,
    publicacionAutomatica: Boolean(deployHookUrl()),
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'El cuerpo del pedido no es JSON válido.' }, 400);
  }

  const resultado = validarPrecios(body);
  if (!resultado.ok) return json({ error: resultado.error }, 400);

  const actualizado = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ key: 'precios', value: resultado.precios, updated_at: actualizado });

  if (error) {
    console.error('[admin/precios] PUT:', error);
    return json({ error: 'No pude guardar los precios.' }, 500);
  }

  // Republicar la web (la home es estática y lee los precios al compilar).
  const hook = deployHookUrl();
  let publicacion: 'iniciada' | 'sin-configurar' | 'error' = 'sin-configurar';
  if (hook) {
    try {
      const res = await fetch(hook, { method: 'POST', signal: AbortSignal.timeout(10_000) });
      publicacion = res.ok ? 'iniciada' : 'error';
      if (!res.ok) console.error('[admin/precios] Deploy hook respondió', res.status);
    } catch (err) {
      console.error('[admin/precios] Deploy hook falló:', err);
      publicacion = 'error';
    }
  }

  return json({ precios: resultado.precios, actualizado, publicacion });
};
