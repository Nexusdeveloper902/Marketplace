import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteShell } from "@/components/layout/site-shell"
import { siteConfig } from "@/lib/site"

/**
 * Shared layout for legal pages (privacy, terms). Renders the SiteShell
 * with a centered prose column. Pass the title + body as children.
 */
export function LegalShell({
  titulo,
  intro,
  ultimaActualizacion,
  children,
}: {
  titulo: string
  intro: string
  ultimaActualizacion: string
  children: React.ReactNode
}) {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <Link
          href="/"
          className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Volver al inicio
        </Link>

        <header className="mb-10">
          <p className="text-eyebrow text-[11px] text-[var(--signature)]">
            {siteConfig.name} · Legal
          </p>
          <h1 className="text-display mt-4 text-4xl text-foreground sm:text-5xl">
            {titulo}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {intro}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Última actualización: {ultimaActualizacion}
          </p>
        </header>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {children}
        </div>

        <footer className="mt-16 border-t border-border/40 pt-8 text-xs text-muted-foreground">
          <p>
            {siteConfig.contact.company} · {siteConfig.contact.addressLine1},{" "}
            {siteConfig.contact.addressLine2}
          </p>
          <p className="mt-1">
            CIF {siteConfig.contact.vatId} ·{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="transition-colors hover:text-foreground"
            >
              {siteConfig.contact.email}
            </a>{" "}
            · {siteConfig.contact.phone}
          </p>
        </footer>
      </article>
    </SiteShell>
  )
}
