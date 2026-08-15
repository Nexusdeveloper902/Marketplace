import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site"

// Apple touch icon (180×180) generated as a PNG route. Next.js metadata
// file convention: served at /apple-icon and referenced in metadata.icons.

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0e",
          fontSize: 110,
          fontWeight: 700,
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        G
      </div>
    ),
    size
  )
}
