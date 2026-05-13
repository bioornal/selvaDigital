# Auditoría Digital - Selva Digital

**Fecha:** 2026-05-10
**Auditor:** Consultor Senior de Estrategia Digital
**Proyecto:** Selva Digital - Desarrollo Web Profesional
**Stack:** Astro 4.16 + React 18 + Tailwind CSS + Vercel Serverless

---

## 1. Propuesta de Valor y UX/UI

### Claridad del mensaje (Test de 5 segundos)
**Veredicto: Mejorable**
- El Hero utiliza un efecto typewriter con 5 frases rotativas que, si bien muestran versatilidad, dificultan la lectura rápida del valor principal. Un visitante no captará el mensaje completo en 5 segundos.
- La propuesta ("Transformando la comunicación empresarial") es genérica y no diferencia a Selva Digital de cualquier otro desarrollador freelance.
- **Falta un H1 claro y estático** que diga exactamente qué venden. El typewriter nunca llega a ser un H1 semántico claro.

### Diseño Visual
**Veredicto: Moderno pero con inconsistencias críticas**
- **Puntos positivos:** Uso de glassmorphism, gradientes sutiles, dark mode por defecto, animaciones con Framer Motion. El stack tecnológico mostrado (React, Next.js, Astro, TypeScript) proyecta solidez técnica.
- **Problemas graves:**
  - El `global.css` fuerza `font-family: 'Geist Mono'` y `font-weight: 100` en **todos los `h2`, `span` y `p`**. Esto hace que TODO el sitio use una fuente monoespaciada ultra-fina (weight 100), lo cual es **ilegible en párrafos largos** y fatiga visualmente. Una fuente monoespaciada thin no es adecuada para lectura de cuerpo de texto.
  - El Header tiene fondo `bg-gray-50` (claro) mientras el resto del sitio es dark mode. Esto crea un choque visual brusco: llegás del header blanco a secciones oscuras sin transición armónica.
  - El logo en el header tiene `marginTop: '-110px', marginBottom: '-110px'`, un hack que probablemente cause overflow o clipping en ciertos viewports.

### Navegabilidad y Embudo de Conversión
**Veredicto: Funcional pero con fricción**
- La navegación es anclada (scroll a secciones), lo cual es correcto para una one-page.
- **Problema:** El menú móvil se abre con un botón hamburguesa, pero no hay overlay que bloquee el scroll del body, lo que puede causar experiencia confusa.
- El embudo es: Hero -> Servicios -> Sobre Nosotros -> Portfolio -> Precios -> Contacto. Lógico, pero **falta un CTA intermedio** entre Servicios y Portfolio para captar leads que no lleguen al final.

---

## 2. Auditoría Técnica (Performance y SEO)

### Stack Tecnológico
**Astro 4.16 + React 18 + Tailwind CSS + Vercel Serverless**
- **Ventaja competitiva:** Astro es excelente para estáticos/SEO por su hidratación parcial. Sin embargo, el sitio está configurado con `output: 'server'` y adapter Vercel serverless. Para una one-page informativa sin contenido dinámico por usuario, **esto es over-engineering** que añade cold starts innecesarios y aumenta el TTFB.
- El uso de `@react-three/fiber` y `@react-three/drei` en el Hero (AnimatedShape) carga Three.js completo. Esto es **masivo para un simple icosaedro wireframe**. Se podría reemplazar por una animación CSS o SVG con 1% del peso.

### Performance (Análisis estático de código)
- **LCP (Largest Contentful Paint) Riesgo ALTO:** El Hero carga una imagen de Unsplash de 2070px de ancho como background. No hay `loading="lazy"` (no aplica para LCP) ni `fetchpriority="high"`, pero el tamaño original es enorme.
- **CLS (Cumulative Layout Shift) Riesgo MEDIO:** El Hero tiene `min-h-[75vh]` a `min-h-screen` según breakpoints, pero el contenido interno usa márgenes negativos (`mt-[20px]`, `xs:mt-[-10px]`, etc.) que son extremadamente frágiles y pueden causar saltos de layout al cargar fuentes o al redimensionar.
- **JavaScript excesivo:** Framer Motion, Three.js, Typewriter-effect, Formik + Yup. Para una landing page, esto genera bundles grandes. Astro mitiga esto con `client:load` selectivo, pero el Hero se hidrata completo con React.

