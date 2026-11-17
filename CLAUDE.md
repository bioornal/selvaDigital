# Selva Digital — Project Context

## Identity
- Freelancer portfolio site (NOT agency/company). First-person singular throughout
- Name: Selva Digital
- Location: Puerto Iguazú, Misiones, Argentina
- Market: National Argentina (PyMEs/negocios)
- Differentiator: AI chatbots + outcome-led positioning ("less time lost, more sales", no jargon)
- Commercial model: pago único, 50% inicio + 50% contra entrega. NO hosting/dominio incluido — el cliente lo contrata a su nombre (recomendamos Hostinger, ~AR$ 9.300/mes). Esto evita atar al cliente al freelancer y baja la fricción de venta.

## Contact Info
- Phone: `+54 9 3757 652003`
- WhatsApp: `5493757652003`
- Email: `info.selvadigital@gmail.com`
- Logo: Cloudinary `SelvaDigital/logo/` (logo horizontal e isotipo, claro/oscuro, SVG y PNG). En la web: `LOGO` de `src/lib/cloudinary.ts`
- Profile photo: `https://res.cloudinary.com/djtvjkcu6/image/upload/v1778507882/SelvaDigital/yo_perfil_ekrrxc.jpg`

## Tech Stack
- Astro 4.16.19, `output: 'server'`, `@astrojs/vercel@7.8.2` serverless adapter
- React 18 + TypeScript
- Tailwind CSS 3.4
- Framer Motion (animations)
- Resend (contact form emails)
- Google Analytics (`PUBLIC_GA_ID`)
- Node 22.14.0 (engine says 20.x — warning only)

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run preview` — preview build

## Design System
- Fuente de verdad: [DESIGN.md](DESIGN.md); tokens implementados en src/styles/global.css.
- Petrol #102D35 / Ice #E8F7F5 / Lime #D9FA57; estilo tech premium tipo Nothing, superficies planas y hairlines.
- Archivo (titulares/cuerpo), Martian Mono (etiquetas), Doto (cifras). Escala compartida --fs-* en :root; no agregar font-size sueltos.
- Controles rectos; lima para CTAs, marcador mark sobre hielo y bloque «Trato directo conmigo», siempre con texto petróleo.
- Renders de producto en Hero/separadores; foto REAL de stock en WhyWeb. Nunca fotos de personas o lugares generadas por IA.
- Punto fuerte: sitios web y digitalización; chatbot integrado en la web como extra. Copy rioplatense en primera persona, precios ARS, pago único 50/50, hosting/dominio aparte.

## File Structure
```
src/
├── components/
│   ├── Header.tsx          — Marca tipográfica, navegación responsive, Portal y CTA lima
│   ├── Hero.astro          — Titular tipográfico con verbo rotativo + render hero-device + WhatsApp
│   ├── WhyWeb.astro        — Foto real a sangre + argumento web + lista Hoy → Con tu web con mark lima
│   ├── VisualBreak.astro   — Separador con render de producto, frase y CTA (dos usos)
│   ├── ServicesV2.astro    — Qué resuelvo: sitios web principal; chatbot web extra con demo Impasto
│   ├── Portfolio.astro     — 10 proyectos con KPI y stack visible (inline, sin sub-component); los de más peso primero, capturas en Cloudinary recortadas 16:10
│   ├── AboutV2.astro       — Cómo trabajo: foto real, bloque lima «Trato directo conmigo» y proceso
│   ├── Testimonios.astro   — 6 testimonios reales con avatares iniciales + KPI badge
│   ├── ChatPreview.tsx     — Animated chat demo (client:visible)
│   ├── Precios.astro       — 7 planes con tabs (Webs / Sistemas), pricing inline (sin PlanCard)
│   ├── FAQ.astro           — 9 preguntas, vanilla JS accordion, aria-controls + focus visible
│   ├── Contact.tsx         — Armador de mensaje WhatsApp + formulario Resend secundario
│   ├── Footer.astro        — Marca tipográfica, invitación, enlaces y contacto
│   ├── WhatsAppButton.tsx  — Floating WhatsApp button
│   ├── admin/
│   │   ├── AdminLogin.tsx     — Supabase auth login form
│   │   ├── AdminDashboard.tsx — Bloque «Hoy» + stats + tabla de clientes con filtros (modalidad, plan, entrega, cobro)
│   │   ├── HoyCobros.tsx      — Para dar de baja / en aguante / vencen en 3 días / consultas abiertas + botón WhatsApp
│   │   ├── AdminCobros.tsx    — Grilla clientes con abono × 6 meses + total cobrado (mobile: un mes por vez)
│   │   ├── ServicioCobros.tsx — Ficha: servicio, pagos, registrar pago, entregado, condiciones, baja/reactivar
│   │   ├── cobros-ui.tsx      — usePagos() + EstadoCobroBadge
│   │   ├── ClientForm.tsx     — Create/edit client: modalidad, plan e importes precargados desde pricing.ts
│   │   ├── ClientDetail.tsx   — Client info, phases, message composer
│   │   └── AdminPrecios.tsx   — Editor de importes de Precios (guarda y republica)
│   └── ui/                 — WaIcon.tsx (SVG WhatsApp compartido), button, card, input, textarea
├── lib/
│   ├── utils.ts            — cn() helper (clsx + tailwind-merge)
│   ├── constants.ts        — WHATSAPP_NUMBER, WHATSAPP_URL, CONTACT_PHONE, CONTACT_EMAIL
│   ├── supabase.ts         — Browser Supabase client (anon key)
│   ├── supabase-server.ts  — Server Supabase client (service role key)
│   ├── pricing.ts          — Fuente única de precios + validarPrecios/aplicarPrecios
│   ├── pricing-remoto.ts   — cargarPrecios(): importes de Supabase al compilar
│   ├── cobros.ts           — Vencimientos del abono (puro): estadoCobro, primerPeriodoImpago, hoyAR
│   ├── mensajes-cobro.ts   — variablesCliente, mensajeCobro, linkWhatsAppCliente (549…)
│   ├── admin-db.ts / admin-campos.ts — adminDb tipado, json(), lista blanca de campos de clients
│   └── templates.ts        — Plantillas de WhatsApp (cierre abono/único, cobros, entrega…)
├── types/
│   ├── admin.ts            — Client, ProjectPhase, Message types + status maps
│   └── database.ts         — Supabase Database TypeScript types
├── utils/
│   └── analytics.ts        — Google Analytics event sender
├── layouts/
│   ├── Layout.astro        — Schema.org Person, security headers, font preload, SEO
│   └── AdminLayout.astro   — Minimal dark layout for admin panel
├── pages/
│   ├── index.astro         — Hero → WhyWeb → Portfolio → ServicesV2 → VisualBreak (trato directo) → AboutV2 → Testimonios → VisualBreak (en vivo) → Precios → FAQ → Contact. Prerender estático.
│   ├── admin/
│   │   ├── login.astro        — Admin login page
│   │   ├── index.astro        — Admin dashboard
│   │   ├── precios.astro      — Editor de precios
│   │   └── clientes/
│   │       ├── nuevo.astro    — New client form
│   │       └── [id].astro     — Client detail page
│   └── api/
│       ├── contact.ts         — POST: escapeHtml, rate limiting, env validation
│       ├── banner.ts
│       └── admin/
│           ├── clients.ts              — GET/POST clients
│           ├── clients/[id].ts         — GET/PUT/DELETE client
│           ├── clients/[id]/phases.ts  — GET/POST phases
│           ├── precios.ts              — GET/PUT precios + Deploy Hook
│           └── send-message.ts         — POST message from template
└── styles/
    └── global.css          — Typography rules + heroFade keyframe
