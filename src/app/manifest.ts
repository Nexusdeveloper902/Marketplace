import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

// Web app manifest served at /manifest.webmanifest (Next.js metadata file
// convention). Wired to the favicon/icon set in the root layout metadata.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0e",
    theme_color: "#0d0d0e",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon.ico", sizes: "32x32", type: "image/x-icon" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  }
}