### SEO On-Page
**Veredicto: Básico, con errores estructurales**

| Elemento | Estado | Observación |
|----------|--------|-------------|
| Title | ✅ | Correcto, pero genérico |
| Meta description | ✅ | Presente, pero no optimizada para CTR |
| Keywords meta | ⚠️ | Obsoleta para Google desde 2009, no daña pero no ayuda |
| OG Tags | ✅ | Básicos presentes |
| Twitter Card | ✅ | Presente |
| Canonical | ❌ | No hay tag canonical |
| H1 | ❌ | **No existe un H1 claro**. El typewriter no es H1 |
| H2 | ✅ | Múltiples, pero con estilos forzados en CSS global que pueden sobreescribir Tailwind |
| Jerarquía H | ⚠️ | El H2 "Por qué elegir Selva Digital" viene antes que cualquier H1 visible |
| Schema.org | ❌ | Sin datos estructurados (LocalBusiness, Service, etc.) |
| Sitemap XML | ❌ | No existe |
| Robots.txt | ❌ | No existe |
| Alt texts | ⚠️ | Presentes en imágenes locales, pero el placeholder `picsum.photos` en Portfolio tiene alt genérico |
| Internal links | ✅ | Navegación por anclas correcta |

### Keywords Transaccionales
- El sitio NO ataca keywords transaccionales en sus H2:
  - "Por qué elegir Selva Digital" -> Branded, no transaccional
  - "Soluciones Digitales para tu Negocio" -> Genérico
  - "Nuestro Portfolio" -> Navegacional
  - "Planes de Diseño Web" -> La más cercana a transaccional, pero debería ser "Diseño web profesional para empresas" o "Desarrollo de tiendas online"
- **Falta contenido de blog o secciones de texto largo** que permitan posicionar por cola larga.

---

## 3. Autoridad y Social Proof

### Portfolio
**Veredicto: Débil, dañino para la conversión**

- **Solo 3 proyectos:**
  1. El Fogón Delivery (Next.js, Firebase) - imagen local
  2. Iguazú Falls Lodges (React, Node.js) - imagen local
  3. Aplicación de Fitness - **usa `https://picsum.photos/800/600?random=3`** como imagen. Esto es **inaceptable** para una agencia que vende diseño web. Proyecta amateurismo y falta de proyectos reales.

- **GitHub links:** Todos apuntan a `#` (inactivos). Esto es sospechoso. Si no son open source, no debería haber icono de GitHub.

- **Faltan:** métricas de resultados (tráfico, conversiones, ROI para el cliente), testimonios de los dueños de esos negocios, estudios de caso detallados.

### Confianza y Credibilidad
**Veredicto: Insuficiente**

| Elemento | Estado | Impacto |
|----------|--------|---------|
| Testimonios de clientes | ❌ | **No existen**. Cero. |
| Certificaciones Google/AWS/Microsoft | ❌ | Ninguna |
| Badges de confianza | ⚠️ | Badges en Hero ("Premiados 2023", "Garantía 100%") pero sin link ni evidencia. "Premiados 2023" por quién? |
| Datos de empresa | ❌ | No hay CUIT, razón social, dirección física exacta |
| Términos legales | ❌ | No hay página de términos, privacidad, ni disclaimer de protección de datos personales (LGPD/PDPA si atienden Argentina) |
| Seguridad | ⚠️ | El formulario no usa reCAPTCHA/hCaptcha (la API espera `hcaptchaToken` pero el frontend no lo envía) |
| Fotos del equipo | ❌ | No hay rostros humanos. El "equipo profesional" es una afirmación sin respaldo visual |

---

## 4. Análisis de Conversión (CRO)

### Call to Action (CTA)
**Veredicto: Múltiples pero desalineados**

| CTA | Texto | Problema |
|-----|-------|----------|
| Hero | "Potencia tu presencia digital" | Vago, no indica el siguiente paso concreto |
| Header Desktop | "PIDA PRESUPUESTO" | Mayúsculas agresivas, pero claro |
| Header Mobile | "PIDA PRESUPUESTO" | Bien posicionado arriba del menú |
| Planes | "Solicitar presupuesto" | Genérico, no diferencia por plan |
| WhatsApp flotante | Icono verde | Correcto, con mensaje predefinido |
| Banner oferta | "¡Aprovecha ahora!" | Urgencia artificial con contador regresivo que reinicia al recargar (no persistente) |

