import { test, expect } from "bun:test"
import {
  generarDatosDashboard,
  type DatosDashboard,
} from "./datos-sinteticos"

// El generador usa una PRNG con seed fija (mulberry32, seed 42). La primera
// invocación tras importar el módulo es determinista, así que la ejecutamos
// una sola vez a nivel de módulo y validamos invariantes estructurales sobre
// el resultado. (No llamar generarDatosDashboard() varias veces: el estado del
// rng avanza y los valores cambian.)
const datos: DatosDashboard = generarDatosDashboard()

test("genera exactamente 36 meses", () => {
  expect(datos.meses).toHaveLength(36)
})

test("cada mes tiene campos coherentes (mes 0-11, etiqueta y fecha ISO)", () => {
  for (const m of datos.meses) {
    expect(m.mes).toBeGreaterThanOrEqual(0)
    expect(m.mes).toBeLessThanOrEqual(11)
    expect(m.año).toBeGreaterThan(2000)
    expect(m.mesLabel).toMatch(/^[A-Z][a-z]{2} \d{4}$/)
    expect(() => new Date(m.fecha).toISOString()).not.toThrow()
    expect(new Date(m.fecha).getMonth()).toBe(m.mes)
  }
})

test("los meses están ordenados de forma ascendente por fecha", () => {
  const fechas = datos.meses.map((m) => new Date(m.fecha).getTime())
  for (let i = 1; i < fechas.length; i++) {
    expect(fechas[i]).toBeGreaterThanOrEqual(fechas[i - 1])
  }
})

test("KPI vehiculosVendidos coincide con la suma de ventas mensuales", () => {
  const suma = datos.meses.reduce((s, m) => s + m.ventas, 0)
  expect(datos.kpis.vehiculosVendidos).toBe(suma)
})

test("KPI ventasTotales coincide con la suma de ingresos mensuales", () => {
  const suma = datos.meses.reduce((s, m) => s + m.ingresos, 0)
  expect(datos.kpis.ventasTotales).toBe(suma)
})

test("KPI ticketPromedio = round(ventasTotales / vehiculosVendidos)", () => {
  const esperado = Math.round(datos.kpis.ventasTotales / datos.kpis.vehiculosVendidos)
  expect(datos.kpis.ticketPromedio).toBe(esperado)
})

test("KPI clientes = round(vehiculosVendidos * 0.85)", () => {
  const esperado = Math.round(datos.kpis.vehiculosVendidos * 0.85)
  expect(datos.kpis.clientes).toBe(esperado)
})

test("KPI marcasDisponibles equivale al tamaño del catálogo (15)", () => {
  expect(datos.kpis.marcasDisponibles).toBe(15)
})

test("KPI pedidosPendientes no supera el total de pedidos pendientes generados", () => {
  // El KPI se cuenta sobre todos los pedidos generados (antes del slice a 15),
  // por lo que solo podemos afirmar el invariante débil: es exactamente el número
  // de pedidos Pendiente/En proceso entre los pedidosRecientes devueltos, más
  // cualquier pedido pendiente recortado por el slice. Verificamos que al menos
  // coincide con el subconjunto visible.
  const visibles = datos.pedidosRecientes.filter(
    (p) => p.estado === "Pendiente" || p.estado === "En proceso"
  ).length
  expect(datos.kpis.pedidosPendientes).toBeGreaterThanOrEqual(visibles)
  expect(datos.kpis.pedidosPendientes).toBeLessThanOrEqual(
    datos.pedidosRecientes.length
  )
})

test("ventasPorMarca cubre las 15 marcas y está ordenado desc por ventas", () => {
  expect(datos.ventasPorMarca).toHaveLength(15)
  for (let i = 1; i < datos.ventasPorMarca.length; i++) {
    expect(datos.ventasPorMarca[i].ventas).toBeLessThanOrEqual(
      datos.ventasPorMarca[i - 1].ventas
    )
  }
})

