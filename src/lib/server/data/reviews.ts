import { db } from "@/lib/db"

export interface ReviewDetail {
  id: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
  user: { id: string; name: string | null }
}

export class ReviewError extends Error {
  constructor(
    message: string,
    public code:
      | "NOT_PURCHASED"
      | "ALREADY_REVIEWED"
      | "INVALID_RATING"
      | "INVALID_VEHICLE"
      | "UNKNOWN",
    public statusCode = 400
  ) {
    super(message)
  }
}

async function vehicleIdFromSlug(slug: string): Promise<string | null> {
  const row = await db.vehicle.findUnique({ where: { slug }, select: { id: true } })
  return row?.id ?? null
}

export async function listReviews(vehicleSlug: string): Promise<{
  reviews: ReviewDetail[]
  average: number
  count: number
}> {
  const vehicleId = await vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) return { reviews: [], average: 0, count: 0 }
  const rows = await db.review.findMany({
    where: { vehicleId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })
  const reviews: ReviewDetail[] = rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    user: { id: r.user.id, name: r.user.name },
  }))
  const count = reviews.length
  const average =
    count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0
  return { reviews, average, count }
}

export async function hasUserReviewed(
  userId: string,
  vehicleSlug: string
): Promise<boolean> {
  const vehicleId = await vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) return false
  const r = await db.review.findUnique({
    where: { userId_vehicleId: { userId, vehicleId } },
    select: { id: true },
  })
  return Boolean(r)
}

/**
 * A user may only review a vehicle they have purchased (completed order
 * containing that vehicle). One review per user per vehicle.
 */
export async function createReview(
  userId: string,
  vehicleSlug: string,
  rating: number,
  comment: string
): Promise<ReviewDetail> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ReviewError("La valoración debe estar entre 1 y 5", "INVALID_RATING")
  }
  const trimmed = (comment ?? "").trim()
  if (trimmed.length > 1000) {
    throw new ReviewError("El comentario es demasiado largo", "INVALID_RATING")
  }

  const vehicleId = await vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) {
    throw new ReviewError("Vehículo no encontrado", "INVALID_VEHICLE", 404)
  }

  // Ownership / purchase check: only buyers may review.
  const purchased = await db.orderItem.findFirst({
    where: { vehicleId, order: { userId, status: "COMPLETED" } },
    select: { id: true },
  })
  if (!purchased) {
    throw new ReviewError(
      "Solo puedes reseñar vehículos que hayas comprado",
      "NOT_PURCHASED",
      403
    )
  }

  try {
    const review = await db.review.create({
      data: { userId, vehicleId, rating, comment: trimmed },
      include: { user: { select: { id: true, name: true } } },
    })
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: { id: review.user.id, name: review.user.name },
    }
  } catch {
    // unique constraint violation → already reviewed
    throw new ReviewError(
      "Ya has reseñado este vehículo",
      "ALREADY_REVIEWED",
      409
    )
  }
}
