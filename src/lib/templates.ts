export interface MessageTemplate {
  id: string;
  name: string;
  phase: number;
  description: string;
  variables: string[];
  content: string;
}

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
    id: 'confirmacion',
    name: 'Confirmación de proyecto y seña',
    phase: 1,
    description: 'Después del primer call, cuando el cliente está de acuerdo en avanzar.',
    variables: ['NOMBRE', 'TIPO_PROYECTO', 'MONTO_TOTAL', 'MONTO_SEÑA', 'MONTO_FINAL', 'SEMANAS'],
    content: `Buenísimo {NOMBRE}, te confirmo lo que hablamos:

✓ {TIPO_PROYECTO}
✓ Total: ARS {MONTO_TOTAL}
✓ 50% para arrancar (seña): ${'{MONTO_SEÑA}'}
✓ 50% al ver el sitio listo (contra entrega): ${'{MONTO_FINAL}'}
✓ Plazo: {SEMANAS} semanas desde que arrancamos
✓ Incluye diseño, programación y deploy
✓ Hosting + dominio se contratan a tu nombre (aprox. AR$ 9.300/mes en Hostinger, te asesoro en la elección)

La seña no se devuelve — eso me asegura que arrancamos en serio y vos te asegurás mi tiempo dedicado.

Si te queda claro, te paso los datos para el primer pago 🙌`,
  },
  {
    id: 'datos-pago',
    name: 'Datos de pago (seña inicial)',
    phase: 1,
    description: 'Cuando el cliente responde "dale" a la propuesta.',
    variables: ['NOMBRE', 'BANCO', 'CBU', 'ALIAS', 'MONTO_SEÑA'],
    content: `Perfecto {NOMBRE}, te paso los datos:

🏦 TRANSFERENCIA
Banco: {BANCO}
Titular: Christian A. Speziali
CBU: {CBU}
Alias: {ALIAS}

Monto seña (50%): ${'{MONTO_SEÑA}'}

Cuando me mandés el comprobante arrancamos esa misma semana.
Si preferís MercadoPago, decime y te mando link 👌`,
  },
  {
    id: 'arranque',
    name: 'Confirmación de pago + arranque',
    phase: 2,
    description: 'Cuando recibís el comprobante de la seña.',
    variables: ['NOMBRE'],
    content: `¡Llegó {NOMBRE}! Gracias 🙌

Arranco esta semana con el wireframe. En unos días te paso el primer pantallazo para que veas la dirección visual.

Te voy mostrando el avance por acá. Cualquier idea o cambio me la decís sin vueltas.

¡Vamos! 🚀`,
  },
  {
    id: 'primer-avance',
    name: 'Avance — primera entrega (wireframe / diseño)',
    phase: 3,
    description: 'Cuando tenés el primer mockup listo.',
    variables: ['NOMBRE'],
    content: `{NOMBRE}, te mando el primer avance 👇

[adjuntar imagen o video Loom]

Esto es la dirección visual base. Decime:
1. ¿Te cierra el estilo general?
2. ¿Algún color o estructura que cambiarías?
3. ¿Algo que falta o sobra?

Esperamos 1-2 días para tu feedback y arranco la programación.`,
  },
  {
    id: 'aprobacion-diseno',
    name: 'Aprobación de diseño + segundo pago',
    phase: 4,
    description: 'Cuando el cliente aprueba el diseño.',
    variables: ['NOMBRE', 'DIAS'],
    content: `Genial {NOMBRE}, queda confirmado el diseño ✅

Con esto arranco a programar — no hay pago intermedio, el segundo y último pago va contra entrega del sitio terminado.

En {DIAS} días tenés el demo navegable listo 💪`,
  },
  {
    id: 'demo-listo',
    name: 'Demo listo + pago final',
    phase: 5,
    description: 'Cuando el sitio está terminado en staging.',
    variables: ['NOMBRE', 'DOMINIO', 'MONTO_FINAL', 'ALIAS'],
    content: `{NOMBRE}, está listo 🎉

Te paso el link al demo (anda solo desde este link, no te preocupes si no se ve en Google todavía):

🔗 [tu-dominio.com.ar/cliente-demo]

Revisalo con calma, probá los formularios, navegá desde celular y desktop. Cualquier ajuste menor lo hacemos sin problema.

Para publicarlo en tu dominio final ({DOMINIO}), te toca el último 50%:

🏦 Monto final (50%): ${'{MONTO_FINAL}'}
Alias: {ALIAS}

Cuando me llegue, lo deployo y te paso las llaves del panel para que edites lo que necesites 🔑`,
  },
  {
    id: 'post-deploy',
    name: 'Post-deploy + capacitación',
    phase: 6,
    description: 'Después del deploy final.',
    variables: ['NOMBRE', 'DOMINIO', 'USER', 'PASS'],
    content: `{NOMBRE}, ¡todo arriba! 🚀

🔗 Tu sitio: https://{DOMINIO}
🔑 Panel admin: https://{DOMINIO}/admin
   Usuario: {USER}
   Pass: {PASS}

Esta semana coordinamos un call de 30-45 min para que te muestre cómo editar contenido, subir fotos y todo lo que necesites.

Tenés 30 días de soporte por WhatsApp incluidos.
Después seguimos en contacto igual — no desaparezco 😉

Gracias por confiar 🙏`,
  },
  {
    id: 'scope-creep',
    name: 'Fuera de alcance / scope creep',
    phase: 99,
    description: 'Cliente pide algo extra durante el proyecto.',
    variables: ['NOMBRE', 'DESCRIPCION_CAMBIO', 'COSTO_EXTRA', 'DIAS'],
    content: `{NOMBRE}, ojo con esto:

Lo que me pedís no estaba en lo que acordamos al inicio.
Se puede sumar igual, pero como es laburo extra te paso el detalle aparte:

💡 {DESCRIPCION_CAMBIO}
💰 Costo extra: ${'{COSTO_EXTRA}'}
⏱️ Días extra: {DIAS}

Si te suma, lo encaro. Si preferís dejarlo para una fase 2 más adelante, también 👌

Avisame cómo seguimos.`,
  },
  {
    id: 'cliente-desaparecido',
    name: 'Cliente desaparecido / silencio prolongado',
    phase: 99,
    description: 'Cliente no responde hace >2 semanas en medio del proyecto.',
    variables: ['NOMBRE', 'ETAPA'],
    content: `{NOMBRE}, ¿todo bien?

Hace un rato que no tengo novedades tuyas y necesito tu feedback para seguir avanzando con {ETAPA}.

Te recuerdo el acuerdo: si el proyecto se pausa más de 30 días sin avance de tu lado, la seña se consume como pago por el tiempo ya dedicado.

No quiero que llegue a eso. Avisame cómo estás y retomamos cuando puedas 👌`,
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
