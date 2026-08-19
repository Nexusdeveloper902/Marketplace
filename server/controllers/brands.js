/**
 * Brands data layer — SQLite port of src/lib/server/data/brands.ts.
 */
const { db } = require("../database/database")
const { brandDescription } = require("../lib/brand-descriptions")

function listBrands() {
  const brands = db.prepare("SELECT * FROM brands ORDER BY name ASC").all()
  const vehicles = db
    .prepare("SELECT marca, precio, images FROM vehicles WHERE available = 1")
    .all()
  return brands.map((b) => {
    const modelos = vehicles.filter((v) => v.marca === b.name)
    const precios = modelos.map((v) => v.precio)
    let imagen = null
    try {
      const imgs = JSON.parse(modelos[0]?.images ?? "[]")
      imagen = imgs[0] ?? null
    } catch {
      imagen = null
    }
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      description: b.description || brandDescription(b.name),
      cantidad: modelos.length,
      precioMin: precios.length ? Math.min(...precios) : 0,
      precioMax: precios.length ? Math.max(...precios) : 0,
      imagen,
    }
  })
}

function getBrandBySlug(slug) {
  return db.prepare("SELECT * FROM brands WHERE slug = ?").get(slug) ?? null
}

function getBrandNameBySlug(slug) {
  const brand = getBrandBySlug(slug)
  return brand?.name ?? null
}

module.exports = { listBrands, getBrandBySlug, getBrandNameBySlug }
