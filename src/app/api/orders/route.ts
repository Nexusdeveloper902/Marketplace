import { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/server/guards"
import { checkout, listOrders, CheckoutError } from "@/lib/server/data/orders"
import { ok, unauthorized, badRequest, serverError } from "@/lib/server/http"
import { trackEvent, EventType } from "@/lib/server/events"

interface CheckoutBody {
  items: { vehicleSlug: string; quantity?: number }[]
}

/** GET /api/orders → list the current user's orders. */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized("Debes iniciar sesión")
  const orders = await listOrders(user.id)
  return ok({ orders })
}

/** POST /api/orders → atomic checkout. Server validates price/stock/identity. */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized("Debes iniciar sesión para comprar")

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest("JSON inválido")
  }
  const b = body as CheckoutBody
  if (!b || !Array.isArray(b.items) || b.items.length === 0) {
    return badRequest("El carrito está vacío")
  }

  void trackEvent({
    type: EventType.CHECKOUT_STARTED,
    userId: user.id,
    metadata: { itemCount: b.items.length },
  })

  try {
    const result = await checkout(
      user.id,
      b.items.map((it) => ({ vehicleSlug: it.vehicleSlug, quantity: it.quantity ?? 1 }))
    )
    void trackEvent({
      type: EventType.PURCHASE_COMPLETED,
      userId: user.id,
      orderId: result.orderId,
      metadata: { total: result.total, orderNumber: result.orderNumber },
    })
    return ok(result, 201)
  } catch (e) {
    if (e instanceof CheckoutError) {
      return badRequest(e.message)
    }
    return serverError(e instanceof Error ? e.message : "Error al procesar la compra")
  }
}
