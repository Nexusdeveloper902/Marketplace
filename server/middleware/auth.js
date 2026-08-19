/**
 * Authentication middleware/guards — Express port of src/lib/server/guards.ts.
 * The session cookie carries only the userId; the full user (with role) is
 * reloaded from SQLite on every request.
 */
const { db } = require("../database/database")
const { readSession } = require("../lib/session")

const userQuery = () =>
  db.prepare("SELECT id, email, name, role, createdAt FROM users WHERE id = ?")

/** Resolve the current session to a full user record, or null. */
function getCurrentUser(req) {
  try {
    const payload = readSession(req)
    if (!payload) return null
    return userQuery().get(payload.sub) ?? null
  } catch {
    return null
  }
}

/** Attaches req.user (or null) — applied globally. */
function attachUser(req, _res, next) {
  req.user = getCurrentUser(req)
  next()
}

/** 401 unless there is an authenticated session. */
function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "No autorizado" })
  next()
}

/** 401 without session / 403 for non-admins (mirrors requireAdmin). */
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "No autorizado" })
  if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Acceso denegado" })
  next()
}

module.exports = { getCurrentUser, attachUser, requireUser, requireAdmin }
