/**
 * Local data layer — replaces the Express REST API entirely.
 * Same method signatures as the old public/js2/api.js, backed by SEED data +
 * localStorage persistence. All functions resolve asynchronously so the page
 * code (await api.x()) continues to work unchanged.
 */
var USER_KEY = "luxi_user"
var USERS_KEY = "luxi_users"
var FAVORITES_KEY = "luxi_favorites"
var ORDERS_KEY = "luxi_orders"
var STOCK_KEY = "luxi_stock"
var REVIEWS_KEY = "luxi_reviews"
var EVENTS_KEY = "luxi_events"

function load(key, fallback) {
  try {
    var raw = localStorage.getItem(key)
    if (!raw) return fallback
    var parsed = JSON.parse(raw)
    return parsed == null ? fallback : parsed
  } catch (e) { return fallback }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch (e) {}
}

function clone(o) { return JSON.parse(JSON.stringify(o)) }

// ------- vehicle helpers (mutable stock/available overrides) -------------
function vehicleBySlug(slug) {
  return SEED.vehicles.find(function (v) { return v.slug === slug }) || null
}
function stockMap() { return load(STOCK_KEY, {}) }
function effectiveVehicle(v) {
  if (!v) return null
  var stock = stockMap()[v.slug]
  var imagenes = []
  try {
    imagenes = typeof v.images === "string" ? JSON.parse(v.images) : v.images
    if (!Array.isArray(imagenes)) imagenes = []
  } catch (e) { imagenes = [] }
  return {
    id: v.slug,
    marca: v.marca,
    modelo: v.modelo,
    "año": v["año"],
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
    imagenes: imagenes,
    destacado: Boolean(v.featured),
    stock: stock ? stock.stock : v.stock,
    available: stock ? Boolean(stock.available) : Boolean(v.available),
  }
}
function allVehicles() {
  return SEED.vehicles.map(effectiveVehicle)
}

// ------- users/session ----------------------------------------------------
function allUsers() {
  var extra = load(USERS_KEY, [])
  return SEED.users.concat(extra)
}
function publicUser(u) {
  if (!u) return null
  return { id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }
}
function sessionUser() { return load(USER_KEY, null) }

// ------- favorites --------------------------------------------------------
function favoritesOf(userId) {
  if (!userId) return []
  var map = load(FAVORITES_KEY, {})
  var base = SEED.favorites
    .filter(function (f) { return f.userId === userId })
    .map(function (f) {
      var v = vehicleBySlug(f.vehicleId) || null
      return f.vehicleId
    })
  var extra = map[userId] || []
  var vById = {}
  SEED.vehicles.forEach(function (v) { vById[v.id] = v.slug })
  var slugs = base.map(function (id) { return vById[id] || id })
  var set = {}
  slugs.concat(extra).forEach(function (s) { set[s] = true })
  return Object.keys(set)
}
function persistFavorites(userId, slugs) {
  var map = load(FAVORITES_KEY, {})
  map[userId] = slugs
  save(FAVORITES_KEY, map)
}

