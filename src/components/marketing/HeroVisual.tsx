"use client";
import { motion } from "framer-motion";

export const HeroVisual = () => {
  // Variantes para la animación de flotación
  const floatingVariant = {
    initial: { y: 0 },
    animate: { 
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
      }
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      {/* Luz central intensa */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      
      {/* Estructura Abstracta Central */}
      <motion.div 
        variants={floatingVariant}
        initial="initial"
        animate="animate"
        className="relative z-10 w-[400px] h-[400px] relative"
      >
        {/* Círculos concéntricos que giran */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-blue-500/30"
            style={{ margin: `${i * 40}px` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20 + i * 5, ease: "linear", repeat: Infinity }}
          />
        ))}

        {/* Núcleo central brillante */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-md opacity-80 shadow-2xl shadow-blue-500/50" />
        
        {/* Partículas orbitando (representación de datos) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-300 rounded-full blur-[2px]" />
          <div className="absolute bottom-10 right-10 w-3 h-3 bg-indigo-300 rounded-full blur-[2px]" />
        </motion.div>
      </motion.div>
    </div>
  );
};