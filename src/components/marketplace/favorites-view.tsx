"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { useTienda } from "@/store/use-store"
import { VehicleCard } from "./vehicle-card"
import { EmptyState } from "./empty-state"

export function FavoritesView() {
  const favoritos = useTienda((s) => s.favoritos)

  const vehiculosFavoritos = favoritos
    .map((id) => vehiculos.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/40 pb-10 pt-14 sm:pt-20"
      >
        <p className="text-eyebrow text-[11px] text-[var(--signature)]">
          Tu selección personal
        </p>
        <h1 className="text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl">
          Favoritos
        </h1>
        {vehiculosFavoritos.length > 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {vehiculosFavoritos.length}{" "}
            {vehiculosFavoritos.length === 1
              ? "vehículo guardado"
              : "vehículos guardados"}{" "}
            en tu lista de favoritos.
          </p>
        ) : (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Marca tus vehículos preferidos con el corazón para guardarlos aquí
            y encontrarlos rápidamente cuando quieras.
          </p>
        )}
      </motion.section>

      {vehiculosFavoritos.length > 0 ? (
        <section className="mt-8 pb-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {vehiculosFavoritos.map((vehiculo, i) => (
              <VehicleCard
                key={vehiculo.id}
                vehiculo={vehiculo}
                index={i}
                variante="favoritos"
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          icon={Heart}
          titulo="Aún no tienes favoritos"
          descripcion="Explora el marketplace y toca el ícono de corazón en los vehículos que más te gusten para guardarlos aquí."
          ctaLabel="Explorar marketplace"
          ctaHref="/marketplace"
        />
      )}
    </div>
  )
}