```

## AIChatbots Section (estado actual)
- Layout 2-col en desktop: kicker + título + 6 feature cards + 2 CTAs (izq) / `ChatPreview` React animado (der, md+)
- En mobile: sólo la columna izquierda (sin chat preview), y se reemplazan los 2 CTAs por uno único "Ver Chatbot en vivo →" (emerald)
- Feature cards con dot violet (`#8B5CF6`) y spotlight glow al pasar el mouse
- Desktop conserva los 2 CTAs originales: "Pedir demo gratis" (emerald) + "Ver Megabot en vivo →" (outline)

## Key Decisions
- Freelancer over agency — all text first-person singular
- Services + About merged into one section (no separate About.astro — file removed)
- Video bg in Hero replaced static Unsplash image
- Video in AI/Chatbots: full-height stretch, not sticky
- Static AI image in Apps section with gradient glow
- Hosting: Vercel free (static), Hostinger paid (e-commerce)
- 34 tech logos: devicon CDN + simpleicons CDN
- All CTA/action buttons `rounded-none`; decorative elements keep `rounded-full`
- All contact data centralized in `src/lib/constants.ts` — no hardcoded values in components

## Completed Phases
- Phase 1: typography, header, hero, portfolio, pricing, SEO, contact, banner
- Phase 2: AI/Chatbots section, FAQ, Apps section, freelancer rebrand, dependency cleanup

