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
            <a 
              href="https://www.instagram.com/selvadigital_creaciones/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="text-white opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center p-1"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051c-.058 1.28-.072 1.689-.072 4.949 0 3.26.014 3.26.072 4.54.196 4.363 2.618 6.786 6.98 6.986 1.281.057 1.689.072 4.948.072 3.26 0 3.668-.015 4.948-.072 4.354-.196 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.54 0-3.26-.014-3.668-.073-4.948-.197-4.364-2.618-6.786-6.979-6.986C15.668.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            <span className="w-px h-3.5 bg-[rgba(250,250,250,0.18)]" />
            <span className="text-xs tracking-wide" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>
              +54 9 3757 652007
            </span>
            <motion.button
              onClick={handleCTAClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-[9px] text-[13px] font-semibold transition-colors duration-200 rounded-none"
              style={{ background: accent, color: '#06140C', fontFamily: "'Inter', system-ui, sans-serif", borderRadius: '0px' }}
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
                                <div className="flex justify-center gap-6 py-2 border-t border-[rgba(250,250,250,0.06)]">
                  <a 
                    href="/portal" 
                    className="flex items-center gap-2 text-xs opacity-75 hover:opacity-100 transition-opacity py-1"
                    style={{ color: textSoft, fontFamily: "'Inter', system-ui, sans-serif" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Portal Clientes
                  </a>
                  <span className="text-white opacity-20 py-1">|</span>
                  <a 
                    href="https://www.instagram.com/selvadigital_creaciones/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-xs opacity-75 hover:opacity-100 transition-opacity py-1"
                    style={{ color: textSoft, fontFamily: "'Inter', system-ui, sans-serif" }}
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051c-.058 1.28-.072 1.689-.072 4.949 0 3.26.014 3.26.072 4.54.196 4.363 2.618 6.786 6.98 6.986 1.281.057 1.689.072 4.948.072 3.26 0 3.668-.015 4.948-.072 4.354-.196 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.54 0-3.26-.014-3.668-.073-4.948-.197-4.364-2.618-6.786-6.979-6.986C15.668.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                </div>

                <button
                  onClick={handleCTAClick}
                  className="w-full px-4 py-3 text-sm font-semibold rounded-none"
                  style={{ background: accent, color: '#06140C', borderRadius: '0px' }}
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
