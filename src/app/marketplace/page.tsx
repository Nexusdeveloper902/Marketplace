import { SiteShell } from "@/components/layout/site-shell"
import { MarketplaceView } from "@/components/marketplace/marketplace-view"
import { listAllVehicles, listAllMarcas } from "@/lib/server/data/vehicles"

// Live inventory (prices/stock change), so render on demand rather than
// freezing the catalog at build time. Also keeps the build from hard-failing
// when the database is briefly unreachable during a deploy.
export const dynamic = "force-dynamic"

export default async function MarketplacePage() {
  const [vehiculos, marcas] = await Promise.all([listAllVehicles(), listAllMarcas()])
  return (
    <SiteShell>
      <MarketplaceView vehiculos={vehiculos} marcas={marcas} />
    </SiteShell>
  )
}