test("ventasPorMarca: la suma de ventas e ingresos coincide con los totales", () => {
  const sumaVentas = datos.ventasPorMarca.reduce((s, m) => s + m.ventas, 0)
  const sumaIngresos = datos.ventasPorMarca.reduce((s, m) => s + m.ingresos, 0)
  expect(sumaVentas).toBe(datos.kpis.vehiculosVendidos)
  expect(sumaIngresos).toBe(datos.kpis.ventasTotales)
})

test("ventasPorCategoria cubre las 9 categorías y está ordenado desc por ventas", () => {
  expect(datos.ventasPorCategoria).toHaveLength(9)
  for (let i = 1; i < datos.ventasPorCategoria.length; i++) {
    expect(datos.ventasPorCategoria[i].ventas).toBeLessThanOrEqual(
      datos.ventasPorCategoria[i - 1].ventas
    )
  }
})

test("ventasPorCategoria: la suma de ventas e ingresos coincide con los totales", () => {
  const sumaVentas = datos.ventasPorCategoria.reduce((s, c) => s + c.ventas, 0)
  const sumaIngresos = datos.ventasPorCategoria.reduce((s, c) => s + c.ingresos, 0)
  expect(sumaVentas).toBe(datos.kpis.vehiculosVendidos)
  expect(sumaIngresos).toBe(datos.kpis.ventasTotales)
})

test("topVehiculos tiene como máximo 8 elementos, todos con ventas > 0, ordenados desc", () => {
  expect(datos.topVehiculos.length).toBeLessThanOrEqual(8)
  for (const v of datos.topVehiculos) {
    expect(v.ventas).toBeGreaterThan(0)
    expect(v.vehiculo).toContain(v.marca)
  }
  for (let i = 1; i < datos.topVehiculos.length; i++) {
    expect(datos.topVehiculos[i].ventas).toBeLessThanOrEqual(
      datos.topVehiculos[i - 1].ventas
    )
  }
})

test("pedidosRecientes tiene como máximo 15 elementos y está ordenado desc por fecha", () => {
  expect(datos.pedidosRecientes.length).toBeLessThanOrEqual(15)
  const fechas = datos.pedidosRecientes.map((p) => new Date(p.fecha).getTime())
  for (let i = 1; i < fechas.length; i++) {
    expect(fechas[i]).toBeLessThanOrEqual(fechas[i - 1])
  }
})

test("cada pedido reciente tiene id, cliente, vehículo y marca no vacíos", () => {
  for (const p of datos.pedidosRecientes) {
    expect(p.id.length).toBeGreaterThan(0)
    expect(p.cliente.length).toBeGreaterThan(0)
    expect(p.vehiculo.length).toBeGreaterThan(0)
    expect(p.marca.length).toBeGreaterThan(0)
    expect(p.vehiculo.startsWith(p.marca)).toBe(true)
    expect(p.valor).toBeGreaterThan(0)
  }
})

test("todos los estados de pedido pertenecen al catálogo permitido", () => {
  const permitidos = new Set(["Completado", "En proceso", "Pendiente", "Cancelado"])
  for (const p of datos.pedidosRecientes) {
    expect(permitidos.has(p.estado)).toBe(true)
  }
})

test("el crecimiento anual se deriva del año 3 frente al año 1", () => {
  const año1 = datos.meses.slice(0, 12).reduce((s, m) => s + m.ingresos, 0)
  const año3 = datos.meses.slice(24, 36).reduce((s, m) => s + m.ingresos, 0)
  const esperado = Math.round(((año3 / año1 - 1) / 2) * 100)
  expect(datos.kpis.crecimientoAnual).toBe(esperado)
  // Con un factor de crecimiento ~18% anual, el crecimiento de 2 años es positivo
  expect(datos.kpis.crecimientoAnual).toBeGreaterThan(0)
})

test("la tasa de conversión está en el rango sintético esperado (2.8 - 4.2)", () => {
  expect(datos.kpis.tasaConversion).toBeGreaterThanOrEqual(2.8)
  expect(datos.kpis.tasaConversion).toBeLessThanOrEqual(4.2)
})