// ------- orders ------------------------------------------------------------
function allOrders() {
  var local = load(ORDERS_KEY, [])
  return SEED.orders.concat(local)
}
function orderItems(orderId) {
  var byOrder = {}
  SEED["order_items"].forEach(function (it) {
    (byOrder[it.orderId] = byOrder[it.orderId] || []).push(it)
  })
  load(ORDERS_KEY, []).forEach(function (o) {
    (o.items || []).forEach(function (it) {
      (byOrder[o.id] = byOrder[o.id] || []).push(it)
    })
  })
  return byOrder[orderId] || []
}
var ORDER_STATUS_LABELS = {
  PENDING: "Pendiente",
  PROCESSING: "En proceso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
}
var BRAND_DESCRIPTIONS = {
  Porsche: "Ingeniería deportiva alemana sin concesiones desde 1948.",
  Ferrari: "La pasión y el rendimiento de Maranello llevados a la perfección.",
  Lamborghini: "Diseño extremo y potencia salvaje desde Sant'Agata Bolognese.",
  BMW: "Pura alegría de conducir con precisión bávara.",
  "Mercedes-Benz": "Lujo, innovación y herencia automovilística desde 1886.",
  Audi: "Tecnología de vanguardia y diseño progresista alemán.",
  Tesla: "La revolución eléctrica que transformó la industria.",
  Toyota: "Fiabilidad legendaria y espíritu Gazoo Racing.",
  Honda: "Ingeniería eficiente con alma deportiva japonesa.",
  Ford: "Herencia americana y muscle car desde 1903.",
  Chevrolet: "El corazón performance de América desde 1911.",
  Nissan: "Innovación japonesa y el ADN de Godzilla.",
  McLaren: "Tecnología de F1 aplicada a superdeportivos de carretera.",
  "Aston Martin": "Elegancia y potencia británicas con más de un siglo de historia.",
  Bentley: "Lujo artesanal británico con alma de gran turismo.",
  "Rolls-Royce": "La cúspide absoluta del lujo automovilístico mundial.",
  Lexus: "Refinamiento japonés y fiabilidad híbrida premium.",
  Volvo: "Seguridad escandinava y diseño minimalista atemporal.",
  Rivian: "Aventura eléctrica con vehículos todoterreno de nueva generación.",
  BYD: "Electromovilidad china líder mundial con batería Blade.",
  Dodge: "Muscle car americano en su forma más brutal.",
  Jeep: "Capacidad todoterreno legendaria desde 1941.",
  Subaru: "Bóxer y tracción simétrica, nacido para la aventura.",
  Peugeot: "Diseño francés elegante y ingeniería deportiva.",
  Renault: "Innovación francesa con espíritu de competición.",
  Suzuki: "Compactos ágiles y todoterreno sin concesiones.",
  Mazda: "Diseño Kodo y la filosofía Jinba-Ittai.",
  Hyundai: "Performance N y tecnología eléctrica de vanguardia.",
  Kia: "Diseño audaz y electromovilidad accesible.",
  Volkswagen: "Pragmatismo alemán para el conductor cotidiano.",
}
function brandDescription(name) {
  return BRAND_DESCRIPTIONS[name] || "Fabricante de automóviles de alta gama."
}
function toOrderDetail(o) {
  var items = orderItems(o.id)
  return {
    id: o.id,
    number: o.number,
    status: o.status,
    statusLabel: ORDER_STATUS_LABELS[o.status] || o.status,
    total: o.total,
    createdAt: o.createdAt,
    items: items.map(function (it) {
      var raw = SEED.vehicles.find(function (v) { return v.id === it.vehicleId })
        || SEED.vehicles.find(function (v) { return v.slug === it.vehicleId })
      return {
        id: it.id || it.itemId,
        quantity: it.quantity,
        priceAtPurchase: it.priceAtPurchase,
        vehicle: effectiveVehicle(raw),
      }
    }),
  }
}

// ------- helpers shared by api impls ---------------------------------------
function createId() {
  return "l" + Math.random().toString(36).slice(2) + Date.now().toString(36)
}
function ok(value) { return Promise.resolve(clone(value)) }
function fail(status, message) {
  var e = new Error(message)
  e.status = status
  return Promise.reject(e)
}

