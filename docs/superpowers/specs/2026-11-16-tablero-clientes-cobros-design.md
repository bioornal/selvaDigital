# Tablero de clientes y cobros + condiciones del servicio

Fecha: 16/11/2026 · Estado: diseño aprobado en la charla, pendiente de revisión escrita

## Objetivo

Que el dueño sepa, al abrir `/admin`, a quién le tiene que cobrar hoy, quién está atrasado y quién está para dar de baja; que cada cliente tenga registrado su plan, si ya se entregó y si aceptó las condiciones; y que las condiciones del servicio estén escritas en un solo lugar y se acepten por WhatsApp, sin contrato firmado.

## Decisiones tomadas

- Se amplía el panel `/admin` existente (Supabase + API con service role). No hay planilla aparte ni panel nuevo.
- Cobro del abono por **transferencia manual**: el dueño registra cada pago en el panel. Sin Mercado Pago ni débito automático.
- **Vencimiento**: el abono vence cada mes el mismo día del mes que el inicio del abono (primer vencimiento: un mes después del inicio). Si ese día no existe en el mes (29, 30, 31), vence el último día del mes.
- **Aguante**: 10 días corridos después del vencimiento. Desde el día 11 sin pagar el cliente queda «Para dar de baja». La baja la ejecuta el dueño (apaga el sitio y la marca en el panel); el sistema nunca da de baja solo.
- **Avisos**: sólo en el panel, con botón que abre WhatsApp con el mensaje escrito. Sin mail diario ni calendario.
- **Formalidad**: página pública `/condiciones` + mensaje de cierre por WhatsApp que pide «Acepto»; el panel guarda la fecha de aceptación. Sin contrato firmado. El texto conviene que lo revise un abogado una vez.
- Fuera de alcance: Mercado Pago, mail diario, Google Calendar, cobros visibles en el portal del cliente, facturación.

## 1. Datos (migración `supabase/migration_cobros.sql`)

### Columnas nuevas en `clients`

| Columna | Tipo | Uso |
|---|---|---|
| `modalidad` | text, check `abono` \| `unico` \| `proyecto`, null | Cómo contrató. Null = todavía es consulta. |
| `plan_id` | text, null | `landing`, `corporativo`, `extendido`, `ecommerce` (ids de `PLANES_WEB`). Null en `proyecto`. |
| `abono_alta` | numeric, null | Alta acordada con este cliente (ARS). |
| `abono_mensual` | numeric, null | Abono vigente de este cliente (ARS). Se edita al ajustar por IPC. |
| `abono_inicio` | date, null | Fecha base del vencimiento. Por defecto la fecha en que pagó el alta; editable (por ejemplo, si se decide arrancar a contar desde la entrega). |
| `permanencia_meses` | int, null | 3 o 6 según el plan al cargarlo; editable. |
| `abono_ajustado_at` | date, null | Último ajuste por IPC. |
| `entregado_at` | date, null | Null = no entregado. |
| `condiciones_aceptadas_at` | timestamptz, null | Cuándo respondió «Acepto». |
| `servicio_estado` | text, check `activo` \| `baja`, default `activo` | `baja` sale de los avisos de cobro. «Reactivar» lo vuelve a `activo` y fija un nuevo `abono_inicio`. |
| `baja_at` | date, null | Fecha de baja. |

Los campos viejos (`deposit_amount`, `design_amount`, `final_amount`, `total_amount`, `status`, `current_phase`) se mantienen. `total_amount` se usa como total del pago único o del proyecto.

### Tabla nueva `payments`

| Columna | Tipo | Uso |
|---|---|---|
| `id` | uuid pk | |
| `client_id` | uuid fk → clients, on delete cascade | |
| `tipo` | text, check `alta` \| `abono` \| `anticipo` \| `saldo` \| `etapa` \| `otro` | |
| `periodo` | date, null | Sólo `abono`: el vencimiento que cubre. Único por (`client_id`, `periodo`) cuando `tipo = 'abono'`. |
| `monto` | numeric not null, > 0 | ARS. |
| `pagado_at` | date not null | Fecha en que llegó la plata. |
| `medio` | text, default `transferencia` | `transferencia`, `efectivo`, `mercadopago`, `otro`. |
| `nota` | text, null | |
| `created_at` | timestamptz default now() | |

