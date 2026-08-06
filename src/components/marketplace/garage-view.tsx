"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CarFront } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { useTienda } from "@/store/use-store"
import { VehicleCard } from "./vehicle-card"
import { EmptyState } from "./empty-state"

export function GarageView() {
  const garaje = useTienda((s) => s.garaje)

  const vehiculosGaraje = garaje
    .map((id) => vehiculos.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))

  const valorTotal = vehiculosGaraje.reduce((sum, v) => sum + v.precio, 0)
  const valorFormateado = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(valorTotal)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/40 pb-10 pt-14 sm:pt-20"
      >
        <p className="text-eyebrow text-[11px] text-[var(--signature)]">
          Tu colección privada
        </p>
        <h1 className="text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl">
          Mi Garaje
        </h1>
        {vehiculosGaraje.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Vehículos
              </p>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {vehiculosGaraje.length}
              </p>
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Valor total
              </p>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {valorFormateado}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Aún no has adquirido ningún vehículo. Explora el marketplace y
            añade tu primer automóvil de alta gama a la colección.
          </p>
        )}
      </motion.section>

      {/* Contenido */}
      {vehiculosGaraje.length > 0 ? (
        <section className="mt-8 pb-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {vehiculosGaraje.map((vehiculo, i) => (
              <VehicleCard
                key={vehiculo.id}
                vehiculo={vehiculo}
                index={i}
                etiquetaBoton="Inspeccionar"
                variante="garaje"
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          icon={CarFront}
          titulo="Tu colección comienza aquí"
          descripcion="Los vehículos que adquieras aparecerán en tu garaje privado, listos para que los inspecciones cuando quieras."
          ctaLabel="Explorar marketplace"
          ctaHref="/marketplace"
        />
      )}
    </div>
  )
}
