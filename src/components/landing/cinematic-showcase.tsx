"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { formatearNumero } from "@/lib/format"
import { SmartImage } from "@/components/ui/smart-image"

// Vehículo protagonista de la sección cinematográfica.
const vehiculoShowcase =
  vehiculos.find((v) => v.id === "lamborghini-revuelto") ?? vehiculos[0]

const easeLux = [0.22, 1, 0.36, 1] as const

const specsShowcase = [
  { valor: formatearNumero(vehiculoShowcase.potencia), etiqueta: "Caballos" },
  { valor: `${vehiculoShowcase.aceleracion0a100}s`, etiqueta: "0—100 km/h" },
  { valor: `${formatearNumero(vehiculoShowcase.velocidadMaxima)}`, etiqueta: "Vel. máxima km/h" },
]

export function CinematicShowcase() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Parallax: la imagen se mueve lentamente al hacer scroll por la sección
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90svh] items-center overflow-hidden border-y border-border/40"
    >
      {/* Imagen cinematográfica a sangre completa */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <SmartImage
          src={vehiculoShowcase.imagenes[1] ?? vehiculoShowcase.imagenes[0]}
          alt={`${vehiculoShowcase.marca} ${vehiculoShowcase.modelo}`}
          containerClassName="h-full w-full"
          className="h-full w-full object-cover"
        />
        {/* Degradado para legibilidad del texto superpuesto */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
      </motion.div>

      {/* Contenido editorial — lado izquierdo, mucho espacio negativo */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: easeLux }}
            className="text-eyebrow text-[11px] text-[var(--signature)]"
          >
            {vehiculoShowcase.marca}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeLux }}
            className="text-display mt-5 text-4xl text-foreground sm:text-6xl lg:text-7xl"
          >
            {vehiculoShowcase.modelo}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeLux }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Ingeniería que redefine los límites. Una síntesis perfecta entre
            tradición y futuro.
          </motion.p>

          {/* Especificaciones clave — discretas, separadas */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeLux }}
            className="mt-10 flex items-center gap-8 sm:gap-10"
          >
            {specsShowcase.map((spec, i) => (
              <div key={spec.etiqueta} className="flex items-center gap-8 sm:gap-10">
                {i > 0 && <div className="h-10 w-px bg-border/60" />}
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {spec.valor}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {spec.etiqueta}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Único botón de acción */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: easeLux }}
            className="mt-10"
          >
            <Link
              href={`/vehiculos/${vehiculoShowcase.id}`}
              className="group inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/40 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:bg-background/60 hover:gap-4 active:scale-[0.98]"
            >
              Descubrir el vehículo
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