## Phase 3 (Security & Cleanup — May 2026)
- 🔒 `api/contact.ts`: HTML sanitization (`escapeHtml`), rate limiting (5 req/min/IP), env var validation, no `error.message` leak to client
- 🔒 `vercel.json` + `Layout.astro`: security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- 📦 `glob` removed from dependencies (unused)
- 🗑 `Bubble.tsx` deleted (unused component)
- 🏗 `ProjectCard.astro` + `PlanCard.astro`: extracted reusable components, eliminated ~280 lines of duplicated markup
- 🎨 `ui/input.tsx` + `ui/textarea.tsx`: now use `cn()` for className merging (consistency with button/card)
- 📞 Contact data centralized: `src/lib/constants.ts` (WHATSAPP_NUMBER, CONTACT_PHONE, CONTACT_EMAIL)
- ⚡ Google Fonts: non-blocking load via `rel="preload"` + `onload` trick + `<noscript>` fallback
- 🖼 Images: `fogon.png` (932KB→168KB WebP), `iguazuFalls.png` (1.1MB→338KB WebP). Originals removed from `public/`
- 🎯 Banner: fake countdown timer removed — replaced with honest "20% OFF" offer (localStorage for claimed state, no reset)
- 📋 `.env.example` created (RESEND_API_KEY, CONTACT_EMAIL, PUBLIC_GA_ID)
- 📈 Dependencies: `astro@4.16.19`, `@astrojs/vercel@7.8.2`
- 📊 Portfolio order: Impasto → MegaMuebles → Iguazú Falls Lodge → El Fogón Delivery

## Phase 4 (Admin Panel — May 2026)
- 🔐 Supabase Auth integration (`@supabase/supabase-js`): login via email/password
- 🗄 New tables: `clients`, `project_phases`, `messages` with RLS policies
- 📱 WhatsApp message templates from `docs/templates/whatsapp-cierre-cliente.md` codified in `src/lib/templates.ts`
- 🎨 Admin routes under `/admin/*`: login, dashboard, new client, client detail
- 📊 Dashboard with stats (total, active, finished, proposals) and client table
- 📝 Client form with project details, financials, and payment info
- 🔄 Phase tracker (0-6) with visual progress and status updates
- 💬 Message composer: template selection → variable autofill → preview → copy/send via WhatsApp
- 🛠 API endpoints: `/api/admin/clients`, `/api/admin/clients/[id]`, `/api/admin/send-message`
- 🔑 New env vars: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Phase 5 (Copy Refactor + Comm Model — May 2026)
- ✍️ Outcome-led copy refactor across Hero subhead, ServicesV2 (5 cards + H2), Manifiesto (3 cards), AIChatbots (6 features + subhead), AboutV2 (H2 + 4-step process), FAQ. Formula: dolor concreto → cómo lo resolvés → resultado → precio.
- 💸 Pricing simplificado: Landing $250k, Sitio Corp 3-5pg $350k, Sitio Extendido +5pg $450k, E-commerce $1.3M, Sistema a medida $1.2M, Chatbot IA $1.5M, App a medida (consultar).
- 🏦 Modelo de pago: pasó de 40/30/30 (seña/diseño/final) → 50/50 (inicio/contra entrega). Refleja en `templates.ts` (WhatsApp) y `admin/ClientForm.tsx` (autocálculo).
- 🌐 Hosting/dominio NO incluidos — se contrata aparte a nombre del cliente (~AR$ 9.300/mes Hostinger). Argumento de venta: "no quedás atado, el sitio es 100% tuyo desde el día uno".
- 📩 Contact form: nuevo campo `presupuesto` con botones toggle (ARS rangos: <400k, 400k-800k, 800k-1.5M, +1.5M). Llega al email vía Resend.
- 🦶 Footer socials: WA con link real a WhatsApp, IG con perfil real, GitHub/LinkedIn como spans decorativos (no href, opacidad reducida).
- 📱 Mobile UX: AboutV2 compactado (1 párrafo en lugar de 3, foto + KPIs + stack + botones ocultos en mobile). Portfolio cards con gap explícito (28-32px md/lg) para evitar override del `gap: revert` global.
- 🗑 FAQ: eliminada pregunta "El código queda mío" (el código queda con el dev). Reemplazada por "Cambios post-entrega" y "¿Y si no me gusta el diseño?".

