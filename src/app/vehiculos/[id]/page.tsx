import { SiteShell } from "@/components/layout/site-shell"
import { VehicleDetailView } from "@/components/marketplace/vehicle-detail-view"
import { vehiculos } from "@/data/vehicles"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return vehiculos.map((v) => ({ id: v.id }))
}

export default async function VehiculoPage({ params }: PageProps) {
  const { id } = await params
  const existe = vehiculos.some((v) => v.id === id)
  if (!existe) notFound()

  return (
    <SiteShell>
      <VehicleDetailView id={id} />
    </SiteShell>
  )
}
