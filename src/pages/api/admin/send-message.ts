import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-server';
import { messageTemplates, renderTemplate } from '../../../lib/templates';
import { requireAuth } from '../../../lib/admin-auth';

export const POST: APIRoute = async ({ request }) => {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { client_id, template_id, variables } = body;

    const template = messageTemplates.find((t) => t.id === template_id);
    if (!template) {
      return new Response(JSON.stringify({ error: 'Template not found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch client to check currency
    const { data: clientData } = await supabaseAdmin
      .from('clients')
      .select('currency')
      .eq('id', client_id)
      .single();

    let content = renderTemplate(template, variables || {});
    if (clientData?.currency === 'ARS') {
      content = content.replace(/USD/g, 'ARS');
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({
        client_id,
        template_id,
        content,
        variables: variables || {},
        status: 'enviado',
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (template.phase > 0 && template.phase < 99) {
      await supabaseAdmin
        .from('clients')
        .update({ current_phase: template.phase })
        .eq('id', client_id);

      await supabaseAdmin
        .from('project_phases')
        .update({ status: 'enviado', sent_at: new Date().toISOString() })
        .eq('client_id', client_id)
        .eq('phase_number', template.phase);
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
