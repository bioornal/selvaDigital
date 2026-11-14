---
name: "Selva Digital"
description: "Sistema tech premium del portfolio freelance y sus herramientas operativas."
colors:
  petrol: "#102D35"
  petrol-deep: "#0B2128"
  petrol-raised: "#163B45"
  ice: "#E8F7F5"
  lime: "#D9FA57"
  lime-press: "#C6EA3C"
  on-petrol: "#E8F7F5"
  on-petrol-soft: "rgba(232, 247, 245, 0.76)"
  on-petrol-dim: "rgba(232, 247, 245, 0.6)"
  line-petrol: "rgba(232, 247, 245, 0.14)"
  line-petrol-strong: "rgba(232, 247, 245, 0.32)"
  on-ice: "#102D35"
  on-ice-soft: "rgba(16, 45, 53, 0.78)"
  on-ice-dim: "rgba(16, 45, 53, 0.7)"
  line-ice: "rgba(16, 45, 53, 0.14)"
  line-ice-strong: "rgba(16, 45, 53, 0.36)"
  error: "#FFB4A8"
  warning: "#F5C76B"
typography:
  hero:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(52px, 10.4vw, 156px)"
  display:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(44px, 6.4vw, 104px)"
  display-compact:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(34px, 5vw, 72px)"
  h2:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(36px, 5.6vw, 84px)"
  h2-compact:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(36px, 4.4vw, 64px)"
  h2-work:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(36px, 4vw, 56px)"
  h3:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(22px, 2vw, 28px)"
  statement:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(24px, 3vw, 46px)"
  feature:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(32px, 3.2vw, 46px)"
  service:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(28px, 6vw, 40px)"
  quote:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(26px, 2.4vw, 34px)"
  stat:
    fontFamily: "'Doto', 'Martian Mono', monospace"
    fontSize: "clamp(32px, 4vw, 56px)"
  price:
    fontFamily: "'Doto', 'Martian Mono', monospace"
    fontSize: "clamp(28px, 2.7vw, 42px)"
  price-mobile:
    fontFamily: "'Doto', 'Martian Mono', monospace"
    fontSize: "40px"
  nav:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "34px"
  title:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "22px"
  brand:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "21px"
  lede:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(17px, 1.4vw, 21px)"
  body:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "17px"
  control:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "16px"
  small:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "15px"
  label:
    fontFamily: "'Martian Mono', ui-monospace, 'SFMono-Regular', monospace"
    fontSize: "11px"
  button:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
  operate-body:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
    fontVariation: "'wdth' 100"
  operate-heading:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "1.75rem"
    lineHeight: 1.2
    fontVariation: "'wdth' 100"
rounded:
  control: "0"
  round: "50%"
spacing:
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  7: "28px"
  8: "32px"
  10: "40px"
  12: "48px"
  14: "56px"
  16: "64px"
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(80px, 11vw, 168px)"
components:
  button-primary:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.petrol}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 26px"
  button-primary-hover:
    backgroundColor: "rgba(232, 247, 245, 0.92)"
  button-primary-on-ice:
    backgroundColor: "{colors.petrol}"
    textColor: "{colors.ice}"
  button-primary-on-ice-hover:
    backgroundColor: "{colors.petrol-raised}"
  button-ghost:
    textColor: "{colors.on-petrol}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 26px"
  button-petrol:
    backgroundColor: "{colors.petrol}"
    textColor: "{colors.ice}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 26px"
  button-petrol-hover:
    backgroundColor: "{colors.petrol-raised}"
  contact-input:
    backgroundColor: "{colors.petrol}"
    textColor: "{colors.ice}"
    rounded: "{rounded.control}"
    padding: "14px"
  contact-chip:
    backgroundColor: "{colors.petrol}"
    textColor: "{colors.ice}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  contact-chip-selected:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.petrol}"
  status-dot:
    backgroundColor: "{colors.lime}"
    rounded: "{rounded.round}"
    size: "8px"
---

# Design System: Selva Digital

## Overview

**Creative North Star: "Tech premium de producto"**

Selva Digital presenta el trabajo de un desarrollador freelance con la contundencia de un lanzamiento de producto: tipografía ancha, contraste petróleo/hielo y lima reservado para detalles con forma propia. La referencia confirmada es Nothing; las capturas reales y la marca tipográfica aportan identidad sin vidrio ni halos.

