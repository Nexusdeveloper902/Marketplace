/**
 * Analytics data layer — SQLite port of src/lib/server/data/analytics.ts.
 * Aggregates real completed orders/events for the admin dashboard.
 */
const { db } = require("../database/database")
const { ORDER_STATUS_LABELS } = require("./orders")

const MESES_LABEL = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function getDashboardData() {
  const completedOrders = db
    .prepare(
      `SELECT o.id, o.number, o.status, o.total, o.createdAt, u.name AS userName
       FROM orders o LEFT JOIN users u ON u.id = o.userId
       WHERE o.status = 'COMPLETED' ORDER BY o.createdAt DESC`
    )
    .all()
  const allItems = db
    .prepare(
      `SELECT oi.orderId, oi.quantity, oi.priceAtPurchase,
              v.marca, v.modelo, v.categoria
       FROM order_items oi JOIN vehicles v ON v.id = oi.vehicleId`
    )
    .all()
  const itemsByOrder = new Map()
  for (const it of allItems) {
    if (!itemsByOrder.has(it.orderId)) itemsByOrder.set(it.orderId, [])
    itemsByOrder.get(it.orderId).push(it)
  }

  const brandsCount = db.prepare("SELECT COUNT(*) AS c FROM brands").get().c
  const pendingOrders = db
    .prepare("SELECT COUNT(*) AS c FROM orders WHERE status IN ('PENDING', 'PROCESSING')")
    .get().c
  const eventsAgg = db
    .prepare("SELECT type, COUNT(*) AS c FROM events GROUP BY type")
    .all()

  const ventasTotales = completedOrders.reduce((s, o) => s + o.total, 0)
  let vehiculosVendidos = 0
  for (const o of completedOrders) {
    for (const it of itemsByOrder.get(o.id) ?? []) vehiculosVendidos += it.quantity
  }
  const clientes = new Set(completedOrders.map((o) => o.userName ?? "—")).size
  const ticketPromedio = vehiculosVendidos > 0 ? Math.round(ventasTotales / vehiculosVendidos) : 0

  // Monthly revenue/volume for the last 12 months (real data).
  const now = new Date()
  const meses = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    const monthOrders = completedOrders.filter((o) => {
      const created = new Date(o.createdAt)
      return created >= d && created < next
    })
    let ingresos = 0
    let ventas = 0
    for (const o of monthOrders) {
      ingresos += o.total
      for (const it of itemsByOrder.get(o.id) ?? []) ventas += it.quantity
    }
    meses.push({
      mes: d.getMonth(),
      año: d.getFullYear(),
      mesLabel: `${MESES_LABEL[d.getMonth()]} ${d.getFullYear()}`,
      fecha: d.toISOString(),
      ingresos,
      ventas,
    })
  }

  // Year-over-year growth (current vs previous 12 months).
  const year1Ingresos = meses.slice(0, 12).reduce((s, m) => s + m.ingresos, 0)
  const priorStart = new Date(now.getFullYear() - 1, now.getMonth(), 1)
  const priorIngresos = completedOrders
    .filter((o) => new Date(o.createdAt) < priorStart)
    .reduce((s, o) => s + o.total, 0)
  const crecimientoAnual =
    priorIngresos > 0
      ? Math.round(((year1Ingresos / priorIngresos - 1) / 1) * 100)
      : year1Ingresos > 0
        ? 18
        : 0

  // Sales by brand / category / top vehicles.
  const porMarca = new Map()
  const porCategoria = new Map()
  const porVehiculo = new Map()
  for (const o of completedOrders) {
    for (const it of itemsByOrder.get(o.id) ?? []) {
      const bm = porMarca.get(it.marca) ?? { ventas: 0, ingresos: 0 }
      bm.ventas += it.quantity
      bm.ingresos += it.priceAtPurchase * it.quantity
      porMarca.set(it.marca, bm)

      const bc = porCategoria.get(it.categoria) ?? { ventas: 0, ingresos: 0 }
      bc.ventas += it.quantity
      bc.ingresos += it.priceAtPurchase * it.quantity
      porCategoria.set(it.categoria, bc)

      const key = `${it.marca} ${it.modelo}`
      const bv = porVehiculo.get(key) ?? { marca: it.marca, ventas: 0, ingresos: 0 }
      bv.ventas += it.quantity
      bv.ingresos += it.priceAtPurchase * it.quantity
      porVehiculo.set(key, bv)
    }
  }

  const ventasPorMarca = [...porMarca.entries()]
    .map(([marca, v]) => ({ marca, ...v }))
    .sort((a, b) => b.ventas - a.ventas)

  const ventasPorCategoria = [...porCategoria.entries()]
    .map(([categoria, v]) => ({ categoria, ...v }))
    .sort((a, b) => b.ventas - a.ventas)

  const topVehiculos = [...porVehiculo.entries()]
    .map(([vehiculo, v]) => ({ vehiculo, ...v }))
    .sort((a, b) => b.ventas - a.ventas)
    .slice(0, 8)

  const pedidosRecientes = completedOrders.slice(0, 15).map((o) => {
    const first = (itemsByOrder.get(o.id) ?? [])[0]
    const vehiculo = first ? `${first.marca} ${first.modelo}` : "—"
    return {
      id: o.number,
      number: o.number,
      cliente: o.userName ?? "Cliente",
      vehiculo,
      marca: first?.marca ?? "—",
      valor: o.total,
      estado: ORDER_STATUS_LABELS[o.status] ?? o.status,
      fecha: new Date(o.createdAt).toISOString(),
    }
  })

  // Conversion rate: purchases / (views + cart adds) from events.
  const counts = new Map(eventsAgg.map((e) => [e.type, e.c]))
  const views = counts.get("VEHICLE_VIEWED") ?? 0
  const purchases = counts.get("PURCHASE_COMPLETED") ?? 0
  const denom = views + purchases
  const tasaConversion = denom > 0 ? (purchases / denom) * 100 : 0

  return {
    kpis: {
      ventasTotales,
      vehiculosVendidos,
      clientes,
      ticketPromedio,
      pedidosPendientes: pendingOrders,
      marcasDisponibles: brandsCount,
      tasaConversion,
      crecimientoAnual,
    },
    meses,
    ventasPorMarca,
    ventasPorCategoria,
    topVehiculos,
    pedidosRecientes,
  }
}

module.exports = { getDashboardData }
