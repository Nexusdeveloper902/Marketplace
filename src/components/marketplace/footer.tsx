"use client"

import { Gauge } from "lucide-react"
import { useTienda } from "@/store/use-store"

export function Footer() {
  const irAMarketplace = useTienda((s) => s.irAMarketplace)
  const anio = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <button
            onClick={irAMarketplace}
            className="flex items-center gap-2.5"
            aria-label="Ir al marketplace"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Gauge className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Digital <span className="text-gradient">Marketplace</span>
            </span>
          </button>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="transition-colors hover:text-foreground">
              Términos
            </span>
            <span className="transition-colors hover:text-foreground">
              Privacidad
            </span>
            <span className="transition-colors hover:text-foreground">
              Soporte
            </span>
            <span className="transition-colors hover:text-foreground">
              Catálogo
            </span>
          </nav>

          <div className="text-xs text-muted-foreground">
            <p>Experiencia de compra simulada.</p>
            <p className="mt-0.5">
              © {anio} Digital Marketplace. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
