import { SiteShell } from "@/components/layout/site-shell"
import { VehicleDetailView } from "@/components/marketplace/vehicle-detail-view"
import { listAllVehicles, getVehicleBySlug, getVehicleDTOBySlug } from "@/lib/server/data/vehicles"
import { notFound } from "next/navigation"
import { trackEvent, EventType } from "@/lib/server/events"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const vehiculos = await listAllVehicles()
  return vehiculos.map((v) => ({ id: v.id }))
}

export default async function VehiculoPage({ params }: PageProps) {
  const { id } = await params
  const row = await getVehicleBySlug(id)
  if (!row) notFound()
  const vehiculo = await getVehicleDTOBySlug(id)
  if (!vehiculo) notFound()

  // Fire-and-forget view event for analytics (non-blocking).
  void trackEvent({ type: EventType.VEHICLE_VIEWED, vehicleId: row.id })

  const catalogo = await listAllVehicles()
  return (
    <SiteShell>
      <VehicleDetailView vehiculo={vehiculo} catalogo={catalogo} />
    </SiteShell>
  )
}
