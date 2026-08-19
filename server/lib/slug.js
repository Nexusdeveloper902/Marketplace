/** Slug helper, mirrors the original src/lib/server/mappers.ts slugify(). */
function slugify(input) {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

/** Inventory status label shown in the UI. */
function estadoInventario(stock, available) {
  if (!available || stock <= 0) return "agotado"
  if (stock === 1) return "ultima"
  return "disponible"
}

module.exports = { slugify, estadoInventario }
