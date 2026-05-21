# Selva Digital — Project Context

## Identity
- Freelancer portfolio site (NOT agency/company). First-person singular throughout
- Name: Selva Digital
- Location: Córdoba, Argentina
- Market: National Argentina (PyMEs/negocios)
- Differentiator: AI chatbots + outcome-led positioning ("less time lost, more sales", no jargon)
- Commercial model: pago único, 50% inicio + 50% contra entrega. NO hosting/dominio incluido — el cliente lo contrata a su nombre (recomendamos Hostinger, ~AR$ 9.300/mes). Esto evita atar al cliente al freelancer y baja la fricción de venta.

## Contact Info
- Phone: `+54 9 3548 550334`
- WhatsApp: `5493548550334`
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
- Typography: Nova Square (headings) + Inter (body) + JetBrains Mono (code)
- Colors: `azure-radiance` (primary blue) + `ai-violet` (AI section accent)
- Buttons: ALL CTA/action buttons use `rounded-none` (90° rectangular corners)
- Decorative elements (badges, tags, orbs, profile photo, WhatsApp float) retain `rounded-full`
- All prices in ARS, one-time payment (50/50 inicio/entrega)
- Copy style: outcome-led (dolor → solución → resultado → precio). Avoid provider-jargon (Core Web Vitals, agéntico, multi-bot multiusuario, etc.) in customer-facing surfaces.
- User communicates in Spanish (rioplatense — usar "desde" not "basado en", "vos" not "tú", etc.)

## File Structure
```
src/
├── components/
│   ├── Header.tsx          — max-w-[1400px], 4 menu items, compact "PIDA PRESUPUESTO" button
│   ├── Hero.tsx            — Video bg (Cloudinary), AnimatedOrbs, 34 tech logos, typewriter, 2 CTA buttons
│   ├── Services.astro      — Merged About+Services: profile photo, bio, services, process steps
│   ├── Portfolio.astro     — 9 projects, uses ProjectCard.astro (no inline duplication)
│   ├── ProjectCard.astro   — Reusable project card (mobile + desktop variants)
│   ├── AIChatbots.astro    — Neural Interface design: centered header, 2-col stretch layout, video left, 6 cards + CTA right
│   ├── Apps.astro          — Static AI image with gradient glow, feature list, CTA
│   ├── Precios.astro       — 7 plans, uses PlanCard.astro (no inline duplication)
│   ├── PlanCard.astro      — Reusable pricing card (mobile + desktop + advanced variants)
│   ├── FAQ.astro           — 8 questions, vanilla JS accordion
│   ├── Contact.tsx         — Form (Formik+Yup), Resend email, phone, email, location
│   ├── Banner.tsx          — 20% OFF discount banner (honest, no fake countdown)
│   ├── Footer.astro        — Menu, email, phone, logo
│   ├── WhatsAppButton.tsx  — Floating WhatsApp button
│   ├── WaveSeparator.astro — Wave SVG separator
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
│   ├── index.astro         — Hero → Wave → Services → Portfolio → AIChatbots → Apps → Precios → FAQ → Contact
│   ├── admin/
│   │   ├── login.astro        — Admin login page
│   │   ├── index.astro        — Admin dashboard
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
│           └── send-message.ts         — POST message from template
└── styles/
    └── global.css          — Typography rules + heroFade keyframe
```

## AIChatbots Section (latest redesign)
- Esthetic: "Neural Interface" — dark, cinematic, neon violet accents
- Layout: centered header (badge + title + subtitle), then flex 2-col with `align-items: stretch`
- Left col: vertical video (220px, `height: 100%`, scanline overlay, neon border with box-shadow, `playbackRate: 0.5`)
- Right col: flex column with `flex: 1` cards grid + `flex: 1` CTA box — both stretch to match video height
- Cards: border-left violet accent, hover glow, staggered fadeIn entrance
- CTA: `rounded-none` button with sweep glow hover effect
- Custom CSS (scoped `<style>`), no Tailwind utility classes in this component
- Video playbackRate set via `<script>` tag

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

## Phase 6 (Future)
- Blog with Astro content collections
- Legal pages (términos, privacidad)
- reCAPTCHA v3 for contact form
- Client testimonials con datos reales (desbloquea stats outcome del Hero)

## Rules
- NO push to GitHub unless explicitly requested
- NO commit unless explicitly asked
- Language: Spanish for all communication
- Run `npm run build` after changes to verify
