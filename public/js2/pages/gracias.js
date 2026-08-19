/**
 * Thank-you page — port of thanks-view.tsx. Vacía el carrito, muestra el
 * detalle del pedido reciente y CTA al garaje/marketplace.
 */
import { renderShell } from "../layout.js"
import { api } from "../api.js"
import { tienda } from "../store.js"
import { auth } from "../auth.js"
import { icon } from "../icons.js"
import { formatearPrecio, formatFecha } from "../format.js"
import { escapeHtml, hydrateReveals } from "../ui.js"

async function iniciar() {
  renderShell({ cta: false })
  const orderId = new URLSearchParams(window.location.search).get("order")
  await auth.refresh()

  let order = null
  if (auth.isAuthenticated && orderId) {
    try {
      const res = await api.pedido(orderId)
      order = res.order
    } catch {
      order = null
    }
  }
  // Vaciar carrito aun sin sesión (el garaje se sincronizó en checkout)
  tienda.finalizarCompra()

  const main = document.getElementById("main")
  main.innerHTML = `
  <section class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
    <div class="reveal is-visible text-center">
      <span class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)]">
        ${icon("CheckCircle2", "h-8 w-8", 2)}
      </span>
      <h1 class="text-display mt-6 text-4xl text-foreground sm:text-5xl">¡Gracias por tu compra!</h1>
      <p class="mt-3 text-muted-foreground">Tu pedido se ha completado correctamente. Disfruta de tu nuevo vehículo en tu garaje privado.</p>
      ${order ? `
        <div class="mt-10 rounded-2xl border border-border/50 bg-card p-6 text-left shadow-card">
          <p class="text-eyebrow text-[10px] text-[var(--signature)]">Detalle del pedido</p>
          <p class="mt-2 flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Número</span>
            <span class="font-semibold text-foreground">${escapeHtml(order.number)}</span>
          </p>
          <p class="mt-1.5 flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Estado</span>
            <span class="font-semibold text-[var(--success)]">${escapeHtml(order.statusLabel)}</span>
          </p>
          <p class="mt-1.5 flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Fecha</span>
            <span class="font-semibold text-foreground">${formatFecha(order.createdAt)}</span>
          </p>
          <ul class="mt-4 space-y-2">
            ${order.items.map((it) => `
              <li class="flex items-center justify-between text-sm">
                <span class="text-foreground">${escapeHtml(it.vehicle.marca)} ${escapeHtml(it.vehicle.modelo)}</span>
                <span class="font-semibold text-foreground">${formatearPrecio(it.priceAtPurchase)}</span>
              </li>`).join("")}
          </ul>
          <div class="mt-4 border-t border-border/40 pt-4">
            <p class="flex items-center justify-between text-base">
              <span class="font-semibold text-foreground">Total</span>
              <span class="font-semibold text-foreground">${formatearPrecio(order.total)}</span>
            </p>
          </div>
        </div>` : ""}
      <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href="/garaje" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto">
          Ver mi garaje ${icon("ArrowRight", "h-4 w-4")}
        </a>
        <a href="/marketplace" class="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto">
          Seguir explorando
        </a>
      </div>
    </div>
  </section>`
  hydrateReveals(main)
}

iniciar()
