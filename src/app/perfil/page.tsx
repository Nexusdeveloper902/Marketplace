"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  User as UserIcon,
  Mail,
  CalendarDays,
  Heart,
  Car,
  Receipt,
  LogOut,
  ArrowRight,
  Loader2,
  Package,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useTienda } from "@/store/use-store"
import { formatearPrecio } from "@/lib/format"
import { SmartImage } from "@/components/ui/smart-image"
import { vehiculos } from "@/data/vehicles"
import { SiteShell } from "@/components/layout/site-shell"

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

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PROCESSING: "En proceso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
}

export default function PerfilPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated, logout } = useAuth()
  const favoritosCount = useTienda((s) => s.favoritos.length)
  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [cargandoOrders, setCargandoOrders] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login?redirect=/perfil")
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
        if (!cancelled) setCargandoOrders(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  if (loading || !isAuthenticated || !user) {
    return (
      <SiteShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SiteShell>
    )
  }

  const completedOrders = orders.filter((o) => o.status === "COMPLETED")
  const purchasedSlugs = new Set(
    completedOrders.flatMap((o) => o.items.map((i) => i.vehicle.id))
  )
  const purchasedVehicles = vehiculos.filter((v) => purchasedSlugs.has(v.id))
  const totalGastado = completedOrders.reduce((s, o) => s + o.total, 0)

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeLux }}
          className="border-b border-border/40 pb-10"
        >
          <p className="text-eyebrow text-[11px] text-[var(--signature)]">
            Mi cuenta
          </p>
          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold uppercase text-primary-foreground shadow-lg">
                {(user.name ?? user.email).charAt(0)}
              </span>
              <div>
                <h1 className="text-display text-3xl text-foreground sm:text-4xl">
                  {user.name ?? "Cliente"}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => void logout().then(() => router.replace("/"))}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            icon={Receipt}
            label="Pedidos"
            value={String(orders.length)}
            delay={0.05}
          />
          <KpiCard
            icon={Car}
            label="Vehículos comprados"
            value={String(purchasedVehicles.length)}
            delay={0.1}
          />
          <KpiCard
            icon={Heart}
            label="Favoritos"
            value={String(favoritosCount)}
            delay={0.15}
          />
          <KpiCard
            icon={CalendarDays}
            label="Total invertido"
            value={formatearPrecio(totalGastado)}
            delay={0.2}
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Datos de la cuenta */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: easeLux }}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7"
          >
            <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
              Cuenta
            </h2>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              Información
            </p>
            <dl className="mt-5 space-y-4">
              <Dato icon={UserIcon} label="Nombre" value={user.name ?? "—"} />
              <Dato icon={Mail} label="Correo" value={user.email} />
              <Dato
                icon={CalendarDays}
                label="Miembro desde"
                value={formatDate(user.createdAt)}
              />
            </dl>
          </motion.section>

          {/* Pedidos recientes */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: easeLux }}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:col-span-2 lg:p-7"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
                  Historial
                </h2>
                <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                  Pedidos recientes
                </p>
              </div>
              <Link
                href="/pedidos"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Ver todos
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {cargandoOrders ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-10 w-10 text-muted-foreground/40" strokeWidth={1.5} />
                <p className="mt-4 text-sm text-muted-foreground">
                  Aún no tienes pedidos.
                </p>
                <Link
                  href="/marketplace"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Explorar marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <ul className="mt-5 divide-y divide-border/40">
                {orders.slice(0, 5).map((o) => (
                  <li key={o.id} className="flex items-center justify-between py-4">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted-foreground">
                        {o.number}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                        {o.items
                          .map((i) => `${i.vehicle.marca} ${i.vehicle.modelo}`)
                          .join(", ") || "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-foreground">
                        {formatearPrecio(o.total)}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        </div>

        {/* Vehículos comprados */}
        {purchasedVehicles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: easeLux }}
            className="mt-8 rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7"
          >
            <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
              Garaje
            </h2>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              Vehículos adquiridos
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {purchasedVehicles.map((v) => {
                const order = completedOrders.find((o) =>
                  o.items.some((i) => i.vehicle.id === v.id)
                )
                return (
                  <Link
                    key={v.id}
                    href={`/vehiculos/${v.id}`}
                    className="group overflow-hidden rounded-xl border border-border/50 transition-colors hover:border-border"
                  >
                    <div className="relative aspect-[16/9]">
                      <SmartImage
                        src={v.imagenes[0]}
                        alt={`${v.marca} ${v.modelo}`}
                        containerClassName="h-full w-full"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {v.marca}
                      </p>
                      <p className="truncate text-sm font-semibold text-foreground">
                        {v.modelo}
                      </p>
                      {order && (
                        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                          {order.number}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.section>
        )}
      </div>
    </SiteShell>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: typeof UserIcon
  label: string
  value: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: easeLux }}
      className="rounded-2xl border border-border/50 bg-card p-5 shadow-card"
    >
      <Icon className="h-5 w-5 text-[var(--signature)]" strokeWidth={2} />
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </motion.div>
  )
}

function Dato({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
      <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}
