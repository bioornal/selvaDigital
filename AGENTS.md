# Selva Digital — Project Context

## Identity
- Freelancer portfolio site (NOT agency/company). First-person singular throughout
- Name: Selva Digital
- Location: Córdoba, Argentina
- Market: National Argentina (PyMEs/negocios)
- Differentiator: AI chatbots + outcome-led positioning ("less time lost, more sales", no jargon)
- Commercial model: pago único, 50% inicio + 50% contra entrega. NO hosting/dominio incluido — el cliente lo contrata a su nombre (recomendamos Hostinger, ~AR$ 9.300/mes). Esto evita atar al cliente al freelancer y baja la fricción de venta.

## Contact Info
- Phone: `+54 9 3548 403786`
- WhatsApp: `5493548403786`
- Email: `info.selvadigital@gmail.com`
- Logo: `https://res.cloudinary.com/djtvjkcu6/image/upload/v1778510560/SelvaDigital/logoChico2_kg35ot.png`
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
- Typography: Geist (headings) + Inter (body) + JetBrains Mono (code/kickers)
- Colors:
  - Accent principal: **Emerald `#2BB673`** (CTAs, kickers, highlights de texto y "featured")
  - Acento secundario: **Electric Cyan `#00E5FF` / `rgba(0, 229, 255, 0.45)`** — separadores globales entre secciones, barra de progreso de scroll, líneas sutiles
  - Background: `#0A0B0D` (body) / `#121316` (surface)
  - Text: `white #FAFAFA` / `textSoft rgba(250,250,250,0.72)` / `textDim rgba(250,250,250,0.58)` (boosted vía global.css para cumplir WCAG AA)
  - NOTA: las clases Tailwind legacy `azure-radiance` y `ai-violet` quedaron del design system anterior y NO se usan en componentes activos (sólo en el config de Tailwind por compatibilidad).
- Buttons: ALL CTA/action buttons use `rounded-none` (90° rectangular corners)
- Decorative elements (badges, tags, orbs, profile photo, WhatsApp float) retain `rounded-full`
- All prices in ARS, one-time payment (50/50 inicio/entrega)
- Copy style: outcome-led (dolor → solución → resultado → precio). Avoid provider-jargon (Core Web Vitals, agéntico, multi-bot multiusuario, etc.) in customer-facing surfaces.
- User communicates in Spanish (rioplatense — usar "desde" not "basado en", "vos" not "tú", etc.)

## File Structure
```
src/
├── components/
│   ├── Header.tsx          — max-w-[1320px], 5 menu items, "Pedir presupuesto →" CTA emerald
│   ├── Hero.astro          — Video bg desktop / dot grid mobile, eyebrow cupos, stats grid, microcopy
│   ├── ServicesV2.astro    — 5 service cards (sitios, e-commerce, sistemas, chatbots, SEO)
│   ├── Portfolio.astro     — 9 proyectos con KPI y stack visible (inline, sin sub-component)
│   ├── AboutV2.astro       — Foto perfil + bio + KPIs + stack + tabla "cómo trabajo" (mobile accordion)
│   ├── Manifiesto.astro    — 3 pilares con íconos (precio fijo / respuesta directa / pago único)
│   ├── Testimonios.astro   — 6 testimonios reales con avatares iniciales + KPI badge
│   ├── AIChatbots.astro    — 2-col: kicker+title+6 cards+CTAs (izq) + ChatPreview React (der, md+)
│   ├── ChatPreview.tsx     — Animated chat demo (client:visible)
│   ├── Apps.astro          — Static AI image con gradient glow, feature list, CTA
│   ├── Precios.astro       — 7 planes con tabs (Webs / Sistemas), pricing inline (sin PlanCard)
│   ├── FAQ.astro           — 9 preguntas, vanilla JS accordion, aria-controls + focus visible
│   ├── Contact.tsx         — Form (Formik+Yup) + presupuesto toggle, Resend email
│   ├── Banner.tsx          — 20% OFF discount banner (localStorage, sin fake countdown)
│   ├── Footer.astro        — Menu, email, phone, logo, socials
│   ├── WhatsAppButton.tsx  — Floating WhatsApp button
│   ├── SectionDivider.astro — Divisor cian sutil entre secciones
│   ├── admin/
│   │   ├── AdminLogin.tsx     — Supabase auth login form
│   │   ├── AdminDashboard.tsx — Stats + clients table + navigation
│   │   ├── ClientForm.tsx     — Create/edit client with project details
│   │   └── ClientDetail.tsx   — Client info, phases, message composer
│   └── ui/                 — button, card, input, textarea (all use cn())
├── lib/
│   ├── utils.ts            — cn() helper (clsx + tailwind-merge)
│   ├── constants.ts        — WHATSAPP_NUMBER, WHATSAPP_URL, CONTACT_PHONE, CONTACT_EMAIL
│   ├── supabase.ts         — Browser Supabase client (anon key)
│   ├── supabase-server.ts  — Server Supabase client (service role key)
│   └── templates.ts        — 10 WhatsApp message templates with variable rendering
├── types/
│   ├── admin.ts            — Client, ProjectPhase, Message types + status maps
│   └── database.ts         — Supabase Database TypeScript types
├── utils/
│   └── analytics.ts        — Google Analytics event sender
├── layouts/
│   ├── Layout.astro        — Schema.org Person, security headers, font preload, SEO
│   └── AdminLayout.astro   — Minimal dark layout for admin panel
├── pages/
│   ├── index.astro         — Hero → Services(01) → Portfolio(02) → AboutV2(03) → Manifiesto(04) → Testimonios(05) → AIChatbots(06) → Apps(07) → Precios(08) → FAQ(09) → Contact(10). Prerender estático.
│   ├── admin/
│   │   ├── login.astro        — Admin login page
│   │   ├── index.astro        — Admin dashboard
│   │   └── clientes/
│   │       ├── nuevo.astro    — New client form
│   │       └── [id].astro     — Client detail page
│   └── api/
│       ├── contact.ts         — POST: escapeHtml, rate limiting, env validation
│       ├── banner.ts
│       ├── keep-alive.ts      — GET: ping diario a Supabase vía Vercel Cron (evita pausa free tier; proteger con CRON_SECRET)
│       └── admin/
│           ├── clients.ts              — GET/POST clients
│           ├── clients/[id].ts         — GET/PUT/DELETE client
│           ├── clients/[id]/phases.ts  — GET/POST phases
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
- 📋 `.env.example` created (RESEND_API_KEY, CONTACT_EMAIL, PUBLIC_GA_ID) — luego se agregaron keys de Supabase y CRON_SECRET
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
- 💸 Pricing simplificado: Landing $350, Sitio Corp 3-5pg $450, Sitio Extendido +5pg $550, E-commerce $1.200, Sistema a medida $1.500, Chatbot IA $1.500, App a medida $1.500.
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

## Phase 10 (Future)
- Blog with Astro content collections
- Legal pages (términos, privacidad)
- reCAPTCHA v3 for contact form
- Reemplazar Framer Motion en Header por CSS transitions (-80kB del bundle del index)
- CSP header en `vercel.json`
- A/B test del Banner modal 20% OFF (¿realmente convierte o sólo interrumpe?)

## Rules
- NO push to GitHub unless explicitly requested
- NO commit unless explicitly asked
- Language: Spanish for all communication
- Run `npm run build` after changes to verify
