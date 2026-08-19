/**
 * Favorites data layer — SQLite port of src/lib/server/data/favorites.ts.
 * The (userId, vehicleId) unique constraint makes adds idempotent.
 */
const { db, createId } = require("../database/database")
const { toVehicleDTO } = require("../lib/mappers")

function vehicleIdFromSlug(slug) {
  const row = db.prepare("SELECT id FROM vehicles WHERE slug = ?").get(slug)
  return row?.id ?? null
}

function listFavorites(userId) {
  const rows = db
    .prepare(
      `SELECT v.* FROM favorites f JOIN vehicles v ON v.id = f.vehicleId
       WHERE f.userId = ? ORDER BY f.createdAt DESC`
    )
    .all(userId)
  return rows.map(toVehicleDTO)
}

function listFavoriteSlugs(userId) {
  return db
    .prepare(
      `SELECT v.slug FROM favorites f JOIN vehicles v ON v.id = f.vehicleId
       WHERE f.userId = ? ORDER BY f.createdAt DESC`
    )
    .all(userId)
    .map((r) => r.slug)
}

function isFavorited(userId, vehicleSlug) {
  const vehicleId = vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) return false
  return Boolean(
    db.prepare("SELECT id FROM favorites WHERE userId = ? AND vehicleId = ?").get(userId, vehicleId)
  )
}

function addFavorite(userId, vehicleSlug) {
  const vehicleId = vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) return false
  db.prepare("INSERT OR IGNORE INTO favorites (id, userId, vehicleId) VALUES (?, ?, ?)").run(
    createId(), userId, vehicleId
  )
  return true
}

function removeFavorite(userId, vehicleSlug) {
  const vehicleId = vehicleIdFromSlug(vehicleSlug)
  if (!vehicleId) return false
  db.prepare("DELETE FROM favorites WHERE userId = ? AND vehicleId = ?").run(userId, vehicleId)
  return true
}

/** Bulk-add slugs (used when merging guest favorites on login). */
function addFavoritesBulk(userId, vehicleSlugs) {
  if (!vehicleSlugs.length) return
  const insert = db.prepare(
    "INSERT OR IGNORE INTO favorites (id, userId, vehicleId) VALUES (?, ?, ?)"
  )
  const find = db.prepare("SELECT id FROM vehicles WHERE slug = ?")
  const tx = db.transaction(() => {
    for (const slug of vehicleSlugs) {
      const row = find.get(slug)
      if (row) insert.run(createId(), userId, row.id)
    }
  })
  tx()
}

module.exports = {
  listFavorites,
  listFavoriteSlugs,
  isFavorited,
  addFavorite,
  removeFavorite,
  addFavoritesBulk,
}
