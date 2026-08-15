import type { Metadata } from "next"
import { SiteShell } from "@/components/layout/site-shell"
import { GarageView } from "@/components/marketplace/garage-view"

export const metadata: Metadata = {
  title: "Mi Garaje",
  description:
    "Tu garaje privado en Digital Marketplace: revisa los vehículos que has adquirido, su estado y los detalles de tus pedidos.",
  alternates: { canonical: "/garaje" },
}

export default function GarajePage() {
  return (
    <SiteShell>
      <GarageView />
    </SiteShell>
  )
}
