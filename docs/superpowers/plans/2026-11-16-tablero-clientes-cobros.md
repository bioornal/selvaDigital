# Tablero de clientes y cobros — plan de implementación

> **Para agentes:** ejecutar tarea por tarea. Pasos con casillas (`- [ ]`). Spec: `docs/superpowers/specs/2026-11-16-tablero-clientes-cobros-design.md`.

**Objetivo:** sumar al panel `/admin` el seguimiento de abonos mensuales (vencimientos, aguante, baja), los datos de servicio de cada cliente, una página pública `/condiciones` y plantillas de WhatsApp alineadas al modelo actual.

**Arquitectura:** el cálculo de estados es una librería pura (`src/lib/cobros.ts`) que usan la API y la interfaz. Los pagos viven en una tabla nueva `payments` en Supabase, accesible sólo por la API del servidor (service role). La interfaz son componentes React del panel existente; los mensajes se arman con `src/lib/templates.ts`.

**Stack:** Astro 4 (`output: 'server'`), React 18 + TS, Tailwind + tokens de `global.css`, Supabase (`@supabase/supabase-js`), Node 24 (corre `.ts` sin compilar, para `node --test`).

## Restricciones globales

- Todo el texto en español rioplatense, primera persona singular, sin jerga.
- Montos en ARS, formateados con `formatARS` de `src/lib/pricing.ts`. No escribir importes en componentes.
- Fechas como texto `YYYY-MM-DD`; «hoy» se calcula en `America/Argentina/Buenos_Aires` con `hoyAR()`.
- Vencimiento: mismo día del mes que `abono_inicio`, ajustado a fin de mes; aguante `DIAS_AGUANTE = 10`; aviso previo `DIAS_AVISO_PREVIO = 3`.
- Toda escritura del panel pasa por `/api/admin/*` con `requireAuth` y lista blanca de campos. Nada de escrituras directas desde el navegador.
- Panel: estilo «modo operar» actual (fondo `var(--petrol)`, `var(--ice)`, botones `btn` rectos, lima sólo para la acción principal con texto petróleo). Usable a 390 px.
- No agregar dependencias. No commitear ni pushear (regla del proyecto). No aplicar migraciones en Supabase sin el visto bueno del dueño.
- Verificar con `npm run build` (el `EPERM ... symlink` final en Windows es conocido y no cuenta como error).

## Reparto

| Tarea | Quién | Depende de |
|---|---|---|
| 1. `cobros.ts` + pruebas | Claude | — |
| 2. Migración + API + auth admin | Codex | 1 |
| 3. Condiciones, plantillas y mensajes | Claude | 1 |
| 4. Pantallas del panel | Codex | 1, 2, 3 |
| 5. Revisión, migración aplicada, Playwright | Claude | 4 |

Tareas 2 y 3 corren en paralelo (no tocan los mismos archivos).

---

### Tarea 1: cálculo de vencimientos (`src/lib/cobros.ts`)

**Archivos:**
- Crear: `src/lib/cobros.ts`
- Crear: `src/lib/cobros.test.ts`

**Interfaces producidas** (las usan las tareas 2, 3 y 4):

```ts
export type Modalidad = 'abono' | 'unico' | 'proyecto';
export type ServicioEstado = 'activo' | 'baja';
export const DIAS_AGUANTE = 10;
export const DIAS_AVISO_PREVIO = 3;
export function hoyAR(now?: Date): string;
export function sumarMeses(iso: string, meses: number): string;
export function diasEntre(desde: string, hasta: string): number;
export function vencimientos(inicio: string, hasta: string): string[];
export interface ClienteCobro {
  modalidad: Modalidad | null;
  abono_inicio: string | null;
  abono_mensual: number | null;
  permanencia_meses: number | null;
  abono_ajustado_at: string | null;
  servicio_estado: ServicioEstado;
}
export interface PagoCobro { tipo: string; periodo: string | null; monto: number }
export type EstadoCobro =
  | { tipo: 'no_aplica' }
  | { tipo: 'al_dia'; proximo: string; dias: number }
  | { tipo: 'vence_pronto'; proximo: string; dias: number }
  | { tipo: 'en_aguante'; vencido: string; dia: number; mesesAdeudados: number; adeudado: number }
  | { tipo: 'para_baja'; vencido: string; diasAtraso: number; mesesAdeudados: number; adeudado: number };
export function estadoCobro(c: ClienteCobro, pagos: PagoCobro[], hoy: string): EstadoCobro;
export function primerPeriodoImpago(c: ClienteCobro, pagos: PagoCobro[]): string | null;
export function finPermanencia(c: ClienteCobro): string | null;
export function tocaAjusteIPC(c: ClienteCobro, hoy: string): boolean;
export function etiquetaEstado(e: EstadoCobro): string;
```

