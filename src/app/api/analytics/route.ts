import { requireAdmin } from "@/lib/server/guards"
import { getDashboardData } from "@/lib/server/data/analytics"
import { ok } from "@/lib/server/http"

/** GET /api/analytics → real DB-backed dashboard data (admin only). */
export async function GET() {
  await requireAdmin()
  const data = await getDashboardData()
  return ok(data)
}
