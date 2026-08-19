/**
 * Auth routes — Express port of src/app/api/auth/.
 *   POST /api/auth/register | /api/auth/login | /api/auth/logout
 *   GET  /api/auth/me
 */
const express = require("express")
const { db, createId } = require("../database/database")
const { hashPasswordSync, verifyPasswordSync } = require("../lib/password")
const { setSessionCookie, clearSessionCookie } = require("../lib/session")
const { requireUser } = require("../middleware/auth")

const router = express.Router()

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }
}

// Validation rules preserved from the original zod schemas.
function validateRegister(body) {
  const name = String(body?.name ?? "").trim()
  const email = String(body?.email ?? "").trim().toLowerCase()
  const password = String(body?.password ?? "")
  if (name.length < 2 || name.length > 80) return { error: "El nombre debe tener al menos 2 caracteres" }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Correo electrónico inválido" }
  if (password.length < 6 || password.length > 100) return { error: "La contraseña debe tener al menos 6 caracteres" }
  return { name, email, password }
}

router.post("/register", (req, res) => {
  const parsed = validateRegister(req.body)
  if (parsed.error) return res.status(400).json({ error: parsed.error })
  const { name, email, password } = parsed

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email)
  if (existing) {
    return res.status(409).json({ error: "Ya existe una cuenta con este correo electrónico" })
  }
  const id = createId()
  db.prepare("INSERT INTO users (id, email, name, passwordHash, role) VALUES (?, ?, ?, ?, 'USER')")
    .run(id, email, name, hashPasswordSync(password))
  const user = db.prepare("SELECT id, email, name, role, createdAt FROM users WHERE id = ?").get(id)
  setSessionCookie(res, user.id)
  return res.json({ user: publicUser(user) })
})

function validateLogin(body) {
  const email = String(body?.email ?? "").trim().toLowerCase()
  const password = String(body?.password ?? "")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 1) {
    return { error: "Credenciales inválidas" }
  }
  return { email, password }
}

router.post("/login", (req, res) => {
  const parsed = validateLogin(req.body)
  if (parsed.error) return res.status(400).json({ error: parsed.error })
  const { email, password } = parsed

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
  // Verify even when the user is missing to reduce timing-based user enumeration.
  const valid = user
    ? verifyPasswordSync(password, user.passwordHash)
    : verifyPasswordSync(password, "scrypt:00:00")
  if (!user || !valid) {
    return res.status(401).json({ error: "Credenciales incorrectas" })
  }
  setSessionCookie(res, user.id)
  return res.json({ user: publicUser(user) })
})

router.post("/logout", (_req, res) => {
  clearSessionCookie(res)
  return res.json({ success: true })
})

router.get("/me", requireUser, (req, res) => {
  return res.json({ user: publicUser(req.user) })
})

module.exports = router
