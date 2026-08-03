"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Vista } from "@/types/vehicle"

interface EstadoTienda {
  // --- Garaje ---
  garaje: string[] // ids de vehículos comprados
  comprar: (id: string) => void
  estaComprado: (id: string) => boolean
  remover: (id: string) => void

  // --- Navegación ---
  vista: Vista
  vehiculoSeleccionado: string | null
  irAMarketplace: () => void
  irADetalle: (id: string) => void
  irAGaraje: () => void
}

export const useTienda = create<EstadoTienda>()(
  persist(
    (set, get) => ({
      // --- Garaje ---
      garaje: [],
      comprar: (id) => {
        const actual = get().garaje
        if (actual.includes(id)) return // No permitir comprar dos veces
        set({ garaje: [...actual, id] })
      },
      estaComprado: (id) => get().garaje.includes(id),
      remover: (id) =>
        set({ garaje: get().garaje.filter((v) => v !== id) }),

      // --- Navegación ---
      vista: "marketplace",
      vehiculoSeleccionado: null,
      irAMarketplace: () => set({ vista: "marketplace" }),
      irADetalle: (id) =>
        set({ vista: "detalle", vehiculoSeleccionado: id }),
      irAGaraje: () => set({ vista: "garaje" }),
    }),
    {
      name: "digital-marketplace-garaje",
      // Solo persistimos el garaje; la navegación se reinicia cada sesión.
      partialize: (state) => ({ garaje: state.garaje }),
    }
  )
)
