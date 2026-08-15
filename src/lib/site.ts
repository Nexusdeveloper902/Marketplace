/**
 * Centralized site metadata + business contact info.
 *
 * Single source of truth for the app name, base URL, OG defaults, and
 * the real business contact details used in the footer, privacy policy,
 * and terms pages. Update values here and they propagate everywhere.
 */

export const siteConfig = {
  name: "Digital Marketplace",
  tagline: "Vehículos de Alta Gama",
  description:
    "Marketplace digital de vehículos de alta gama. Descubre, compara y adquiere los modelos más exclusivos del mundo en una experiencia de compra premium.",
  // Production origin — used for absolute URLs in metadata, sitemap and
  // robots. Falls back to the Vercel preview URL when deployed there.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "https://digital-marketplace.example.com"),
  locale: "es_ES",
  keywords: [
    "Digital Marketplace",
    "vehículos",
    "autos",
    "coches",
    "deportivos",
    "supercars",
    "marketplace",
    "alta gama",
  ],
  // Real business contact info surfaced in the footer + legal pages.
  contact: {
    company: "Digital Marketplace S.L.",
    addressLine1: "Calle de Velázquez 53, 3º",
    addressLine2: "28001 Madrid, España",
    email: "hola@digital-marketplace.example.com",
    phone: "+34 910 000 000",
    vatId: "ES-B12345678",
  },
  social: {
    twitter: "@digitalmarketplace",
  },
} as const

/** Absolute URL helper for metadata / sitemap. */
export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

/** Build a per-page title with the site name suffix. */
export function pageTitle(page: string): string {
  return `${page} · ${siteConfig.name}`
}
