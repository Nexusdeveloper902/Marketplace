"use client"

import { motion } from "framer-motion"
import { CarFront, ArrowRight } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { useTienda } from "@/store/use-store"
import { VehicleCard } from "./vehicle-card"

export function GarageView() {
  const garaje = useTienda((s) => s.garaje)
  const irAMarketplace = useTienda((s) => s.irAMarketplace)

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
        className="border-b border-border/60 pb-8 pt-10 sm:pt-14"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Tu colección privada
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
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
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center sm:py-28"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <CarFront className="h-8 w-8" strokeWidth={1.5} />
          </span>
          <p className="mt-5 text-lg font-medium text-foreground">
            Tu garaje está vacío
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Los vehículos que adquieras aparecerán aquí para que puedas
            inspeccionarlos cuando quieras.
          </p>
          <button
            onClick={irAMarketplace}
            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explorar marketplace
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </motion.section>
      )}
    </div>
  )
}
