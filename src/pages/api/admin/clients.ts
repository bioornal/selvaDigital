import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-server';
import { requireAuth } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ request }) => {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { data, error } = await supabaseAdmin
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('SUPABASE GET ERROR:', error);
    return new Response(JSON.stringify({ error: error.message, code: error.code, hint: error.hint }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data || []), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    console.log('POST BODY:', body);
    
    if (!body.access_code) {
      body.access_code = 'SELVA-' + Math.floor(1000 + Math.random() * 9000).toString();
    }

    const { data, error } = await supabaseAdmin.from('clients').insert(body).select().single();

    if (error) {
      console.log('SUPABASE POST ERROR:', error);
      return new Response(JSON.stringify({ error: error.message, code: error.code, hint: error.hint }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.log('CATCH ERROR:', err);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
