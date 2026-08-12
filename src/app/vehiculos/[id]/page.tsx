import { SiteShell } from "@/components/layout/site-shell"
import { VehicleDetailView } from "@/components/marketplace/vehicle-detail-view"
import { listAllVehicles, getVehicleBySlug, getVehicleDTOBySlug } from "@/lib/server/data/vehicles"
import { notFound } from "next/navigation"
import { trackEvent, EventType } from "@/lib/server/events"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  try {
    const vehiculos = await listAllVehicles()
    return vehiculos.map((v) => ({ id: v.id }))
  } catch {
    // DB unreachable at build time — render vehicle pages on demand instead of
    // failing the whole build. Routes are still server-rendered at request time.
    return []
  }
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
