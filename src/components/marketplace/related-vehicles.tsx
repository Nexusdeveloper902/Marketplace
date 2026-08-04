"use client"

import { useMemo } from "react"
import { vehiculos } from "@/data/vehicles"
import type { Vehicle } from "@/types/vehicle"
import { VehicleCard } from "./vehicle-card"

interface RelatedVehiclesProps {
  vehiculoActual: Vehicle
  cantidad?: number
}

export function RelatedVehicles({
  vehiculoActual,
  cantidad = 3,
}: RelatedVehiclesProps) {
  const relacionados = useMemo(() => {
    // Puntúa cada vehículo por similitud (marca, categoria, rango de precio)
    return vehiculos
      .filter((v) => v.id !== vehiculoActual.id)
      .map((v) => {
        let puntaje = 0
        if (v.marca === vehiculoActual.marca) puntaje += 3
        if (v.categoria === vehiculoActual.categoria) puntaje += 2
        if (v.combustible === vehiculoActual.combustible) puntaje += 1
        // Proximidad de precio (dentro del 30%)
        const diffPrecio = Math.abs(v.precio - vehiculoActual.precio) / vehiculoActual.precio
        if (diffPrecio < 0.3) puntaje += 2
        else if (diffPrecio < 0.6) puntaje += 1
        return { vehiculo: v, puntaje }
      })
      .sort((a, b) => b.puntaje - a.puntaje)
      .slice(0, cantidad)
      .map((r) => r.vehiculo)
  }, [vehiculoActual, cantidad])

  if (relacionados.length === 0) return null

  return (
    <section className="mt-16 border-t border-border/60 pt-12">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        También te puede interesar
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Vehículos relacionados
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
        {relacionados.map((vehiculo, i) => (
          <VehicleCard
            key={vehiculo.id}
            vehiculo={vehiculo}
            index={i}
            etiquetaBoton="Ver detalles"
          />
        ))}
      </div>
    </section>
  )
}
