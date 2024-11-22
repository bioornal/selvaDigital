import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Interfaces para tipar los datos
interface ContactForm {
  nombre: string;
  email: string;
  mensaje: string;
  hcaptchaToken: string;
}

interface ResendError {
  name: string;
  statusCode: number;
  message: string;
}

// Función para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json() as ContactForm;
    const { nombre, email, mensaje } = data;

    // Log para debugging
    console.log('Datos recibidos:', { nombre, email, mensaje });

    // Validación básica
    if (!nombre || !email || !mensaje) {
      return new Response(JSON.stringify({
        message: 'Todos los campos son requeridos'
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Validación del email
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({
        message: 'El formato del email no es válido'
      }), { status: 400 });
    }

    try {
      const { data: emailResponse, error } = await resend.emails.send({
        from: 'Selva Digital <onboarding@resend.dev>',
        to: import.meta.env.CONTACT_EMAIL,
        replyTo: email,
        subject: `Nuevo mensaje de contacto de ${nombre}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${mensaje}</p>
        `
      });


      if (error) {
        throw error;
      }

      return new Response(JSON.stringify({
        message: 'Mensaje enviado correctamente'
      }), { status: 200 });

    } catch (error) {
      console.error('Error al enviar email:', error);
      throw error;
    }

  } catch (error) {
    console.error('Error en el endpoint:', error);
    return new Response(JSON.stringify({
      message: 'Error al procesar la solicitud',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), { status: 500 });
  }
};