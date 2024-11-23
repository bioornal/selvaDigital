import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const menuItems = [
  { href: "#sobre-nosotros", label: "Sobre Nosotros" },
  { href: "#servicios-digitales", label: "Servicios" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contacto", label: "Contacto" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5493757210123', '_blank');
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed w-full z-50"
    >
      <div className="absolute inset-0 bg-gray-50 shadow-md"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center h-20 md:h-32">
          {/* Logo */}
          <div className="flex-1 flex items-center justify-start h-full">
            <a href="/" className="flex items-center ml-2 md:ml-36">
              <img
                src="/logo3.png"
                alt="Selva Digital Logo"
                className="w-auto h-[50px] md:h-[80px] object-contain"
                style={{ maxHeight: '80px', marginTop: '-110px', marginBottom: '-110px' }}
              />
            </a>
          </div>

          {/* Botón menú móvil */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Contenido derecho - visible solo en desktop */}
          <div className="hidden md:flex-1 md:flex md:flex-col md:justify-between md:items-end md:h-full md:py-2">
            {/* Información de contacto */}
            <div className='flex items-center justify-center mr-10'>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <motion.button
                  onClick={handleWhatsAppClick}
                  className="px-4 py-1 text-sm bg-azure-radiance-500 text-white mr-1"
                  style={{borderRadius: '5px'}}
                  whileHover={{ backgroundColor: "#0056b3" }}
                  transition={{ duration: 0.3 }}
                >
                  PIDA PRESUPUESTO
                </motion.button>
              </motion.div>
              <span className='text-sm text-gray-900 mr-1 hover:text-azure-radiance-400 hover:underline transition-all duration-200 font-bold cursor-default'>+54 9 3757 210123</span>
              <span className='text-sm text-gray-900 mr-1'>|</span>
              <span className='text-sm text-gray-900 hover:text-azure-radiance-400 hover:underline transition-all duration-200 cursor-default'>selvadigitaliguazu@gmail.com</span>
            </div>

            {/* Menú de navegación desktop */}
            <nav className="space-x-6 mb-4 mr-10">
              {menuItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="text-gray-900 hover:text-azure-radiance-700 transition-colors duration-200"
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

      {/* Menú móvil mejorado */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg absolute w-full top-20"
          >
            <div className="px-4 py-4 space-y-4">
              <motion.button
                onClick={handleWhatsAppClick}
                className="w-full px-4 py-3 text-sm bg-azure-radiance-500 text-white rounded font-semibold"
                whileHover={{ backgroundColor: "#0056b3" }}
              >
                PIDA PRESUPUESTO
              </motion.button>
              
              <div className="py-2 text-center space-y-2">
                <p className="text-sm text-gray-900 font-medium">+54 9 3757 210123</p>
                <p className="text-sm text-gray-900">selvadigitaliguazu@gmail.com</p>
              </div>

              <div className="space-y-2">
                {menuItems.map((item) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="block w-full px-4 py-3 text-gray-700 hover:bg-gray-100 text-center rounded transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
export default Header;
