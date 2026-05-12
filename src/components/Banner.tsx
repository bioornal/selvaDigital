import React, { useCallback, useEffect, useState } from 'react';
import { WHATSAPP_URL } from '../lib/constants';

const BANNER_KEY = 'selva_banner_seen';

const Banner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const alreadySeen = localStorage.getItem(BANNER_KEY);
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      requestAnimationFrame(() => setAnimateIn(true));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCTAClick = useCallback(() => {
    localStorage.setItem(BANNER_KEY, '1');
    setAnimateIn(false);
    setTimeout(() => setIsVisible(false), 200);
    const mensaje = encodeURIComponent(
      '¡Hola! Vi el 20% de descuento en tu primer proyecto y me gustaría obtener más información.'
    );
    window.open(`${WHATSAPP_URL}?text=${mensaje}`, '_blank');
  }, []);

  const handleClose = useCallback(() => {
    localStorage.setItem(BANNER_KEY, '1');
    setAnimateIn(false);
    setTimeout(() => setIsVisible(false), 200);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        animateIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      <div
        className={`relative w-full max-w-sm bg-black border border-violet-500/30 transition-all duration-500 ${
          animateIn ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.15)' }}
      >
        <button
          onClick={handleClose}
          className="absolute -top-10 right-0 w-10 h-10 flex items-center justify-center text-white text-2xl leading-none hover:text-violet-400 transition-colors"
        >
          ×
        </button>

        <div className="p-6 pt-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-violet-400 mb-2 text-center">
            Oferta de lanzamiento
          </p>
          <h3 className="font-heading text-2xl text-white text-center mb-3">
            20% OFF
          </h3>
          <p className="text-sm text-gray-400 text-center mb-6">
            en tu <span className="text-white">primer proyecto web</span>
          </p>
          <button
            className="w-full bg-violet-600 text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-violet-500 transition-colors"
            onClick={handleCTAClick}
          >
            Aprovechar ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;