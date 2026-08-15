import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mi perfil",
  description:
    "Gestiona la información de tu cuenta de Digital Marketplace: nombre, correo y configuración personal.",
  alternates: { canonical: "/perfil" },
}

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return children
}
