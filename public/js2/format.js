/** Formatting helpers — port of src/lib/format.ts. */
export function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(precio)
}

export function formatearNumero(n) {
  return new Intl.NumberFormat("es-ES").format(n)
}

export function formatFecha(iso, opciones = { day: "numeric", month: "long", year: "numeric" }) {
  try {
    return new Date(iso).toLocaleDateString("es-ES", opciones)
  } catch {
    return iso
  }
}
