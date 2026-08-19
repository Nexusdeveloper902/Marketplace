/**
 * Vehicle detail page — port of vehicle-detail-view.tsx (+ related vehicles,
 * reviews section and financing calculator). Incluye galería con visor a
 * pantalla completa y acciones de compra sincronizadas con el store.
 */
import { renderShell } from "../layout.js"
import { api } from "../api.js"
import { icon } from "../icons.js"
import { tienda, MAX_COMPARAR } from "../store.js"
import { auth, toggleFavorito } from "../auth.js"
import { toast } from "../toast.js"
import { formatearPrecio, formatearNumero, formatFecha } from "../format.js"
import { escapeHtml, hydrateReveals, hydrateSmartImages } from "../ui.js"
import { vehicleCardMarkup, hydrateVehicleCards, estaDisponible } from "../vehicle-card.js"
import { openCheckoutModal } from "../checkout-modal.js"

const ESPECIFICACIONES = [
  { clave: "motor", etiqueta: "Motor", icono: "Cog", sufijo: null },
  { clave: "potencia", etiqueta: "Potencia", icono: "Zap", sufijo: " HP" },
  { clave: "torque", etiqueta: "Torque", icono: "Gauge", sufijo: " Nm" },
  { clave: "transmision", etiqueta: "Transmisión", icono: "Cog", sufijo: null },
  { clave: "velocidadMaxima", etiqueta: "Vel. máxima", icono: "TrendingUp", sufijo: " km/h" },
  { clave: "aceleracion0a100", etiqueta: "0—100 km/h", icono: "Timer", sufijo: " s" },
  { clave: "combustible", etiqueta: "Combustible", icono: "Fuel", sufijo: null },
  { clave: "traccion", etiqueta: "Tracción", icono: "Compass", sufijo: null },
  { clave: "categoria", etiqueta: "Categoría", icono: "ShoppingBag", sufijo: null },
]

let vehiculo = null
let reviews = []
let favorited = false
let catalogo = []
let viewerOpen = false
let galeriaActiva = 0

// --- Galería -------------------------------------------------------------------
function galeriaMarkup() {
  const imagenes = vehiculo.imagenes ?? []
  const inicial = imagenes[0] ?? ""
  return `
  <div class="flex flex-col gap-3" id="v-galeria">
    <div class="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/50 bg-secondary shadow-card group">
      <img src="${escapeHtml(inicial)}" alt="${escapeHtml(vehiculo.marca)} ${escapeHtml(vehiculo.modelo)}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" id="v-img-activa" />
      <button id="v-ampliar" class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-md transition-opacity hover:bg-background/90" aria-label="Ampliar imagen">
        ${icon("Search", "h-4 w-4", 2)}
      </button>
    </div>
    <div class="flex gap-3 overflow-x-auto pb-1" id="v-miniaturas">
      ${imagenes.map((img, i) => `
        <button data-idx="${i}" class="miniatura relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border ${i === 0 ? "border-foreground/60" : "border-border/50"} bg-secondary transition-all" aria-label="Imagen ${i + 1}">
          <img src="${escapeHtml(img)}" alt="" class="h-full w-full object-cover" />
        </button>`).join("")}
    </div>
    <div id="v-viewer"></div>
  </div>`
}

