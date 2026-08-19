/**
 * Routing helpers — convert original SPA-like absolute paths ("/marketplace",
 * "/vehiculos/<slug>") into relative HTML file paths so the app works opened
 * directly from file://. Also fixes asset paths for pages/ pages.
 */
var ROUTE_TABLE = [
  ["/", "index.html"],
  ["/marketplace", "pages/marketplace.html"],
  ["/vehiculos", "pages/vehiculo.html"],
  ["/marcas", "pages/marcas.html"],
  ["/marca", "pages/marca.html"],
  ["/favoritos", "pages/favoritos.html"],
  ["/comparar", "pages/comparar.html"],
  ["/garaje", "pages/garaje.html"],
  ["/carrito", "pages/carrito.html"],
  ["/gracias", "pages/gracias.html"],
  ["/login", "pages/login.html"],
  ["/registro", "pages/registro.html"],
  ["/perfil", "pages/perfil.html"],
  ["/pedidos", "pages/pedidos.html"],
  ["/privacidad", "pages/privacidad.html"],
  ["/terminos", "pages/terminos.html"],
  ["/admin/login", "pages/admin-login.html"],
  ["/admin", "pages/admin.html"],
]

var IN_PAGES_DIR = location.pathname.indexOf("/pages/") !== -1

function routePrefix() {
  return IN_PAGES_DIR ? "" : "pages/"
}

/** Convert an original app route (e.g. "/marketplace") to a relative file. */
function hrefFromApp(route) {
  if (route === "/" || route === "" || route === null || route === undefined) {
    return IN_PAGES_DIR ? "../index.html" : "index.html"
  }
  var bestRoute = null
  var bestFile = null
  for (var i = 0; i < ROUTE_TABLE.length; i++) {
    var r = ROUTE_TABLE[i][0]
    if (route === r) { bestRoute = r; bestFile = ROUTE_TABLE[i][1]; break }
    if (r.length > 1 && route.indexOf(r + "/") === 0) {
      if (bestRoute === null || r.length > bestRoute.length) { bestRoute = r; bestFile = ROUTE_TABLE[i][1] }
    }
  }
  if (bestFile === null) bestFile = "pages/404.html"
  // dynamic subroutes prefer detail pages over collection pages
  if (route.indexOf("/marcas/") === 0) { bestRoute = "/marca"; bestFile = "pages/marca.html" }
  if (route.indexOf("/vehiculos/") === 0) { bestRoute = "/vehiculos"; bestFile = "pages/vehiculo.html" }
  var file = IN_PAGES_DIR ? bestFile.replace(/^pages\//, "") : bestFile
  var slashIdx = route.indexOf("/")
  var secondSlash = route.indexOf("/", slashIdx + 1)
  if (secondSlash !== -1) {
    var param = route.slice(secondSlash + 1)
    if (bestRoute === "/vehiculos") file += "?id=" + encodeURIComponent(param)
    else if (bestRoute === "/marca" || route.indexOf("/marcas") === 0) file += "?slug=" + encodeURIComponent(param)
  }
  return file
}

/** Current location as the original app route (used for active-nav checks). */
function currentAppRoute() {
  var p = location.pathname
  if (IN_PAGES_DIR) {
    var file = p.slice(p.indexOf("/pages/") + "/pages/".length)
    for (var i = 0; i < ROUTE_TABLE.length; i++) {
      if (ROUTE_TABLE[i][1] === "pages/" + file) return ROUTE_TABLE[i][0]
    }
    return "/404"
  }
  var root = p.split("/").pop()
  var rootFile = root === "" || root.indexOf(".") === -1 ? "index.html" : root
  for (var j = 0; j < ROUTE_TABLE.length; j++) {
    if (ROUTE_TABLE[j][1] === rootFile) return ROUTE_TABLE[j][0]
  }
  return "/"
}

/** Prefix asset paths so pages/ pages can reach root-relative files. */
function assetPath(p) {
  var s = String(p)
  if (s.indexOf("/") === 0 && s.indexOf("//") !== 0) s = (IN_PAGES_DIR ? "../" : "") + s.slice(1)
  return s
}
