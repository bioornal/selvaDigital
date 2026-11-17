export const CAMPOS_CLIENTE = [
  'name', 'phone', 'email', 'project_name', 'project_type', 'status', 'currency',
  'total_amount', 'deposit_amount', 'design_amount', 'final_amount', 'weeks',
  'domain', 'alias', 'bank', 'cbu', 'access_code', 'current_phase',
  'modalidad', 'plan_id', 'abono_alta', 'abono_mensual', 'abono_inicio',
  'permanencia_meses', 'abono_ajustado_at', 'entregado_at',
  'condiciones_aceptadas_at', 'servicio_estado', 'baja_at',
] as const;

const CAMPOS_FECHA_NUMERO = new Set([
  'total_amount', 'deposit_amount', 'design_amount', 'final_amount', 'weeks',
  'current_phase', 'abono_alta', 'abono_mensual', 'permanencia_meses',
  'abono_inicio', 'abono_ajustado_at', 'entregado_at',
  'condiciones_aceptadas_at', 'baja_at', 'periodo', 'pagado_at', 'monto',
]);

export function filtrarCampos(body: unknown, permitidos: readonly string[]): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('El cuerpo de la solicitud debe ser un objeto');
  }

  const origen = body as Record<string, unknown>;
  const campos: Record<string, unknown> = {};
  for (const campo of permitidos) {
    if (Object.prototype.hasOwnProperty.call(origen, campo)) {
      campos[campo] = origen[campo] === '' && CAMPOS_FECHA_NUMERO.has(campo)
        ? null : origen[campo];
    }
  }
  return campos;
}
