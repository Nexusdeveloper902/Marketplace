/**
 * Profile page — port of src/app/perfil/page.tsx. KPI cards, cuenta info,
 * pedidos recientes y vehículos comprados.
 */
import { renderShell } from "../layout.js"
import { auth } from "../auth.js"
import { api } from "../api.js"
import { tienda } from "../store.js"
import { icon } from "../icons.js"
import { formatearPrecio } from "../format.js"
import { escapeHtml, hydrateReveals, smartImageMarkup, hydrateSmartImages } from "../ui.js"

const STATUS_LABELS = {
  PENDING: "Pendiente",
  PROCESSING: "En proceso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

function kpiCard(icono, label, value) {
  return `
  <div class="reveal rounded-2xl border border-border/50 bg-card p-5 shadow-card">
    ${icon(icono, "h-5 w-5 text-[var(--signature)]", 2)}
    <p class="mt-3 text-2xl font-semibold tracking-tight text-foreground">${escapeHtml(value)}</p>
    <p class="mt-0.5 text-xs text-muted-foreground">${escapeHtml(label)}</p>
  </div>`
}

function dato(icono, label, value) {
  return `
  <div class="flex items-start gap-3">
    ${icon(icono, "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground", 2)}
    <div class="min-w-0">
      <dt class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">${escapeHtml(label)}</dt>
      <dd class="mt-0.5 truncate text-sm font-medium text-foreground">${escapeHtml(value)}</dd>
    </div>
  </div>`
}

async function iniciar() {
  renderShell()
  await auth.refresh()
  if (!auth.isAuthenticated) {
    window.location.href = `/login?redirect=${encodeURIComponent("/perfil")}`
    return
  }
  const user = auth.user
  const [{ orders }, { items: vehicles }] = await Promise.all([
    api.pedidos(),
    api.catalogo(),
  ])

  const completados = orders.filter((o) => o.status === "COMPLETED")
  const compradosSlugs = new Set(
    completados.flatMap((o) => o.items.map((i) => i.vehicle.id)),
  )
  const comprados = vehicles.filter((v) => compradosSlugs.has(v.id))
  const totalGastado = completados.reduce((s, o) => s + o.total, 0)
  const favoritosCount = tienda.get().favoritos.length

  const main = document.getElementById("main")
  main.innerHTML = `
  <div class="mx-auto max-w-5xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8">
    <div class="reveal border-b border-border/40 pb-10">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Mi cuenta</p>
      <div class="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold uppercase text-primary-foreground shadow-lg">
            ${escapeHtml((user.name ?? user.email).charAt(0))}
          </span>
          <div>
            <h1 class="text-display text-3xl text-foreground sm:text-4xl">${escapeHtml(user.name ?? "Cliente")}</h1>
            <p class="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              ${icon("Mail", "h-3.5 w-3.5")} ${escapeHtml(user.email)}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          ${user.role === "ADMIN" ? `
            <a href="/admin" class="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              ${icon("Shield", "h-4 w-4")} Panel admin
            </a>` : ""}
          <button id="perfil-logout" class="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            ${icon("LogOut", "h-4 w-4")} Cerrar sesión
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      ${kpiCard("Receipt", "Pedidos", String(orders.length))}
      ${kpiCard("CarFront", "Vehículos comprados", String(comprados.length))}
      ${kpiCard("Heart", "Favoritos", String(favoritosCount))}
      ${kpiCard("CalendarDays", "Total invertido", formatearPrecio(totalGastado))}
    </div>

    <div class="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <section class="reveal rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7">
        <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Cuenta</h2>
        <p class="mt-2 text-lg font-semibold tracking-tight text-foreground">Información</p>
        <dl class="mt-5 space-y-4">
          ${dato("User", "Nombre", user.name ?? "—")}
          ${dato("Mail", "Correo", user.email)}
          ${dato("CalendarDays", "Miembro desde", formatDate(user.createdAt))}
        </dl>
      </section>

      <section class="reveal rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:col-span-2 lg:p-7">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Historial</h2>
            <p class="mt-2 text-lg font-semibold tracking-tight text-foreground">Pedidos recientes</p>
          </div>
          <a href="/pedidos" class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Ver todos ${icon("ArrowRight", "h-3.5 w-3.5")}
          </a>
        </div>
        ${!orders.length ? `
          <div class="flex flex-col items-center justify-center py-12 text-center">
            ${icon("Package", "h-10 w-10 text-muted-foreground/40", 1.5)}
            <p class="mt-4 text-sm text-muted-foreground">Aún no tienes pedidos.</p>
            <a href="/marketplace" class="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              Explorar marketplace ${icon("ArrowRight", "h-4 w-4")}
            </a>
          </div>` : `
          <ul class="mt-5 divide-y divide-border/40">
            ${orders.slice(0, 5).map((o) => `
            <li class="flex items-center justify-between py-4">
              <div class="min-w-0">
                <p class="font-mono text-xs text-muted-foreground">${escapeHtml(o.number)}</p>
                <p class="mt-0.5 truncate text-sm font-medium text-foreground">
                  ${escapeHtml(o.items.map((i) => `${i.vehicle.marca} ${i.vehicle.modelo}`).join(", ") || "—")}
                </p>
                <p class="mt-0.5 text-xs text-muted-foreground">${formatDate(o.createdAt)}</p>
              </div>
              <div class="ml-4 flex flex-col items-end gap-1">
                <span class="text-sm font-semibold text-foreground">${formatearPrecio(o.total)}</span>
                <span class="text-[10px] font-medium text-muted-foreground">${escapeHtml(STATUS_LABELS[o.status] ?? o.status)}</span>
              </div>
            </li>`).join("")}
          </ul>`}
      </section>
    </div>

    ${comprados.length ? `
    <section class="reveal mt-8 rounded-2xl border border-border/50 bg-card p-6 shadow-card lg:p-7">
      <h2 class="text-eyebrow text-[11px] text-[var(--signature)]">Garaje</h2>
      <p class="mt-2 text-lg font-semibold tracking-tight text-foreground">Vehículos adquiridos</p>
      <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        ${comprados.map((v) => {
          const order = completados.find((o) =>
            o.items.some((i) => i.vehicle.id === v.id),
          )
          return `
          <a href="/vehiculos/${escapeHtml(v.id)}" class="group overflow-hidden rounded-xl border border-border/50 transition-colors hover:border-border">
            <div class="relative aspect-[16/9]">
              ${smartImageMarkup({ src: v.imagenes?.[0] ?? "", alt: `${v.marca} ${v.modelo}`, hoverScale: 1.05 })}
            </div>
            <div class="p-3">
              <p class="text-[10px] uppercase tracking-wider text-muted-foreground">${escapeHtml(v.marca)}</p>
              <p class="truncate text-sm font-semibold text-foreground">${escapeHtml(v.modelo)}</p>
              ${order ? `<p class="mt-1 font-mono text-[10px] text-muted-foreground">${escapeHtml(order.number)}</p>` : ""}
            </div>
          </a>`
        }).join("")}
      </div>
    </section>` : ""}
  </div>`
  hydrateSmartImages(main)
  main.querySelector("#perfil-logout").addEventListener("click", async () => {
    await auth.logout()
    window.location.href = "/"
  })
  hydrateReveals(main)
}

iniciar()
