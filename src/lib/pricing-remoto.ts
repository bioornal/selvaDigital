// Trae los importes editados en el panel (/admin/precios) y los aplica al catálogo
// de pricing.ts antes de renderizar. La home es estática: esto corre al compilar,
// y el panel dispara una recompilación en Vercel cada vez que se guardan precios.
// Si Supabase no responde, la web sale con los valores escritos en pricing.ts.

import { aplicarPrecios, combinarPrecios, preciosActuales } from './pricing';

let carga: Promise<void> | null = null;

async function traer(): Promise<void> {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('[precios] Faltan las variables de Supabase: uso los precios de pricing.ts.');
    return;
  }
  try {
    const res = await fetch(`${url}/rest/v1/site_settings?key=eq.precios&select=value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const filas = (await res.json()) as { value: unknown }[];
    if (!filas.length) return; // Nunca se guardaron precios desde el panel.
    aplicarPrecios(combinarPrecios(preciosActuales(), filas[0].value));
  } catch (err) {
    console.warn('[precios] No pude leer los precios de Supabase, uso los de pricing.ts:', err);
  }
}

/** Cargar antes de leer importes del catálogo. En build se hace una sola vez. */
export function cargarPrecios(): Promise<void> {
  if (import.meta.env.DEV) return traer(); // En dev, cada recarga trae lo último.
  return (carga ??= traer());
}
