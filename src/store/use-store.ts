"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface EstadoTienda {
  // --- Garaje ---
  garaje: string[] // ids de vehículos comprados
  comprar: (id: string) => void
  estaComprado: (id: string) => boolean
  remover: (id: string) => void
}

export const useTienda = create<EstadoTienda>()(
  persist(
    (set, get) => ({
      garaje: [],
      comprar: (id) => {
        const actual = get().garaje
        if (actual.includes(id)) return // No permitir comprar dos veces
        set({ garaje: [...actual, id] })
      },
      estaComprado: (id) => get().garaje.includes(id),
      remover: (id) =>
        set({ garaje: get().garaje.filter((v) => v !== id) }),
    }),
    {
      name: "digital-marketplace-garaje",
    }
  )
)
