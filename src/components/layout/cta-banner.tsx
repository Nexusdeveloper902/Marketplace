import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { siteConfig } from "@/lib/site"

/**
 * Global call-to-action band rendered above the footer on the default
 * layout (SiteShell). Gives every page a consistent conversion nudge.
 * Server component — no client JS.
 */
export function CtaBanner() {
  return (
    <section className="relative overflow-hidden border-t border-border/40 bg-card">
      {/* Soft signature glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, oklch(0.85 0.09 80 / 0.08), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <p className="text-eyebrow text-[11px] text-[var(--signature)]">
          {siteConfig.name} · {siteConfig.tagline}
        </p>
        <h2 className="text-display mt-5 text-3xl text-foreground sm:text-4xl lg:text-5xl">
          Tu próximo vehículo te espera.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Explora la colección, compara y reserva el modelo que siempre
          quisiste. Experiencia de compra premium, de principio a fin.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/marketplace"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:gap-3 hover:shadow-[0_12px_40px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98] sm:w-auto"
          >
            Explorar vehículos
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/marcas"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto"
          >
            Ver marcas
          </Link>
        </div>
      </div>
    </section>
  )
}
