"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { VehicleCard } from "@/components/marketplace/vehicle-card"

// Selección curada de 6 vehículos destacados (mezcla de marcas clásicas y nuevas).
const destacados = [
  "mclaren-750s",
  "rolls-royce-ghost",
  "lamborghini-revuelto",
  "porsche-taycan-turbos",
  "rivian-r1t",
  "dodge-demon-170",
]
  .map((id) => vehiculos.find((v) => v.id === id))
  .filter((v): v is NonNullable<typeof v> => Boolean(v))

export function FeaturedVehicles() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            Selección curada
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Vehículos destacados
          </motion.h2>
        </div>
        <Link
          href="/marketplace"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
        >
          Ver todo el catálogo
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
        {destacados.map((vehiculo, i) => (
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
