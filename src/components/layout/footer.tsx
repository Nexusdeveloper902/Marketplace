"use client"

import Link from "next/link"
import { Gauge } from "lucide-react"
import { siteConfig } from "@/lib/site"

export function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 pb-28 sm:px-6 lg:px-8 lg:pb-12">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-start">
          {/* Marca */}
          <div className="max-w-xs">
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
          </div>

          {/* Navegación */}
          <nav className="flex flex-wrap items-start gap-x-8 gap-y-3 text-sm text-muted-foreground sm:gap-x-10">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Explorar
              </p>
              <Link href="/marketplace" className="transition-colors hover:text-foreground">
                Marketplace
              </Link>
              <Link href="/marcas" className="transition-colors hover:text-foreground">
                Marcas
              </Link>
              <Link href="/comparar" className="transition-colors hover:text-foreground">
                Comparar
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Cuenta
              </p>
              <Link href="/favoritos" className="transition-colors hover:text-foreground">
                Favoritos
              </Link>
              <Link href="/garaje" className="transition-colors hover:text-foreground">
                Mi Garaje
              </Link>
              <Link href="/carrito" className="transition-colors hover:text-foreground">
                Carrito
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Legal
              </p>
              <Link href="/privacidad" className="transition-colors hover:text-foreground">
                Privacidad
              </Link>
              <Link href="/terminos" className="transition-colors hover:text-foreground">
                Términos
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 text-xs text-muted-foreground">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p>
              © {anio} {siteConfig.name}. Todos los derechos reservados.
            </p>
            <p>Experiencia de compra simulada.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
