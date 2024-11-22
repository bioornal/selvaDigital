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
    <section className="relative bg-cover bg-center bg-no-repeat text-white min-h-screen flex items-center" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1527600478564-488952effedb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
    }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-20 mt-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna izquierda (70%) */}
          <div className="lg:col-span-8 ml-16">
            {/* Contenedor con altura fija para el texto animado */}
            <div className="h-[200px]"> {/* Ajusta esta altura según necesites */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-geist"
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

            {/* Contenedor separado para badges y botón */}
            <div className="mt-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                {[
                  { icon: '🏆', text: 'Premiados 2023' },
                  { icon: '⚡', text: 'Entrega Rápida' },
                  { icon: '🛡️', text: 'Garantía 100%' }
                ].map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-sm font-medium">{badge.text}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  asChild 
                  className="
                    bg-gradient-to-r from-emerald-500 to-azure-radiance-500
                    text-white 
                    hover:from-emerald-600 hover:to-azure-radiance-600
                    text-xl 
                    py-4 
                    px-10 
                    shadow-lg 
                    hover:shadow-xl 
                    transform 
                    transition-all 
                    duration-300 
                    font-bold 
                    rounded-full 
                    border-4 
                    border-white/20
                    relative
                    overflow-hidden
                    group
                  "
                >
                  <a href="#contacto" className="flex items-center gap-2">
                    <span className="relative z-10">Potencia tu presencia digital</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 animate-bounce relative z-10" 
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

          {/* Columna derecha (30%) */}
          <div className="lg:col-span-4 h-[400px]">
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
    </section>
  );
};

export default Hero;