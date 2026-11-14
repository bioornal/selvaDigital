import type { APIRoute } from 'astro';
import { Resend } from 'resend';

interface ContactForm {
  nombre: string;
  email: string;
  mensaje: string;
  tipoProyecto: string;
  presupuesto?: string;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const projectTypeLabels: Record<string, string> = {
  landing: 'Landing Page',
  sitio: 'Sitio Web',
  ecommerce: 'Tienda Online / E-commerce',
  amedida: 'Sitio a Medida',
  sistema: 'Sistema a Medida',
  chatbot: 'Chatbot con IA',
  app: 'App a Medida',
  mantenimiento: 'Mantenimiento',
  otro: 'Otro / No estoy seguro'
};

// Simple in-memory rate limiting per serverless instance
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
  const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL;

  if (!RESEND_API_KEY || !CONTACT_EMAIL) {
    console.error('Missing RESEND_API_KEY or CONTACT_EMAIL');
    return new Response(JSON.stringify({
      message: 'Error de configuración del servidor'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({
      message: 'Demasiadas solicitudes. Esperá un minuto e intentá de nuevo.'
    }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const data = await request.json() as ContactForm;
    const { nombre, email, mensaje, tipoProyecto, presupuesto } = data;

    if (!nombre || !email || !mensaje || !tipoProyecto) {
      return new Response(JSON.stringify({
        message: 'Todos los campos son requeridos'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({
        message: 'El formato del email no es válido'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: 'Selva Digital <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${escapeHtml(nombre)}`,
      html: `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#E8F7F5" style="width: 100%; background-color: #E8F7F5; border-collapse: collapse; border-radius: 0; font-family: Arial, Helvetica, sans-serif; color: #102D35;">
          <tr>
            <td align="center" style="padding: 20px; border-radius: 0;">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid #C8D6D6; border-collapse: collapse; border-radius: 0; font-family: Arial, Helvetica, sans-serif; color: #102D35;">
                <tr>
                  <td bgcolor="#102D35" style="background-color: #102D35; padding: 24px; border-radius: 0; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: bold; color: #E8F7F5;">selva digital<span style="color: #D9FA57;">.</span></td>
                </tr>
                <tr>
                  <td style="padding: 24px; border-radius: 0; font-family: Arial, Helvetica, sans-serif; color: #102D35; line-height: 1.6;">
<h2 style="color: #102D35; margin-top: 0;">Nuevo mensaje de contacto</h2>
        <p><strong style="color: #4D6369;">Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong style="color: #4D6369;">Email:</strong> ${escapeHtml(email)}</p>
        <p><strong style="color: #4D6369;">Tipo de proyecto:</strong> ${escapeHtml(projectTypeLabels[tipoProyecto] || tipoProyecto)}</p>
        <p><strong style="color: #4D6369;">Presupuesto estimado:</strong> ${presupuesto ? escapeHtml(presupuesto) + ' USD' : 'No especificado'}</p>
        <p><strong style="color: #4D6369;">Mensaje:</strong></p>
        <p>${escapeHtml(mensaje)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({
        message: 'Error al enviar el mensaje. Intentá de nuevo.'
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      message: 'Mensaje enviado correctamente'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Endpoint error:', error);
    return new Response(JSON.stringify({
      message: 'Error al procesar la solicitud. Intentá de nuevo.'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
