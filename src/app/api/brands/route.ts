import { NextRequest } from "next/server"
import { listBrands, getBrandBySlug } from "@/lib/server/data/brands"
import { listVehicles } from "@/lib/server/data/vehicles"
import { ok, notFound } from "@/lib/server/http"

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const slug = sp.get("slug")
  if (slug) {
    const brand = await getBrandBySlug(slug)
    if (!brand) return notFound("Marca no encontrada")
    const vehicles = await listVehicles({ marca: brand.name, pageSize: 200 })
    return ok({
      brand,
      vehicles: vehicles.items,
      cantidad: vehicles.total,
    })
  }
  const brands = await listBrands()
  return ok({ brands })
}
