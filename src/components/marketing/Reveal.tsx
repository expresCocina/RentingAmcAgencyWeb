"use client";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
}

/**
 * Componente Reveal: Crea un efecto de "fade-in" y "slide-up"
 * cuando el elemento entra en el campo de visión del usuario.
 * Funciona correctamente en móvil y desktop.
 */
export const Reveal = ({ children, width = "fit-content" }: Props) => {
  return (
    <div style={{ position: "relative", width }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: "easeOut"
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};