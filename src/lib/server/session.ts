import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { db } from "@/lib/db"

/**
 * Stateless session model: a signed JWT-like token stored in an httpOnly
 * cookie. No session table is required, which keeps the model compatible
 * with serverless/Vercel. The token payload only carries the userId; the
 * full user record (and role) is always reloaded from the database on the
 * server, so permissions are never trusted from the client.
 */

const COOKIE_NAME = "luxicar_session"
const ALG = "HS256"
const TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 16) {
    // In development we fall back to a fixed value so seeding/preview works,
    // but production must set AUTH_SECRET. A short/missing secret is a
    // deployment misconfiguration, not something we want to fail silently.
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be set in production")
    }
    return "dev-insecure-secret-change-me"
  }
  return secret
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url")
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url")
}

export interface SessionPayload {
  sub: string // userId
  iat: number
  exp: number
}

export function createSessionToken(userId: string): string {
  const payload: SessionPayload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  }
  const header = b64url(JSON.stringify({ alg: ALG, typ: "JWT" }))
  const body = b64url(JSON.stringify(payload))
  const sig = sign(`${header}.${body}`)
  return `${header}.${body}.${sig}`
}

export function verifySessionToken(token: string): SessionPayload | null {
  const parts = token.split(".")
  if (parts.length !== 3) return null
  const [header, body, sig] = parts
  const expected = sign(`${header}.${body}`)
  // timingSafeEqual requires equal-length buffers.
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload
    if (typeof payload.sub !== "string") return null
    if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

/** Read the session cookie and return the verified payload (no DB lookup). */
export async function readSession(): Promise<SessionPayload | null> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: "USER" | "ADMIN"
  createdAt: Date
}

/**
 * Resolve the current session to a full user record, reloading from the DB.
 * Returns null when there is no session or the user no longer exists.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const payload = await readSession()
  if (!payload) return null
  const user = await db.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })
  if (!user) return null
  return { ...user, role: user.role as "USER" | "ADMIN" }
}

export async function setSessionCookie(userId: string): Promise<void> {
  const token = createSessionToken(userId)
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export const SESSION_COOKIE = COOKIE_NAME
