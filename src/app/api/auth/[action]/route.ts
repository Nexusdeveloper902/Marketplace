import { NextRequest } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/server/password"
import { setSessionCookie, clearSessionCookie } from "@/lib/server/session"
import { ok, badRequest, unauthorized, conflict } from "@/lib/server/http"

const registerSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(80),
  email: z.string().trim().email("Correo electrónico inválido").toLowerCase(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100),
})

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params

  if (action === "register") {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return badRequest("JSON inválido")
    }
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Datos inválidos")
    }
    const { name, email, password } = parsed.data

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return conflict("Ya existe una cuenta con este correo electrónico")
    }

    const passwordHash = await hashPassword(password)
    const user = await db.user.create({
      data: { name, email, passwordHash, role: "USER" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    await setSessionCookie(user.id)
    return ok({ user })
  }

  if (action === "login") {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return badRequest("JSON inválido")
    }
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest("Credenciales inválidas")
    }
    const { email, password } = parsed.data

    const user = await db.user.findUnique({ where: { email } })
    // Verify even when the user is missing to reduce timing-based user enumeration.
    const valid = user
      ? await verifyPassword(password, user.passwordHash)
      : await verifyPassword(password, "scrypt:00:00")
    if (!user || !valid) {
      return unauthorized("Credenciales incorrectas")
    }

    await setSessionCookie(user.id)
    return ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  }

  if (action === "logout") {
    await clearSessionCookie()
    return ok({ success: true })
  }

  return badRequest("Acción de autenticación inválida")
}
