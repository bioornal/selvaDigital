import { useEffect, useState } from 'react';
import { whatsappLink } from '../lib/constants';
import WaIcon from './ui/WaIcon';

const menuItems = [
  { href: '#portfolio', label: 'Trabajos' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#sobre', label: 'Cómo trabajo' },
  { href: '#planes', label: 'Precios' },
  { href: '#faq', label: 'Preguntas' },
];

const WA_HEADER = whatsappLink('¡Hola Christian! Vi tu web y quiero consultarte por un proyecto.');

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: scrolled || open ? 'var(--petrol)' : 'transparent',
        boxShadow: scrolled && !open ? 'inset 0 -1px 0 var(--line-petrol)' : 'none',
        transition: 'background-color .25s var(--ease-out), box-shadow .25s var(--ease-out)',
      }}
    >
      <div className="wrap flex h-[68px] items-center justify-between gap-6">
        <a href="/" className="flex items-center gap-1.5 text-[var(--ice)] no-underline" aria-label="Selva Digital — inicio">
          <span
            className="text-[length:var(--fs-brand)] font-extrabold lowercase leading-none"
            style={{ fontVariationSettings: "'wdth' 112", letterSpacing: '-0.03em' }}
          >
            selva digital
          </span>
          <span className="status-dot" aria-hidden="true" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[length:var(--fs-small)] font-medium text-[var(--on-petrol-soft)] no-underline transition-colors hover:text-[var(--ice)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href="/portal" className="mono text-[var(--on-petrol-dim)] no-underline transition-colors hover:text-[var(--ice)]">
            Portal clientes
          </a>
          <a href={WA_HEADER} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ minHeight: 44, padding: '0 18px', fontSize: 'var(--fs-small)' }}>
            <WaIcon size={17} />
            Escribime
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mono flex h-11 items-center gap-2 px-1 text-[var(--ice)] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? 'Cerrar' : 'Menú'}
          <span className="relative block h-[10px] w-[18px]" aria-hidden="true">
            <span
              className="absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300"
              style={{ top: open ? 4 : 0, transform: open ? 'rotate(45deg)' : 'none' }}
            />
            <span
              className="absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300"
              style={{ top: open ? 4 : 8, transform: open ? 'rotate(-45deg)' : 'none' }}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className="lg:hidden"
        hidden={!open}
        style={{ height: 'calc(100svh - 68px)', background: 'var(--petrol)', borderTop: '1px solid var(--line-petrol)' }}
      >
        <nav className="wrap flex h-full flex-col pb-8 pt-4" aria-label="Menú móvil">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-[var(--line-petrol)] py-4 text-[length:var(--fs-nav)] font-extrabold text-[var(--ice)] no-underline"
              style={{ fontVariationSettings: "'wdth' 110", letterSpacing: '-0.03em', lineHeight: 1 }}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-auto flex flex-col gap-4">
            <a href={WA_HEADER} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
              <WaIcon size={18} />
              Escribime por WhatsApp
            </a>
            <div className="mono flex justify-between text-[var(--on-petrol-dim)]">
              <a href="/portal" className="no-underline">Portal clientes</a>
              <a href="https://www.instagram.com/selvadigital_creaciones/" target="_blank" rel="noopener noreferrer" className="no-underline">
                Instagram ↗
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
