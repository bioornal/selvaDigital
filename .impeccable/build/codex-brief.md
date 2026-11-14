# Brief común — rediseño Selva Digital (para agentes Codex)

Proyecto: Astro 5 + React 18 + Tailwind 3.4. Raíz: este repo. Idioma de todo el copy: español rioplatense ("vos"), primera persona del singular (freelancer, no agencia).

## Reglas duras
- Tocá SOLO los archivos que te asignaron. No edites `src/styles/global.css`, `tailwind.config.js`, `src/layouts/Layout.astro`, `Header.tsx`, `Hero.astro` ni `src/pages/index.astro` (los maneja el orquestador). Si necesitás una utilidad global nueva, definila con `<style>` scoped dentro de tu componente.
- NO corras `npm run build`, `npm run dev`, `git commit` ni `git push`. El orquestador compila y verifica.
- Conservá TODO el contenido real (textos, precios, proyectos, testimonios, URLs, FAQs) salvo que la tarea diga lo contrario. No inventes métricas, clientes ni claims. Precios: dejá exactamente los valores que ya están en el código (USD).
- Eliminá todo rastro de la paleta vieja: `#2BB673` (esmeralda), `#00E5FF` (cian), `#0A0B0D`, `#121316`, `#1A1C20`, `#8B5CF6` (violeta), `rgba(250,250,250,…)`, `rgba(43,182,115,…)`, y las fuentes `Geist` (no-mono), `Inter`, `JetBrains Mono` en estilos inline.
- Sin kickers/eyebrows encima de los títulos (ej. "02 ─── Portfolio") y sin numerar secciones. Sin gradientes de texto, sin glows, sin glassmorphism/backdrop-blur, sin sombras de color, sin "spotlight cards", sin dot-grid de fondo, sin emojis ni glifos unicode como íconos (usá `lucide-react` o SVG propio, trazo consistente). Sin borde de color a la izquierda de cards.
- Botones y controles de acción: esquinas a 90° (clases `.btn .btn-lime` / `.btn-ghost` / `.btn-petrol`). Cards con radio 0 también (mundo de hardware: rectángulos y hairlines de 1px).
- Accesibilidad: contraste AA, `:focus-visible` (ya global), `aria-*` correctos, `prefers-reduced-motion` respetado, HTML semántico. Mobile primero: probá mentalmente 360px.

## Sistema visual (ya definido en `src/styles/global.css` — usalo)
Paleta (tokens CSS):
- `--petrol #102D35` fondo dominante · `--petrol-deep #0B2128` · `--petrol-raised #163B45`
- `--ice #E8F7F5` bandas claras y texto sobre petróleo
- `--lime #D9FA57` SOLO acentos: CTAs, resaltados, puntos de estado. NUNCA texto lima sobre fondo claro. Usalo con moderación para que explote (1–2 apariciones por sección).
- Texto sobre petróleo: `--on-petrol`, `--on-petrol-soft` (secundario), `--on-petrol-dim` (terciario), líneas `--line-petrol`, `--line-petrol-strong`
- Texto sobre hielo: `--on-ice`, `--on-ice-soft`, `--on-ice-dim`, líneas `--line-ice`, `--line-ice-strong`
Clases de superficie: `.on-petrol`, `.on-deep`, `.on-ice` (setean fondo + color). `.wrap` = contenedor (max 1360px + gutter). `.section` = padding vertical de sección.
Tipografía:
- Display/body: Archivo (variable, eje `wdth`). Clases: `.display` (titular grande), `.h2` (título de sección, ~84px máx), `.h3`, `.lede` (bajada).
- `.mono` = Geist Mono 12px mayúsculas espaciadas: SOLO para metadatos, datos, medidas, etiquetas de formulario, pies de foto, stack técnico. No para títulos.
- `.dot-num` = Doto (matriz de puntos) para precios y numerales destacados.
Otros: `.status-dot` (punto lima 8px), `.link` (subrayado con offset), `.rule` (hairline), `.snap-row` (fila horizontal con scroll-snap para mobile; agregá `data-snap-count="id"` en la fila y un `<p class="mono" data-snap-out="id">` para el contador "01 / 06", el JS ya está en Layout).
Tailwind tiene `bg-petrol`, `bg-petrol-deep`, `bg-ice`, `bg-lime`, `text-ice`, `font-display`, `font-mono`, `font-dot`. Preferí las clases/tokens de arriba sobre valores sueltos.

