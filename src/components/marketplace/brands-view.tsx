"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Gauge } from "lucide-react"
import { vehiculos, marcas } from "@/data/vehicles"
import { formatearPrecio } from "@/lib/format"
import { SmartImage } from "@/components/ui/smart-image"

// Descripciones breves para cada marca.
const descripcionesMarcas: Record<string, string> = {
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

export function BrandsView() {
  const datosMarcas = marcas.map((marca) => {
    const modelos = vehiculos.filter((v) => v.marca === marca)
    const precioMin = Math.min(...modelos.map((v) => v.precio))
    const precioMax = Math.max(...modelos.map((v) => v.precio))
    return {
      marca,
      cantidad: modelos.length,
      precioMin,
      precioMax,
      imagen: modelos[0]?.imagenes[0] ?? null,
      descripcion: descripcionesMarcas[marca] ?? "Fabricante de automóviles de alta gama.",
    }
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/40 pb-10 pt-14 sm:pt-20"
      >
        <p className="text-eyebrow text-[11px] text-[var(--signature)]">
          Explora los fabricantes
        </p>
        <h1 className="text-display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl">
          Marcas disponibles
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Descubre los fabricantes más prestigiosos del mundo. Cada marca ofrece
          una selección única de vehículos con su propio carácter y herencia.
        </p>
      </motion.section>

      <section className="mt-8 pb-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {datosMarcas.map((datos, i) => (
            <motion.div
              key={datos.marca}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: Math.min(i * 0.04, 0.4),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/marcas/${datos.marca.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                className="group block overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-500 hover:border-border hover:shadow-[0_20px_50px_-12px_oklch(0_0_0/0.7)]"
              >
                {/* Imagen representativa */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
                  {datos.imagen ? (
                    <SmartImage
                      src={datos.imagen}
                      alt={`Vehículo destacado de ${datos.marca}`}
                      containerClassName="h-full w-full"
                      className="object-cover opacity-70 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-90"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-3xl font-bold text-muted-foreground/40">
                        {datos.marca.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  {/* Inicial de la marca como logo */}
                  <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-background/70 text-base font-bold text-foreground backdrop-blur-md">
                    {datos.marca.charAt(0)}
                  </span>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {datos.marca}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {datos.descripcion}
                  </p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Modelos
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {datos.cantidad}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Desde
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatearPrecio(datos.precioMin)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-foreground">
                    Ver modelos
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
