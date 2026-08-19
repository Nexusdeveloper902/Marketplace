/**
 * Marketplace page — port of marketplace-view.tsx (search + filters + sort +
 * grid) and the mobile filter sheet. Filtra en el cliente sobre el catálogo
 * completo (GET /api/vehicles?all=1), como en el original.
 */
const INICIAL = {
  marca: undefined,
  categorias: [],
  combustibles: [],
  tracciones: [],
  search: undefined,
  precioMin: undefined,
  precioMax: undefined,
  añoMin: undefined,
  añoMax: undefined,
  potenciaMin: undefined,
}

const CATEGORIAS = [
  "Sedán", "SUV", "Coupé", "Convertible", "Hatchback", "Pickup", "Superdeportivo", "Crossover", "Camioneta",
]
const COMBUSTIBLES = [
  { value: "Electric-fuel", label: "Eléctrico" },
  { value: "Hybrid-fuel", label: "Híbrido" },
  { value: "Gasolina-fuel", label: "Gasolina" },
  { value: "Diesel-fuel", label: "Diésel" },
]
const COMBUSTIBLES_SIMPLE = ["Eléctrico", "Híbrido", "Gasolina", "Diésel"]
const TRACCIONES = ["AWD", "RWD", "FWD", "4WD"]
const AÑOS_NOTABLES = [1935, 1949, 1964, 1994, 2004, 2014, 2021, 2024]
const A_BLANCO = "$${'’'}" // placeholder nunca usado

const sec = s2n => s2n

const ORDENES = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "año-desc", label: "Más nuevos" },
  { value: "potencia-desc", label: "Mayor potencia" },
]

let catalogo = []
let filtros = { ...INICIAL }
let debouncedSearch = undefined

// --- URL <-> state (mismo contrato que use-filters.ts) -----------------------
function leerDesdeUrl() {
  const sp = new URLSearchParams(window.location.search)
  const list = (key) => sp.get(key)?.split(",").filter(Boolean) ?? []
  const num = (key) => {
    const v = sp.get(key)
    return v !== null && !isNaN(Number(v)) ? Number(v) : undefined
  }
  filtros = {
    marca: sp.get("marca") ?? undefined,
    categorias: list("categorias"),
    combustibles: list("combustibles"),
    tracciones: list("tracciones"),
    search: sp.get("search") ?? undefined,
    precioMin: num("precioMin"),
    precioMax: num("precioMax"),
    añoMin: num("añoMin"),
    añoMax: num("añoMax"),
    potenciaMin: num("potenciaMin"),
  }
}

function escribirUrl(replace = true) {
  const sp = new URLSearchParams()
  if (filtros.search?.trim()) sp.set("search", filtros.search)
  if (filtros.marca) sp.set("marca", filtros.marca)
  if (filtros.categorias.length) sp.set("categorias", filtros.categorias.join(","))
  if (filtros.combustibles.length) sp.set("combustibles", filtros.combustibles.join(","))
  if (filtros.tracciones.length) sp.set("tracciones", filtros.tracciones.join(","))
  if (filtros.precioMin !== undefined) sp.set("precioMin", String(filtros.precioMin))
  if (filtros.precioMax !== undefined) sp.set("precioMax", String(filtros.precioMax))
  if (filtros.añoMin !== undefined) sp.set("añoMin", String(filtros.añoMin))
  if (filtros.añoMax !== undefined) sp.set("añoMax", String(filtros.añoMax))
  if (filtros.potenciaMin !== undefined) sp.set("potenciaMin", String(filtros.potenciaMin))
  const qs = sp.toString()
  const url = hrefFromApp("/marketplace") + (qs ? "?" + qs : "")
  history[replace ? "replaceState" : "pushState"]({}, "", url)
}

// --- Filtrado en cliente (misma lógica del original) --------------------------
function filtrar() {
  const q = (debouncedSearch ?? filtros.search)?.trim().toLowerCase()
  return catalogo.filter((v) => {
    if (q && !(v.marca.toLowerCase().includes(q) || v.modelo.toLowerCase().includes(q))) return false
    if (filtros.marca && v.marca !== filtros.marca) return false
    if (filtros.categorias.length && !filtros.categorias.includes(v.categoria)) return false
    if (filtros.combustibles.length && !filtros.combustibles.includes(v.combustible)) return false
    if (filtros.tracciones.length && !filtros.tracciones.includes(v.traccion)) return false
    if (filtros.precioMin !== undefined && v.precio < filtros.precioMin) return false
    if (filtros.precioMax !== undefined && v.precio > filtros.precioMax) return false
    if (filtros.añoMin !== undefined && v.año < filtros.añoMin) return false
    if (filtros.añoMax !== undefined && v.año > filtros.añoMax) return false
    if (filtros.potenciaMin !== undefined && v.potencia < filtros.potenciaMin) return false
    return true
  })
}

