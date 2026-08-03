"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Zap, ShoppingCart, Check, BadgeCheck } from "lucide-react"
import type { Vehicle } from "@/types/vehicle"
import { formatearPrecio, formatearNumero } from "@/lib/format"
import { useTienda } from "@/store/use-store"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface VehicleCardProps {
  vehiculo: Vehicle
  /** Etiqueta del botón de navegación. */
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
  const estaEnCarrito = useTienda((s) => s.estaEnCarrito(vehiculo.id))
  const estaComprado = useTienda((s) => s.estaComprado(vehiculo.id))
  const agregarAlCarrito = useTienda((s) => s.agregarAlCarrito)
  const { toast } = useToast()

  const handleAgregar = () => {
    if (estaEnCarrito || estaComprado) return
    agregarAlCarrito(vehiculo.id)
    toast({
      title: "Añadido al carrito",
      description: `${vehiculo.marca} ${vehiculo.modelo} se ha añadido a tu carrito.`,
    })
  }

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

        {/* Indicadores de estado arriba a la derecha */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
          <span className="flex items-center gap-1 rounded-full bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md">
            <Zap className="h-3 w-3 text-[var(--signature)]" strokeWidth={2.5} />
            {formatearNumero(vehiculo.potencia)} HP
          </span>
          {estaComprado && (
            <span className="flex items-center gap-1 rounded-full bg-[var(--success)]/15 px-2.5 py-1 text-[11px] font-semibold text-[var(--success)] backdrop-blur-md">
              <BadgeCheck className="h-3 w-3" strokeWidth={2.5} />
              Comprado
            </span>
          )}
        </div>

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

        {/* Acciones */}
        {variante === "garaje" ? (
          <Link
            href={href}
            className="group/btn mt-auto flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-semibold transition-all duration-300 hover:bg-accent"
          >
            {etiquetaBoton}
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Link>
        ) : (
          <div className="mt-auto flex flex-col gap-2.5 sm:flex-row">
            {/* Agregar al carrito */}
            <button
              onClick={handleAgregar}
              disabled={estaEnCarrito || estaComprado}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.98]",
                estaComprado
                  ? "cursor-default border-border/50 bg-secondary/50 text-muted-foreground"
                  : estaEnCarrito
                    ? "cursor-default border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
                    : "border-border bg-secondary text-foreground hover:bg-accent"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {estaComprado ? (
                  <motion.span
                    key="comprado"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5"
                  >
                    <BadgeCheck className="h-4 w-4" strokeWidth={2.3} />
                    Comprado
                  </motion.span>
                ) : estaEnCarrito ? (
                  <motion.span
                    key="encarrito"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    En el carrito
                  </motion.span>
                ) : (
                  <motion.span
                    key="agregar"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5"
                  >
                    <ShoppingCart className="h-4 w-4" strokeWidth={2.2} />
                    Agregar
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Ver detalles */}
            <Link
              href={href}
              className="group/btn flex flex-1 items-center justify-between gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {etiquetaBoton}
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </motion.article>
  )
}
