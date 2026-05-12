# Selva Digital — Project Context

## Identity
- Freelancer portfolio site (NOT agency/company). First-person singular throughout
- Name: Selva Digital
- Location: Córdoba, Argentina
- Market: National Argentina (PyMEs/negocios)
- Differentiator: AI chatbots (agénticos)

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
- All prices in ARS, one-time payment
- User communicates in Spanish

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
│   └── ui/                 — button, card, input, textarea (all use cn())
├── lib/
│   ├── utils.ts            — cn() helper (clsx + tailwind-merge)
│   └── constants.ts        — WHATSAPP_NUMBER, WHATSAPP_URL, CONTACT_PHONE, CONTACT_EMAIL
├── utils/
│   └── analytics.ts        — Google Analytics event sender
├── layouts/
│   └── Layout.astro        — Schema.org Person, security headers, font preload, SEO
├── pages/
│   ├── index.astro         — Hero → Wave → Services → Portfolio → AIChatbots → Apps → Precios → FAQ → Contact
│   └── api/contact.ts      — POST endpoint: escapeHtml, rate limiting (5/min), env validation, no error leak
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

## Phase 4 (Future)
- Blog with Astro content collections
- Legal pages (términos, privacidad)
- reCAPTCHA v3 for contact form
- Client testimonials

## Rules
- NO push to GitHub unless explicitly requested
- NO commit unless explicitly asked
- Language: Spanish for all communication
- Run `npm run build` after changes to verify
