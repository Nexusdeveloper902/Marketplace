/**
 * Orders page — port of orders-view.tsx. Lista los pedidos del usuario con
 * número, estado, fecha y artículos. Solo accesible con sesión.
 */
import { renderShell } from "../layout.js"
import { api } from "../api.js"
import { auth } from "../auth.js"
import { icon } from "../icons.js"
import { formatearPrecio, formatFecha } from "../format.js"
import { escapeHtml, hydrateReveals } from "../ui.js"
import { emptyStateMarkup } from "../vehicle-card.js"

function renderPedidos(orders) {
  const wrap = document.getElementById("pedidos-content")
  if (!orders.length) {
    wrap.innerHTML = emptyStateMarkup({
      icono: "Receipt",
      titulo: "No tienes pedidos todavía",
      descripcion: "Cuando completes una compra, verás aquí el historial y los detalles de tu pedido.",
      ctaLabel: "Explorar vehículos",
      ctaHref: "/marketplace",
    })
    return
  }
  wrap.innerHTML = `
  <div class="space-y-4">
    ${orders.map((o) => `
      <article class="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-foreground">${escapeHtml(o.number)}</p>
            <p class="mt-0.5 text-xs text-muted-foreground">${formatFecha(o.createdAt)}</p>
          </div>
          <span class="rounded-full border px-3 py-1 text-xs font-semibold ${o.status === "COMPLETED" ? "border-[var(--success)]/60 bg-[var(--success)]/15 text-[var(--success)]" : o.status === "CANCELLED" ? "border-[var(--destructive)]/60 bg-[var(--destructive)]/15 text-[var(--destructive)]" : "border-border/70 bg-secondary text-muted-foreground"}">${escapeHtml(o.statusLabel)}</span>
        </div>
        <ul class="mt-4 space-y-3">
          ${o.items.map((it) => `
            <li class="flex items-center gap-4">
              <a href="/vehiculos/${it.vehicle.id}" class="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                <img src="${escapeHtml(it.vehicle.imagenes[0] ?? "")}" alt="" class="h-full w-full object-cover" />
              </a>
              <div class="min-w-0 flex-1">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">${escapeHtml(it.vehicle.marca)}</p>
                <a href="/vehiculos/${it.vehicle.id}" class="block truncate text-sm font-semibold text-foreground hover:underline">${escapeHtml(it.vehicle.modelo)}</a>
                <p class="text-xs text-muted-foreground">${it.vehicle.año}</p>
              </div>
              <p class="text-sm font-semibold text-foreground">${formatearPrecio(it.priceAtPurchase)}</p>
            </li>`).join("")}
        </ul>
        <div class="mt-4 border-t border-border/40 pt-4 text-right">
          <p class="text-sm text-muted-foreground">Total</p>
          <p class="text-xl font-semibold text-foreground">${formatearPrecio(o.total)}</p>
        </div>
      </article>`).join("")}
  </div>`
}

async function iniciar() {
  renderShell()
  const main = document.getElementById("main")
  await auth.refresh()
  if (!auth.isAuthenticated) {
    window.location.href = `/login?redirect=${encodeURIComponent("/pedidos")}`
    return
  }
  const { orders } = await api.pedidos()
  main.innerHTML = `
  <section class="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8 lg:py-14">
    <div class="max-w-3xl">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Historial de compras</p>
      <h1 class="text-display mt-5 text-4xl text-foreground sm:text-5xl">Mis pedidos</h1>
      <p class="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">Aquí verás el estado y los detalles de cada pedido que realices.</p>
    </div>
    <div class="mt-10" id="pedidos-content"></div>
  </section>`
  renderPedidos(orders)
  hydrateReveals(main)
}

iniciar()
