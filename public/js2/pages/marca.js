/**
 * Brand detail page — port of brand-detail-view.tsx. Header with the brand
 * name + aggregate price range, then the grid of its vehicles.
 */
import { renderShell } from "../layout.js"
import { api } from "../api.js"
import { formatearPrecio } from "../format.js"
import { hydrateReveals } from "../ui.js"
import { vehicleCardMarkup, hydrateVehicleCards } from "../vehicle-card.js"

async function iniciar() {
  const slug = window.location.pathname.split("/marcas/")[1]
  renderShell()
  const main = document.getElementById("main")

  let data
  try {
    data = await api.obtenerMarca(slug)
  } catch {
    window.location.href = "/marcas"
    return
  }
  const { brand, vehicles, cantidad } = data
  document.title = `${brand.name} · Digital Marketplace`

  const precios = vehicles.map((v) => v.precio)
  const min = precios.length ? Math.min(...precios) : 0
  const max = precios.length ? Math.max(...precios) : 0

  main.innerHTML = `
  <section class="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8 lg:py-14">
    <div class="reveal is-visible max-w-3xl">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Marca</p>
      <h1 class="text-display mt-5 text-4xl text-foreground sm:text-5xl">${brand.name}</h1>
      <p class="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">${brand.description}</p>
      <p class="mt-4 text-sm font-medium text-foreground">
        ${cantidad} modelo${cantidad !== 1 ? "s" : ""} disponibles ${cantidad ? `· desde ${formatearPrecio(min)} hasta ${formatearPrecio(max)}` : ""}
      </p>
    </div>
    ${vehicles.length === 0 ? `
      <p class="mt-12 rounded-2xl border border-border/50 bg-card py-16 text-center text-sm text-muted-foreground">Esta marca no tiene vehículos disponibles.</p>` : `
      <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        ${vehicles.map((v, i) => vehicleCardMarkup(v, { etiquetaBoton: "Explorar vehículo", index: i })).join("")}
      </div>`}
  </section>`

  hydrateVehicleCards(main)
  hydrateReveals(main)
}

iniciar()