- [ ] **Paso 1: escribir las pruebas** en `src/lib/cobros.test.ts` (importan `./cobros.ts` con extensión para que Node las corra directo):
  - `sumarMeses('2026-01-31', 1) === '2026-02-28'`, `sumarMeses('2028-01-31', 1) === '2028-02-29'`, `sumarMeses('2026-01-31', 2) === '2026-03-31'`, `sumarMeses('2026-11-16', 2) === '2027-01-16'`.
  - `vencimientos('2026-01-31', '2026-05-01')` → `['2026-02-28','2026-03-31','2026-04-30']`.
  - `diasEntre('2026-02-28','2026-03-10') === 10`.
  - `hoyAR(new Date('2026-11-17T01:30:00Z')) === '2026-11-16'` (22:30 en Argentina).
  - Estado (cliente base: abono, inicio `2026-08-15`, mensual 80000, permanencia 3, activo):
    - modalidad `unico` → `no_aplica`; `servicio_estado: 'baja'` → `no_aplica`.
    - hoy `2026-09-01`, sin pagos → `al_dia`, próximo `2026-09-15`, 14 días.
    - hoy `2026-09-13` → `vence_pronto`, 2 días; hoy `2026-09-15` → `vence_pronto`, 0 días.
    - hoy `2026-09-16` → `en_aguante`, día 1; hoy `2026-09-25` → `en_aguante`, día 10, 1 mes, 80000.
    - hoy `2026-09-26` → `para_baja`, 11 días de atraso.
    - hoy `2026-10-20`, sin pagos → `para_baja`, 2 meses, 160000.
    - pagos de `2026-09-15` y `2026-10-15` (adelantado), hoy `2026-09-20` → `al_dia`, próximo `2026-11-15`.
    - pago tipo `alta` no cuenta como abono.
  - `primerPeriodoImpago` con pago de `2026-09-15` → `'2026-10-15'`; sin `abono_inicio` → `null`.
  - `finPermanencia` → `'2026-11-15'`.
  - `tocaAjusteIPC`: hoy `2026-11-14` → false, `2026-11-15` → true; con `abono_ajustado_at: '2026-11-15'` y hoy `2026-12-01` → false.
  - `etiquetaEstado`: `en_aguante` día 4 → `'En aguante · día 4 de 10'`; `vence_pronto` 0 → `'Vence hoy'`; 2 → `'Vence en 2 días'`; 1 → `'Vence mañana'`; `para_baja` → `'Para dar de baja'`; `al_dia` → `'Al día'`; `no_aplica` → `'—'`.

- [ ] **Paso 2: correr y ver que fallan:** `node --test src/lib/cobros.test.ts` → falla porque `cobros.ts` no existe.

- [ ] **Paso 3: implementar** `src/lib/cobros.ts`. Fechas en UTC puro sobre `Date.UTC` (sin horario local). `sumarMeses` calcula siempre desde la fecha base: `dia = min(diaOriginal, díasDelMesDestino)`. `vencimientos(inicio, hasta)` = `sumarMeses(inicio, k)` para k = 1, 2, … mientras `<= hasta` (tope 600). `estadoCobro`:
  1. `no_aplica` si `modalidad !== 'abono'`, sin `abono_inicio` o `servicio_estado === 'baja'`.
  2. Pagados = set de `periodo` de pagos con `tipo === 'abono'`.
  3. Vencidos impagos = `vencimientos(inicio, ayer)` sin pagar. Si hay: `atraso = diasEntre(vencidos[0], hoy)`; `<= DIAS_AGUANTE` → `en_aguante` (`dia = atraso`), si no `para_baja`. `adeudado = vencidos.length * (abono_mensual ?? 0)`.
  4. Si no: próximo = primer `sumarMeses(inicio, k)` `>= hoy` no pagado; `dias = diasEntre(hoy, proximo)`; `<= DIAS_AVISO_PREVIO` → `vence_pronto`, si no `al_dia`.
  `primerPeriodoImpago` = primer `sumarMeses(inicio, k)`, k ≥ 1, sin pago `abono`. `tocaAjusteIPC` = `hoy >= sumarMeses(abono_ajustado_at ?? abono_inicio, 3)`.

