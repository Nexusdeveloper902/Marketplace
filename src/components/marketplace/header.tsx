"use client"

import { motion } from "framer-motion"
import { Gauge, Store, CarFront } from "lucide-react"
import { useTienda } from "@/store/use-store"
import { cn } from "@/lib/utils"

export function Header() {
  const vista = useTienda((s) => s.vista)
  const garaje = useTienda((s) => s.garaje)
  const irAMarketplace = useTienda((s) => s.irAMarketplace)
  const irAGaraje = useTienda((s) => s.irAGaraje)

  const cantidadGaraje = garaje.length

  const navItems = [
    { id: "marketplace" as const, label: "Marketplace", icon: Store, onClick: irAMarketplace },
    { id: "garage" as const, label: "Mi Garaje", icon: CarFront, onClick: irAGaraje, badge: cantidadGaraje },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={irAMarketplace}
          className="group flex items-center gap-2.5"
          aria-label="Ir al marketplace"
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
        </button>

        {/* Navegación */}
        <nav className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const activo =
              (item.id === "marketplace" && vista === "marketplace") ||
              (item.id === "garage" &&
                (vista === "garaje" || vista === "detalle"))
            return (
              <button
                key={item.id}
                onClick={item.onClick}
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
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="relative z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
