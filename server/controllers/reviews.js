/**
 * Reviews data layer — SQLite port of src/lib/server/data/reviews.ts.
 * Rating is validated 1–5 before the purchase check; a user can only review
 * vehicles from COMPLETED orders, once per vehicle.
 */
const { db, createId } = require("../database/database")

class ReviewError extends Error {
  constructor(message, code = "UNKNOWN", statusCode = 400) {
    super(message)
    this.code = code
    this.statusCode = statusCode
  }
}

function vehicleIdFromSlug(slug) {
  const row = db.prepare("SELECT id FROM vehicles WHERE slug = ?").get(slug)
  return row?.id ?? null
}

function listReviews(vehicleSlug) {
  const vehicleId = vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) return { reviews: [], average: 0, count: 0 }
  const rows = db
    .prepare(
      `SELECT r.id, r.rating, r.comment, r.createdAt, r.updatedAt,
              u.id AS userId, u.name AS userName
       FROM reviews r JOIN users u ON u.id = r.userId
       WHERE r.vehicleId = ? ORDER BY r.createdAt DESC`
    )
    .all(vehicleId)
  const reviews = rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    user: { id: r.userId, name: r.userName },
  }))
  const count = reviews.length
  const average = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0
  return { reviews, average, count }
}

/**
 * A user may only review a vehicle they have purchased (completed order
 * containing that vehicle). One review per user per vehicle.
 */
function createReview(userId, vehicleSlug, rating, comment) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ReviewError("La valoración debe estar entre 1 y 5", "INVALID_RATING")
  }
  const trimmed = (comment ?? "").trim()
  if (trimmed.length > 1000) {
    throw new ReviewError("El comentario es demasiado largo", "INVALID_RATING")
  }

  const vehicleId = vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) {
    throw new ReviewError("Vehículo no encontrado", "INVALID_VEHICLE", 404)
  }

  // Ownership / purchase check: only buyers may review.
  const purchased = db
    .prepare(
      `SELECT oi.id FROM order_items oi
       JOIN orders o ON o.id = oi.orderId
       WHERE oi.vehicleId = ? AND o.userId = ? AND o.status = 'COMPLETED'
       LIMIT 1`
    )
    .get(vehicleId, userId)
  if (!purchased) {
    throw new ReviewError("Solo puedes reseñar vehículos que hayas comprado", "NOT_PURCHASED", 403)
  }

  try {
    db.prepare(
      "INSERT INTO reviews (id, userId, vehicleId, rating, comment) VALUES (?, ?, ?, ?, ?)"
    ).run(createId(), userId, vehicleId, rating, trimmed)
  } catch {
    // unique constraint violation → already reviewed
    throw new ReviewError("Ya has reseñado este vehículo", "ALREADY_REVIEWED", 409)
  }
  const review = db
    .prepare(
      `SELECT r.id, r.rating, r.comment, r.createdAt, r.updatedAt, u.id AS userId, u.name AS userName
       FROM reviews r JOIN users u ON u.id = r.userId
       WHERE r.userId = ? AND r.vehicleId = ?`
    )
    .get(userId, vehicleId)
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    user: { id: review.userId, name: review.userName },
  }
}

module.exports = { ReviewError, listReviews, createReview }
