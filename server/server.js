/**
 * Digital Marketplace — Express server.
 *
 * Serves the static frontend (public/), exposes the REST API under /api/*
 * backed by SQLite, and maps the original Next.js routes to plain HTML
 * pages so URLs like /marketplace, /vehiculos/<slug> or /marcas/<slug>
 * keep working (including page refreshes).
 */
const path = require("path")
const express = require("express")
const { attachUser } = require("./middleware/auth")

// Initialize (and seed on first run) the database.
require("./database/database")

const app = express()
const PORT = process.env.PORT || 3000

app.disable("x-powered-by")
app.use(express.json({ limit: "1mb" }))
app.use(attachUser)

// --- REST API ---------------------------------------------------------------
app.use("/api/auth", require("./routes/auth"))
app.use("/api/vehicles", require("./routes/vehicles"))
app.use("/api/brands", require("./routes/brands"))
app.use("/api/favorites", require("./routes/favorites"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/reviews", require("./routes/reviews"))
app.use("/api/analytics", require("./routes/analytics"))
app.get("/api", (_req, res) => res.json({ message: "Hello, world!" }))
app.get("/api/health", (_req, res) => res.json({ status: "ok" }))

// --- Frontend pages (clean URLs, same routes as the original app) -----------
const PUBLIC_DIR = path.join(__dirname, "..", "public")
const page = (file) => (_req, res) => res.sendFile(path.join(PUBLIC_DIR, "pages", file))

app.get("/", (_req, res) => res.sendFile(path.join(PUBLIC_DIR, "index.html")))
app.get("/marketplace", page("marketplace.html"))
app.get("/vehiculos/:id", page("vehiculo.html"))
app.get("/marcas", page("marcas.html"))
app.get("/marcas/:slug", page("marca.html"))
app.get("/favoritos", page("favoritos.html"))
app.get("/comparar", page("comparar.html"))
app.get("/garaje", page("garaje.html"))
app.get("/carrito", page("carrito.html"))
app.get("/gracias", page("gracias.html"))
app.get("/login", page("login.html"))
app.get("/registro", page("registro.html"))
app.get("/perfil", page("perfil.html"))
app.get("/pedidos", page("pedidos.html"))
app.get("/privacidad", page("privacidad.html"))
app.get("/terminos", page("terminos.html"))
app.get("/admin", page("admin.html"))
app.get("/admin/login", page("admin-login.html"))

// --- Static assets ----------------------------------------------------------
app.use(
  express.static(PUBLIC_DIR, {
    index: false,
    setHeaders: (res, filePath) => {
      // Local development: revalidate HTML/JS/CSS each time; cache media assets.
      if (/\.(html?|css|js)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "no-cache")
      } else {
        res.setHeader("Cache-Control", "public, max-age=86400")
      }
    },
  })
)

// --- 404 --------------------------------------------------------------------
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "No encontrado" })
  }
  return res.status(404).sendFile(path.join(PUBLIC_DIR, "pages", "404.html"))
})

// --- Error handler -----------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: "Error del servidor" })
})

app.listen(PORT, () => {
  console.log(`✅ Digital Marketplace listo en http://localhost:${PORT}`)
})
