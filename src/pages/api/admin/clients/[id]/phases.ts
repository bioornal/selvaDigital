import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../../lib/supabase-server';
import { requireAuth } from '../../../../../lib/admin-auth';

export const GET: APIRoute = async ({ params, request }) => {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { id } = params;
  const { data, error } = await supabaseAdmin
    .from('project_phases')
    .select('*')
    .eq('client_id', id)
    .order('phase_number', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, params }) => {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { id } = params;
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('project_phases')
      .insert({ ...body, client_id: id })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
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
