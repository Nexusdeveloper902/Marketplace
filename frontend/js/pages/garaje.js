/**
 * Garage page — port of garage-view.tsx. Vehículos comprados (del store,
 * sincronizado con pedidos completados si hay sesión).
 */







function renderGaraje(catalogo) {
  const placeholder = document.getElementById("garaje-ph")
  const wrap = document.getElementById("garaje-content")
  const comprados = tienda.get().garaje
    .map((slug) => catalogo.find((v) => v.id === slug))
    .filter(Boolean)

  if (!comprados.length) {
    placeholder.innerHTML = emptyStateMarkup({
      icono: "CarFront",
      titulo: "Tu garaje está vacío",
      descripcion: "Cuando compres un vehículo aparecerá aquí como recuerdo de tu evolución automotriz.",
      ctaLabel: "Ir al marketplace",
      ctaHref: "/marketplace",
    })
    wrap.innerHTML = ""
    hydrateReveals(placeholder)
    return
  }

  placeholder.innerHTML = ""
  wrap.innerHTML = `
  <div class="reveal rounded-2xl border border-border/50 bg-card p-6 shadow-card sm:p-8">
    <p class="text-eyebrow text-[11px] text-[var(--signature)]">Garaje privado</p>
    <h2 class="text-display mt-2 text-2xl text-foreground">${comprados.length} vehículo${comprados.length !== 1 ? "s" : ""} adquirido${comprados.length !== 1 ? "s" : ""}</h2>
    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
      ${comprados.map((v, i) => vehicleCardMarkup(v, { etiquetaBoton: "Ver ficha completa", index: i })).join("")}
    </div>
  </div>`
  hydrateVehicleCards(wrap)
  hydrateReveals(wrap)
}

async function iniciar() {
  renderShell()
  const main = document.getElementById("main")
  main.innerHTML = `
  <section class="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8 lg:py-14">
    <div class="max-w-3xl">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Colección personal</p>
      <h1 class="text-display mt-5 text-4xl text-foreground sm:text-5xl">Mi Garaje</h1>
      <p class="mt-5 text-sm leading-relaxed text-muted-foreground">Vehículos adquiridos, estado y detalles de tus pedidos.</p>
    </div>
    <div class="mt-10" id="garaje-ph"></div>
    <div class="mt-10" id="garaje-content"></div>
  </section>`
  const { items } = await api.catalogo()
  renderGaraje(items)
  tienda.subscribe(() => renderGaraje(items))
}

iniciar()
