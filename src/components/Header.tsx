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
        <div className="flex justify-between items-center h-32">
          {/* Columna izquierda */}
          <div className="flex-1 flex items-center justify-start h-full">
            <a href="/" className="flex items-center ml-36">
              <img
                src="/logo3.png"
                alt="Selva Digital Logo"
                className="w-auto h-[80px] object-contain"
                style={{ maxHeight: '80px', marginTop: '-110px', marginBottom: '-110px' }}
              />
            </a>
          </div>

          {/* Columna derecha */}
          <div className="flex-1 flex flex-col justify-between items-end h-full py-2">
            {/* Fila superior */}
            <div className=' flex items-center justify-center mr-10'>
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
              <span className='text-sm text-gray-900 hover:text-azure-radiance-400 hover:underline transition-all duration-200  cursor-default'>selvadigitaliguazu@gmail.com</span>
            </div>

            {/* Fila inferior */}
            <nav className="hidden md:flex space-x-6 mb-4 mr-10">
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

      {/* Menú móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-900 py-4"
          >
            {menuItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
export default Header;
