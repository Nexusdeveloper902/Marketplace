/**
 * Lightweight, best-effort event tracking. Failures are swallowed so that
 * analytics never break a user-facing flow.
 */
const { db, createId } = require("../database/database")

const EventType = {
  VEHICLE_VIEWED: "VEHICLE_VIEWED",
  VEHICLE_FAVORITED: "VEHICLE_FAVORITED",
  VEHICLE_UNFAVORITED: "VEHICLE_UNFAVORITED",
  CART_ADDED: "CART_ADDED",
  CHECKOUT_STARTED: "CHECKOUT_STARTED",
  PURCHASE_COMPLETED: "PURCHASE_COMPLETED",
}

function trackEvent({ type, userId = null, vehicleId = null, orderId = null, metadata = {} }) {
  try {
    db.prepare(
      "INSERT INTO events (id, type, userId, vehicleId, orderId, metadata) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(createId(), type, userId, vehicleId, orderId, JSON.stringify(metadata ?? {}))
  } catch {
    // best-effort: ignore
  }
}

module.exports = { trackEvent, EventType }
