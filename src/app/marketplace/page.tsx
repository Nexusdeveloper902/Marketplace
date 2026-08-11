import { SiteShell } from "@/components/layout/site-shell"
import { MarketplaceView } from "@/components/marketplace/marketplace-view"
import { listAllVehicles, listAllMarcas } from "@/lib/server/data/vehicles"

export default async function MarketplacePage() {
  const [vehiculos, marcas] = await Promise.all([listAllVehicles(), listAllMarcas()])
  return (
    <SiteShell>
      <MarketplaceView vehiculos={vehiculos} marcas={marcas} />
    </SiteShell>
  )
}
