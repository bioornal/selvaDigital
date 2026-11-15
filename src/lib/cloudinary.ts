// Imágenes de la web servidas desde Cloudinary (cuenta djtvjkcu6).
// Cloudinary entrega el formato que soporta cada navegador (AVIF/WebP) con f_auto,
// ajusta la calidad con q_auto y genera cada ancho a pedido: no hace falta guardar
// variantes en /public.

const BASE = 'https://res.cloudinary.com/djtvjkcu6/image/upload';

/** Originales subidos a Cloudinary (versión/carpeta/nombre). */
export const IMG = {
  heroDevice: 'v1794783856/SelvaDigital/web/hero-device.png',
  sepLive: 'v1794783864/SelvaDigital/web/sep-live.png',
  shopWide: 'v1794783865/SelvaDigital/web/shop-modern-wide.jpg',
  shopTall: 'v1794783865/SelvaDigital/web/shop-modern-tall.webp',
  impasto: 'v1794783866/SelvaDigital/web/portfolio-impasto.webp',
  casaDelLago: 'v1794783866/SelvaDigital/web/portfolio-casadellago.webp',
  olietta: 'v1794783867/SelvaDigital/web/portfolio-olietta.webp',
  iguazuFalls: 'v1794783868/SelvaDigital/web/portfolio-iguazufalls.webp',
  fogon: 'v1794783869/SelvaDigital/web/portfolio-fogon.webp',
  aruma: 'v1781879164/ArumaLodge/Hero_bgsjtf.jpg',
  megamuebles: 'v1778503357/SelvaDigital/Mega_ospdo9.png',
  megabot: 'v1778503356/SelvaDigital/Megabot_jczmp3.png',
  socialCore: 'v1779842341/SelvaDigital/4ee423a3-f907-4d6e-9800-1ef9b4a7330e.png',
  vip: 'v1778505330/SelvaDigital/Vip_vvshcm.png',
} as const;

/**
 * Logos (SelvaDigital/logo). Ojo con los nombres: "oscuro" es para fondos oscuros
 * (franja clara) y "claro" para fondos claros (franja petróleo). La web es petróleo.
 * Los SVG se sirven tal cual (sin f_auto) para que queden vectoriales.
 */
export const LOGO = {
  horizontal: `${BASE}/v1794784247/SelvaDigital/logo/selva-digital-logo-oscuro-svg.svg`,
  isotipo: `${BASE}/v1794784242/SelvaDigital/logo/selva-digital-isotipo-oscuro-svg.svg`,
  /** 1200×630 sobre petróleo para WhatsApp, Facebook y X. */
  og: `${BASE}/c_pad,w_1200,h_630,b_rgb:102D35,f_jpg,q_auto/v1794784246/SelvaDigital/logo/selva-digital-logo-oscuro.png`,
  /** Cuadrado para Google (schema.org logo). */
  square: `${BASE}/c_pad,w_512,h_512,b_rgb:102D35,f_png/v1794784241/SelvaDigital/logo/selva-digital-isotipo-oscuro.png`,
} as const;

/** Escala al ancho pedido sin agrandar nunca el original. */
export const cld = (path: string, width: number, extra = 'c_limit', quality = 'q_auto') =>
  `${BASE}/f_auto,${quality},${extra},w_${width}/${path}`;

export const cldSrcset = (path: string, widths: number[], extra?: string, quality?: string) =>
  widths.map((w) => `${cld(path, w, extra, quality)} ${w}w`).join(', ');

/** Fondos a sangre (hero, bandas): ocupan todo el ancho de la pantalla. */
export const FULL_WIDTHS = [640, 960, 1280, 1600, 1920, 2400];

// Los fondos van bajo un velo oscuro: q_auto:eco pesa 20-35 % menos sin diferencia visible.
export const bg = (path: string, width: number) => cld(path, width, 'c_limit', 'q_auto:eco');
export const bgSrcset = (path: string, widths = FULL_WIDTHS) =>
  cldSrcset(path, widths, 'c_limit', 'q_auto:eco');
