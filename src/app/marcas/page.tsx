import { SiteShell } from "@/components/layout/site-shell"
import { BrandsView, type BrandCardData } from "@/components/marketplace/brands-view"
import { listBrands } from "@/lib/server/data/brands"

// Brand catalog (counts/price ranges) reflects live inventory, so render on
// demand instead of freezing at build time.
export const dynamic = "force-dynamic"

export default async function MarcasPage() {
  const brands = await listBrands()
  const datosMarcas: BrandCardData[] = brands.map((b) => ({
    marca: b.name,
    slug: b.slug,
    cantidad: b.cantidad,
    precioMin: b.precioMin,
    precioMax: b.precioMax,
    imagen: b.imagen,
    descripcion: b.description,
  }))
  return (
    <SiteShell>
      <BrandsView datosMarcas={datosMarcas} />
    </SiteShell>
  )
}
