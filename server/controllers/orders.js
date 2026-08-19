/**
 * Orders data layer — SQLite port of src/lib/server/data/orders.ts.
 * checkout() runs in a single transaction: validates exists/available/stock,
 * uses DB price (never client price), freezes priceAtPurchase, decrements
 * stock and marks the vehicle unavailable when it reaches zero.
 */
const { db, createId } = require("../database/database")
const { toVehicleDTO } = require("../lib/mappers")

const OrderStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
}

const ORDER_STATUS_LABELS = {
  PENDING: "Pendiente",
  PROCESSING: "En proceso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
}

class CheckoutError extends Error {
  constructor(message, code = "UNKNOWN", statusCode = 400) {
    super(message)
    this.code = code
    this.statusCode = statusCode
  }
}

/** Next human-friendly order number, e.g. "LXC-2026-00042". */
function nextOrderNumber() {
  const year = new Date().getFullYear()
  const prefix = `LXC-${year}-`
  const last = db
    .prepare("SELECT number FROM orders WHERE number LIKE ? ORDER BY number DESC LIMIT 1")
    .get(`${prefix}%`)
  let seq = 1
  if (last) {
    const n = Number(last.number.slice(prefix.length))
    if (!Number.isNaN(n)) seq = n + 1
  }
  return `${prefix}${String(seq).padStart(5, "0")}`
}

function toOrderDetail(order, items) {
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    statusLabel: ORDER_STATUS_LABELS[order.status] ?? order.status,
    total: order.total,
    createdAt: order.createdAt,
    items: items.map((it) => ({
      id: it.itemId,
      quantity: it.quantity,
      priceAtPurchase: it.priceAtPurchase,
      vehicle: toVehicleDTO(it),
    })),
  }
}

// Flat rows: item fields aliased to avoid clashing with vehicle columns.
const itemsWithVehicle = db.prepare(
  `SELECT oi.id AS itemId, oi.quantity, oi.priceAtPurchase, v.*
   FROM order_items oi JOIN vehicles v ON v.id = oi.vehicleId
   WHERE oi.orderId = ?`
)

/** Atomic checkout (transactional). */
function checkout(userId, items) {
  if (!items || items.length === 0) {
    throw new CheckoutError("El carrito está vacío", "EMPTY")
  }

  // Normalize: one entry per vehicle, quantity >= 1.
  const normalized = new Map()
  for (const it of items) {
    const q = Math.max(1, Math.floor(it.quantity || 1))
    normalized.set(it.vehicleSlug, (normalized.get(it.vehicleSlug) ?? 0) + q)
  }
  const slugs = [...normalized.keys()]

  const tx = db.transaction(() => {
    const rows = db
      .prepare(`SELECT * FROM vehicles WHERE slug IN (${slugs.map(() => "?").join(",")})`)
      .all(...slugs)
    const bySlug = new Map(rows.map((v) => [v.slug, v]))
    if (rows.length !== slugs.length) {
      throw new CheckoutError("Uno o más vehículos ya no están disponibles", "INVALID_VEHICLE")
    }

    let total = 0
    const orderItems = []
    for (const [slug, quantity] of normalized) {
      const v = bySlug.get(slug)
      if (!v.available || v.stock <= 0) {
        throw new CheckoutError(`${v.marca} ${v.modelo} no está disponible`, "UNAVAILABLE", 409)
      }
      if (v.stock < quantity) {
        throw new CheckoutError(
          `Stock insuficiente para ${v.marca} ${v.modelo} (disponible: ${v.stock})`,
          "INSUFFICIENT_STOCK",
          409
        )
      }
      // The server price is authoritative.
      total += v.precio * quantity
      orderItems.push({ vehicleId: v.id, priceAtPurchase: v.precio, quantity })
    }

    const number = nextOrderNumber()
    const orderId = createId()
    db.prepare(
      "INSERT INTO orders (id, number, userId, status, total) VALUES (?, ?, ?, ?, ?)"
    ).run(orderId, number, userId, OrderStatus.COMPLETED, total)
    for (const it of orderItems) {
      db.prepare(
        "INSERT INTO order_items (id, orderId, vehicleId, priceAtPurchase, quantity) VALUES (?, ?, ?, ?, ?)"
      ).run(createId(), orderId, it.vehicleId, it.priceAtPurchase, it.quantity)
    }

    // Decrement stock atomically; the conditional WHERE guarantees that a
    // concurrent checkout that already took the last unit aborts this one.
    for (const [slug, quantity] of normalized) {
      const v = bySlug.get(slug)
      const updated = db
        .prepare("UPDATE vehicles SET stock = stock - ? WHERE id = ? AND stock >= ?")
        .run(quantity, v.id, quantity)
      if (updated.changes !== 1) {
        throw new CheckoutError(`Stock insuficiente para ${v.marca} ${v.modelo}`, "INSUFFICIENT_STOCK", 409)
      }
      db.prepare("UPDATE vehicles SET available = 0 WHERE id = ? AND stock <= 0").run(v.id)
    }

    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId)
    return {
      orderId: order.id,
      orderNumber: order.number,
      total: order.total,
      vehicles: itemsWithVehicle.all(orderId).map((it) => toVehicleDTO(it)),
    }
  })

  return tx()
}

function listOrders(userId) {
  const orders = db
    .prepare("SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC")
    .all(userId)
  return orders.map((o) => toOrderDetail(o, itemsWithVehicle.all(o.id)))
}

function getOrderForUser(userId, orderId) {
  const order = db
    .prepare("SELECT * FROM orders WHERE id = ? AND userId = ?")
    .get(orderId, userId)
  return order ? toOrderDetail(order, itemsWithVehicle.all(order.id)) : null
}

module.exports = {
  OrderStatus,
  ORDER_STATUS_LABELS,
  CheckoutError,
  checkout,
  listOrders,
  getOrderForUser,
}
