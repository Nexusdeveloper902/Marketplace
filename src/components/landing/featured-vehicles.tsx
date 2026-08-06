"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { VehicleCard } from "@/components/marketplace/vehicle-card"

// Selección curada de 6 vehículos.
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

const easeLux = [0.22, 1, 0.36, 1] as const

export function FeaturedVehicles() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
      {/* Encabezado editorial con jerarquía clara */}
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-eyebrow text-[11px] text-[var(--signature)]"
          >
            Nuestra Selección
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05, ease: easeLux }}
            className="text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl"
          >
            Potencia sin
            <br />
            <span className="text-gradient">compromisos</span>
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            href="/marketplace"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
          >
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>

      {/* Catálogo con más respiración */}
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {destacados.map((vehiculo, i) => (
          <VehicleCard
            key={vehiculo.id}
            vehiculo={vehiculo}
            index={i}
            etiquetaBoton="Explorar vehículo"
          />
        ))}
      </div>
    </section>
  )
}
