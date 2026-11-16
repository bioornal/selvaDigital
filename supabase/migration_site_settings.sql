-- Ajustes del sitio editables desde el panel admin.
-- Hoy: key = 'precios' → importes de las cards de Precios (ver src/lib/pricing.ts).
-- Ejecutar una vez en el SQL Editor de Supabase.

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Los precios son públicos (se muestran en la web): cualquiera los puede leer.
-- La escritura sólo pasa por /api/admin/precios con la service role key (saltea RLS).
drop policy if exists "precios_lectura_publica" on public.site_settings;
create policy "precios_lectura_publica" on public.site_settings
  for select to anon, authenticated
  using (key = 'precios');
