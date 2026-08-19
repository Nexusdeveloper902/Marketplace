/**
 * Row → DTO mappers. The frontend Vehicle.id is the stable slug so routes
 * like /vehiculos/[id] keep working unchanged (same convention as the
 * original project).
 */
function toVehicleDTO(v) {
  let imagenes = []
  try {
    imagenes = JSON.parse(v.images)
    if (!Array.isArray(imagenes)) imagenes = []
  } catch {
    imagenes = []
  }
  return {
    id: v.slug,
    marca: v.marca,
    modelo: v.modelo,
    año: v["año"],
    precio: v.precio,
    motor: v.motor,
    potencia: v.potencia,
    torque: v.torque,
    transmision: v.transmision,
    combustible: v.combustible,
    traccion: v.traccion,
    velocidadMaxima: v.velocidadMaxima,
    aceleracion0a100: v.aceleracion0a100,
    categoria: v.categoria,
    descripcion: v.descripcion,
    imagenes,
    stock: v.stock,
    available: Boolean(v.available),
  }
}

module.exports = { toVehicleDTO }
