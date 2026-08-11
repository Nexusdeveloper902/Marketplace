import { PrismaClient } from "@prisma/client"
import { vehiculos } from "../src/data/vehicles"
import { hashPasswordSync } from "../src/lib/server/password"
import { slugify } from "../src/lib/server/mappers"
import { BRAND_DESCRIPTIONS } from "../src/lib/server/data/brands"

const db = new PrismaClient()

// Deterministic PRNG (mulberry32) so demo data is reproducible.
function crearRng(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rng = crearRng(1337)
function randInt(min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

async function main() {
  console.log("🌱 Seeding LUXICAR database…")

  // --- Brands ---
  const brandNames = Array.from(new Set(vehiculos.map((v) => v.marca))).sort()
  for (const name of brandNames) {
    await db.brand.upsert({
      where: { slug: slugify(name) },
      update: { name, description: BRAND_DESCRIPTIONS[name] ?? "" },
      create: {
        name,
        slug: slugify(name),
        description: BRAND_DESCRIPTIONS[name] ?? "",
      },
    })
  }
  const brands = await db.brand.findMany()
  const brandBySlug = new Map(brands.map((b) => [b.slug, b]))
  console.log(`  ✓ ${brands.length} marcas`)

  // --- Vehicles (preserve existing slug IDs) ---
  let featuredCount = 0
  for (const v of vehiculos) {
    const brand = brandBySlug.get(slugify(v.marca))
    // Deterministic stock: most luxury vehicles have stock 1, some 2-4.
    const stock = rng() < 0.7 ? 1 : randInt(2, 4)
    // ~15% featured, deterministic.
    const featured = rng() < 0.15
    if (featured) featuredCount++
    await db.vehicle.upsert({
      where: { slug: v.id },
      update: {
        marca: v.marca,
        modelo: v.modelo,
        año: v.año,
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
        images: JSON.stringify(v.imagenes),
        stock,
        available: stock > 0,
        featured,
        brandId: brand?.id ?? null,
      },
      create: {
        slug: v.id,
        marca: v.marca,
        modelo: v.modelo,
        año: v.año,
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
        images: JSON.stringify(v.imagenes),
        stock,
        available: stock > 0,
        featured,
        brandId: brand?.id ?? null,
      },
    })
  }
  console.log(`  ✓ ${vehiculos.length} vehículos (${featuredCount} destacados)`)

  // --- Demo admin ---
  const adminEmail = "admin@luxicar.com"
  const adminPassword = "admin123"
  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrador LUXICAR",
      passwordHash: hashPasswordSync(adminPassword),
      role: "ADMIN",
    },
  })
  console.log(`  ✓ Admin: ${adminEmail} / ${adminPassword}`)

  // --- Demo users ---
  const demoUsers = [
    { name: "Carlos García", email: "carlos@demo.com" },
    { name: "María López", email: "maria@demo.com" },
    { name: "Juan Martínez", email: "juan@demo.com" },
    { name: "Ana Rodríguez", email: "ana@demo.com" },
    { name: "Pedro Sánchez", email: "pedro@demo.com" },
    { name: "Laura Fernández", email: "laura@demo.com" },
    { name: "Diego Pérez", email: "diego@demo.com" },
    { name: "Sofía Gómez", email: "sofia@demo.com" },
  ]
  for (const u of demoUsers) {
    await db.user.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: {
        email: u.email,
        name: u.name,
        passwordHash: hashPasswordSync("demo1234"),
        role: "USER",
      },
    })
  }
  const users = await db.user.findMany({ where: { role: "USER" } })
  console.log(`  ✓ ${users.length} usuarios demo`)

  // --- Demo orders (historical, deterministic) ---
  const allVehicles = await db.vehicle.findMany()
  // Reset stock to full for seeded historical scenario, then we'll decrement
  // based on completed purchases so inventory reflects "sold" units.
  // To keep the catalog shoppable, we restore a baseline stock per vehicle.
  for (const v of allVehicles) {
    const baseStock = rng() < 0.7 ? 1 : randInt(2, 4)
    await db.vehicle.update({
      where: { id: v.id },
      data: { stock: baseStock, available: baseStock > 0 },
    })
  }

  const orderStatuses = ["COMPLETED", "COMPLETED", "COMPLETED", "PROCESSING", "PENDING", "CANCELLED"]
  let orderNumberSeq = 1
  const startYear = new Date().getFullYear() - 2 // ~24 months of history
  const now = new Date()

  // Generate ~60 historical orders spread over the last 24 months.
  for (let i = 0; i < 60; i++) {
    const monthsAgo = randInt(0, 23)
    const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, randInt(1, 28))
    if (date > now) continue
    const user = pick(users)
    // 1-2 vehicles per order
    const itemCount = rng() < 0.75 ? 1 : 2
    const chosen: typeof allVehicles = []
    while (chosen.length < itemCount) {
      const v = pick(allVehicles)
      if (!chosen.find((c) => c.id === v.id)) chosen.push(v)
    }

    const status = pick(orderStatuses)
    let total = 0
    const itemsData = chosen.map((v) => {
      total += v.precio
      return { vehicleId: v.id, priceAtPurchase: v.precio, quantity: 1 }
    })

    const year = date.getFullYear()
    const number = `LXC-${year}-${String(orderNumberSeq).padStart(5, "0")}`
    orderNumberSeq++

    const existing = await db.order.findUnique({ where: { number } })
    if (existing) continue

    const order = await db.order.create({
      data: {
        number,
        userId: user.id,
        status,
        total,
        createdAt: date,
        updatedAt: date,
        items: { create: itemsData },
      },
    })

    // For completed orders, decrement stock (reflecting sold inventory).
    if (status === "COMPLETED") {
      for (const v of chosen) {
        const updated = await db.vehicle.update({
          where: { id: v.id },
          data: {
            stock: { decrement: 1 },
          },
        })
        if (updated.stock <= 0) {
          await db.vehicle.update({
            where: { id: v.id },
            data: { available: false, stock: 0 },
          })
        }
      }
      // Track purchase event.
      await db.event.create({
        data: {
          type: "PURCHASE_COMPLETED",
          userId: user.id,
          orderId: order.id,
          metadata: JSON.stringify({ total }),
          createdAt: date,
        },
      })
    }
  }
  console.log(`  ✓ ~60 pedidos históricos generados`)

  // --- Demo favorites ---
  for (const u of users) {
    const count = randInt(2, 6)
    const chosen = new Set<string>()
    while (chosen.size < count) chosen.add(pick(allVehicles).id)
    for (const vehicleId of chosen) {
      await db.favorite
        .create({ data: { userId: u.id, vehicleId } })
        .catch(() => {}) // ignore duplicates
    }
  }
  console.log(`  ✓ Favoritos demo generados`)

  // --- Demo reviews (only for purchased vehicles) ---
  const completedOrders = await db.order.findMany({
    where: { status: "COMPLETED" },
    include: { items: true },
  })
  const reviewComments = [
    "Experiencia de compra impecable. El vehículo supera todas las expectativas.",
    "Rendimiento espectacular y acabados de lujo. Muy recomendable.",
    "Una obra de arte sobre ruedas. La entrega fue inmediata.",
    "Potencia refinada y comodidad absoluta. Vale cada dólar.",
    "Diseño impresionante y tecnología de vanguardia. Encantado.",
    "Conducción pura y sensación premium en cada detalle.",
  ]
  for (const o of completedOrders) {
    // ~40% of purchased vehicles get a review
    if (rng() > 0.4) continue
    const item = pick(o.items)
    await db.review
      .create({
        data: {
          userId: o.userId,
          vehicleId: item.vehicleId,
          rating: randInt(4, 5),
          comment: pick(reviewComments),
          createdAt: o.createdAt,
          updatedAt: o.createdAt,
        },
      })
      .catch(() => {})
  }
  console.log(`  ✓ Reseñas demo generadas`)

  // --- Demo view/favorite/cart events for analytics ---
  for (let i = 0; i < 200; i++) {
    const v = pick(allVehicles)
    const monthsAgo = randInt(0, 11)
    const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, randInt(1, 28))
    await db.event.create({
      data: {
        type: "VEHICLE_VIEWED",
        vehicleId: v.id,
        metadata: "{}",
        createdAt: date,
      },
    })
  }
  for (let i = 0; i < 40; i++) {
    const v = pick(allVehicles)
    const monthsAgo = randInt(0, 11)
    const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, randInt(1, 28))
    await db.event.create({
      data: {
        type: "CART_ADDED",
        vehicleId: v.id,
        metadata: "{}",
        createdAt: date,
      },
    })
  }
  console.log(`  ✓ Eventos analíticos generados`)

  console.log("✅ Seed completado.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
