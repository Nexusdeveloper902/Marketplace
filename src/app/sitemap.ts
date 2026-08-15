import type { MetadataRoute } from "next"
import { siteConfig, absoluteUrl } from "@/lib/site"
import { listAllVehicles } from "@/lib/server/data/vehicles"
import { listBrands } from "@/lib/server/data/brands"

// Dynamic sitemap.xml (Next.js metadata file convention). Includes the
// static marketing routes plus a DB-backed entry per vehicle and brand.
// When the database is unreachable (e.g. during a prerender crawl) we
// still emit the static routes so the sitemap never 500s.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ahora = new Date()

  const estaticas: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: ahora, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/marketplace"), lastModified: ahora, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/marcas"), lastModified: ahora, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/comparar"), lastModified: ahora, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/privacidad"), lastModified: ahora, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terminos"), lastModified: ahora, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/gracias"), lastModified: ahora, changeFrequency: "yearly", priority: 0.3 },
  ]

  let marcas: MetadataRoute.Sitemap = []
  let vehiculos: MetadataRoute.Sitemap = []

  try {
    const [brandRows, vehicleSlugs] = await Promise.all([listBrands(), listAllVehicles()])
    marcas = brandRows.map((b) => ({
      url: absoluteUrl(`/marcas/${b.slug}`),
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.7,
    }))
    vehiculos = vehicleSlugs.map((v) => ({
      url: absoluteUrl(`/vehiculos/${v.id}`),
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.6,
    }))
  } catch {
    // DB unreachable during a prerender crawl — emit the static routes only.
  }

  return [...estaticas, ...marcas, ...vehiculos]
}
