/**
 * Login page — port of login-view.tsx. Split visual + form, con validación
 * inline igual que el original. Soporta ?redirect=/ruta.
 */
import { icon } from "../icons.js"
import { auth } from "../auth.js"
import { escapeHtml, hydrateReveals } from "../ui.js"

const redirect = new URLSearchParams(window.location.search).get("redirect") ?? "/"

function markup() {
  return `
  <div class="min-h-screen bg-background">
    <div class="grid min-h-screen lg:grid-cols-2">
      <div class="relative hidden overflow-hidden lg:block">
        <img src="/vehicles/porsche-911-carrera/1.jpg" alt="" class="absolute inset-0 h-full w-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div class="relative z-10 flex h-full flex-col justify-end p-10">
          <a href="/" class="absolute left-10 top-10 flex items-center gap-2.5" aria-label="Ir al inicio">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10">
              ${icon("Gauge", "h-5 w-5", 2.2)}
            </span>
            <span class="flex-col items-start leading-none flex">
              <span class="text-[15px] font-semibold tracking-tight text-foreground">Digital <span class="text-gradient">Marketplace</span></span>
              <span class="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Alta Gama</span>
            </span>
          </a>
          <p class="text-eyebrow text-[11px] text-[var(--signature)]">Bienvenido de vuelta</p>
          <h1 class="text-display mt-4 max-w-md text-4xl text-foreground sm:text-5xl">Accede a tu <span class="text-gradient">garaje digital</span></h1>
          <p class="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">Inicia sesión y recupera en cualquier dispositivo tus favoritos, tu comparador y tus pedidos.</p>
          <ul class="mt-8 space-y-2.5 text-sm text-muted-foreground">
            <li class="flex items-center gap-2.5">${icon("Check", "h-4 w-4 text-[var(--success)]", 2.5)} <span>Favoritos sincronizados</span></li>
            <li class="flex items-center gap-2.5">${icon("Check", "h-4 w-4 text-[var(--success)]", 2.5)} <span>Completar pedidos y reseñas</span></li>
            <li class="flex items-center gap-2.5">${icon("Check", "h-4 w-4 text-[var(--success)]", 2.5)} <span>Garaje privado en la nube</span></li>
          </ul>
        </div>
      </div>
      <div class="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
        <form id="login-form" class="reveal is-visible w-full max-w-md" novalidate>
          <a href="/" class="mb-8 flex items-center gap-2.5 lg:hidden" aria-label="Ir al inicio">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10">
              ${icon("Gauge", "h-5 w-5", 2.2)}
            </span>
            <span class="flex-col items-start leading-none flex">
              <span class="text-[15px] font-semibold tracking-tight text-foreground">Digital <span class="text-gradient">Marketplace</span></span>
              <span class="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Alta Gama</span>
            </span>
          </a>
          <p class="text-eyebrow text-[11px] text-[var(--signature)]">Acceso</p>
          <h1 class="text-display mt-4 text-3xl text-foreground sm:text-4xl">Iniciar sesión</h1>
          <p class="mt-3 text-sm text-muted-foreground">Introduce tus credenciales para entrar a tu garaje.</p>

          <div class="mt-8 space-y-5">
            <div>
              <label for="email" class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Correo electrónico</label>
              <div class="relative mt-1.5 flex h-12 items-center rounded-xl border border-border/60 bg-card transition-colors focus-within:border-foreground/30">
                <span class="pl-4 text-muted-foreground">${icon("Mail", "h-4 w-4")}</span>
                <input id="email" type="email" autocomplete="email" class="h-full flex-1 bg-transparent px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none" placeholder="tu@correo.com" />
              </div>
              <p class="mt-1.5 min-h-[16px] text-xs text-[var(--destructive)]" id="err-email"></p>
            </div>
            <div>
              <label for="password" class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Contraseña</label>
              <div class="relative mt-1.5 flex h-12 items-center rounded-xl border border-border/60 bg-card transition-colors focus-within:border-foreground/30">
                <span class="pl-4 text-muted-foreground">${icon("Lock", "h-4 w-4")}</span>
                <input id="password" type="password" autocomplete="current-password" class="h-full flex-1 bg-transparent px-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none" placeholder="********" />
                <button type="button" id="toggle-password" class="absolute right-3.5 text-muted-foreground transition-colors hover:text-foreground" aria-label="Mostrar contraseña">
                  ${icon("Eye", "h-4 w-4")}
                </button>
              </div>
              <p class="mt-1.5 min-h-[16px] text-xs text-[var(--destructive)]" id="err-password"></p>
            </div>
            <button type="submit" id="login-btn" class="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
              Iniciar sesión
            </button>
            <p class="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta? <a href="/registro${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}" class="font-medium text-[var(--signature)] hover:underline">Crear cuenta</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>`
}

async function iniciar() {
  // Si hay sesión, redirige directo al destino (como el original)
  await auth.refresh().catch(() => null)
  if (auth.isAuthenticated) {
    window.location.href = redirect
    return
  }
  document.body.insertAdjacentHTML("afterbegin", markup())
  hydrateReveals()

  const form = document.getElementById("login-form")
  const email = document.getElementById("email")
  const password = document.getElementById("password")
  const btn = document.getElementById("login-btn")

  document.getElementById("toggle-password").addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password"
  })

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const errE = document.getElementById("err-email")
    const errP = document.getElementById("err-password")
    errE.textContent = ""
    errP.textContent = ""
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      errE.textContent = "Correo electrónico inválido"
      return
    }
    if (password.value.length < 1) {
      errP.textContent = "Introduce tu contraseña"
      return
    }
    btn.disabled = true
    btn.textContent = "Entrando…"
    const result = await auth.login(email.value.trim().toLowerCase(), password.value)
    if (result.ok) {
      btn.textContent = "Bienvenido"
      window.location.href = redirect
    } else {
      btn.disabled = false
      btn.textContent = "Iniciar sesión"
      errP.textContent = result.error || "Credenciales incorrectas"
    }
  })
}

iniciar()
