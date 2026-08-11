import { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/server/guards"
import {
  listFavoriteSlugs,
  addFavorite,
  removeFavorite,
  addFavoritesBulk,
} from "@/lib/server/data/favorites"
import { ok, unauthorized, badRequest, notFound } from "@/lib/server/http"
import { trackEvent, EventType } from "@/lib/server/events"
import { db } from "@/lib/db"

/** GET /api/favorites → list the current user's favorite vehicle slugs. */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized("Debes iniciar sesión")
  const slugs = await listFavoriteSlugs(user.id)
  return ok({ favoritos: slugs })
}

/** POST /api/favorites  body: { vehicleSlug, action: "add" | "remove" | "merge", slugs?: string[] } */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized("Debes iniciar sesión")

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest("JSON inválido")
  }
  const b = body as { vehicleSlug?: string; action?: string; slugs?: string[] }
  const action = b.action ?? "add"

  if (action === "merge") {
    // Merge guest (localStorage) favorites into the DB on login.
    const slugs = Array.isArray(b.slugs) ? b.slugs : []
    if (slugs.length) await addFavoritesBulk(user.id, slugs)
    const favoritos = await listFavoriteSlugs(user.id)
    return ok({ favoritos })
  }

  const vehicleSlug = b.vehicleSlug
  if (!vehicleSlug) return badRequest("Falta vehicleSlug")

  // Validate vehicle exists.
  const vehicle = await db.vehicle.findUnique({ where: { slug: vehicleSlug }, select: { id: true } })
  if (!vehicle) return notFound("Vehículo no encontrado")

  if (action === "remove") {
    await removeFavorite(user.id, vehicleSlug)
    void trackEvent({ type: EventType.VEHICLE_UNFAVORITED, userId: user.id, vehicleId: vehicle.id })
    return ok({ favorited: false })
  }

  await addFavorite(user.id, vehicleSlug)
  void trackEvent({ type: EventType.VEHICLE_FAVORITED, userId: user.id, vehicleId: vehicle.id })
  return ok({ favorited: true })
}

/** DELETE /api/favorites?vehicleSlug=... */
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized("Debes iniciar sesión")
  const vehicleSlug = req.nextUrl.searchParams.get("vehicleSlug")
  if (!vehicleSlug) return badRequest("Falta vehicleSlug")
  const vehicle = await db.vehicle.findUnique({ where: { slug: vehicleSlug }, select: { id: true } })
  if (!vehicle) return notFound("Vehículo no encontrado")
  await removeFavorite(user.id, vehicleSlug)
  void trackEvent({ type: EventType.VEHICLE_UNFAVORITED, userId: user.id, vehicleId: vehicle.id })
  return ok({ favorited: false })
}
