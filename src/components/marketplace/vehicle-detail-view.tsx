"use client"

import { useState, useEffect } from "react"
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
  Wind,
  Timer,
} from "lucide-react"
import type { Vehicle } from "@/types/vehicle"
import { useTienda } from "@/store/use-store"
import { formatearPrecio, formatearNumero } from "@/lib/format"
import { useToast } from "@/hooks/use-toast"
import { FavoriteButton } from "./favorite-button"
import { CompareButton } from "./compare-button"
import { FinancingCalculator } from "./financing-calculator"
import { RelatedVehicles } from "./related-vehicles"
import { ReviewsSection } from "./reviews-section"
import { SmartImage } from "@/components/ui/smart-image"
import { cn } from "@/lib/utils"

const especificaciones = [
  { clave: "motor", etiqueta: "Motor", icono: Gauge },
  { clave: "potencia", etiqueta: "Potencia", icono: Zap, sufijo: " HP" },
  { clave: "torque", etiqueta: "Torque", icono: Gauge, sufijo: " Nm" },
  { clave: "transmision", etiqueta: "Transmisión", icono: Cog },
  { clave: "combustible", etiqueta: "Combustible", icono: Fuel },
  { clave: "traccion", etiqueta: "Tracción", icono: Wind },
  { clave: "año", etiqueta: "Año", icono: Calendar },
  {
    clave: "velocidadMaxima",
    etiqueta: "Vel. máxima",
    icono: Rocket,
    sufijo: " km/h",
  },
  {
    clave: "aceleracion0a100",
    etiqueta: "0-100 km/h",
    icono: Timer,
    sufijo: " s",
  },
] as const

interface VehicleDetailViewProps {
  vehiculo: Vehicle
  catalogo: Vehicle[]
}

/**
 * Componente exterior: gestiona el registro de "visto recientemente"
 * y el estado de vehículo no encontrado. El contenido interactivo
 * se delega a un componente interior con `key={id}` para resetear
 * el estado (imagen activa) al navegar entre vehículos.
 */
export function VehicleDetailView({ vehiculo, catalogo }: VehicleDetailViewProps) {
  const marcarVisto = useTienda((s) => s.marcarVisto)

  useEffect(() => {
    if (vehiculo) {
      marcarVisto(vehiculo.id)
    }
  }, [vehiculo, marcarVisto])

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

  return <VehicleDetailContent key={vehiculo.id} vehiculo={vehiculo} catalogo={catalogo} />
}

function VehicleDetailContent({ vehiculo, catalogo }: { vehiculo: Vehicle; catalogo: Vehicle[] }) {
  const estaEnCarrito = useTienda((s) => s.estaEnCarrito(vehiculo.id))
  const estaComprado = useTienda((s) => s.estaComprado(vehiculo.id))
  const agregarAlCarrito = useTienda((s) => s.agregarAlCarrito)
  const { toast } = useToast()

  const [imagenActiva, setImagenActiva] = useState(0)
  const nombreCompleto = `${vehiculo.marca} ${vehiculo.modelo}`

  const handleAgregar = () => {
    if (estaEnCarrito || estaComprado) return
    agregarAlCarrito(vehiculo.id)
    toast({
      title: "Añadido al carrito",
      description: `${nombreCompleto} se ha añadido a tu carrito.`,
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
        {/* Columna izquierda: galería — sticky en desktop para evitar hueco */}
        <div className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start lg:h-fit">
          <motion.div
            key={imagenActiva}
            initial={{ opacity: 0.3, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/70 bg-card"
          >
            <SmartImage
              src={vehiculo.imagenes[imagenActiva]}
              alt={`${nombreCompleto} - imagen ${imagenActiva + 1}`}
              containerClassName="h-full w-full"
              priority
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-md">
              {vehiculo.marca}
            </span>
            {/* Botones de favorito y comparar sobre la imagen */}
            <div className="absolute right-3 top-3 flex items-center gap-1.5 sm:right-4 sm:top-4 sm:gap-2">
              <CompareButton
                vehiculoId={vehiculo.id}
                vehiculoNombre={nombreCompleto}
              />
              <FavoriteButton
                vehiculoId={vehiculo.id}
                vehiculoNombre={nombreCompleto}
              />
            </div>
            {estaComprado && (
              <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-[var(--success)]/20 px-3 py-1.5 text-[11px] font-semibold text-[var(--success)] backdrop-blur-md">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                Comprado
              </span>
            )}
          </motion.div>

          {/* Miniaturas */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
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
                <SmartImage
                  src={img}
                  alt={`${nombreCompleto} - miniatura ${i + 1}`}
                  containerClassName="h-full w-full"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Bloque de highlights para llenar la columna y enriquecer */}
          <div className="mt-4 hidden rounded-2xl border border-border/50 bg-card p-5 lg:block">
            <p className="text-eyebrow text-[10px] text-[var(--signature)]">
              Destacados
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Highlight
                icono={Rocket}
                etiqueta="Velocidad máxima"
                valor={`${formatearNumero(vehiculo.velocidadMaxima)} km/h`}
              />
              <Highlight
                icono={Timer}
                etiqueta="0—100 km/h"
                valor={`${vehiculo.aceleracion0a100}s`}
              />
              <Highlight
                icono={Zap}
                etiqueta="Potencia"
                valor={`${formatearNumero(vehiculo.potencia)} HP`}
              />
              <Highlight
                icono={Gauge}
                etiqueta="Torque"
                valor={`${formatearNumero(vehiculo.torque)} Nm`}
              />
            </div>
          </div>
        </div>

        {/* Columna derecha: información */}
        <div className="flex flex-col">
          {/* Intro comercial */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <p className="text-eyebrow text-[11px] text-[var(--signature)]">
                {vehiculo.marca}
              </p>
              <span className="rounded-lg border border-border/70 bg-secondary/60 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">
                {vehiculo.categoria}
              </span>
            </div>
            <h1 className="text-display mt-4 text-4xl text-foreground sm:text-5xl lg:text-6xl">
              {vehiculo.modelo}
            </h1>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              {vehiculo.año} · {vehiculo.combustible} ·{" "}
              {formatearNumero(vehiculo.potencia)} HP
            </p>
          </motion.div>

          {/* Bloque de precio destacado */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 rounded-2xl border border-border/70 bg-secondary/40 p-6"
          >
            <p className="text-eyebrow text-[10px] text-muted-foreground">
              Precio
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {formatearPrecio(vehiculo.precio)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Financiamiento disponible · Simulación sin compromiso
            </p>
          </motion.div>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 max-w-prose text-base leading-relaxed text-muted-foreground"
          >
            {vehiculo.descripcion}
          </motion.p>

          {/* Especificaciones técnicas */}
          <div className="mt-10">
            <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
              Especificaciones técnicas
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

          {/* Simulador de financiamiento */}
          <div className="mt-8">
            <FinancingCalculator precio={vehiculo.precio} />
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

      {/* Vehículos relacionados */}
      <RelatedVehicles vehiculoActual={vehiculo} catalogo={catalogo} />

      <ReviewsSection vehicleSlug={vehiculo.id} />
    </div>
  )
}

function Highlight({
  icono: Icono,
  etiqueta,
  valor,
}: {
  icono: typeof Gauge
  etiqueta: string
  valor: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icono className="h-3.5 w-3.5" strokeWidth={2} />
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {etiqueta}
        </span>
      </div>
      <p className="mt-1.5 text-base font-semibold tracking-tight text-foreground">
        {valor}
      </p>
    </div>
  )
}