**Problemas de CRO:**
1. **El CTA del Hero no especifica el beneficio inmediato.** Debería ser "Solicitar presupuesto gratis" o "Ver planes desde $400.000".
2. **No hay CTA secundario** para usuarios no listos para comprar (ej: "Ver portfolio" o "Descargar guía").
3. **El banner de oferta usa `useEffect` con `setTimeout` de 2 segundos y un contador que inicia en 47:59:59**. Al recargar la página, el contador se resetea. Esto es **dark pattern** detectable por usuarios y puede generar desconfianza.

### Formulario de Contacto
**Veredicto: Bien calibrado pero con riesgo técnico**

- **Campos:** Nombre, Email, Mensaje. Es la cantidad justa para calificar un lead sin fricción excesiva.
- **Validación:** Yup con regex de nombre y apellido, email válido, mínimo 10 caracteres. Correcto.
- **Problema crítico:** La API espera `hcaptchaToken` pero el frontend de Contact.tsx **no implementa ningún captcha**. Esto significa que todos los envíos desde el frontend fallarán en el backend por validación de `hcaptchaToken`.
- **UX del formulario:** El botón se deshabilita si no es válido/dirty. Correcto. Pero usa `alert('Mensaje enviado con éxito')` que bloquea el thread del navegador. Debería ser un toast o mensaje inline.
- **Falta campo de presupuesto estimado o tipo de proyecto**, que ayudaría a calificar leads.

---

## Resumen Ejecutivo

### Puntos Fuertes
1. **Stack moderno y escalable:** Astro + React + Tailwind + Vercel es una elección técnica sólida para 2026.
2. **Mobile-first responsive:** Implementación cuidadosa con breakpoints (`sm:hidden`, `hidden md:grid`) y adaptación de tipografías/espaciados.
3. **Animaciones refinadas:** Glassmorphism, hover effects, transiciones suaves. Visualmente atractivo para un público joven/tech.
4. **Formulario con validación robusta:** Yup + Formik con feedback inmediato.
5. **Multi-canal de contacto:** Formulario + WhatsApp flotante + email/ teléfono visibles. Facilita la conversión según preferencia del usuario.

### Debilidades Críticas
1. **Tipografía monoespaciada thin aplicada globalmente** destruye la legibilidad del contenido y proyecta amateurismo tipográfico.
2. **Portfolio con imagen placeholder (picsum.photos)** y GitHub links rotos. Daña la credibilidad profesional severamente.
3. **Cero testimonios, cero certificaciones, cero datos legales.** No hay elementos de confianza para justificar precios de $400.000-$1.050.000 ARS.
4. **Falta de SEO técnico:** No hay H1 semántico, sitemap, robots.txt, datos estructurados Schema.org, ni contenido para cola larga.
5. **Urgencia artificial no persistente** en el banner de oferta (contador que reinicia) puede ser percibido como engañoso.

---

## Hoja de Ruta: 5 Mejoras Prioritarias para Aumentar Ventas

### 1. Inmediata (Semana 1): Arreglar Tipografía y Legibilidad
**Impacto: Alto | Esfuerzo: Bajo**
- Eliminar el `global.css` que fuerza Geist Mono weight 100 en todos los textos. Usar una fuente sans-serif (Inter, Geist Sans) para cuerpo de texto y reservar Geist Mono solo para acentos/código.
- Corregir el header para que use el mismo fondo oscuro que el resto del sitio o una transición suave.

### 2. Inmediata (Semana 1-2): Reforzar Portfolio y Social Proof
**Impacto: Crítico | Esfuerzo: Medio**
- Reemplazar la imagen de Picsum en "Aplicación de Fitness" por una captura real o eliminar el proyecto hasta tener material profesional.
- Eliminar los iconos de GitHub si los repos no son públicos.
- Añadir **3 testimonios reales** con foto/nombre/empresa del cliente. Si no hay, ofrecer un descuento a cambio de uno.
- Añadir una foto del equipo/fundador en la sección "Sobre Nosotros" para humanizar la marca.

