import { test, expect } from "bun:test"
import { formatearPrecio, formatearNumero } from "./format"

// Intl.NumberFormat("es-ES", { currency: "USD" }) separa el número del código
// de moneda con un espacio irrompible (U+00A0), no un espacio normal.
const NBSP = "\u00a0"

test("formatearPrecio formatea como moneda USD sin decimales", () => {
  expect(formatearPrecio(120000)).toBe(`120.000${NBSP}US$`)
})

test("formatearPrecio usa el separador de miles es-ES (punto)", () => {
  expect(formatearPrecio(1500000)).toBe(`1.500.000${NBSP}US$`)
})

test("formatearPrecio redondea al entero más cercano (maximumFractionDigits: 0)", () => {
  expect(formatearPrecio(999.49)).toBe(`999${NBSP}US$`)
  expect(formatearPrecio(999.5)).toBe(`1000${NBSP}US$`)
})

test("formatearPrecio maneja el valor cero", () => {
  expect(formatearPrecio(0)).toBe(`0${NBSP}US$`)
})

test("formatearNumero agrupa con separador de miles es-ES", () => {
  expect(formatearNumero(1234567)).toBe("1.234.567")
})

test("formatearNumero no añade separador a valores pequeños", () => {
  expect(formatearNumero(999)).toBe("999")
})

test("formatearNumero maneja el valor cero", () => {
  expect(formatearNumero(0)).toBe("0")
})
