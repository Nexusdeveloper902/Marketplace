"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  Zap,
  ShoppingCart,
  Check,
  BadgeCheck,
  Battery,
  Flame,
  Crown,
} from "lucide-react"
import type { Vehicle } from "@/types/vehicle"
import { formatearPrecio, formatearNumero } from "@/lib/format"
import { useTienda } from "@/store/use-store"
import { useToast } from "@/hooks/use-toast"
import { FavoriteButton } from "./favorite-button"
import { CompareButton } from "./compare-button"
import { SmartImage } from "@/components/ui/smart-image"
import { cn } from "@/lib/utils"

interface VehicleCardProps {
  vehiculo: Vehicle
  etiquetaBoton?: string
  variante?: "marketplace" | "garaje" | "favoritos"
  index?: number
}

// Determina la etiqueta discreta según el vehículo.
function obtenerEtiqueta(vehiculo: Vehicle) {
  if (vehiculo.combustible === "Eléctrico")
    return { texto: "Eléctrico", icono: Battery, color: "text-[var(--chart-4)]" }
  if (vehiculo.categoria === "Superdeportivo")
    return { texto: "Superdeportivo", icono: Flame, color: "text-[var(--signature)]" }
  if (vehiculo.precio > 200000)
    return { texto: "Edición exclusiva", icono: Crown, color: "text-[var(--signature)]" }
  if (vehiculo.año >= 2024)
    return { texto: "Nuevo", icono: Sparkle, color: "text-[var(--success)]" }
  return null
}

// Icono Sparkle local para evitar import adicional.
function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      width="12"
      height="12"
    >
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
    </svg>
  )
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

  const nombreCompleto = `${vehiculo.marca} ${vehiculo.modelo}`
  const etiqueta = obtenerEtiqueta(vehiculo)

  const handleAgregar = () => {
    if (estaEnCarrito || estaComprado) return
    agregarAlCarrito(vehiculo.id)
    toast({
      title: "Añadido al carrito",
      description: `${nombreCompleto} se ha añadido a tu carrito.`,
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-all duration-500 ease-out hover:border-border/80 hover:bg-card/95 hover:shadow-card-hover"
    >
      {/* Imagen */}
      <div className="relative block aspect-[16/10] w-full overflow-hidden bg-secondary">
        <Link
          href={href}
          className="block h-full w-full"
          aria-label={`Ver detalles del ${nombreCompleto}`}
        >
          <SmartImage
            src={vehiculo.imagenes[0]}
            alt={`${nombreCompleto} ${vehiculo.año}`}
            containerClassName="h-full w-full"
            hoverScale={1.04}
          />
          {/* Degradado inferior para legibilidad */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-card/5 to-transparent" />
        </Link>

        {/* Etiqueta discreta arriba a la izquierda */}
        {etiqueta && (
          <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-background/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide backdrop-blur-md">
            <etiqueta.icono className={cn("h-3 w-3", etiqueta.color)} />
            {etiqueta.texto}
          </span>
        )}

        {/* Marca arriba a la izquierda (si no hay etiqueta) */}
        {!etiqueta && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-lg bg-background/60 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-foreground backdrop-blur-md">
            {vehiculo.marca}
          </span>
        )}

        {/* Botones de favorito y comparar arriba a la derecha */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <CompareButton
            vehiculoId={vehiculo.id}
            vehiculoNombre={nombreCompleto}
          />
          <FavoriteButton
            vehiculoId={vehiculo.id}
            vehiculoNombre={nombreCompleto}
          />
        </div>

        {/* Badge de comprado */}
        {estaComprado && (
          <span className="pointer-events-none absolute right-3 top-12 flex items-center gap-1 rounded-lg bg-[var(--success)]/15 px-2.5 py-1 text-[10px] font-semibold text-[var(--success)] backdrop-blur-md">
            <BadgeCheck className="h-3 w-3" strokeWidth={2.5} />
            Comprado
          </span>
        )}

        {/* Nombre sobre la imagen */}
        <Link
          href={href}
          className="absolute inset-x-0 bottom-0 p-4 text-left"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {vehiculo.marca}
          </p>
          <h3 className="mt-0.5 text-lg font-semibold leading-tight text-foreground drop-shadow-sm sm:text-xl">
            {vehiculo.modelo}
          </h3>
          <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
            {vehiculo.año} · {vehiculo.categoria}
          </p>
        </Link>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Precio
            </p>
            <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {formatearPrecio(vehiculo.precio)}
            </p>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Potencia
              </p>
              <p className="flex items-center justify-end gap-1 text-sm font-semibold text-foreground">
                <Zap className="h-3 w-3 text-[var(--signature)]" strokeWidth={2.5} />
                {formatearNumero(vehiculo.potencia)} HP
              </p>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="hidden sm:block">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                0-100
              </p>
              <p className="text-sm font-semibold text-foreground">
                {vehiculo.aceleracion0a100}s
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        {variante === "garaje" || variante === "favoritos" ? (
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
                    Agregar al carrito
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
