/**
 * Favorites routes — Express port of src/app/api/favorites/route.ts.
 *   GET    /api/favorites                     (current user's favorite slugs)
 *   POST   /api/favorites  { vehicleSlug, action: add|remove|merge, slugs? }
 *   DELETE /api/favorites?vehicleSlug=...
 */
const express = require("express")
const {
  listFavoriteSlugs,
  addFavorite,
  removeFavorite,
  addFavoritesBulk,
} = require("../controllers/favorites")
const { db } = require("../database/database")
const { requireUser } = require("../middleware/auth")
const { trackEvent, EventType } = require("../lib/events")

const router = express.Router()

router.get("/", requireUser, (req, res) => {
  return res.json({ favoritos: listFavoriteSlugs(req.user.id) })
})

function vehicleRowBySlug(slug) {
  return db.prepare("SELECT id FROM vehicles WHERE slug = ?").get(slug)
}

router.post("/", requireUser, (req, res) => {
  const b = req.body ?? {}
  const action = b.action ?? "add"

  if (action === "merge") {
    // Merge guest (localStorage) favorites into the DB on login.
    const slugs = Array.isArray(b.slugs) ? b.slugs : []
    if (slugs.length) addFavoritesBulk(req.user.id, slugs)
    return res.json({ favoritos: listFavoriteSlugs(req.user.id) })
  }

  const vehicleSlug = b.vehicleSlug
  if (!vehicleSlug) return res.status(400).json({ error: "Falta vehicleSlug" })
  const vehicle = vehicleRowBySlug(vehicleSlug)
  if (!vehicle) return res.status(404).json({ error: "Vehículo no encontrado" })

  if (action === "remove") {
    removeFavorite(req.user.id, vehicleSlug)
    trackEvent({ type: EventType.VEHICLE_UNFAVORITED, userId: req.user.id, vehicleId: vehicle.id })
    return res.json({ favorited: false })
  }

  addFavorite(req.user.id, vehicleSlug)
  trackEvent({ type: EventType.VEHICLE_FAVORITED, userId: req.user.id, vehicleId: vehicle.id })
  return res.json({ favorited: true })
})

router.delete("/", requireUser, (req, res) => {
  const vehicleSlug = req.query.vehicleSlug
  if (!vehicleSlug) return res.status(400).json({ error: "Falta vehicleSlug" })
  const vehicle = vehicleRowBySlug(String(vehicleSlug))
  if (!vehicle) return res.status(404).json({ error: "Vehículo no encontrado" })
  removeFavorite(req.user.id, String(vehicleSlug))
  trackEvent({ type: EventType.VEHICLE_UNFAVORITED, userId: req.user.id, vehicleId: vehicle.id })
  return res.json({ favorited: false })
})

module.exports = router