function ordenar(items) {
  const o = tienda.get().ordenamiento
  const sorted = [...items]
  switch (o) {
    case "precio-asc": return sorted.sort((a, b) => a.precio - b.precio)
    case "precio-desc": return sorted.sort((a, b) => b.precio - a.precio)
    case "año-desc": return sorted.sort((a, b) => b.año - a.año)
    case "potencia-desc": return sorted.sort((a, b) => b.potencia - a.potencia)
    case "relevancia":
    default: return sorted
  }
}

function contarActivos() {
  return (
    (filtros.marca ? 1 : 0) +
    (filtros.search?.trim() ? 1 : 0) +
    filtros.categorias.length +
    filtros.combustibles.length +
    filtros.tracciones.length +
    (filtros.precioMin !== undefined ? 1 : 0) +
    (filtros.precioMax !== undefined ? 1 : 0) +
    (filtros.añoMin !== undefined ? 1 : 0) +
    (filtros.añoMax !== undefined ? 1 : 0) +
    (filtros.potenciaMin !== undefined ? 1 : 0)
  )
}

function limpiarFiltros() {
  const mantenerMarca = filtros.marca ? [filtros.marca] : []
  filtros = { ...INICIAL, marca: filtros.marca }
  debouncedSearch = undefined
}

// --- UI -----------------------------------------------------------------------
const deslizar = () => {}
const checkboxGrupo = (label, items, seleccionados, onToggle, col3 = true) => `
  <div class="space-y-2.5">
    <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">${label}</p>
    <div class="grid ${col3 ? "grid-cols-3" : "grid-cols-2"} gap-1.5">
      ${items.map((item) => `
        <button data-fgroup="${label}" data-fvalue="${item}" class="flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors ${seleccionados.includes(item) ? "border-foreground/30 bg-secondary text-foreground" : "border-border/50 bg-card/50 text-muted-foreground hover:border-border hover:text-foreground"}">
          ${seleccionados.includes(item) ? icon("Check", "h-3 w-3") : ""}${item}
        </button>`).join("")}
    </div>
  </div>`

const slider = (label, key, min, max, step, format) => `
  <div class="space-y-2.5">
    <div class="flex items-center justify-between">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">${label}</p>
      <span class="text-[11px] font-medium text-foreground slider-value" data-slider-para="${key}">${format(filtros[key] ?? min)}</span>
    </div>
    <input type="range" min="${min}" max="${max}" step="${step}" value="${filtros[key] ?? min}" data-slider="${key}" class="w-full slider-premium" />
  </div>`

function filtrosMarkup() {
  const activos = contarActivos()
  return `
  <div class="space-y-6 px-1">
    <div>
      <p class="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Búsqueda</p>
      <div class="relative flex h-11 items-center rounded-xl border border-border/60 bg-card transition-colors focus-within:border-foreground/30">
        <span class="pl-3.5 text-muted-foreground">${icon("Search", "h-4 w-4")}</span>
        <input id="flt-search" type="text" placeholder="Marca o modelo..." value="${escapeHtml(filtros.search ?? "")}" class="h-full flex-1 bg-transparent px-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none" />
      </div>
    </div>
    <div class="space-y-2.5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Marca</p>
      <select id="flt-marca" class="w-full rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none">
        <option value="">Todas las marcas</option>
        ${marcasDisponibles.map((m) => `<option value="${escapeHtml(m)}" ${filtros.marca === m ? "selected" : ""}>${escapeHtml(m)}</option>`).join("")}
      </select>
    </div>
    ${checkboxGrupo("Categoría", CATEGORIAS, filtros.categorias)}
    ${checkboxGrupo("Combustible", COMBUSTIBLES_SIMPLE, filtros.combustibles)}
    ${checkboxGrupo("Tracción", TRACCIONES, filtros.tracciones, true)}
    ${slider("Precio mínimo", "precioMin", 0, 1000000, 1000, (v) => formatearPrecio(v))}
    ${slider("Precio máximo", "precioMax", 0, 1000000, 1000, (v) => formatearPrecio(v))}
    ${slider("Año mínimo", "añoMin", 1935, 2024, 1, (v) => String(v))}
    ${slider("Año máximo", "añoMax", 1935, 2024, 1, (v) => String(v))}
    ${slider("Potencia mínima (hp)", "potenciaMin", 0, 1500, 10, (v) => `${v} CV`)}
    <div class="flex items-center justify-between gap-3 pt-2">
      <button id="flt-limpiar" ${!activos ? "disabled" : ""} class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40">
        Limpiar filtros${activos ? ` (${activos})` : ""}
      </button>
    </div>
  </div>`
}

