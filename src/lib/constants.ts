export const WHATSAPP_NUMBER = '5493757652003';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CONTACT_PHONE = '+54 9 3757 652003';
export const CONTACT_EMAIL = 'info.selvadigital@gmail.com';

/** URL pública que responde hoy (selvadigital.com no es nuestro). Se usa en mensajes de WhatsApp. */
export const SITE_URL = 'https://selva-digital.vercel.app';
export const CONDICIONES_URL = `${SITE_URL}/condiciones`;

/** Abre WhatsApp con un mensaje ya escrito. */
export const whatsappLink = (text: string) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
