/**
 * Vehicle routes — Express port of src/app/api/vehicles/.
 *   GET /api/vehicles         (filters, sort, pagination, ?all=1 for full catalog)
 *   GET /api/vehicles/:slug   (detail + reviews + favorited flag)
 */
const express = require("express")
const { listVehicles, listAllVehicles, getVehicleBySlug } = require("../controllers/vehicles")
const { listReviews } = require("../controllers/reviews")
const { isFavorited } = require("../controllers/favorites")
const { estadoInventario } = require("../lib/slug")
const { trackEvent, EventType } = require("../lib/events")

const router = express.Router()

function toNumber(v) {
  if (v == null || v === "") return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

function toArray(v) {
  if (!v) return undefined
  return String(v).split(",").map((s) => s.trim()).filter(Boolean)
}

router.get("/", (req, res) => {
  const sp = req.query
  const all = sp.all === "1" || sp.all === "true"
  if (all) {
    const items = listAllVehicles()
    return res.json({ items, total: items.length })
  }
  const query = {
    search: sp.search || undefined,
    marca: sp.marca || undefined,
    categorias: toArray(sp.categorias),
    combustibles: toArray(sp.combustibles),
    tracciones: toArray(sp.tracciones),
    precioMin: toNumber(sp.precioMin),
    precioMax: toNumber(sp.precioMax),
    añoMin: toNumber(sp["añoMin"]),
    añoMax: toNumber(sp["añoMax"]),
    potenciaMin: toNumber(sp.potenciaMin),
    orden: sp.orden || undefined,
    page: toNumber(sp.page),
    pageSize: toNumber(sp.pageSize),
    includeUnavailable: sp.includeUnavailable === "1",
  }
  try {
    return res.json(listVehicles(query))
  } catch (e) {
    return res.status(400).json({ error: e instanceof Error ? e.message : "Error al listar vehículos" })
  }
})

router.get("/:id", (req, res) => {
  const slug = req.params.id
  const row = getVehicleBySlug(slug)
  if (!row) return res.status(404).json({ error: "Vehículo no encontrado" })

  const { toVehicleDTO } = require("../lib/mappers")
  const vehicle = {
    ...toVehicleDTO(row),
    estadoInventario: estadoInventario(row.stock, Boolean(row.available)),
  }

  const reviews = listReviews(slug)
  const favorited = req.user ? isFavorited(req.user.id, slug) : false

  // best-effort view tracking
  trackEvent({ type: EventType.VEHICLE_VIEWED, userId: req.user?.id ?? null, vehicleId: row.id })

  return res.json({ vehicle, reviews, favorited })
})

module.exports = router
