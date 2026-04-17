"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

export default function AnimatedCard({ children }: { children: ReactNode }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileHover={{
        y: -6,
        boxShadow: "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px, rgb(0,0,0) -7px 7px",
        transition: { duration: 0.2 },
      }}
      className="relative overflow-hidden rounded-3xl p-6 group bg-white border transition-all duration-300"
      style={{ borderColor: '#dad4c8', boxShadow: 'rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px' }}
    >
      {/* Borde superior animado */}
      <motion.div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#fbbd41] via-[#3bd3fd] to-transparent"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.5 }}
      />

      {/* Efecto de brillo con movimiento */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(251, 189, 65, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(59, 211, 253, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, rgba(251, 189, 65, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Contenido */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
