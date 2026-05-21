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
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Tipo de proyecto:</strong> ${escapeHtml(projectTypeLabels[tipoProyecto] || tipoProyecto)}</p>
        <p><strong>Presupuesto estimado:</strong> ${presupuesto ? escapeHtml(presupuesto) + ' ARS' : 'No especificado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(mensaje)}</p>
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
