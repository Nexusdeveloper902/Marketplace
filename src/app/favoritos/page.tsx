import type { Metadata } from "next"
import { SiteShell } from "@/components/layout/site-shell"
import { FavoritesView } from "@/components/marketplace/favorites-view"

export const metadata: Metadata = {
  title: "Favoritos",
  description:
    "Tu colección de vehículos favoritos en Digital Marketplace. Guarda y revisa los modelos que más te gustan en un solo lugar.",
  alternates: { canonical: "/favoritos" },
}

export default function FavoritosPage() {
  return (
    <SiteShell>
      <FavoritesView />
    </SiteShell>
  )
}
