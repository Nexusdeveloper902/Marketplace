/**
 * Seed script — faithful port of prisma/seed.ts to SQLite (better-sqlite3).
 *
 * Deterministic (mulberry32 PRNG seeded at 1337) so demo data is reproducible:
 * brands, 88 vehicles, demo admin + users, ~60 historical orders over 24
 * months, favorites, reviews and analytics events.
 *
 * Usage: node server/database/seed.js [--reset]
 */
const { vehiculos } = require("./vehicles-data")
const { hashPasswordSync } = require("../lib/password")
const { slugify } = require("../lib/slug")
const { BRAND_DESCRIPTIONS } = require("../lib/brand-descriptions")

// Deterministic PRNG (mulberry32) so demo data is reproducible.
function crearRng(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createId() {
  return (
    "c" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 6)
  )
}

function run(db) {
  const rng = crearRng(1337)
  const randInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min
  const pick = (arr) => arr[Math.floor(rng() * arr.length)]

  console.log("🌱 Seeding LUXICAR database…")

  const insertBrand = db.prepare(
    `INSERT INTO brands (id, name, slug, description) VALUES (?, ?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET name = excluded.name, description = excluded.description`
  )
  const insertVehicle = db.prepare(
    `INSERT INTO vehicles (id, slug, marca, modelo, "año", precio, motor, potencia, torque,
        transmision, combustible, traccion, velocidadMaxima, aceleracion0a100, categoria,
        descripcion, images, stock, available, featured, brandId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET
        marca = excluded.marca, modelo = excluded.modelo, "año" = excluded."año",
        precio = excluded.precio, motor = excluded.motor, potencia = excluded.potencia,
        torque = excluded.torque, transmision = excluded.transmision,
        combustible = excluded.combustible, traccion = excluded.traccion,
        velocidadMaxima = excluded.velocidadMaxima, aceleracion0a100 = excluded.aceleracion0a100,
        categoria = excluded.categoria, descripcion = excluded.descripcion,
        images = excluded.images, stock = excluded.stock, available = excluded.available,
        featured = excluded.featured, brandId = excluded.brandId`
  )

  // --- Brands ---
  const brandNames = Array.from(new Set(vehiculos.map((v) => v.marca))).sort()
  const seedAll = db.transaction(() => {
    for (const name of brandNames) {
      insertBrand.run(createId(), name, slugify(name), BRAND_DESCRIPTIONS[name] ?? "")
    }
    const brands = db.prepare("SELECT * FROM brands").all()
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
      insertVehicle.run(
        createId(), v.id, v.marca, v.modelo, v.año, v.precio, v.motor, v.potencia,
        v.torque, v.transmision, v.combustible, v.traccion, v.velocidadMaxima,
        v.aceleracion0a100, v.categoria, v.descripcion, JSON.stringify(v.imagenes),
        stock, stock > 0 ? 1 : 0, featured ? 1 : 0, brand?.id ?? null
      )
    }
    console.log(`  ✓ ${vehiculos.length} vehículos (${featuredCount} destacados)`)

    // --- Demo admin ---
    const upsertUser = db.prepare(
      `INSERT INTO users (id, email, name, passwordHash, role) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET name = excluded.name`
    )
    upsertUser.run(createId(), "admin@luxicar.com", "Administrador LUXICAR", hashPasswordSync("admin123"), "ADMIN")
    console.log("  ✓ Admin: admin@luxicar.com / admin123")

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
      upsertUser.run(createId(), u.email, u.name, hashPasswordSync("demo1234"), "USER")
    }
    const users = db.prepare("SELECT * FROM users WHERE role = 'USER'").all()
    console.log(`  ✓ ${users.length} usuarios demo`)

    // --- Demo orders (historical, deterministic) ---
    const allVehicles = db.prepare("SELECT * FROM vehicles").all()
    // Reset stock to a baseline per vehicle.
    const setStock = db.prepare("UPDATE vehicles SET stock = ?, available = ? WHERE id = ?")
    for (const v of allVehicles) {
      const baseStock = rng() < 0.7 ? 1 : randInt(2, 4)
      setStock.run(baseStock, baseStock > 0 ? 1 : 0, v.id)
    }

    const orderStatuses = ["COMPLETED", "COMPLETED", "COMPLETED", "PROCESSING", "PENDING", "CANCELLED"]
    let orderNumberSeq = 1
    const startYear = new Date().getFullYear() - 2 // ~24 months of history
    const now = new Date()

    const insertOrder = db.prepare(
      `INSERT INTO orders (id, number, userId, status, total, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    const insertItem = db.prepare(
      `INSERT INTO order_items (id, orderId, vehicleId, priceAtPurchase, quantity)
       VALUES (?, ?, ?, ?, ?)`
    )
    const decrement = db.prepare("UPDATE vehicles SET stock = stock - 1 WHERE id = ?")
    const markSoldOut = db.prepare("UPDATE vehicles SET available = 0, stock = 0 WHERE id = ? AND stock <= 0")
    const insertEvent = db.prepare(
      `INSERT INTO events (id, type, userId, vehicleId, orderId, metadata, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    const findOrder = db.prepare("SELECT id FROM orders WHERE number = ?")

    // Generate ~60 historical orders spread over the last 24 months.
    for (let i = 0; i < 60; i++) {
      const monthsAgo = randInt(0, 23)
      const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, randInt(1, 28))
      if (date > now) continue
      const user = pick(users)
      // 1-2 vehicles per order
      const itemCount = rng() < 0.75 ? 1 : 2
      const chosen = []
      while (chosen.length < itemCount) {
        const v = pick(allVehicles)
        if (!chosen.find((c) => c.id === v.id)) chosen.push(v)
      }

      const status = pick(orderStatuses)
      let total = 0
      for (const v of chosen) total += v.precio

      const year = date.getFullYear()
      const number = `LXC-${year}-${String(orderNumberSeq).padStart(5, "0")}`
      orderNumberSeq++
      if (findOrder.get(number)) continue

      const orderId = createId()
      const iso = date.toISOString()
      insertOrder.run(orderId, number, user.id, status, total, iso, iso)
      for (const v of chosen) {
        insertItem.run(createId(), orderId, v.id, v.precio, 1)
      }

      // For completed orders, decrement stock (reflecting sold inventory).
      if (status === "COMPLETED") {
        for (const v of chosen) {
          decrement.run(v.id)
          markSoldOut.run(v.id)
        }
        insertEvent.run(createId(), "PURCHASE_COMPLETED", user.id, null, orderId, JSON.stringify({ total }), iso)
      }
    }
    console.log("  ✓ ~60 pedidos históricos generados")

    // --- Demo favorites ---
    const insertFav = db.prepare(
      "INSERT OR IGNORE INTO favorites (id, userId, vehicleId) VALUES (?, ?, ?)"
    )
    for (const u of users) {
      const count = randInt(2, 6)
      const chosen = new Set()
      while (chosen.size < count) chosen.add(pick(allVehicles).id)
      for (const vehicleId of chosen) {
        insertFav.run(createId(), u.id, vehicleId)
      }
    }
    console.log("  ✓ Favoritos demo generados")

    // --- Demo reviews (only for purchased vehicles) ---
    const completedOrders = db
      .prepare("SELECT * FROM orders WHERE status = 'COMPLETED'")
      .all()
    const itemsOfOrder = db.prepare("SELECT * FROM order_items WHERE orderId = ?")
    const insertReview = db.prepare(
      `INSERT OR IGNORE INTO reviews (id, userId, vehicleId, rating, comment, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
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
      const item = pick(itemsOfOrder.all(o.id))
      insertReview.run(createId(), o.userId, item.vehicleId, randInt(4, 5), pick(reviewComments), o.createdAt, o.createdAt)
    }
    console.log("  ✓ Reseñas demo generadas")

    // --- Demo view/cart events for analytics ---
    for (let i = 0; i < 200; i++) {
      const v = pick(allVehicles)
      const monthsAgo = randInt(0, 11)
      const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, randInt(1, 28))
      insertEvent.run(createId(), "VEHICLE_VIEWED", null, v.id, null, "{}", date.toISOString())
    }
    for (let i = 0; i < 40; i++) {
      const v = pick(allVehicles)
      const monthsAgo = randInt(0, 11)
      const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, randInt(1, 28))
      insertEvent.run(createId(), "CART_ADDED", null, v.id, null, "{}", date.toISOString())
    }
    console.log("  ✓ Eventos analíticos generados")

    // --- Restore shoppable inventory ---
    db.prepare("UPDATE vehicles SET stock = 1, available = 1 WHERE stock = 0").run()
    db.prepare("UPDATE vehicles SET stock = 2, available = 1 WHERE stock = 1").run()
    db.prepare("UPDATE vehicles SET available = 1 WHERE stock >= 2").run()
    const restocked = db.prepare("SELECT SUM(stock) AS total, COUNT(*) AS count FROM vehicles").get()
    console.log(`  ✓ Inventario restaurado (${restocked.total} unidades en ${restocked.count} vehículos)`)
  })

  seedAll()
  console.log("✅ Seed completado.")
}

// Standalone CLI: node server/database/seed.js [--reset]
if (require.main === module) {
  const Database = require("better-sqlite3")
  const path = require("path")
  const fs = require("fs")
  const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, "marketplace.db")
  if (process.argv.includes("--reset") && fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH)
    console.log("Base de datos eliminada.")
  }
  const db = new Database(DB_PATH)
  db.pragma("foreign_keys = ON")
  db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"))
  run(db)
  db.close()
}

module.exports = { run }
