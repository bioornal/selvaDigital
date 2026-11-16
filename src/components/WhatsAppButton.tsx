import { whatsappLink } from '../lib/constants';
import WaIcon from './ui/WaIcon';

const MENSAJE = '¡Hola! Me gustaría obtener más información sobre sus servicios.';

const WhatsAppButton = ({ message = MENSAJE }: { message?: string }) => (
  <a href={whatsappLink(message)}
    target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp"
    className="fixed bottom-4 right-4 w-[52px] h-[52px] md:w-14 md:h-14 flex items-center justify-center rounded-full z-50"
    style={{ background: 'var(--lime)', color: 'var(--petrol)', boxShadow: '0 10px 30px rgba(5,20,24,.45)' }}
    /* El clic lo cuenta el rastreo global de Layout.astro (Meta Contact + GA whatsapp_click). */
    data-wa-origen="boton-flotante">
    <WaIcon size={28} />
  </a>
);
export default WhatsAppButton;