La home persuade con resultados y prueba visitable. Admin y portal permiten operar con mayor densidad, superficies estables y estados explícitos. Comparten paleta, fuentes y esquinas rectas; su jerarquía es compacta.

**Key Characteristics:**

- Archivo ancho para jerarquía, Martian Mono para etiquetas y Doto para cifras destacadas.
- Bandas planas, hairlines y proyectos reales.
- Controles rectos Ice/Petrol y lima en pocos gestos con forma.
- Mobile con lectura corta, disclosures y scroll horizontal nativo.

Registro del código al 14 de noviembre de 2026. Autoridad: global.css, componentes activos y estilos operativos. PRODUCT.md fija compromisos de marca; .impeccable/surfaces/src-pages-index-astro.md conserva la dirección histórica de la home. El orden y la composición vigentes se registran aquí desde index.astro; la implementación prevalece sobre el antiguo muro de trabajos del brief.

Referencias revisadas: .impeccable/review/desktop.png, mobile-fold.png, desktop-08-planes.png, mobile-10-contacto.png y ops-portal.png. Las capturas documentan aspecto; el código vigente resuelve diferencias de contenido.

## Colors

Paleta fría y plana: petróleo dominante, bandas hielo y acento lima. Los valores normativos están en el frontmatter, con las mismas claves que las variables CSS; error y warning hoy aparecen como literales en el código.

Las tonalRamp del sidecar son ocho muestras OKLCH sintetizadas del mismo matiz para el panel, con croma reducido en extremos; no son colores implementados ni nuevas opciones autorizadas de la paleta. Las primitivas viven sólo en este frontmatter.

### Primary

- **Petrol Blue** (petrol): fondo principal y texto sobre hielo. petrol-deep sostiene portfolio, sobre mí, contacto y paneles; petrol-raised diferencia burbujas, hover y superficies operativas.
- **Signal Lime** (lime): botones de acción (.btn-primary y WhatsApp flotante), verbo rotativo del hero, punto del logo, punto final de «SOLO.», marcadores de frases y el delantal de la foto de WhyWeb. lime-press es el hover de los botones.

### Neutral

- **Ice White** (ice): texto principal sobre petróleo y fondo de Qué resuelvo, la lista de WhyWeb y Precios.
- on-petrol / on-ice son los pares principales; soft sirve a bajadas y descripciones, dim a metadatos. No bajar la opacidad de contenedores enteros para simular texto secundario.
- line-petrol / line-ice delimitan filas y columnas; strong refuerza límites de controles y estructuras.

### Mensajes

error y warning están reservados para mensajes, validación y estados que comunican un problema; no son acentos comerciales. El éxito utiliza lima con contexto textual. Los usos operativos que exceden mensajes se registran abajo como deriva.

**The Accent Rule.** Siete grupos de gestos: firma Header/Footer, punto final del Hero, disco del Hero detrás del render, disco de WhyWeb, marcadores WhyWeb/Portfolio, sello WhatsApp de disponibilidad y sello del plan destacado. Texto e iconos petróleo sobre lima; nunca texto lima sobre hielo. Foco, selección y caret conservan su función accesible.

Sobre hielo, números, etiquetas e iconos van en petróleo. Los botones primarios son lima con texto petróleo en todas las superficies (sobre hielo llevan además un borde inset petróleo de 1px). El plan destacado se distingue sólo por su botón lima; sin sellos. Foco petróleo sobre hielo y lima sobre oscuro.

## Typography

Archivo para titulares y cuerpo; Martian Mono para etiquetas; Doto para cifras. Layout.astro carga los ejes variables de Archivo (wdth 62–125, wght 100–900), Martian Mono (wdth 87.5–112.5, wght 400–500) y Doto (600–900).

Escala única definida en `:root` de src/styles/global.css. Todo tamaño explícito de la home consume estas variables, incluidos estilos React y utilidades Tailwind. Las variantes conservan las composiciones existentes; valores cercanos se agrupan: 10–12px en label, 14–15px en small, 17–18px en body, bajadas en lede, subtítulos de chatbot y citas en quote. No agregar tamaños sueltos.

