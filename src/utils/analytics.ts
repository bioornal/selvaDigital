// Tipo para gtag
declare global {
    interface Window {
      gtag: (...args: any[]) => void;
    }
  }
  
  // Función para enviar eventos
  export const sendAnalyticsEvent = (
    eventName: string,
    category: string,
    label: string,
    value?: number
  ) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  };