"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ArrowRight, Sparkles, Zap, ChevronDown } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { formatearPrecio, formatearNumero } from "@/lib/format"
import { AnimatedCounter } from "@/components/ui/animated-counter"
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

  // Parallax: la imagen se mueve más lento que el texto al hacer scroll
  const yImagen = useTransform(scrollYProgress, [0, 1], [0, 120])
  const yTexto = useTransform(scrollYProgress, [0, 1], [0, -40])
  const opacityScroll = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="hero-glow relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Imagen de fondo a pantalla completa con parallax */}
      <motion.div
        style={{ y: yImagen }}
        className="absolute inset-0 z-0"
      >
        <SmartImage
          src={vehiculoDestacado.imagenes[0]}
          alt={`${vehiculoDestacado.marca} ${vehiculoDestacado.modelo}`}
          containerClassName="h-full w-full"
          priority
          className="h-full w-full object-cover"
        />
        {/* Degradados para legibilidad y profundidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </motion.div>

      {/* Contenido */}
      <motion.div
        style={{ y: yTexto, opacity: opacityScroll }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeLux }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
              <Sparkles
                className="h-3.5 w-3.5 text-[var(--signature)]"
                strokeWidth={2.2}
              />
              Marketplace de alta gama · {vehiculos.length} modelos
            </span>
          </motion.div>

          {/* Título enorme */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeLux }}
            className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Donde la pasión
            <br />
            <span className="text-gradient">se convierte</span>
            <br />
            en velocidad
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeLux }}
            className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Una selección curada de los automóviles más extraordinarios del
            mundo. Diseño, ingeniería y emoción reunidos en una experiencia
            de compra premium.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeLux }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/marketplace"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90 hover:shadow-[0_8px_30px_-8px_oklch(0.98_0_0/0.4)] active:scale-[0.98] sm:w-auto"
            >
              Explorar vehículos
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={`/vehiculos/${vehiculoDestacado.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 bg-background/40 px-7 py-4 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:bg-background/60 active:scale-[0.98] sm:w-auto"
            >
              Ver vehículo destacado
            </Link>
          </motion.div>

          {/* Métricas con contadores animados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: easeLux }}
            className="mt-14 flex items-center gap-8 sm:gap-12"
          >
            <Metrica
              valor={
                <AnimatedCounter
                  valor={vehiculos.length}
                  className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                />
              }
              etiqueta="Modelos"
            />
            <div className="h-12 w-px bg-border" />
            <Metrica
              valor={
                <AnimatedCounter
                  valor={new Set(vehiculos.map((v) => v.marca)).size}
                  className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                />
              }
              etiqueta="Marcas"
            />
            <div className="hidden h-12 w-px bg-border sm:block" />
            <Metrica
              valor={
                <AnimatedCounter
                  valor={100}
                  sufijo="%"
                  className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                />
              }
              etiqueta="Curado"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        style={{ opacity: opacityScroll }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
            Desliza
          </span>
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </motion.div>
      </motion.div>

      {/* Tarjeta flotante del vehículo destacado (desktop) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: easeLux }}
        className="absolute bottom-12 right-12 z-10 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Link
            href={`/vehiculos/${vehiculoDestacado.id}`}
            className="group block w-72 overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-4 backdrop-blur-xl transition-all duration-500 hover:border-border hover:bg-card/95 hover:shadow-[0_20px_60px_-12px_oklch(0_0_0/0.8)]"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--signature)]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--signature)]">
                <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                Destacado
              </span>
            </div>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {vehiculoDestacado.marca}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {vehiculoDestacado.modelo}
            </h3>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                <Zap
                  className="h-3 w-3 text-[var(--signature)]"
                  strokeWidth={2.5}
                />
                {formatearNumero(vehiculoDestacado.potencia)} HP
              </span>
              <span className="text-base font-semibold tracking-tight text-foreground">
                {formatearPrecio(vehiculoDestacado.precio)}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              Ver detalles
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Metrica({
  valor,
  etiqueta,
}: {
  valor: React.ReactNode
  etiqueta: string
}) {
  return (
    <div>
      {valor}
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {etiqueta}
      </p>
    </div>
  )
}