| Variable | Valor | Uso |
| --- | --- | --- |
| `--fs-hero` | `clamp(52px, 10.4vw, 156px)` | Titular del Hero con verbo rotativo |
| `--fs-display` | `clamp(44px, 6.4vw, 104px)` | Titular fotográfico de WhyWeb |
| `--fs-display-compact` | `clamp(34px, 5vw, 72px)` | Frases de VisualBreak |
| `--fs-h2` | `clamp(36px, 5.6vw, 84px)` | Títulos de sección |
| `--fs-h2-compact` | `clamp(36px, 4.4vw, 64px)` | Sobre mí, Contacto y cierre del Footer |
| `--fs-h2-work` | `clamp(36px, 4vw, 56px)` | Heading de Trabajos |
| `--fs-h3` | `clamp(22px, 2vw, 28px)` | Subtítulos y nombres de proyectos |
| `--fs-statement` | `clamp(24px, 3vw, 46px)` | Frases «Con tu web» |
| `--fs-feature` | `clamp(32px, 3.2vw, 46px)` | Trato directo y servicios desktop |
| `--fs-service` | `clamp(28px, 6vw, 40px)` | Nombres de servicios mobile |
| `--fs-quote` | `clamp(26px, 2.4vw, 34px)` | Cita destacada y extra de chatbot web |
| `--fs-stat` | `clamp(32px, 4vw, 56px)` | Numerales de la lista Hoy → Con tu web |
| `--fs-price` | `clamp(28px, 2.7vw, 42px)` | Precios desktop en Doto |
| `--fs-price-mobile` | `40px` | Precios mobile en Doto |
| `--fs-nav` | `34px` | Navegación mobile |
| `--fs-title` | `22px` | Títulos breves de planes, proceso y formulario |
| `--fs-brand` | `21px` | Marca tipográfica |
| `--fs-lede` | `clamp(17px, 1.4vw, 21px)` | Bajadas y preguntas FAQ |
| `--fs-body` | `17px` | Texto principal y títulos menores |
| `--fs-control` | `16px` | Botones, campos y respuestas FAQ |
| `--fs-small` | `15px` | Texto secundario y navegación desktop |
| `--fs-label` | `11px` | Etiquetas y metadatos mono |

Hero: peso 800, wdth 125, interlínea .86, tracking −.035em. WhyWeb: 800, wdth 118, .88, −.035em. VisualBreak: 800, wdth 116, .95, −.03em. .h2: 800, wdth 108, .95, −.03em; .h3: 700, wdth 104, 1.08, −.02em. Body: 1.55; lede: 1.5; mono: 500, 1.4, .04em y mayúsculas. Se mantienen pesos, anchos e interlíneas locales.

Precios: Doto con fs-price-mobile antes de 768px y fs-price después, tracking −.02em. Admin/portal conservan su escala operativa (body 14px, H1 1.75rem), fuera de esta migración.

**The Role Rule.** Archivo cuenta y explica; Martian Mono identifica y mide; Doto destaca numerales, no párrafos ni controles operativos.

## Layout

.wrap centra un ancho máximo de 1360px, width 100% y gutter clamp(16px, 4vw, 56px). .section aplica padding vertical clamp(80px, 11vw, 168px). Espacios frecuentes: 8, 12, 16, 20, 24, 28, 32, 40, 48, 56 y 64px; no constituyen una escala exclusiva. Heading→bajada suele ser 24px, heading→contenido 36–80px según sección. Líneas compartidas entre filas/columnas en lugar de encapsular todo en tarjetas.

Breakpoints Tailwind: xs 475px, sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1400px. Testimonios agrega corte local a 1200px. A 768px cambian precios y sobre mí; a 1024px navegación, selector de trabajos y Servicios.

### Ritmo de la home actual

Punto fuerte: sitios web y digitalización del negocio. El chatbot propio integrado en la web es un extra; WhatsApp es el canal de contacto con Christian.

| Orden | Fondo | Organización |
| --- | --- | --- |
| Header fijo | petróleo al scrollear/abrir | Marca tipográfica, navegación y CTA |
| Hero | petróleo + render de producto | Titular tipográfico con verbo rotativo y hero-device; bajada y WhatsApp |
| WhyWeb | foto/petróleo → hielo | «Sin web, tu negocio cierra cuando vos cerrás.»; foto REAL de stock a sangre (mitad derecha desktop, arriba mobile); lista Hoy → Con tu web con marcador lima |
| Trabajos | profundo | Selector lista/visor desktop y fila deslizable mobile; «Abrilos y probalos.» con marcador lima y enlaces reales |
| Qué resuelvo | hielo | Sitios web como servicio principal; chatbot web como extra con demo de Impasto |
| Cómo trabajo / AboutV2 | profundo | Foto real, bloque raised/hairline de disponibilidad con sello circular lima, compromisos y cuatro pasos |
| Testimonios | petróleo | Cita principal y secundarias; métricas pendientes de verificar |
| VisualBreak / sep-live | render de producto | «Todo lo que ves acá está funcionando.» |
| Precios | hielo | ARS, tabs Webs/Sistemas; 50/50 y hosting/dominio aparte |
| FAQ | petróleo | Heading y acordeón |
| Contacto | profundo | Armador de mensaje WhatsApp primero; formulario secundario |
| Footer | petróleo | Invitación, enlaces y contacto |

