import { getCurrentUser } from "@/lib/server/guards"
import { ok, unauthorized } from "@/lib/server/http"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized("No hay sesión activa")
  return ok({ user })
}
