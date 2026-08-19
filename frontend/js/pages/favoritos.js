/**
 * Favorites page — port of favorites-view.tsx. Muestra las tarjetas guardadas
 * en favoritos (sincronizadas con la cuenta si hay sesión).
 */







function renderFavoritos(catalogo) {
  const grid = document.getElementById("fav-grid")
  const count = document.getElementById("fav-count")
  const favoritos = tienda.get().favoritos
    .map((slug) => catalogo.find((v) => v.id === slug))
    .filter(Boolean)
  count.textContent = favoritos.length
    ? `Tienes ${favoritos.length} vehículo${favoritos.length !== 1 ? "s" : ""} guardado${favoritos.length !== 1 ? "s" : ""} en favoritos.`
    : "Aún no has guardado vehículos en favoritos."
  if (!favoritos.length) {
    grid.innerHTML = emptyStateMarkup({
      icono: "Heart",
      titulo: "Aún no tienes favoritos",
      descripcion: "Explora el catálogo y guarda los modelos que más te gustan para revisarlos aquí.",
      ctaLabel: "Explorar vehículos",
      ctaHref: "/marketplace",
    })
    hydrateReveals(grid)
    return
  }
  grid.innerHTML = `
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
      ${favoritos.map((v, i) => vehicleCardMarkup(v, { etiquetaBoton: "Explorar vehículo", index: i })).join("")}
    </div>`
  hydrateVehicleCards(grid)
  hydrateReveals(grid)
}

async function iniciar() {
  renderShell()
  const main = document.getElementById("main")
  main.innerHTML = `
  <section class="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8 lg:py-14">
    <div class="max-w-3xl">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Tu colección</p>
      <h1 class="text-display mt-5 text-4xl text-foreground sm:text-5xl">Favoritos</h1>
      <p class="mt-5 text-sm leading-relaxed text-muted-foreground" id="fav-count"></p>
    </div>
    <div class="mt-10" id="fav-grid"></div>
  </section>`
  const { items } = await api.catalogo()
  renderFavoritos(items)
  tienda.subscribe(() => renderFavoritos(items))
}

iniciar()
