# Plantillas WhatsApp — Selva Digital

Los textos de las plantillas viven en `src/lib/templates.ts` y se usan desde el panel (`/admin`, ficha del cliente). Este documento sólo dice **cuándo usar cada una**. No copiar los textos acá: se desactualizan.

Sin contrato firmado: el cliente acepta las condiciones de `/condiciones` respondiendo «Acepto» por WhatsApp, y en el panel se registra la fecha.

---

## Flujo con alta + abono mensual

| Momento | Plantilla | Después, en el panel |
|---|---|---|
| Pregunta por disponibilidad | `disponibilidad` | Cargar cliente como «Lead» |
| Quiere avanzar | `cierre-abono` (pide «Acepto») | Registrar aceptación de condiciones |
| Respondió «Acepto» | `datos-pago` (concepto: alta) | — |
| Llegó el comprobante del alta | `arranque` | Registrar pago (alta) y fecha de inicio del abono |
| Primer diseño listo | `primer-avance` | — |
| Aprobó el diseño | `aprobacion-diseno` | — |
| Sitio listo para revisar | `demo-listo` | — |
| Sitio publicado | `sitio-entregado` | Marcar entregado |

## Flujo con pago único 50/50

| Momento | Plantilla | Después, en el panel |
|---|---|---|
| Quiere avanzar | `cierre-unico` (pide «Acepto») | Registrar aceptación de condiciones |
| Respondió «Acepto» | `datos-pago` (concepto: anticipo 50%) | — |
| Llegó el anticipo | `arranque` | Registrar pago (anticipo) |
| Sitio listo para revisar | `demo-listo`, luego `datos-pago` (saldo 50%) | — |
| Llegó el saldo y está publicado | `post-deploy` | Registrar pago (saldo) y marcar entregado |

## Cobros del abono (el panel los propone solo)

| Estado en el panel | Plantilla |
|---|---|
| Vence hoy o en los próximos 3 días | `recordatorio-vencimiento` |
| En aguante (días 1 a 10 después del vencimiento) | `aviso-aguante` |
| Para dar de baja (día 11 en adelante) | `aviso-baja` → apagar el sitio y marcar «Dar de baja» |

## En cualquier momento

- `scope-creep`: pide algo que no estaba acordado.
- `cliente-desaparecido`: más de 2 semanas sin respuesta en medio del proyecto.
- `explicacion-eslogan`: dudas sobre «vende 24/7».

---

## Notas

- **No es un contrato firmado**, pero un acuerdo aceptado por mensaje vale y sirve como prueba. Guardá el chat con el «Acepto» y los comprobantes.
- **La seña tiene validez legal en Argentina** (Código Civil y Comercial, art. 1059) aunque no firmes nada.
- Con clientes que piden más formalidad, mandá también `/condiciones` en PDF (imprimir la página desde el navegador).
- El texto de `/condiciones` conviene que lo revise un abogado una vez.

_Última actualización: 2026-11-16_
