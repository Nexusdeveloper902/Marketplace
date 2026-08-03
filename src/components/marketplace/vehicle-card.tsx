"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Zap } from "lucide-react"
import type { Vehicle } from "@/types/vehicle"
import { formatearPrecio, formatearNumero } from "@/lib/format"
import { cn } from "@/lib/utils"

interface VehicleCardProps {
  vehiculo: Vehicle
  /** Etiqueta del botón de acción principal. */
  etiquetaBoton?: string
  /** Variante visual de la tarjeta. */
  variante?: "marketplace" | "garaje"
  index?: number
}

export function VehicleCard({
  vehiculo,
  etiquetaBoton = "Ver detalles",
  variante = "marketplace",
  index = 0,
}: VehicleCardProps) {
  const href = `/vehiculos/${vehiculo.id}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_0_0_oklch(1_0_0/0.04)_inset,0_8px_30px_-12px_oklch(0_0_0/0.6)] transition-all duration-500 hover:border-border hover:shadow-[0_1px_0_0_oklch(1_0_0/0.06)_inset,0_20px_50px_-12px_oklch(0_0_0/0.7)]"
    >
      {/* Imagen */}
      <Link
        href={href}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-secondary"
        aria-label={`Ver detalles del ${vehiculo.marca} ${vehiculo.modelo}`}
      >
        <img
          src={vehiculo.imagenes[0]}
          alt={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />
        {/* Degradado inferior para legibilidad */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent" />

        {/* Marca arriba a la izquierda */}
        <span className="absolute left-3 top-3 rounded-full bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-md">
          {vehiculo.marca}
        </span>

        {/* Potencia arriba a la derecha */}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md">
          <Zap className="h-3 w-3 text-[var(--signature)]" strokeWidth={2.5} />
          {formatearNumero(vehiculo.potencia)} HP
        </span>

        {/* Nombre sobre la imagen */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-left">
          <h3 className="text-lg font-semibold leading-tight text-foreground drop-shadow-sm sm:text-xl">
            {vehiculo.modelo}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {vehiculo.año} · {vehiculo.combustible}
          </p>
        </div>
      </Link>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Precio
            </p>
            <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {formatearPrecio(vehiculo.precio)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Vel. máxima
            </p>
            <p className="text-sm font-semibold text-foreground">
              {formatearNumero(vehiculo.velocidadMaxima)} km/h
            </p>
          </div>
        </div>

        <Link
          href={href}
          className={cn(
            "group/btn mt-auto flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300",
            variante === "garaje"
              ? "border-border bg-secondary text-foreground hover:bg-accent"
              : "border-transparent bg-primary text-primary-foreground hover:opacity-90"
          )}
        >
          {etiquetaBoton}
          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  )
}
