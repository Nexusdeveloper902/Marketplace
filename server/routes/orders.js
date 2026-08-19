/**
 * Order routes — Express port of src/app/api/orders/.
 *   GET  /api/orders        (current user's orders)
 *   POST /api/orders        (atomic checkout)
 *   GET  /api/orders/:id    (order detail, ownership-checked)
 */
const express = require("express")
const { checkout, listOrders, getOrderForUser, CheckoutError } = require("../controllers/orders")
const { requireUser } = require("../middleware/auth")
const { trackEvent, EventType } = require("../lib/events")

const router = express.Router()

router.get("/", requireUser, (req, res) => {
  return res.json({ orders: listOrders(req.user.id) })
})

router.post("/", requireUser, (req, res) => {
  const b = req.body ?? {}
  if (!Array.isArray(b.items) || b.items.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío" })
  }

  trackEvent({
    type: EventType.CHECKOUT_STARTED,
    userId: req.user.id,
    metadata: { itemCount: b.items.length },
  })

  try {
    const result = checkout(
      req.user.id,
      b.items.map((it) => ({ vehicleSlug: it.vehicleSlug, quantity: it.quantity ?? 1 }))
    )
    trackEvent({
      type: EventType.PURCHASE_COMPLETED,
      userId: req.user.id,
      orderId: result.orderId,
      metadata: { total: result.total, orderNumber: result.orderNumber },
    })
    return res.status(201).json(result)
  } catch (e) {
    if (e instanceof CheckoutError) {
      return res.status(e.statusCode === 409 ? 409 : 400).json({ error: e.message })
    }
    return res.status(500).json({ error: e instanceof Error ? e.message : "Error al procesar la compra" })
  }
})

router.get("/:id", requireUser, (req, res) => {
  // getOrderForUser filters by userId, so only the owner can retrieve it.
  const order = getOrderForUser(req.user.id, req.params.id)
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" })
  return res.json({ order })
})

module.exports = router
