"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { vehiculos, marcas } from "@/data/vehicles"
import { CATEGORIAS, COMBUSTIBLES, TRACCIONES } from "@/types/vehicle"
import { useTienda } from "@/store/use-store"
import { VehicleCard } from "./vehicle-card"
import { cn } from "@/lib/utils"

interface Filtros {
  marca: string | null
  categorias: string[]
  combustibles: string[]
  tracciones: string[]
  precioMin: number
  precioMax: number
  añoMin: number
  añoMax: number
  potenciaMin: number
}

const ORDENAMIENTOS = [
  { valor: "relevancia", etiqueta: "Relevancia" },
  { valor: "precio-asc", etiqueta: "Precio: menor a mayor" },
  { valor: "precio-desc", etiqueta: "Precio: mayor a menor" },
  { valor: "año-desc", etiqueta: "Año: más reciente" },
  { valor: "potencia-desc", etiqueta: "Potencia: mayor a menor" },
]

// Rangos para los sliders
const PRECIO_MAX = 600000
const PRECIO_MIN = 20000
const AÑO_MIN = 2020
const AÑO_MAX = 2024
const POTENCIA_MAX = 1100

const filtrosIniciales: Filtros = {
  marca: null,
  categorias: [],
  combustibles: [],
  tracciones: [],
  precioMin: PRECIO_MIN,
  precioMax: PRECIO_MAX,
  añoMin: AÑO_MIN,
  añoMax: AÑO_MAX,
  potenciaMin: 0,
}

