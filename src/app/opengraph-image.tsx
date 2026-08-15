import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site"

// Static OG image served at /opengraph-image and referenced by metadata
// `openGraph.images`. Generated at build time as a single asset (no DB
// dependency), so it works even when the database is unreachable.

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0d0d0e 0%, #1a1a1c 55%, #0d0d0e 100%)",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#f5f5f5",
              color: "#0d0d0e",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            G
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
              Digital Marketplace
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                color: "#a1a1a3",
                textTransform: "uppercase",
                letterSpacing: 4,
              }}
            >
              Alta Gama
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Pura adrenalina,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              color: "#e8b86d",
            }}
          >
            alta gama.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              color: "#a1a1a3",
              maxWidth: 820,
            }}
          >
            Los automóviles más extraordinarios del mundo, reunidos en una sola colección.
          </div>
        </div>
      </div>
    ),
    size
  )
}
