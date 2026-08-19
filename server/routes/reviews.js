/**
 * Review routes — Express port of src/app/api/reviews/route.ts.
 *   GET  /api/reviews?vehicleSlug=...
 *   POST /api/reviews  { vehicleSlug, rating, comment }
 */
const express = require("express")
const { createReview, listReviews, ReviewError } = require("../controllers/reviews")
const { requireUser } = require("../middleware/auth")

const router = express.Router()

router.get("/", (req, res) => {
  const vehicleSlug = req.query.vehicleSlug
  if (!vehicleSlug) return res.status(400).json({ error: "Falta vehicleSlug" })
  return res.json(listReviews(String(vehicleSlug)))
})

router.post("/", requireUser, (req, res) => {
  const b = req.body ?? {}
  if (!b.vehicleSlug) return res.status(400).json({ error: "Falta vehicleSlug" })
  try {
    const review = createReview(req.user.id, String(b.vehicleSlug), Number(b.rating), b.comment ?? "")
    return res.status(201).json({ review })
  } catch (e) {
    if (e instanceof ReviewError) {
      if (e.code === "INVALID_VEHICLE") return res.status(404).json({ error: e.message })
      return res.status(400).json({ error: e.message })
    }
    return res.status(400).json({ error: "No se pudo crear la reseña" })
  }
})

module.exports = router
