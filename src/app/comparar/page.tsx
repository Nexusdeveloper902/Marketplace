import type { Metadata } from "next"
import { SiteShell } from "@/components/layout/site-shell"
import { CompareView } from "@/components/marketplace/compare-view"

export const metadata: Metadata = {
  title: "Comparar vehículos",
  description:
    "Compara lado a lado las especificaciones, rendimiento y precio de los vehículos de alta gama que selecciones en Digital Marketplace.",
  alternates: { canonical: "/comparar" },
}

export default function CompararPage() {
  return (
    <SiteShell>
      <CompareView />
    </SiteShell>
  )
}
