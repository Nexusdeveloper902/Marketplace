import { describe, expect, it } from "bun:test"
import { getDashboardData } from "./analytics"

describe("analytics dashboard data", () => {
  it("devuelve la estructura completa esperada", async () => {
    const d = await getDashboardData()
    expect(d).toHaveProperty("kpis")
    expect(d).toHaveProperty("meses")
    expect(d).toHaveProperty("ventasPorMarca")
    expect(d).toHaveProperty("ventasPorCategoria")
    expect(d).toHaveProperty("topVehiculos")
    expect(d).toHaveProperty("pedidosRecientes")
  })

  it("los KPIs son coherentes entre sí", async () => {
    const { kpis } = await getDashboardData()
    expect(kpis.vehiculosVendidos).toBeGreaterThanOrEqual(0)
    expect(kpis.ventasTotales).toBeGreaterThanOrEqual(0)
    expect(kpis.clientes).toBeGreaterThanOrEqual(0)
    // ticket promedio = ventas / vehículos vendidos (cuando hay ventas)
    if (kpis.vehiculosVendidos > 0) {
      const esperado = kpis.ventasTotales / kpis.vehiculosVendidos
      expect(Math.abs(kpis.ticketPromedio - esperado)).toBeLessThan(1)
    }
  })

  it("ventasPorMarca está ordenado desc por ventas", async () => {
    const { ventasPorMarca } = await getDashboardData()
    for (let i = 1; i < ventasPorMarca.length; i++) {
      expect(ventasPorMarca[i].ventas).toBeLessThanOrEqual(
        ventasPorMarca[i - 1].ventas
      )
    }
  })

  it("cada pedido reciente tiene número, cliente y marca no vacíos", async () => {
    const { pedidosRecientes } = await getDashboardData()
    for (const p of pedidosRecientes) {
      expect(p.number.length).toBeGreaterThan(0)
      expect(p.cliente.length).toBeGreaterThan(0)
      expect(p.marca.length).toBeGreaterThan(0)
    }
  })

  it("meses cubre datos históricos con etiquetas legibles", async () => {
    const { meses } = await getDashboardData()
    expect(meses.length).toBeGreaterThan(0)
    for (const m of meses) {
      expect(m.mesLabel.length).toBeGreaterThan(0)
      expect(m.ingresos).toBeGreaterThanOrEqual(0)
      expect(m.ventas).toBeGreaterThanOrEqual(0)
    }
  })
})
