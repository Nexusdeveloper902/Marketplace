import { test, expect } from "bun:test"
import type { Vehicle as VehicleRecord } from "@prisma/client"
import {
  slugify,
  toVehicleDTO,
  estadoInventario,
  type InventarioEstado,
} from "./mappers"

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------

test("slugify pasa a minúsculas", () => {
  expect(slugify("Porsche")).toBe("porsche")
})

test("slugify reemplaza los espacios por guiones", () => {
  expect(slugify("Aston Martin DB12")).toBe("aston-martin-db12")
})

test("slugify colapsa varios espacios en un solo guion", () => {
  expect(slugify("Mercedes   Benz")).toBe("mercedes-benz")
})

test("slugify elimina los caracteres no alfanuméricos", () => {
  // Los espacios se convierten en guiones primero; los símbolos como "&" y
  // "." se eliminan, lo que puede dejar guiones dobles ("--").
  expect(slugify("Rolls-Royce & Co.")).toBe("rolls-royce--co")
})

test("slugify deja un guion inicial/final a partir de espacios en los bordes", () => {
  // slugify no recorta guiones en los extremos: los espacios circundantes
  // se convierten en guiones. Esto documenta el comportamiento real.
  expect(slugify("  Porsche  ")).toBe("-porsche-")
})

test("slugify produce solo guiones si no hay alfanuméricos", () => {
  // "!!! ???" → espacios a guion → "!!!-???" → sin alfanuméricos → "-"
  expect(slugify("!!! ???")).toBe("-")
})

// ---------------------------------------------------------------------------
// toVehicleDTO
// ---------------------------------------------------------------------------

function vehiculoBase(): VehicleRecord {
  return {
    id: "abc123",
    slug: "porsche-911-carrera",
    marca: "Porsche",
    modelo: "911 Carrera",
    año: 2024,
    precio: 210000,
    motor: "3.0L Boxer 6",
    potencia: 385,
    torque: 420,
    transmision: "PDK 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 293,
    aceleracion0a100: 4.2,
    categoria: "Deportivo",
    descripcion: "Icono deportivo alemán.",
    images: '["/img/1.jpg","/img/2.jpg"]',
    stock: 1,
    available: true,
    featured: false,
    brandId: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
  }
}

test("toVehicleDTO mapea todos los campos de especificación", () => {
  const dto = toVehicleDTO(vehiculoBase())
  expect(dto).toEqual({
    id: "porsche-911-carrera", // el id del DTO es el slug estable
    marca: "Porsche",
    modelo: "911 Carrera",
    año: 2024,
    precio: 210000,
    motor: "3.0L Boxer 6",
    potencia: 385,
    torque: 420,
    transmision: "PDK 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 293,
    aceleracion0a100: 4.2,
    categoria: "Deportivo",
    descripcion: "Icono deportivo alemán.",
    imagenes: ["/img/1.jpg", "/img/2.jpg"],
    stock: 1,
    available: true,
  })
})

test("toVehicleDTO usa el slug como id del DTO", () => {
  const dto = toVehicleDTO(vehiculoBase())
  expect(dto.id).toBe("porsche-911-carrera")
})

test("toVehicleDTO decodifica el array JSON de imágenes", () => {
  const dto = toVehicleDTO(vehiculoBase())
  expect(dto.imagenes).toEqual(["/img/1.jpg", "/img/2.jpg"])
})

test("toVehicleDTO devuelve [] cuando el JSON de imágenes es inválido", () => {
  const v = vehiculoBase()
  v.images = "no es json"
  expect(toVehicleDTO(v).imagenes).toEqual([])
})

test("toVehicleDTO devuelve [] cuando images no es un array", () => {
  const v = vehiculoBase()
  v.images = '"una cadena, no un array"'
  expect(toVehicleDTO(v).imagenes).toEqual([])
})

test("toVehicleDTO devuelve [] cuando images es un array vacío", () => {
  const v = vehiculoBase()
  v.images = "[]"
  expect(toVehicleDTO(v).imagenes).toEqual([])
})

// ---------------------------------------------------------------------------
// estadoInventario
// ---------------------------------------------------------------------------

test("estadoInventario devuelve 'disponible' con stock > 1 y available=true", () => {
  expect(estadoInventario(5, true)).toBe<InventarioEstado>("disponible")
})

test("estadoInventario devuelve 'ultima' cuando el stock es exactamente 1", () => {
  expect(estadoInventario(1, true)).toBe<InventarioEstado>("ultima")
})

test("estadoInventario devuelve 'agotado' cuando available es false", () => {
  expect(estadoInventario(5, false)).toBe<InventarioEstado>("agotado")
})

test("estadoInventario devuelve 'agotado' cuando el stock es 0", () => {
  expect(estadoInventario(0, true)).toBe<InventarioEstado>("agotado")
})

test("estadoInventario devuelve 'agotado' cuando el stock es negativo", () => {
  expect(estadoInventario(-3, true)).toBe<InventarioEstado>("agotado")
})

test("estadoInventario prioriza available=false sobre stock positivo", () => {
  expect(estadoInventario(1, false)).toBe<InventarioEstado>("agotado")
})