## Phase 6 (Audit & Optimization — May 2026)
- ⚡ **Rendimiento e Integridad Técnica**: Forzado de pre-renderizado estático (`prerender = true`) en `src/pages/index.astro` para servir la landing page directamente desde la CDN Edge de Vercel en milisegundos.
- ⚡ **Interactividad de Alta Gama**: Implementación de animaciones de scroll con `IntersectionObserver` y delays en cascada (stagger), y efecto de halo interactivo que sigue al mouse (*Spotlight Glow*) en las tarjetas de precios/servicios.
- ⚡ **Integridad del Design System**: Conversión de todos los botones de acción principales y CTAs a esquinas de 90° (`rounded-none`). Barra superior indicadora de progreso de scroll en color Electric Cyan.
- ⚡ **Optimización de Conversión (CRO)**: Incorporación de 6 testimonios auténticos de clientes locales vinculados al portfolio con métricas reales, y adición de microcopy de confianza bajo los CTAs principales del Hero para incentivar la acción y reserva inmediata de cupos.
- ⚡ **Accesibilidad y Contraste WCAG AA**: Modificación responsiva en `global.css` para elevar automáticamente la opacidad de los textos secundarios grises (`rgba(250,250,250,0.46)`) en pantallas móviles (menores a 768px) para asegurar legibilidad perfecta de 4.5:1 bajo luz de día directa.

## Phase 7 (Pre-launch Polish — May 2026)
- 🧹 Código muerto eliminado: `PlanCard.astro`, `ProjectCard.astro`, `HeroDynamic.tsx`, `Services.astro`, `WaveSeparator.astro`, `WaveSeparatorInverted.astro` (resuelve drift de paleta — el sitio activo es 100% emerald + cian).
- 🔢 Reordenamiento: AboutV2 + Manifiesto subidos de la posición 8-9 a 3-4, antes de Testimonios. Numeración de kickers re-secuenciada 01-10 (Contact pasó de 09 duplicado a 10).
- 🔍 SEO: og:image apunta al logo Cloudinary, Schema.org enriquecido con `ProfessionalService` + `OfferCatalog` (6 ofertas con precios ARS), sitemap.xml actualizado, robots.txt bloquea `/admin` y `/api/`, AdminLayout con `meta robots noindex`.
- ♿ Accesibilidad: `textDim` global subido de 0.46 → 0.58 para pasar WCAG AA en desktop (mobile boost a 0.66). `aria-controls` + `aria-labelledby` en FAQ. `aria-hidden` en SVGs decorativos (Testimonios quote, Manifiesto icons, FAQ chevron). Focus visible global con outline emerald.

## Phase 8 (Mobile UX Reduction — May 2026)
Premisa de la fase: **mobile escanea, no lee**. Cada elemento que no convierte = ruido. Cortar, no agregar. Desktop intocado en toda la fase.

- 📐 **Hero mobile compactado**: stats grid de 4 → 2 ($0 cuotas y 100% código quedan sólo desktop con clase `.hide-on-mobile`). H1 baja `font-size` mínimo de 48px → 38px con line-height 0.98 para no romper en 320px. Segundo CTA "Ver portfolio →" pasa de botón a link discreto subrayado en mobile (el primario gana foco).
- ✂️ **Carousels recortados en mobile**:
  - Portfolio 9 → 4 destacados + link "Ver los 5 restantes →" expandible (revela el resto sin cargar otra página).
  - Testimonios 6 → 3 cards.
  - AIChatbots 6 features → 4 clave.
  Las cards extras se ocultan con `.hide-on-mobile` (display: none < 768px), sin afectar el grid desktop.
