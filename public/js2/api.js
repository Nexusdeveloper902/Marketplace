/**
 * API client — thin fetch() wrappers around the Express REST API.
 * All marketplace data comes from SQLite via these endpoints; the browser
 * never touches the database directly.
 */
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error ?? `Error ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  // Vehículos
  listarVehiculos: (params = {}) => {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v))
    }
    return request(`/api/vehicles?${qs}`)
  },
  catalogo: () => request("/api/vehicles?all=1"),
  obtenerVehiculo: (slug) => request(`/api/vehicles/${encodeURIComponent(slug)}`),

  // Marcas
  listarMarcas: () => request("/api/brands"),
  obtenerMarca: (slug) => request(`/api/brands?slug=${encodeURIComponent(slug)}`),

  // Auth
  me: () => request("/api/auth/me"),
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name, email, password) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),

  // Favoritos
  favoritos: () => request("/api/favorites"),
  toggleFavorito: (vehicleSlug, action) =>
    request("/api/favorites", { method: "POST", body: JSON.stringify({ vehicleSlug, action }) }),
  mergeFavoritos: (slugs) =>
    request("/api/favorites", { method: "POST", body: JSON.stringify({ action: "merge", slugs }) }),

  // Pedidos
  pedidos: () => request("/api/orders"),
  pedido: (id) => request(`/api/orders/${encodeURIComponent(id)}`),
  checkout: (items) => request("/api/orders", { method: "POST", body: JSON.stringify({ items }) }),

  // Reseñas
  resenas: (vehicleSlug) => request(`/api/reviews?vehicleSlug=${encodeURIComponent(vehicleSlug)}`),
  crearResena: (vehicleSlug, rating, comment) =>
    request("/api/reviews", { method: "POST", body: JSON.stringify({ vehicleSlug, rating, comment }) }),

  // Analíticas (admin)
  analytics: () => request("/api/analytics"),
}
