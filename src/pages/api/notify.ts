import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  const WEBHOOK_URL = import.meta.env.NOTIFICATION_WEBHOOK_URL || process.env.NOTIFICATION_WEBHOOK_URL;
  const EMAIL_TO = import.meta.env.NOTIFICATION_EMAIL_TO || process.env.NOTIFICATION_EMAIL_TO || import.meta.env.CONTACT_EMAIL || process.env.CONTACT_EMAIL;
  const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const body = await request.json();
    const { projectId, projectName, accessCode, serviceType } = body;

    if (!projectName || !accessCode || !projectId) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const results: { webhook?: boolean; email?: boolean; statusUpdated?: boolean } = {};
    const origin = request.headers.get('origin') || '';

    // 0. Update Client Status to 'deploy' securely on the server
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
          auth: { persistSession: false }
        });
        const { error: updateError } = await supabaseAdmin
          .from('clients')
          .update({ status: 'deploy' })
          .eq('id', projectId);

        results.statusUpdated = !updateError;
        if (updateError) {
          console.error('Error updating status in DB:', updateError);
        }
      } catch (err) {
        console.error('Error updating status on server:', err);
        results.statusUpdated = false;
      }
    }

    // 1. Send Webhook Notification
    if (WEBHOOK_URL) {
      const message = `🔔 **[SelvaUploader] Carga de Cliente Finalizada**\n\n` +
                      `• **Cliente/Empresa:** ${projectName}\n` +
                      `• **Código de Acceso:** \`${accessCode}\`\n` +
                      `• **Servicio Contratado:** ${serviceType}\n` +
                      `• **Estatus del Portal:** Completado / Listo para Deploy\n\n` +
                      `Accede a tu panel para descargar los activos y ver los detalles.`;

      try {
        const res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: message,       // Slack / Mattermost format
            content: message     // Discord format
          })
        });
        results.webhook = res.ok;
      } catch (err) {
        console.error('Error sending webhook:', err);
        results.webhook = false;
      }
    }

    // 2. Send Email Notification via Resend SDK
    if (RESEND_API_KEY && EMAIL_TO) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const { error: sendError } = await resend.emails.send({
          from: 'SelvaUploader <onboarding@resend.dev>',
          to: EMAIL_TO,
          subject: `🔔 ¡Carga Finalizada! Cliente: ${projectName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
              <h2 style="color: #4f46e5; margin-top: 0;">¡Nueva carga completada!</h2>
              <p>El cliente <strong>${projectName}</strong> ha finalizado el proceso de carga de activos e información en su portal.</p>
              <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: bold; width: 150px;">Cliente:</td>
                  <td style="padding: 6px 0; color: #1e293b;">${projectName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Código de Acceso:</td>
                  <td style="padding: 6px 0; color: #1e293b; font-family: monospace;">${accessCode}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Servicio:</td>
                  <td style="padding: 6px 0; color: #1e293b; text-transform: capitalize;">${serviceType}</td>
                </tr>
              </table>
              <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
              <p style="margin-bottom: 0; text-align: center;">
                <a href="${origin}/admin" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.15);">
                  Ir al Panel de Administración
                </a>
              </p>
            </div>
          `
        });
        results.email = !sendError;
      } catch (err) {
        console.error('Error sending email via Resend SDK:', err);
        results.email = false;
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Notification API Error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message || 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
