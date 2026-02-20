"use client";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
}

/**
 * Componente Reveal: Crea un efecto de "fade-in" y "slide-up" 
 * cuando el elemento entra en el campo de visión del usuario.
 */
export const Reveal = ({ children, width = "fit-content" }: Props) => {
  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0, y: 75 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} // La animación solo ocurre una vez al bajar
        transition={{ 
          duration: 0.5, 
          delay: 0.25,
          ease: "easeOut" 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};