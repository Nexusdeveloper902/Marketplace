"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Check,
  Gauge,
  Zap,
  Cog,
  Fuel,
  Calendar,
  Rocket,
  ShoppingCart,
  BadgeCheck,
} from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { useTienda } from "@/store/use-store"
import { formatearPrecio, formatearNumero } from "@/lib/format"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const especificaciones = [
  { clave: "motor", etiqueta: "Motor", icono: Gauge },
  { clave: "potencia", etiqueta: "Potencia", icono: Zap, sufijo: " HP" },
  { clave: "transmision", etiqueta: "Transmisión", icono: Cog },
  { clave: "combustible", etiqueta: "Combustible", icono: Fuel },
  { clave: "año", etiqueta: "Año", icono: Calendar },
  {
    clave: "velocidadMaxima",
    etiqueta: "Vel. máxima",
    icono: Rocket,
    sufijo: " km/h",
  },
] as const

interface VehicleDetailViewProps {
  id: string
}

export function VehicleDetailView({ id }: VehicleDetailViewProps) {
  const estaEnCarrito = useTienda((s) => s.estaEnCarrito(id))
  const estaComprado = useTienda((s) => s.estaComprado(id))
  const agregarAlCarrito = useTienda((s) => s.agregarAlCarrito)
  const { toast } = useToast()

  const vehiculo = vehiculos.find((v) => v.id === id)
  const [imagenActiva, setImagenActiva] = useState(0)

  if (!vehiculo) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
        <p className="text-lg font-medium text-foreground">
          Vehículo no encontrado
        </p>
        <Link
          href="/marketplace"
          className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Volver al marketplace
        </Link>
      </div>
    )
  }

  const handleAgregar = () => {
    if (estaEnCarrito || estaComprado) return
    agregarAlCarrito(vehiculo.id)
    toast({
      title: "Añadido al carrito",
      description: `${vehiculo.marca} ${vehiculo.modelo} se ha añadido a tu carrito.`,
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      {/* Botón volver */}
      <Link
        href="/marketplace"
        className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Volver al marketplace
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Columna izquierda: galería */}
        <div className="flex flex-col gap-3">
          <motion.div
            key={imagenActiva}
            initial={{ opacity: 0.3, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/70 bg-card"
          >
            <img
              src={vehiculo.imagenes[imagenActiva]}
              alt={`${vehiculo.marca} ${vehiculo.modelo} - imagen ${imagenActiva + 1}`}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-md">
              {vehiculo.marca}
            </span>
            {estaComprado && (
              <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[var(--success)]/20 px-3 py-1.5 text-[11px] font-semibold text-[var(--success)] backdrop-blur-md">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                Comprado
              </span>
            )}
          </motion.div>

          {/* Miniaturas */}
          <div className="grid grid-cols-4 gap-3">
            {vehiculo.imagenes.map((img, i) => (
              <button
                key={i}
                onClick={() => setImagenActiva(i)}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-xl border transition-all duration-200",
                  imagenActiva === i
                    ? "border-foreground/40 ring-2 ring-ring/40"
                    : "border-border/70 opacity-60 hover:opacity-100"
                )}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <img
                  src={img}
                  alt={`${vehiculo.marca} ${vehiculo.modelo} - miniatura ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Columna derecha: información */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {vehiculo.marca}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {vehiculo.modelo}
            </h1>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              {vehiculo.año} · {vehiculo.combustible} ·{" "}
              {formatearNumero(vehiculo.potencia)} HP
            </p>

            <div className="mt-6 flex items-end gap-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Precio
              </p>
            </div>
            <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {formatearPrecio(vehiculo.precio)}
            </p>

            <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
              {vehiculo.descripcion}
            </p>
          </motion.div>

          {/* Especificaciones */}
          <div className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Especificaciones
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {especificaciones.map((spec) => {
                const Icono = spec.icono
                const valor = vehiculo[spec.clave]
                return (
                  <div
                    key={spec.clave}
                    className="rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-border"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icono className="h-4 w-4" strokeWidth={2} />
                      <span className="text-[11px] font-medium uppercase tracking-wider">
                        {spec.etiqueta}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {typeof valor === "number"
                        ? formatearNumero(valor)
                        : valor}
                      {spec.sufijo ?? ""}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Acción de compra */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleAgregar}
              disabled={estaEnCarrito || estaComprado}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300",
                estaComprado
                  ? "cursor-default bg-secondary text-muted-foreground"
                  : estaEnCarrito
                    ? "cursor-default border border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
                    : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.99]"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {estaComprado ? (
                  <motion.span
                    key="comprado"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <BadgeCheck className="h-4 w-4 text-[var(--success)]" strokeWidth={2.5} />
                    Vehículo comprado
                  </motion.span>
                ) : estaEnCarrito ? (
                  <motion.span
                    key="encarrito"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    En el carrito
                  </motion.span>
                ) : (
                  <motion.span
                    key="agregar"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" strokeWidth={2.2} />
                    Agregar al carrito
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {estaEnCarrito && !estaComprado && (
              <Link
                href="/carrito"
                className="rounded-xl border border-border bg-card px-6 py-4 text-center text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Ver carrito y finalizar compra
              </Link>
            )}
            {estaComprado && (
              <Link
                href="/garaje"
                className="rounded-xl border border-border bg-card px-6 py-4 text-center text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Ver en mi garaje
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
