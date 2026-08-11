"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface EstadoTienda {
  // --- Carrito (pendiente de compra) ---
  carrito: string[]
  agregarAlCarrito: (id: string) => void
  quitarDelCarrito: (id: string) => void
  estaEnCarrito: (id: string) => boolean
  vaciarCarrito: () => void

  // --- Garaje (vehículos comprados) ---
  garaje: string[]
  estaComprado: (id: string) => boolean
  finalizarCompra: () => void

  // --- Favoritos ---
  favoritos: string[]
  toggleFavorito: (id: string) => void
  esFavorito: (id: string) => boolean
  setFavoritos: (ids: string[]) => void

  // --- Comparador (hasta 3 vehículos) ---
  comparar: string[]
  toggleComparar: (id: string) => void
  estaEnComparador: (id: string) => boolean
  vaciarComparador: () => void

  // --- Vistos recientemente ---
  recientes: string[]
  marcarVisto: (id: string) => void

  // --- Preferencias de ordenamiento ---
  ordenamiento: string
  setOrdenamiento: (o: string) => void
}

const MAX_COMPARAR = 3
const MAX_RECIENTES = 8

export const useTienda = create<EstadoTienda>()(
  persist(
    (set, get) => ({
      // --- Carrito ---
      carrito: [],
      agregarAlCarrito: (id) => {
        const actual = get().carrito
        if (actual.includes(id)) return
        set({ carrito: [...actual, id] })
      },
      quitarDelCarrito: (id) =>
        set({ carrito: get().carrito.filter((v) => v !== id) }),
      estaEnCarrito: (id) => get().carrito.includes(id),
      vaciarCarrito: () => set({ carrito: [] }),

      // --- Garaje ---
      garaje: [],
      estaComprado: (id) => get().garaje.includes(id),
      finalizarCompra: () => {
        const { carrito, garaje } = get()
        if (carrito.length === 0) return
        const nuevos = carrito.filter((id) => !garaje.includes(id))
        set({ garaje: [...garaje, ...nuevos], carrito: [] })
      },

      // --- Favoritos ---
      favoritos: [],
      toggleFavorito: (id) => {
        const actual = get().favoritos
        set(
          actual.includes(id)
            ? { favoritos: actual.filter((v) => v !== id) }
            : { favoritos: [...actual, id] }
        )
      },
      esFavorito: (id) => get().favoritos.includes(id),
      setFavoritos: (ids) => set({ favoritos: Array.from(new Set(ids)) }),

      // --- Comparador ---
      comparar: [],
      toggleComparar: (id) => {
        const actual = get().comparar
        if (actual.includes(id)) {
          set({ comparar: actual.filter((v) => v !== id) })
        } else if (actual.length < MAX_COMPARAR) {
          set({ comparar: [...actual, id] })
        }
      },
      estaEnComparador: (id) => get().comparar.includes(id),
      vaciarComparador: () => set({ comparar: [] }),

      // --- Vistos recientemente ---
      recientes: [],
      marcarVisto: (id) => {
        const actual = get().recientes.filter((v) => v !== id)
        set({ recientes: [id, ...actual].slice(0, MAX_RECIENTES) })
      },

      // --- Ordenamiento ---
      ordenamiento: "relevancia",
      setOrdenamiento: (o) => set({ ordenamiento: o }),
    }),
    {
      name: "digital-marketplace-tienda",
    }
  )
)

export { MAX_COMPARAR }
