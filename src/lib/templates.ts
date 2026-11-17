// Plantillas de WhatsApp para el panel. Las variables {ASI} se completan con
// variablesCliente() de mensajes-cobro.ts (o a mano desde la ficha del cliente).
// Montos y textos de condiciones NO se escriben acá: llegan como variables desde pricing.ts.

export interface MessageTemplate {
  id: string;
  name: string;
  phase: number;
  description: string;
  variables: string[];
  content: string;
}

/** phase 99 = se usa en cualquier momento (cobros, imprevistos). */
export const messageTemplates: MessageTemplate[] = [
  {
    id: 'disponibilidad',
    name: 'Disponibilidad / Cupos',
    phase: 0,
    description: 'Cliente nuevo pregunta por disponibilidad.',
    variables: ['NOMBRE', 'MES'],
    content: `¡Hola {NOMBRE}! Gracias por escribirme 🙌

Te cuento: trabajo solo y no tomo más de 3 proyectos en simultáneo para garantizar atención real.

Actualmente tengo 1 cupo libre para arrancar en {MES}.

Si te interesa avanzar, contame:
1. ¿Qué tipo de proyecto tenés en mente?
2. ¿Tu negocio ya está funcionando o estás arrancando?
3. ¿Plazo aproximado en el que necesitás tenerlo?

Con eso te paso una propuesta clara en menos de 24hs.`,
  },
  {
    id: 'cierre-abono',
    name: 'Cierre: web con alta + abono',
    phase: 1,
    description: 'Cuando el cliente quiere avanzar con abono mensual. Pide que responda "Acepto".',
    variables: ['NOMBRE', 'PLAN', 'ALTA', 'MENSUAL', 'DIA_VENCIMIENTO', 'PERMANENCIA', 'DIAS_AGUANTE', 'LINK_CONDICIONES'],
    content: `Buenísimo {NOMBRE}, te confirmo lo que hablamos para tu web:

✓ Plan: {PLAN}
✓ Alta (una sola vez): {ALTA}
✓ Abono mensual: {MENSUAL}
✓ El abono vence {DIA_VENCIMIENTO}
✓ Permanencia mínima: {PERMANENCIA}. Después te das de baja cuando quieras
✓ Hosting, SSL, copias de seguridad y 2 cambios chicos por mes incluidos
✓ El dominio va a tu nombre

Si algún mes se pasa el vencimiento, tenés {DIAS_AGUANTE} días de margen. Pasados esos días sin el pago, el sitio se da de baja.

Todas las condiciones, explicadas simple:
{LINK_CONDICIONES}

Si estás de acuerdo, respondeme "Acepto" y te paso los datos para el alta 🙌`,
  },
  {
    id: 'cierre-unico',
    name: 'Cierre: pago único 50/50',
    phase: 1,
    description: 'Cuando el cliente elige pago único. Pide que responda "Acepto".',
    variables: ['NOMBRE', 'PLAN', 'TOTAL', 'ANTICIPO', 'SALDO', 'SEMANAS', 'HOSTING', 'LINK_CONDICIONES'],
    content: `Buenísimo {NOMBRE}, te confirmo lo que hablamos:

✓ {PLAN}
✓ Total: {TOTAL}, pago único
✓ 50% para arrancar: {ANTICIPO}
✓ 50% contra entrega, con el sitio terminado: {SALDO}
✓ Plazo: {SEMANAS} semanas desde que arrancamos
✓ {HOSTING}

El anticipo no se devuelve: es lo que me asegura el tiempo para tu proyecto.

Las condiciones completas están acá:
{LINK_CONDICIONES}

Si estás de acuerdo, respondeme "Acepto" y te paso los datos para el primer pago 🙌`,
  },
  {
    id: 'datos-pago',
    name: 'Datos de pago',
    phase: 1,
    description: 'Datos para transferir: alta, abono del mes, anticipo o saldo. Completá CONCEPTO y MONTO.',
    variables: ['NOMBRE', 'BANCO', 'CBU', 'ALIAS', 'CONCEPTO', 'MONTO'],
    content: `Perfecto {NOMBRE}, te paso los datos:

🏦 TRANSFERENCIA
Banco: {BANCO}
Titular: Christian A. Speziali
CBU: {CBU}
Alias: {ALIAS}

{CONCEPTO}: {MONTO}

Cuando me mandes el comprobante lo registro y te confirmo 👌`,
  },
  {
    id: 'arranque',
    name: 'Confirmación de pago + arranque',
    phase: 2,
    description: 'Cuando recibís el comprobante del alta o del anticipo.',
    variables: ['NOMBRE'],
    content: `¡Llegó {NOMBRE}! Gracias 🙌

Arranco esta semana con el diseño. En unos días te paso el primer pantallazo para que veas la dirección visual.

Te voy mostrando el avance por acá. Cualquier idea o cambio me la decís sin vueltas.

¡Vamos! 🚀`,
  },
  {
    id: 'primer-avance',
    name: 'Avance — primera entrega (diseño)',
    phase: 3,
    description: 'Cuando tenés el primer diseño listo.',
    variables: ['NOMBRE'],
    content: `{NOMBRE}, te mando el primer avance 👇

[adjuntar imagen o video]

Esto es la dirección visual base. Decime:
1. ¿Te cierra el estilo general?
2. ¿Algún color o estructura que cambiarías?
3. ¿Algo que falta o sobra?

Espero 1-2 días tu respuesta y sigo con la programación.`,
  },
  {
    id: 'aprobacion-diseno',
    name: 'Aprobación de diseño',
    phase: 4,
    description: 'Cuando el cliente aprueba el diseño.',
    variables: ['NOMBRE', 'DIAS'],
    content: `Genial {NOMBRE}, queda confirmado el diseño ✅

Con esto arranco a programar. En {DIAS} días tenés la versión navegable para revisar 💪`,
  },
  {
    id: 'demo-listo',
    name: 'Versión lista para revisar',
    phase: 5,
    description: 'Cuando el sitio está terminado y falta el OK del cliente. En pago único, después mandá "Datos de pago" con el saldo.',
    variables: ['NOMBRE', 'LINK_DEMO'],
    content: `{NOMBRE}, está listo 🎉

Te paso el link para que lo revises (todavía no aparece en Google, es normal):

🔗 {LINK_DEMO}

Revisalo con calma: probá los formularios y miralo desde el celular y la compu. Los ajustes chicos los hacemos sin problema.

Cuando me des el OK, lo publico en tu dominio 🙌`,
  },
  {
    id: 'sitio-entregado',
    name: 'Sitio entregado (abono)',
    phase: 6,
    description: 'Cuando la web queda publicada para un cliente con abono.',
    variables: ['NOMBRE', 'DOMINIO', 'INCLUYE', 'DIA_VENCIMIENTO'],
    content: `¡{NOMBRE}, tu web ya está online! 🚀

🔗 https://{DOMINIO}

Tu abono incluye:
{INCLUYE}

El abono vence {DIA_VENCIMIENTO}. Para pedir un cambio, escribime por acá con lo que querés modificar.

Gracias por confiar 🙏`,
  },
  {
    id: 'post-deploy',
    name: 'Sitio entregado (pago único) + capacitación',
    phase: 6,
    description: 'Después de publicar un sitio de pago único.',
    variables: ['NOMBRE', 'DOMINIO', 'USER', 'PASS'],
    content: `{NOMBRE}, ¡todo arriba! 🚀

🔗 Tu sitio: https://{DOMINIO}
🔑 Panel admin: https://{DOMINIO}/admin
   Usuario: {USER}
   Contraseña: {PASS}

Esta semana coordinamos una llamada de 30-45 min para mostrarte cómo editar contenido, subir fotos y todo lo que necesites.

Tenés 30 días de soporte por WhatsApp incluidos.
Después seguimos en contacto igual, no desaparezco 😉

Gracias por confiar 🙏`,
  },
  {
    id: 'recordatorio-vencimiento',
    name: 'Cobro: recordatorio de vencimiento',
    phase: 99,
    description: 'El abono vence hoy o en los próximos días.',
    variables: ['NOMBRE', 'CUANDO', 'FECHA_VENCIMIENTO', 'MONTO', 'ALIAS'],
    content: `¡Hola {NOMBRE}! Te recuerdo que el abono de tu web vence {CUANDO} ({FECHA_VENCIMIENTO}): {MONTO}.

Alias para transferir: {ALIAS}

Cuando transfieras, mandame el comprobante por acá y listo. ¡Gracias! 🙌`,
  },
  {
    id: 'aviso-aguante',
    name: 'Cobro: venció, dentro del margen',
    phase: 99,
    description: 'Venció el abono y corren los días de margen.',
    variables: ['NOMBRE', 'FECHA_VENCIMIENTO', 'MONTO', 'MESES_ADEUDADOS', 'FECHA_LIMITE'],
    content: `Hola {NOMBRE}, ¿cómo va? El abono de tu web venció el {FECHA_VENCIMIENTO} y todavía no me figura el pago: {MONTO}{MESES_ADEUDADOS}.

Tenés tiempo hasta el {FECHA_LIMITE} para regularizarlo y que el sitio siga online sin cortes.

Si ya transferiste, mandame el comprobante y lo registro. Si estás con algún problema, avisame y lo vemos 👌`,
  },
  {
    id: 'aviso-baja',
    name: 'Cobro: baja por falta de pago',
    phase: 99,
    description: 'Pasaron los días de margen sin pago. Mandalo antes de apagar el sitio.',
    variables: ['NOMBRE', 'FECHA_VENCIMIENTO', 'DIAS_AGUANTE', 'MONTO', 'MESES_ADEUDADOS', 'LINK_CONDICIONES'],
    content: `Hola {NOMBRE}. El abono de tu web venció el {FECHA_VENCIMIENTO} y pasaron los {DIAS_AGUANTE} días de margen sin el pago: {MONTO}{MESES_ADEUDADOS}.

Como figura en las condiciones, voy a dar de baja el sitio:
{LINK_CONDICIONES}

Si querés seguir, transferime lo adeudado y lo vuelvo a activar. Tu dominio, tus textos y tus imágenes siguen siendo tuyos. Cualquier cosa, escribime 🙏`,
  },
  {
    id: 'scope-creep',
    name: 'Fuera de alcance',
    phase: 99,
    description: 'El cliente pide algo que no estaba acordado.',
    variables: ['NOMBRE', 'DESCRIPCION_CAMBIO', 'COSTO_EXTRA', 'DIAS'],
    content: `{NOMBRE}, ojo con esto:

Lo que me pedís no estaba en lo que acordamos al inicio.
Se puede sumar igual, pero como es trabajo extra te paso el detalle aparte:

💡 {DESCRIPCION_CAMBIO}
💰 Costo extra: {COSTO_EXTRA}
⏱️ Días extra: {DIAS}

Si te suma, lo encaro. Si preferís dejarlo para más adelante, también 👌

Avisame cómo seguimos.`,
  },
  {
    id: 'cliente-desaparecido',
    name: 'Cliente sin responder',
    phase: 99,
    description: 'El cliente no responde hace más de 2 semanas en medio del proyecto.',
    variables: ['NOMBRE', 'ETAPA'],
    content: `{NOMBRE}, ¿todo bien?

Hace un rato que no tengo novedades tuyas y necesito tu respuesta para seguir con {ETAPA}.

Te recuerdo lo que acordamos: si el proyecto queda frenado más de 30 días sin respuesta de tu lado, el pago inicial queda como pago por el tiempo ya dedicado.

No quiero que llegue a eso. Avisame cómo estás y retomamos cuando puedas 👌`,
  },
  {
    id: 'explicacion-eslogan',
    name: 'Explicación del eslogan (Vende 24/7)',
    phase: 0,
    description: 'Explicar por qué una web vende 24/7 y responde (ideal prospectos con dudas).',
    variables: ['NOMBRE', 'TIPO_PROYECTO'],
    content: `¡Hola {NOMBRE}! Qué buena pregunta me hacés. A primera vista suena a frase de marketing, pero te lo explico sin vueltas porque es clave para tu {TIPO_PROYECTO}:

1. "Vende 24/7": No significa que vas a estar cobrando de noche (a menos que hagamos tienda online). Significa captar clientes mientras dormís: la web recibe al prospecto, saca sus dudas y te deja el contacto listo en WhatsApp. Vos cerrás de día, pero la web hizo el laburo de no perder la consulta a las 2 AM.

2. "Te responde": Según lo que necesite tu negocio, sumamos un asistente con IA dentro de tu web que atiende al instante, o una agenda de turnos online.

El beneficio: El cliente de hoy quiere respuesta ya. Si te escriben tarde y no contestás hasta el otro día, se van con la competencia. Con esto, reciben respuesta al toque y quedan fidelizados.

¿Cómo lo ves? ¿Tenés muchas consultas que te entran fuera de horario? 🙌`,
  },
];

export function getTemplateById(id: string): MessageTemplate | undefined {
  return messageTemplates.find((t) => t.id === id);
}

export function getTemplatesByPhase(phase: number): MessageTemplate[] {
  return messageTemplates.filter((t) => t.phase === phase);
}

export function renderTemplate(template: MessageTemplate, variables: Record<string, string>): string {
  let rendered = template.content;
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.replace(new RegExp(`\\{${key}\\}`, 'g'), value || '');
  }
  return rendered;
}