// ------- the api object (same shape as public/js2/api.js) ------------------
var api = {
  // Vehículos
  catalogo: function () {
    var items = allVehicles().sort(function (a, b) {
      if (b.destacado - a.destacado !== 0) return b.destacado - a.destacado
      return (a.marca + a.modelo).localeCompare(b.marca + b.modelo)
    })
    return ok({ items: items })
  },
  listarVehiculos: function (params) {
    params = params || {}
    var list = allVehicles()
    var search = (params.search || "").toLowerCase()
    if (search) {
      list = list.filter(function (v) {
        return v.marca.toLowerCase().indexOf(search) !== -1 || v.modelo.toLowerCase().indexOf(search) !== -1
      })
    }
    if (params.marca) list = list.filter(function (v) { return v.marca === params.marca })
    return ok({ items: list, total: list.length, page: 1, pageSize: list.length, totalPages: 1 })
  },
  obtenerVehiculo: function (slug) {
    var v = vehicleBySlug(slug)
    if (!v) return fail(404, "Vehículo no encontrado")
    return ok({ vehicle: effectiveVehicle(v) })
  },

  // Marcas
  listarMarcas: function () {
    var brands = SEED.brands.map(function (b) {
      var vehicles = SEED.vehicles.filter(function (v) { return v.marca === b.name && v.available })
      var precios = vehicles.map(function (v) { return v.precio })
      var sample = vehicles[0]
      var imagenes = sample ? effectiveVehicle(sample).imagenes : []
      return {
        id: b.id,
        slug: b.slug,
        name: b.name,
        description: b.description || brandDescription(b.name),
        cantidad: vehicles.length,
        precioMin: precios.length ? Math.min.apply(Math, precios) : 0,
        precioMax: precios.length ? Math.max.apply(Math, precios) : 0,
        imagen: imagenes[0] || null,
      }
    })
    return ok({ brands: brands })
  },
  obtenerMarca: function (slug) {
    var b = SEED.brands.find(function (x) { return x.slug === slug })
    if (!b) return fail(404, "Marca no encontrada")
    var vehicles = allVehicles().filter(function (v) { return v.marca === b.name })
    return ok({
      brand: {
        id: b.id,
        slug: b.slug,
        name: b.name,
        description: b.description || brandDescription(b.name),
      },
      vehicles: vehicles,
      cantidad: vehicles.length,
    })
  },

  // Auth (demo, client-side)
  me: function () {
    var u = sessionUser()
    return ok({ user: publicUser(u) })
  },
  login: function (email, password) {
    var u = allUsers().find(function (x) { return x.email.toLowerCase() === String(email).toLowerCase() })
    if (!u || u.password !== password) return fail(401, "Credenciales incorrectas")
    save(USER_KEY, u)
    trackEvent("LOGIN", u.id, null, null, {})
    return ok({ user: publicUser(u) })
  },
  register: function (name, email, password) {
    if (!name || !email || !password) return fail(400, "Completa todos los campos")
    var exists = allUsers().find(function (x) { return x.email.toLowerCase() === String(email).toLowerCase() })
    if (exists) return fail(409, "El correo ya está registrado")
    var u = { id: createId(), name: name, email: email, password: password, role: "USER", createdAt: new Date().toISOString() }
    var list = load(USERS_KEY, [])
    list.push(u)
    save(USERS_KEY, list)
    save(USER_KEY, u)
    return ok({ user: publicUser(u) })
  },
  logout: function () {
    save(USER_KEY, null)
    return ok({ ok: true })
  },

  // Favoritos
  favoritos: function () {
    var u = sessionUser()
    if (!u) return fail(401, "No autenticado")
    return ok({ favoritos: favoritesOf(u.id) })
  },
  toggleFavorito: function (vehicleSlug, action) {
    var u = sessionUser()
    if (!u) return fail(401, "No autenticado")
    var current = favoritesOf(u.id)
    if (action === "add") {
      if (current.indexOf(vehicleSlug) === -1) current.push(vehicleSlug)
    } else {
      current = current.filter(function (s) { return s !== vehicleSlug })
    }
    persistFavorites(u.id, current)
    return ok({ favoritos: current })
  },
  mergeFavoritos: function (slugs) {
    var u = sessionUser()
    if (!u) return fail(401, "No autenticado")
    var current = favoritesOf(u.id)
    slugs.forEach(function (s) { if (current.indexOf(s) === -1) current.push(s) })
    persistFavorites(u.id, current.filter(function (s) { return vehicleBySlug(s) }))
    return ok({ favoritos: favoritesOf(u.id) })
  },

  // Pedidos
  pedidos: function () {
    var u = sessionUser()
    if (!u) return fail(401, "No autenticado")
    var orders = allOrders()
      .filter(function (o) { return o.userId === u.id })
      .map(toOrderDetail)
      .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
    return ok({ orders: orders })
  },
  pedido: function (id) {
    var u = sessionUser()
    if (!u) return fail(401, "No autenticado")
    var o = allOrders().find(function (x) { return x.id === id && x.userId === u.id })
    if (!o) return fail(404, "Pedido no encontrado")
    return ok({ order: toOrderDetail(o) })
  },
  checkout: function (items) {
    var u = sessionUser()
    if (!u) return fail(401, "No autenticado")
    var stock = stockMap()
    var total = 0
    // group quantities
    var grouped = {}
    items.forEach(function (it) {
      grouped[it.vehicleSlug] = (grouped[it.vehicleSlug] || 0) + Math.max(1, Math.floor(it.quantity || 1))
    })
    var orderItemsLocal = []
    for (var slug in grouped) {
      var v = effectiveVehicle(vehicleBySlug(slug))
      if (!v) return fail(400, "Uno o más vehículos ya no están disponibles")
      if (!v.available || v.stock <= 0) return fail(409, v.marca + " " + v.modelo + " no está disponible")
      if (v.stock < grouped[slug]) return fail(409, "Stock insuficiente para " + v.marca + " " + v.modelo)
      total += v.precio * grouped[slug]
      orderItemsLocal.push({ vehicleId: v.id, quantity: grouped[slug], priceAtPurchase: v.precio })
    }
    var year = new Date().getFullYear()
    var prefix = "LXC-" + year + "-"
    var maxSeq = allOrders()
      .map(function (o) { return o.number })
      .filter(function (n) { return n && n.indexOf(prefix) === 0 })
      .map(function (n) { return parseInt(n.slice(prefix.length), 10) || 0 })
      .reduce(function (a, b) { return Math.max(a, b) }, 0)
    var order = {
      id: createId(),
      number: prefix + String(maxSeq + 1).padStart(5, "0"),
      userId: u.id,
      status: "COMPLETED",
      total: total,
      createdAt: new Date().toISOString(),
      items: orderItemsLocal,
    }
    // decrement stock (vehicleId here IS the slug — see effectiveVehicle above)
    orderItemsLocal.forEach(function (it) {
      var v = effectiveVehicle(vehicleBySlug(it.vehicleId))
      stock[v.id] = {
        stock: Math.max(0, v.stock - it.quantity),
        available: v.stock - it.quantity > 0,
      }
    })
    save(STOCK_KEY, stock)
    var orders = load(ORDERS_KEY, [])
    orders.push(order)
    save(ORDERS_KEY, orders)
    trackEvent("PURCHASE_COMPLETED", u.id, null, order.id, {})
    return ok({
      orderId: order.id,
      orderNumber: order.number,
      total: total,
      vehicles: orderItemsLocal.map(function (it) {
        return effectiveVehicle(SEED.vehicles.find(function (v) { return v.id === it.vehicleId }))
      }),
    })
  },

  // Reseñas
  resenas: function (vehicleSlug) {
    var reviews = SEED.reviews.concat(load(REVIEWS_KEY, []))
      .filter(function (r) { return r.vehicleId === vehicleBySlug(vehicleSlug).id || r.vehicleId === vehicleSlug })
      .map(function (r) {
        var u = allUsers().find(function (x) { return x.id === r.userId })
        return { id: r.id, rating: r.rating, comment: r.comment, createdAt: r.createdAt, userName: u ? u.name : "Usuario" }
      })
    var avg = reviews.length ? reviews.reduce(function (s, r) { return s + r.rating }, 0) / reviews.length : 0
    return ok({ reviews: reviews, average: avg, count: reviews.length })
  },
  crearResena: function (vehicleSlug, rating, comment) {
    var u = sessionUser()
    if (!u) return fail(401, "Inicia sesión para reseñar")
    var r = parseInt(rating, 10)
    if (isNaN(r) || r < 1 || r > 5) return fail(400, "La calificación debe estar entre 1 y 5")
    var v = vehicleBySlug(vehicleSlug)
    if (!v) return fail(404, "Vehículo no encontrado")
    var purchases = allOrders().filter(function (o) { return o.userId === u.id && o.status === "COMPLETED" })
    var bought = purchases.some(function (o) {
      return orderItems(o.id).some(function (it) { return it.vehicleId === v.id || it.vehicleId === v.slug })
    })
    if (!bought) return fail(403, "Solo puedes reseñar vehículos que hayas comprado")
    var existing = SEED.reviews.concat(load(REVIEWS_KEY, []))
      .find(function (x) { return x.userId === u.id && (x.vehicleId === v.id || x.vehicleId === v.slug) })
    if (existing) return fail(409, "Ya has reseñado este vehículo")
    var review = { id: createId(), userId: u.id, vehicleId: v.id, rating: r, comment: comment, createdAt: new Date().toISOString() }
    var list = load(REVIEWS_KEY, [])
    list.push(review)
    save(REVIEWS_KEY, list)
    return ok({ review: review })
  },

  // Analíticas (admin)
  analytics: function () {
    var u = sessionUser()
    if (!u || u.role !== "ADMIN") return fail(403, "Solo administradores")
    return ok(getDashboardData())
  },
}