function wireGaleria() {
  const imgEl = document.getElementById("v-img-activa")
  const thumbs = document.getElementById("v-miniaturas")
  const viewer = document.getElementById("v-viewer")

  function setActiva(idx) {
    galeriaActiva = idx
    imgEl.src = vehiculo.imagenes[idx]
    thumbs.querySelectorAll(".miniatura").forEach((b, i) => {
      b.classList.toggle("border-foreground/60", i === idx)
      b.classList.toggle("border-border/50", i !== idx)
    })
    if (viewerOpen) renderViewer()
  }

  thumbs.querySelectorAll(".miniatura").forEach((b) =>
    b.addEventListener("click", () => setActiva(Number(b.dataset.idx)))
  )

  function renderViewer() {
    if (!viewerOpen) {
      viewer.innerHTML = ""
      return
    }
    const img = vehiculo.imagenes[galeriaActiva]
    viewer.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl anim-fade-in" id="v-viewer-overlay">
        <div class="anim-pop-in relative">
          <img src="${escapeHtml(img)}" alt="Imagen ampliada" class="max-h-[85vh] max-w-[90vw] rounded-2xl border border-border/50 object-contain shadow-card-hover" />
          <button id="v-cerrar" class="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-accent" aria-label="Cerrar">${icon("X", "h-5 w-5")}</button>
          ${vehiculo.imagenes.length > 1 ? `
            <button id="v-prev" class="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-md hover:bg-background/80" aria-label="Anterior">${icon("ChevronLeft", "h-5 w-5")}</button>
            <button id="v-next" class="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-md hover:bg-background/80" aria-label="Siguiente">${icon("ChevronRight", "h-5 w-5")}</button>` : ""}
          <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">${galeriaActiva + 1} / ${vehiculo.imagenes.length}</span>
        </div>
      </div>`
    viewer.querySelector("#v-cerrar")?.addEventListener("click", () => { viewerOpen = false; renderViewer() })
    viewer.querySelector("#v-viewer-overlay")?.addEventListener("click", (e) => {
      if (e.target.id === "v-viewer-overlay") { viewerOpen = false; renderViewer() }
    })
    viewer.querySelector("#v-prev")?.addEventListener("click", () => setActiva((galeriaActiva - 1 + vehiculo.imagenes.length) % vehiculo.imagenes.length))
    viewer.querySelector("#v-next")?.addEventListener("click", () => setActiva((galeriaActiva + 1) % vehiculo.imagenes.length))
  }

  document.getElementById("v-ampliar").addEventListener("click", () => {
    viewerOpen = true
    renderViewer()
  })
}

// --- Acciones de compra / favoritos ------------------------------------------------
function renderAcciones() {
  const s = tienda.get()
  const estaEnCarrito = s.carrito.includes(vehiculo.id)
  const estaComprado = s.garaje.includes(vehiculo.id)
  const esFavorito = s.favoritos.includes(vehiculo.id)
  const enComparador = s.comparar.includes(vehiculo.id)
  const disponible = estaDisponible(vehiculo)
  const box = document.getElementById("v-acciones")

  let botonClase
  let etiqueta
  if (!disponible) {
    botonClase = "cursor-not-allowed border border-border/50 bg-secondary/40 text-muted-foreground"
    etiqueta = `${icon("Ban", "h-4 w-4", 2.2)} Vehículo agotado`
  } else if (estaComprado) {
    botonClase = "cursor-default bg-secondary text-muted-foreground"
    etiqueta = `${icon("BadgeCheck", "h-4 w-4 text-[var(--success)]", 2.5)} Vehículo comprado`
  } else if (estaEnCarrito) {
    botonClase = "cursor-default border border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
    etiqueta = `${icon("Check", "h-4 w-4", 2.5)} En el carrito`
  } else {
    botonClase = "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.99]"
    etiqueta = `${icon("ShoppingCart", "h-4 w-4", 2.2)} Agregar al carrito`
  }

  box.innerHTML = `
    <div class="flex flex-col gap-3">
      <button id="v-carrito-btn" ${!disponible || estaEnCarrito || estaComprado ? "disabled" : ""}
        class="flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300 ${botonClase}">
        ${etiqueta}
      </button>
      ${estaComprado ? `
        <a href="/garaje" class="rounded-xl border border-border bg-card px-6 py-4 text-center text-sm font-semibold text-foreground transition-colors hover:bg-accent">Ver en mi garaje</a>` : ""}
      ${estaEnCarrito && !estaComprado ? `
        <a href="/carrito" class="rounded-xl border border-border bg-card px-6 py-4 text-center text-sm font-semibold text-foreground transition-colors hover:bg-accent">Ver carrito y finalizar compra</a>` : ""}
    </div>
    <div class="mt-4 flex items-center gap-2">
      <button id="v-favorito-btn" class="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 transition-colors hover:bg-secondary" aria-label="${esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}">
        ${esFavorito ? icon("Heart", "h-5 w-5 fill-[var(--signature)] text-[var(--signature)]") : icon("Heart", "h-5 w-5")}
      </button>
      <button id="v-comparar-btn" class="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 transition-colors hover:bg-secondary" aria-label="${enComparador ? "Quitar del comparador" : "Añadir al comparador"}">
        ${enComparador ? icon("Check", "h-5 w-5 text-[var(--success)]") : icon("GitCompareArrows", "h-5 w-5")}
      </button>
    </div>`

  box.querySelector("#v-carrito-btn")?.addEventListener("click", () => {
    if (!estaDisponible(vehiculo)) return
    const ok = tienda.agregarAlCarrito(vehiculo.id, true)
    if (ok) toast({ title: "Añadido al carrito", description: `El ${vehiculo.marca} ${vehiculo.modelo} se añadió al carrito.` })
  })
  box.querySelector("#v-favorito-btn")?.addEventListener("click", () => {
    const era = tienda.esFavorito(vehiculo.id)
    toggleFavorito(vehiculo.id)
    toast({
      title: era ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: `${vehiculo.marca} ${vehiculo.modelo} ${era ? "se ha quitado de" : "se ha añadido a"} tus favoritos.`,
    })
  })
  box.querySelector("#v-comparar-btn")?.addEventListener("click", () => {
    const era = tienda.estaEnComparador(vehiculo.id)
    if (!era && tienda.get().comparar.length >= MAX_COMPARAR) {
      toast({ title: "Comparador lleno", description: "Solo puedes comparar hasta 3 vehículos a la vez." })
      return
    }
    tienda.toggleComparar(vehiculo.id)
    toast({
      title: era ? "Quitado del comparador" : "Añadido al comparador",
      description: `${vehiculo.marca} ${vehiculo.modelo} ${era ? "se ha quitado del" : "se ha añadido al"} comparador.`,
    })
  })
}

// --- Calculadora de financiamiento ------------------------------------------------
function calculadoraMarkup() {
  return `
  <div class="rounded-2xl border border-border/70 bg-card p-6 shadow-card" id="v-fin">
    <p class="text-eyebrow text-[10px] text-[var(--signature)]">Financiamiento</p>
    <h3 class="mt-2 flex items-center gap-2 text-base font-semibold text-foreground">
      ${icon("Calculator", "h-4 w-4")}Simulador de financiamiento
    </h3>
    <div class="mt-5 grid gap-4 sm:grid-cols-2">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Entrada inicial (20%)</p>
        <input type="range" id="fin-inicial" min="10" max="90" step="5" value="20" class="w-full slider-premium" />
        <p class="mt-1 text-xs text-muted-foreground"><span id="fin-inicial-v" class="font-medium text-foreground">20%</span> del valor</p>
      </div>
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plazo</p>
        <select id="fin-plazo" class="w-full rounded-xl border border-border/60 bg-card px-3 py-2 text-sm text-foreground focus:outline-none">
          <option value="12">12 meses</option>
          <option value="24">24 meses</option>
          <option value="36" selected>36 meses</option>
          <option value="48">48 meses</option>
          <option value="60">60 meses</option>
        </select>
      </div>
    </div>
    <div class="mt-4 rounded-xl bg-secondary/50 p-4 text-sm">
      <p class="flex justify-between"><span class="text-muted-foreground">Precio contado</span><span class="font-semibold">${formatearPrecio(vehiculo.precio)}</span></p>
      <p class="mt-1.5 flex justify-between"><span class="text-muted-foreground">Entrada inicial</span><span class="font-semibold" id="fin-entrada"></span></p>
      <p class="mt-1.5 flex justify-between"><span class="text-muted-foreground">Saldo a financiar</span><span class="font-semibold" id="fin-saldo"></span></p>
      <div class="my-2 border-t border-border/60"></div>
      <p class="flex justify-between text-base">
        <span class="font-semibold text-foreground">Cuota mensual estimada</span>
        <span class="text-gradient font-semibold" id="fin-cuota"></span>
      </p>
      <p class="mt-1 text-[11px] text-muted-foreground">Tasa anual ilustrativa 9,9%. Simulación sin compromiso.</p>
    </div>`
}

function wireCalculadora() {
  const TASA = 0.099 / 12
  const calcular = () => {
    const pct = Number(document.getElementById("fin-inicial").value) / 100
    const n = Number(document.getElementById("fin-plazo").value)
    document.getElementById("fin-inicial-v").textContent = `${pct * 100}%`
    const entrada = vehiculo.precio * pct
    const saldo = vehiculo.precio - entrada
    const cuota = saldo * (TASA * (1 + TASA) ** n) / ((1 + TASA) ** n - 1)
    document.getElementById("fin-entrada").textContent = formatearPrecio(Math.round(entrada))
    document.getElementById("fin-saldo").textContent = formatearPrecio(Math.round(saldo))
    document.getElementById("fin-cuota").textContent = formatearPrecio(Math.round(cuota))
  }
  document.getElementById("fin-inicial").addEventListener("input", calcular)
  document.getElementById("fin-plazo").addEventListener("change", calcular)
  calcular()
}

// --- Reseñas ---------------------------------------------------------------------
function estrellasMarkup(rating, interactivo = false, idPrefijo = "star") {
  let out = ""
  for (let i = 1; i <= 5; i++) {
    const llena = i <= rating
    if (interactivo) {
      out += `<button type="button" data-star="${i}" class="star-btn transition-colors ${llena ? "text-[var(--signature)]" : "text-muted-foreground/40"} hover:text-[var(--signature)]" aria-label="${i} estrella${i > 1 ? "s" : ""}">${icon("Star", "h-5 w-5", llena ? 1.5 : 1.5)}</button>`
    } else {
      out += `<span class="${llena ? "text-[var(--signature)]" : "text-muted-foreground/30"}">${icon("Star", "h-3.5 w-3.5", llena ? 1.5 : 1.5)}</span>`
    }
  }
  return out
}

function resenasMarkup() {
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  return `
  <div class="mt-14" id="v-resenas">
    <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Valoraciones de clientes</h2>
    <div class="mt-4 flex items-center gap-3">
      <p class="text-3xl font-semibold text-foreground">${average ? average.toFixed(1) : "—"}</p>
      <div>
        <div class="flex">${average ? estrellasMarkup(Math.round(average)) : ""}</div>
        <p class="mt-0.5 text-xs text-muted-foreground">${reviews.length} reseña${reviews.length !== 1 ? "s" : ""}</p>
      </div>
    </div>
    <div id="v-review-list" class="mt-6 space-y-4">
      ${reviews.length === 0
        ? `<p class="rounded-xl border border-border/50 bg-card/60 p-6 text-sm text-muted-foreground">Aún no hay reseñas de este vehículo. ¡Sé el primero en compartir tu experiencia!</p>`
        : reviews.map(r => `
          <article class="rounded-xl border border-border/50 bg-card p-5 shadow-card">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">${escapeHtml(r.user?.name?.charAt(0) ?? "?")}</span>
                <div>
                  <p class="text-sm font-semibold text-foreground">${escapeHtml(r.user?.name ?? "Usuario")}</p>
                  <div class="flex">${estrellasMarkup(r.rating)}</div>
                </div>
              </div>
              <p class="text-xs text-muted-foreground">${formatFecha(r.createdAt)}</p>
            </div>
            ${r.comment ? `<p class="mt-3 text-sm leading-relaxed text-muted-foreground">${escapeHtml(r.comment)}</p>` : ""}
          </article>`).join("")}
    </div>
    <form id="v-review-form" class="mt-6 rounded-xl border border-border/50 bg-card p-5 shadow-card">
      <p class="flex items-center gap-2 text-sm font-semibold text-foreground">
        ${icon("PenLine", "h-4 w-4")} Escribe tu valoración
      </p>
      <div class="mt-3 flex items-center gap-1" id="v-stars">${estrellasMarkup(5, true)}</div>
      <textarea id="v-comment" rows="3" placeholder="Cuéntanos tu experiencia con este vehículo (opcional)" class="mt-3 w-full resize-none rounded-xl border border-border/60 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground/30"></textarea>
      <div class="mt-3 flex items-center justify-between gap-3">
        <p class="min-h-[16px] text-xs text-[var(--destructive)]" id="v-review-error"></p>
        <button type="submit" class="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50" id="v-review-submit">Publicar reseña</button>
      </div>
    </form>
  </div>`
}

let ratingSeleccionado = 5
function wireResenas() {
  const form = document.getElementById("v-review-form")
  const stars = form.querySelectorAll(".star-btn")
  stars.forEach((b) => b.addEventListener("click", () => {
    ratingSeleccionado = Number(b.dataset.star)
    stars.forEach((b2) => {
      const v = Number(b2.dataset.star)
      b2.classList.toggle("text-[var(--signature)]", v <= ratingSeleccionado)
      b2.classList.toggle("text-muted-foreground/40", v > ratingSeleccionado)
    })
  }))
  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const errorEl = document.getElementById("v-review-error")
    errorEl.textContent = ""
    if (!auth.isAuthenticated) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para escribir una reseña." })
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }
    const btn = document.getElementById("v-review-submit")
    btn.disabled = true
    try {
      await api.crearResena(vehiculo.id, ratingSeleccionado, document.getElementById("v-comment").value)
      const fresh = await api.resenas(vehiculo.id)
      reviews = fresh.reviews
      document.getElementById("v-resenas").outerHTML = resenasMarkup()
      wireResenas()
      toast({ title: "¡Gracias por tu reseña!", description: "Tu valoración se ha publicado correctamente." })
    } catch (err) {
      errorEl.textContent = err.message || "No se pudo publicar la reseña."
    } finally {
      btn.disabled = false
    }
  })
}

// --- Relacionados -----------------------------------------------------------------
function relacionadosMarkup() {
  const relacionados = catalogo
    .filter((v) => v.id !== vehiculo.id)
    .map((v) => {
      let score = 0
      if (v.marca === vehiculo.marca) score += 3
      if (v.categoria === vehiculo.categoria) score += 2
      if (v.combustible === vehiculo.combustible) score += 1
      const diff = Math.abs(v.precio - vehiculo.precio) / vehiculo.precio
      if (diff < 0.3) score += 2
      else if (diff < 0.6) score += 1
      return { v, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.v)
  if (!relacionados.length) return ""
  return `
  <section class="mt-16">
    <h2 class="flex items-center gap-2 text-base font-semibold text-foreground">
      ${icon("Car", "h-4 w-4")} Vehículos relacionados
    </h2>
    <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
      ${relacionados.map((v, i) => vehicleCardMarkup(v, { etiquetaBoton: "Ver detalles", index: i })).join("")}
    </div>
  </section>`
}

// --- Init ------------------------------------------------------------------------
async function iniciar() {
  const slug = window.location.pathname.split("/vehiculos/")[1]
  renderShell()
  const main = document.getElementById("main")

  let data
  try {
    data = await api.obtenerVehiculo(slug)
  } catch {
    window.location.href = "/marketplace"
    return
  }
  vehiculo = data.vehicle
  reviews = data.reviews?.reviews ?? []
  favorited = data.favorited ?? false
  document.title = `${vehiculo.marca} ${vehiculo.modelo} · Digital Marketplace`
  tienda.marcarVisto(slug)

  const disponible = estaDisponible(vehiculo)
  const estadoLabel = !disponible ? "Agotado" : vehiculo.stock <= 2 ? "Última unidad" : vehiculo.stock === null ? "" : `${vehiculo.stock} en inventario`

  main.innerHTML = `
  <section class="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8 lg:py-14">
    <a href="/marketplace" class="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
      ${icon("ArrowLeft", "h-4 w-4")} Volver al marketplace
    </a>
    <div class="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div class="reveal is-visible">
        ${galeriaMarkup()}
        <div class="mt-5 flex flex-wrap items-center gap-2">
          <span class="rounded-lg border border-border/70 bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">${vehiculo.año}</span>
          <span class="rounded-lg border border-border/70 bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">${escapeHtml(vehiculo.categoria)}</span>
          <span class="rounded-lg border border-border/70 bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">${escapeHtml(vehiculo.combustible)}</span>
          ${vehiculo.stock > 0 ? `
            <span class="rounded-lg border px-2.5 py-1 text-[11px] font-medium ${vehiculo.stock <= 2 ? "border-[var(--destructive)]/60 bg-[var(--destructive)]/10 text-[var(--destructive)]" : "border-[var(--success)]/60 bg-[var(--success)]/10 text-[var(--success)]"}">${estadoLabel}</span>` : `
            <span class="rounded-lg border border-[var(--destructive)]/60 bg-[var(--destructive)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--destructive)]">Agotado</span>`}
        </div>
      </div>
      <div class="reveal is-visible flex flex-col" style="--reveal-delay: 0.1s">
        <div>
          <div class="flex items-center gap-2">
            <p class="text-eyebrow text-[11px] text-[var(--signature)]">${escapeHtml(vehiculo.marca)}</p>
            <span class="rounded-lg border border-border/70 bg-secondary/60 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">${escapeHtml(vehiculo.categoria)}</span>
          </div>
          <h1 class="text-display mt-4 text-4xl text-foreground sm:text-5xl lg:text-6xl">${escapeHtml(vehiculo.modelo)}</h1>
          <p class="mt-4 text-sm font-medium text-muted-foreground">${vehiculo.año} · ${escapeHtml(vehiculo.combustible)} · ${formatearNumero(vehiculo.potencia)} HP</p>
        </div>
        <div class="mt-8 rounded-2xl border border-border/70 bg-secondary/40 p-6">
          <p class="text-eyebrow text-[10px] text-muted-foreground">Precio</p>
          <p class="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">${formatearPrecio(vehiculo.precio)}</p>
          <p class="mt-2 text-xs text-muted-foreground">Financiamiento disponible · Simulación sin compromiso</p>
        </div>
        <p class="mt-8 max-w-prose text-base leading-relaxed text-muted-foreground">${escapeHtml(vehiculo.descripcion)}</p>
        <div class="mt-10">
          <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Especificaciones técnicas</h2>
          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            ${ESPECIFICACIONES.map((spec) => {
              const valor = vehiculo[spec.clave]
              return `
              <div class="rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-border">
                <div class="flex items-center gap-2 text-muted-foreground">
                  ${icon(spec.icono, "h-4 w-4")}
                  <span class="text-[11px] font-medium uppercase tracking-wider">${spec.etiqueta}</span>
                </div>
                <p class="mt-2 text-sm font-semibold text-foreground">${typeof valor === "number" ? formatearNumero(valor) : escapeHtml(String(valor ?? ""))}${spec.sufijo ?? ""}</p>
              </div>`
            }).join("")}
          </div>
        </div>
        <div class="mt-8">${calculadoraMarkup()}</div>
        <div class="mt-8" id="v-acciones"></div>
      </div>
    </div>
    ${relacionadosMarkup()}
    <div id="v-resenas-wrapper">${resenasMarkup()}</div>
  </section>`

  wireGaleria()
  renderAcciones()
  wireCalculadora()
  wireResenas()
  tienda.subscribe(renderAcciones)
  // Sync favorito del servidor
  if (favorited && !tienda.esFavorito(vehiculo.id)) {
    tienda.setFavoritos([...tienda.get().favoritos, vehiculo.id])
  }
  hydrateReveals(main)
  hydrateVehicleCards(main)
  hydrateSmartImages(main)
}

iniciar()
