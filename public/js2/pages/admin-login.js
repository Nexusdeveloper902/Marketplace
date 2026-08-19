/**
 * Admin login page — port of admin/login/page.tsx. Formulario compacto que
 * solo revela el acceso a administradores.
 */
import { icon } from "../icons.js"
import { auth } from "../auth.js"
import { hydrateReveals } from "../ui.js"

function markup() {
  return `
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <form id="admin-login-form" class="reveal is-visible w-full max-w-md rounded-2xl border border-border/50 bg-card p-8 shadow-card" novalidate>
      <div class="flex items-center gap-3">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          ${icon("Shield", "h-5 w-5", 2)}
        </span>
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-foreground">Acceso administrativo</h1>
          <p class="text-xs text-muted-foreground">Solo para administradores</p>
        </div>
      </div>
      <div class="mt-7 space-y-4">
        <div>
          <label for="email" class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Correo</label>
          <div class="relative mt-1.5 flex h-11 items-center rounded-xl border border-border/60 bg-background transition-colors focus-within:border-foreground/30">
            <span class="pl-3.5 text-muted-foreground">${icon("Mail", "h-4 w-4")}</span>
            <input id="email" type="email" autocomplete="email" class="h-full flex-1 bg-transparent px-3 text-sm text-foreground focus:outline-none" />
          </div>
            <p class="mt-1.5 min-h-[16px] text-xs text-[var(--destructive)]" id="err-email"></p>
        </div>
        <div>
          <label for="password" class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Contraseña</label>
          <div class="relative mt-1.5 flex h-11 items-center rounded-xl border border-border/60 bg-background transition-colors focus-within:border-foreground/30">
            <span class="pl-3.5 text-muted-foreground">${icon("Lock", "h-4 w-4")}</span>
            <input id="password" type="password" autocomplete="current-password" class="h-full flex-1 bg-transparent px-3 text-sm text-foreground focus:outline-none" />
          </div>
          <p class="mt-1.5 min-h-[16px] text-xs text-[var(--destructive)]" id="err-password"></p>
        </div>
        <button type="submit" id="admin-btn" class="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">Entrar al panel</button>
        <p class="text-center text-xs text-muted-foreground">La sesión de administrador se utiliza únicamente para el panel.</p>
      </div>
    </form>`
}

async function iniciar() {
  await auth.refresh().catch(() => null)
  if (auth.isAdmin) {
    window.location.href = "/admin"
    return
  }
  document.body.insertAdjacentHTML("afterbegin", markup())
  hydrateReveals()
  const form = document.getElementById("admin-login-form")
  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value.trim().toLowerCase()
    const password = document.getElementById("password").value
    const btn = document.getElementById("admin-btn")
    document.getElementById("err-password").textContent = ""
    btn.disabled = true
    const result = await auth.login(email, password)
    if (result.ok && auth.isAdmin) {
      window.location.href = "/admin"
    } else {
      btn.disabled = false
      document.getElementById("err-password").textContent = result.ok ? "Esta cuenta no es administradora." : result.error || "Credenciales incorrectas"
    }
  })
}

iniciar()
