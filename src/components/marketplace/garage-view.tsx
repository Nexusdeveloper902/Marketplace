"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CarFront, Loader2, LogIn } from "lucide-react"
import { vehiculos } from "@/data/vehicles"
import { useAuth } from "@/lib/auth/auth-context"
import { formatearPrecio } from "@/lib/format"
import { VehicleCard } from "./vehicle-card"
import { EmptyState } from "./empty-state"

interface OrderItemDTO {
  vehicle: { id: string; marca: string; modelo: string }
  priceAtPurchase: number
}
interface OrderDTO {
  id: string
  number: string
  status: string
  total: number
  createdAt: string
  items: OrderItemDTO[]
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

interface Compra {
  vehicleSlug: string
  orderNumber: string
  fecha: string
  precio: number
}

export function GarageView() {
  const { loading, isAuthenticated } = useAuth()
  const [compras, setCompras] = useState<Compra[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setCargando(false)
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        const completed = (data.orders as OrderDTO[]).filter(
          (o) => o.status === "COMPLETED"
        )
        // Derive purchased vehicles from completed orders. Later purchases
        // override earlier references for the same vehicle.
        const map = new Map<string, Compra>()
        for (const o of completed) {
          for (const it of o.items) {
            map.set(it.vehicle.id, {
              vehicleSlug: it.vehicle.id,
              orderNumber: o.number,
              fecha: o.createdAt,
              precio: it.priceAtPurchase,
            })
          }
        }
        if (!cancelled) setCompras(Array.from(map.values()))
      } catch {
        // ignore
      } finally {
        if (!cancelled) setCargando(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const vehiculosGaraje = compras
    .map((c) => {
      const v = vehiculos.find((x) => x.id === c.vehicleSlug)
      return v ? { vehiculo: v, compra: c } : null
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v))

  const valorTotal = vehiculosGaraje.reduce((sum, v) => sum + v.compra.precio, 0)
  const valorFormateado = formatearPrecio(valorTotal)

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
      {cargando ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !isAuthenticated ? (
        <EmptyState
          icon={LogIn}
          titulo="Inicia sesión para ver tu garaje"
          descripcion="Tu garaje privado muestra los vehículos que has adquirido. Inicia sesión para acceder a tu colección."
          ctaLabel="Iniciar sesión"
          ctaHref="/login?redirect=/garaje"
        />
      ) : vehiculosGaraje.length > 0 ? (
        <section className="mt-8 pb-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {vehiculosGaraje.map(({ vehiculo, compra }, i) => (
              <div key={vehiculo.id} className="relative">
                <VehicleCard
                  vehiculo={vehiculo}
                  index={i}
                  etiquetaBoton="Inspeccionar"
                  variante="garaje"
                />
                <div className="mt-2 rounded-xl border border-border/40 bg-card/60 p-3 text-xs">
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {compra.orderNumber}
                  </p>
                  <p className="mt-0.5 text-muted-foreground">
                    Comprado el {formatDate(compra.fecha)}
                  </p>
                  <p className="mt-0.5 font-medium text-foreground">
                    {formatearPrecio(compra.precio)}
                  </p>
                </div>
              </div>
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
