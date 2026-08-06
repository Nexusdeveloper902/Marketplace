"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { GitCompareArrows, X, ArrowRight, Trophy, Plus } from "lucide-react"
import { vehiculos, marcas } from "@/data/vehicles"
import { useTienda, MAX_COMPARAR } from "@/store/use-store"
import { formatearPrecio, formatearNumero } from "@/lib/format"
import { EmptyState } from "./empty-state"
import { SmartImage } from "@/components/ui/smart-image"
import { cn } from "@/lib/utils"

// Especificaciones a comparar. "mejor" define si el valor mayor o menor es mejor.
type Direccion = "mayor" | "menor"

interface FilaSpec {
  clave: string
  etiqueta: string
  unidad?: string
  mejor: Direccion
  formatear?: (v: number) => string
}

const specs: FilaSpec[] = [
  { clave: "precio", etiqueta: "Precio", unidad: "", mejor: "menor", formatear: (v) => formatearPrecio(v) },
  { clave: "potencia", etiqueta: "Potencia", unidad: " HP", mejor: "mayor", formatear: (v) => formatearNumero(v) },
  { clave: "torque", etiqueta: "Torque", unidad: " Nm", mejor: "mayor", formatear: (v) => formatearNumero(v) },
  { clave: "velocidadMaxima", etiqueta: "Vel. máxima", unidad: " km/h", mejor: "mayor", formatear: (v) => formatearNumero(v) },
  { clave: "aceleracion0a100", etiqueta: "0-100 km/h", unidad: " s", mejor: "menor", formatear: (v) => v.toString() },
  { clave: "año", etiqueta: "Año", unidad: "", mejor: "mayor", formatear: (v) => v.toString() },
]

const specsTexto = [
  { clave: "motor", etiqueta: "Motor" },
  { clave: "transmision", etiqueta: "Transmisión" },
  { clave: "combustible", etiqueta: "Combustible" },
  { clave: "traccion", etiqueta: "Tracción" },
  { clave: "categoria", etiqueta: "Categoría" },
]

export function CompareView() {
  const comparar = useTienda((s) => s.comparar)
  const toggleComparar = useTienda((s) => s.toggleComparar)
  const vaciarComparador = useTienda((s) => s.vaciarComparador)

  const vehiculosComparar = comparar
    .map((id) => vehiculos.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))

  // Calcula el mejor valor para cada spec numérica
  const obtenerMejor = (clave: string, mejor: Direccion): string | null => {
    const valores = vehiculosComparar
      .map((v) => v[clave as keyof typeof v])
      .filter((v): v is number => typeof v === "number")
    if (valores.length === 0) return null
    const mejorValor = mejor === "mayor" ? Math.max(...valores) : Math.min(...valores)
    return vehiculosComparar.find((v) => v[clave as keyof typeof v] === mejorValor)?.id ?? null
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/40 pb-10 pt-14 sm:pt-20"
      >
        <p className="text-eyebrow text-[11px] text-[var(--signature)]">
          Análisis lado a lado
        </p>
        <h1 className="text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl">
          Comparador de vehículos
        </h1>
        {vehiculosComparar.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Comparando {vehiculosComparar.length} de {MAX_COMPARAR} vehículos
              máximos.
            </p>
            <button
              onClick={vaciarComparador}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Vaciar comparador
            </button>
          </div>
        ) : (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Selecciona hasta {MAX_COMPARAR} vehículos desde el marketplace para
            comparar sus características lado a lado y encontrar el ideal para ti.
          </p>
        )}
      </motion.section>

      {vehiculosComparar.length > 0 ? (
        <section className="mt-8 pb-4">
          {/* Tabla comparativa con scroll horizontal en móvil */}
          <div className="scrollbar-premium overflow-x-auto">
            <div
              className="min-w-full"
              style={{ minWidth: `${Math.max(vehiculosComparar.length, 1) * 240 + 140}px` }}
            >
              {/* Fila de cabecera con imágenes */}
              <div className="grid gap-3" style={{ gridTemplateColumns: `140px repeat(${vehiculosComparar.length}, 1fr)` }}>
                <div className="sticky left-0 z-10 flex items-end bg-background pb-3 pr-3">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Vehículo
                  </span>
                </div>
                {vehiculosComparar.map((vehiculo) => (
                  <motion.div
                    key={vehiculo.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative overflow-hidden rounded-xl border border-border/70 bg-card"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                      <SmartImage
                        src={vehiculo.imagenes[0]}
                        alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                        containerClassName="h-full w-full"
                        className="object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                      <button
                        onClick={() => toggleComparar(vehiculo.id)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-background/70 text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
                        aria-label={`Quitar ${vehiculo.marca} ${vehiculo.modelo}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {vehiculo.marca}
                      </p>
                      <Link
                        href={`/vehiculos/${vehiculo.id}`}
                        className="text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-muted-foreground"
                      >
                        {vehiculo.modelo}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {vehiculo.año}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Filas de especificaciones numéricas */}
              <div className="mt-4 space-y-1">
                {specs.map((spec) => {
                  const mejorId = obtenerMejor(spec.clave, spec.mejor)
                  return (
                    <div
                      key={spec.clave}
                      className="grid items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-secondary/40"
                      style={{ gridTemplateColumns: `140px repeat(${vehiculosComparar.length}, 1fr)` }}
                    >
                      <span className="sticky left-0 z-10 bg-background py-0.5 pr-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {spec.etiqueta}
                      </span>
                      {vehiculosComparar.map((vehiculo) => {
                        const valor = vehiculo[spec.clave as keyof typeof vehiculo] as number
                        const esMejor = mejorId === vehiculo.id && vehiculosComparar.length > 1
                        return (
                          <div key={vehiculo.id} className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                esMejor ? "text-[var(--success)]" : "text-foreground"
                              )}
                            >
                              {spec.formatear ? spec.formatear(valor) : formatearNumero(valor)}
                              {spec.unidad}
                            </span>
                            {esMejor && (
                              <Trophy className="h-3.5 w-3.5 text-[var(--success)]" strokeWidth={2.2} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}

                {/* Filas de especificaciones de texto */}
                {specsTexto.map((spec) => (
                  <div
                    key={spec.clave}
                    className="grid items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-secondary/40"
                    style={{ gridTemplateColumns: `140px repeat(${vehiculosComparar.length}, 1fr)` }}
                  >
                    <span className="sticky left-0 z-10 bg-background py-0.5 pr-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {spec.etiqueta}
                    </span>
                    {vehiculosComparar.map((vehiculo) => (
                      <span
                        key={vehiculo.id}
                        className="text-sm font-medium text-foreground"
                      >
                        {vehiculo[spec.clave as keyof typeof vehiculo] as string}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sugerencia de vehículos para añadir */}
          {vehiculosComparar.length < MAX_COMPARAR && (
            <div className="mt-8 rounded-2xl border border-dashed border-border p-6">
              <p className="text-sm font-medium text-foreground">
                Añade más vehículos al comparador
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Puedes comparar hasta {MAX_COMPARAR} vehículos a la vez. Explora
                el catálogo y usa el botón de comparar.
              </p>
              <Link
                href="/marketplace"
                className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" strokeWidth={2.2} />
                Añadir desde el marketplace
              </Link>
            </div>
          )}
        </section>
      ) : (
        <EmptyState
          icon={GitCompareArrows}
          titulo="No hay vehículos para comparar"
          descripcion="Ve al marketplace y selecciona hasta 3 vehículos usando el botón de comparar para ver sus características lado a lado."
          ctaLabel="Ir al marketplace"
          ctaHref="/marketplace"
        />
      )}
    </div>
  )
}
