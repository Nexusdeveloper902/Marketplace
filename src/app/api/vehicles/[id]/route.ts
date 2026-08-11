import { NextRequest } from "next/server"
import { getVehicleDTOBySlug, getVehicleBySlug } from "@/lib/server/data/vehicles"
import { listReviews } from "@/lib/server/data/reviews"
import { isFavorited } from "@/lib/server/data/favorites"
import { getCurrentUser } from "@/lib/server/guards"
import { ok, notFound } from "@/lib/server/http"
import { estadoInventario } from "@/lib/server/mappers"
import { trackEvent, EventType } from "@/lib/server/events"

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: slug } = await ctx.params
  const row = await getVehicleBySlug(slug)
  if (!row) return notFound("Vehículo no encontrado")

  const vehicle = {
    id: row.slug,
    marca: row.marca,
    modelo: row.modelo,
    año: row.año,
    precio: row.precio,
    motor: row.motor,
    potencia: row.potencia,
    torque: row.torque,
    transmision: row.transmision,
    combustible: row.combustible,
    traccion: row.traccion,
    velocidadMaxima: row.velocidadMaxima,
    aceleracion0a100: row.aceleracion0a100,
    categoria: row.categoria,
    descripcion: row.descripcion,
    imagenes: (() => {
      try {
        const a = JSON.parse(row.images) as string[]
        return Array.isArray(a) ? a : []
      } catch {
        return []
      }
    })(),
    stock: row.stock,
    available: row.available,
    estadoInventario: estadoInventario(row.stock, row.available),
  }

  const [reviews, user] = await Promise.all([
    listReviews(slug),
    getCurrentUser(),
  ])
  const favorited = user ? await isFavorited(user.id, slug) : false

  // best-effort view tracking
  void trackEvent({
    type: EventType.VEHICLE_VIEWED,
    userId: user?.id ?? null,
    vehicleId: row.id,
  })

  return ok({ vehicle, reviews, favorited })
}