let marcasDisponibles = []

function renderGrid() {
  const items = ordenar(filtrar())
  const grid = document.getElementById("mp-grid")
  const resultado = document.getElementById("mp-resultado")
  if (resultado) {
    resultado.textContent = items.length === 1 ? "1 resultado" : `${items.length} resultados`
  }
  if (!grid) return
  if (items.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card py-20 text-center shadow-card">
        <span class="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">${icon("Search", "h-6 w-6")}</span>
        <p class="text-base font-semibold text-foreground">No hay ningún vehículo con esos filtros</p>
        <p class="mt-1.5 text-sm text-muted-foreground">Prueba a ampliar la búsqueda o ajustar los filtros</p>
      </div>`
    hydrateReveals(grid)
    return
  }
  grid.innerHTML = items.map((v, i) => vehicleCardMarkup(v, { etiquetaBoton: "Explorar vehículo", index: i })).join("")
  hydrateVehicleCards(grid)
  hydrateReveals(grid)
}

function renderFiltrosPanel() {
  document.querySelectorAll(".mp-filtros").forEach((panel) => {
    panel.innerHTML = filtrosMarkup()
    wireFiltrosPanel(panel)
  })
}

function wireFiltrosPanel(panel) {
  // Búsqueda (debounce 300ms como el original)
  let timer
  panel.querySelector("#flt-search")?.addEventListener("input", (e) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedSearch = e.target.value
      filtros.search = e.target.value
      escribirUrl()
      renderGrid()
      renderOpcionesSelect()
    }, 300)
  })
  panel.querySelector("#flt-marca")?.addEventListener("change", (e) => {
    filtros.marca = e.target.value || undefined
    escribirUrl()
    renderFiltrosPanel()
    renderGrid()
  })
  panel.querySelectorAll("[data-fgroup]").forEach((btn) => btn.addEventListener("click", () => {
    const grupo = btn.dataset.fgroup
    const key = grupo === "Categoría" ? "categorias" : grupo === "Combustible" ? "combustibles" : "tracciones"
    const v = btn.dataset.fvalue
    filtros[key] = filtros[key].includes(v) ? filtros[key].filter((x) => x !== v) : [...filtros[key], v]
    escribirUrl()
    renderFiltrosPanel()
    renderGrid()
  }))
  panel.querySelectorAll("[data-slider]").forEach((input) => input.addEventListener("change", () => {
    const key = input.dataset.slider
    const val = Number(input.value)
    const min = Number(input.min)
    filtros[key] = val > min ? val : undefined
    escribirUrl()
    renderFiltrosPanel()
    renderGrid()
  }))
  panel.querySelectorAll("[data-slider]").forEach((input) => input.addEventListener("input", () => {
    const span = panel.querySelector(`[data-slider-para="${input.dataset.slider}"]`)
    if (span) {
      const k = input.dataset.slider
      span.textContent = k === "precioMin" || k === "precioMax" ? formatearPrecio(Number(input.value)) : k === "potenciaMin" ? `${input.value} CV` : input.value
    }
  }))
  panel.querySelector("#flt-limpiar")?.addEventListener("click", () => {
    limpiarFiltros()
    escribirUrl(false)
    document.getElementById("mp-search").value = ""
    renderFiltrosPanel()
    renderGrid()
  })
}

function renderOpcionesSelect() {}

// --- Layout principal -----------------------------------------------------------
async function iniciar() {
  renderShell({ cta: false })
  const main = document.getElementById("main")
  main.innerHTML = `
    <section class="mx-auto max-w-[1600px] px-4 py-10 pb-24 sm:px-6 lg:px-8 lg:py-14">
      <div class="reveal is-visible max-w-3xl">
        <p class="text-eyebrow text-[11px] text-[var(--signature)]">La colección completa</p>
        <h1 class="text-display mt-5 text-4xl text-foreground sm:text-5xl">Marketplace</h1>
        <p class="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground" id="mp-hero-desc">
          Explora el catálogo completo. Filtra por marca, categoría o rendimiento y ordena como prefieras.
        </p>
      </div>
      <!-- Barra superior -->
      <div class="reveal is-visible mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style="--reveal-delay: 0.05s">
        <div class="relative flex h-12 flex-1 items-center rounded-2xl border border-border/60 bg-card transition-colors focus-within:border-foreground/30 sm:max-w-md">
          <span class="pl-4 text-muted-foreground">${icon("Search", "h-4 w-4")}</span>
          <input id="mp-search" type="text" placeholder="Busca por marca o modelo" value="${escapeHtml(filtros.search ?? "")}" class="h-full flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none" />
          <button class="mr-4 hidden text-muted-foreground transition-colors hover:text-foreground" id="mp-search-clear">${icon("X", "h-3.5 w-3.5")}</button>
        </div>
        <div class="flex items-center justify-between gap-3 sm:flex-1 sm:justify-end">
          <select id="mp-orden" class="h-12 min-w-[180px] rounded-2xl border border-border/60 bg-card px-4 text-sm text-foreground focus:outline-none">
            ${ORDENES.map((o) => `<option value="${o.value}" ${tienda.get().ordenamiento === o.value ? "selected" : ""}>${o.label}</option>`).join("")}
          </select>
          <button id="mp-filtros-btn" class="flex h-12 items-center gap-2 rounded-2xl border border-border/60 bg-card px-4 text-sm text-foreground transition-colors hover:border-border lg:hidden">
            ${icon("SlidersHorizontal", "h-4 w-4")}Filtros
            ${icon("ChevronDown", "h-3.5 w-3.5 text-muted-foreground")}
          </button>
        </div>
      </div>
      <div class="mt-8 lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 xl:gap-14">
        <aside class="hidden lg:block">
          <div class="sticky top-20 rounded-2xl border border-border/50 bg-card p-5 shadow-card">
            <div class="mp-filtros"></div>
          </div>
        </aside>
        <div id="mp-sheet" class="lg:hidden"></div>
        <div>
          <p class="text-sm font-medium text-muted-foreground mb-5" id="mp-resultado"></p>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8" id="mp-grid"></div>
        </div>
      </div>
    </section>`

  // Catálogo
  const { items } = await api.catalogo()
  catalogo = items
  marcasDisponibles = [...new Set(items.map((v) => v.marca))].sort()
  leerDesdeUrl()

  renderFiltrosPanel()
  renderGrid()

  // Búsqueda superior (misma fuente que el filtro)
  const mpSearch = document.getElementById("mp-search")
  let timer
  mpSearch.addEventListener("input", (e) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedSearch = e.target.value
      filtros.search = e.target.value
      escribirUrl()
      const clearBtn = document.getElementById("mp-search-clear")
      clearBtn.classList.toggle("hidden", !e.target.value)
      renderGrid()
      renderFiltrosPanel()
    }, 300)
  })
  document.getElementById("mp-search-clear").addEventListener("click", () => {
    mpSearch.value = ""
    debouncedSearch = undefined
    filtros.search = undefined
    escribirUrl()
    renderFiltrosPanel()
    renderGrid()
  })

  // Ordenamiento (persistido en el store como el original)
  document.getElementById("mp-orden").addEventListener("change", (e) => {
    tienda.setOrdenamiento(e.target.value)
    renderGrid()
  })
  tienda.subscribe(() => {
    document.getElementById("mp-orden").value = tienda.get().ordenamiento
    renderGrid()
  })

  // Mobile "sheet" con filtros
  let sheetAbierto = false
  document.getElementById("mp-filtros-btn").addEventListener("click", () => {
    const sheet = document.getElementById("mp-sheet")
    sheetAbierto = !sheetAbierto
    if (!sheetAbierto) {
      sheet.innerHTML = ""
      return
    }
    sheet.innerHTML = `
      <div class="overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-card anim-pop-in">
        <div class="mp-filtros"></div>
      </div>`
    renderFiltrosPanel()
  })

  // Redibujar cuando cambia el store (p.ej. ordenamiento desde otra vista)
  window.addEventListener("popstate", () => {
    leerDesdeUrl()
    renderFiltrosPanel()
    renderGrid()
  })
}

iniciar()
