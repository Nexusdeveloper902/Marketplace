import { db } from "@/lib/db"
import { toVehicleDTO } from "../mappers"
import type { Vehicle } from "@/types/vehicle"

/** Resolve slug → vehicle row id. */
async function vehicleIdFromSlug(slug: string): Promise<string | null> {
  const row = await db.vehicle.findUnique({ where: { slug }, select: { id: true } })
  return row?.id ?? null
}

export async function listFavorites(userId: string): Promise<Vehicle[]> {
  const favs = await db.favorite.findMany({
    where: { userId },
    include: { vehicle: true },
    orderBy: { createdAt: "desc" },
  })
  return favs.map((f) => toVehicleDTO(f.vehicle))
}

export async function listFavoriteSlugs(userId: string): Promise<string[]> {
  const favs = await db.favorite.findMany({
    where: { userId },
    select: { vehicle: { select: { slug: true } } },
    orderBy: { createdAt: "desc" },
  })
  return favs.map((f) => f.vehicle.slug)
}

export async function isFavorited(userId: string, vehicleSlug: string): Promise<boolean> {
  const vehicleId = await vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) return false
  const fav = await db.favorite.findUnique({
    where: { userId_vehicleId: { userId, vehicleId } },
    select: { id: true },
  })
  return Boolean(fav)
}

export async function addFavorite(userId: string, vehicleSlug: string): Promise<boolean> {
  const vehicleId = await vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) return false
  try {
    await db.favorite.create({ data: { userId, vehicleId } })
    return true
  } catch {
    // unique constraint = already favorited; treat as success
    return true
  }
}

export async function removeFavorite(userId: string, vehicleSlug: string): Promise<boolean> {
  const vehicleId = await vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) return false
  await db.favorite.deleteMany({ where: { userId, vehicleId } })
  return true
}

/** Bulk-add slugs (used when merging guest favorites on login). */
export async function addFavoritesBulk(
  userId: string,
  vehicleSlugs: string[]
): Promise<void> {
  if (vehicleSlugs.length === 0) return
  const vehicles = await db.vehicle.findMany({
    where: { slug: { in: vehicleSlugs } },
    select: { id: true },
  })
  if (vehicles.length === 0) return
  // SQLite does not support skipDuplicates, so filter out already-favorited.
  const existing = await db.favorite.findMany({
    where: { userId, vehicleId: { in: vehicles.map((v) => v.id) } },
    select: { vehicleId: true },
  })
  const existingSet = new Set(existing.map((e) => e.vehicleId))
  const toCreate = vehicles
    .filter((v) => !existingSet.has(v.id))
    .map((v) => ({ userId, vehicleId: v.id }))
  if (toCreate.length === 0) return
  await db.favorite.createMany({ data: toCreate })
}
