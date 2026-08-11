import { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/server/guards"
import { getOrderForUser } from "@/lib/server/data/orders"
import { ok, unauthorized, notFound } from "@/lib/server/http"

/** GET /api/orders/[id] → order detail (ownership-checked). */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return unauthorized("Debes iniciar sesión")
  const { id } = await ctx.params
  // getOrderForUser filters by userId, so only the owner can retrieve it.
  const order = await getOrderForUser(user.id, id)
  if (!order) return notFound("Pedido no encontrado")
  return ok({ order })
}
