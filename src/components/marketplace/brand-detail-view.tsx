"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { VehicleCard } from "./vehicle-card"
import type { Vehicle } from "@/types/vehicle"

interface BrandDetailViewProps {
  marca: string
  vehiculos: Vehicle[]
}

export function BrandDetailView({ marca, vehiculos: vehiculosMarca }: BrandDetailViewProps) {

  if (vehiculosMarca.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
        <p className="text-lg font-medium text-foreground">
          Marca no encontrada
        </p>
        <Link
          href="/marcas"
          className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Ver todas las marcas
        </Link>
      </div>
    )
  }

  const precioMin = Math.min(...vehiculosMarca.map((v) => v.precio))
  const precioMax = Math.max(...vehiculosMarca.map((v) => v.precio))

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Link
        href="/marcas"
        className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Todas las marcas
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 border-b border-border/60 pb-8"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
            {marca.charAt(0)}
          </span>
          <div>
            <p className="text-eyebrow text-[11px] text-[var(--signature)]">
              Fabricante
            </p>
            <h1 className="text-display mt-2 text-3xl text-foreground sm:text-4xl lg:text-5xl">
              {marca}
            </h1>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Modelos disponibles
            </p>
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {vehiculosMarca.length}
            </p>
          </div>
          <div className="hidden h-10 w-px bg-border sm:block" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Rango de precios
            </p>
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(precioMin)}{" "}
              -{" "}
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(precioMax)}
            </p>
          </div>
        </div>
      </motion.section>

      <section className="mt-8 pb-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {vehiculosMarca.map((vehiculo, i) => (
            <VehicleCard
              key={vehiculo.id}
              vehiculo={vehiculo}
              index={i}
              etiquetaBoton="Explorar vehículo"
            />
          ))}
        </div>
      </section>
    </div>
  )
}
