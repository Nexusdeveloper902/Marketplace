/**
 * Auth state — port of src/lib/auth/auth-context.tsx + use-favorites-sync.ts.
 * Keeps the current session user in memory, syncs favorites with the DB
 * (guest favorites merge into the account on login) and hydrates the garage
 * from completed orders.
 */
import { api } from "./api.js"
import { tienda } from "./store.js"

const authListeners = new Set()
let currentUser = null
let authLoaded = false
let merged = false

function emitAuth() {
  authListeners.forEach((fn) => fn(currentUser))
}

export const auth = {
  subscribe(fn) {
    authListeners.add(fn)
    return () => authListeners.delete(fn)
  },
  get user() { return currentUser },
  get loading() { return !authLoaded },
  get isAuthenticated() { return Boolean(currentUser) },
  get isAdmin() { return currentUser?.role === "ADMIN" },

  async refresh() {
    try {
      const data = await api.me()
      currentUser = data.user
    } catch {
      currentUser = null
    } finally {
      authLoaded = true
    }
    emitAuth()
    await syncAfterAuth()
    return currentUser
  },

  async login(email, password) {
    try {
      const data = await api.login(email, password)
      currentUser = data.user
      emitAuth()
      await syncAfterAuth()
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message || "Credenciales incorrectas" }
    }
  },

  async register(name, email, password) {
    try {
      const data = await api.register(name, email, password)
      currentUser = data.user
      emitAuth()
      await syncAfterAuth()
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message || "No se pudo registrar" }
    }
  },

  async logout() {
    try { await api.logout() } catch { /* ignore */ }
    currentUser = null
    merged = false
    emitAuth()
  },
}

/** Merge guest favorites into the DB and hydrate favorites + garage. */
async function syncAfterAuth() {
  if (!currentUser) return
  try {
    const res = await api.favoritos()
    const serverSet = new Set(res.favoritos)
    if (!merged) {
      merged = true
      const guestOnly = tienda.get().favoritos.filter((s) => !serverSet.has(s))
      if (guestOnly.length > 0) {
        const mergedRes = await api.mergeFavoritos(guestOnly)
        tienda.setFavoritos(mergedRes.favoritos)
      } else {
        tienda.setFavoritos(res.favoritos)
      }
    } else {
      tienda.setFavoritos(res.favoritos)
    }
  } catch {
    /* sin conexión — mantener estado local */
  }
  // Hidrata el garaje desde pedidos completados
  try {
    const { orders } = await api.pedidos()
    const comprados = []
    for (const o of orders) {
      if (o.status !== "COMPLETED") continue
      for (const it of o.items) comprados.push(it.vehicle.id)
    }
    tienda.setGaraje(comprados)
  } catch {
    /* ignore */
  }
}

/**
 * Toggle favorito con actualización optimista y sync con la API
 * (mismo comportamiento que useToggleFavorito del original).
 */
export async function toggleFavorito(vehicleSlug) {
  const wasFav = tienda.esFavorito(vehicleSlug)
  tienda.toggleFavorito(vehicleSlug)
  if (!auth.isAuthenticated) return
  try {
    await api.toggleFavorito(vehicleSlug, wasFav ? "remove" : "add")
  } catch {
    tienda.toggleFavorito(vehicleSlug) // revertir
  }
}

// Carga inicial de sesión
export const authReady = auth.refresh()