- [ ] **Paso 4: correr y ver que pasan:** `node --test src/lib/cobros.test.ts` → todas en PASS.

---

### Tarea 2 (Codex): migración, API de pagos y acceso sólo para admins

**Archivos:**
- Crear: `supabase/migration_cobros.sql`
- Crear: `src/pages/api/admin/payments.ts` (GET, POST)
- Crear: `src/pages/api/admin/payments/[id].ts` (DELETE)
- Crear: `src/lib/admin-campos.ts` (listas blancas)
- Modificar: `src/lib/admin-auth.ts`, `src/pages/api/admin/clients.ts`, `src/pages/api/admin/clients/[id].ts`, `src/types/admin.ts`

**Consume:** `primerPeriodoImpago`, `ClienteCobro` de `src/lib/cobros.ts`.
**Produce:** tipos `Client` (con campos nuevos) y `Payment` en `src/types/admin.ts`; endpoints descritos abajo.

- [ ] **Migración** `supabase/migration_cobros.sql` (idempotente, `if not exists`):
  - `alter table public.clients add column if not exists` para: `modalidad text check (modalidad in ('abono','unico','proyecto'))`, `plan_id text`, `abono_alta numeric`, `abono_mensual numeric`, `abono_inicio date`, `permanencia_meses int`, `abono_ajustado_at date`, `entregado_at date`, `condiciones_aceptadas_at timestamptz`, `servicio_estado text not null default 'activo' check (servicio_estado in ('activo','baja'))`, `baja_at date`.
  - `create table if not exists public.payments` con: `id uuid primary key default gen_random_uuid()`, `client_id uuid not null references public.clients(id) on delete cascade`, `tipo text not null check (tipo in ('alta','abono','anticipo','saldo','etapa','otro'))`, `periodo date`, `monto numeric not null check (monto > 0)`, `pagado_at date not null`, `medio text not null default 'transferencia' check (medio in ('transferencia','efectivo','mercadopago','otro'))`, `nota text`, `created_at timestamptz not null default now()`, y `check (tipo <> 'abono' or periodo is not null)`.
  - `create unique index if not exists payments_abono_periodo_unico on public.payments (client_id, periodo) where tipo = 'abono';` e índice por `client_id`.
  - RLS activada; política `payments_admin_todo` `for all to authenticated using (public.es_admin()) with check (public.es_admin())`. `grant select, insert, update, delete on public.payments to authenticated, service_role;` (en este proyecto las tablas nuevas no reciben grants por defecto).
- [ ] **`requireAuth`**: después de `auth.getUser`, consultar `admin_users` por `user_id` con `supabaseAdmin`; si no está → 403 `{ error: 'Forbidden' }`. Firma sin cambios.
- [ ] **`src/lib/admin-campos.ts`**: `CAMPOS_CLIENTE` (todas las columnas editables de `clients`, viejas y nuevas, sin `id`, `created_at`, `updated_at`) y `filtrarCampos(body: unknown, permitidos: readonly string[]): Record<string, unknown>`. Normaliza `''` a `null` en campos de fecha y número.
- [ ] **`clients.ts` POST y `clients/[id].ts` PUT**: usar `filtrarCampos(body, CAMPOS_CLIENTE)`; borrar los `console.log` del cuerpo. `access_code` sigue autogenerándose en POST. PUT acepta `access_code` (así «generar código» de `ClientDetail.tsx` pasa a usar la API en la Tarea 4).
- [ ] **`GET /api/admin/payments`**: `?client_id=uuid` → pagos del cliente ordenados por `pagado_at desc`; o `?desde=YYYY-MM-DD&hasta=YYYY-MM-DD` → pagos con `pagado_at` o `periodo` en el rango (para la grilla y el total del mes). Sin parámetros → 400.
- [ ] **`POST /api/admin/payments`**: cuerpo `{ client_id, tipo, monto, pagado_at, medio?, nota?, periodo? }`. Valida tipo, medio, `monto > 0`, fechas `YYYY-MM-DD`. Si `tipo === 'abono'` y no viene `periodo`: carga cliente y pagos y usa `primerPeriodoImpago`; si da `null` → 400 «Este cliente no tiene abono configurado». Violación del índice único (código `23505`) → 409 «Ese mes ya está registrado como pagado». Devuelve el pago creado (201).
- [ ] **`DELETE /api/admin/payments/[id]`** → `{ success: true }`.
- [ ] **Tipos**: `Client` suma los campos nuevos (fechas como `string | null`); `Payment` con las columnas de la tabla; `TIPOS_PAGO` y `MEDIOS_PAGO` como `Record<..., string>` con etiquetas en español.
- [ ] **Verificar**: `npm run build` sin errores nuevos; `node --test src/lib/cobros.test.ts` sigue en PASS. No aplicar la migración.

