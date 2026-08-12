import { describe, expect, it, beforeEach } from "bun:test"

// zustand `persist` reads/writes localStorage at module load. Provide a
// minimal in-memory store so the store initializes under bun:test.
const memory = new Map<string, string>()
;(globalThis as unknown as { localStorage: Storage }).localStorage = {
  get length() {
    return memory.size
  },
  key(i: number) {
    return [...memory.keys()][i] ?? null
  },
  getItem: (k: string) => memory.get(k) ?? null,
  setItem: (k: string, v: string) => {
    memory.set(k, v)
  },
  removeItem: (k: string) => {
    memory.delete(k)
  },
  clear: () => memory.clear(),
} as Storage

import { useTienda } from "./use-store"

describe("agregarAlCarrito — disponibilidad", () => {
  beforeEach(() => {
    useTienda.getState().vaciarCarrito()
  })

  it("añade un vehículo disponible y devuelve true", () => {
    const ok = useTienda.getState().agregarAlCarrito("porsche-911-carrera", true)
    expect(ok).toBe(true)
    expect(useTienda.getState().carrito).toContain("porsche-911-carrera")
  })

  it("NO añade un vehículo agotado y devuelve false", () => {
    const ok = useTienda.getState().agregarAlCarrito("rolls-royce-ghost", false)
    expect(ok).toBe(false)
    expect(useTienda.getState().carrito).not.toContain("rolls-royce-ghost")
    expect(useTienda.getState().carrito.length).toBe(0)
  })

  it("por defecto (sin indicar disponibilidad) se asume disponible", () => {
    const ok = useTienda.getState().agregarAlCarrito("lamborghini-revuelto")
    expect(ok).toBe(true)
    expect(useTienda.getState().carrito).toContain("lamborghini-revuelto")
  })

  it("no añade duplicados aunque el vehículo esté disponible", () => {
    useTienda.getState().agregarAlCarrito("mclaren-750s", true)
    const ok = useTienda.getState().agregarAlCarrito("mclaren-750s", true)
    expect(ok).toBe(false)
    expect(
      useTienda.getState().carrito.filter((id) => id === "mclaren-750s").length
    ).toBe(1)
  })
})