Estilo: tech premium tipo Nothing — tipografía grande y contundente, alto contraste, etiquetas mono, hairlines, rectángulos, mucho aire. Ritmo: una sección densa se compensa con una calma. Más espacio arriba de un título que abajo.

## Datos
`src/lib/constants.ts`: `WHATSAPP_URL`, `CONTACT_PHONE` (+54 9 3757 652003), `CONTACT_EMAIL`, y `whatsappLink(texto)` que devuelve el link de WhatsApp con mensaje ya escrito. Toda acción principal = WhatsApp con mensaje pre-armado relevante a la sección. Ícono: `import WaIcon from './ui/WaIcon'` (React, se puede usar en .astro: `<WaIcon size={18} />`).

## Referencia
Mirá `src/components/Hero.astro` y `src/components/Header.tsx` como implementación modelo del sistema (estructura, tokens, `<style>` scoped, estados hover/focus).

## Orden y fondos de la home
Hero (petrol) → Portfolio `#portfolio` (deep) → Servicios `#servicios` (ice) → Chatbots `#chatbots` (petrol) → Sobre mí `#sobre` (deep) → Manifiesto `#manifiesto` (ice) → Testimonios `#testimonios` (petrol) → Precios `#planes` (ice) → FAQ `#faq` (petrol) → Contacto `#contacto` (deep) → Footer (petrol).
Mantené los `id` de sección indicados.

## Al terminar
Respondé con: archivos tocados, decisiones de diseño (3–5 líneas), cualquier contenido que eliminaste o moviste y por qué, y dudas abiertas.

---

# RONDA 2 — Armonía de información (decidido por el usuario, 2026-11-14)

## Verdades nuevas de producto (obligatorias)
- **Los chatbots con IA son SOLO chat propio integrado en la web del cliente.** No se hacen bots de WhatsApp ni de Meta. Ningún texto puede sugerir un bot en WhatsApp ("integración con WhatsApp", "tu WhatsApp responde solo", etc.). WhatsApp es sólo el canal para hablar con Christian.
- Precios en ARS (ver `Precios.astro`). Sin popup de descuento.

## Nueva estructura de la home (8 secciones, cada dato en UN solo lugar)
1. Hero (`#hero`, petrol) — manifiesto tipográfico. Sin proyectos.
2. Trabajos (`#portfolio`, deep) — ÚNICO lugar con proyectos y métricas/KPIs.
3. Qué resuelvo (`#servicios`, ice) — servicios como problema → solución, SIN precios. El chatbot con IA para la web es el servicio destacado y lleva la demo de chat (ChatPreview). La sección `AIChatbots` desaparece (su contenido útil se integra acá).
4. Cómo trabajo (`#sobre`, deep) — Sobre mí + los 3 compromisos del Manifiesto + los 4 pasos, en una sola sección. `Manifiesto.astro` desaparece.
5. Testimonios (`#testimonios`, petrol) — sólo citas + nombre + rol + proyecto. SIN KPIs.
6. Precios (`#planes`, ice) — ÚNICO lugar con precios, 50/50 y hosting.
7. Preguntas (`#faq`, petrol) — sin las preguntas que ya responde Precios (precio único/mensualidades, costo de hosting, si no quiero Hostinger) ni las que responde Cómo trabajo (trabajás solo o con equipo).
8. Contacto (`#contacto`, deep).

## Qué destacar con acentos lima (decidido por el usuario)
Sólo dos cosas reciben el énfasis lima fuerte (bloque, marca gráfica o etiqueta lima), además de los CTAs:
- **Trabajos reales visitables** (en Trabajos): que se note que son sitios en producción que se pueden abrir ya.
- **Trato directo conmigo** (en Cómo trabajo y Contacto): una sola persona de punta a punta, respuesta en menos de 24 h, sin agencia.
Todo lo demás, sin lima. Recordá: lima nunca como texto sobre fondo claro (en `.on-ice` usalo sólo como relleno de bloque con texto petróleo encima, o como punto).

## Títulos
Cada sección con una forma propia: NO repetir la fórmula "Frase. / segunda línea en color suave" en todas. Variá: una pregunta, una afirmación de una línea, una cifra, un nombre propio, etc. Copy rioplatense, primera persona singular, resultado antes que tecnología.
