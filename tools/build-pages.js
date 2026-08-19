/**
 * One-time generator that assembles the static HTML pages with the shared
 * <head> boilerplate (meta, stylesheet, inline theme preload). It is a dev
 * tool, not a runtime dependency — the generated files live in /public.
 */
const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..")
const INLINE_THEME = fs.readFileSync(path.join(root, "tools/theme-inline.js"), "utf8")

const pages = [
  { file: "index.html", out: "index.html", title: "Vehículos de Alta Gama · Digital Marketplace", desc: "Marketplace digital de vehículos de alta gama. Descubre, compara y adquiere los modelos más exclusivos del mundo en una experiencia de compra premium.", script: "/js/pages/home.js" },
  { file: "marketplace.html", title: "Marketplace de vehículos · Digital Marketplace", desc: "Explora el catálogo completo de vehículos de alta gama. Filtra por marca, categoría, precio y rendimiento para encontrar el modelo perfecto.", script: "/js/pages/marketplace.js" },
  { file: "vehiculo.html", title: "Vehículo · Digital Marketplace", desc: "Detalle del vehículo: especificaciones, financiación y reseñas.", script: "/js/pages/vehiculo.js" },
  { file: "marcas.html", title: "Marcas · Digital Marketplace", desc: "Descubre todas las marcas de vehículos de alta gama disponibles en Digital Marketplace: Porsche, Ferrari, Lamborghini, BMW, Mercedes-Benz y muchas más.", script: "/js/pages/marcas.js" },
  { file: "marca.html", title: "Marca · Digital Marketplace", desc: "Modelos de la marca, especificaciones y precios.", script: "/js/pages/marca.js" },
  { file: "favoritos.html", title: "Favoritos · Digital Marketplace", desc: "Tu colección de vehículos favoritos en Digital Marketplace. Guarda y revisa los modelos que más te gustan en un solo lugar.", script: "/js/pages/favoritos.js" },
  { file: "comparar.html", title: "Comparar vehículos · Digital Marketplace", desc: "Compara lado a lado las especificaciones, rendimiento y precio de los vehículos de alta gama que selecciones en Digital Marketplace.", script: "/js/pages/comparar.js" },
  { file: "garaje.html", title: "Mi Garaje · Digital Marketplace", desc: "Tu garaje privado en Digital Marketplace: revisa los vehículos que has adquirido, su estado y los detalles de tus pedidos.", script: "/js/pages/garaje.js" },
  { file: "carrito.html", title: "Carrito · Digital Marketplace", desc: "Revisa los vehículos que has añadido a tu carrito y completa la compra de forma segura en Digital Marketplace.", script: "/js/pages/carrito.js" },
  { file: "gracias.html", title: "¡Gracias por tu compra! · Digital Marketplace", desc: "Tu pedido en Digital Marketplace se ha completado. Disfruta de tu nuevo vehículo en tu garaje privado.", script: "/js/pages/gracias.js" },
  { file: "login.html", title: "Iniciar sesión · Digital Marketplace", desc: "Accede a tu cuenta de Digital Marketplace para conservar tus favoritos, pedidos y vehículos comprados en todos tus dispositivos.", script: "/js/pages/login.js", bare: true },
  { file: "registro.html", title: "Crear cuenta · Digital Marketplace", desc: "Crea tu cuenta en Digital Marketplace.", script: "/js/pages/registro.js", bare: true },
  { file: "perfil.html", title: "Mi perfil · Digital Marketplace", desc: "Gestiona la información de tu cuenta de Digital Marketplace: nombre, correo y configuración personal.", script: "/js/pages/perfil.js" },
  { file: "pedidos.html", title: "Mis pedidos · Digital Marketplace", desc: "Consulta el estado y los detalles de tus pedidos en Digital Marketplace.", script: "/js/pages/pedidos.js" },
  { file: "privacidad.html", title: "Política de Privacidad · Digital Marketplace", desc: "Política de privacidad de Digital Marketplace: qué datos recopilamos, cómo los usamos, con quién los compartimos y tus derechos como usuario.", script: "/js/pages/legal.js" },
  { file: "terminos.html", title: "Términos y Condiciones · Digital Marketplace", desc: "Términos y condiciones de uso de Digital Marketplace: condiciones de acceso, propiedad, compras simuladas, propiedad intelectual y limitación de responsabilidad.", script: "/js/pages/legal.js" },
  { file: "admin.html", title: "Panel administrativo · Digital Marketplace", desc: "Métricas y análisis del marketplace.", script: "/js/pages/admin.js", bare: true },
  { file: "admin-login.html", title: "Admin · Digital Marketplace", desc: "Acceso al panel administrativo.", script: "/js/pages/admin-login.js", bare: true },
  { file: "404.html", title: "Página no encontrada · Digital Marketplace", desc: "La página que buscas no existe.", script: "/js/pages/404.js", bare: true },
]

function build(p) {
  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${p.title}</title>
  <meta name="description" content="${p.desc}" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/css/app.css" />
  <!-- Aplica el tema guardado antes de renderizar para evitar FOUC -->
  <script>
${INLINE_THEME}
  </script>
</head>
<body>
  ${p.bare ? "" : '<main class="flex-1" id="main"></main>'}
  <script type="module" src="${p.script}"></script>
</body>
</html>
`
}

const publicDir = path.join(root, "public")
const pagesDir = path.join(publicDir, "pages")

for (const p of pages) {
  const target = p.out === "index.html" ? path.join(publicDir, "index.html") : path.join(pagesDir, p.file)
  fs.writeFileSync(target, build(p))
}
console.log(`Generadas ${pages.length} páginas.`)
