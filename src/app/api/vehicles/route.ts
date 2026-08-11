import { NextRequest } from "next/server"
import { listVehicles, listAllVehicles, type VehicleQuery } from "@/lib/server/data/vehicles"
import { ok, badRequest } from "@/lib/server/http"

function toNumber(v: string | null): number | undefined {
  if (v == null || v === "") return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

function toArray(v: string | null): string[] | undefined {
  if (!v) return undefined
  return v.split(",").map((s) => s.trim()).filter(Boolean)
}

/**
 * GET /api/vehicles
 *
 * Supports: search, marca, categorias, combustibles, tracciones,
 * precioMin, precioMax, añoMin, añoMax, potenciaMin, orden, page, pageSize,
 * all (bool, returns full catalog for the existing client filter UX).
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const all = sp.get("all") === "1" || sp.get("all") === "true"

  if (all) {
    const items = await listAllVehicles()
    return ok({ items, total: items.length })
  }

  const query: VehicleQuery = {
    search: sp.get("search") ?? undefined,
    marca: sp.get("marca") ?? undefined,
    categorias: toArray(sp.get("categorias")),
    combustibles: toArray(sp.get("combustibles")),
    tracciones: toArray(sp.get("tracciones")),
    precioMin: toNumber(sp.get("precioMin")),
    precioMax: toNumber(sp.get("precioMax")),
    añoMin: toNumber(sp.get("añoMin")),
    añoMax: toNumber(sp.get("añoMax")),
    potenciaMin: toNumber(sp.get("potenciaMin")),
    orden: sp.get("orden") ?? undefined,
    page: toNumber(sp.get("page")),
    pageSize: toNumber(sp.get("pageSize")),
    includeUnavailable: sp.get("includeUnavailable") === "1",
  }

  try {
    const result = await listVehicles(query)
    return ok(result)
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Error al listar vehículos")
  }
}
