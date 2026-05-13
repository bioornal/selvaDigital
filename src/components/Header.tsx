import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WHATSAPP_URL } from '../lib/constants';

const menuItems = [
  { href: "#sobre", label: "Sobre mí" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#planes", label: "Planes" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleCTAClick = () => window.open(WHATSAPP_URL, '_blank');

  const lineColor = 'rgba(250,250,250,0.08)';
  const lineStrColor = 'rgba(250,250,250,0.18)';
  const textSoft = 'rgba(250,250,250,0.72)';
  const textDim = 'rgba(250,250,250,0.46)';
  const accent = '#2BB673';
  const bg = '#0A0B0D';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed w-full z-50"
      style={{
        background: scrolled ? `rgba(10,11,13,0.85)` : `rgba(10,11,13,0.4)`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${scrolled ? lineColor : 'transparent'}`,
        transition: 'all .25s ease',
      }}
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 relative z-10">
        <div className="flex justify-between items-center h-[74px]">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/djtvjkcu6/image/upload/v1778510560/SelvaDigital/logoChico2_kg35ot.png"
              alt="Selva Digital"
              className="w-auto h-[38px] object-contain"
              loading="eager"
            />
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(p => !p)}
            className="md:hidden p-2"
            style={{ color: textSoft }}
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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-normal transition-colors duration-200 hover:text-white"
                style={{ color: textSoft, fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs tracking-wide" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>
              +54 9 3548 550334
            </span>
            <motion.button
              onClick={handleCTAClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-[9px] text-[13px] font-semibold transition-colors duration-200"
              style={{ background: accent, color: '#06140C', fontFamily: "'Inter', system-ui, sans-serif", borderRadius: '10px' }}
            >
              Pedir presupuesto →
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 md:hidden z-40"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute w-full top-[74px] z-50"
              style={{ background: bg, borderTop: `1px solid ${lineColor}` }}
            >
              <div className="px-6 py-5 space-y-3">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block w-full px-4 py-3 text-center text-sm font-medium transition-colors"
                    style={{ color: textSoft }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={handleCTAClick}
                  className="w-full px-4 py-3 text-sm font-semibold"
                  style={{ background: accent, color: '#06140C', borderRadius: '10px' }}
                >
                  Pedir presupuesto →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
export default Header;