---

### Tarea 3: condiciones, plantillas y mensajes de cobro

**Archivos:**
- Modificar: `src/lib/constants.ts` (suma `SITE_URL`), `src/lib/pricing.ts` (`CONDICIONES`), `src/lib/templates.ts`, `src/components/Footer.astro`, `docs/templates/whatsapp-cierre-cliente.md`
- Crear: `src/pages/condiciones.astro`, `src/lib/mensajes-cobro.ts`

**Consume:** `EstadoCobro`, `ClienteCobro`, `sumarMeses` de `cobros.ts`.
**Produce:**

```ts
// src/lib/constants.ts
export const SITE_URL = 'https://selva-digital.vercel.app';
export const CONDICIONES_URL = `${SITE_URL}/condiciones`;
// src/lib/mensajes-cobro.ts
export interface ClienteMensaje extends ClienteCobro { name: string; phone: string; plan_id: string | null; abono_alta: number | null; domain: string | null; total_amount: number | null }
export function plantillaParaEstado(e: EstadoCobro): 'recordatorio-vencimiento' | 'aviso-aguante' | 'aviso-baja' | null;
export function variablesCliente(c: ClienteMensaje, e?: EstadoCobro): Record<string, string>;
export function mensajeCobro(c: ClienteMensaje, e: EstadoCobro): string | null;
export function linkWhatsAppCliente(phone: string, texto: string): string; // wa.me con el número del cliente
```

- [ ] `CONDICIONES.abono`: sumar `vencimiento` («El abono vence cada mes el mismo día en que arrancamos…») y `aguante` («Si se pasa, tenés 10 días de margen…; al día 11 el sitio se da de baja y se apaga…»), cambiar `baja` a «avisando antes de tu próximo vencimiento».
- [ ] `templates.ts`: plantillas `cierre-abono`, `cierre-unico`, `datos-pago`, `recordatorio-vencimiento`, `aviso-aguante`, `aviso-baja`, `sitio-entregado`; reescribir o retirar `confirmacion`, `aprobacion-diseno`, `demo-listo` (40/30/30, hosting incluido). Datos bancarios con `{BANCO}`, `{CBU}`, `{ALIAS}` como hoy.
- [ ] `mensajes-cobro.ts` + pruebas en `src/lib/mensajes-cobro.test.ts` (texto de cada estado incluye nombre, monto con `formatARS` y fecha `DD/MM`).
- [ ] `/condiciones` con `Layout variant="landing"`, header y pie propios simples (como `web-para-tu-negocio.astro`), `prerender = true`, secciones Abono / Pago único / Proyecto a medida, fecha de actualización; link en el pie del sitio.
- [ ] Actualizar `docs/templates/whatsapp-cierre-cliente.md` al modelo actual.
- [ ] Verificar: pruebas de Node en PASS, `npm run build`, `/condiciones` sin desbordes a 1440/390/320.

---

### Tarea 4 (Codex): pantallas del panel

**Archivos:**
- Crear: `src/components/admin/HoyCobros.tsx`, `src/components/admin/ServicioCobros.tsx`, `src/components/admin/AdminCobros.tsx`, `src/pages/admin/cobros.astro`
- Modificar: `src/components/admin/AdminDashboard.tsx`, `src/components/admin/ClientDetail.tsx`, `src/components/admin/ClientForm.tsx`

