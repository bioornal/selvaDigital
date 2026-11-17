import type { APIRoute } from 'astro';
import { requireAuth } from '../../../../lib/admin-auth';
import { adminDb, json } from '../../../../lib/admin-db';

// Borra un pago cargado por error (la interfaz pide confirmación antes).
export const DELETE: APIRoute = async ({ params, request }) => {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { error } = await adminDb.from('payments').delete().eq('id', params.id ?? '');
  if (error) return json({ error: 'No pude borrar el pago' }, 500);
  return json({ success: true });
};
