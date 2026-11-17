// Fuente única de precios y condiciones de Selva Digital.
// Precios (Precios.astro), schema.org (Layout.astro), formulario y mensajes de WhatsApp
// leen de acá: un importe se cambia en un solo lugar. Valores en ARS.

import { whatsappLink } from './constants';
import { DIAS_AGUANTE } from './cobros';

/** Cómo se contrata: entrada baja + abono, pago único 50/50, o proyecto a medida por etapas. */
export type Modalidad = 'abono' | 'unico' | 'proyecto';

export const MODALIDADES: Record<Modalidad, { label: string; corto: string }> = {
  abono: { label: 'Entrada baja + abono', corto: 'abono mensual' },
  unico: { label: 'Pago único', corto: 'pago único' },
  proyecto: { label: 'Proyecto a medida', corto: 'proyecto a medida' },
};

export interface PlanWeb {
  id: string;
  grupo: 'web';
  nombre: string;
  sub?: string;
  destacado?: boolean;
  features: string[];
  /** Entrada baja + abono: oferta principal. */
  abono: { alta: number; mensual: number; permanenciaMeses: number };
  /** Pago único 50/50: NO se muestra en la web; referencia para cotizar por privado. */
  unico: number;
  /** Qué preguntar antes de cerrar un presupuesto (vacío = alcance cerrado). */
  preguntas?: string[];
  /** El asistente con IA ya viene incluido en el abono de este plan. */
  iaIncluidaEnAbono?: boolean;
}

export type Plan = PlanWeb;

// En la web se ofrece sólo alta + abono (decisión del dueño, 15/11/2026).
// El pago único queda como referencia interna para ofrecerlo por privado.
export const PLANES_WEB: PlanWeb[] = [
  {
    id: 'landing', grupo: 'web', nombre: 'Landing Page',
    features: ['Página única con scroll', 'Diseño propio, adaptado a celular', 'Formulario o botón de WhatsApp', 'Integración con redes sociales', 'SEO básico on-page'],
    abono: { alta: 110_000, mensual: 80_000, permanenciaMeses: 3 },
    unico: 450_000,
  },
  {
    id: 'corporativo', grupo: 'web', nombre: 'Sitio Web Corporativo', sub: '3 a 5 páginas', destacado: true,
    features: ['3 a 5 páginas personalizadas', 'Diseño propio, adaptado a celular', 'Formulario avanzado', 'Galería de imágenes', 'Mapa de ubicación', 'Animaciones suaves'],
    abono: { alta: 140_000, mensual: 95_000, permanenciaMeses: 3 },
    unico: 550_000,
  },
  {
    id: 'extendido', grupo: 'web', nombre: 'Sitio Web Extendido', sub: 'Más de 5 páginas',
    features: ['Más de 5 páginas personalizadas', 'Diseño propio único', 'Formularios avanzados', 'Galería multimedia', 'SEO completo on-page', 'Animaciones suaves'],
    abono: { alta: 180_000, mensual: 110_000, permanenciaMeses: 3 },
    unico: 650_000,
  },
  {
    id: 'ecommerce', grupo: 'web', nombre: 'Tienda E-commerce',
    features: ['Catálogo con carrito', 'Cobro con Mercado Pago', 'Panel para cargar productos y pedidos', 'Stock y promociones', 'Estadísticas de visitas'],
    abono: { alta: 250_000, mensual: 130_000, permanenciaMeses: 6 },
    unico: 1_600_000,
    iaIncluidaEnAbono: true,
    preguntas: ['Cantidad de productos', 'Medios de pago', 'Envíos', 'Manejo de stock', 'Integraciones con otros sistemas'],
  },
];

/**
 * Software a medida, presentado por problema (no por tecnología): el dueño sabe qué
 * le duele, no si necesita "un sistema" o "una app". Los casos son trabajos reales del portfolio.
 */
