import { SiteShell } from "@/components/layout/site-shell"
import { BrandDetailView } from "@/components/marketplace/brand-detail-view"
import { marcas } from "@/data/vehicles"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ marca: string }>
}

// Genera las rutas estáticas para cada marca.
export function generateStaticParams() {
  return marcas.map((marca) => ({
    marca: marca.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
  }))
}

// Convierte el slug de la URL al nombre real de la marca.
function slugToMarca(slug: string): string | null {
  return marcas.find(
    (m) =>
      m.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") === slug
  ) ?? null
}

export default async function MarcaPage({ params }: PageProps) {
  const { marca: slug } = await params
  const marca = slugToMarca(slug)
  if (!marca) notFound()

  return (
    <SiteShell>
      <BrandDetailView marca={marca} />
    </SiteShell>
  )
}
