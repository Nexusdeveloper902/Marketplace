/**
 * Cart page — port of cart-view.tsx. Lista los vehículos del carrito con
 * eliminar individual, finalizar compra (checkout modal) y resumen + métodos
 * de pago simulados.
 */
import { renderShell } from "../layout.js"
import { api } from "../api.js"
import { tienda } from "../store.js"
import { icon } from "../icons.js"
import { formatearPrecio } from "../format.js"
import { escapeHtml, hydrateReveals } from "../ui.js"
import { emptyStateMarkup } from "../vehicle-card.js"
import { openCheckoutModal } from "../checkout-modal.js"

function renderCarrito(catalogo) {
  const items = tienda.get().carrito
    .map((slug) => catalogo.find((v) => v.id === slug))
    .filter(Boolean)
  const placeholder = document.getElementById("carrito-ph")
  const itemsWrap = document.getElementById("carrito-items")
  const confirmWrap = document.getElementById("carrito-confirm")
  const countEl = document.getElementById("carrito-count")

  if (!items.length) {
    placeholder.innerHTML = emptyStateMarkup({
      icono: "ShoppingCart",
      titulo: "Tu carrito está vacío",
      descripcion: "Explora el catálogo y añade los vehículos que más te gusten.",
      ctaLabel: "Explorar vehículos",
      ctaHref: "/marketplace",
    })
    itemsWrap.innerHTML = ""
    confirmWrap.innerHTML = ""
    countEl.textContent = ""
    hydrateReveals(placeholder)
    return
  }

  placeholder.innerHTML = ""
  const total = items.reduce((s, v) => s + v.precio, 0)
  countEl.textContent = `${items.length} vehículo${items.length !== 1 ? "s" : ""} en el carrito.`

  itemsWrap.innerHTML = `
    <ul class="max-h-[calc(100vh-220px)] space-y-3 overflow-y-auto scrollbar-premium pr-1">
      ${items.map((v) => `
        <li class="anim-fade-in flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-card" data-slug="${escapeHtml(v.id)}">
          <a href="/vehiculos/${v.id}" class="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
            <img src="${escapeHtml(v.imagenes[0] ?? "")}" alt="" class="h-full w-full object-cover" />
          </a>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">${escapeHtml(v.marca)}</p>
            <a href="/vehiculos/${v.id}" class="block truncate text-sm font-semibold text-foreground hover:underline">${escapeHtml(v.modelo)}</a>
            <p class="mt-0.5 text-xs text-muted-foreground">${v.año} · ${escapeHtml(v.categoria)}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-foreground">${formatearPrecio(v.precio)}</p>
            <button class="carrito-quitar mt-1 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Quitar del carrito">
              ${icon("Trash2", "h-4 w-4", 2)}
            </button>
          </div>
        </li>`).join("")}
    </ul>`
  itemsWrap.querySelectorAll(".carrito-quitar").forEach((b) =>
    b.addEventListener("click", () => {
      const slug = b.closest("[data-slug]").dataset.slug
      tienda.quitarDelCarrito(slug)
    })
  )

  confirmWrap.innerHTML = `
    <div class="anim-fade-in mt-6 max-w-xl">
      <div class="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
        <p class="text-eyebrow text-[10px] text-[var(--signature)]">Checkout</p>
        <div class="mt-4 flex items-baseline justify-between">
          <p class="text-sm text-muted-foreground">${items.length} vehículo${items.length !== 1 ? "s" : ""} · por unidad</p>
          <p class="text-2xl font-semibold text-foreground">${formatearPrecio(total)}</p>
        </div>
        <button id="carrito-finalizar" class="mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.99]">
          Finalizar compra
        </button>
        <p class="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          ${icon("CreditCard", "h-3.5 w-3.5")}${icon("Wallet", "h-3.5 w-3.5")}${icon("Lock", "h-3.5 w-3.5")}
          Pago simulado · Sin cargo real
        </p>
      </div>
    </div>`
  confirmWrap.querySelector("#carrito-finalizar")?.addEventListener("click", () => {
    openCheckoutModal(items)
  })
}

async function iniciar() {
  renderShell()
  const main = document.getElementById("main")
  main.innerHTML = `
  <section class="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8 lg:py-14">
    <div class="max-w-3xl">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Revisa tu compra</p>
      <h1 class="text-display mt-5 text-4xl text-foreground sm:text-5xl">Carrito</h1>
      <p class="mt-5 text-sm leading-relaxed text-muted-foreground" id="carrito-count"></p>
    </div>
    <div class="mt-10" id="carrito-ph"></div>
    <div class="mt-12" id="carrito-items"></div>
    <div id="carrito-confirm"></div>
  </section>`
  const { items } = await api.catalogo()
  renderCarrito(items)
  tienda.subscribe(() => renderCarrito(items))
}

iniciar()