- 🟢 **Carousel dots minimal**: indicador de posición (5px, emerald activo se estira a 18×5px tipo "pill") en Portfolio, Testimonios, Services, Precios (web + sistemas). Inicialización JS centralizada en `Layout.astro` — busca `.mobile-carousel[data-dots]` y crea dots en su contenedor `[data-dots-for="..."]`.
- 📝 **Manifiesto compactado mobile**: cada pilar tiene `descShort` (≤12 palabras) que se muestra `md:hidden`, y `desc` original `hidden md:block`. -60% texto leído en mobile.
- 📄 **FAQ compactación mobile**: padding del trigger `py-5 px-5` → `13px × 16px`, font-size `15.5 → 14.5`, gap entre items `8 → 6px`, content padding `pb-5 + 56px` → `14px + 42px`, font respuesta `14 → 13px`, gap heading↔accordion `64 → 32px`. Cada caja ~35% más baja.
- 🦶 **Footer tape strip** (largo, no entra en una línea < 480px): oculto en mobile con `hidden md:block`.
- ⏱ **Reveal delays cap mobile**: `delay-200/250/300/400` se capean a 120-180ms en `<768px` para que cards no aparezcan tarde al scrollear rápido.
- 🧰 **Utilidades globales nuevas** en `global.css`:
  - `.hide-on-mobile` — `display: none !important` < 768px
  - `.carousel-dots` + `.carousel-dot` / `.carousel-dot.active`
  - Cap de delays en cascada para mobile

Resultado neto: ~30% menos scroll vertical en la mitad-arriba de la home mobile. No se agregaron CTAs nuevos — el WhatsApp flotante ya cumple ese rol y duplicarlo en el Header habría generado ruido sin ganancia.

## Phase 9 (Mobile Typography Consistency + FAQ Image — May 2026)
Premisa: en mobile cada sección tenía su propio tamaño de H2 (26–36px), su propia alineación (AboutV2 era el único `text-left`), y sus subtítulos variaban entre 14.5 y 17px. Ruido visual sin razón funcional. Desktop intocado en toda la fase.

- 🧰 **Utilidades globales nuevas** en `global.css` dentro de `@media (max-width: 767px)` con `!important` (para vencer los `style="font-size:clamp(...)"` inline):
  - `.section-h2` → 30px / line-height 1.05 / letter-spacing -0.025em / text-align center
  - `.section-sub` → 15.5px / line-height 1.55 / text-align center
  - `.card-body` → 13.5px / line-height 1.55
  - `.section-heading` → fuerza centro al wrapper del bloque heading (cubre AboutV2 que era `text-left`)
- 📐 **10 secciones unificadas** con las clases anteriores: AboutV2, Apps, AIChatbots, Manifiesto, Testimonios, Precios, FAQ, Portfolio, ServicesV2, Contact. Antes los H2 oscilaban entre 26px (Precios) y 36px (resto) y los subs entre 14.5px y 17px.
- ✍️ **Testimonios H2 mobile reescrito**: "No hace falta que vos confíes en mí." → "No me creas a mí." (en mobile vía `md:hidden`/`hidden md:inline`). El original wrappeaba a 3+ líneas con el nuevo tamaño 30px centrado. Desktop conserva el copy original.
- 🎯 **CTAs alineados al heading en mobile**:
  - Apps: `<div class="text-center md:text-left">` envolviendo el CTA "Contame tu idea →"
  - AIChatbots: `justify-center lg:justify-start` en el flex wrapper de CTAs
- 🤖 **AIChatbots CTA único en mobile**: en `<768px` los 2 botones desktop se ocultan y aparece uno solo "Ver Chatbot en vivo →" (emerald). Reduce ruido en mobile sin tocar desktop. Implementación: 3 `<a>` con `hidden md:inline-flex` / `md:hidden inline-flex`.
- 🖼 **FAQ desktop — imagen decorativa en columna izquierda**: nueva imagen de selva tropical con luz emerald (`Cloudinary: ChatGPT_Image_22_may_2026_11_48_27_a.m._jpiiau.png`) bajo el CTA "Hacer una consulta →". Transforms: `c_fill,g_auto,w_900,h_1200,q_auto,f_auto`. Halo emerald sutil detrás (mismo recurso que AboutV2). `loading="lazy"` + `decoding="async"`. Mobile: oculta con `hidden md:flex`.
- 📏 **FAQ grid restructurado para que las columnas tengan el mismo alto**: pasó de `items-start` → `items-stretch`. La columna izquierda dejó de ser `md:sticky` y ahora es `flex flex-col` — heading/sub/CTA apilados arriba y la imagen toma `flex-1 min-h-[420px]` para rellenar exactamente el alto de la lista de FAQs de la derecha.