Hero usa hero-device a sangre, titular en tres líneas con verbo que rota cada 2400ms y bajada/CTA debajo. Con movimiento reducido el verbo queda fijo. No hay muro de cuatro capturas en el Hero: las capturas reales viven en Trabajos. Servicios y proceso usan disclosures nativos en mobile.

#### Imágenes

Acentos raster de borde: luces en FAQ/Testimonios, acrílicos en Precios/Contacto y banda entre WhyWeb/Trabajos; sólo en zonas vacías sin texto ni controles, estáticos y exclusivos de desktop (≥1024px), excepto la banda, también visible en mobile.

Renders de producto en Hero y separadores VisualBreak (hero-device, sep-live); capturas reales en Trabajos. WhyWeb usa fotografía REAL de stock de Tim Douglas, Pexels, «Baker with tablet at counter in cafe», con color selectivo propio: blanco y negro y sólo el delantal en lima (fuente, licencia y edición en public/visuals/shop-modern-wide.jpg.json). Sin acentos raster decorativos: discos, sellos, acrílicos, regleta y tiras de luz se descartaron. En desktop ocupa la mitad derecha hasta el borde; en mobile va arriba, con el texto debajo sobre petróleo. La foto de Christian también es real. Nunca usar fotos de personas o lugares generadas por IA. Conservar procedencia y licencia de cada recurso.

## Elevation & Depth

Profundidad por tono, tamaño de imagen y hairlines. No hay sombras ambientales en tarjetas ni vidrio/blur. Las sombras inset de .btn-ghost, marcos y Header dibujan bordes, no elevación.

Excepción WhatsApp flotante: box-shadow 0 10px 30px rgba(0,0,0,.3), para separarlo del contenido. No trasladar esta sombra a tarjetas.

**The Flat Rule.** Las superficies se separan por tono y líneas; la sombra del WhatsApp flotante es una excepción funcional, no una receta para tarjetas.

### Movimiento observado

- Curva compartida cubic-bezier(0.16, 1, 0.3, 1). Botones: 200ms para fondo/texto/borde/transform; presión translateY(1px). Header 250ms; líneas de menú 300ms.
- Hero: máscara clip-path y traslación inicial 0.3em, 1s; segunda línea demora 90ms y tercera 180ms. fade-late: 900ms con demora 350ms. Requiere clase js y prefers-reduced-motion: no-preference; sin JS queda visible.
- Selector: opacidad y máscara 550ms. Hero: verbo rotativo cada 2400ms, transición 700ms; queda fijo con reducción de movimiento.
- FAQ: expansión por grid-template-rows 300ms y signo 250ms; sin transición con reducción de movimiento. Selector también elimina transición.
- Chat demo: paso cada 2400ms; puntos 1.2s/desfase 150ms. Con reducción de movimiento muestra toda la conversación y detiene el ciclo.
- Admin/portal desactivan animaciones, transiciones y smooth scroll en su subárbol al reducir movimiento.

La home desactiva smooth scroll con prefers-reduced-motion: reduce; el hero, el chat y las transiciones del selector y FAQ también respetan esa preferencia.

## Shapes

Controles, campos, capturas, burbujas y paneles a 90° (radio 0). Hairlines de 1px usando el token correspondiente al fondo. .rule es borde superior y cambia a line-ice dentro de hielo.

Círculos funcionales: .status-dot 8×8px, puntos de escritura 5px y spinners. WhatsApp flotante redondo: 52px mobile / 56px desde md, a 16px inferior/derecho. Badges del portal y algunas muestras de color del admin conservan pills como metadatos, no botones. El cierre de toast aún lleva rounded heredado: no canonizarlo como excepción para controles.

## Components

### WhyWeb, VisualBreak y marcador

