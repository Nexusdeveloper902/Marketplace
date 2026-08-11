import { test, expect } from "bun:test"
import { cn } from "./utils"

test("cn combina clases simples separadas por espacios", () => {
  expect(cn("foo", "bar")).toBe("foo bar")
})

test("cn ignora valores falsy (undefined, null, false, 0, cadena vacía)", () => {
  expect(cn("foo", undefined, null, false, 0, "", "bar")).toBe("foo bar")
})

test("cn aplana arreglos y objetos condicionales", () => {
  expect(cn(["a", "b"], { c: true, d: false }, "e")).toBe("a b c e")
})

test("cn sin argumentos devuelve cadena vacía", () => {
  expect(cn()).toBe("")
})

test("cn resuelve conflictos de Tailwind (la última clase gana)", () => {
  // tailwind-merge debe quedarse con el último utilidad en conflicto
  expect(cn("px-2", "px-4")).toBe("px-4")
  expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
})

test("cn preserva utilidades no conflictivas", () => {
  expect(cn("px-2", "py-4")).toBe("px-2 py-4")
})
