import React, { useCallback, useEffect, useState } from 'react';
import { WHATSAPP_URL } from '../lib/constants';

const VISIT_KEY = 'selva_banner_visits';
const DISMISSED_KEY = 'selva_banner_dismissed';
const MAX_SHOWS = 3;
const DELAY_BY_VISIT = [6000, 8000, 10000];

const accent = '#2BB673';
const surface = '#121316';
const textSoft = 'rgba(250,250,250,0.72)';
const textDim = 'rgba(250,250,250,0.46)';
const line = 'rgba(250,250,250,0.08)';
const lineStr = 'rgba(250,250,250,0.18)';

const Banner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Si el usuario hizo click en el CTA o cerró explícitamente "para siempre", no mostrar más
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Contar visitas (cada page-load suma 1)
    const visits = parseInt(localStorage.getItem(VISIT_KEY) || '0', 10);
    const nextVisit = visits + 1;
    localStorage.setItem(VISIT_KEY, String(nextVisit));

    // Solo mostrar en las primeras MAX_SHOWS visitas
    if (nextVisit > MAX_SHOWS) return;

    const delay = DELAY_BY_VISIT[nextVisit - 1] ?? 6000;
    const timer = setTimeout(() => {
      setIsVisible(true);
      requestAnimationFrame(() => setAnimateIn(true));
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const handleCTAClick = useCallback(() => {
    // Click en CTA = no mostrar más
    localStorage.setItem(DISMISSED_KEY, '1');
    setAnimateIn(false);
    setTimeout(() => setIsVisible(false), 200);
    const mensaje = encodeURIComponent(
      '¡Hola! Vi el 20% de descuento en tu primer proyecto y me gustaría obtener más información.'
    );
    window.open(`${WHATSAPP_URL}?text=${mensaje}`, '_blank');
  }, []);

  const handleClose = useCallback(() => {
    // Cerrar = simplemente ocultar este turno (volverá a aparecer en la próxima visita hasta agotar MAX_SHOWS)
    setAnimateIn(false);
    setTimeout(() => setIsVisible(false), 200);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="banner-title"
    >
      <div className="absolute inset-0" style={{ background: 'rgba(6,7,9,0.78)', backdropFilter: 'blur(10px)' }} onClick={handleClose} />

      <div
        className={`relative w-full max-w-[420px] transition-all duration-500 ${animateIn ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'}`}
        style={{
          background: surface,
          border: `1px solid ${lineStr}`,
          borderRadius: '14px',
          boxShadow: `0 24px 60px -20px rgba(0,0,0,0.7), 0 0 60px -10px ${accent}33`,
          fontFamily: "'Inter', system-ui, sans-serif"
        }}
      >
        {/* Accent halo */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            inset: -30,
            background: `radial-gradient(circle at 50% 0%, ${accent}26, transparent 60%)`,
            filter: 'blur(20px)',
            zIndex: 0
          }}
        />

        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Cerrar"
          type="button"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors hover:text-white cursor-pointer"
          style={{ color: textDim, background: 'transparent', borderRadius: '8px', zIndex: 20 }}
        >
          ×
        </button>

        <div className="relative p-7 md:p-8">
          {/* Kicker */}
          <div className="inline-flex items-center gap-2.5 mb-5">
            <span className="w-3 h-px" style={{ background: accent }} />
            <span
              className="text-[10.5px] uppercase tracking-[2.5px]"
              style={{ color: accent, fontFamily: "'JetBrains Mono', monospace" }}
            >
              Oferta de lanzamiento
            </span>
          </div>

          {/* Title */}
          <h3
            id="banner-title"
            className="text-white mb-2"
            style={{
              fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 26,
              lineHeight: 1.05,
              letterSpacing: '-0.02em'
            }}
          >
            20% off en tu <span style={{ color: accent }}>primer proyecto</span>.
          </h3>

          {/* Subhead */}
          <p className="text-[14px] leading-[1.55] mb-6" style={{ color: textSoft }}>
            Solo este mes. Cupo limitado — no tomo más de 3 proyectos en simultáneo.
          </p>

          {/* Stats / chips */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div
              className="px-3 py-2.5"
              style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${line}`, borderRadius: '10px' }}
            >
              <div className="text-[10px] tracking-[1.5px] mb-1" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>
                AHORRO
              </div>
              <div
                className="text-white"
                style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                Hasta $140k
              </div>
            </div>
            <div
              className="px-3 py-2.5"
              style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${line}`, borderRadius: '10px' }}
            >
              <div className="text-[10px] tracking-[1.5px] mb-1" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>
                MODALIDAD
              </div>
              <div
                className="text-white"
                style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                Pago 50 / 50
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCTAClick}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: accent, color: '#06140C', borderRadius: '10px' }}
          >
            Aprovechar ahora <span aria-hidden="true">→</span>
          </button>

          {/* Footnote */}
          <p
            className="text-center mt-3.5 text-[10.5px] tracking-[1.5px] uppercase"
            style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}
          >
            Charlamos por WhatsApp · Sin compromiso
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