WhyWeb.astro combina fotografía real a sangre y lista Hoy → Con tu web. El elemento mark lleva fondo lima, texto petróleo, padding 0 .12em y box-decoration-break: clone para conservar el marcador al partir líneas sobre hielo.

VisualBreak.astro recibe image, title, href, cta, external y align; muestra un render de producto con velo de contraste, frase display y CTA btn-primary. Se usa una vez, con sep-live.

El bloque about-direct usa petrol-raised y hairline; un sello circular lima con WhatsApp acompaña la respuesta en menos de 24 h y el máximo de 3 proyectos simultáneos. El título de sección ya expresa el trato directo. ui/WaIcon.tsx es el glifo SVG compartido de WhatsApp, usa currentColor y size; no es un emoji.

### Botones y enlaces

.btn: inline-flex centrado, gap 10px, mínimo 52px, padding 0 26px, Archivo 16px/700/wdth 104, radio 0. .btn-primary: lima con texto petróleo, hover lime-press; dentro de .on-ice suma borde inset 1px petróleo. .btn-petrol: petróleo/hielo, hover raised. .btn-ghost: texto correspondiente al fondo y borde inset 1px strong; hover refuerza a color de texto. Se adapta a .on-ice. Disabled: opacidad .45, cursor not-allowed y sin desplazamiento.

Foco global: outline 2px lima, offset 3px; dentro de hielo outline petróleo. Header reduce CTA a mínimo 44px, padding 0 18px, 15px. Contacto WhatsApp: mínimo 60px y ancho completo. .link subraya 1px con offset 5px; hover cambia subrayado a lima y en hielo aumenta grosor a 2px.

### Superficies y datos

.on-petrol, .on-deep y .on-ice asignan fondo y texto principal juntos; secundarios soft/dim explícitos. .mono sirve a etiquetas, pies y medidas, no kickers encima de H2. .dot-num destaca cifras. .status-dot acompaña texto/selección y no comunica sólo mediante color.

ChatPreview: panel profundo con borde strong, padding 20–32px, burbujas rectas 12px 16px; cliente hielo/petróleo, bot raised/hielo. Secuencia basada en la carta de Impasto: pide zona y dirección antes de confirmar el pedido; sin campo de entrada ficticio ni leyenda añadida. En mobile permanece oculto y las cuatro funciones del extra se despliegan con «Qué hace el asistente».

### Navegación

Marca tipográfica minúscula: Archivo 21px/800/wdth 112 con punto lima. Desktop desde lg: cinco enlaces, Portal clientes y CTA. Mobile: Menú/Cerrar con aria-expanded y aria-controls, panel petróleo calc(100svh - 68px), enlaces fs-nav, hairlines y CTA al pie. Cierra con Escape y bloquea scroll de body. Iconos SVG, habitualmente stroke 1.5px; WaIcon rellena currentColor y se oculta a asistencia cuando el enlace ya tiene nombre.

### Fila deslizable y selector de trabajos

.snap-row: flex, gap 12px, overflow-x auto, scroll-snap-type x mandatory, gutter y scroll-padding iguales, scrollbar oculta; hijos sin encoger, snap start. Tarjetas portfolio min(84vw, 420px) bajo lg; controles anterior/siguiente a la izquierda, con espacio reservado a la derecha para WhatsApp.

Selector desktop: lista/visor 2:3, filas mínimo 84px, padding 20px 0, nombre hielo al seleccionar. Visor sticky a 100px, captura 16:10, descripción, datos del proyecto y enlace lima debajo. Selección por hover de puntero fino, foco y click; ArrowUp/Down y Home/End; aria-pressed, aria-controls y panel identificado.

### Acordeones

Servicios/proceso usan disclosures nativos sin cajas redondeadas. FAQ usa botón con aria-expanded, panel asociado y signo mís/menos trazado con CSS; trigger padding 24px 0, fs-lede/600; respuesta 16px/1.65, máximo 62ch, padding inferior 24px. No reemplazar signos con emojis.

### Chips y formularios

Chips de necesidad: 12px 14px, Archivo 15px, borde strong, petróleo/hielo; hover borde hielo; seleccionado invierte hielo/petróleo con aria-pressed. Presupuesto: mono fs-label y padding 12px.

Campos públicos: fondo petróleo dentro de profundo, borde strong 1px, padding 14px, 16px, placeholder dim; foco borde hielo mís outline global. Labels asociados, textarea resize vertical. Pares desde 640px; bloques separados 24px y campos 20px. Desde lg formulario a derecha con línea izquierda y padding 40px; antes línea superior. Error textual y feedback error con borde/texto semántico; éxito con borde lima y texto hielo.

