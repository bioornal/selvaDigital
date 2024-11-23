import React from 'react';
import Typewriter from 'typewriter-effect';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { MeshDistortMaterial, Icosahedron } from '@react-three/drei';

const AnimatedShape = () => {
  const [hue, setHue] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setHue((prevHue) => (prevHue + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const color = `hsl(${hue}, 70%, 50%)`;

  return (
    <Canvas>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      <Icosahedron args={[1, 1]} scale={2.3}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.6}
          speed={2}
          opacity={0.15}
          wireframe
          wireframeLinewidth={2}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Icosahedron>
    </Canvas>
  );
};

const Hero: React.FC = () => {
  return (
    <section 
      className="relative bg-cover bg-center bg-no-repeat text-white min-h-[75vh] xs:min-h-[75vh] sm:min-h-[80vh] md:min-h-screen flex items-center pt-20 md:pt-0" 
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1527600478564-488952effedb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=600&q=80')`
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="mt-[0px] xs:mt-[-10px] sm:mt-[10px] md:mt-48 lg:mt-[-48px] 2xl:mt-[120px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Columna izquierda */}
            <div className="lg:col-span-8 mx-4 md:ml-16">
              {/* Contenedor del texto animado */}
              <div className="h-[120px] xs:h-[120px] sm:h-[150px] md:h-[200px]">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-base xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-geist"
                >
                  <Typewriter
                    options={{
                      strings: [
                        'Selva Digital: Transformando la comunicación empresarial',
                        'Diseño web que impulsa tu presencia online',
                        'Desarrollo a medida para potenciar tu negocio',
                        'Mantenimiento confiable para tu tranquilidad digital',
                        'Soluciones digitales que conectan con tu audiencia'
                      ],
                      autoStart: true,
                      loop: true,
                      delay: 100,
                      deleteSpeed: 25,
                    }}
                  />
                </motion.div>
              </div>

              {/* Badges y botón */}
              <div className="mt-2 md:mt-8">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-1 xs:gap-1 sm:gap-2 md:gap-4 mb-6 md:mb-8"
                >
                  {[
                    { icon: '🏆', text: 'Premiados 2023' },
                    { icon: '⚡', text: 'Entrega Rápida' },
                    { icon: '🛡️', text: 'Garantía 100%' }
                  ].map((badge, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 
                                 bg-white/5 backdrop-blur-sm 
                                 px-1 xs:px-2 sm:px-3 md:px-4 
                                 py-0.5 xs:py-0.5 sm:py-1 md:py-2 
                                 rounded-full border border-white/10"
                    >
                      <span className="text-[10px] xs:text-sm sm:text-base md:text-lg">{badge.icon}</span>
                      <span className="text-[10px] xs:text-[10px] sm:text-xs md:text-sm font-medium">{badge.text}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Contenedor del botón */}
                <div className="flex justify-center lg:justify-start">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button 
                      size="lg" 
                      asChild 
                      className="
                        w-full sm:w-auto
                        bg-gradient-to-r from-emerald-500 to-azure-radiance-500
                        text-white 
                        hover:from-emerald-600 hover:to-azure-radiance-600
                        text-lg md:text-xl 
                        py-3 md:py-4 
                        px-6 md:px-10 
                        shadow-lg 
                        hover:shadow-xl 
                        transform 
                        transition-all 
                        duration-300 
                        font-bold 
                        rounded-full 
                        border-2 md:border-4 
                        border-white/20
                        relative
                        overflow-hidden
                        group
                      "
                    >
                      <a href="#contacto" className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="relative z-10 text-xs sm:text-base md:text-lg">Potencia tu presencia digital</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-bounce relative z-10" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M13 7l5 5m0 0l-5 5m5-5H6" 
                          />
                        </svg>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Shape */}
            <div className="lg:col-span-4 h-[300px] md:h-[400px] mt-8 lg:mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full"
              >
                <AnimatedShape />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;