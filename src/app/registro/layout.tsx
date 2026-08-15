import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Regístrate en Digital Marketplace y conserva tus favoritos, historial de pedidos y garaje privado en todos tus dispositivos.",
  alternates: { canonical: "/registro" },
}

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return children
}
