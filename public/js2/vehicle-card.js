/**
 * Vehicle card — port of src/components/marketplace/vehicle-card.tsx (+ the
 * favorite/compare overlay buttons and the empty state).
 */
import { icon } from "./icons.js"
import { tienda, MAX_COMPARAR } from "./store.js"
import { auth, toggleFavorito } from "./auth.js"
import { toast } from "./toast.js"
import { formatearPrecio, formatearNumero } from "./format.js"
import { escapeHtml, smartImageMarkup, hydrateSmartImages } from "./ui.js"

export function estaDisponible(v) {
  return v.available !== false && (v.stock ?? 1) > 0
}

function obtenerEtiqueta(v) {
  if (v.combustible === "Eléctrico") return { texto: "Eléctrico", icono: "Battery", color: "text-[var(--chart-4)]" }
  if (v.categoria === "Superdeportivo") return { texto: "Superdeportivo", icono: "Flame", color: "text-[var(--signature)]" }
  if (v.precio > 200000) return { texto: "Edición exclusiva", icono: "Crown", color: "text-[var(--signature)]" }
  if (v.año >= 2024) return { texto: "Nuevo", icono: "Sparkle", color: "text-[var(--success)]" }
  return null
}

const SPARKLE_SVG = `<svg class="__CLS__" viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" /></svg>`

function iconoEtiqueta(etiqueta, cls) {
  if (etiqueta.icono === "Sparkle") {
    return SPARKLE_SVG.replace("__CLS__", `h-3 w-3 ${etiqueta.color}`)
  }
  return icon(etiqueta.icono, `h-3 w-3 ${etiqueta.color}`)
}

export function vehicleCardMarkup(vehiculo, { etiquetaBoton = "Ver detalles", variante = "marketplace", index = 0 } = {}) {
  const s = tienda.get()
  const href = `/vehiculos/${vehiculo.id}`
  const estaEnCarrito = tienda.estaEnCarrito(vehiculo.id)
  const estaComprado = tienda.estaComprado(vehiculo.id)
  const esFavorito = tienda.esFavorito(vehiculo.id)
  const enComparador = tienda.estaEnComparador(vehiculo.id)
  const disponible = estaDisponible(vehiculo)
  const nombreCompleto = `${vehiculo.marca} ${vehiculo.modelo}`
  const etiqueta = obtenerEtiqueta(vehiculo)

  let accionBoton
  if (!disponible) {
    accionBoton = `<span class="flex items-center gap-1.5">${icon("Ban", "h-4 w-4", 2.2)} Agotado</span>`
  } else if (estaComprado) {
    accionBoton = `<span class="flex items-center gap-1.5">${icon("BadgeCheck", "h-4 w-4", 2.3)} Comprado</span>`
  } else if (estaEnCarrito) {
    accionBoton = `<span class="flex items-center gap-1.5">${icon("Check", "h-4 w-4", 2.5)} En el carrito</span>`
  } else {
    accionBoton = `<span class="flex items-center gap-1.5">${icon("ShoppingCart", "h-4 w-4", 2.2)} Agregar al carrito</span>`
  }
  const botonClase = !disponible
    ? "cursor-not-allowed border-border/50 bg-secondary/40 text-muted-foreground"
    : estaComprado
      ? "cursor-default border-border/50 bg-secondary/50 text-muted-foreground"
      : estaEnCarrito
        ? "cursor-default border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
        : "border-border bg-secondary text-foreground hover:bg-accent"

  const acciones = (variante === "garaje" || variante === "favoritos")
    ? `<a href="${href}" class="group/btn mt-auto flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-semibold transition-all duration-300 hover:bg-accent">
        ${etiquetaBoton}${icon("ChevronRight", "h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5")}
      </a>`
    : `<div class="mt-auto flex flex-col gap-2.5 sm:flex-row">
        <button data-action="carrito" ${!disponible || estaEnCarrito || estaComprado ? "disabled" : ""}
          class="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${botonClase}">
          ${accionBoton}
        </button>
        <a href="${href}" class="group/btn flex flex-1 items-center justify-between gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          ${etiquetaBoton}${icon("ChevronRight", "h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5")}
        </a>
      </div>`

  return `
  <article class="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-all duration-500 ease-out hover:border-border/80 hover:bg-card/95 hover:shadow-card-hover" data-vehicle="${escapeHtml(vehiculo.id)}" data-nombre="${escapeHtml(nombreCompleto)}" style="--reveal-delay: ${Math.min(index * 0.04, 0.4)}s">
    <div class="relative block aspect-[16/10] w-full overflow-hidden bg-secondary">
      <a href="${href}" class="block h-full w-full" aria-label="Ver detalles del ${escapeHtml(nombreCompleto)}">
        ${smartImageMarkup({ src: vehiculo.imagenes[0] ?? "", alt: `${nombreCompleto} ${vehiculo.año}`, hoverScale: 1.04 })}
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-card/5 to-transparent"></div>
      </a>
      ${etiqueta
        ? `<span class="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-background/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide backdrop-blur-md">${iconoEtiqueta(etiqueta)} ${etiqueta.texto}</span>`
        : `<span class="pointer-events-none absolute left-3 top-3 rounded-lg bg-background/60 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-foreground backdrop-blur-md">${escapeHtml(vehiculo.marca)}</span>`}
      <div class="absolute right-3 top-3 flex items-center gap-1.5">
        <button data-action="comparar" class="flex items-center justify-center rounded-full transition-all duration-200 h-8 w-8 bg-background/60 text-foreground backdrop-blur-md hover:bg-background/80 sm:h-9 sm:w-9" aria-label="${enComparador ? `Quitar ${nombreCompleto} del comparador` : `Añadir ${nombreCompleto} al comparador`}">
          ${enComparador ? icon("Check", "h-3.5 w-3.5 text-[var(--success)] sm:h-4 sm:w-4", 2.5) : icon("GitCompareArrows", "h-3.5 w-3.5 sm:h-4 sm:w-4", 2)}
        </button>
        <button data-action="favorito" class="flex items-center justify-center rounded-full transition-all duration-200 h-8 w-8 bg-background/60 text-foreground backdrop-blur-md hover:bg-background/80 sm:h-9 sm:w-9" aria-label="${esFavorito ? `Quitar ${nombreCompleto} de favoritos` : `Añadir ${nombreCompleto} a favoritos`}">
          ${esFavorito ? icon("Heart", "h-3.5 w-3.5 fill-[var(--signature)] text-[var(--signature)] sm:h-4 sm:w-4", 2) : icon("Heart", "h-3.5 w-3.5 sm:h-4 sm:w-4", 2)}
        </button>
      </div>
      ${estaComprado ? `<span class="pointer-events-none absolute right-3 top-12 flex items-center gap-1 rounded-lg bg-[var(--success)]/15 px-2.5 py-1 text-[10px] font-semibold text-[var(--success)] backdrop-blur-md">${icon("BadgeCheck", "h-3 w-3", 2.5)} Comprado</span>` : ""}
      ${!disponible ? `<span class="pointer-events-none absolute inset-0 flex items-center justify-center"><span class="rounded-xl bg-background/85 px-4 py-2 text-sm font-bold uppercase tracking-wider text-muted-foreground shadow-lg backdrop-blur-md">Agotado</span></span>` : ""}
      <a href="${href}" class="absolute inset-x-0 bottom-0 p-4 text-left">
        <p class="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">${escapeHtml(vehiculo.marca)}</p>
        <h3 class="mt-0.5 text-lg font-semibold leading-tight text-foreground drop-shadow-sm sm:text-xl">${escapeHtml(vehiculo.modelo)}</h3>
        <p class="mt-0.5 text-[11px] font-medium text-muted-foreground">${vehiculo.año} · ${escapeHtml(vehiculo.categoria)}</p>
      </a>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Precio</p>
          <p class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">${formatearPrecio(vehiculo.precio)}</p>
        </div>
        <div class="flex items-center gap-3 text-right">
          <div>
            <p class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Potencia</p>
            <p class="flex items-center justify-end gap-1 text-sm font-semibold text-foreground">
              ${icon("Zap", "h-3 w-3 text-[var(--signature)]", 2.5)} ${formatearNumero(vehiculo.potencia)} HP
            </p>
          </div>
          <div class="hidden h-8 w-px bg-border sm:block"></div>
          <div class="hidden sm:block">
            <p class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">0-100</p>
            <p class="text-sm font-semibold text-foreground">${vehiculo.aceleracion0a100}s</p>
          </div>
        </div>
      </div>
      ${acciones}
    </div>
  </article>`
}