**Consume:** todo lo de las tareas 1-3: `estadoCobro`, `etiquetaEstado`, `finPermanencia`, `tocaAjusteIPC`, `hoyAR`, `vencimientos`, `sumarMeses` (cobros.ts); `mensajeCobro`, `plantillaParaEstado`, `linkWhatsAppCliente`, `variablesCliente` (mensajes-cobro.ts); `PLANES_WEB`, `formatARS` (pricing.ts); `Client`, `Payment`, `TIPOS_PAGO`, `MEDIOS_PAGO` (types/admin.ts); `adminFetch` (lib/admin-fetch.ts); endpoints de la Tarea 2.

- [ ] **`HoyCobros`** (arriba del tablero en `AdminDashboard`): recibe `clients`, pide pagos de los clientes con abono (`GET /api/admin/payments?desde=<abono_inicio más viejo>&hasta=<hoy>`), calcula `estadoCobro` con `hoyAR()` y muestra grupos «Para dar de baja», «En aguante», «Vencen en los próximos 3 días», «Consultas abiertas» (`status` `lead` o `propuesta`, de la más vieja a la más nueva, con días desde `created_at`). Cada fila de cobro: nombre (link a la ficha), etiqueta, monto, botón «Recordar por WhatsApp» (`linkWhatsAppCliente(phone, mensajeCobro(...))`, `target="_blank"`). Sin nada: «Todo al día».
- [ ] **Lista de clientes del dashboard**: etiquetas de modalidad, plan, «Entregado»/«Sin entregar» y estado de cobro; filtros (selects) por modalidad, plan, entregado y cobro (`al día` / `debe`). Botón «Cobros» en la cabecera junto a «Precios».
- [ ] **`/admin/cobros`** (`AdminCobros` con el mismo armado que `precios.astro`): grilla clientes con abono × 6 meses (mes actual y 5 anteriores, navegable). Celda: vencimiento de ese mes según `vencimientos`; estado pagado / pendiente (futuro) / en aguante / atrasado / sin vencimiento; clientes en `baja` en gris. Fila final con el total cobrado por mes (suma de `monto` de todos los pagos con `pagado_at` en ese mes). Debajo de 768 px: un mes a la vez, como lista.
- [ ] **`ServicioCobros`** dentro de `ClientDetail`: modalidad, plan, alta, mensual, inicio, fin de permanencia, etiqueta «Toca ajuste IPC», estado de cobro; historial de pagos con borrar (confirmación); formulario «Registrar pago» (tipo, monto precargado con `abono_mensual` si es abono, fecha hoy, medio, nota, período opcional); botones «Marcar entregado» (fecha hoy), «Registrar aceptación de condiciones» (ahora), «Dar de baja» (confirmación; `servicio_estado: 'baja'`, `baja_at: hoy`), «Reactivar» (`servicio_estado: 'activo'`, `baja_at: null`, `abono_inicio: hoy`). Todo con `adminFetch` a la API. «Generar código» pasa a `PUT /api/admin/clients/[id]`.
- [ ] **Plantillas en la ficha**: el selector de plantillas sigue funcionando con las nuevas; `variablesCliente` precarga sus variables.
- [ ] **`ClientForm`**: campos modalidad, plan (de `PLANES_WEB`), alta, mensual, permanencia, inicio del abono, total (único/proyecto). Al elegir abono + plan se precargan alta, mensual y permanencia desde `PLANES_WEB` (editables). En único, total = `plan.unico` y muestra 50/50.
- [ ] **Verificar**: `npm run build`; pruebas de Node en PASS.

---

### Tarea 5 (Claude): revisión e integración

- [ ] Revisar el diff de Codex (Tareas 2 y 4) contra la spec y este plan; corregir lo que falte.
- [ ] Confirmar que el usuario del dueño está en `admin_users` y, con su visto bueno, aplicar `migration_cobros.sql` en el proyecto `nbtnfdntsvjwkxmkbsfh`.
- [ ] Playwright (skill `playwright-skill`, script en el scratchpad) contra `npm run dev`: login, alta de cliente con abono, registrar pago, estado en «Hoy» y en `/admin/cobros`, texto del botón de WhatsApp, marcar entregado y aceptación, 390 px sin desborde, `/condiciones` a 1440/820/390/320.
- [ ] `npm run build` y actualizar `CLAUDE.md` (estructura y fase nueva).