RLS activada; reglas de acceso total sólo con `es_admin()` (como el resto de las tablas del admin). Grants dados a mano (en este proyecto las tablas nuevas no los reciben por defecto). Todas las lecturas y escrituras del panel pasan por la API con service role.

## 2. Cálculo de estados (`src/lib/cobros.ts`, funciones puras)

Sin acceso a red ni a Supabase; reciben el cliente, sus pagos y la fecha de hoy.

- `vencimientos(inicio, hasta)`: lista de vencimientos mensuales desde `inicio + 1 mes` hasta `hasta`, con el ajuste de fin de mes (inicio 31/01 → 28 o 29/02, 31/03, 30/04…). Siempre se calcula desde `inicio`, nunca encadenando el mes anterior (para no arrastrar el 28 de febrero).
- `estadoCobro(cliente, pagos, hoy)` → uno de:
  - `no_aplica`: modalidad distinta de `abono`, sin `abono_inicio`, o `servicio_estado = 'baja'`.
  - `al_dia`: no hay vencimientos impagos ≤ hoy. Incluye `proximo` (fecha) y `dias` hasta el próximo.
  - `vence_pronto`: el próximo vence en 0 a 3 días (0 = «Vence hoy»).
  - `en_aguante`: el vencimiento impago más viejo fue hace 1 a 10 días. Incluye `dia` (1-10) y la cantidad de meses adeudados.
  - `para_baja`: el vencimiento impago más viejo fue hace más de 10 días. Incluye meses adeudados y monto adeudado (meses × `abono_mensual`).
- `finPermanencia(cliente)`: `abono_inicio + permanencia_meses`.
- `tocaAjusteIPC(cliente, hoy)`: verdadero si pasaron 3 meses desde `abono_ajustado_at` (o desde `abono_inicio` si nunca se ajustó). Se muestra como etiqueta; el ajuste lo hace el dueño editando `abono_mensual`.
- Un pago `abono` sin `periodo` explícito se asigna al vencimiento impago más viejo al registrarlo (lo resuelve la API, no el cálculo).

## 3. API (todas con `requireAuth`, cuerpo validado con lista blanca de campos)

- `GET /api/admin/payments?client_id=…` y `GET /api/admin/payments?desde=YYYY-MM&hasta=YYYY-MM` (para la grilla).
- `POST /api/admin/payments`: registra un pago. Si es `abono` sin `periodo`, toma el vencimiento impago más viejo. Rechaza períodos duplicados con un mensaje claro.
- `DELETE /api/admin/payments/[id]`: borra un pago cargado por error (con confirmación en la interfaz).
- `PUT /api/admin/clients/[id]` acepta los campos nuevos (lista blanca). Se usa también para «Marcar entregado», «Registrar aceptación», «Dar de baja» y «Generar código» (este último hoy falla desde el navegador porque el rol `authenticated` no tiene UPDATE en `clients`).
- `POST /api/admin/clients` pasa a lista blanca de campos y deja de imprimir el cuerpo en el log.

## 4. Interfaz del panel

Estilo del panel actual (modo operar del design system). Mobile primero: el dueño lo va a mirar en el celular.

- **Inicio → bloque «Hoy»** arriba del tablero actual, con cuatro grupos: «Para dar de baja», «En aguante», «Vencen en los próximos 3 días», «Consultas abiertas» (clientes en `lead` o `propuesta`, de la más vieja a la más nueva). Cada cliente con cobro muestra monto, días y el botón «Recordar por WhatsApp» (plantilla según el estado). Si no hay nada: «Todo al día».
- **Lista de clientes**: columnas o etiquetas nuevas de modalidad, plan, entregado sí/no y estado de cobro; filtros por esas cuatro.
- **Cobros (`/admin/cobros`)**: grilla de clientes con abono × últimos 6 meses (pagado / pendiente / en aguante / atrasado / sin vencimiento), total cobrado por mes (todos los tipos de pago) y navegación entre meses. En el celular se ve por mes, como lista.
- **Ficha del cliente**: sección «Servicio y cobros» con modalidad, plan, montos, inicio, fin de permanencia, etiqueta «Toca ajuste IPC», estado de cobro, historial de pagos y botones «Registrar pago», «Marcar entregado», «Registrar aceptación de condiciones», «Dar de baja» y «Reactivar».
- **Formulario de cliente**: al elegir modalidad `abono` y un plan, completa alta, mensual y permanencia desde `pricing.ts` (editables). En `unico`, total y 50/50.