export const SOFTWARE = {
  nombre: 'Sistemas para tu negocio',
  intro: 'Si tu negocio funciona con planillas, papeles y mensajes sueltos, te armo un sistema propio que ordena todo. Elegí lo que más se parece a tu problema.',
  desde: 1_200_000,
  opciones: [
    {
      id: 'gestion',
      titulo: 'Ordenar la gestión',
      hoy: 'Llevás el stock, los pedidos o los clientes en planillas, cuadernos o de memoria.',
      solucion: 'Un panel propio donde cargás, buscás y controlás todo, con usuarios y permisos para tu equipo.',
      ejemplos: ['Stock y pedidos', 'Clientes y turnos', 'Caja y ventas del día'],
      caso: 'Impasto: caja del mostrador y comandas que se imprimen solas en la cocina.',
    },
    {
      id: 'app',
      titulo: 'Una app para tus clientes o tu equipo',
      hoy: 'Tus clientes piden por mensaje o tu equipo trabaja en la calle sin la información a mano.',
      solucion: 'Una app que se usa desde el celular: tus clientes piden o reservan, y tu equipo carga y consulta en el momento.',
      ejemplos: ['Pedidos y reservas', 'Repartidores y vendedores', 'Avisos al celular'],
      caso: 'Impasto: app Android de recetas y costos para la cocina.',
    },
    {
      id: 'automatizar',
      titulo: 'Automatizar lo que hacés a mano',
      hoy: 'Perdés horas copiando datos, armando reportes o repitiendo las mismas tareas.',
      solucion: 'Procesos que se hacen solos y herramientas que hoy usás por separado, conectadas entre sí.',
      ejemplos: ['Reportes que se arman solos', 'Avisos automáticos', 'Conectar tus herramientas'],
      caso: 'Megabot: un solo panel para manejar tres chatbots con IA en tiempo real.',
    },
  ],
  pasos: [
    { titulo: 'Charla sin cargo', detalle: 'Me contás el problema y vemos si se puede resolver y cómo.' },
    { titulo: 'Propuesta por escrito', detalle: 'Alcance, plazos y precio cerrado antes de empezar.' },
    { titulo: 'Desarrollo por etapas', detalle: 'Pagás cada etapa cuando la aprobás.' },
    { titulo: 'Soporte mensual', detalle: 'Opcional: servidor, mantenimiento y mejoras.' },
  ],
} as const;

export type OpcionSoftware = (typeof SOFTWARE.opciones)[number];

/** WhatsApp para software: arranca la frase para que el cliente cuente su problema. */
export const linkSoftware = (opcion?: OpcionSoftware) => whatsappLink(opcion
  ? `¡Hola Christian! Me interesa "${opcion.titulo.toLowerCase()}". En mi negocio tengo este problema: `
  : '¡Hola Christian! Quiero un sistema para mi negocio. En mi negocio tengo este problema: ');

/**
 * Extra para cualquier web: asistente con IA integrado en el sitio (no WhatsApp ni Meta).
 * Siempre tiene un costo mensual porque usa IA y servidor todos los meses.
 */
export const EXTRA_IA = {
  nombre: 'Asistente con IA en tu web',
  descripcion: 'Un chat integrado en tu web que responde con la información de tu negocio y deja las consultas listas para que cierres por WhatsApp.',
  incluye: ['Chat integrado en tu propia web', 'Responde con tus precios, horarios y políticas', 'Toma pedidos o reservas y te deja el contacto', 'Panel con todas las conversaciones'],
  abono: { alta: 60_000, mensual: 35_000 },
  unico: { instalacion: 300_000, mensual: 35_000 },
  aclaracion: 'Funciona dentro de tu web. No es un bot de WhatsApp, Instagram ni Facebook.',
} as const;

/** Condiciones de cada modalidad. Se muestran junto a los precios. */
export const CONDICIONES = {
  abono: {
    incluye: [
      'Hosting en mi servidor, certificado SSL y copias de seguridad',
      'Hasta 2 cambios chicos por mes (texto, precio, imagen, horario o contacto), con un máximo de 1 hora; no se acumulan',
      'Soporte por WhatsApp de lunes a viernes de 9 a 18, con respuesta en 48 h hábiles',
    ],
    excluye: [
      'Páginas nuevas, rediseños y funciones nuevas',
      'Integraciones y carga masiva de productos',
      'Cualquier cambio de alcance: lo cotizo aparte y arranco solo con tu aprobación',
    ],
    vencimiento: 'El abono vence cada mes el mismo día en que arrancamos (si ese día no existe en el mes, el último día). Se paga por transferencia y me mandás el comprobante.',
    aguante: `Si se pasa el vencimiento, tenés ${DIAS_AGUANTE} días de margen para pagar sin cortes. Desde el día ${DIAS_AGUANTE + 1} sin pago, el sitio se da de baja y se apaga. Para reactivarlo, pagás lo adeudado y vuelve a estar online.`,
    baja: 'Después de la permanencia mínima te das de baja cuando quieras, avisando antes de tu próximo vencimiento por WhatsApp o email. Al darte de baja el sitio se apaga, salvo que te lo quedes.',
    /** Salida del abono: comprar el sitio descontando lo ya pagado. */
    pasarAUnico: 'Si querés quedarte con el sitio, te lo vendo y te descuento todo lo que ya pagaste de abono.',
    dominio: 'El dominio se registra a tu nombre y lo pagás vos. El dominio, los textos y las imágenes son siempre tuyos.',
    ajuste: 'El abono se actualiza cada 3 meses según la inflación (IPC del INDEC) y te aviso con 30 días de anticipación.',
    noPromete: 'El abono cubre el sitio y el soporte; no garantiza ventas, posicionamiento ni cantidad de consultas.',
  },
  unico: {
    pago: '50% al iniciar y 50% contra entrega.',
    /** Versión corta para etiquetas mono (sin punto final). */
    pagoCorto: '50% al iniciar y 50% contra entrega',
    hosting: 'Hosting y dominio se contratan aparte, a tu nombre (Hostinger, alrededor de $9.300/mes). El sitio es tuyo desde el día uno.',
    mantenimiento: { mensual: 45_000, detalle: 'Hasta 1 hora de cambios chicos por mes, copias de seguridad y actualizaciones.' },
  },
  proyecto: {
    pago: 'Primero hacemos un diagnóstico y defino el alcance. El precio se cierra por escrito y se paga por etapas.',
    operacion: 'Servidor, uso de IA y soporte se cotizan aparte como abono mensual, según el uso real.',
  },
} as const;

