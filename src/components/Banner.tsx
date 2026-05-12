import React, { useCallback, useEffect, useState } from 'react';
import { WHATSAPP_URL } from '../lib/constants';

const Banner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenClaimed, setHasBeenClaimed] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    fetch('/api/banner')
      .then((res) => res.json())
      .then((data) => {
        if (!data.show) {
          setHasBeenClaimed(true);
          return;
        }
        const showTimer = setTimeout(() => {
          setIsVisible(true);
          requestAnimationFrame(() => setAnimateIn(true));
        }, 2000);
        return () => clearTimeout(showTimer);
      })
      .catch(() => {
        const showTimer = setTimeout(() => {
          setIsVisible(true);
          requestAnimationFrame(() => setAnimateIn(true));
        }, 2000);
        return () => clearTimeout(showTimer);
      })
      .finally(() => setChecking(false));
  }, []);

  const markAsSeen = useCallback(() => {
    fetch('/api/banner', { method: 'POST' }).catch(() => {});
  }, []);

  const handleCTAClick = useCallback(() => {
    markAsSeen();
    setHasBeenClaimed(true);
    setIsVisible(false);
    const mensaje = encodeURIComponent(
      '¡Hola! Vi el 20% de descuento en tu primer proyecto y me gustaría obtener más información.'
    );
    window.open(`${WHATSAPP_URL}?text=${mensaje}`, '_blank');
  }, [markAsSeen]);

  const handleClose = useCallback(() => {
    markAsSeen();
    setAnimateIn(false);
    setTimeout(() => setIsVisible(false), 200);
  }, [markAsSeen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible && animateIn) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, animateIn, handleClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose],
  );

  if (checking) return null;
  if (hasBeenClaimed) return null;
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        animateIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />

      <div
        className={`relative w-full max-w-md bg-black border border-violet-500/30 p-0 transition-all duration-500 ${
          animateIn ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-8 opacity-0'
        }`}
        style={{
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.15), 0 0 80px rgba(139, 92, 246, 0.05)',
        }}
      >
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-violet-400" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-violet-400" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-violet-400" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-violet-400" />

        <button
          onClick={handleClose}
          type="button"
          aria-label="Cerrar"
          className="absolute -top-4 -right-4 w-11 h-11 flex items-center justify-center bg-black border border-violet-500/40 text-violet-400 text-xl leading-none hover:text-white hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all duration-200 z-10"
        >
          ×
        </button>

        <div className="p-8 pt-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-violet-400 mb-3 text-center">
            Oferta de lanzamiento
          </p>

          <h3 className="font-heading text-2xl sm:text-3xl text-white text-center mb-6">
            20% OFF
          </h3>

          <p className="text-sm text-gray-400 text-center mb-8 leading-relaxed">
            en tu <span className="text-white">primer proyecto web</span>
          </p>

          <button
            className="w-full bg-violet-600 text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300"
            onClick={handleCTAClick}
            type="button"
          >
            Aprovechar ahora
          </button>

          <p className="text-[9px] text-gray-600 text-center mt-4 tracking-wider">
            click fuera del panel o presiona ESC para cerrar
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
