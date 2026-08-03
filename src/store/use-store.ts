"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface EstadoTienda {
  // --- Carrito (pendiente de compra) ---
  carrito: string[] // ids de vehículos en el carrito
  agregarAlCarrito: (id: string) => void
  quitarDelCarrito: (id: string) => void
  estaEnCarrito: (id: string) => boolean
  vaciarCarrito: () => void

  // --- Garaje (vehículos comprados) ---
  garaje: string[] // ids de vehículos comprados
  comprar: (id: string) => void
  estaComprado: (id: string) => boolean
  // Mueve todos los vehículos del carrito al garaje y vacía el carrito.
  finalizarCompra: () => void
}

export const useTienda = create<EstadoTienda>()(
  persist(
    (set, get) => ({
      // --- Carrito ---
      carrito: [],
      agregarAlCarrito: (id) => {
        const actual = get().carrito
        if (actual.includes(id)) return // No duplicar
        set({ carrito: [...actual, id] })
      },
      quitarDelCarrito: (id) =>
        set({ carrito: get().carrito.filter((v) => v !== id) }),
      estaEnCarrito: (id) => get().carrito.includes(id),
      vaciarCarrito: () => set({ carrito: [] }),

      // --- Garaje ---
      garaje: [],
      comprar: (id) => {
        const actual = get().garaje
        if (actual.includes(id)) return // No duplicar
        set({ garaje: [...actual, id] })
      },
      estaComprado: (id) => get().garaje.includes(id),
      finalizarCompra: () => {
        const { carrito, garaje } = get()
        if (carrito.length === 0) return
        // Añade al garaje los que aún no estén comprados, y vacía el carrito.
        const nuevos = carrito.filter((id) => !garaje.includes(id))
        set({
          garaje: [...garaje, ...nuevos],
          carrito: [],
        })
      },
    }),
    {
      name: "digital-marketplace-tienda",
    }
  )
)
