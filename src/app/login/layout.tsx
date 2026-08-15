import type { Metadata } from "next"

// Metadata for the client-rendered login page. Next.js merges page-level
// metadata with layout metadata, and a layout is the only place a client
// page can get server metadata without dropping "use client".
export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Accede a tu cuenta de Digital Marketplace para conservar tus favoritos, pedidos y vehículos comprados en todos tus dispositivos.",
  alternates: { canonical: "/login" },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
