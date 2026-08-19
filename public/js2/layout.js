/**
 * Shared site shell — port of src/components/layout/*.
 * Renders the sticky header, CTA banner, footer, sticky mobile CTA and the
 * cookie banner, and wires theme switching, badges and the account menu.
 */
import { icon } from "./icons.js"
import { tienda, temas, aplicarTema } from "./store.js"
import { auth } from "./auth.js"
import { escapeHtml, hydrateReveals } from "./ui.js"

const navItems = [
  { href: "/", label: "Inicio", iconName: "Home" },
  { href: "/marketplace", label: "Marketplace", iconName: "Store" },
  { href: "/marcas", label: "Marcas", iconName: "Building2" },
  { href: "/favoritos", label: "Favoritos", iconName: "Heart", badgeKey: "favoritos" },
  { href: "/comparar", label: "Comparar", iconName: "GitCompareArrows", badgeKey: "comparar" },
  { href: "/garaje", label: "Mi Garaje", iconName: "CarFront", badgeKey: "garaje" },
]

function estaActivo(href) {
  const path = window.location.pathname
  if (href === "/") return path === "/"
  if (href === "/marketplace") return path.startsWith("/marketplace") || path.startsWith("/vehiculos")
  return path.startsWith(href)
}

function badgeSpan(n) {
  return n > 0
    ? `<span class="relative z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">${n}</span>`
    : ""
}

function logoMarkup(size = "h-9 w-9") {
  return `
    <span class="flex ${size} items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10">
      ${icon("Gauge", "h-5 w-5", 2.2)}
    </span>
    <span class="hidden flex-col items-start leading-none sm:flex">
      <span class="text-[15px] font-semibold tracking-tight text-foreground">
        Digital <span class="text-gradient">Marketplace</span>
      </span>
      <span class="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Alta Gama</span>
    </span>`
}

function navMarkup() {
  const s = tienda.get()
  return navItems.map((item) => {
    const activo = estaActivo(item.href)
    const badge = item.badgeKey ? badgeSpan(s[item.badgeKey]?.length ?? 0) : ""
    return `
      <a href="${item.href}" aria-label="${item.label}"
         class="relative flex items-center gap-2 rounded-full px-2.5 py-2 text-sm font-medium transition-colors duration-200 lg:px-3.5 ${activo ? "text-foreground" : "text-muted-foreground hover:text-foreground"}">
        ${activo ? '<span class="absolute inset-0 rounded-full bg-secondary"></span>' : ""}
        ${icon(item.iconName, "relative z-10 h-4 w-4", 2)}
        <span class="relative z-10 hidden xl:inline">${item.label}</span>
        ${badge}
      </a>`
  }).join("")
}

