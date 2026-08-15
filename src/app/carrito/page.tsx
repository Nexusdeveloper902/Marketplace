import type { Metadata } from "next"
import { SiteShell } from "@/components/layout/site-shell"
import { CartView } from "@/components/marketplace/cart-view"

export const metadata: Metadata = {
  title: "Carrito",
  description:
    "Revisa los vehículos que has añadido a tu carrito y completa la compra de forma segura en Digital Marketplace.",
  alternates: { canonical: "/carrito" },
}

export default function CarritoPage() {
  return (
    <SiteShell>
      <CartView />
    </SiteShell>
  )
}
