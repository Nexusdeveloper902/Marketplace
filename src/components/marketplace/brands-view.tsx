"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Gauge } from "lucide-react"
import { formatearPrecio } from "@/lib/format"
import { SmartImage } from "@/components/ui/smart-image"

export interface BrandCardData {
  marca: string
  slug: string
  cantidad: number
  precioMin: number
  precioMax: number
  imagen: string | null
  descripcion: string
}

export function BrandsView({ datosMarcas }: { datosMarcas: BrandCardData[] }) {

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/40 pb-10 pt-14 sm:pt-20"
      >
        <p className="text-eyebrow text-[11px] text-[var(--signature)]">
          Explora los fabricantes
        </p>
        <h1 className="text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl">
          Marcas disponibles
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Descubre los fabricantes más prestigiosos del mundo. Cada marca ofrece
          una selección única de vehículos con su propio carácter y herencia.
        </p>
      </motion.section>

      <section className="mt-8 pb-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {datosMarcas.map((datos, i) => (
            <motion.div
              key={datos.marca}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: Math.min(i * 0.04, 0.4),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/marcas/${datos.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-all duration-500 hover:border-border hover:shadow-card-hover"
              >
                {/* Imagen representativa */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
                  {datos.imagen ? (
                    <div className="h-full w-full opacity-70 transition-opacity duration-700 group-hover:opacity-90">
                      <SmartImage
                        src={datos.imagen}
                        alt={`Vehículo destacado de ${datos.marca}`}
                        containerClassName="h-full w-full"
                        hoverScale={1.05}
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-3xl font-bold text-muted-foreground/40">
                        {datos.marca.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  {/* Inicial de la marca como logo */}
                  <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-background/70 text-base font-bold text-foreground backdrop-blur-md">
                    {datos.marca.charAt(0)}
                  </span>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {datos.marca}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {datos.descripcion}
                  </p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Modelos
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {datos.cantidad}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Desde
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatearPrecio(datos.precioMin)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-foreground">
                    Ver modelos
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
