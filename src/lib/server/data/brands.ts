import { db } from "@/lib/db"
import { slugify } from "../mappers"

export interface BrandSummary {
  id: string
  name: string
  slug: string
  description: string
  cantidad: number
  precioMin: number
  precioMax: number
  imagen: string | null
}

const DEFAULT_DESCRIPTION =
  "Fabricante de automóviles de alta gama."

/** Static brand descriptions, preserved from the original brands-view.tsx. */
export const BRAND_DESCRIPTIONS: Record<string, string> = {
  Porsche: "Ingeniería deportiva alemana sin concesiones desde 1948.",
  Ferrari: "La pasión y el rendimiento de Maranello llevados a la perfección.",
  Lamborghini: "Diseño extremo y potencia salvaje desde Sant'Agata Bolognese.",
  BMW: "Pura alegría de conducir con precisión bávara.",
  "Mercedes-Benz": "Lujo, innovación y herencia automovilística desde 1886.",
  Audi: "Tecnología de vanguardia y diseño progresista alemán.",
  Tesla: "La revolución eléctrica que transformó la industria.",
  Toyota: "Fiabilidad legendaria y espíritu Gazoo Racing.",
  Honda: "Ingeniería eficiente con alma deportiva japonesa.",
  Ford: "Herencia americana y muscle car desde 1903.",
  Chevrolet: "El corazón performance de América desde 1911.",
  Nissan: "Innovación japonesa y el ADN de Godzilla.",
  McLaren: "Tecnología de F1 aplicada a superdeportivos de carretera.",
  "Aston Martin": "Elegancia y potencia británicas con más de un siglo de historia.",
  Bentley: "Lujo artesanal británico con alma de gran turismo.",
  "Rolls-Royce": "La cúspide absoluta del lujo automovilístico mundial.",
  Lexus: "Refinamiento japonés y fiabilidad híbrida premium.",
  Volvo: "Seguridad escandinava y diseño minimalista atemporal.",
  Rivian: "Aventura eléctrica con vehículos todoterreno de nueva generación.",
  BYD: "Electromovilidad china líder mundial con batería Blade.",
  Dodge: "Muscle car americano en su forma más brutal.",
  Jeep: "Capacidad todoterreno legendaria desde 1941.",
  Subaru: "Bóxer y tracción simétrica, nacido para la aventura.",
  Peugeot: "Diseño francés elegante y ingeniería deportiva.",
  Renault: "Innovación francesa con espíritu de competición.",
  Suzuki: "Compactos ágiles y todoterreno sin concesiones.",
  Mazda: "Diseño Kodo y la filosofía Jinba-Ittai.",
  Hyundai: "Performance N y tecnología eléctrica de vanguardia.",
  Kia: "Diseño audaz y electromovilidad accesible.",
  Volkswagen: "Pragmatismo alemán para el conductor cotidiano.",
}

export function brandDescription(name: string): string {
  return BRAND_DESCRIPTIONS[name] ?? DEFAULT_DESCRIPTION
}

export async function listBrands(): Promise<BrandSummary[]> {
  const brands = await db.brand.findMany({ orderBy: { name: "asc" } })
  const vehicles = await db.vehicle.findMany({
    where: { available: true },
    select: { marca: true, precio: true, images: true },
  })
  return brands.map((b) => {
    const modelos = vehicles.filter((v) => v.marca === b.name)
    const precios = modelos.map((v) => v.precio)
    let imagen: string | null = null
    try {
      const imgs = JSON.parse(modelos[0]?.images ?? "[]") as string[]
      imagen = imgs[0] ?? null
    } catch {
      imagen = null
    }
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      description: b.description || brandDescription(b.name),
      cantidad: modelos.length,
      precioMin: precios.length ? Math.min(...precios) : 0,
      precioMax: precios.length ? Math.max(...precios) : 0,
      imagen,
    }
  })
}

export async function getBrandBySlug(slug: string) {
  return db.brand.findUnique({ where: { slug } })
}

export async function getBrandNameBySlug(slug: string): Promise<string | null> {
  const brand = await getBrandBySlug(slug)
  return brand?.name ?? null
}

export function slugToMarcaSync(brands: { name: string; slug: string }[], slug: string): string | null {
  return brands.find((b) => b.slug === slug)?.name ?? null
}

export { slugify }
