import type { Metadata } from "next"
import { SiteShell } from "@/components/layout/site-shell"
import { BrandDetailView } from "@/components/marketplace/brand-detail-view"
import { listBrands, getBrandBySlug, getBrandNameBySlug } from "@/lib/server/data/brands"
import { listVehicles } from "@/lib/server/data/vehicles"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

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

// Per-brand meta title + description, with a safe fallback when the DB is
// unreachable during a static-prerender crawl.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { marca: slug } = await params
  try {
    const brand = await getBrandBySlug(slug)
    const nombre = brand?.name ?? getBrandNameBySlug(slug) ?? slug
    const descripcion =
      brand?.description ??
      `Explora todos los vehículos ${nombre} disponibles en Digital Marketplace.`
    return {
      title: `Vehículos ${nombre}`,
      description: `${descripcion} Modelos de alta gama, especificaciones y precios.`,
      alternates: { canonical: `/marcas/${slug}` },
      openGraph: {
        title: `Vehículos ${nombre} · Digital Marketplace`,
        description: descripcion,
      },
    }
  } catch {
    return { title: "Marca" }
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
