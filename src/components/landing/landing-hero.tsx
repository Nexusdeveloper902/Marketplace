"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { SmartImage } from "@/components/ui/smart-image"

// Vehículo protagonista del hero.
const vehiculoDestacado =
  vehiculos.find((v) => v.id === "porsche-911-carrera") ?? vehiculos[0]

const easeLux = [0.22, 1, 0.36, 1] as const

export function LandingHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Parallax cinematográfico: el vehículo se mueve y escala muy lentamente
  const yImagen = useTransform(scrollYProgress, [0, 1], [0, 80])
  const scaleImagen = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const yTexto = useTransform(scrollYProgress, [0, 1], [0, -30])
  const opacityScroll = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* Vehículo protagonista a pantalla completa con parallax + escala lenta */}
      <motion.div
        style={{ y: yImagen, scale: scaleImagen }}
        className="absolute inset-0 z-0"
      >
        <SmartImage
          src={vehiculoDestacado.imagenes[0]}
          alt={`${vehiculoDestacado.marca} ${vehiculoDestacado.modelo}`}
          containerClassName="h-full w-full"
          priority
          className="h-full w-full object-cover"
        />
        {/* Degradados cinematográficos para legibilidad y profundidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
      </motion.div>

      {/* Contenido — anclado abajo, mucho espacio negativo arriba */}
      <motion.div
        style={{ y: yTexto, opacity: opacityScroll }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8 lg:pb-32"
      >
        <div className="max-w-2xl">
          {/* Etiqueta editorial discreta */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeLux }}
            className="text-eyebrow text-[11px] text-[var(--signature)]"
          >
            Digital Marketplace · Alta Gama
          </motion.p>

          {/* Título display cinematográfico */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: easeLux }}
            className="text-display mt-6 text-5xl text-foreground sm:text-7xl lg:text-8xl xl:text-[7.5rem]"
          >
            Pura
            <br />
            <span className="text-gradient">adrenalina</span>
          </motion.h1>

          {/* Descripción corta y contundente */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: easeLux }}
            className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Los automóviles más extraordinarios del mundo, reunidos en una
            sola colección.
          </motion.p>

          {/* Único botón principal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: easeLux }}
            className="mt-10"
          >
            <Link
              href="/marketplace"
              className="group inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:gap-4 hover:shadow-[0_12px_40px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98]"
            >
              Explorar vehículos
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Indicador de scroll minimalista */}
      <motion.div
        style={{ opacity: opacityScroll }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground/60" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
