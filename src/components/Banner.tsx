import React, { useEffect, useState } from 'react';

const Banner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 59,
    seconds: 59
  });

  const handleWhatsAppClick = () => {
    const mensaje = encodeURIComponent('¡Hola! Vi la oferta de lanzamiento del 20% de descuento en su sitio web y me gustaría obtener más información. 😊');
    window.open(`https://wa.me/5493757210123?text=${mensaje}`, '_blank');
  };

  useEffect(() => {
    // Mostrar banner después de 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Contador regresivo
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(interval);
          return prev;
        }

        let newHours = prev.hours;
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds - 1;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <div className={`fixed bottom-24 right-8 max-w-sm z-50 transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    }`}>
      <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white p-6 rounded-lg shadow-2xl border-2 border-white/20">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
          type="button"
          aria-label="Cerrar banner"
        >
          ×
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-2">🚀</span>
          <h3 className="text-xl font-bold mb-2 text-center">¡Oferta de Lanzamiento!</h3>
          <div className="text-center mb-4">
            <p className="text-2xl font-bold text-yellow-300">20% OFF</p>
            <p className="text-sm">en tu primer proyecto web</p>
          </div>
          
          <div className="bg-white/20 px-4 py-2 rounded-full text-sm mb-4">
            Oferta termina en: <span className="font-bold">
              {`${formatTime(timeLeft.hours)}:${formatTime(timeLeft.minutes)}:${formatTime(timeLeft.seconds)}`}
            </span>
          </div>
          
          <button 
            className="w-full bg-white text-red-600 px-6 py-2 rounded-full 
                     text-sm font-bold hover:bg-red-100 transition-all duration-300
                     transform hover:scale-105"
            onClick={handleWhatsAppClick}
            type="button"
          >
            ¡Aprovecha ahora!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;