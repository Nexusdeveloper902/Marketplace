"use client"

import { motion } from "framer-motion"

/**
 * Se ejecuta en cada navegación. Transición de entrada elegante
 * que mantiene la sensación de continuidad entre páginas.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
