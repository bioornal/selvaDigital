---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/components"]
---

# Home pública (src/pages/index.astro)

Scope: home pública + Header, Footer, Contacto y botón WhatsApp. Modo: Persuade.
Audiencia: dueños de PyMEs de toda Argentina, mayormente desde el celular. Acción: escribir por WhatsApp (formulario secundario).
Prueba: portfolio real con capturas de sitios en producción (protagonista). Testimonios/métricas pendientes de verificación por el usuario; aviso de cupos junio 2026 vencido, no se muestra.

## Direction contract

THESIS: Tech premium tipo Nothing: un manifiesto tipográfico con verbo rotativo y render de producto abre la home. Sitios web y digitalización son el argumento principal; los trabajos reales visitables aportan la prueba y el chatbot integrado en la web es un extra. Sin decoración, badges, kickers ni contadores.

OWN-WORLD: Petrol Blue #102D35 como fondo dominante, Ice White #E8F7F5 en bandas claras y texto sobre petróleo, Signal Lime #D9FA57 sólo en CTAs, resaltados y puntos de estado (nunca texto sobre claro). Display grotesk pesada y ancha, etiquetas en mono mayúscula espaciada, numerales en matriz de puntos para precios y datos. Esquinas a 90° en controles, hairlines de 1px, cero glows ni glass.

STORY: El dueño reconoce la promesa en el hero; WhyWeb la explica con una foto real y la comparación Hoy → Con tu web. Después abre trabajos reales, explora servicios y el extra chatbot con acceso a Impasto, conoce mi forma de trabajar y las opiniones de clientes, consulta precios ARS con pago único 50/50 y hosting/dominio aparte, resuelve dudas y escribe por WhatsApp con un mensaje armado. Dos separadores con renders acompañan el recorrido; el formulario queda como alternativa secundaria.

FIRST VIEWPORT: Manifiesto tipográfico «Tu negocio [vende/atiende/responde/cobra] solo.» en gran escala sobre petróleo, con el render raster hero-device a sangre. Titular en tres líneas, bajada breve sobre la web y un CTA lima a WhatsApp. Mobile conserva la misma jerarquía. El verbo rota cada 2400ms; con movimiento reducido queda fijo. Las capturas reales aparecen después en Trabajos, no en el hero.

FORM: seed: none (pinned) — "Manifiesto tipográfico: solo tipografía gigante a pantalla completa con una palabra que rota (vende / atiende / cobra), un CTA y nada más. Puro estilo Nothing." — elegido por el usuario en la ronda de estructura. La implementación vigente incorpora el render de producto autorizado y amplía la rotación con «responde».

SIGNATURE: el selector de trabajos — lista de proyectos a la izquierda que cambia la captura grande a la derecha (hover/foco en desktop, swipe y controles a la izquierda en mobile), con enlaces lima para abrir los sitios; motion: reveal por máscara (clip-path), ease-out exponencial, y verbo rotativo con alternativa sin movimiento.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