function accountMarkup() {
  const user = auth.user
  if (!user) {
    return `
      <a href="/login" aria-label="Iniciar sesión"
         class="hidden h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border/70 px-3 text-sm font-medium transition-all duration-300 hover:text-foreground sm:flex text-muted-foreground ${estaActivo("/login") ? "border-border bg-secondary text-foreground" : ""}">
        ${icon("User", "h-4 w-4", 2)}
        <span class="hidden lg:inline">Entrar</span>
      </a>`
  }
  return `
    <div class="relative" id="account-menu">
      <button id="account-trigger" class="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border/70 px-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground sm:px-3" aria-label="Menú de cuenta">
        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold uppercase text-primary-foreground">${escapeHtml((user.name ?? user.email ?? "?").charAt(0))}</span>
        <span class="hidden max-w-[90px] truncate lg:inline">${escapeHtml(user.name ?? "Cuenta")}</span>
      </button>
      <div id="account-dropdown" class="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-border/70 bg-card p-1 shadow-card-hover hidden">
        <div class="px-2 py-1.5">
          <p class="text-sm font-medium text-foreground truncate">${escapeHtml(user.name ?? "Cuenta")}</p>
          <p class="truncate text-xs text-muted-foreground">${escapeHtml(user.email)}</p>
        </div>
        <div class="my-1 h-px bg-border/60"></div>
        <a href="/perfil" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary">${icon("User", "h-4 w-4")} Mi perfil</a>
        <a href="/pedidos" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary">${icon("Receipt", "h-4 w-4")} Mis pedidos</a>
        ${user.role === "ADMIN" ? `<a href="/admin" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary">${icon("Shield", "h-4 w-4")} Panel admin</a>` : ""}
        <div class="my-1 h-px bg-border/60"></div>
        <button id="logout-btn" class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10">${icon("LogOut", "h-4 w-4")} Cerrar sesión</button>
      </div>
    </div>`
}

function mobileMenuMarkup() {
  const open = document.getElementById("mobile-menu")
  if (!open) return
  const user = auth.user
  const s = tienda.get()
  open.innerHTML = `
    <div class="fixed inset-0 z-[100]">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" id="mobile-menu-overlay"></div>
      <aside class="anim-slide-in-right absolute right-0 top-0 h-full w-[280px] border-l border-border bg-background sm:w-[320px]">
        <div class="border-b border-border/60 px-6 py-5">
          <h2 class="text-left text-base font-semibold tracking-tight">Navegación</h2>
        </div>
        <nav class="flex flex-col gap-1 p-4">
          ${navItems.map((item) => {
            const activo = estaActivo(item.href)
            const badge = item.badgeKey ? badgeSpan(s[item.badgeKey]?.length ?? 0) : ""
            return `
              <a href="${item.href}" class="menu-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${activo ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}">
                ${icon(item.iconName, "h-5 w-5", 2)}<span class="flex-1">${item.label}</span>${badge}
              </a>`
          }).join("")}
          <a href="/carrito" class="menu-link mt-2 flex items-center gap-3 rounded-xl border-t border-border/60 px-4 pt-4 text-sm font-medium transition-colors ${estaActivo("/carrito") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}">
            ${icon("ShoppingCart", "h-5 w-5", 2)}<span class="flex-1">Carrito</span>${badgeSpan(s.carrito.length)}
          </a>
          ${user?.role === "ADMIN" ? `
            <a href="/admin" class="menu-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${estaActivo("/admin") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}">
              ${icon("Shield", "h-5 w-5", 2)}<span class="flex-1">Panel admin</span>
            </a>` : ""}
          ${user ? `
            <a href="/perfil" class="menu-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${estaActivo("/perfil") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}">
              ${icon("User", "h-5 w-5", 2)}<span class="flex-1">Mi perfil</span>
            </a>
            <a href="/pedidos" class="menu-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${estaActivo("/pedidos") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}">
              ${icon("Receipt", "h-5 w-5", 2)}<span class="flex-1">Mis pedidos</span>
            </a>
            <button id="mobile-logout" class="menu-link flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10">
              ${icon("LogOut", "h-5 w-5", 2)}<span class="flex-1">Cerrar sesión</span>
            </button>` : `
            <a href="/login" class="menu-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${estaActivo("/login") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}">
              ${icon("User", "h-5 w-5", 2)}<span class="flex-1">Iniciar sesión</span>
            </a>`}
          <div class="mt-2 border-t border-border/60 px-4 pt-4">
            <p class="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Tema visual</p>
            <div class="grid grid-cols-3 gap-2">
              ${temas.map((tema) => `
                <button data-tema="${tema.id}" class="tema-btn flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all ${tienda.get().temaActivo === tema.id ? "border-foreground/40 bg-secondary" : "border-border/50 hover:bg-secondary/50"}" aria-label="${tema.nombre}">
                  <span class="h-6 w-6 rounded-lg border border-border/50" style="background-color: ${tema.muestra}"></span>
                  <span class="text-[10px] font-medium text-muted-foreground">${tema.nombre}</span>
                </button>`).join("")}
            </div>
          </div>
        </nav>
      </aside>
    </div>`
  wireMobileMenu()
}

function closeMobileMenu() {
  const el = document.getElementById("mobile-menu")
  if (el) el.innerHTML = ""
}

function wireMobileMenu() {
  const root = document.getElementById("mobile-menu")
  if (!root) return
  root.querySelector("#mobile-menu-overlay")?.addEventListener("click", closeMobileMenu)
  root.querySelectorAll(".menu-link").forEach((a) => a.addEventListener("click", closeMobileMenu))
  root.querySelectorAll(".tema-btn").forEach((b) =>
    b.addEventListener("click", () => {
      tienda.setTema(b.dataset.tema)
      aplicarTema(b.dataset.tema)
    })
  )
  root.querySelector("#mobile-logout")?.addEventListener("click", async () => {
    await auth.logout()
    closeMobileMenu()
    window.location.reload()
  })
}

function themeDropdownMarkup() {
  return `
    <div class="relative hidden sm:block" id="theme-menu">
      <button id="theme-trigger" class="flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all duration-300 hover:text-foreground" aria-label="Cambiar tema">
        ${icon("Palette", "h-4 w-4", 2)}
      </button>
      <div id="theme-dropdown" class="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-border/70 bg-card p-2 shadow-card-hover hidden">
        <p class="px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Tema visual</p>
        <div class="space-y-0.5">
          ${temas.map((tema) => {
            const activo = tienda.get().temaActivo === tema.id
            return `
              <button data-tema="${tema.id}" class="tema-btn flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${activo ? "bg-secondary" : "hover:bg-secondary/50"}">
                <span class="h-6 w-6 shrink-0 rounded-lg border border-border/50" style="background-color: ${tema.muestra}"></span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-foreground">${tema.nombre}</p>
                  <p class="truncate text-[11px] text-muted-foreground">${tema.descripcion}</p>
                </div>
                ${activo ? icon("Check", "h-4 w-4 shrink-0 text-[var(--signature)]", 2.5) : ""}
              </button>`
          }).join("")}
        </div>
      </div>
    </div>`
}

function renderHeader() {
  const header = document.createElement("header")
  header.className = "sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50"
  header.innerHTML = `
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
      <a href="/" class="group flex shrink-0 items-center gap-2.5" aria-label="Ir al inicio">${logoMarkup()}</a>
      <nav class="hidden items-center gap-0.5 lg:flex">${navMarkup()}</nav>
      <div class="flex items-center gap-1.5 sm:gap-2">
        ${themeDropdownMarkup()}
        <span id="account-slot" class="flex items-center">${accountMarkup()}</span>
        <a href="/carrito" aria-label="Carrito con ${tienda.get().carrito.length} vehículo(s)"
           class="group relative flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-2 text-sm font-medium transition-all duration-200 sm:px-3.5 ${estaActivo("/carrito") ? "border-border bg-secondary text-foreground" : "border-border/70 text-muted-foreground hover:border-border hover:text-foreground"}">
          <span class="relative" id="carrito-bell">
            ${icon("ShoppingCart", "h-4 w-4 sm:h-[18px] sm:w-[18px]", 2)}
            <span class="carrito-badge ${tienda.get().carrito.length ? "" : "hidden"} absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">${tienda.get().carrito.length}</span>
          </span>
          <span class="hidden xl:inline">Carrito</span>
        </a>
        <button id="mobile-menu-btn" class="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground lg:hidden" aria-label="Abrir menú de navegación">
          ${icon("Menu", "h-5 w-5", 2)}
        </button>
      </div>
    </div>
    <div id="mobile-menu"></div>`
  return header
}

function wireHeader(header) {
  header.querySelector("#theme-trigger")?.addEventListener("click", (e) => {
    e.stopPropagation()
    const dd = header.querySelector("#theme-dropdown")
    dd.classList.toggle("hidden")
    dd.classList.add("anim-drop-in")
  })
  header.querySelectorAll(".tema-btn").forEach((b) =>
    b.addEventListener("click", () => {
      tienda.setTema(b.dataset.tema)
      aplicarTema(b.dataset.tema)
      setTimeout(() => header.querySelector("#theme-dropdown")?.classList.add("hidden"), 200)
    })
  )
  header.querySelector("#account-trigger")?.addEventListener("click", (e) => {
    e.stopPropagation()
    const dd = header.querySelector("#account-dropdown")
    dd.classList.toggle("hidden")
    dd.classList.add("anim-drop-in")
  })
  header.querySelector("#logout-btn")?.addEventListener("click", async () => {
    await auth.logout()
    window.location.reload()
  })
  header.querySelector("#mobile-menu-btn")?.addEventListener("click", mobileMenuMarkup)
  // Cierra dropdowns al hacer clic fuera (listener registrado una sola vez)
  if (!wireHeader.outsideWired) {
    wireHeader.outsideWired = true
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#theme-menu")) headerEl?.querySelector("#theme-dropdown")?.classList.add("hidden")
      if (!e.target.closest("#account-menu")) headerEl?.querySelector("#account-dropdown")?.classList.add("hidden")
    })
  }
}

function renderFooter() {
  const footer = document.createElement("footer")
  footer.className = "mt-auto border-t border-border/40 bg-background"
  const anio = new Date().getFullYear()
  footer.innerHTML = `
    <div class="mx-auto max-w-7xl px-4 py-12 pb-28 sm:px-6 lg:px-8 lg:pb-12">
      <div class="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-start">
        <div class="max-w-xs">
          <a href="/" class="flex items-center gap-2.5" aria-label="Ir al inicio">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">${icon("Gauge", "h-4 w-4", 2.2)}</span>
            <span class="text-sm font-semibold tracking-tight">Digital <span class="text-gradient">Marketplace</span></span>
          </a>
        </div>
        <nav class="flex flex-wrap items-start gap-x-8 gap-y-3 text-sm text-muted-foreground sm:gap-x-10">
          <div class="flex flex-col gap-2">
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">Explorar</p>
            <a href="/marketplace" class="transition-colors hover:text-foreground">Marketplace</a>
            <a href="/marcas" class="transition-colors hover:text-foreground">Marcas</a>
            <a href="/comparar" class="transition-colors hover:text-foreground">Comparar</a>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">Cuenta</p>
            <a href="/favoritos" class="transition-colors hover:text-foreground">Favoritos</a>
            <a href="/garaje" class="transition-colors hover:text-foreground">Mi Garaje</a>
            <a href="/carrito" class="transition-colors hover:text-foreground">Carrito</a>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">Legal</p>
            <a href="/privacidad" class="transition-colors hover:text-foreground">Privacidad</a>
            <a href="/terminos" class="transition-colors hover:text-foreground">Términos</a>
          </div>
        </nav>
      </div>
      <div class="mt-10 border-t border-border/40 pt-6 text-xs text-muted-foreground">
        <div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p>© ${anio} Digital Marketplace. Todos los derechos reservados.</p>
          <p>Experiencia de compra simulada.</p>
        </div>
      </div>
    </div>`
  return footer
}

function renderCtaBanner() {
  const section = document.createElement("section")
  section.className = "relative overflow-hidden border-t border-border/40 bg-card"
  section.innerHTML = `
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 opacity-60" style="background: radial-gradient(60% 80% at 50% 0%, oklch(0.85 0.09 80 / 0.08), transparent 70%)"></div>
    <div class="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Digital Marketplace · Vehículos de Alta Gama</p>
      <h2 class="text-display mt-5 text-3xl text-foreground sm:text-4xl lg:text-5xl">Tu próximo vehículo te espera.</h2>
      <p class="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Explora la colección, compara y reserva el modelo que siempre quisiste. Experiencia de compra premium, de principio a fin.
      </p>
      <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href="/marketplace" class="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:gap-3 hover:shadow-[0_12px_40px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98] sm:w-auto">
          Explorar vehículos ${icon("ArrowRight", "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1")}
        </a>
        <a href="/marcas" class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto">
          Ver marcas
        </a>
      </div>
    </div>`
  return section
}

// --- Sticky mobile CTA --------------------------------------------------------
const RUTAS_SIN_CTA = ["/login", "/registro", "/admin", "/privacidad", "/terminos", "/gracias"]
let stickyCtaEl = null
function wireStickyCta() {
  if (RUTAS_SIN_CTA.some((r) => window.location.pathname.startsWith(r))) return
  stickyCtaEl = document.createElement("div")
  stickyCtaEl.className = "fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 translate-y-full"
  document.body.appendChild(stickyCtaEl)
  const update = () => {
    const s = tienda.get()
    const hayCarrito = s.carrito.length > 0
    const href = hayCarrito ? "/carrito" : "/marketplace"
    const etiqueta = hayCarrito ? "Ir al carrito" : "Explorar vehículos"
    stickyCtaEl.innerHTML = `
      <div class="border-t border-border/70 bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <a href="${href}" class="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98]" aria-label="${etiqueta}">
          ${hayCarrito ? icon("ShoppingCart", "h-4 w-4", 2.2) : ""}${etiqueta}${hayCarrito ? "" : icon("ArrowRight", "h-4 w-4", 2.2)}
          ${hayCarrito ? `<span class="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-[11px] font-bold">${s.carrito.length}</span>` : ""}
        </a>
      </div>`
  }
  const onScroll = () => {
    if (window.scrollY > 320) stickyCtaEl.classList.remove("translate-y-full")
    else stickyCtaEl.classList.add("translate-y-full")
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  tienda.subscribe(update)
  update()
}

// --- Cookie banner -------------------------------------------------------------
const CONSENT_KEY = "dm-cookie-consent"
export function hasAnalyticsConsent() {
  try { return localStorage.getItem(CONSENT_KEY) === "accepted" } catch { return false }
}
function wireCookieBanner() {
  let estado
  try { estado = localStorage.getItem(CONSENT_KEY) } catch { estado = null }
  if (estado) return
  const wrapper = document.createElement("div")
  wrapper.className = "fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:bottom-4 sm:left-4 sm:right-auto sm:px-0 sm:pb-0"
  wrapper.setAttribute("role", "region")
  wrapper.setAttribute("aria-label", "Banner de consentimiento de cookies")
  wrapper.innerHTML = `
    <div class="anim-pop-in mx-auto w-full max-w-3xl rounded-2xl border border-border/70 bg-card/95 p-4 shadow-card backdrop-blur-xl sm:max-w-md sm:p-5">
      <div class="flex items-start gap-3">
        <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
          ${icon("Cookie", "h-5 w-5", 2)}
        </span>
        <div class="flex-1">
          <p class="text-sm font-semibold text-foreground">Cookies y privacidad</p>
          <p class="mt-1 text-xs leading-relaxed text-muted-foreground">
            Usamos cookies propias para el funcionamiento del sitio y de análisis anónimo para entender cómo se usa. Puedes aceptar o rechazar el análisis en cualquier momento. Lee nuestra
            <a href="/privacidad" class="font-medium text-[var(--signature)] hover:underline"> política de privacidad</a>.
          </p>
          <div class="mt-3 flex flex-col gap-2 sm:flex-row">
            <button data-consent="accepted" class="flex-1 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]">Aceptar todo</button>
            <button data-consent="rejected" class="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent active:scale-[0.98]">Solo necesarias</button>
          </div>
        </div>
        <button data-consent="rejected" aria-label="Cerrar banner de cookies" class="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          ${icon("X", "h-4 w-4", 2)}
        </button>
      </div>
    </div>`
  document.body.appendChild(wrapper)
  wrapper.querySelectorAll("[data-consent]").forEach((b) =>
    b.addEventListener("click", () => {
      try { localStorage.setItem(CONSENT_KEY, b.dataset.consent) } catch { /* ignore */ }
      wrapper.remove()
    })
  )
}

// --- Shell init ------------------------------------------------------------------
let headerEl = null

function renderShell({ cta = true } = {}) {
  const shell = document.createElement("div")
  shell.className = "flex min-h-screen flex-col bg-background"
  const main = document.querySelector("main") ?? document.querySelector("#main-root")
  const content = main ?? document.createElement("main")
  if (!main) content.className = "flex-1"

  headerEl = renderHeader()
  shell.appendChild(headerEl)
  shell.appendChild(content)
  if (cta) shell.appendChild(renderCtaBanner())
  shell.appendChild(renderFooter())

  // Mover el contenido existente dentro del shell
  document.body.prepend(shell)
  wireHeader(headerEl)
  subscribeBadges()
  wireStickyCta()
  wireCookieBanner()
}

// Actualiza badges cuando cambia el store o la sesión
function subscribeBadges() {
  const refreshBadges = () => {
    if (!headerEl) return
    headerEl.querySelector("nav").innerHTML = navMarkup()
    const badge = headerEl.querySelector(".carrito-badge")
    const n = tienda.get().carrito.length
    if (badge) {
      badge.textContent = n
      badge.classList.toggle("hidden", n === 0)
    }
    const slot = headerEl.querySelector("#account-slot")
    if (slot) {
      slot.innerHTML = accountMarkup()
      wireHeader(headerEl)
    }
  }
  tienda.subscribe(refreshBadges)
  auth.subscribe(refreshBadges)
}

export { renderShell, subscribeBadges }
