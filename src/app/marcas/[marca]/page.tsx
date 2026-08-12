import { SiteShell } from "@/components/layout/site-shell"
import { BrandDetailView } from "@/components/marketplace/brand-detail-view"
import { listBrands, getBrandNameBySlug } from "@/lib/server/data/brands"
import { listVehicles } from "@/lib/server/data/vehicles"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ marca: string }>
}

// Genera las rutas estáticas para cada marca desde la base de datos.
export async function generateStaticParams() {
  try {
    const brands = await listBrands()
    return brands.map((b) => ({ marca: b.slug }))
  } catch {
    // DB unreachable at build time — render brand pages on demand instead of
    // failing the whole build.
    return []
  }
}

export default async function MarcaPage({ params }: PageProps) {
  const { marca: slug } = await params
  const marca = await getBrandNameBySlug(slug)
  if (!marca) notFound()

  const { items: vehiculos } = await listVehicles({
    marca,
    pageSize: 200,
    includeUnavailable: true,
  })

  return (
    <SiteShell>
      <BrandDetailView marca={marca} vehiculos={vehiculos} />
    </SiteShell>
  )
}
