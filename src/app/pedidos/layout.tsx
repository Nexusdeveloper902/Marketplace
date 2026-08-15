import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mis pedidos",
  description:
    "Consulta el estado y los detalles de tus pedidos en Digital Marketplace.",
  alternates: { canonical: "/pedidos" },
}

export default function PedidosLayout({ children }: { children: React.ReactNode }) {
  return children
}
