"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Gauge, Store, CarFront, Home } from "lucide-react"
import { useTienda } from "@/store/use-store"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/garaje", label: "Mi Garaje", icon: CarFront, badge: true },
] as const

export function Header() {
  const pathname = usePathname()
  const cantidadGaraje = useTienda((s) => s.garaje.length)

  const estaActivo = (href: string) => {
    if (href === "/") return pathname === "/"
    // Las páginas de detalle de vehículo pertenecen conceptualmente al marketplace.
    if (href === "/marketplace") {
      return pathname.startsWith("/marketplace") || pathname.startsWith("/vehiculos")
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Ir al inicio"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-transform duration-300 group-hover:scale-105">
            <Gauge className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              Digital <span className="text-gradient">Marketplace</span>
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Alta Gama
            </span>
          </span>
        </Link>

        {/* Navegación */}
        <nav className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const activo = estaActivo(item.href)
            const badge =
              "badge" in item && item.badge ? cantidadGaraje : undefined
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 sm:px-4",
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
                <span className="relative z-10 hidden sm:inline">
                  {item.label}
                </span>
                {badge !== undefined && badge > 0 && (
                  <span className="relative z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
