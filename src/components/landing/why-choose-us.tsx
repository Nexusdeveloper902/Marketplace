"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Gauge, Sparkles, Headset } from "lucide-react"

const ventajas = [
  {
    icono: ShieldCheck,
    titulo: "Garantía de autenticidad",
    descripcion:
      "Cada vehículo del catálogo está verificado con especificaciones reales de fábrica, para que tomes decisiones con total confianza.",
  },
  {
    icono: Gauge,
    titulo: "Rendimiento comprobado",
    descripcion:
      "Accede a datos técnicos precisos de potencia, motor y velocidad máxima de los modelos más extraordinarios del mundo.",
  },
  {
    icono: Sparkles,
    titulo: "Selección curada",
    descripcion:
      "Una colección cuidadosamente elegida entre las marcas más prestigiosas, sin ruido ni opciones de relleno.",
  },
  {
    icono: Headset,
    titulo: "Experiencia premium",
    descripcion:
      "Una interfaz diseñada con obsessive atención al detalle, pensada para que explorar sea tan emocionante como conducir.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            ¿Por qué elegirnos?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Diseñado para los amantes
            <br />
            <span className="text-gradient">de la alta gama</span>
          </motion.h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {ventajas.map((ventaja, i) => {
            const Icono = ventaja.icono
            return (
              <motion.div
                key={ventaja.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i * 0.08, 0.4),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:border-border hover:bg-card/80"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icono className="h-5 w-5" strokeWidth={2} />
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                  {ventaja.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