### Tabla de precios

Tabs rectos Webs/Sistemas, borde strong, padding 14px 28px; activo petróleo/hielo. tablist/tab/tabpanel y teclado definidos. Columnas sin elevación, líneas verticales y hairlines entre atributos, CTA al pie. Desde md grilla igual según cantidad de planes; antes snap de ancho 84vw. Título 22px/700, precio Doto, moneda mono, cuerpo 15px/1.45, filas 12px 0. Destacado por sello circular lima con texto petróleo y CTA btn-primary; otras acciones ghost. ARS, pago único, condiciones 50/50 y hosting/dominio aparte.

### Modo Operate: admin y portal

Densidad para clientes, fases, mensajes y carga de material. Body 14px/1.5/wdth 100; H1 1.75rem/1.2, sin Doto ni titulares comerciales anchos. Labels mono 12px/0.03em. Tablas tabulares: encabezados mono 11px/500/0.06em; datos desde segunda columna mono 12px; hover raised y divisiones sutiles.

Overrides .admin-body/.portal-body: botones mínimo 36px, padding 7px 14px, 14px/1.4/wdth 100; ghost raised al hover. Los tamaños nominales del wrapper React coexisten con estos overrides; no asumir que su padding/tipo nominal prevalece. Campos mínimo 40px, profundo/hielo, borde strong, radio 0; foco hielo, inválido borde error, read-only soft, disabled .5. Antes de 640px header envuelve y botones permiten varias líneas.

Paneles portal panel-deep / panel-raised / panel-rule: tono y borde sutil, sin sombra. Padding sm 16/20px, md 24/28px, lg 32/40px según breakpoint sm. Variante glass del botón mapea a ghost; gradientBorder de Card a línea plana: sus nombres no autorizan vidrio ni gradientes. Uploader con miniaturas, estados y progreso explícito. Badges de metadatos mono mayúscula con borde; toast rectangular con SVG, título/cierre, máximo 420px y duración predeterminada 4000ms.

**Deriva no canonizada ni reparada:** admin/portal contienen #9FD8E0 en información, spinners/estados y progress-fill; Progress aplica lima directamente incluso a warning. Warning también colorea badges y el icono de propuestas del dashboard; error colorea acciones destructivas. Se registra lo existente sin convertirlo en cuarta tinta de marca ni ampliar la restricción de semánticos a mensajes. Tailwind conserva paletas/fuentes anteriores; el PNG de marca externo sigue esmeralda aunque Header/Footer usan tipografía. Capturas del portal muestran copy previo («equipo», «Sube»); no heredar esas expresiones. Testimonios y KPIs siguen pendientes de verificación del usuario.

## Do's and Don'ts

### Do:

- Do — Usar variables de global.css y los pares de contraste de cada superficie.
- Do — Mantener foco visible, nombres accesibles y estados expresados también con texto.
- Do — Mostrar trabajo real y resultado antes que stack; escribir en rioplatense y primera persona singular: «vos», «contame», «desarrollo», «desde Córdoba».
- Do — Expresar precios en ARS, pago único, 50% inicio / 50% entrega y hosting/dominio aparte.

### Don't:

- Don't — Agregar glows, glass, texto en gradiente ni sombras duras desplazadas.
- Don't — Agregar kickers o eyebrows encima de títulos ni numerar secciones como decoración.
- Don't — Usar emojis como iconos; usar SVG con currentColor.
- Don't — Recuperar esmeralda, cian eléctrico, violeta o fuentes heredadas de Tailwind como identidad activa.
- Don't — Pintar botones con lima o usar texto lima sobre claro; marcadores y sellos llevan texto petróleo.
- Don't — Usar fotos de personas o lugares generadas por IA.
- Don't — Inventar testimonios, métricas, logos ni escasez; los testimonios y KPIs existentes requieren verificación del usuario.
- Don't — Extender colores semánticos de error/advertencia a decoración o identidad de marca.

Fuentes: src/styles/global.css, tailwind.config.js, src/layouts/Layout.astro, componentes de home, src/layouts/AdminLayout.astro, src/pages/portal.astro, src/styles/portal.css y componentes admin/** y client-portal/**. Actualizar desde código y separar excepciones de reglas durables.