Resultado: en mobile todos los H2 al mismo tamaño y centrados, emerald siempre en 1 línea (los `<br>` lo garantizan), subtítulos uniformes. En desktop el FAQ ya no tiene hueco vertical en la columna izquierda.

## Phase 11 (Rediseño Impeccable — nov 2026)
- Nueva identidad Petrol/Ice/Lime, estilo tech premium tipo Nothing; composición de home «Muro de trabajos» elegida por el usuario.
- Home: Hero (titular + muro de 4 capturas reales) → Trabajos (selector: lista + visor en desktop, fila deslizable en mobile) → Servicios (6, incluye Apps) → Chatbots → Sobre mí → Manifiesto → Testimonios → Precios (ARS) → FAQ → Contacto (armador de mensaje de WhatsApp + formulario) → Footer.
- Eliminados: `Apps.astro` (integrado en Servicios), `SectionDivider.astro`, `Banner.tsx` (popup 20% off), barra de progreso, video del hero, Framer Motion en Header.
- Admin y portal re-tematizados (modo operar), portal en voseo y primera persona.
- Pendiente del usuario: verificar testimonios y KPIs.
- Logo nuevo (15/11/2026): encabezado, pie, portal, favicons y og:image usan el logo "oscuro" (para fondo petróleo). Favicon SVG adaptable a pestaña clara u oscura en `public/favicon.svg`.

## Phase 12 (Precios editables + seguridad Supabase — 16/11/2026)
- 💸 **Panel `/admin/precios`** (`AdminPrecios.tsx` + `pages/admin/precios.astro`, botón «Precios» en el dashboard): edita sólo importes (alta, abono, permanencia y pago único por plan; extra IA con abono y único; «desde» de Sistemas; mantenimiento). Muestra vista previa y el valor anterior de cada campo.
- 🔌 **Flujo**: `/api/admin/precios` (GET/PUT, `requireAuth`) valida con `validarPrecios` y guarda en Supabase `site_settings` (key `precios`) con la service role → llama a `VERCEL_DEPLOY_HOOK_URL` → Vercel recompila. La home es estática: `pricing-remoto.ts` (`cargarPrecios()`, await en Layout, Precios y FAQ) lee los importes al compilar con la clave pública; si falla, quedan los de `pricing.ts`. Los cambios se ven en 1-2 min.
- 🔑 **Env nueva**: `VERCEL_DEPLOY_HOOK_URL` (Vercel → Settings → Git → Deploy Hooks, rama main), cargada en Production. Es secreta: no va al repo.
- 🗄 **Proyecto Supabase de la web**: `nbtnfdntsvjwkxmkbsfh`. MCP del proyecto en `.mcp.json` (`/mcp` para autenticar). La CLI local está logueada con otra cuenta (proyecto «Joyeria»): no usarla para este proyecto.
- 🔒 **Seguridad aplicada** (migraciones en `supabase/`):
  - `migration_site_settings.sql`: tabla `site_settings` con RLS; anon/authenticated sólo SELECT de `precios`; escribe sólo la service role. En este proyecto las tablas nuevas NO reciben grants por defecto: darlos a mano.
  - `migration_clients_rls.sql`: RLS activada en `clients` (antes cualquiera con la clave pública leía y modificaba todos los clientes).
  - `migration_admin_users.sql`: tabla `admin_users` + función `es_admin()`; las reglas de acceso total (`clients`, `messages`, `project_phases`, `client_brand_info`, `uploaded_files`) y las de storage exigen `es_admin()` en vez de «cualquier sesión». Para sumar un admin: insertar su `user_id` en `admin_users`.
  - `migration_storage_sin_acceso_publico.sql`: borradas «Allow public read/upload/delete» de `client-assets` (cualquiera podía listar, subir y borrar todo). Quedan las reglas admin o cliente sobre su carpeta (header `x-client-code`, Storage lo reenvía a la RLS). El bucket sigue público para que `file_url` se vea.
  - El portal (rol anon + `x-client-code`) sigue viendo y editando sólo lo suyo; las API del servidor usan la service role y no pasan por RLS.
