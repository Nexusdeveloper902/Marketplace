import Link from "next/link"
import { ArrowRight, Compass } from "lucide-react"
import { siteConfig } from "@/lib/site"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* Glow de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 30%, oklch(0.85 0.09 80 / 0.06), transparent 70%)",
        }}
      />
      <div className="relative flex flex-col items-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-card text-muted-foreground shadow-card">
          <Compass className="h-9 w-9" strokeWidth={1.5} />
        </span>

        <p className="text-eyebrow mt-7 text-[11px] text-[var(--signature)]">
          Error 404
        </p>
        <h1 className="text-display mt-4 text-5xl text-foreground sm:text-6xl">
          Página no encontrada
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          La página que buscas no existe o se ha movido. Vuelve al inicio o
          explora nuestra colección de vehículos de alta gama.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:gap-3 hover:shadow-[0_8px_30px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98]"
          >
            Volver al inicio
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Explorar vehículos
          </Link>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          {siteConfig.name} · {siteConfig.tagline}
        </p>
      </div>
    </main>
  )
}