// ------- events -------------------------------------------------------------
function trackEvent(type, userId, vehicleId, orderId, metadata) {
  var list = load(EVENTS_KEY, [])
  list.push({
    id: createId(),
    type: type,
    userId: userId || null,
    vehicleId: vehicleId || null,
    orderId: orderId || null,
    metadata: JSON.stringify(metadata || {}),
    createdAt: new Date().toISOString(),
  })
  save(EVENTS_KEY, list)
}

// ------- dashboard aggregate (port of getDashboardData) ---------------------
var MESES_LABEL = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
function getDashboardData() {
  var orders = allOrders()
  var itemsByOrder = {}
  SEED["order_items"].forEach(function (it) {
    (itemsByOrder[it.orderId] = itemsByOrder[it.orderId] || []).push(it)
  })
  load(ORDERS_KEY, []).forEach(function (o) {
    itemsByOrder[o.id] = o.items || []
  })
  var completed = orders
    .filter(function (o) { return o.status === "COMPLETED" })
    .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
  var pending = orders.filter(function (o) { return o.status === "PENDING" || o.status === "PROCESSING" }).length

  var ventasTotales = 0
  var vehiculosVendidos = 0
  var porMarca = {}, porCategoria = {}, porVehiculo = {}
  var clientesSet = {}
  completed.forEach(function (o) {
    ventasTotales += o.total
    var u = allUsers().find(function (x) { return x.id === o.userId })
    clientesSet[u ? u.name : "—"] = true
    ;(itemsByOrder[o.id] || []).forEach(function (it) {
      vehiculosVendidos += it.quantity
      var raw = SEED.vehicles.find(function (v) { return v.id === it.vehicleId })
              || SEED.vehicles.find(function (v) { return v.slug === it.vehicleId })
      if (!raw) return
      ;(porMarca[raw.marca] = porMarca[raw.marca] || { ventas: 0, ingresos: 0 })
      porMarca[raw.marca].ventas += it.quantity
      porMarca[raw.marca].ingresos += it.priceAtPurchase * it.quantity
      ;(porCategoria[raw.categoria] = porCategoria[raw.categoria] || { ventas: 0, ingresos: 0 })
      porCategoria[raw.categoria].ventas += it.quantity
      porCategoria[raw.categoria].ingresos += it.priceAtPurchase * it.quantity
      var key = raw.marca + " " + raw.modelo
      ;(porVehiculo[key] = porVehiculo[key] || { marca: raw.marca, ventas: 0, ingresos: 0 })
      porVehiculo[key].ventas += it.quantity
      porVehiculo[key].ingresos += it.priceAtPurchase * it.quantity
    })
  })

  var now = new Date()
  var meses = []
  for (var i = 11; i >= 0; i--) {
    var d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    var next = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    var ingresos = 0, ventas = 0
    completed.forEach(function (o) {
      var created = new Date(o.createdAt)
      if (created >= d && created < next) {
        ingresos += o.total
        ;(itemsByOrder[o.id] || []).forEach(function (it) { ventas += it.quantity })
      }
    })
    meses.push({
      mes: d.getMonth(),
      "año": d.getFullYear(),
      mesLabel: MESES_LABEL[d.getMonth()] + " " + d.getFullYear(),
      fecha: d.toISOString(),
      ingresos: ingresos,
      ventas: ventas,
    })
  }
  var year1Ingresos = meses.reduce(function (s, m) { return s + m.ingresos }, 0)
  var priorStart = new Date(now.getFullYear() - 1, now.getMonth(), 1)
  var priorIngresos = completed
    .filter(function (o) { return new Date(o.createdAt) < priorStart })
    .reduce(function (s, o) { return s + o.total }, 0)
  var crecimientoAnual = priorIngresos > 0
    ? Math.round((year1Ingresos / priorIngresos - 1) * 100)
    : (year1Ingresos > 0 ? 18 : 0)

  var eventsMap = {}
  SEED.events.concat(load(EVENTS_KEY, [])).forEach(function (e) {
    eventsMap[e.type] = (eventsMap[e.type] || 0) + 1
  })
  var views = eventsMap["VEHICLE_VIEWED"] || 0
  var purchases = eventsMap["PURCHASE_COMPLETED"] || 0
  var denom = views + purchases
  var tasaConversion = denom > 0 ? (purchases / denom) * 100 : 0

  return {
    kpis: {
      ventasTotales: ventasTotales,
      vehiculosVendidos: vehiculosVendidos,
      clientes: Object.keys(clientesSet).length,
      ticketPromedio: vehiculosVendidos > 0 ? Math.round(ventasTotales / vehiculosVendidos) : 0,
      pedidosPendientes: pending,
      marcasDisponibles: SEED.brands.length,
      tasaConversion: tasaConversion,
      crecimientoAnual: crecimientoAnual,
    },
    meses: meses,
    ventasPorMarca: Object.keys(porMarca).map(function (k) {
      return { marca: k, ventas: porMarca[k].ventas, ingresos: porMarca[k].ingresos }
    }).sort(function (a, b) { return b.ventas - a.ventas }),
    ventasPorCategoria: Object.keys(porCategoria).map(function (k) {
      return { categoria: k, ventas: porCategoria[k].ventas, ingresos: porCategoria[k].ingresos }
    }).sort(function (a, b) { return b.ventas - a.ventas }),
    topVehiculos: Object.keys(porVehiculo).map(function (k) {
      return { vehiculo: k, marca: porVehiculo[k].marca, ventas: porVehiculo[k].ventas, ingresos: porVehiculo[k].ingresos }
    }).sort(function (a, b) { return b.ventas - a.ventas }).slice(0, 8),
    pedidosRecientes: completed.slice(0, 15).map(function (o) {
      var u = allUsers().find(function (x) { return x.id === o.userId })
      var first = (itemsByOrder[o.id] || [])[0]
      var raw = first ? (SEED.vehicles.find(function (v) { return v.id === first.vehicleId })
        || SEED.vehicles.find(function (v) { return v.slug === first.vehicleId })) : null
      return {
        id: o.number,
        number: o.number,
        cliente: u ? u.name : "Cliente",
        vehiculo: raw ? raw.marca + " " + raw.modelo : "—",
        marca: raw ? raw.marca : "—",
        valor: o.total,
        estado: ORDER_STATUS_LABELS[o.status] || o.status,
        fecha: new Date(o.createdAt).toISOString(),
      }
    }),
  }
}
