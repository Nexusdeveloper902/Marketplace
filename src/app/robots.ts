import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

// Dynamic robots.txt served at /robots.txt (Next.js metadata file
// convention). References the sitemap and disallows the auth/checkout/
// admin/checkout paths that should not be indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/carrito",
          "/perfil",
          "/pedidos",
          "/garaje",
          "/login",
          "/registro",
        ],
      },
      // Social crawlers may preview pages behind auth for OG previews.
      {
        userAgent: ["Googlebot", "Bingbot", "Twitterbot", "facebookexternalhit"],
        allow: "/",
      },
    ],
    sitemap: `${siteConfig.url.replace(/\/$/, "")}/sitemap.xml`,
    host: siteConfig.url,
  }
}
