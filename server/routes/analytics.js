/**
 * Analytics route — Express port of src/app/api/analytics/route.ts.
 *   GET /api/analytics  (admin-only real dashboard data)
 */
const express = require("express")
const { getDashboardData } = require("../controllers/analytics")
const { requireAdmin } = require("../middleware/auth")

const router = express.Router()

router.get("/", requireAdmin, (_req, res) => {
  return res.json(getDashboardData())
})

module.exports = router