- ⚠️ **Pendientes**: apagar «Allow new users to sign up» en Supabase Auth (lo hace el dueño); códigos del portal adivinables (`SELVA-` + 4 dígitos); tabla `projects` abierta a todos (vacía, sin uso); 15 filas de `uploaded_files` apuntan a archivos que ya no existen; el rol `authenticated` no tiene UPDATE en `clients`, así que «generar código» en `ClientDetail.tsx` (desde el navegador) falla: pasarlo por la API; `src/types/database.ts` no coincide con supabase-js (errores de tsc en las API del admin, no frenan el build).
- 🧪 **Notas de debug**: `npm run build` en Windows termina con `EPERM ... symlink` (paso final del adapter de Vercel; el prerender sí se completa, en Vercel no pasa). Si el sitio sale sin estilos sólo en un navegador (el CSS da 404 en Chrome y anda en incógnito o en Edge), es una cookie de ese perfil que fija un deploy viejo: borrar los datos del sitio. La URL de producción que responde es `selva-digital.vercel.app`; `selvadigital.com` hoy es un dominio en venta.

## Phase 10 (Future)
- Blog with Astro content collections
- Legal pages (términos, privacidad)
- reCAPTCHA v3 for contact form
- Reemplazar Framer Motion en Header por CSS transitions (-80kB del bundle del index)
- CSP header en `vercel.json`
- A/B test del Banner modal 20% OFF (¿realmente convierte o sólo interrumpe?)

## Imágenes (nov 2026)
- Todas las imágenes de la web están en Cloudinary (cuenta `djtvjkcu6`): las propias en `SelvaDigital/web/`, el resto en `SelvaDigital/` y `ArumaLodge/`.
- Se referencian sólo desde `src/lib/cloudinary.ts` (`IMG`, `cld`, `cldSrcset`): f_auto + q_auto + ancho por srcset. No volver a guardar imágenes en `public/` (sólo favicon, robots y sitemap).
- Para agregar una: subirla a `SelvaDigital/web/`, sumar su ruta con versión a `IMG`.
- Origen y licencia de renders y fotos de stock: `docs/imagenes-origen/`.

## Precios y modalidades (nov 2026)
- Fuente única: `src/lib/pricing.ts`. La leen Precios.astro, el schema de Layout, FAQ, el formulario y los mensajes de WhatsApp. No escribir importes en componentes.
- Importes editables desde el panel `/admin/precios` (textos no). Se guardan en Supabase `site_settings` (key `precios`, migración `supabase/migration_site_settings.sql`); `pricing-remoto.ts` los aplica al compilar y, si Supabase falla, quedan los de pricing.ts. Al guardar, `/api/admin/precios` llama a `VERCEL_DEPLOY_HOOK_URL` para republicar (1-2 min).
- Webs: en la web SÓLO alta + abono mensual (hosting en servidor propio, 2 cambios chicos/mes, máx. 1 h). El pago único 50/50 no se publica: el dueño lo ofrece por privado (valor de referencia en `unico` de pricing.ts). Decisión del 15/11/2026.
- Permanencia mínima 3 meses (tienda 6); después baja libre y el sitio se apaga, salvo que el cliente lo compre descontando lo ya pagado. Dominio a nombre y cargo del cliente. Ajuste del abono cada 3 meses por IPC con aviso de 30 días.
- Chatbot: sólo dentro de la web (no WhatsApp ni Meta). Es el extra "Asistente con IA en tu web", incluido en el abono de la tienda. Ya no es un plan a medida.
- Pestañas "Páginas web" / "Sistemas para tu negocio". Sistemas se presenta por problema (ordenar la gestión, app para clientes/equipo, automatizar), con casos reales (Impasto, Megabot), proceso en 4 pasos y "Proyectos desde $1.200.000, en etapas" (`SOFTWARE` en pricing.ts).
- Chequeo: `playwright-test-selva-precios-v4.js` (scripts en %TEMP%, armados con Codex) con playwright-skill.

