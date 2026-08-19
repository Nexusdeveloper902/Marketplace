/**
 * Client-side store — port of the Zustand stores (src/store/use-store.ts and
 * src/store/use-tema.ts) using localStorage + a tiny pub/sub.
 * Persistent marketplace data lives in SQLite; this store only holds
 * cart/compare/recents/sort + guest favorites + theme preference.
 */
export const MAX_COMPARAR = 3
const MAX_RECIENTES = 8
const STORE_KEY = "digital-marketplace-tienda"
const THEME_KEY = "digital-marketplace-tema"

// --- Temas (mismos 6 temas del original) ------------------------------------
export const temas = [
  {
    id: "midnight", nombre: "Midnight", descripcion: "Noche profunda con acento champán", muestra: "#d4a857",
    variables: {
      "--background": "oklch(0.12 0.004 75)", "--foreground": "oklch(0.98 0.002 75)",
      "--card": "oklch(0.165 0.005 75)", "--popover": "oklch(0.17 0.005 75)",
      "--primary": "oklch(0.98 0.002 75)", "--primary-foreground": "oklch(0.12 0.004 75)",
      "--secondary": "oklch(0.215 0.005 75)", "--muted": "oklch(0.2 0.005 75)",
      "--muted-foreground": "oklch(0.64 0.012 75)", "--accent": "oklch(0.245 0.006 75)",
      "--border": "oklch(1 0 0 / 8%)", "--input": "oklch(1 0 0 / 12%)",
      "--ring": "oklch(0.98 0 0 / 35%)", "--signature": "oklch(0.85 0.09 80)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
  {
    id: "arctic", nombre: "Arctic", descripcion: "Azul hielo con luz de glaciar", muestra: "#60a5fa",
    variables: {
      "--background": "oklch(0.13 0.006 240)", "--foreground": "oklch(0.98 0.003 240)",
      "--card": "oklch(0.17 0.008 240)", "--popover": "oklch(0.18 0.008 240)",
      "--primary": "oklch(0.97 0.01 240)", "--primary-foreground": "oklch(0.13 0.006 240)",
      "--secondary": "oklch(0.22 0.008 240)", "--muted": "oklch(0.2 0.008 240)",
      "--muted-foreground": "oklch(0.66 0.015 240)", "--accent": "oklch(0.25 0.01 240)",
      "--border": "oklch(1 0 0 / 8%)", "--input": "oklch(1 0 0 / 12%)",
      "--ring": "oklch(0.7 0.12 240 / 40%)", "--signature": "oklch(0.72 0.12 220)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
  {
    id: "emerald", nombre: "Emerald", descripcion: "Verde esmeralda sofisticado", muestra: "#34d399",
    variables: {
      "--background": "oklch(0.12 0.006 160)", "--foreground": "oklch(0.98 0.003 160)",
      "--card": "oklch(0.165 0.008 160)", "--popover": "oklch(0.17 0.008 160)",
      "--primary": "oklch(0.97 0.01 160)", "--primary-foreground": "oklch(0.12 0.006 160)",
      "--secondary": "oklch(0.215 0.008 160)", "--muted": "oklch(0.2 0.008 160)",
      "--muted-foreground": "oklch(0.65 0.015 160)", "--accent": "oklch(0.245 0.01 160)",
      "--border": "oklch(1 0 0 / 8%)", "--input": "oklch(1 0 0 / 12%)",
      "--ring": "oklch(0.72 0.16 155 / 40%)", "--signature": "oklch(0.75 0.15 155)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
  {
    id: "crimson", nombre: "Crimson", descripcion: "Rojo intenso pasional y audaz", muestra: "#ef4444",
    variables: {
      "--background": "oklch(0.13 0.008 25)", "--foreground": "oklch(0.98 0.003 25)",
      "--card": "oklch(0.17 0.01 25)", "--popover": "oklch(0.18 0.01 25)",
      "--primary": "oklch(0.97 0.01 25)", "--primary-foreground": "oklch(0.13 0.008 25)",
      "--secondary": "oklch(0.22 0.01 25)", "--muted": "oklch(0.2 0.01 25)",
      "--muted-foreground": "oklch(0.66 0.018 25)", "--accent": "oklch(0.25 0.012 25)",
      "--border": "oklch(1 0 0 / 8%)", "--input": "oklch(1 0 0 / 12%)",
      "--ring": "oklch(0.62 0.22 25 / 40%)", "--signature": "oklch(0.65 0.22 25)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
  {
    id: "royal", nombre: "Royal", descripcion: "Púrpura regio y elegante", muestra: "#a78bfa",
    variables: {
      "--background": "oklch(0.13 0.008 290)", "--foreground": "oklch(0.98 0.003 290)",
      "--card": "oklch(0.17 0.01 290)", "--popover": "oklch(0.18 0.01 290)",
      "--primary": "oklch(0.97 0.01 290)", "--primary-foreground": "oklch(0.13 0.008 290)",
      "--secondary": "oklch(0.22 0.01 290)", "--muted": "oklch(0.2 0.01 290)",
      "--muted-foreground": "oklch(0.66 0.018 290)", "--accent": "oklch(0.25 0.012 290)",
      "--border": "oklch(1 0 0 / 8%)", "--input": "oklch(1 0 0 / 12%)",
      "--ring": "oklch(0.6 0.2 290 / 40%)", "--signature": "oklch(0.68 0.18 290)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
  {
    id: "carbon", nombre: "Carbon", descripcion: "Grafito neutro industrial", muestra: "#94a3b8",
    variables: {
      "--background": "oklch(0.11 0.002 250)", "--foreground": "oklch(0.96 0.002 250)",
      "--card": "oklch(0.155 0.003 250)", "--popover": "oklch(0.165 0.003 250)",
      "--primary": "oklch(0.96 0.002 250)", "--primary-foreground": "oklch(0.11 0.002 250)",
      "--secondary": "oklch(0.205 0.003 250)", "--muted": "oklch(0.19 0.003 250)",
      "--muted-foreground": "oklch(0.6 0.005 250)", "--accent": "oklch(0.235 0.004 250)",
      "--border": "oklch(1 0 0 / 7%)", "--input": "oklch(1 0 0 / 11%)",
      "--ring": "oklch(0.96 0 0 / 30%)", "--signature": "oklch(0.7 0.015 250)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
]

// --- Estado + pub/sub --------------------------------------------------------
const listeners = new Set()
let state = {
  carrito: [],
  garaje: [],
  favoritos: [],
  comparar: [],
  recientes: [],
  ordenamiento: "relevancia",
  temaActivo: "midnight",
}

function hydrateState() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Zustand persist guarda { state: {...} }; admite también formato plano.
      const s = parsed?.state ?? parsed ?? {}
      Object.assign(state, {
        carrito: Array.isArray(s.carrito) ? s.carrito : [],
        garaje: Array.isArray(s.garaje) ? s.garaje : [],
        favoritos: Array.isArray(s.favoritos) ? s.favoritos : [],
        comparar: Array.isArray(s.comparar) ? s.comparar : [],
        recientes: Array.isArray(s.recientes) ? s.recientes : [],
        ordenamiento: typeof s.ordenamiento === "string" ? s.ordenamiento : "relevancia",
      })
    }
    const temaRaw = localStorage.getItem(THEME_KEY)
    if (temaRaw) {
      const t = JSON.parse(temaRaw)?.state?.temaActivo ?? JSON.parse(temaRaw)?.temaActivo
      if (temas.some((x) => x.id === t)) state.temaActivo = t
    }
  } catch {
    /* localStorage bloqueado → valores por defecto */
  }
}
hydrateState()

function persist() {
  try {
    const payload = { state: { ...state, temaActivo: undefined } }
    localStorage.setItem(STORE_KEY, JSON.stringify(payload))
    localStorage.setItem(THEME_KEY, JSON.stringify({ state: { temaActivo: state.temaActivo } }))
  } catch (e) {
    window.__persistErrors = window.__persistErrors || []
    window.__persistErrors.push(String(e && e.message || e))
  }
}

function emit() {
  persist()
  listeners.forEach((fn) => {
    try { fn(state) } catch (e) { window.__emitErr = (window.__emitErr || []).concat(String(e && e.message || e)) }
  })
}

export const tienda = {
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  get() {
    return state
  },

  // Carrito
  agregarAlCarrito(id, disponible = true) {
    if (!disponible || state.carrito.includes(id)) return false
    state = { ...state, carrito: [...state.carrito, id] }
    emit()
    return true
  },
  quitarDelCarrito(id) {
    state = { ...state, carrito: state.carrito.filter((v) => v !== id) }
    emit()
  },
  estaEnCarrito(id) { return state.carrito.includes(id) },
  vaciarCarrito() {
    state = { ...state, carrito: [] }
    emit()
  },

  // Garaje (comprados) — se sincroniza desde pedidos cuando hay sesión
  estaComprado(id) { return state.garaje.includes(id) },
  finalizarCompra() {
    if (state.carrito.length === 0) return
    const nuevos = state.carrito.filter((id) => !state.garaje.includes(id))
    state = { ...state, garaje: [...state.garaje, ...nuevos], carrito: [] }
    emit()
  },
  setGaraje(ids) {
    state = { ...state, garaje: Array.from(new Set(ids)) }
    emit()
  },

  // Favoritos
  toggleFavorito(id) {
    state = {
      ...state,
      favoritos: state.favoritos.includes(id)
        ? state.favoritos.filter((v) => v !== id)
        : [...state.favoritos, id],
    }
    emit()
  },
  esFavorito(id) { return state.favoritos.includes(id) },
  setFavoritos(ids) {
    state = { ...state, favoritos: Array.from(new Set(ids)) }
    emit()
  },

  // Comparador
  toggleComparar(id) {
    const actual = state.comparar
    if (actual.includes(id)) {
      state = { ...state, comparar: actual.filter((v) => v !== id) }
    } else if (actual.length < MAX_COMPARAR) {
      state = { ...state, comparar: [...actual, id] }
    }
    emit()
  },
  estaEnComparador(id) { return state.comparar.includes(id) },
  vaciarComparador() {
    state = { ...state, comparar: [] }
    emit()
  },

  // Vistos recientemente
  marcarVisto(id) {
    const actual = state.recientes.filter((v) => v !== id)
    state = { ...state, recientes: [id, ...actual].slice(0, MAX_RECIENTES) }
    emit()
  },

  // Ordenamiento
  setOrdenamiento(o) {
    state = { ...state, ordenamiento: o }
    emit()
  },

  // Tema
  setTema(id) {
    if (!temas.some((t) => t.id === id)) return
    state = { ...state, temaActivo: id }
    emit()
  },
}

export function aplicarTema(temaId) {
  const tema = temas.find((t) => t.id === temaId) ?? temas[0]
  Object.entries(tema.variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })
}