export const formatARS = (n: number) => `$${n.toLocaleString('es-AR')}`;

/** Tranquilidad junto a los botones: escribir no compromete a nada. */
export const TRANQUILIDAD = 'Te respondo en menos de 24 h hábiles. No pagás nada hasta que acordemos el alcance por escrito.';

/** Lo que se paga como mínimo con abono: alta + meses de permanencia. */
export const totalMinimo = (plan: PlanWeb) => plan.abono.alta + plan.abono.mensual * plan.abono.permanenciaMeses;

/** Cuántos meses de abono equivalen al pago único (descontando el alta). */
export const mesesEquivalentes = (plan: PlanWeb) => Math.round((plan.unico - plan.abono.alta) / plan.abono.mensual);

/** Mensaje de WhatsApp con el plan y la modalidad que vio el visitante. */
export function mensajePlan(plan: Plan, modalidad: Exclude<Modalidad, 'proyecto'>): string {
  const detalle = modalidad === 'abono'
    ? `entrada baja + abono: ${formatARS(plan.abono.alta)} de alta y ${formatARS(plan.abono.mensual)}/mes`
    : `pago único de ${formatARS(plan.unico)}`;
  const extra = plan.preguntas?.length ? ` Te cuento sobre: ${plan.preguntas.join(', ').toLowerCase()}.` : '';
  return `¡Hola Christian! Me interesa el plan ${plan.nombre} con ${detalle}. ¿Me pasás más info?${extra}`;
}

export const linkPlan = (plan: Plan, modalidad: Exclude<Modalidad, 'proyecto'>) => whatsappLink(mensajePlan(plan, modalidad));

export const linkExtraIA = (modalidad: 'abono' | 'unico') => whatsappLink(modalidad === 'abono'
  ? `¡Hola Christian! Quiero sumar el asistente con IA a mi web, con abono (${formatARS(EXTRA_IA.abono.alta)} de alta y ${formatARS(EXTRA_IA.abono.mensual)}/mes). ¿Me contás cómo funciona?`
  : `¡Hola Christian! Quiero sumar el asistente con IA a una web con pago único (${formatARS(EXTRA_IA.unico.instalacion)} de instalación y ${formatARS(EXTRA_IA.unico.mensual)}/mes de uso). ¿Me contás cómo funciona?`);

// ─── Importes editables desde el panel (/admin/precios) ───────────────────────
// Los textos siguen viviendo en este archivo; sólo los importes se pueden pisar
// desde Supabase (tabla site_settings, key 'precios'). Los valores de arriba
// quedan como respaldo si Supabase no responde al compilar.

export interface PreciosPlan { alta: number; mensual: number; permanenciaMeses: number; unico: number }

export interface PreciosEditables {
  planes: Record<string, PreciosPlan>;
  extraIa: { alta: number; mensual: number; instalacionUnico: number; mensualUnico: number };
  softwareDesde: number;
  mantenimientoMensual: number;
}

const MAX_IMPORTE = 1_000_000_000;
const MAX_MESES = 36;

/** Importes que tiene hoy el catálogo en memoria. */
export function preciosActuales(): PreciosEditables {
  return {
    planes: Object.fromEntries(PLANES_WEB.map(p => [p.id, {
      alta: p.abono.alta, mensual: p.abono.mensual, permanenciaMeses: p.abono.permanenciaMeses, unico: p.unico,
    }])),
    extraIa: {
      alta: EXTRA_IA.abono.alta, mensual: EXTRA_IA.abono.mensual,
      instalacionUnico: EXTRA_IA.unico.instalacion, mensualUnico: EXTRA_IA.unico.mensual,
    },
    softwareDesde: SOFTWARE.desde,
    mantenimientoMensual: CONDICIONES.unico.mantenimiento.mensual,
  };
}

