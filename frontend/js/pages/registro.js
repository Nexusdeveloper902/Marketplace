/**
 * Register page — espejo del login con nombre + correo + contraseña (mismo
 * diseño split que login-view).
 */




const redirect = new URLSearchParams(window.location.search).get("redirect") ?? "/"

function markup() {
  return `
  <div class="min-h-screen bg-background">
    <div class="grid min-h-screen lg:grid-cols-2">
      <div class="relative hidden overflow-hidden lg:block">
        <img src="${assetPath("/vehicles/ferrari-sf90-stradale/1.jpg")}" alt="" class="absolute inset-0 h-full w-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div class="relative z-10 flex h-full flex-col justify-end p-10">
          <p class="text-eyebrow text-[11px] text-[var(--signature)]">Únete a la colección</p>
          <h1 class="text-display mt-4 max-w-md text-4xl text-foreground sm:text-5xl">Crea tu <span class="text-gradient">garaje digital</span></h1>
          <p class="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">Regístrate y desbloquea favoritos sincronizados, comparador en la nube y pedidos guardados.</p>
        </div>
      </div>
      <div class="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
        <form id="registro-form" class="reveal is-visible w-full max-w-md" novalidate>
          <a href="${hrefFromApp("/")}" class="mb-8 flex items-center gap-2.5" aria-label="Ir al inicio">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10">
              ${icon("Gauge", "h-5 w-5", 2.2)}
            </span>
            <span class="flex-col items-start leading-none flex">
              <span class="text-[15px] font-semibold tracking-tight text-foreground">Digital <span class="text-gradient">Marketplace</span></span>
              <span class="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Alta Gama</span>
            </span>
          </a>
          <p class="text-eyebrow text-[11px] text-[var(--signature)]">Registro</p>
          <h1 class="text-display mt-4 text-3xl text-foreground sm:text-4xl">Crear cuenta</h1>
          <p class="mt-3 text-sm text-muted-foreground">Alta tu garaje en menos de un minuto.</p>
          <div class="mt-8 space-y-5">
            <div>
              <label for="name" class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Nombre completo</label>
              <div class="relative mt-1.5 flex h-12 items-center rounded-xl border border-border/60 bg-card transition-colors focus-within:border-foreground/30">
                <span class="pl-4 text-muted-foreground">${icon("User", "h-4 w-4")}</span>
                <input id="name" type="text" autocomplete="name" class="h-full flex-1 bg-transparent px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none" placeholder="Carlos García" />
              </div>
              <p class="mt-1.5 min-h-[16px] text-xs text-[var(--destructive)]" id="err-name"></p>
            </div>
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
                <input id="password" type="password" autocomplete="new-password" class="h-full flex-1 bg-transparent px-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none" placeholder="Mínimo 6 caracteres" />
                <button type="button" id="toggle-password" class="absolute right-3.5 text-muted-foreground transition-colors hover:text-foreground" aria-label="Mostrar contraseña">${icon("Eye", "h-4 w-4")}</button>
              </div>
              <p class="mt-1.5 min-h-[16px] text-xs text-[var(--destructive)]" id="err-password"></p>
            </div>
            <button type="submit" id="reg-btn" class="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">Crear cuenta</button>
            <p class="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta? <a href="${hrefFromApp("/login")}${redirect !== "/" ? "?redirect=" + encodeURIComponent(redirect) : ""}" class="font-medium text-[var(--signature)] hover:underline">Iniciar sesión</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>`
}

async function iniciar() {
  document.body.insertAdjacentHTML("afterbegin", markup())
  hydrateReveals()

  const form = document.getElementById("registro-form")
  const name = document.getElementById("name")
  const email = document.getElementById("email")
  const password = document.getElementById("password")
  const btn = document.getElementById("reg-btn")

  document.getElementById("toggle-password").addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password"
  })

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const errN = document.getElementById("err-name")
    const errE = document.getElementById("err-email")
    const errP = document.getElementById("err-password")
    errN.textContent = errE.textContent = errP.textContent = ""
    if (name.value.trim().length < 2) { errN.textContent = "Introduce al menos 2 caracteres"; return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { errE.textContent = "Correo electrónico inválido"; return }
    if (password.value.length < 6) { errP.textContent = "La contraseña debe tener al menos 6 caracteres"; return }
    btn.disabled = true
    btn.textContent = "Creando…"
    const result = await auth.register(name.value.trim(), email.value.trim().toLowerCase(), password.value)
    if (result.ok) {
      window.location.href = hrefFromApp(redirect)
    } else {
      btn.disabled = false
      btn.textContent = "Crear cuenta"
      errE.textContent = result.error || "Ya existe una cuenta con este correo"
    }
  })
}

iniciar()
