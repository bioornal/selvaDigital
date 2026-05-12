import React from 'react';
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';

const AnimatedOrbs = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="w-full h-full flex items-center justify-center"
    >
      <div className="relative w-64 h-64 md:w-[330px] md:h-[330px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-azure-radiance-400/20"
          style={{ borderStyle: 'dashed' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-5 rounded-full border border-violet-400/15"
          style={{ borderStyle: 'dotted' }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-10 rounded-full border border-emerald-400/15"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-azure-radiance-500/20 via-violet-500/15 to-emerald-500/20 backdrop-blur-sm border border-white/5" />
        </motion.div>
        {/* Satellites */}
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-azure-radiance-400 shadow-[0_0_10px_rgba(0,123,255,0.5)]" />
        </motion.div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute inset-5">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
        </motion.div>
      </div>
    </motion.div>
  );
};

interface HeroDynamicProps {
  type?: 'typewriter' | 'orbs';
}

const HeroDynamic: React.FC<HeroDynamicProps> = ({ type = 'typewriter' }) => {
  if (type === 'orbs') {
    return <AnimatedOrbs />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-azure-radiance-200 font-mono italic"
    >
      <Typewriter
        options={{
          strings: [
            'Sitios web profesionales que convierten',
            'E-commerce con carrito y pagos online',
            'Sistemas a medida para tu gestión',
            'Chatbots con IA que atienden 24/7',
            'Apps personalizadas para tu negocio'
          ],
          autoStart: true,
          loop: true,
          delay: 50,
          deleteSpeed: 30,
        }}
      />
    </motion.div>
  );
};

export default HeroDynamic;
