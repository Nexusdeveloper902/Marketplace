"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Gauge,
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  Users,
  Receipt,
  ArrowUpRight,
  LogOut,
  ChevronRight,
  Target,
  Clock,
  Trophy,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useAuth } from "@/lib/auth/auth-context"
import { generarDatosDashboard } from "@/lib/admin/datos-sinteticos"
import type { DashboardData } from "@/lib/server/data/analytics"
import { formatearPrecio, formatearNumero } from "@/lib/format"
import { cn } from "@/lib/utils"

const easeLux = [0.22, 1, 0.36, 1] as const

// Colores para gráficos (usando las variables del tema)
const CHART_COLORS = [
  "var(--signature)",
  "var(--success)",
  "#60a5fa",
  "#f472b6",
  "#a78bfa",
  "#fb923c",
  "#34d399",
  "#f87171",
  "#facc15",
  "#22d3ee",
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const [datos, setDatos] = useState<DashboardData | null>(null)
  const [cargando, setCargando] = useState(true)

  // Proteger la ruta: requiere admin session.
  useEffect(() => {
    if (!isAuthenticated) return // still loading or not logged in
    if (!isAdmin) {
      router.replace("/")
    }
  }, [isAuthenticated, isAdmin, router])

  // Cargar analíticas reales desde el backend (admin only).
  useEffect(() => {
    if (!isAdmin) return
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/analytics", { cache: "no-store" })
        if (!res.ok) {
          // Not authorized → bounce to login.
          router.replace("/admin/login")
          return
        }
        const data = (await res.json()) as DashboardData
        if (!cancelled) setDatos(data)
      } catch {
        if (!cancelled) setDatos(null)
      } finally {
        if (!cancelled) setCargando(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isAdmin, router])

  // Loading / auth gate.
  if (cargando || !isAuthenticated || !isAdmin || !datos) {
    // If we have no real data yet, fall back to the synthetic generator so the
    // dashboard shell renders during load and for demos without seeded data.
    const fallback = generarDatosDashboard()
    if (!datos) {
      return <DashboardShell datos={fallback} cargando={cargando} onLogout={async () => { await logout(); router.replace("/admin/login") }} />
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-foreground border-t-transparent"
        />
      </div>
    )
  }

  return (
    <DashboardShell
      datos={datos}
      cargando={false}
      onLogout={async () => { await logout(); router.replace("/admin/login") }}
    />
  )
}

function DashboardShell({
  datos,
  cargando,
  onLogout,
}: {
  datos: DashboardData
  cargando: boolean
  onLogout: () => Promise<void>
}) {

  // Preparar datos para gráficos
  const ultimos12Meses = datos.meses.slice(-12)
  const ingresosPorAño = [
    {
      año: "Año 1",
      ingresos: datos.meses.slice(0, 12).reduce((s, m) => s + m.ingresos, 0),
      ventas: datos.meses.slice(0, 12).reduce((s, m) => s + m.ventas, 0),
    },
    {
      año: "Año 2",
      ingresos: datos.meses.slice(12, 24).reduce((s, m) => s + m.ingresos, 0),
      ventas: datos.meses.slice(12, 24).reduce((s, m) => s + m.ventas, 0),
    },
    {
      año: "Año 3",
      ingresos: datos.meses.slice(24, 36).reduce((s, m) => s + m.ingresos, 0),
      ventas: datos.meses.slice(24, 36).reduce((s, m) => s + m.ventas, 0),
    },
  ]

  const topMarcas = datos.ventasPorMarca.slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      {/* Header del dashboard */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-105">
                <Gauge className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="hidden flex-col items-start leading-none sm:flex">
                <span className="text-[15px] font-semibold tracking-tight text-foreground">
                  Digital <span className="text-gradient">Marketplace</span>
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  <LayoutDashboard className="h-2.5 w-2.5" />
                  Admin Dashboard
                </span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              Ver marketplace
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => void onLogout()}
              className="flex items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeLux }}
          className="mb-10"
        >
          <p className="text-eyebrow text-[11px] text-[var(--signature)]">
            Resumen ejecutivo
          </p>
          <h1 className="text-display mt-4 text-4xl text-foreground sm:text-5xl">
            Panel administrativo
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Métricas y análisis de los últimos 36 meses de operación del marketplace.
          </p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
          <KpiCard
            icono={DollarSign}
            etiqueta="Ventas totales"
            valor={formatearPrecio(datos.kpis.ventasTotales)}
            variacion={18.5}
            indice={0}
          />
          <KpiCard
            icono={Car}
            etiqueta="Vehículos vendidos"
            valor={formatearNumero(datos.kpis.vehiculosVendidos)}
            variacion={12.3}
            indice={1}
          />
          <KpiCard
            icono={Users}
            etiqueta="Clientes"
            valor={formatearNumero(datos.kpis.clientes)}
            variacion={9.8}
            indice={2}
          />
          <KpiCard
            icono={Receipt}
            etiqueta="Ticket promedio"
            valor={formatearPrecio(datos.kpis.ticketPromedio)}
            variacion={4.2}
            indice={3}
          />
          <KpiCard
            icono={TrendingUp}
            etiqueta="Crecimiento anual"
            valor={`${datos.kpis.crecimientoAnual}%`}
            variacion={datos.kpis.crecimientoAnual}
            indice={4}
          />
          <KpiCard
            icono={Gauge}
            etiqueta="Marcas disponibles"
            valor={String(datos.kpis.marcasDisponibles)}
            variacion={0}
            indice={5}
          />
          <KpiCard
            icono={Target}
            etiqueta="Tasa de conversión"
            valor={`${datos.kpis.tasaConversion.toFixed(1)}%`}
            variacion={0.6}
            indice={6}
          />
          <KpiCard
            icono={Clock}
            etiqueta="Pedidos pendientes"
            valor={String(datos.kpis.pedidosPendientes)}
            variacion={-3.1}
            indice={7}
          />
        </div>

        {/* Gráfico principal: Evolución de ingresos (36 meses) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: easeLux }}
          className="mt-8 rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:mt-10 lg:p-7"
        >
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
                Tendencia de ingresos
              </h2>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                Últimos 36 meses
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={datos.meses}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--signature)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--signature)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis
                dataKey="mesLabel"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                    color: "var(--foreground)",
                  fontSize: "13px",
                }}
                labelStyle={{ color: "var(--foreground)" }} itemStyle={{ color: "var(--foreground)" }}
                formatter={(v: number) => [formatearPrecio(v), "Ingresos"]}
              />
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="var(--signature)"
                strokeWidth={2}
                fill="url(#colorIngresos)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.section>

        {/* Fila: Ingresos por año + Top marcas */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Ingresos por año */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: easeLux }}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7"
          >
            <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
              Comparativa anual
            </h2>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              Ingresos por año
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ingresosPorAño}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis
                  dataKey="año"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                    fontSize: "13px",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                  formatter={(v: number) => [formatearPrecio(v), "Ingresos"]}
                  cursor={{ fill: "oklch(1 0 0 / 4%)" }}
                />
                <Bar
                  dataKey="ingresos"
                  fill="var(--signature)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.section>

          {/* Top marcas */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: easeLux }}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7"
          >
            <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
              Ventas por marca
            </h2>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              Marcas más vendidas
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topMarcas} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="marca"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                    fontSize: "13px",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                  formatter={(v: number) => [`${v} vehículos`, "Ventas"]}
                  cursor={{ fill: "oklch(1 0 0 / 4%)" }}
                />
                <Bar
                  dataKey="ventas"
                  radius={[0, 8, 8, 0]}
                  animationDuration={1000}
                >
                  {topMarcas.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.section>
        </div>

        {/* Fila: Distribución por categoría + Pedidos recientes */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Distribución por categoría */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: easeLux }}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7"
          >
            <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
              Categorías
            </h2>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              Distribución
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={datos.ventasPorCategoria}
                  dataKey="ventas"
                  nameKey="categoria"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  animationDuration={1000}
                >
                  {datos.ventasPorCategoria.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                    fontSize: "13px",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                  formatter={(v: number, n: string) => [`${v} vehículos`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.section>

          {/* Pedidos recientes */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: easeLux }}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:col-span-2 lg:p-7"
          >
            <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
              Actividad reciente
            </h2>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              Últimos pedidos
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Pedido</th>
                    <th className="pb-3 pr-4 font-medium">Cliente</th>
                    <th className="pb-3 pr-4 font-medium">Vehículo</th>
                    <th className="pb-3 pr-4 font-medium">Estado</th>
                    <th className="pb-3 text-right font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.pedidosRecientes.map((pedido, i) => (
                    <motion.tr
                      key={pedido.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.04 }}
                      className="border-b border-border/30 transition-colors hover:bg-secondary/30"
                    >
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                        {pedido.id}
                      </td>
                      <td className="py-3 pr-4 text-foreground">{pedido.cliente}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{pedido.vehiculo}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-medium",
                            pedido.estado === "Completado" && "bg-[var(--success)]/15 text-[var(--success)]",
                            pedido.estado === "En proceso" && "bg-[var(--signature)]/15 text-[var(--signature)]",
                            pedido.estado === "Pendiente" && "bg-secondary text-muted-foreground",
                            pedido.estado === "Cancelado" && "bg-[var(--destructive)]/15 text-[var(--destructive)]"
                          )}
                        >
                          {pedido.estado}
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold text-foreground">
                        {formatearPrecio(pedido.valor)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>

        {/* Fila: Vehículos más vendidos + Ventas mensuales */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Top vehículos más vendidos */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: easeLux }}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7"
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[var(--signature)]" strokeWidth={2} />
              <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
                Top modelos
              </h2>
            </div>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              Vehículos más vendidos
            </p>
            <div className="mt-5 space-y-2.5">
              {datos.topVehiculos.map((veh, i) => (
                <motion.div
                  key={veh.vehiculo}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.65 + i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {veh.vehiculo}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {veh.marca} · {formatearNumero(veh.ventas)} unidades
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-foreground">
                    {formatearPrecio(veh.ingresos)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Ventas mensuales (últimos 12 meses) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: easeLux }}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7"
          >
            <h2 className="text-eyebrow text-[11px] text-[var(--signature)]">
              Volumen mensual
            </h2>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              Vehículos vendidos (12 meses)
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={ultimos12Meses}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis
                  dataKey="mesLabel"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                    fontSize: "13px",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                  formatter={(v: number) => [`${v} vehículos`, "Ventas"]}
                  cursor={{ fill: "oklch(1 0 0 / 4%)" }}
                />
                <Bar
                  dataKey="ventas"
                  fill="var(--success)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.section>
        </div>

        {/* Footer del dashboard */}
        <div className="mt-12 flex items-center justify-between border-t border-border/40 pt-6 text-xs text-muted-foreground">
          <p>Datos sintéticos generados para demostración.</p>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-foreground"
          >
            Volver al marketplace
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </main>
    </div>
  )
}

// --- Subcomponentes ---

function KpiCard({
  icono: Icono,
  etiqueta,
  valor,
  variacion,
  indice,
}: {
  icono: typeof DollarSign
  etiqueta: string
  valor: string
  variacion: number
  indice: number
}) {
  const esPositivo = variacion > 0
  const esNeutro = variacion === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + indice * 0.06, ease: easeLux }}
      className="rounded-2xl border border-border/50 bg-card p-5 shadow-card transition-all duration-500 hover:border-border hover:shadow-card-hover lg:p-6"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground">
          <Icono className="h-5 w-5" strokeWidth={1.8} />
        </span>
        {!esNeutro && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold",
              esPositivo
                ? "bg-[var(--success)]/15 text-[var(--success)]"
                : "bg-[var(--destructive)]/15 text-[var(--destructive)]"
            )}
          >
            {esPositivo ? (
              <TrendingUp className="h-3 w-3" strokeWidth={2.2} />
            ) : (
              <TrendingDown className="h-3 w-3" strokeWidth={2.2} />
            )}
            {Math.abs(variacion)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {etiqueta}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
        {valor}
      </p>
    </motion.div>
  )
}