const esImporte = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= MAX_IMPORTE;
const esMeses = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 1 && (v as number) <= MAX_MESES;
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? v as Record<string, unknown> : {});

/** Pisa la base con los valores válidos de `parcial`; lo inválido o faltante queda como en la base. */
export function combinarPrecios(base: PreciosEditables, parcial: unknown): PreciosEditables {
  const p = obj(parcial);
  const planes = obj(p.planes);
  const ia = obj(p.extraIa);
  const imp = (v: unknown, def: number) => (esImporte(v) ? v : def);
  return {
    planes: Object.fromEntries(Object.entries(base.planes).map(([id, def]) => {
      const pl = obj(planes[id]);
      return [id, {
        alta: imp(pl.alta, def.alta),
        mensual: imp(pl.mensual, def.mensual),
        permanenciaMeses: esMeses(pl.permanenciaMeses) ? pl.permanenciaMeses : def.permanenciaMeses,
        unico: imp(pl.unico, def.unico),
      }];
    })),
    extraIa: {
      alta: imp(ia.alta, base.extraIa.alta),
      mensual: imp(ia.mensual, base.extraIa.mensual),
      instalacionUnico: imp(ia.instalacionUnico, base.extraIa.instalacionUnico),
      mensualUnico: imp(ia.mensualUnico, base.extraIa.mensualUnico),
    },
    softwareDesde: imp(p.softwareDesde, base.softwareDesde),
    mantenimientoMensual: imp(p.mantenimientoMensual, base.mantenimientoMensual),
  };
}

/** Validación estricta para guardar: devuelve el primer error en castellano. */
export function validarPrecios(input: unknown): { ok: true; precios: PreciosEditables } | { ok: false; error: string } {
  const base = preciosActuales();
  const p = obj(input);
  const planes = obj(p.planes);
  const ia = obj(p.extraIa);
  const fuera = (v: unknown) => !esImporte(v);
  for (const plan of PLANES_WEB) {
    const pl = obj(planes[plan.id]);
    for (const campo of ['alta', 'mensual', 'unico'] as const) {
      if (fuera(pl[campo])) return { ok: false, error: `${plan.nombre}: el importe "${campo}" tiene que ser un número entero entre 0 y ${MAX_IMPORTE.toLocaleString('es-AR')}.` };
    }
    if (!esMeses(pl.permanenciaMeses)) return { ok: false, error: `${plan.nombre}: la permanencia tiene que ser entre 1 y ${MAX_MESES} meses.` };
  }
  for (const campo of ['alta', 'mensual', 'instalacionUnico', 'mensualUnico'] as const) {
    if (fuera(ia[campo])) return { ok: false, error: `Asistente con IA: el importe "${campo}" no es válido.` };
  }
  if (fuera(p.softwareDesde)) return { ok: false, error: 'Sistemas: el precio "desde" no es válido.' };
  if (fuera(p.mantenimientoMensual)) return { ok: false, error: 'Mantenimiento: el importe no es válido.' };
  return { ok: true, precios: combinarPrecios(base, input) };
}

/**
 * Aplica los importes al catálogo en memoria. Sólo se usa al renderizar la home
 * (ver pricing-remoto.ts): después de esto, Precios, FAQ y el schema leen los valores nuevos.
 */
export function aplicarPrecios(precios: PreciosEditables): void {
  for (const plan of PLANES_WEB) {
    const pl = precios.planes[plan.id];
    if (!pl) continue;
    plan.abono.alta = pl.alta;
    plan.abono.mensual = pl.mensual;
    plan.abono.permanenciaMeses = pl.permanenciaMeses;
    plan.unico = pl.unico;
  }
  const ia = EXTRA_IA as unknown as { abono: { alta: number; mensual: number }; unico: { instalacion: number; mensual: number } };
  ia.abono.alta = precios.extraIa.alta;
  ia.abono.mensual = precios.extraIa.mensual;
  ia.unico.instalacion = precios.extraIa.instalacionUnico;
  ia.unico.mensual = precios.extraIa.mensualUnico;
  (SOFTWARE as unknown as { desde: number }).desde = precios.softwareDesde;
  (CONDICIONES.unico.mantenimiento as unknown as { mensual: number }).mensual = precios.mantenimientoMensual;
}
