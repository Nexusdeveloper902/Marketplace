import { afterEach, describe, expect, it, mock } from "bun:test"
import type { Vehicle } from "@/types/vehicle"
import { revalidarCarrito } from "./cart-view"

// Vehículos de prueba con la forma que devuelve /api/vehicles?all=1.
function vehiculo(
  id: string,
  marca: string,
  modelo: string,
  disponible: boolean,
  stock: number
): Vehicle {
  return {
    id,
    marca,
    modelo,
    año: 2024,
    precio: 100000,
    motor: "V8",
    potencia: 500,
    torque: 600,
    transmision: "Automática",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 300,
    aceleracion0a100: 3.5,
    categoria: "Deportivo",
    descripcion: "",
    imagenes: [],
    stock,
    available: disponible,
  }
}

function mockFetchResponse(items: Vehicle[], ok = true) {
  const json = mock(() => Promise.resolve({ items, total: items.length }))
  const res = {
    ok,
    json,
  }
  globalThis.fetch = mock(() => Promise.resolve(res as unknown as Response)) as never
}

afterEach(() => {
  globalThis.fetch = (globalThis as { __originalFetch?: typeof fetch }).__originalFetch ?? fetch
  delete (globalThis as { __originalFetch?: typeof fetch }).__originalFetch
})

describe("revalidarCarrito — inventario actual del servidor", () => {
  it("conserva los vehículos disponibles y descarta los agotados", async () => {
    const api = [
      vehiculo("aston-martin-db12", "Aston Martin", "DB12", true, 2),
      vehiculo("rolls-royce-ghost", "Rolls-Royce", "Ghost", false, 0),
    ]
    mockFetchResponse(api)

    const disponibles = await revalidarCarrito([
      "aston-martin-db12",
      "rolls-royce-ghost",
      "slug-que-no-existe",
    ])

    expect(disponibles.size).toBe(1)
    expect(disponibles.has("aston-martin-db12")).toBe(true)
    expect(disponibles.has("rolls-royce-ghost")).toBe(false)
    expect(disponibles.has("slug-que-no-existe")).toBe(false)
    // Devuelve el registro actualizado del servidor (no el estático).
    expect(disponibles.get("aston-martin-db12")?.stock).toBe(2)
  })

  it("trata stock 0 con available=true como agotado", async () => {
    const api = [
      vehiculo("ultimo-disponible", "Marca", "Único", true, 1),
      vehiculo("stock-cero", "Marca", "Cero", true, 0),
    ]
    mockFetchResponse(api)

    const disponibles = await revalidarCarrito([
      "ultimo-disponible",
      "stock-cero",
    ])

    expect(disponibles.has("ultimo-disponible")).toBe(true)
    expect(disponibles.has("stock-cero")).toBe(false)
  })

  it("lanza si la API responde con error", async () => {
    mockFetchResponse([], false)
    await expect(revalidarCarrito(["cualquiera"])).rejects.toThrow(
      "No se pudo verificar el inventario"
    )
  })

  it("devuelve un mapa vacío si ningún slug del carrito está disponible", async () => {
    const api = [vehiculo("otro", "Marca", "Otro", true, 3)]
    mockFetchResponse(api)
    const disponibles = await revalidarCarrito(["no-esta-en-la-api"])
    expect(disponibles.size).toBe(0)
  })
})
