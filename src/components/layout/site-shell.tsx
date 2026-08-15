"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CtaBanner } from "@/components/layout/cta-banner"
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta"

/**
 * Estructura común a todas las páginas: header sticky, contenido
 * principal flexible, una banda de CTA por encima del footer y el footer
 * pegado al fondo. En móvil se añade una CTA inferior fija.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <CtaBanner />
      <Footer />
      <StickyMobileCta />
    </div>
  )
}
