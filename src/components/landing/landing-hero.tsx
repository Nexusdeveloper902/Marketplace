"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { formatearPrecio, formatearNumero } from "@/lib/format"

// Vehículo destacado para el hero (seleccionado por ser un icono).
const vehiculoDestacado = vehiculos.find((v) => v.id === "porsche-911-carrera") ?? vehiculos[0]

export function LandingHero() {
  return (
    <section className="hero-glow relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Texto */}
          <div className="relative z-10 text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--signature)]" strokeWidth={2.2} />
              Marketplace de alta gama · {vehiculos.length} modelos
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Donde la pasión
              <br />
              <span className="text-gradient">se convierte en velocidad</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
            >
              Una selección curada de los automóviles más extraordinarios del
              mundo. Diseño, ingeniería y emoción reunidos en una experiencia
              de compra premium.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start"
            >
              <Link
                href="/marketplace"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
              >
                Explorar vehículos
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/garaje"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto"
              >
                Mi Garaje
              </Link>
            </motion.div>

            {/* Métricas */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-10 flex items-center justify-center gap-6 sm:gap-8 lg:justify-start"
            >
              {[
                { valor: `${vehiculos.length}`, etiqueta: "Modelos" },
                { valor: `${marcasCount()}`, etiqueta: "Marcas" },
                { valor: "100%", etiqueta: "Curado" },
              ].map((m) => (
                <div key={m.etiqueta} className="text-center lg:text-left">
                  <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {m.valor}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {m.etiqueta}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Imagen del vehículo destacado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Link
              href={`/vehiculos/${vehiculoDestacado.id}`}
              className="group relative block overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_30px_80px_-20px_oklch(0_0_0/0.8)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={vehiculoDestacado.imagenes[0]}
                  alt={`${vehiculoDestacado.marca} ${vehiculoDestacado.modelo}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              </div>

              {/* Etiqueta de destacado */}
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-[var(--signature)]" strokeWidth={2.5} />
                Vehículo destacado
              </span>

              {/* Información sobre la imagen */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {vehiculoDestacado.marca}
                </p>
                <div className="mt-1.5 flex flex-wrap items-end justify-between gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {vehiculoDestacado.modelo}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 rounded-full bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md">
                      <Zap className="h-3 w-3 text-[var(--signature)]" strokeWidth={2.5} />
                      {formatearNumero(vehiculoDestacado.potencia)} HP
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                      {formatearPrecio(vehiculoDestacado.precio)}
                    </span>
                  </div>
                </div>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                  Ver detalles
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function marcasCount() {
  return new Set(vehiculos.map((v) => v.marca)).size
}
