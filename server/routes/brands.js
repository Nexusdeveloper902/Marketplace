/**
 * Brand routes — Express port of src/app/api/brands/route.ts.
 *   GET /api/brands           (brand summaries)
 *   GET /api/brands?slug=...  (brand detail + its vehicles)
 */
const express = require("express")
const { listBrands, getBrandBySlug } = require("../controllers/brands")
const { listVehicles } = require("../controllers/vehicles")

const router = express.Router()

router.get("/", (req, res) => {
  const slug = req.query.slug
  if (slug) {
    const brand = getBrandBySlug(String(slug))
    if (!brand) return res.status(404).json({ error: "Marca no encontrada" })
    const vehicles = listVehicles({ marca: brand.name, pageSize: 200 })
    return res.json({ brand, vehicles: vehicles.items, cantidad: vehicles.total })
  }
  return res.json({ brands: listBrands() })
})

module.exports = router