### 3. Corto plazo (Semana 2-3): SEO Técnico y Contenido
**Impacto: Alto | Esfuerzo: Medio**
- Crear un H1 estático claro en el Hero: *"Diseño y desarrollo web profesional para empresas en Argentina"*.
- Implementar Schema.org `LocalBusiness` y `Service` en el Layout.
- Generar `sitemap.xml` y `robots.txt`.
- Crear una página de blog o al menos una sección de FAQs que ataque keywords como *"cuánto cuesta una página web en Argentina"*, *"diferencia entre landing page y sitio corporativo"*, etc.

### 4. Corto plazo (Semana 3): Optimizar Performance y CRO
**Impacto: Alto | Esfuerzo: Medio**
- **Eliminar Three.js** del Hero y reemplazar el icosaedro por una animación CSS/SVG o un video ligero. Reducirá el bundle en ~150KB+.
- Añadir un campo "Tipo de proyecto" (select) en el formulario para calificar leads.
- Reemplazar el `alert()` por un toast visual no intrusivo.
- Hacer persistente la oferta del banner (localStorage) o eliminar el contador regresivo falso.

### 5. Mediano plazo (Mes 1-2): Autoridad y Legalidad
**Impacto: Medio | Esfuerzo: Medio-Alto**
- Crear páginas legales: Términos y Condiciones, Política de Privacidad, Protección de Datos Personales (Ley 25.326 Argentina).
- Implementar reCAPTCHA v3 invisible en el formulario de contacto.
- Considerar obtener al menos una certificación gratuita (Google Analytics, Meta Blueprint) para mostrar badges reales.
- A/B test en el CTA del Hero: probar *"Solicitar presupuesto gratis"* vs *"Ver planes desde $400.000"* vs *"Agendar llamada gratuita"*.

---

## Conclusión

Selva Digital tiene una base técnica moderna y un diseño visualmente ambicioso, pero **sufre de una crisis de credibilidad** (portfolio débil, sin testimonios, sin datos legales) y **problemas de usabilidad** (tipografía ilegible, falta de SEO básico).

**Las mejoras 1 y 2 son imperativas antes de cualquier inversión en tráfico pagado**, ya que actualmente el sitio convierte pese a sí mismo, no gracias a su diseño.

---

---

## 5. Auditoría Gemini Expert Designer (2026-05-12)

**Foco:** Frontend Architecture & Visual High-Impact Upgrade

### Diagnóstico de Interfaz "Futurista"
El sitio actual emplea una estética inspirada en el Cyberpunk, pero la ejecución técnica es fragmentada. Se detecta un uso inconsistente de los fondos oscuros y una dependencia excesiva de componentes React para maquetación estática.

### Hallazgos Clave & Propuestas de Mejora
1.  **Arquitectura de Islas:** El `Hero.tsx` es una isla monolítica. Se propone migrar la estructura base a `Hero.astro`, dejando React exclusivamente para el efecto `Typewriter` y los `AnimatedOrbs`. Esto reducirá el JS inicial y mejorará el TBT.
2.  **Sistematización HUD (Heads-Up Display):** Para elevar el tono "Tecnológico", se recomienda implementar un sistema de bordes y micro-interacciones tipo HUD. Esto incluye el uso de `clip-path` para esquinas hexagonales y utilidades Tailwind personalizadas como `.cyber-border`.
3.  **Consistencia Tipográfica:** Es crítico eliminar el peso de fuente 100 aplicado globalmente. Se propone:
    *   **Nova Square:** Reservada estrictamente para Headings (H1, H2) con `text-transform: uppercase`.
    *   **JetBrains Mono:** Para etiquetas de datos, precios y micro-labels técnicos.
    *   **Inter:** Para cuerpo de texto con peso mínimo de 400 para asegurar legibilidad.
4.  **Optimización de Media:** Sustituir los videos MP4 pesados por formatos `.webm` con codificación AV1, permitiendo transparencias y reduciendo el peso en un 40-50%.
5.  **SEO Semántico:** Envolver el mensaje principal del Hero en un tag `H1` estático, permitiendo que el efecto Typewriter actúe como un decorador visual sin romper la jerarquía de indexación.

*Consulte el archivo `index.html` en la raíz para ver el dashboard interactivo de esta auditoría.*
