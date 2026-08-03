"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, X, Sparkles } from "lucide-react"
import { vehiculos, marcas } from "@/data/vehicles"
import { VehicleCard } from "./vehicle-card"
import { cn } from "@/lib/utils"

export function MarketplaceView() {
  const [busqueda, setBusqueda] = useState("")
  const [marcaActiva, setMarcaActiva] = useState<string | null>(null)

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return vehiculos.filter((v) => {
      const coincideMarca = marcaActiva ? v.marca === marcaActiva : true
      const coincideBusqueda = termino
        ? `${v.marca} ${v.modelo}`.toLowerCase().includes(termino)
        : true
      return coincideMarca && coincideBusqueda
    })
  }, [busqueda, marcaActiva])

  const limpiarFiltros = () => {
    setBusqueda("")
    setMarcaActiva(null)
  }

  const hayFiltros = busqueda.trim() !== "" || marcaActiva !== null

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden rounded-3xl border border-border/60 px-6 py-14 sm:px-10 sm:py-20">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--signature)]" strokeWidth={2.2} />
            Colección 2024 · {vehiculos.length} modelos exclusivos
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Encuentra el vehículo
            <br />
            <span className="text-gradient">que define tu estilo</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Una selección curada de los automóviles más extraordinarios del
            mundo. Diseño, ingeniería y pasión en cada detalle.
          </motion.p>
        </div>
      </section>

      {/* Controles de búsqueda y filtros */}
      <section className="mt-10 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por marca o modelo…"
              className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-ring/40"
              aria-label="Buscar vehículos"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span>
              {filtrados.length}{" "}
              {filtrados.length === 1
                ? "resultado"
                : "resultados"}
            </span>
          </div>
        </div>

        {/* Filtros por marca */}
        <div className="scrollbar-premium -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
          <button
            onClick={() => setMarcaActiva(null)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
              marcaActiva === null
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            Todas
          </button>
          {marcas.map((marca) => (
            <button
              key={marca}
              onClick={() =>
                setMarcaActiva(marcaActiva === marca ? null : marca)
              }
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                marcaActiva === marca
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {marca}
            </button>
          ))}
        </div>
      </section>

      {/* Catálogo */}
      <section className="mt-8 pb-4">
        {filtrados.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {filtrados.map((vehiculo, i) => (
              <VehicleCard
                key={vehiculo.id}
                vehiculo={vehiculo}
                index={i}
                etiquetaBoton="Ver detalles"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center"
          >
            <Search className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-medium text-foreground">
              No se encontraron vehículos
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Prueba con otra marca o modelo.
            </p>
            {hayFiltros && (
              <button
                onClick={limpiarFiltros}
                className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Limpiar filtros
              </button>
            )}
          </motion.div>
        )}
      </section>
    </div>
  )
}
