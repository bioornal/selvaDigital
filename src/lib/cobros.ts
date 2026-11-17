// Cálculo de vencimientos y estado de cobro del abono mensual.
// Funciones puras: reciben el cliente, sus pagos y la fecha de hoy; no tocan red ni Supabase.
// Fechas como texto 'YYYY-MM-DD' (así las devuelve Supabase en columnas date) y aritmética en UTC.
//
// Regla (decisión del dueño, 16/11/2026): el abono vence cada mes el mismo día que abono_inicio
// (si ese día no existe, el último del mes). Después del vencimiento hay 10 días de aguante;
// desde el día 11 el cliente queda «para dar de baja». La baja la ejecuta el dueño a mano.

export type Modalidad = 'abono' | 'unico' | 'proyecto';
export type ServicioEstado = 'activo' | 'baja';

export const DIAS_AGUANTE = 10;
export const DIAS_AVISO_PREVIO = 3;
const ZONA = 'America/Argentina/Buenos_Aires';
const DIA_MS = 86_400_000;
const TOPE_MESES = 600;

export interface ClienteCobro {
  modalidad: Modalidad | null;
  abono_inicio: string | null;
  abono_mensual: number | null;
  permanencia_meses: number | null;
  abono_ajustado_at: string | null;
  servicio_estado: ServicioEstado;
}

export interface PagoCobro {
  tipo: string;
  periodo: string | null;
  monto: number;
}

export type EstadoCobro =
  | { tipo: 'no_aplica' }
  | { tipo: 'al_dia'; proximo: string; dias: number }
  | { tipo: 'vence_pronto'; proximo: string; dias: number }
  | { tipo: 'en_aguante'; vencido: string; dia: number; mesesAdeudados: number; adeudado: number }
  | { tipo: 'para_baja'; vencido: string; diasAtraso: number; mesesAdeudados: number; adeudado: number };

/** Fecha de hoy en Argentina, como 'YYYY-MM-DD'. */
export function hoyAR(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

function partes(iso: string): [number, number, number] {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return [y, m, d];
}

function aISO(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Suma meses a una fecha; si el día no existe en el mes destino, usa el último. */
export function sumarMeses(iso: string, meses: number): string {
  const [y, m, d] = partes(iso);
  const total = y * 12 + (m - 1) + meses;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  const ultimo = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
  return aISO(ny, nm, Math.min(d, ultimo));
}

/** Días de `desde` a `hasta` (negativo si `hasta` es anterior). */
export function diasEntre(desde: string, hasta: string): number {
  const [y1, m1, d1] = partes(desde);
  const [y2, m2, d2] = partes(hasta);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / DIA_MS);
}

/** Vencimientos mensuales desde el mes siguiente a `inicio` hasta `hasta` inclusive. */
export function vencimientos(inicio: string, hasta: string): string[] {
  const lista: string[] = [];
  for (let k = 1; k <= TOPE_MESES; k++) {
    const v = sumarMeses(inicio, k);
    if (v > hasta) break;
    lista.push(v);
  }
  return lista;
}

function aplica(c: ClienteCobro): c is ClienteCobro & { abono_inicio: string } {
  return c.modalidad === 'abono' && !!c.abono_inicio && c.servicio_estado !== 'baja';
}

function periodosPagados(pagos: PagoCobro[]): Set<string> {
  return new Set(pagos.filter((p) => p.tipo === 'abono' && p.periodo).map((p) => p.periodo!.slice(0, 10)));
}

export function estadoCobro(c: ClienteCobro, pagos: PagoCobro[], hoy: string): EstadoCobro {
  if (!aplica(c)) return { tipo: 'no_aplica' };
  const pagados = periodosPagados(pagos);
  const ayer = sumarDias(hoy, -1);
  const vencidos = vencimientos(c.abono_inicio, ayer).filter((v) => !pagados.has(v));

  if (vencidos.length > 0) {
    const atraso = diasEntre(vencidos[0], hoy);
    const mesesAdeudados = vencidos.length;
    const adeudado = mesesAdeudados * (c.abono_mensual ?? 0);
    return atraso <= DIAS_AGUANTE
      ? { tipo: 'en_aguante', vencido: vencidos[0], dia: atraso, mesesAdeudados, adeudado }
      : { tipo: 'para_baja', vencido: vencidos[0], diasAtraso: atraso, mesesAdeudados, adeudado };
  }

  for (let k = 1; k <= TOPE_MESES; k++) {
    const v = sumarMeses(c.abono_inicio, k);
    if (v < hoy || pagados.has(v)) continue;
    const dias = diasEntre(hoy, v);
    return { tipo: dias <= DIAS_AVISO_PREVIO ? 'vence_pronto' : 'al_dia', proximo: v, dias };
  }
  return { tipo: 'no_aplica' };
}

export function sumarDias(iso: string, dias: number): string {
  const [y, m, d] = partes(iso);
  const f = new Date(Date.UTC(y, m - 1, d) + dias * DIA_MS);
  return aISO(f.getUTCFullYear(), f.getUTCMonth() + 1, f.getUTCDate());
}

/** El vencimiento más viejo sin pagar (puede ser futuro). Lo usa la API al registrar un abono sin período. */
export function primerPeriodoImpago(c: ClienteCobro, pagos: PagoCobro[]): string | null {
  if (c.modalidad !== 'abono' || !c.abono_inicio) return null;
  const pagados = periodosPagados(pagos);
  for (let k = 1; k <= TOPE_MESES; k++) {
    const v = sumarMeses(c.abono_inicio, k);
    if (!pagados.has(v)) return v;
  }
  return null;
}

export function finPermanencia(c: ClienteCobro): string | null {
  if (!c.abono_inicio || !c.permanencia_meses) return null;
  return sumarMeses(c.abono_inicio, c.permanencia_meses);
}

/** Pasaron 3 meses desde el último ajuste (o desde el inicio): toca actualizar por IPC. */
export function tocaAjusteIPC(c: ClienteCobro, hoy: string): boolean {
  if (!aplica(c)) return false;
  return hoy >= sumarMeses(c.abono_ajustado_at ?? c.abono_inicio, 3);
}

export function etiquetaEstado(e: EstadoCobro): string {
  switch (e.tipo) {
    case 'no_aplica': return '—';
    case 'al_dia': return 'Al día';
    case 'vence_pronto': return e.dias === 0 ? 'Vence hoy' : e.dias === 1 ? 'Vence mañana' : `Vence en ${e.dias} días`;
    case 'en_aguante': return `En aguante · día ${e.dia} de ${DIAS_AGUANTE}`;
    case 'para_baja': return 'Para dar de baja';
  }
}

/** 'YYYY-MM-DD' → 'DD/MM' para mensajes y etiquetas. */
export function fechaCorta(iso: string): string {
  const [, m, d] = partes(iso);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
}
