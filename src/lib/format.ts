export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(precio)
}

export function formatearNumero(n: number): string {
  return new Intl.NumberFormat("es-ES").format(n)
}
