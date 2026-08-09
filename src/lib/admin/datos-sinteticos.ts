/**
 * Generador de datos sintéticos para el dashboard administrativo.
 *
 * Genera 36 meses de datos realistas con:
 * - Crecimiento gradual año tras año
 * - Mayor volumen en noviembre y diciembre
 * - Menor actividad en algunos meses
 * - Variaciones aleatorias controladas
 * - Diferentes niveles de popularidad entre marcas
 * - Ingresos coherentes con vehículos vendidos
 *
 * Los datos se generan deterministamente (seed fija) para que sean
 * consistentes entre renders.
 */

// --- Seed PRNG determinista (mulberry32) ---
function crearRng(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = crearRng(42)

function randInt(min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

function randFloat(min: number, max: number) {
  return rng() * (max - min) + min
}

// --- Catálogo base ---
const marcasData = [
  { marca: "Porsche", peso: 9, precioMedio: 145000 },
  { marca: "Ferrari", peso: 7, precioMedio: 320000 },
  { marca: "Lamborghini", peso: 7, precioMedio: 280000 },
  { marca: "BMW", peso: 10, precioMedio: 95000 },
  { marca: "Mercedes-Benz", peso: 10, precioMedio: 110000 },
  { marca: "Audi", peso: 9, precioMedio: 90000 },
  { marca: "Tesla", peso: 8, precioMedio: 75000 },
  { marca: "Toyota", peso: 8, precioMedio: 45000 },
  { marca: "Ford", peso: 7, precioMedio: 55000 },
  { marca: "Chevrolet", peso: 6, precioMedio: 65000 },
  { marca: "Nissan", peso: 5, precioMedio: 50000 },
  { marca: "McLaren", peso: 4, precioMedio: 250000 },
  { marca: "Rolls-Royce", peso: 3, precioMedio: 380000 },
  { marca: "Bentley", peso: 3, precioMedio: 260000 },
  { marca: "Aston Martin", peso: 4, precioMedio: 220000 },
]

const categoriasData = [
  { categoria: "SUV", peso: 22 },
  { categoria: "Sedán", peso: 18 },
  { categoria: "Coupé", peso: 15 },
  { categoria: "Superdeportivo", peso: 12 },
  { categoria: "Hatchback", peso: 10 },
  { categoria: "Pickup", peso: 8 },
  { categoria: "Convertible", peso: 6 },
  { categoria: "Familiar", peso: 5 },
  { categoria: "Deportivo", peso: 4 },
]

// Factores estacionales (1.0 = promedio)
// Noviembre y diciembre picos, enero-febrero bajos
const factorEstacional = [0.75, 0.72, 0.85, 0.9, 0.95, 1.0, 1.02, 1.05, 1.1, 1.15, 1.45, 1.55]

const nombresCliente = [
  "Carlos García", "María López", "Juan Martínez", "Ana Rodríguez", "Pedro Sánchez",
  "Laura Fernández", "Diego Pérez", "Sofía Gómez", "Miguel Torres", "Elena Ruiz",
  "Alejandro Vargas", "Carmen Ortiz", "Javier Moreno", "Isabel Castro", "Roberto Díaz",
  "Patricia Romero", "Fernando Jiménez", "Lucía Navarro", "Andrés Molina", "Marta Herrera",
]

const estadosPedido = ["Completado", "Completado", "Completado", "En proceso", "Pendiente", "Cancelado"]

const modelosPorMarca: Record<string, string[]> = {
  Porsche: ["911 Carrera", "Taycan Turbo S", "Cayenne Turbo GT", "718 Cayman GT4"],
  Ferrari: ["296 GTB", "SF90 Stradale", "Roma", "812 Competizione"],
  Lamborghini: ["Huracán EVO", "Aventador SVJ", "Revuelto", "Urus Performante"],
  BMW: ["M4 Competition", "M5 CS", "i8", "X5 M Competition"],
  "Mercedes-Benz": ["AMG GT 63", "S63 AMG", "G63 AMG", "C63 S AMG"],
  Audi: ["RS6 Avant", "R8 V10", "RS7 Sportback", "SQ8"],
  Tesla: ["Model S Plaid", "Model 3 Performance", "Model X Plaid", "Cybertruck"],
  Toyota: ["GR Supra", "GR Corolla", "Land Cruiser", "Camry TRD"],
  Ford: ["Mustang GT", "GT", "F-150 Raptor R", "Bronco Raptor"],
  Chevrolet: ["Corvette Z06", "Camaro ZL1", "Silverado ZR2", "Tahoe RST"],
  Nissan: ["GT-R Nismo", "Z Nismo", "Ariya", "Frontier"],
  McLaren: ["750S", "Artura"],
  "Rolls-Royce": ["Ghost", "Cullinan"],
  Bentley: ["Continental GT", "Bentayga"],
  "Aston Martin": ["DB12", "Vantage"],
}

// --- Generación de datos mensuales (36 meses) ---
export interface MesData {
  fecha: string // ISO
  año: number
  mes: number // 0-11
  mesLabel: string
  ventas: number // cantidad de vehículos
  ingresos: number // total en USD
  clientes: number
}

export interface VentaMarca {
  marca: string
  ventas: number
  ingresos: number
}

export interface VentaCategoria {
  categoria: string
  ventas: number
  ingresos: number
}

export interface TopVehiculo {
  vehiculo: string
  marca: string
  ventas: number
  ingresos: number
}

export interface Pedido {
  id: string
  cliente: string
  vehiculo: string
  marca: string
  fecha: string
  estado: string
  valor: number
}

export interface DatosDashboard {
  meses: MesData[]
  ventasPorMarca: VentaMarca[]
  ventasPorCategoria: VentaCategoria[]
  topVehiculos: TopVehiculo[]
  pedidosRecientes: Pedido[]
  kpis: {
    ventasTotales: number
    vehiculosVendidos: number
    clientes: number
    ticketPromedio: number
    crecimientoAnual: number
    marcasDisponibles: number
    tasaConversion: number
    pedidosPendientes: number
  }
}

const mesesLabel = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export function generarDatosDashboard(): DatosDashboard {
  const meses: MesData[] = []
  const ventasPorMarcaMap = new Map<string, { ventas: number; ingresos: number }>()
  const ventasPorCategoriaMap = new Map<string, { ventas: number; ingresos: number }>()
  const topVehiculosMap = new Map<string, { vehiculo: string; marca: string; ventas: number; ingresos: number }>()
  const pedidosRecientes: Pedido[] = []

  // Inicializar mapas
  marcasData.forEach((m) => ventasPorMarcaMap.set(m.marca, { ventas: 0, ingresos: 0 }))
  categoriasData.forEach((c) => ventasPorCategoriaMap.set(c.categoria, { ventas: 0, ingresos: 0 }))

  // Ventana base por mes (crece año a año)
  const ventanaBase = 65 // vehículos por mes en el año 1

  const ahora = new Date()
  const añoActual = ahora.getFullYear()
  const mesActual = ahora.getMonth()

  // Generar 36 meses hacia atrás
  for (let i = 35; i >= 0; i--) {
    const fecha = new Date(añoActual, mesActual - i, 1)
    const año = fecha.getFullYear()
    const mes = fecha.getMonth()
    const añoIndex = Math.floor((35 - i) / 12) // 0, 1, 2

    // Crecimiento año a año (~18%)
    const factorCrecimiento = 1 + añoIndex * 0.18
    // Variación aleatoria controlada ±10%
    const variacion = randFloat(0.9, 1.1)
    // Factor estacional
    const estacional = factorEstacional[mes]

    const ventas = Math.round(
      ventanaBase * factorCrecimiento * estacional * variacion
    )

    // Ingresos: depende de las marcas vendidas ese mes
    let ingresosMes = 0
    let clientesMes = 0
    const marcaVentasMes: Record<string, number> = {}

    // Distribuir ventas entre marcas según peso
    for (let v = 0; v < ventas; v++) {
      // Seleccionar marca por peso
      const pesoTotal = marcasData.reduce((s, m) => s + m.peso, 0)
      let r = rng() * pesoTotal
      let marcaSeleccionada = marcasData[0]
      for (const m of marcasData) {
        r -= m.peso
        if (r <= 0) {
          marcaSeleccionada = m
          break
        }
      }
      marcaVentasMes[marcaSeleccionada.marca] = (marcaVentasMes[marcaSeleccionada.marca] || 0) + 1

      // Precio del vehículo con variación
      const precio = Math.round(
        marcaSeleccionada.precioMedio * randFloat(0.85, 1.2)
      )
      ingresosMes += precio

      // Acumular por marca
      const acum = ventasPorMarcaMap.get(marcaSeleccionada.marca)!
      acum.ventas++
      acum.ingresos += precio

      // Seleccionar categoría por peso
      const catPesoTotal = categoriasData.reduce((s, c) => s + c.peso, 0)
      let rc = rng() * catPesoTotal
      let catSeleccionada = categoriasData[0]
      for (const c of categoriasData) {
        rc -= c.peso
        if (rc <= 0) {
          catSeleccionada = c
          break
        }
      }
      const catAcum = ventasPorCategoriaMap.get(catSeleccionada.categoria)!
      catAcum.ventas++
      catAcum.ingresos += precio

      // Track top vehicles
      const modelos = modelosPorMarca[marcaSeleccionada.marca] || [marcaSeleccionada.marca]
      const modeloNombre = modelos[randInt(0, modelos.length - 1)]
      const vehiculoKey = `${marcaSeleccionada.marca} ${modeloNombre}`
      const vehAcum = topVehiculosMap.get(vehiculoKey)
      if (vehAcum) {
        vehAcum.ventas++
        vehAcum.ingresos += precio
      } else {
        topVehiculosMap.set(vehiculoKey, {
          vehiculo: vehiculoKey,
          marca: marcaSeleccionada.marca,
          ventas: 1,
          ingresos: precio,
        })
      }
    }

    // Clientes (algunos compran más de un vehículo)
    clientesMes = Math.round(ventas * randFloat(0.82, 0.92))

    meses.push({
      fecha: fecha.toISOString(),
      año,
      mes,
      mesLabel: `${mesesLabel[mes]} ${año}`,
      ventas,
      ingresos: ingresosMes,
      clientes: clientesMes,
    })

    // Generar algunos pedidos recientes (solo últimos 3 meses)
    if (i < 3) {
      const numPedidos = randInt(4, 8)
      for (let p = 0; p < numPedidos; p++) {
        const marca = marcasData[randInt(0, marcasData.length - 1)]
        const modelos = modelosPorMarca[marca.marca] || [marca.marca]
        const modelo = modelos[randInt(0, modelos.length - 1)]
        const dia = randInt(1, 28)
        const fechaPedido = new Date(año, mes, dia)
        pedidosRecientes.push({
          id: `DM-${fechaPedido.getTime().toString(36).toUpperCase().slice(-6)}-${p}`,
          cliente: nombresCliente[randInt(0, nombresCliente.length - 1)],
          vehiculo: `${marca.marca} ${modelo}`,
          marca: marca.marca,
          fecha: fechaPedido.toISOString(),
          estado: estadosPedido[randInt(0, estadosPedido.length - 1)],
          valor: Math.round(marca.precioMedio * randFloat(0.85, 1.2)),
        })
      }
    }
  }

  // Ordenar pedidos recientes por fecha descendente
  pedidosRecientes.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  // Convertir mapas a arrays ordenados
  const ventasPorMarca = Array.from(ventasPorMarcaMap.entries())
    .map(([marca, data]) => ({ marca, ...data }))
    .sort((a, b) => b.ventas - a.ventas)

  const ventasPorCategoria = Array.from(ventasPorCategoriaMap.entries())
    .map(([categoria, data]) => ({ categoria, ...data }))
    .sort((a, b) => b.ventas - a.ventas)

  const topVehiculos = Array.from(topVehiculosMap.values())
    .sort((a, b) => b.ventas - a.ventas)
    .slice(0, 8)

  // Calcular KPIs
  const ventasTotales = meses.reduce((s, m) => s + m.ingresos, 0)
  const vehiculosVendidos = meses.reduce((s, m) => s + m.ventas, 0)
  const clientes = Math.round(vehiculosVendidos * 0.85) // estimación
  const ticketPromedio = Math.round(ventasTotales / vehiculosVendidos)

  // Crecimiento: comparar último año vs primer año
  const año1Ventas = meses.slice(0, 12).reduce((s, m) => s + m.ingresos, 0)
  const año3Ventas = meses.slice(24, 36).reduce((s, m) => s + m.ingresos, 0)
  const crecimientoAnual = Math.round(((año3Ventas / año1Ventas - 1) / 2) * 100)

  // Tasa de conversión y pedidos pendientes (sintéticos)
  const tasaConversion = randFloat(2.8, 4.2)
  const pedidosPendientes = pedidosRecientes.filter(
    (p) => p.estado === "Pendiente" || p.estado === "En proceso"
  ).length

  return {
    meses,
    ventasPorMarca,
    ventasPorCategoria,
    topVehiculos,
    pedidosRecientes: pedidosRecientes.slice(0, 15),
    kpis: {
      ventasTotales,
      vehiculosVendidos,
      clientes,
      ticketPromedio,
      crecimientoAnual,
      marcasDisponibles: marcasData.length,
      tasaConversion,
      pedidosPendientes,
    },
  }
}
