"use client"

import Link from "next/link"
import { Gauge } from "lucide-react"

export function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Ir al inicio"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Gauge className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Digital <span className="text-gradient">Marketplace</span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Inicio
            </Link>
            <Link
              href="/marketplace"
              className="transition-colors hover:text-foreground"
            >
              Marketplace
            </Link>
            <Link
              href="/garaje"
              className="transition-colors hover:text-foreground"
            >
              Mi Garaje
            </Link>
            <span className="transition-colors hover:text-foreground">
              Privacidad
            </span>
            <span className="transition-colors hover:text-foreground">
              Soporte
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
