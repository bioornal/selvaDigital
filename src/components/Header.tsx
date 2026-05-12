import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTACT_PHONE, CONTACT_EMAIL, WHATSAPP_URL } from '../lib/constants';

const menuItems = [
  { href: "#sobre-nosotros", label: "Sobre Mí" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  const handleCTAClick = () => {
    window.open(WHATSAPP_URL, '_blank');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed w-full z-50"
    >
      <div className={`absolute inset-0 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-black/70 backdrop-blur-sm'}`}></div>
      <div className={`max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10`}>
        <div className="flex justify-between items-center h-20 md:h-24">
          <div className="flex items-center h-full">
            <a href="/" className="flex items-center">
              <img
                src="https://res.cloudinary.com/djtvjkcu6/image/upload/v1778510560/SelvaDigital/logoChico2_kg35ot.png"
                alt="Selva Digital"
                className="w-auto h-[48px] md:h-[60px] object-contain"
                loading="eager"
              />
            </a>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-white"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex flex-col justify-between items-end h-full py-2">
            <div className='flex items-center gap-3'>
              <span className='text-sm text-white/80 hover:text-azure-radiance-400 transition-colors duration-200 font-medium cursor-default'>{CONTACT_PHONE}</span>
              <span className='text-white/20'>|</span>
              <span className='text-sm text-white/80 hover:text-azure-radiance-400 transition-colors duration-200 cursor-default'>{CONTACT_EMAIL}</span>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <motion.button
                  onClick={handleCTAClick}
                  className="px-3 py-1 text-xs bg-azure-radiance-500 hover:bg-azure-radiance-600 text-white font-medium rounded-none transition-colors duration-200"
                >
                  PIDA PRESUPUESTO
                </motion.button>
              </motion.div>
            </div>

            <nav className="flex items-center gap-5">
              {menuItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="text-white/70 hover:text-azure-radiance-400 transition-colors duration-200 text-sm font-medium"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900 shadow-lg absolute w-full top-20 z-50 border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-4">
                <motion.button
                  onClick={handleCTAClick}
                  className="w-full px-4 py-3 text-sm bg-azure-radiance-500 text-white rounded-none font-semibold"
                  whileHover={{ backgroundColor: "#0056b3" }}
                >
                  PIDA PRESUPUESTO
                </motion.button>

                <div className="py-2 text-center space-y-2">
                  <p className="text-sm text-white font-medium">{CONTACT_PHONE}</p>
                  <p className="text-sm text-white/70">{CONTACT_EMAIL}</p>
                </div>

                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      className="block w-full px-4 py-3 text-white/90 hover:bg-white/10 text-center rounded transition-colors duration-200 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
export default Header;
