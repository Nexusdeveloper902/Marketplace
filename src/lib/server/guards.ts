import "next/server"
import { redirect } from "next/navigation"
import { getSessionUser, type SessionUser } from "./session"

/** Returns the current user or null. Never throws. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    return await getSessionUser()
  } catch {
    return null
  }
}

/** Returns the current user or redirects to /login. */
export async function requireUser(loginPath = "/login"): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) redirect(loginPath)
  return user
}

/** Returns the current admin or redirects to /admin/login. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (user.role !== "ADMIN") redirect("/")
  return user
}

export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === "ADMIN"
}
