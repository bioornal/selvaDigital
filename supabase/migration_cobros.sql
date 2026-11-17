-- Preparada para ejecución manual. Requiere migration_admin_users.sql.
begin;

alter table public.clients
  add column if not exists modalidad text check (modalidad in ('abono', 'unico', 'proyecto')),
  add column if not exists plan_id text,
  add column if not exists abono_alta numeric,
  add column if not exists abono_mensual numeric,
  add column if not exists abono_inicio date,
  add column if not exists permanencia_meses int,
  add column if not exists abono_ajustado_at date,
  add column if not exists entregado_at date,
  add column if not exists condiciones_aceptadas_at timestamptz,
  add column if not exists servicio_estado text not null default 'activo' check (servicio_estado in ('activo', 'baja')),
  add column if not exists baja_at date;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  tipo text not null check (tipo in ('alta', 'abono', 'anticipo', 'saldo', 'etapa', 'otro')),
  periodo date,
  monto numeric not null check (monto > 0),
  pagado_at date not null,
  medio text not null default 'transferencia' check (medio in ('transferencia', 'efectivo', 'mercadopago', 'otro')),
  nota text,
  created_at timestamptz not null default now(),
  check (tipo <> 'abono' or periodo is not null)
);

create unique index if not exists payments_abono_periodo_unico
  on public.payments (client_id, periodo) where tipo = 'abono';
create index if not exists payments_client_id_idx on public.payments (client_id);

alter table public.payments enable row level security;
drop policy if exists payments_admin_todo on public.payments;
create policy payments_admin_todo on public.payments
  for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

grant select, insert, update, delete on public.payments to authenticated, service_role;

commit;
