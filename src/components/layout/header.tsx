"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Gauge, Store, CarFront, Home, ShoppingCart, Heart, GitCompareArrows, Building2 } from "lucide-react"
import { useTienda } from "@/store/use-store"
import { cn } from "@/lib/utils"

// Items de navegación principal (centro).
// `mostrar`: breakpoint mínimo en el que el item es visible.
// - "base" → siempre visible (essenciales en móvil)
// - "md"   → visible desde tablet (≥768px)
// - "lg"   → visible desde desktop (≥1024px)
const navItems = [
  { href: "/", label: "Inicio", icon: Home, mostrar: "md" as const },
  { href: "/marketplace", label: "Marketplace", icon: Store, mostrar: "base" as const },
  { href: "/marcas", label: "Marcas", icon: Building2, mostrar: "lg" as const },
] as const

// Items secundarios (accesos rápidos con contadores)
const accesosRapidos = [
  { href: "/favoritos", label: "Favoritos", icon: Heart, badgeKey: "favoritos" as const, mostrar: "base" as const },
  { href: "/comparar", label: "Comparar", icon: GitCompareArrows, badgeKey: "comparar" as const, mostrar: "md" as const },
  { href: "/garaje", label: "Mi Garaje", icon: CarFront, badgeKey: "garaje" as const, mostrar: "md" as const },
] as const

// Mapa de breakpoint → clases de visibilidad
const clasesVisibilidad: Record<"base" | "md" | "lg", string> = {
  base: "inline-flex",
  md: "hidden md:inline-flex",
  lg: "hidden lg:inline-flex",
}

export function Header() {
  const pathname = usePathname()
  const cantFavoritos = useTienda((s) => s.favoritos.length)
  const cantComparar = useTienda((s) => s.comparar.length)
  const cantGaraje = useTienda((s) => s.garaje.length)
  const cantCarrito = useTienda((s) => s.carrito.length)
  const cantidades = {
    favoritos: cantFavoritos,
    comparar: cantComparar,
    garaje: cantGaraje,
    carrito: cantCarrito,
  }

  const estaActivo = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href === "/marketplace") {
      return (
        pathname.startsWith("/marketplace") || pathname.startsWith("/vehiculos")
      )
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Ir al inicio"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-transform duration-300 group-hover:scale-105">
            <Gauge className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="hidden flex-col items-start leading-none sm:flex">
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              Digital <span className="text-gradient">Marketplace</span>
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Alta Gama
            </span>
          </span>
        </Link>

        {/* Navegación central */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const activo = estaActivo(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative items-center gap-2 rounded-full px-2.5 py-2 text-sm font-medium transition-colors duration-200 sm:px-3.5",
                  clasesVisibilidad[item.mostrar],
                  activo
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activo && (
                  <motion.span
                    layoutId="nav-activo"
                    className="absolute inset-0 rounded-full bg-secondary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" strokeWidth={2} />
                <span className="relative z-10 hidden lg:inline">
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* Separador */}
          <span className="mx-1 hidden h-6 w-px bg-border lg:block" />

          {/* Accesos rápidos con badges */}
          {accesosRapidos.map((item) => {
            const Icon = item.icon
            const activo = estaActivo(item.href)
            const badge = cantidades[item.badgeKey]
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative items-center gap-2 rounded-full px-2.5 py-2 text-sm font-medium transition-colors duration-200 sm:px-3.5",
                  clasesVisibilidad[item.mostrar],
                  activo
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={item.label}
              >
                {activo && (
                  <motion.span
                    layoutId="nav-activo"
                    className="absolute inset-0 rounded-full bg-secondary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" strokeWidth={2} />
                <span className="relative z-10 hidden lg:inline">
                  {item.label}
                </span>
                {badge > 0 && (
                  <span className="relative z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Carrito (destacado a la derecha) */}
        <Link
          href="/carrito"
          className={cn(
            "group relative flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-2 text-sm font-medium transition-all duration-200 sm:px-3.5",
            estaActivo("/carrito")
              ? "border-border bg-secondary text-foreground"
              : "border-border/70 text-muted-foreground hover:border-border hover:text-foreground"
          )}
          aria-label={`Carrito con ${cantidades.carrito} vehículo(s)`}
        >
          <div className="relative">
            <ShoppingCart className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
            <AnimatePresence>
              {cantidades.carrito > 0 && (
                <motion.span
                  key={cantidades.carrito}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                >
                  {cantidades.carrito}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="hidden xl:inline">Carrito</span>
        </Link>
      </div>
    </header>
  )
}
