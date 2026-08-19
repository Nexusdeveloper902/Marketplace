/**
 * Stateless session model: a signed JWT-like token stored in an httpOnly
 * cookie. No session table is required. The token payload only carries the
 * userId; the full user record (and role) is always reloaded from the
 * database on the server, so permissions are never trusted from the client.
 */
const { createHmac, timingSafeEqual } = require("node:crypto")

const COOKIE_NAME = "luxicar_session"
const TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days

function getSecret() {
  // Local demo fallback; set AUTH_SECRET for anything beyond localhost.
  return process.env.AUTH_SECRET || "dev-insecure-secret-change-me"
}

function b64url(input) {
  return Buffer.from(input).toString("base64url")
}

function sign(data) {
  return createHmac("sha256", getSecret()).update(data).digest("base64url")
}

function createSessionToken(userId) {
  const now = Math.floor(Date.now() / 1000)
  const payload = { sub: userId, iat: now, exp: now + TTL_SECONDS }
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = b64url(JSON.stringify(payload))
  const sig = sign(`${header}.${body}`)
  return `${header}.${body}.${sig}`
}

function verifySessionToken(token) {
  const parts = String(token || "").split(".")
  if (parts.length !== 3) return null
  const [header, body, sig] = parts
  const expected = sign(`${header}.${body}`)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString())
    if (typeof payload.sub !== "string") return null
    if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

/** Minimal cookie parser (avoids an extra dependency). */
function parseCookies(req) {
  const header = req.headers.cookie || ""
  const out = {}
  for (const pair of header.split(";")) {
    const idx = pair.indexOf("=")
    if (idx === -1) continue
    out[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim())
  }
  return out
}

function readSession(req) {
  const token = parseCookies(req)[COOKIE_NAME]
  if (!token) return null
  return verifySessionToken(token)
}

function setSessionCookie(res, userId) {
  const token = createSessionToken(userId)
  const cookie = [
    `${COOKIE_NAME}=${token}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${TTL_SECONDS}`,
  ].join("; ")
  res.setHeader("Set-Cookie", cookie)
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`)
}

module.exports = {
  COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  readSession,
  setSessionCookie,
  clearSessionCookie,
}