export function MarketplaceView() {
  const [busqueda, setBusqueda] = useState("")
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales)
  const [ordenamiento, setOrdenamiento] = useState("relevancia")
  const [panelFiltrosAbierto, setPanelFiltrosAbierto] = useState(false)
  const ordenamientoPersistente = useTienda((s) => s.ordenamiento)
  const setOrdenamientoPersistente = useTienda((s) => s.setOrdenamiento)

  const toggleArray = (arr: string[], valor: string): string[] =>
    arr.includes(valor)
      ? arr.filter((v) => v !== valor)
      : [...arr, valor]

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    const resultado = vehiculos.filter((v) => {
      const coincideBusqueda = termino
        ? `${v.marca} ${v.modelo}`.toLowerCase().includes(termino)
        : true
      const coincideMarca = filtros.marca ? v.marca === filtros.marca : true
      const coincideCategoria =
        filtros.categorias.length === 0
          ? true
          : filtros.categorias.includes(v.categoria)
      const coincideCombustible =
        filtros.combustibles.length === 0
          ? true
          : filtros.combustibles.includes(v.combustible)
      const coincideTraccion =
        filtros.tracciones.length === 0
          ? true
          : filtros.tracciones.includes(v.traccion)
      const coincidePrecio =
        v.precio >= filtros.precioMin && v.precio <= filtros.precioMax
      const coincideAño = v.año >= filtros.añoMin && v.año <= filtros.añoMax
      const coincidePotencia = v.potencia >= filtros.potenciaMin
      return (
        coincideBusqueda &&
        coincideMarca &&
        coincideCategoria &&
        coincideCombustible &&
        coincideTraccion &&
        coincidePrecio &&
        coincideAño &&
        coincidePotencia
      )
    })

    // Ordenamiento
    const ord = ordenamiento || ordenamientoPersistente
    switch (ord) {
      case "precio-asc":
        resultado.sort((a, b) => a.precio - b.precio)
        break
      case "precio-desc":
        resultado.sort((a, b) => b.precio - a.precio)
        break
      case "año-desc":
        resultado.sort((a, b) => b.año - a.año)
        break
      case "potencia-desc":
        resultado.sort((a, b) => b.potencia - a.potencia)
        break
    }
    return resultado
  }, [busqueda, filtros, ordenamiento, ordenamientoPersistente])

  const limpiarFiltros = () => {
    setBusqueda("")
    setFiltros(filtrosIniciales)
  }

  const hayFiltrosActivos =
    busqueda.trim() !== "" ||
    filtros.marca !== null ||
    filtros.categorias.length > 0 ||
    filtros.combustibles.length > 0 ||
    filtros.tracciones.length > 0 ||
    filtros.precioMin !== PRECIO_MIN ||
    filtros.precioMax !== PRECIO_MAX ||
    filtros.añoMin !== AÑO_MIN ||
    filtros.añoMax !== AÑO_MAX ||
    filtros.potenciaMin !== 0

  const handleOrdenamiento = (valor: string) => {
    setOrdenamiento(valor)
    setOrdenamientoPersistente(valor)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero compacto */}
      <section className="hero-glow relative overflow-hidden rounded-3xl border border-border/50 px-6 py-16 sm:px-10 sm:py-20">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-eyebrow text-[11px] text-[var(--signature)]"
          >
            Catálogo completo · {vehiculos.length} modelos
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-display mt-6 text-4xl text-foreground sm:text-5xl lg:text-6xl"
          >
            Descubre el vehículo
            <br />
            <span className="text-gradient">ideal para ti</span>
          </motion.h1>
        </div>
      </section>

      {/* Controles */}
      <section className="mt-8 flex flex-col gap-3">
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

          {/* Botón de filtros (móvil) + ordenamiento */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPanelFiltrosAbierto((v) => !v)}
              className={cn(
                "flex h-12 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors sm:px-4 lg:hidden",
                panelFiltrosAbierto
                  ? "border-foreground/30 bg-secondary text-foreground"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </button>

            {/* Ordenamiento */}
            <div className="relative min-w-0 flex-1 sm:flex-none">
              <select
                value={ordenamiento || ordenamientoPersistente}
                onChange={(e) => handleOrdenamiento(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-border bg-card pl-3 pr-9 text-sm font-medium text-foreground outline-none transition-colors focus:border-foreground/30 sm:w-auto sm:pl-4 sm:pr-10"
                aria-label="Ordenar por"
              >
                {ORDENAMIENTOS.map((o) => (
                  <option key={o.valor} value={o.valor} className="bg-card">
                    {o.etiqueta}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Filtros por marca (siempre visibles) */}
        <div className="scrollbar-premium -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
          <button
            onClick={() => setFiltros((f) => ({ ...f, marca: null }))}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
              filtros.marca === null
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
                setFiltros((f) => ({
                  ...f,
                  marca: f.marca === marca ? null : marca,
                }))
              }
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                filtros.marca === marca
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {marca}
            </button>
          ))}
        </div>

        {/* Contador de resultados */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span>
              {filtrados.length}{" "}
              {filtrados.length === 1 ? "resultado" : "resultados"}
            </span>
          </div>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar filtros
            </button>
          )}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
        {/* Panel de filtros avanzados */}
        <AnimatePresence>
          {panelFiltrosAbierto && (
            <motion.aside
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <FiltrosPanel
                filtros={filtros}
                setFiltros={setFiltros}
                toggleArray={toggleArray}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Panel de filtros en desktop (siempre visible) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <FiltrosPanel
              filtros={filtros}
              setFiltros={setFiltros}
              toggleArray={toggleArray}
            />
          </div>
        </aside>

        {/* Catálogo */}
        <section className="pb-4">
          {filtrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
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
                Prueba ajustando los filtros de búsqueda.
              </p>
              <button
                onClick={limpiarFiltros}
                className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Limpiar filtros
              </button>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}

// Componente del panel de filtros reutilizable
function FiltrosPanel({
  filtros,
  setFiltros,
  toggleArray,
}: {
  filtros: Filtros
  setFiltros: React.Dispatch<React.SetStateAction<Filtros>>
  toggleArray: (arr: string[], valor: string) => string[]
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Filtros
        </h2>
      </div>

      {/* Categoría */}
      <GrupoFiltro etiqueta="Categoría">
        {CATEGORIAS.map((cat) => (
          <ChipFiltro
            key={cat}
            etiqueta={cat}
            activo={filtros.categorias.includes(cat)}
            onClick={() =>
              setFiltros((f) => ({
                ...f,
                categorias: toggleArray(f.categorias, cat),
              }))
            }
          />
        ))}
      </GrupoFiltro>

      {/* Precio */}
      <GrupoFiltro etiqueta={`Precio: ${filtros.precioMin.toLocaleString("es-ES")} - ${filtros.precioMax.toLocaleString("es-ES")}`}>
        <div className="space-y-2">
          <label className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Mín: {filtros.precioMin.toLocaleString("es-ES")}</span>
            <span>Máx: {filtros.precioMax.toLocaleString("es-ES")}</span>
          </label>
          <input
            type="range"
            min={PRECIO_MIN}
            max={PRECIO_MAX}
            step={5000}
            value={filtros.precioMin}
            onChange={(e) =>
              setFiltros((f) => ({
                ...f,
                precioMin: Math.min(Number(e.target.value), f.precioMax),
              }))
            }
            className="slider-premium"
          />
          <input
            type="range"
            min={PRECIO_MIN}
            max={PRECIO_MAX}
            step={5000}
            value={filtros.precioMax}
            onChange={(e) =>
              setFiltros((f) => ({
                ...f,
                precioMax: Math.max(Number(e.target.value), f.precioMin),
              }))
            }
            className="slider-premium"
          />
        </div>
      </GrupoFiltro>

      {/* Año */}
      <GrupoFiltro etiqueta={`Año: ${filtros.añoMin} - ${filtros.añoMax}`}>
        <div className="space-y-2">
          <input
            type="range"
            min={AÑO_MIN}
            max={AÑO_MAX}
            step={1}
            value={filtros.añoMin}
            onChange={(e) =>
              setFiltros((f) => ({
                ...f,
                añoMin: Math.min(Number(e.target.value), f.añoMax),
              }))
            }
            className="slider-premium"
          />
          <input
            type="range"
            min={AÑO_MIN}
            max={AÑO_MAX}
            step={1}
            value={filtros.añoMax}
            onChange={(e) =>
              setFiltros((f) => ({
                ...f,
                añoMax: Math.max(Number(e.target.value), f.añoMin),
              }))
            }
            className="slider-premium"
          />
        </div>
      </GrupoFiltro>

      {/* Potencia mínima */}
      <GrupoFiltro etiqueta={`Potencia mín: ${filtros.potenciaMin} HP`}>
        <input
          type="range"
          min={0}
          max={POTENCIA_MAX}
          step={50}
          value={filtros.potenciaMin}
          onChange={(e) =>
            setFiltros((f) => ({ ...f, potenciaMin: Number(e.target.value) }))
          }
          className="slider-premium"
        />
      </GrupoFiltro>

      {/* Combustible */}
      <GrupoFiltro etiqueta="Combustible">
        {COMBUSTIBLES.map((comb) => (
          <ChipFiltro
            key={comb}
            etiqueta={comb}
            activo={filtros.combustibles.includes(comb)}
            onClick={() =>
              setFiltros((f) => ({
                ...f,
                combustibles: toggleArray(f.combustibles, comb),
              }))
            }
          />
        ))}
      </GrupoFiltro>

      {/* Tracción */}
      <GrupoFiltro etiqueta="Tracción">
        {TRACCIONES.map((trac) => (
          <ChipFiltro
            key={trac}
            etiqueta={trac}
            activo={filtros.tracciones.includes(trac)}
            onClick={() =>
              setFiltros((f) => ({
                ...f,
                tracciones: toggleArray(f.tracciones, trac),
              }))
            }
          />
        ))}
      </GrupoFiltro>
    </div>
  )
}

function GrupoFiltro({
  etiqueta,
  children,
}: {
  etiqueta: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {etiqueta}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function ChipFiltro({
  etiqueta,
  activo,
  onClick,
}: {
  etiqueta: string
  activo: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200",
        activo
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
      )}
    >
      {etiqueta}
    </button>
  )
}
