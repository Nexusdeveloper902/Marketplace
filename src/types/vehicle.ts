export type CategoriaVehiculo =
  | "Sedán"
  | "SUV"
  | "Coupé"
  | "Hatchback"
  | "Convertible"
  | "Pickup"
  | "Deportivo"
  | "Superdeportivo"
  | "Familiar"

export interface Vehicle {
  id: string
  marca: string
  modelo: string
  año: number
  precio: number
  motor: string
  potencia: number // HP
  torque: number // Nm
  transmision: string
  combustible: string
  traccion: string
  velocidadMaxima: number // km/h
  aceleracion0a100: number // segundos
  categoria: CategoriaVehiculo
  descripcion: string
  imagenes: string[]
  /** Unidades disponibles en inventario (omitido en datos estáticos = ilimitado). */
  stock?: number
  /** Si el vehículo puede comprarse actualmente (omitido = true). */
  available?: boolean
}

/** ¿Se puede añadir este vehículo al carrito? */
export function estaDisponible(v: Vehicle): boolean {
  return v.available !== false && (v.stock ?? 1) > 0
}

// Categorías disponibles para los filtros.
export const CATEGORIAS: CategoriaVehiculo[] = [
  "Sedán",
  "SUV",
  "Coupé",
  "Hatchback",
  "Convertible",
  "Pickup",
  "Deportivo",
  "Superdeportivo",
  "Familiar",
]

// Combustibles disponibles para los filtros.
export const COMBUSTIBLES: string[] = [
  "Gasolina",
  "Híbrido",
  "Eléctrico",
  "Diésel",
]

// Tipos de tracción disponibles para los filtros.
export const TRACCIONES: string[] = ["AWD", "RWD", "FWD", "4WD"]
