import { useState, useEffect } from 'react';

// Conversación armada con la carta real publicada en impastopizzas.com (precios, envío y pagos tal como figuran).
const messages = [
  { from: 'user', text: '¡Hola! Somos 3, ¿qué me recomendás?' },
  { from: 'bot',  text: '¡Hola! Para 3 va justo una pizza de 8 porciones. Las más pedidas son la Napoletana all\x27Aglio ($20.000) y la Muzzarella y Jamón ($18.500). Y si no se ponen de acuerdo, mitad y mitad es sin costo.' },
  { from: 'user', text: 'Dale, una Napoletana. ¿Llegan a mi casa?' },
  { from: 'bot',  text: 'Tenemos delivery propio en Puerto Iguazú. ¿En qué zona estás y cuál es la dirección de entrega?' },
  { from: 'user', text: 'En el centro de Puerto Iguazú, Av. Córdoba 150.' },
  { from: 'bot',  text: 'Para esa dirección: Napoletana all\x27Aglio $20.000 + envío $3.000, total $23.000. La entrega estimada es de 30 a 50 min. ¿Confirmás el pedido para pagar con Mercado Pago?' },
];

export default function ChatPreview() {
  const [step, setStep] = useState(messages.length);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let interval: ReturnType<typeof setInterval> | undefined;
    const syncMotion = () => {
      if (interval !== undefined) clearInterval(interval);
      setReducedMotion(preference.matches);
      setStep(preference.matches ? messages.length : 0);
      if (!preference.matches) interval = setInterval(() => setStep(s => (s + 1) % (messages.length + 1)), 2400);
    };
    syncMotion();
    preference.addEventListener('change', syncMotion);
    return () => {
      if (interval !== undefined) clearInterval(interval);
      preference.removeEventListener('change', syncMotion);
    };
  }, []);
  return (
    <figure className="chat-demo" aria-label="Conversación de ejemplo con el asistente de la web de Impasto Pizzería">
      <header className="chat-demo-header">
        <p className="chat-demo-name">Asistente de Impasto</p>
      </header>
      <div className="chat-demo-messages">
        {messages.slice(0, step).map((message, index) => (
          <p key={index} className={'chat-demo-bubble chat-demo-' + message.from}>
            <span className="sr-only">{message.from === 'user' ? 'Cliente: ' : 'Asistente: '}</span>
            {message.text}
          </p>
        ))}
        {!reducedMotion && step < messages.length && messages[step].from === 'bot' && (
          <div className="chat-demo-typing" role="status" aria-label="El asistente está escribiendo">
            <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: chatStyles }} />
    </figure>
  );
}

const chatStyles = `
.chat-demo { width: 100%; margin: 0; padding: clamp(20px, 2.5vw, 32px); box-sizing: border-box; background: var(--petrol-deep); color: var(--ice); border: 1px solid var(--line-petrol-strong); border-radius: 0; font-family: var(--font-body); }
.chat-demo-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid var(--line-petrol-strong); }
.chat-demo-name { margin: 0; font-size: var(--fs-body); font-weight: 700; line-height: 1.25; }
.chat-demo-messages { display: flex; flex-direction: column; gap: 14px; min-height: 400px; padding: 28px 0; }
.chat-demo-bubble { max-width: 86%; margin: 0; padding: 12px 16px; border-radius: 0; font-size: var(--fs-small); line-height: 1.5; overflow-wrap: anywhere; }
.chat-demo-user { align-self: flex-end; background: var(--ice); color: var(--petrol); }
.chat-demo-bot { align-self: flex-start; background: var(--petrol-raised); color: var(--ice); }
.chat-demo-typing { display: flex; gap: 6px; align-self: flex-start; padding: 16px; background: var(--petrol-raised); }
.chat-demo-typing span { width: 5px; height: 5px; border-radius: 50%; background: var(--ice); }
@media (prefers-reduced-motion: no-preference) {
  .chat-demo-typing span { animation: chat-demo-breathe 1.2s ease-in-out infinite; }
  .chat-demo-typing span:nth-child(2) { animation-delay: .15s; }
  .chat-demo-typing span:nth-child(3) { animation-delay: .3s; }
}
@keyframes chat-demo-breathe { 0%, 100% { opacity: .4; } 50% { opacity: 1; } }
`;
