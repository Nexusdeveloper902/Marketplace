import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteShell } from "@/components/layout/site-shell"
import { GraciasContent } from "@/components/layout/gracias-content"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "¡Gracias por tu compra!",
  description:
    "Tu pedido en Digital Marketplace se ha completado. Disfruta de tu nuevo vehículo en tu garaje privado.",
  alternates: { canonical: "/gracias" },
  robots: { index: false, follow: true },
}

export default function GraciasPage() {
  return (
    <SiteShell>
      <GraciasContent />

      {/* Static CTA links (server-rendered, no client JS) */}
      <div className="mx-auto -mt-6 flex max-w-2xl flex-col items-center gap-3 px-4 pb-20 sm:flex-row sm:justify-center">
        <Link
          href="/garaje"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:gap-3 hover:shadow-[0_12px_40px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98]"
        >
          Ver en mi garaje
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/marketplace"
          className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          Seguir explorando
        </Link>
      </div>

      <p className="pb-16 text-center text-xs text-muted-foreground">
        {siteConfig.name} · {siteConfig.tagline}
      </p>
    </SiteShell>
  )
}
