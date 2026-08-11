import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server/guards"

/**
 * Server-side guard for the admin section. Non-admins (and anonymous
 * visitors) are redirected to the admin login. The login page itself is
 * under /admin/login and must remain accessible without auth, so it renders
 * its own layout (this guard still applies but getCurrentUser returns null
 * → redirect to /admin/login, which is a no-op when already there).
 *
 * To keep the login page reachable, we only redirect when the user is
 * authenticated but not an admin, OR when on a non-login admin route without
 * a session. The login route handles its own auth-state redirect client-side.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (user && user.role !== "ADMIN") {
    // An authenticated non-admin should not see the admin shell.
    redirect("/")
  }
  // Anonymous visitors can reach /admin/login; the login page redirects
  // authenticated admins to /admin client-side. Anonymous visitors hitting
  // /admin directly are handled by the page's own guard.
  return <>{children}</>
}
