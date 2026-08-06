"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Gauge, Sparkles, Headset } from "lucide-react"

const easeLux = [0.22, 1, 0.36, 1] as const

const ventajas = [
  {
    icono: ShieldCheck,
    titulo: "Autenticidad garantizada",
    descripcion:
      "Especificaciones verificadas de fábrica en cada modelo del catálogo.",
  },
  {
    icono: Gauge,
    titulo: "Rendimiento comprobado",
    descripcion:
      "Datos técnicos precisos de los motores más extraordinarios del mundo.",
  },
  {
    icono: Sparkles,
    titulo: "Selección curada",
    descripcion:
      "Una colección cuidadosamente elegida entre las marcas más prestigiosas.",
  },
  {
    icono: Headset,
    titulo: "Experiencia premium",
    descripcion:
      "Cada detalle diseñado para que explorar sea tan emocionante como conducir.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="border-y border-border/40 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-eyebrow text-[11px] text-[var(--signature)]"
          >
            El lujo en movimiento
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05, ease: easeLux }}
            className="text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl"
          >
            Diseñado para los
            <br />
            <span className="text-gradient">amantes del detalle</span>
          </motion.h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {ventajas.map((ventaja, i) => {
            const Icono = ventaja.icono
            return (
              <motion.div
                key={ventaja.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(i * 0.08, 0.4),
                  ease: easeLux,
                }}
                className="group rounded-2xl border border-border/50 bg-card/50 p-7 shadow-card transition-all duration-500 hover:border-border hover:bg-card hover:shadow-card-hover"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icono className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 text-base font-semibold tracking-tight text-foreground">
                  {ventaja.titulo}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {ventaja.descripcion}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
