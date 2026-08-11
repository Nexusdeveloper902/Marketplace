import { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/server/guards"
import {
  createReview,
  listReviews,
  ReviewError,
} from "@/lib/server/data/reviews"
import { ok, unauthorized, badRequest, notFound } from "@/lib/server/http"

/** GET /api/reviews?vehicleSlug=... */
export async function GET(req: NextRequest) {
  const vehicleSlug = req.nextUrl.searchParams.get("vehicleSlug")
  if (!vehicleSlug) return badRequest("Falta vehicleSlug")
  const data = await listReviews(vehicleSlug)
  return ok(data)
}

/** POST /api/reviews  body: { vehicleSlug, rating, comment } */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized("Debes iniciar sesión para reseñar")

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest("JSON inválido")
  }
  const b = body as { vehicleSlug?: string; rating?: number; comment?: string }
  if (!b.vehicleSlug) return badRequest("Falta vehicleSlug")

  try {
    const review = await createReview(
      user.id,
      b.vehicleSlug,
      Number(b.rating),
      b.comment ?? ""
    )
    return ok({ review }, 201)
  } catch (e) {
    if (e instanceof ReviewError) {
      if (e.code === "INVALID_VEHICLE") return notFound(e.message)
      return badRequest(e.message)
    }
    return badRequest("No se pudo crear la reseña")
  }
}
