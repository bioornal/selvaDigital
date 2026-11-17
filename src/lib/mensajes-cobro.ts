// Arma los mensajes de WhatsApp del panel a partir del cliente y su estado de cobro.
// Los textos viven en templates.ts; los montos y condiciones, en pricing.ts.

import { CONDICIONES, PLANES_WEB, formatARS } from './pricing';
import { CONDICIONES_URL } from './constants';
import { DIAS_AGUANTE, fechaCorta, sumarDias, type ClienteCobro, type EstadoCobro } from './cobros';
import { getTemplateById, renderTemplate } from './templates';

export interface ClienteMensaje extends ClienteCobro {
  name: string;
  phone: string;
  plan_id: string | null;
  abono_alta: number | null;
  total_amount?: number | null;
  weeks?: number | null;
  domain?: string | null;
  project_type?: string | null;
  bank?: string | null;
  cbu?: string | null;
  alias?: string | null;
}

export type PlantillaCobro = 'recordatorio-vencimiento' | 'aviso-aguante' | 'aviso-baja';

const primerNombre = (nombre: string) => nombre.trim().split(/\s+/)[0] || nombre;
const ars = (n: number | null | undefined) => (typeof n === 'number' && Number.isFinite(n) ? formatARS(n) : '');

/** Qué plantilla corresponde al estado; null si no hay que recordar nada. */
export function plantillaParaEstado(e: EstadoCobro): PlantillaCobro | null {
  switch (e.tipo) {
    case 'vence_pronto': return 'recordatorio-vencimiento';
    case 'en_aguante': return 'aviso-aguante';
    case 'para_baja': return 'aviso-baja';
    default: return null;
  }
}

function diaVencimiento(inicio: string | null): string {
  if (!inicio) return 'cada mes, el mismo día en que arrancamos';
  const dia = Number(inicio.slice(8, 10));
  return dia > 28
    ? `el ${dia} de cada mes (o el último día, en los meses más cortos)`
    : `el ${dia} de cada mes`;
}

/** Todas las variables que las plantillas pueden pedir, completadas con lo que se sepa del cliente. */
export function variablesCliente(c: ClienteMensaje, e?: EstadoCobro): Record<string, string> {
  const plan = PLANES_WEB.find((p) => p.id === c.plan_id);
  const total = c.total_amount ?? (c.modalidad === 'unico' ? plan?.unico ?? null : null);
  const anticipo = total != null ? Math.round(total / 2) : null;
  const vars: Record<string, string> = {
    NOMBRE: primerNombre(c.name),
    TIPO_PROYECTO: c.project_type ?? plan?.nombre ?? '',
    PLAN: plan ? `${plan.nombre}${plan.sub ? ` (${plan.sub})` : ''}` : '',
    ALTA: ars(c.abono_alta),
    MENSUAL: ars(c.abono_mensual),
    PERMANENCIA: c.permanencia_meses ? `${c.permanencia_meses} meses` : '',
    DIA_VENCIMIENTO: diaVencimiento(c.abono_inicio),
    DIAS_AGUANTE: String(DIAS_AGUANTE),
    LINK_CONDICIONES: CONDICIONES_URL,
    TOTAL: ars(total),
    ANTICIPO: ars(anticipo),
    SALDO: total != null && anticipo != null ? ars(total - anticipo) : '',
    SEMANAS: c.weeks ? String(c.weeks) : '',
    HOSTING: CONDICIONES.unico.hosting,
    INCLUYE: CONDICIONES.abono.incluye.map((linea) => `• ${linea}`).join('\n'),
    DOMINIO: c.domain ?? '',
    BANCO: c.bank ?? '',
    CBU: c.cbu ?? '',
    ALIAS: c.alias ?? '',
  };

  if (!e) return vars;
  if (e.tipo === 'vence_pronto' || e.tipo === 'al_dia') {
    vars.FECHA_VENCIMIENTO = fechaCorta(e.proximo);
    vars.CUANDO = e.dias === 0 ? 'hoy' : e.dias === 1 ? 'mañana' : `en ${e.dias} días`;
    vars.MONTO = ars(c.abono_mensual);
  } else if (e.tipo === 'en_aguante' || e.tipo === 'para_baja') {
    vars.FECHA_VENCIMIENTO = fechaCorta(e.vencido);
    vars.FECHA_LIMITE = fechaCorta(sumarDias(e.vencido, DIAS_AGUANTE));
    vars.MONTO = ars(e.adeudado);
    vars.MESES_ADEUDADOS = e.mesesAdeudados > 1 ? ` (${e.mesesAdeudados} meses)` : '';
  }
  return vars;
}

/** Texto listo para mandar según el estado de cobro; null si no corresponde mensaje. */
export function mensajeCobro(c: ClienteMensaje, e: EstadoCobro): string | null {
  const id = plantillaParaEstado(e);
  const plantilla = id ? getTemplateById(id) : undefined;
  return plantilla ? renderTemplate(plantilla, variablesCliente(c, e)) : null;
}

/** Normaliza un celular argentino al formato de wa.me (549 + área + número). */
export function telefonoWhatsApp(phone: string): string {
  let d = phone.replace(/\D/g, '');
  if (d.startsWith('0')) d = d.slice(1);
  if (d.length === 10) return `549${d}`;
  if (d.length === 12 && d.startsWith('54') && !d.startsWith('549')) return `549${d.slice(2)}`;
  return d;
}

export function linkWhatsAppCliente(phone: string, texto: string): string {
  return `https://wa.me/${telefonoWhatsApp(phone)}?text=${encodeURIComponent(texto)}`;
}