## Rules
- NO push to GitHub unless explicitly requested
- NO commit unless explicitly asked
- Language: Spanish for all communication
- Run `npm run build` after changes to verify

## Landing de anuncios + Pixel de Meta (16/11/2026)
- 🎯 `src/pages/web-para-tu-negocio.astro` (prerender): destino de los anuncios de Meta. Continúa el flyer 01 («Tu web profesional, sin pagar todo de golpe.»). Hero con precio del plan Landing + visor que rota webs reales (pausable, quieto con movimiento reducido), Trabajos (4 sitios), Cómo funciona + qué incluye el abono, Planes (todos los de `PLANES_WEB`), 6 preguntas, cierre. Todos los WhatsApp dicen «Vengo del anuncio».
- 🧩 `Layout.astro` acepta `variant="landing"` (sin Header/Footer del sitio; la página trae `slot="header"` y `slot="footer"`) y `waMessage` para el botón flotante. La landing vuelve a la home por el logo y el pie; la home no enlaza a la landing (no sacar visitantes de la home).
- 📈 Pixel de Meta en `Layout.astro`: ID `2366670044130352` (conjunto «Selva Digital Web») fijo en el código; `PUBLIC_META_PIXEL_ID` lo reemplaza si se carga en Vercel. Sin coincidencia avanzada automática ni API de conversiones (no hay política de privacidad todavía). PageView en cada página (también en navegación con View Transitions) y `Contact` en todo clic a `wa.me` (con `data-wa-origen` para saber qué botón); el mismo clic manda `whatsapp_click` a GA.
- 🖼 Flyers en `marketing/flyers/` (HTML + PNG 1080×1350; `render.js` con `PLAYWRIGHT_MODULE` apuntando al Playwright de la skill).
- 🎬 Reel 9:16 de 15 s en `marketing/video/reel-01/` (Remotion 4, proyecto aparte con su propio `npm install`): `npm run render` → `out/reel-01.mp4`, `npm run portada` → `out/portada-01.png`. Precios desde `src/lib/pricing.ts`; proyectos: La Casa del Lago e Impasto. Sin música (se agrega en Instagram).
- Prueba: `playwright-test-landing.js` en el scratchpad de la sesión (rotación, pausa, WhatsApp, FAQ, overflow a 1440/820/390/320, movimiento reducido).

## Phase 13 (Tablero de cobros + condiciones — 16/11/2026)
- Spec y plan: `docs/superpowers/specs/2026-11-16-tablero-clientes-cobros-design.md`, `docs/superpowers/plans/2026-11-16-tablero-clientes-cobros.md`.
- Regla de cobro (dueño): el abono vence cada mes el mismo día que `abono_inicio` (fin de mes si no existe); 10 días de aguante; día 11 = «para dar de baja». La baja la hace el dueño (apaga el sitio y marca «Dar de baja»). Cobro por transferencia, se registra a mano.
- Datos: `supabase/migration_cobros.sql` (columnas de servicio en `clients` + tabla `payments` con RLS `es_admin()`). Se aplica a mano con el OK del dueño, ANTES de publicar el código.
- API: `/api/admin/payments` (GET por cliente o rango, POST con período automático, 409 si el mes ya está pagado), `/api/admin/payments/[id]` (DELETE). `requireAuth` ahora exige estar en `admin_users` (403 si no). POST/PUT de clients filtran campos con `CAMPOS_CLIENTE`.
- Panel: bloque «Hoy» en `/admin`, `/admin/cobros`, sección «Servicio y cobros» en la ficha. «Generar código» del portal pasa por la API.
- Condiciones: `/condiciones` (prerender, textos de `CONDICIONES` en pricing.ts, enlazada desde el pie y Precios). El cliente acepta respondiendo «Acepto» por WhatsApp (`cierre-abono` / `cierre-unico`) y se registra la fecha en la ficha.
- `SITE_URL` y `CONDICIONES_URL` en constants.ts (hoy `selva-digital.vercel.app`; cambiar cuando haya dominio propio).
- Pruebas: `npm test` (node --test con `scripts/ts-resolve.mjs`, 17 casos). Playwright con API simulada: `playwright-test-cobros.js` en el scratchpad de la sesión (31 chequeos).