/** Wire all card buttons inside a rendered container. */
export function hydrateVehicleCards(root = document) {
  hydrateSmartImages(root)
  root.querySelectorAll("[data-vehicle]").forEach((card) => {
    if (card.dataset.wired) return
    card.dataset.wired = "1"
    const id = card.dataset.vehicle
    const nombre = card.dataset.nombre
    card.querySelector('[data-action="favorito"]')?.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      const era = tienda.esFavorito(id)
      toggleFavorito(id)
      toast({
        title: era ? "Eliminado de favoritos" : "Añadido a favoritos",
        description: era ? `${nombre} se ha quitado de tus favoritos.` : `${nombre} se ha añadido a tus favoritos.`,
      })
    })
    card.querySelector('[data-action="comparar"]')?.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      const era = tienda.estaEnComparador(id)
      if (!era && tienda.get().comparar.length >= MAX_COMPARAR) {
        toast({ title: "Comparador lleno", description: "Solo puedes comparar hasta 3 vehículos a la vez." })
        return
      }
      tienda.toggleComparar(id)
      toast({
        title: era ? "Quitado del comparador" : "Añadido al comparador",
        description: era ? `${nombre} se ha quitado del comparador.` : `${nombre} se ha añadido al comparador.`,
      })
    })
    card.querySelector('[data-action="carrito"]')?.addEventListener("click", (e) => {
      e.preventDefault()
      const ok = tienda.agregarAlCarrito(id, true)
      if (ok) toast({ title: "Añadido al carrito", description: `${nombre} se ha añadido a tu carrito.` })
    })
  })
}

/** Empty state — port of empty-state.tsx. */
export function emptyStateMarkup({ icono, titulo, descripcion, ctaLabel, ctaHref }) {
  return `
    <section class="hero-glow reveal relative mt-12 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-border/40 py-24 text-center sm:py-32">
      <div class="relative">
        <div class="absolute inset-0 -z-10 animate-pulse rounded-full bg-[var(--signature)]/10 blur-2xl"></div>
        <span class="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-card text-muted-foreground shadow-card">
          ${icon(icono, "h-9 w-9", 1.5)}
        </span>
      </div>
      <h3 class="text-display mt-7 text-2xl text-foreground sm:text-3xl">${escapeHtml(titulo)}</h3>
      <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">${escapeHtml(descripcion)}</p>
      <a href="${ctaHref}" class="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:shadow-[0_8px_30px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98]">
        ${escapeHtml(ctaLabel)} ${icon("ArrowRight", "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5")}
      </a>
    </section>`
}
