export interface Vehicle {
  id: string
  marca: string
  modelo: string
  año: number
  precio: number
  motor: string
  potencia: number // HP
  transmision: string
  combustible: string
  velocidadMaxima: number // km/h
  descripcion: string
  imagenes: string[]
}

export type Vista = "marketplace" | "detalle" | "garaje"
