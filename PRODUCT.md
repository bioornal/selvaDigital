# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primario (home pública):** dueños y socios de PyMEs y negocios de Argentina (turismo, gastronomía, retail, servicios), muchos del NEA/Córdoba, que hoy atienden todo por WhatsApp, pagan comisiones a plataformas (Booking, apps de delivery) o quedaron desconformes con una agencia. Llegan desde el celular, por recomendación, Google o Instagram. Su trabajo: decidir si este freelancer les resuelve el problema y a qué precio.
- **Clientes activos (/portal):** el cliente ya contratado carga datos del negocio y archivos para su proyecto.
- **Operador (/admin):** el propio freelancer gestiona clientes, fases del proyecto y mensajes de WhatsApp desde plantillas.

## Product Purpose

Selva Digital es la marca de un desarrollador freelance (Christian) de Córdoba que construye sitios, e-commerce, sistemas a medida y chatbots con IA para PyMEs. La home tiene que convertir a un dueño de negocio escéptico en una conversación por WhatsApp. Éxito = mensajes de WhatsApp calificados (acción principal); el formulario de contacto es secundario.

## Positioning

**Punto fuerte (decisión del usuario, 2026-11-14): sitios web y digitalización del negocio.** El argumento principal del sitio es por qué una PyME necesita una web propia (encontrable en Google, responde lo de siempre, vende y cobra 24 h, canal propio sin comisiones, confianza). Los chatbots con IA son un extra, no el protagonista.

Una sola persona que hace el sistema completo del negocio (web + cobro + caja + chatbot con IA), con precio fijo y pago único, sin cuotas ni agencia, y el hosting/dominio a nombre del cliente: "no quedás atado, el sitio es tuyo desde el día uno". Copy orientado a resultado (dolor → solución → resultado → precio), sin jerga técnica.

## Operating Context

- El visitante evalúa desde el celular; mobile escanea, no lee.
- Proyectos reales visitables (dominios propios de los clientes) son la prueba central.
- Pago: 50% al inicio, 50% contra entrega. Precios en ARS, pago único.
- Hosting y dominio aparte, contratados por el cliente (se recomienda Hostinger, ~AR$ 9.300/mes).

## Capabilities and Constraints

- Stack: Astro 5 + React 18 + TypeScript + Tailwind 3.4, adaptador Vercel; home prerenderizada. Formulario vía Resend. Admin y portal con Supabase.
- **Chatbots con IA: SOLO chat propio integrado en la web del cliente.** No se hacen bots para WhatsApp ni Meta (API de Meta, bloqueos, complejidad). Ningún copy debe prometer un bot en WhatsApp; WhatsApp es sólo el canal de contacto con Christian.
- Servicios: landing, sitio corporativo, sitio extendido, e-commerce, sistemas a medida, chatbots con IA, apps a medida, SEO.
- Precios vigentes (confirmados por el usuario el 2026-11-14, ARS, pago único, etapa de lanzamiento competitiva): Landing $250.000 · Sitio Corporativo 3-5 pág $350.000 · Sitio Extendido +5 pág $450.000 · E-commerce $1.300.000 · Sistema a medida $1.200.000 · Chatbot IA $1.500.000 · App a medida: consultar. Sin popup de descuento (eliminado por decisión del usuario).
- Datos de contacto centralizados en `src/lib/constants.ts`. Teléfono/WhatsApp correcto: **+54 9 3757 652003** (`5493757652003`). Email: info.selvadigital@gmail.com.
- Toda la comunicación en español rioplatense ("vos"), primera persona del singular (freelancer, no agencia).

## Brand Commitments

- Nombre: Selva Digital. Logo y foto de perfil en Cloudinary (ver CLAUDE.md).
- **Paleta fijada por el usuario (obligatoria):** Petrol Blue `#102D35` (fondo principal y texto sobre claro), Ice White `#E8F7F5` (secciones claras y texto sobre petróleo), Signal Lime `#D9FA57` (sólo acentos: CTAs, resaltados y detalles; nunca texto sobre fondo claro). Esmeralda `#2BB673` y cian eliminados.
- **Estilo fijado por el usuario:** tech premium tipo Nothing — tipografía grande y contundente, etiquetas en mono, mucho contraste, lima con moderación. Nada de mapas, carteles de parque ni metáforas de rutas. El portfolio con capturas reales es protagonista.
- Voz: directa, cercana, sin humo; resultado antes que tecnología.

## Evidence on Hand

- Portfolio real con sitios en producción y miniaturas: Impasto Pizzería, Aruma Lodge, La Casa del Lago, Iguazú Falls Lodge, Olietta Joyería, MegaMuebles, Megabot Admin, Social Core, Vip Traslados Iguazú, El Fogón Delivery (`src/components/Portfolio.astro`, `public/portfolio/`).
- 6 testimonios y KPIs por proyecto en `Testimonios.astro` y `Portfolio.astro`. **Pendiente de verificación por el usuario:** algunos testimonios/métricas no son 100% verificables; no agregar ni inflar números, y marcar para revisión.
- El aviso de escasez "Próxima ventana: junio 2026 · 2/3 cupos tomados" está vencido; no mostrarlo como hecho.
- No hay logos de clientes, prensa ni certificaciones: no inventarlos.

## Product Principles

1. Resultado del negocio primero, tecnología después.
2. Mostrar trabajo real y visitable en lugar de afirmarlo.
3. Transparencia comercial: precio fijo, pago único, el cliente es dueño de todo.
4. Un camino corto a WhatsApp desde cualquier punto de la página.
5. Mobile primero: cortar lo que no convierte.

## Accessibility & Inclusion

WCAG AA de contraste en texto (incluido mobile a pleno sol), foco visible, `prefers-reduced-motion` respetado, acordeones con ARIA correcto.
