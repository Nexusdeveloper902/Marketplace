"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface AnimatedCounterProps {
  /** Valor final al que animar. */
  valor: number
  /** Duración en ms. */
  duracion?: number
  /** Sufijo a añadir (ej: "+", "%"). */
  sufijo?: string
  /** Prefijo a añadir (ej: "$"). */
  prefijo?: string
  className?: string
}

/**
 * Contador que anima de 0 al valor final cuando entra en el viewport.
 */
export function AnimatedCounter({
  valor,
  duracion = 1500,
  sufijo = "",
  prefijo = "",
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const enVista = useInView(ref, { once: true, margin: "-60px" })
  const [actual, setActual] = useState(0)

  useEffect(() => {
    if (!enVista) return

    let frame: number
    const inicio = performance.now()

    const animar = (ahora: number) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1)
      // Easing ease-out-cubic para una desaceleración elegante
      const ease = 1 - Math.pow(1 - progreso, 3)
      setActual(Math.round(ease * valor))
      if (progreso < 1) {
        frame = requestAnimationFrame(animar)
      }
    }

    frame = requestAnimationFrame(animar)
    return () => cancelAnimationFrame(frame)
  }, [enVista, valor, duracion])

  return (
    <span ref={ref} className={className}>
      {prefijo}
      {actual.toLocaleString("es-ES")}
      {sufijo}
    </span>
  )
}
