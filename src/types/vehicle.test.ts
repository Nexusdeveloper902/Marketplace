import { test, expect } from "bun:test"
import {
  estaDisponible,
  CATEGORIAS,
  COMBUSTIBLES,
  TRACCIONES,
  type Vehicle,
} from "./vehicle"

function vehiculo(overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    id: "porsche-911-carrera",
    marca: "Porsche",
    modelo: "911 Carrera",
    año: 2024,
    precio: 210000,
    motor: "3.0L Boxer 6",
    potencia: 385,
    torque: 420,
    transmision: "PDK",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 293,
    aceleracion0a100: 4.2,
    categoria: "Deportivo",
    descripcion: "Icono deportivo alemán.",
    imagenes: [],
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// estaDisponible
// ---------------------------------------------------------------------------

test("estaDisponible es true cuando available y stock son positivos", () => {
  expect(estaDisponible(vehiculo({ available: true, stock: 3 }))).toBe(true)
})

test("estaDisponible es true cuando stock es 1 (última unidad)", () => {
  expect(estaDisponible(vehiculo({ available: true, stock: 1 }))).toBe(true)
})

test("estaDisponible es false cuando available es false", () => {
  expect(estaDisponible(vehiculo({ available: false, stock: 5 }))).toBe(false)
})

test("estaDisponible es false cuando el stock es 0", () => {
  expect(estaDisponible(vehiculo({ available: true, stock: 0 }))).toBe(false)
})

test("estaDisponible es false cuando el stock es negativo", () => {
  expect(estaDisponible(vehiculo({ available: true, stock: -2 }))).toBe(false)
})

test("estaDisponible trata available=undefined como disponible", () => {
  const v = vehiculo({ stock: 2 })
  delete v.available
  expect(estaDisponible(v)).toBe(true)
})

test("estaDisponible trata stock=undefined como 1 (disponible)", () => {
  // Catálogo estático sin inventario: se asume disponible.
  const v = vehiculo({ available: true })
  delete v.stock
  expect(estaDisponible(v)).toBe(true)
})

test("estaDisponible prioriza available=false aunque stock sea undefined", () => {
  const v = vehiculo({ available: false })
  delete v.stock
  expect(estaDisponible(v)).toBe(false)
})

// ---------------------------------------------------------------------------
// Constantes de filtros (sin duplicados, no vacías)
// ---------------------------------------------------------------------------

test("CATEGORIAS no tiene duplicados y no está vacía", () => {
  expect(CATEGORIAS.length).toBeGreaterThan(0)
  expect(new Set(CATEGORIAS).size).toBe(CATEGORIAS.length)
})

test("COMBUSTIBLES no tiene duplicados y no está vacía", () => {
  expect(COMBUSTIBLES.length).toBeGreaterThan(0)
  expect(new Set(COMBUSTIBLES).size).toBe(COMBUSTIBLES.length)
})

test("TRACCIONES no tiene duplicados y no está vacía", () => {
  expect(TRACCIONES.length).toBeGreaterThan(0)
  expect(new Set(TRACCIONES).size).toBe(TRACCIONES.length)
})
