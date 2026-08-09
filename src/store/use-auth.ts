"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Credenciales definidas en el proyecto (demostración).
const CREDENCIALES = {
  usuario: "admin",
  contraseña: "root123",
}

interface EstadoAuth {
  autenticado: boolean
  usuario: string | null
  login: (usuario: string, contraseña: string) => boolean
  logout: () => void
}

export const useAuth = create<EstadoAuth>()(
  persist(
    (set) => ({
      autenticado: false,
      usuario: null,
      login: (usuario, contraseña) => {
        if (
          usuario.trim().toLowerCase() === CREDENCIALES.usuario &&
          contraseña === CREDENCIALES.contraseña
        ) {
          set({ autenticado: true, usuario: CREDENCIALES.usuario })
          return true
        }
        return false
      },
      logout: () => set({ autenticado: false, usuario: null }),
    }),
    {
      name: "digital-marketplace-admin-auth",
    }
  )
)
