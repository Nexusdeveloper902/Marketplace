"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Receipt,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Package,
  CalendarDays,
  X,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { formatearPrecio } from "@/lib/format"
import { SiteShell } from "@/components/layout/site-shell"
import { SmartImage } from "@/components/ui/smart-image"
import { vehiculos } from "@/data/vehicles"
import { cn } from "@/lib/utils"

const easeLux = [0.22, 1, 0.36, 1] as const

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

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PROCESSING: "En proceso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
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

export default function PedidosPage() {
  const router = useRouter()
  const { loading, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [cargando, setCargando] = useState(true)
  const [seleccionada, setSeleccionada] = useState<OrderDTO | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login?redirect=/pedidos")
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setOrders(data.orders as OrderDTO[])
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

  if (loading || !isAuthenticated) {
    return (
      <SiteShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeLux }}
          className="border-b border-border/40 pb-10"
        >
          <p className="text-eyebrow text-[11px] text-[var(--signature)]">
            Historial
          </p>
          <h1 className="text-display mt-5 text-4xl text-foreground sm:text-5xl">
            Mis pedidos
          </h1>
        </motion.div>

        {cargando ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-12 w-12 text-muted-foreground/40" strokeWidth={1.5} />
            <p className="mt-5 text-base font-medium text-foreground">
              Aún no tienes pedidos
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando completes una compra aparecerá aquí.
            </p>
            <Link
              href="/marketplace"
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explorar marketplace
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {orders.map((o, i) => (
              <motion.li
                key={o.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: easeLux }}
              >
                <button
                  onClick={() => setSeleccionada(o)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 text-left shadow-card transition-colors hover:border-border"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                    <Receipt className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-medium text-foreground">
                      {o.number}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(o.createdAt)}
                    </p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {o.items
                        .map((it) => `${it.vehicle.marca} ${it.vehicle.modelo}`)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-base font-semibold text-foreground">
                      {formatearPrecio(o.total)}
                    </span>
                    <span
                      className={cn(
                        "rounded-lg px-2 py-0.5 text-[10px] font-medium",
                        o.status === "COMPLETED" &&
                          "bg-[var(--success)]/15 text-[var(--success)]",
                        o.status === "PROCESSING" &&
                          "bg-[var(--signature)]/15 text-[var(--signature)]",
                        o.status === "PENDING" &&
                          "bg-secondary text-muted-foreground",
                        o.status === "CANCELLED" &&
                          "bg-[var(--destructive)]/15 text-[var(--destructive)]"
                      )}
                    >
                      {STATUS_LABELS[o.status] ?? o.status}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </button>
              </motion.li>
            ))}
          </ul>
        )}

        <Link
          href="/perfil"
          className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Volver a mi perfil
        </Link>
      </div>

      {/* Detalle del pedido */}
      <AnimatePresence>
        {seleccionada && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            onClick={() => setSeleccionada(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: easeLux }}
              className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSeleccionada(null)}
                className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>

              <p className="text-eyebrow text-[11px] text-[var(--signature)]">
                Pedido
              </p>
              <h2 className="mt-2 font-mono text-xl font-semibold text-foreground">
                {seleccionada.number}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(seleccionada.createdAt)}
              </p>
              <span
                className={cn(
                  "mt-3 inline-block rounded-lg px-2.5 py-0.5 text-[11px] font-medium",
                  seleccionada.status === "COMPLETED" &&
                    "bg-[var(--success)]/15 text-[var(--success)]",
                  seleccionada.status === "PROCESSING" &&
                    "bg-[var(--signature)]/15 text-[var(--signature)]",
                  seleccionada.status === "PENDING" &&
                    "bg-secondary text-muted-foreground",
                  seleccionada.status === "CANCELLED" &&
                    "bg-[var(--destructive)]/15 text-[var(--destructive)]"
                )}
              >
                {STATUS_LABELS[seleccionada.status] ?? seleccionada.status}
              </span>

              <div className="mt-6 space-y-3">
                {seleccionada.items.map((it) => {
                  const veh = vehiculos.find((v) => v.id === it.vehicle.id)
                  return (
                    <Link
                      key={it.vehicle.id}
                      href={`/vehiculos/${it.vehicle.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:border-border"
                    >
                      {veh && (
                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                          <SmartImage
                            src={veh.imagenes[0]}
                            alt={`${it.vehicle.marca} ${it.vehicle.modelo}`}
                            containerClassName="h-full w-full"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {it.vehicle.marca}
                        </p>
                        <p className="truncate text-sm font-medium text-foreground">
                          {it.vehicle.modelo}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Precio de compra: {formatearPrecio(it.priceAtPurchase)}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )
                })}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Total
                </span>
                <span className="text-lg font-semibold text-foreground">
                  {formatearPrecio(seleccionada.total)}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  )
}