## 5. Condiciones y mensajes

- **`src/pages/condiciones.astro`** (prerender, layout del sitio, enlazada desde el pie): texto en lenguaje simple, primera persona, armado con `CONDICIONES` de `pricing.ts` más los bloques nuevos: vencimiento mensual el día del alta, 10 días de aguante, baja y apagado del sitio, reactivación, permanencia, ajuste IPC, dominio a nombre del cliente, compra del sitio descontando lo pagado, qué no se promete. Secciones separadas para abono, pago único y proyecto a medida. Fecha de «última actualización».
- **`CONDICIONES` en `pricing.ts`**: se agregan `vencimiento` y `aguante`; `baja` cambia «avisando antes del día 25» por «avisando antes de tu próximo vencimiento» (el día 25 ya no tiene sentido con vencimientos por cliente).
- **Plantillas en `src/lib/templates.ts`**, alineadas al modelo actual:
  - `cierre-abono`: plan, alta, mensual, permanencia, día de vencimiento, link a `/condiciones`, pide «Acepto».
  - `cierre-unico`: total, 50/50, hosting aparte, link a `/condiciones`, pide «Acepto».
  - `datos-pago`: monto según el tipo (alta, abono del mes, anticipo, saldo).
  - `recordatorio-vencimiento`: amable, vence hoy o en X días.
  - `aviso-aguante`: venció hace X días, quedan Y días antes de apagar el sitio.
  - `aviso-baja`: pasaron los 10 días, se apaga el sitio, cómo reactivarlo.
  - `sitio-entregado`: link, qué incluye el abono, cómo pedir cambios.
  - Se corrigen o retiran las plantillas con 40/30/30 y «hosting incluido» (`confirmacion`, `aprobacion-diseno`, `demo-listo`) y `docs/templates/whatsapp-cierre-cliente.md`.

## 6. Errores y casos borde

- Inicio el 29, 30 o 31: ajuste a fin de mes (probado con febrero bisiesto y no bisiesto).
- Pago adelantado de varios meses: se registran varios pagos con su `periodo`.
- Pago parcial: se registra como `otro` con nota; el período sigue impago hasta completar (no se modelan parciales).
- Cliente en `baja`: no aparece en avisos; la grilla lo muestra gris.
- Error de API: mensaje visible en el panel, sin perder lo cargado en el formulario.
- Las fechas se manejan como fechas de Argentina (`America/Argentina/Buenos_Aires`), no UTC, para que «hoy» no cambie a las 21 h.

## 7. Pruebas

- `cobros.ts`: casos con fechas fijas (fin de mes, febrero, aguante día 1 y 10, día 11, meses múltiples adeudados, pagado adelantado, baja). Se corren con `node --test` sobre el TS compilado o con `tsx`, sin sumar dependencias al proyecto.
- Playwright (skill `playwright-skill`, script en el scratchpad) contra `npm run dev` con un usuario admin de prueba: cargar cliente con abono, registrar pago, ver cambio de estado en «Hoy» y en la grilla, botón de WhatsApp con el texto correcto, marcar entregado y aceptación, `/condiciones` sin desbordes a 1440, 820, 390 y 320 px.
- `npm run build` sin errores nuevos (el `EPERM symlink` de Windows es conocido).

## 8. Reparto del trabajo

- Codex: migración + API de pagos (bloque 1 y 3), y pantallas del panel (bloque 4), por separado.
- Claude: `cobros.ts` con sus pruebas, `/condiciones`, plantillas, revisión de lo que entregue Codex, pruebas con Playwright.
- La migración se aplica en Supabase (proyecto `nbtnfdntsvjwkxmkbsfh`) sólo con el visto bueno del dueño.
