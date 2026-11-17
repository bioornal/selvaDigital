import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/admin-auth';
import { adminDb, json, esFecha } from '../../../lib/admin-db';
import { primerPeriodoImpago } from '../../../lib/cobros';
import { TIPOS_PAGO, MEDIOS_PAGO, type Payment } from '../../../types/admin';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET ?client_id=uuid → pagos del cliente; ?desde=&hasta= → pagos del rango (por fecha de pago o período).
export const GET: APIRoute = async ({ request, url }) => {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const clientId = url.searchParams.get('client_id');
  const desde = url.searchParams.get('desde');
  const hasta = url.searchParams.get('hasta');

  if (clientId) {
    if (!UUID.test(clientId)) return json({ error: 'Cliente inválido' }, 400);
    const { data, error } = await adminDb.from('payments').select('*')
      .eq('client_id', clientId).order('pagado_at', { ascending: false });
    if (error) return json({ error: 'No pude leer los pagos' }, 500);
    return json(data ?? []);
  }

  if (esFecha(desde) && esFecha(hasta)) {
    const { data, error } = await adminDb.from('payments').select('*')
      .or(`and(pagado_at.gte.${desde},pagado_at.lte.${hasta}),and(periodo.gte.${desde},periodo.lte.${hasta})`)
      .order('pagado_at', { ascending: false });
    if (error) return json({ error: 'No pude leer los pagos' }, 500);
    return json(data ?? []);
  }

  return json({ error: 'Indicá client_id, o desde y hasta (YYYY-MM-DD)' }, 400);
};

export const POST: APIRoute = async ({ request }) => {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'El cuerpo no es JSON válido' }, 400);
  }

  const tipo = body.tipo as Payment['tipo'];
  const medio = (body.medio ?? 'transferencia') as Payment['medio'];
  const monto = Number(body.monto);
  const clientId = String(body.client_id ?? '');
  const nota = typeof body.nota === 'string' && body.nota.trim() ? body.nota.trim().slice(0, 500) : null;
  let periodo = body.periodo === '' || body.periodo == null ? null : body.periodo;

  if (!UUID.test(clientId)) return json({ error: 'Cliente inválido' }, 400);
  if (!(tipo in TIPOS_PAGO)) return json({ error: 'Tipo de pago inválido' }, 400);
  if (!(medio in MEDIOS_PAGO)) return json({ error: 'Medio de pago inválido' }, 400);
  if (!Number.isFinite(monto) || monto <= 0) return json({ error: 'El monto tiene que ser mayor a cero' }, 400);
  if (!esFecha(body.pagado_at)) return json({ error: 'Fecha de pago inválida' }, 400);
  if (periodo !== null && !esFecha(periodo)) return json({ error: 'Período inválido' }, 400);
  if (tipo !== 'abono') periodo = null;

  if (tipo === 'abono' && periodo === null) {
    const [{ data: cliente, error: e1 }, { data: pagos, error: e2 }] = await Promise.all([
      adminDb.from('clients').select('modalidad, abono_inicio, abono_mensual, permanencia_meses, abono_ajustado_at, servicio_estado')
        .eq('id', clientId).maybeSingle(),
      adminDb.from('payments').select('tipo, periodo, monto').eq('client_id', clientId),
    ]);
    if (e1 || e2) return json({ error: 'No pude leer el cliente' }, 500);
    if (!cliente) return json({ error: 'No encontré el cliente' }, 404);
    periodo = primerPeriodoImpago(cliente, pagos ?? []);
    if (!periodo) return json({ error: 'Este cliente no tiene abono configurado' }, 400);
  }

  const nuevo: Omit<Payment, 'id' | 'created_at'> = {
    client_id: clientId, tipo, monto, medio, nota,
    pagado_at: body.pagado_at as string,
    periodo: periodo as string | null,
  };
  // supabase-js no infiere Insert con el tipado manual de AdminDatabase; el objeto ya está validado arriba.
  const { data, error } = await adminDb.from('payments').insert(nuevo as never).select().single();

  if (error) {
    if (error.code === '23505') return json({ error: 'Ese mes ya está registrado como pagado' }, 409);
    if (error.code === '23503') return json({ error: 'No encontré el cliente' }, 404);
    return json({ error: 'No pude registrar el pago' }, 500);
  }
  return json(data, 201);
};
