/* Digital Marketplace — frontend-only bundle (generated).
   Sections, in order: routing helpers, injected seed data, shared modules,
   local API (replaces the original Express backend). */

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

var SEED = {"users":[{"id":"cmt0qdqlmacqb27scevur","email":"admin@luxicar.com","name":"Administrador LUXICAR","passwordHash":"scrypt:c2a21f6b736585e680f63f72294c4bc3:b4a59a1bc0cfdeb5ddea97c84cb196d94c49b01c23612530236000be2801887f102ab244ae5613d7222ac31c1a096ff740ef5a6083fc8c28bdea22384ffe6349","role":"ADMIN","createdAt":"2026-08-19T23:36:48.923Z","updatedAt":"2026-08-19T23:36:48.923Z","password":"admin123"},{"id":"cmt0qdqmzovvqncm0614r","email":"carlos@demo.com","name":"Carlos García","passwordHash":"scrypt:b92eb1990ba0ee5e63bc808ac5bc127a:3616c98b6e00440a50caa16a4448ecf628dd486459f59958afed9cfb3c0d903573ed9aeb9bce88d477c5ff4b1322bcec175c0947fb9e1a50af10152f63b0dd93","role":"USER","createdAt":"2026-08-19T23:36:48.970Z","updatedAt":"2026-08-19T23:36:48.970Z","password":"demo1234"},{"id":"cmt0qdqobo9w28eeifukb","email":"maria@demo.com","name":"María López","passwordHash":"scrypt:296733ea77f9201671f3eff6f57b59aa:ce4ec0e90e4c7c18cf86b2b55e1a699a0d70862199d1aa91b80cdfa27f39558c59a54f5f3e6e91a9b1ecdb76a7147e50b3ef08794cf37f7fd5aa9b7be4838863","role":"USER","createdAt":"2026-08-19T23:36:49.009Z","updatedAt":"2026-08-19T23:36:49.009Z","password":"demo1234"},{"id":"cmt0qdqpdlbu8mrr68cuc","email":"juan@demo.com","name":"Juan Martínez","passwordHash":"scrypt:821d3e90ab16b1cad5cedab60a0c8352:cb370bec71fc4213157f30fbf04644a83a58a45ba6b0a3d5d8340b15b5f1e3d3e6f78cd0eb141b3ffc4e2c42e692cb716cd4f7de50ffbc82000fb207d49a7f57","role":"USER","createdAt":"2026-08-19T23:36:49.048Z","updatedAt":"2026-08-19T23:36:49.048Z","password":"demo1234"},{"id":"cmt0qdqqgvm14jvgz51db","email":"ana@demo.com","name":"Ana Rodríguez","passwordHash":"scrypt:5b7bea30687e088f9eb5a6edbc995d1c:0a992a2d053d3b507b68548bbe4e5774ad43beb19b8a7630374a3c6bde71f57e40edb2ca4fe7c281bca32e124f1f672728f4c7d107e52ec7348359c107d20e99","role":"USER","createdAt":"2026-08-19T23:36:49.086Z","updatedAt":"2026-08-19T23:36:49.086Z","password":"demo1234"},{"id":"cmt0qdqrih3pmy6rg8fvc","email":"pedro@demo.com","name":"Pedro Sánchez","passwordHash":"scrypt:e457c456fba6df928e0047027cd95c72:f7f585297d1e34aab9ac2988d1a1a6aed9f5cf38ee14516b0e26e62fd1405542f1e527ab3c7a0529dddc22b0534a765f5483b2c2d4de8d77926087d401d93880","role":"USER","createdAt":"2026-08-19T23:36:49.124Z","updatedAt":"2026-08-19T23:36:49.124Z","password":"demo1234"},{"id":"cmt0qdqske77ggzu9wq0y","email":"laura@demo.com","name":"Laura Fernández","passwordHash":"scrypt:59a0b24ac9f2f9d7950b7f6323e96706:d8f898a0bfd9982cc4aa7413c8134f585aa3f40163761861f3e8065623245fb47ba356562c6802a8628e57139072aefa6f459cf1bc29b9cffc1adadfaa622815","role":"USER","createdAt":"2026-08-19T23:36:49.161Z","updatedAt":"2026-08-19T23:36:49.161Z","password":"demo1234"},{"id":"cmt0qdqtllmxi79ser5nr","email":"diego@demo.com","name":"Diego Pérez","passwordHash":"scrypt:cf66f9a450a5feeff51c5a9d0aa4152e:89b92912dc7c26ac8861cd8363645cd36728f598214431f651cae02795c8eae7f37746ce20c674f2d69529537e843d46011cc1df69b343953668676fc414c551","role":"USER","createdAt":"2026-08-19T23:36:49.199Z","updatedAt":"2026-08-19T23:36:49.199Z","password":"demo1234"},{"id":"cmt0qdqun62x53cm42li2","email":"sofia@demo.com","name":"Sofía Gómez","passwordHash":"scrypt:dd770b093e7c357b4b5a1453270f2101:b2524eb27fcc120be94307961e52f34719dfa837ae1beb268914b93eb7e81b609566b404b20f69edde2413a8c15cac19df6ed56e5d8ba9c614254754e37c73de","role":"USER","createdAt":"2026-08-19T23:36:49.237Z","updatedAt":"2026-08-19T23:36:49.237Z","password":"demo1234"}],"vehicles":[{"id":"cmt0qdqll2pksjx4wysfr","slug":"porsche-911-carrera","marca":"Porsche","modelo":"911 Carrera","año":2024,"precio":114400,"motor":"3.0L Twin-Turbo Boxer 6","potencia":379,"torque":420,"transmision":"PDK 8 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":293,"aceleracion0a100":4,"categoria":"Deportivo","descripcion":"El Porsche 911 Carrera representa la esencia del deportivo purista. Su motor bóxer turboalimentado entrega una respuesta inmediata, mientras que su chasis afinado garantiza una dinámica de conducción incomparable. Un icono atemporal redefinido para la era moderna.","images":"[\"/vehicles/porsche-911-carrera/1.jpg\",\"/vehicles/porsche-911-carrera/2.jpg\",\"/vehicles/porsche-911-carrera/3.jpg\",\"/vehicles/porsche-911-carrera/4.png\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkwsd586vu8qfg","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllimr6qjf233m1","slug":"porsche-taycan-turbos","marca":"Porsche","modelo":"Taycan Turbo S","año":2024,"precio":192900,"motor":"Dual-Motor Eléctrico","potencia":750,"torque":1050,"transmision":"Automática 2 velocidades","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":260,"aceleracion0a100":2.8,"categoria":"Sedán","descripcion":"El Porsche Taycan Turbo S demuestra que la electromovilidad puede ser pura emoción. Con 750 CV y tracción integral, acelera de 0 a 100 km/h en 2,8 segundos. Su arquitectura de 800V permite cargas ultrarrápidas sin renunciar al ADN deportivo de Porsche.","images":"[\"/vehicles/porsche-taycan-turbos/1.jpg\",\"/vehicles/porsche-taycan-turbos/2.jpg\",\"/vehicles/porsche-taycan-turbos/3.jpg\",\"/vehicles/porsche-taycan-turbos/4.jpeg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkwsd586vu8qfg","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllw91krozn4mc0","slug":"porsche-cayenne-turbogt","marca":"Porsche","modelo":"Cayenne Turbo GT","año":2024,"precio":196300,"motor":"4.0L Twin-Turbo V8","potencia":650,"torque":850,"transmision":"Tiptronic S 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":305,"aceleracion0a100":3.2,"categoria":"SUV","descripcion":"El Porsche Cayenne Turbo GT es el SUV más potente de la historia de Porsche. Desarrollado en el Nürburgring, su V8 biturbo de 650 CV y su chasis activo lo convierten en una bestia de pista con la versatilidad de un vehículo de cinco plazas.","images":"[\"/vehicles/porsche-cayenne-turbogt/1.jpg\",\"/vehicles/porsche-cayenne-turbogt/2.jpg\",\"/vehicles/porsche-cayenne-turbogt/3.jpg\",\"/vehicles/porsche-cayenne-turbogt/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkwsd586vu8qfg","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll30ygttzphb9y","slug":"porsche-718-cayman-gt4","marca":"Porsche","modelo":"718 Cayman GT4 RS","año":2024,"precio":149600,"motor":"4.0L Boxer 6 Atmosférico","potencia":493,"torque":450,"transmision":"PDK 7 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":315,"aceleracion0a100":3.4,"categoria":"Coupé","descripcion":"El Porsche 718 Cayman GT4 RS lleva el motor atmosférico del 911 GT3 al chasis de motor central perfecto. Con 493 CV que giran hasta 9.000 rpm, ofrece una experiencia de conducción táctil y pura que pocos deportivos pueden igualar.","images":"[\"/vehicles/porsche-718-cayman-gt4/1.jpg\",\"/vehicles/porsche-718-cayman-gt4/2.jpg\",\"/vehicles/porsche-718-cayman-gt4/3.jpg\",\"/vehicles/porsche-718-cayman-gt4/4.jpg\"]","stock":3,"available":1,"featured":0,"brandId":"cmt0qdqlkwsd586vu8qfg","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll2prytkni1xlc","slug":"ferrari-296-gtb","marca":"Ferrari","modelo":"296 GTB","año":2023,"precio":322986,"motor":"3.0L Twin-Turbo V6 Híbrido","potencia":830,"torque":740,"transmision":"DCT 8 velocidades","combustible":"Híbrido","traccion":"RWD","velocidadMaxima":330,"aceleracion0a100":2.9,"categoria":"Superdeportivo","descripcion":"La Ferrari 296 GTB redefine el concepto del superdeportivo con su motor V6 híbrido que entrega 830 CV combinados. Una obra maestra de la ingeniería italiana que combina potencia brutal, eficiencia eléctrica y el sonido inconfundible de Maranello.","images":"[\"/vehicles/ferrari-296-gtb/1.jpg\",\"/vehicles/ferrari-296-gtb/2.jpeg\",\"/vehicles/ferrari-296-gtb/3.jpg\",\"/vehicles/ferrari-296-gtb/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkqsznwvc5w2wm","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllnsuf0nefqwwc","slug":"ferrari-sf90-stradale","marca":"Ferrari","modelo":"SF90 Stradale","año":2023,"precio":507300,"motor":"4.0L Twin-Turbo V8 Híbrido Plug-in","potencia":986,"torque":900,"transmision":"DCT 8 velocidades","combustible":"Híbrido","traccion":"AWD","velocidadMaxima":340,"aceleracion0a100":2.5,"categoria":"Superdeportivo","descripcion":"La Ferrari SF90 Stradale es el primer superdeportivo híbrido enchufable de Ferrari, con 986 CV combinados de su V8 biturbo y tres motores eléctricos. Acelera de 0 a 100 km/h en 2,5 segundos y representa la cúspide tecnológica de Maranello.","images":"[\"/vehicles/ferrari-sf90-stradale/1.jpg\",\"/vehicles/ferrari-sf90-stradale/2.jpg\",\"/vehicles/ferrari-sf90-stradale/3.jpg\",\"/vehicles/ferrari-sf90-stradale/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkqsznwvc5w2wm","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllpzsytuapua13","slug":"ferrari-roma","marca":"Ferrari","modelo":"Roma","año":2023,"precio":243308,"motor":"3.9L Twin-Turbo V8","potencia":612,"torque":760,"transmision":"DCT 8 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":320,"aceleracion0a100":3.4,"categoria":"Coupé","descripcion":"La Ferrari Roma evoca la dolce vita italiana con un diseño de líneas puras y elegantes. Bajo su capó, un V8 biturbo de 612 CV ofrece prestaciones de superdeportivo envueltas en un gran turismo refinado y atemporal.","images":"[\"/vehicles/ferrari-roma/1.jpg\",\"/vehicles/ferrari-roma/2.jpg\",\"/vehicles/ferrari-roma/3.jpg\",\"/vehicles/ferrari-roma/4.jpg\"]","stock":3,"available":1,"featured":0,"brandId":"cmt0qdqlkqsznwvc5w2wm","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllzm6sq5k2utnq","slug":"ferrari-812-competizione","marca":"Ferrari","modelo":"812 Competizione","año":2022,"precio":625000,"motor":"6.5L V12 Atmosférico","potencia":819,"torque":692,"transmision":"DCT 7 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":340,"aceleracion0a100":2.85,"categoria":"Superdeportivo","descripcion":"La Ferrari 812 Competizione es la culminación del V12 atmosférico puro. Con 819 CV a 9.250 rpm, es el motor de 12 cilindros más potente de la historia de Ferrari road cars. Una edición limitada que rinde tributo al placer de conducir sin compromisos.","images":"[\"/vehicles/ferrari-812-competizione/1.jpg\",\"/vehicles/ferrari-812-competizione/2.jpg\",\"/vehicles/ferrari-812-competizione/3.jpg\",\"/vehicles/ferrari-812-competizione/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkqsznwvc5w2wm","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllezj13rapqp1r","slug":"lamborghini-huracan-evo","marca":"Lamborghini","modelo":"Huracán EVO","año":2023,"precio":249870,"motor":"5.2L V10 Atmosférico","potencia":631,"torque":600,"transmision":"DCT 7 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":325,"aceleracion0a100":2.9,"categoria":"Superdeportivo","descripcion":"La Lamborghini Huracán EVO lleva la adrenalina al límite con su legendario motor V10 atmosférico. Su sistema de tracción integral y la tecnología LDVI anticipan cada movimiento del conductor, ofreciendo una experiencia de conducción visceral y pura.","images":"[\"/vehicles/lamborghini-huracan-evo/1.jpg\",\"/vehicles/lamborghini-huracan-evo/2.jpg\",\"/vehicles/lamborghini-huracan-evo/3.jpg\",\"/vehicles/lamborghini-huracan-evo/4.jpeg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlke6dbw3o7o8lv","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllfqsn1mwqxm04","slug":"lamborghini-aventador-svj","marca":"Lamborghini","modelo":"Aventador SVJ","año":2022,"precio":517770,"motor":"6.5L V12 Atmosférico","potencia":759,"torque":720,"transmision":"ISR 7 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":350,"aceleracion0a100":2.8,"categoria":"Superdeportivo","descripcion":"La Lamborghini Aventador SVJ es la encarnación más extrema del V12 atmosférico de Sant'Agata. Con 759 CV y la aerodinámica ALA 2.0, batió el récord de producción en el Nürburgring. Un monstruo puro con el carácter salvaje de Lamborghini.","images":"[\"/vehicles/lamborghini-aventador-svj/1.jpg\",\"/vehicles/lamborghini-aventador-svj/2.jpg\",\"/vehicles/lamborghini-aventador-svj/3.jpg\",\"/vehicles/lamborghini-aventador-svj/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlke6dbw3o7o8lv","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll5jyptoj9ffl4","slug":"lamborghini-revuelto","marca":"Lamborghini","modelo":"Revuelto","año":2024,"precio":608000,"motor":"6.5L V12 Híbrido Plug-in","potencia":1015,"torque":793,"transmision":"DCT 8 velocidades","combustible":"Híbrido","traccion":"AWD","velocidadMaxima":350,"aceleracion0a100":2.5,"categoria":"Superdeportivo","descripcion":"La Lamborghini Revuelto inaugura la era híbrida de Sant'Agata con un V12 atmosférico nuevo combinado con tres motores eléctricos, entregando 1.015 CV. Es el primer superdeportivo HPEV de Lamborghini, fusionando la tradición V12 con el futuro eléctrico.","images":"[\"/vehicles/lamborghini-revuelto/1.jpg\",\"/vehicles/lamborghini-revuelto/2.jpg\",\"/vehicles/lamborghini-revuelto/3.jpg\",\"/vehicles/lamborghini-revuelto/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlke6dbw3o7o8lv","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllx6gfwasn3pn2","slug":"lamborghini-urus-performante","marca":"Lamborghini","modelo":"Urus Performante","año":2024,"precio":260000,"motor":"4.0L Twin-Turbo V8","potencia":657,"torque":800,"transmision":"Automatic 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":306,"aceleracion0a100":3.3,"categoria":"SUV","descripcion":"La Lamborghini Urus Performante eleva al Super SUV al siguiente nivel con 657 CV y una reducción de peso de 47 kg. Su aerodinámica agresiva y la puesta a punto orientada a pista la convierten en el Lamborghini más versátil y radical de la gama.","images":"[\"/vehicles/lamborghini-urus-performante/1.jpg\",\"/vehicles/lamborghini-urus-performante/2.jpg\",\"/vehicles/lamborghini-urus-performante/3.jpg\",\"/vehicles/lamborghini-urus-performante/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlke6dbw3o7o8lv","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllt6xvmzyvl61x","slug":"bmw-m4-competition","marca":"BMW","modelo":"M4 Competition","año":2024,"precio":79100,"motor":"3.0L Twin-Turbo Inline-6 (S58)","potencia":503,"torque":650,"transmision":"M Steptronic 8 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":290,"aceleracion0a100":3.5,"categoria":"Coupé","descripcion":"La BMW M4 Competition combina la precisión alemana con una potencia despiadada. Su motor de seis cilindros en línea turboalimentado entrega 503 CV, mientras que su chasis orientado a la pista convierte cada curva en una celebración de la ingeniería de rendimiento.","images":"[\"/vehicles/bmw-m4-competition/1.png\",\"/vehicles/bmw-m4-competition/2.jpg\",\"/vehicles/bmw-m4-competition/3.jpg\",\"/vehicles/bmw-m4-competition/4.jpg\"]","stock":3,"available":1,"featured":1,"brandId":"cmt0qdqlk4wbheylbbebo","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllz2wgy0oqo2oa","slug":"bmw-m5-cs","marca":"BMW","modelo":"M5 CS","año":2022,"precio":142000,"motor":"4.4L Twin-Turbo V8 (S63)","potencia":627,"torque":750,"transmision":"M Steptronic 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":305,"aceleracion0a100":2.9,"categoria":"Sedán","descripcion":"La BMW M5 CS es el BMW de producción más potente jamás construido. Con 627 CV de su V8 biturbo y tracción M xDrive, es una berlina de cuatro plazas que acelera de 0 a 100 km/h en 2,9 segundos. El equilibrio definitivo entre lujo familiar y rendimiento extremo.","images":"[\"/vehicles/bmw-m5-cs/1.jpg\",\"/vehicles/bmw-m5-cs/2.jpg\",\"/vehicles/bmw-m5-cs/3.jpg\",\"/vehicles/bmw-m5-cs/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk4wbheylbbebo","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllavm2uu5yn02u","slug":"bmw-i8","marca":"BMW","modelo":"i8","año":2020,"precio":147500,"motor":"1.5L Turbo Inline-3 Híbrido","potencia":369,"torque":570,"transmision":"Automática 6 velocidades","combustible":"Híbrido","traccion":"AWD","velocidadMaxima":250,"aceleracion0a100":4.4,"categoria":"Coupé","descripcion":"La BMW i8 fue pionera del deportivo híbrido con su arquitectura de motor central y puertas de tijera. Su diseño futurista de fibra de carbono y su sistema híbrido de 369 CV la convierten en un icono de diseño que adelantó su época.","images":"[\"/vehicles/bmw-i8/1.jpg\",\"/vehicles/bmw-i8/2.jpeg\",\"/vehicles/bmw-i8/3.jpg\",\"/vehicles/bmw-i8/4.jpg\"]","stock":4,"available":1,"featured":0,"brandId":"cmt0qdqlk4wbheylbbebo","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllchb2ia0v2ck9","slug":"bmw-x5m-competition","marca":"BMW","modelo":"X5 M Competition","año":2024,"precio":122300,"motor":"4.4L Twin-Turbo V8 (S68)","potencia":617,"torque":750,"transmision":"M Steptronic 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":290,"aceleracion0a100":3.7,"categoria":"SUV","descripcion":"La BMW X5 M Competition combina la capacidad de un SUV con el rendimiento de un deportivo M. Su V8 biturbo de 617 CV y la tracción integral M xDrive la convierten en uno de los SUV más rápidos y capaces del mercado.","images":"[\"/vehicles/bmw-x5m-competition/1.jpg\",\"/vehicles/bmw-x5m-competition/2.jpg\",\"/vehicles/bmw-x5m-competition/3.jpg\",\"/vehicles/bmw-x5m-competition/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk4wbheylbbebo","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllxakzj4qyar10","slug":"mercedes-amg-gt-63","marca":"Mercedes-Benz","modelo":"AMG GT 63 4-Door","año":2024,"precio":136000,"motor":"4.0L Twin-Turbo V8","potencia":577,"torque":590,"transmision":"AMG SPEEDSHIFT 9 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":315,"aceleracion0a100":3.2,"categoria":"Sedán","descripcion":"El Mercedes-AMG GT 63 4-Door Coupe fusiona el lujo de una berlina con el alma de un superdeportivo. Su V8 biturbo fabricado a mano ofrece una fuerza imponente, envuelta en un diseño de cuatro puertas que redefine el concepto de gran turismo.","images":"[\"/vehicles/mercedes-amg-gt-63/1.jpg\",\"/vehicles/mercedes-amg-gt-63/2.jpg\",\"/vehicles/mercedes-amg-gt-63/3.jpg\",\"/vehicles/mercedes-amg-gt-63/4.jpg\"]","stock":3,"available":1,"featured":0,"brandId":"cmt0qdqlkz2mckudlsfeu","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll3u26cqg6ft71","slug":"mercedes-s63-amg","marca":"Mercedes-Benz","modelo":"S63 AMG","año":2024,"precio":230000,"motor":"4.0L Twin-Turbo V8 Mild Hybrid","potencia":791,"torque":1040,"transmision":"AMG SPEEDSHIFT 9 velocidades","combustible":"Híbrido","traccion":"AWD","velocidadMaxima":290,"aceleracion0a100":3.2,"categoria":"Sedán","descripcion":"El Mercedes-AMG S63 combina el lujo absoluto de la Clase S con la potencia brutal de AMG. Su V8 biturbo con sistema híbrido ligero entrega 791 CV, ofreciendo una serenidad de marcha limusina y una aceleración de superdeportivo en un mismo automóvil.","images":"[\"/vehicles/mercedes-s63-amg/1.jpg\",\"/vehicles/mercedes-s63-amg/2.jpg\",\"/vehicles/mercedes-s63-amg/3.jpg\",\"/vehicles/mercedes-s63-amg/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlkz2mckudlsfeu","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlltjkv7j7szyv8","slug":"mercedes-g63-amg","marca":"Mercedes-Benz","modelo":"G63 AMG","año":2024,"precio":180000,"motor":"4.0L Twin-Turbo V8 (M177)","potencia":577,"torque":850,"transmision":"AMG SPEEDSHIFT 9 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":240,"aceleracion0a100":3.6,"categoria":"SUV","descripcion":"El Mercedes-AMG G63 es el todoterreno de lujo definitivo. Su icónico diseño rectangular se combina con un V8 biturbo de 577 CV y tres diferenciales de bloqueo. Un símbolo de estatus que domina tanto el asfalto como los caminos más exigentes.","images":"[\"/vehicles/mercedes-g63-amg/1.jpg\",\"/vehicles/mercedes-g63-amg/2.jpg\",\"/vehicles/mercedes-g63-amg/3.jpg\",\"/vehicles/mercedes-g63-amg/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkz2mckudlsfeu","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllgcesd7m8pb99","slug":"mercedes-c63-amg","marca":"Mercedes-Benz","modelo":"C63 S AMG","año":2024,"precio":85000,"motor":"2.0L Turbo Inline-4 Híbrido Plug-in","potencia":671,"torque":1020,"transmision":"AMG SPEEDSHIFT 9 velocidades","combustible":"Híbrido","traccion":"RWD","velocidadMaxima":280,"aceleracion0a100":3.3,"categoria":"Sedán","descripcion":"El Mercedes-AMG C63 S adopta una revolucionaria mecánica híbrida enchufable de cuatro cilindros derivada de la F1, entregando 671 CV combinados. Una berlina compacta que redefine la potencia y la eficiencia en su segmento.","images":"[\"/vehicles/mercedes-c63-amg/1.jpg\",\"/vehicles/mercedes-c63-amg/2.jpg\",\"/vehicles/mercedes-c63-amg/3.jpg\",\"/vehicles/mercedes-c63-amg/4.jpg\"]","stock":3,"available":1,"featured":0,"brandId":"cmt0qdqlkz2mckudlsfeu","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllwn0cryike8jz","slug":"audi-rs6-avant","marca":"Audi","modelo":"RS6 Avant","año":2024,"precio":126890,"motor":"4.0L Twin-Turbo V8 Mild Hybrid","potencia":591,"torque":800,"transmision":"Tiptronic 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":305,"aceleracion0a100":3.6,"categoria":"Familiar","descripcion":"El Audi RS6 Avant es la definición absoluta del familiar deportivo. Bajo su carrocería de cinco puertas se oculta un V8 biturbo de 591 CV con tracción quattro. El equilibrio perfecto entre practicidad familiar y rendimiento extremo.","images":"[\"/vehicles/audi-rs6-avant/1.png\",\"/vehicles/audi-rs6-avant/2.jpg\",\"/vehicles/audi-rs6-avant/3.jpg\",\"/vehicles/audi-rs6-avant/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkbpfs38h542xy","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlli3v096iy3swt","slug":"audi-r8-v10","marca":"Audi","modelo":"R8 V10 Performance","año":2023,"precio":158000,"motor":"5.2L V10 Atmosférico","potencia":602,"torque":565,"transmision":"S tronic 7 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":331,"aceleracion0a100":3.2,"categoria":"Superdeportivo","descripcion":"El Audi R8 V10 Performance es el superdeportivo de Audi con motor central. Comparte el V10 atmosférico con la Lamborghini Huracán, entregando 602 CV con la precisión de la tracción quattro. El final glorioso de una era de motores atmosféricos.","images":"[\"/vehicles/audi-r8-v10/1.jpg\",\"/vehicles/audi-r8-v10/2.jpg\",\"/vehicles/audi-r8-v10/3.jpg\",\"/vehicles/audi-r8-v10/4.jpg\"]","stock":3,"available":1,"featured":0,"brandId":"cmt0qdqlkbpfs38h542xy","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllw0hcpjw6h0lc","slug":"audi-rs7-sportback","marca":"Audi","modelo":"RS7 Sportback","año":2024,"precio":128000,"motor":"4.0L Twin-Turbo V8 Mild Hybrid","potencia":591,"torque":800,"transmision":"Tiptronic 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":305,"aceleracion0a100":3.6,"categoria":"Coupé","descripcion":"El Audi RS7 Sportback combina la elegancia de un coupé con la potencia de un superdeportivo. Su V8 biturbo de 591 CV y la línea de techo flotante crean un gran turismo de cuatro puertas con un carácter decididamente deportivo.","images":"[\"/vehicles/audi-rs7-sportback/1.jpg\",\"/vehicles/audi-rs7-sportback/2.jpg\",\"/vehicles/audi-rs7-sportback/3.jpg\",\"/vehicles/audi-rs7-sportback/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkbpfs38h542xy","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlly5fbkg1hesoh","slug":"audi-sq8","marca":"Audi","modelo":"SQ8","año":2024,"precio":95000,"motor":"4.0L Twin-Turbo V8 Mild Hybrid","potencia":500,"torque":770,"transmision":"Tiptronic 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":250,"aceleracion0a100":4.1,"categoria":"SUV","descripcion":"El Audi SQ8 combina el lujo de un coupé SUV con la potencia de un V8 biturbo de 500 CV. Su diseño atlético y su interior premium lo posicionan como la opción equilibrada entre confort, deportividad y capacidad todoterreno.","images":"[\"/vehicles/audi-sq8/1.jpg\",\"/vehicles/audi-sq8/2.jpg\",\"/vehicles/audi-sq8/3.jpg\",\"/vehicles/audi-sq8/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkbpfs38h542xy","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlluknkb5rhntsh","slug":"tesla-model-s-plaid","marca":"Tesla","modelo":"Model S Plaid","año":2024,"precio":89990,"motor":"Tri-Motor Eléctrico","potencia":1020,"torque":1420,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":322,"aceleracion0a100":2.1,"categoria":"Sedán","descripcion":"La Tesla Model S Plaid es la revolución eléctrica hecha realidad. Sus tres motores generan 1020 CV que la catapultan de 0 a 100 km/h en menos de 2,1 segundos. Una combinación inigualable de aceleración brutal, autonomía y tecnología de vanguardia.","images":"[\"/vehicles/tesla-model-s-plaid/1.jpg\",\"/vehicles/tesla-model-s-plaid/2.jpg\",\"/vehicles/tesla-model-s-plaid/3.png\",\"/vehicles/tesla-model-s-plaid/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlkm3aob2qa9lkw","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllrpkzjbqgocmg","slug":"tesla-model-3-performance","marca":"Tesla","modelo":"Model 3 Performance","año":2024,"precio":52990,"motor":"Dual-Motor Eléctrico AWD","potencia":460,"torque":660,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":261,"aceleracion0a100":3.1,"categoria":"Sedán","descripcion":"La Tesla Model 3 Performance democratiza la alta gamma eléctrica. Con 460 CV y tracción dual, acelera de 0 a 100 km/h en 3,1 segundos. Su equilibrio entre autonomía, tecnología y precio la convierte en el referente del segmento.","images":"[\"/vehicles/tesla-model-3-performance/1.jpg\",\"/vehicles/tesla-model-3-performance/2.jpg\",\"/vehicles/tesla-model-3-performance/3.jpg\",\"/vehicles/tesla-model-3-performance/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkm3aob2qa9lkw","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllmeiqb1sv08tg","slug":"tesla-model-x-plaid","marca":"Tesla","modelo":"Model X Plaid","año":2024,"precio":99990,"motor":"Tri-Motor Eléctrico AWD","potencia":1020,"torque":1420,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":262,"aceleracion0a100":2.5,"categoria":"SUV","descripcion":"La Tesla Model X Plaid es el SUV eléctrico más potente del mundo. Con 1.020 CV y las icónicas puertas Falcon Wing, combina la potencia de un superdeportivo con la capacidad de un vehículo familiar de siete plazas y una autonomía excepcional.","images":"[\"/vehicles/tesla-model-x-plaid/1.jpg\",\"/vehicles/tesla-model-x-plaid/2.jpg\",\"/vehicles/tesla-model-x-plaid/3.jpg\",\"/vehicles/tesla-model-x-plaid/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkm3aob2qa9lkw","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll1f81zp3qy5qy","slug":"tesla-cybertruck","marca":"Tesla","modelo":"Cybertruck","año":2024,"precio":99990,"motor":"Tri-Motor Eléctrico AWD","potencia":845,"torque":1390,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":209,"aceleracion0a100":2.7,"categoria":"Pickup","descripcion":"La Tesla Cybertruck redefinió el diseño automovilístico con su carrocería de acero inoxidable exoesquelético. Con 845 CV, tracción integral y una capacidad de remolque de 5 toneladas, es una revolución visual y funcional en el mundo de las pickups eléctricas.","images":"[\"/vehicles/tesla-cybertruck/1.jpg\",\"/vehicles/tesla-cybertruck/2.jpg\",\"/vehicles/tesla-cybertruck/3.jpg\",\"/vehicles/tesla-cybertruck/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkm3aob2qa9lkw","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllkq8walybay7h","slug":"toyota-gr-supra","marca":"Toyota","modelo":"GR Supra","año":2024,"precio":56545,"motor":"3.0L Turbo Inline-6 (B58)","potencia":382,"torque":500,"transmision":"Automática 8 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":250,"aceleracion0a100":3.9,"categoria":"Coupé","descripcion":"La Toyota GR Supra regresa el espíritu del deportivo japonés puro. Desarrollada por Gazoo Racing, su motor de seis cilindros en línea turboalimentado y su peso equilibrado 50:50 ofrecen una experiencia de conducción táctil y emocionante en cada giro del volante.","images":"[\"/vehicles/toyota-gr-supra/1.jpg\",\"/vehicles/toyota-gr-supra/2.jpg\",\"/vehicles/toyota-gr-supra/3.png\",\"/vehicles/toyota-gr-supra/4.png\"]","stock":3,"available":1,"featured":0,"brandId":"cmt0qdqlk5nxyapyhogsc","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll26s2puu3c73t","slug":"toyota-gr-corolla","marca":"Toyota","modelo":"GR Corolla","año":2024,"precio":36000,"motor":"1.6L Turbo Inline-3 (G16E-GTS)","potencia":300,"torque":400,"transmision":"Manual 6 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":230,"aceleracion0a100":4.9,"categoria":"Hatchback","descripcion":"La Toyota GR Corolla lleva el ADN de rally al compacto diario. Su motor tricilíndrico turbo de 300 CV y la tracción integral GR-Four con diferenciales Torsen la convierten en una de las máquinas más divertidas y carismáticas de su generación.","images":"[\"/vehicles/toyota-gr-corolla/1.jpg\",\"/vehicles/toyota-gr-corolla/2.jpg\",\"/vehicles/toyota-gr-corolla/3.jpg\",\"/vehicles/toyota-gr-corolla/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk5nxyapyhogsc","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlle2has94mup7c","slug":"toyota-land-cruiser","marca":"Toyota","modelo":"Land Cruiser","año":2024,"precio":55950,"motor":"2.4L Turbo Inline-4 Híbrido","potencia":326,"torque":630,"transmision":"Automática 8 velocidades","combustible":"Híbrido","traccion":"AWD","velocidadMaxima":210,"aceleracion0a100":6.5,"categoria":"SUV","descripcion":"La Toyota Land Cruiser es la leyenda todoterreno reimaginada para la era híbrida. Con 75 años de herencia, su nuevo propulsor híbrido turbo de 326 CV y la tracción integral permanente lo mantienen como el referente de fiabilidad y capacidad off-road.","images":"[\"/vehicles/toyota-land-cruiser/1.jpg\",\"/vehicles/toyota-land-cruiser/2.jpg\",\"/vehicles/toyota-land-cruiser/3.png\",\"/vehicles/toyota-land-cruiser/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk5nxyapyhogsc","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllmswqrol0tf10","slug":"toyota-camry-trd","marca":"Toyota","modelo":"Camry TRD","año":2021,"precio":35500,"motor":"3.5L V6 Atmosférico (2GR-FKS)","potencia":301,"torque":362,"transmision":"Automática 8 velocidades","combustible":"Gasolina","traccion":"FWD","velocidadMaxima":220,"aceleracion0a100":5.8,"categoria":"Sedán","descripcion":"La Toyota Camry TRD lleva el espíritu deportivo a la berlina familiar por excelencia. Su V6 atmosférico de 301 CV se combina con suspensión deportiva TRD y un aerodinámico agresivo, creando una sorprendente versión de alto rendimiento de un clásico.","images":"[\"/vehicles/toyota-camry-trd/1.jpg\",\"/vehicles/toyota-camry-trd/2.jpg\",\"/vehicles/toyota-camry-trd/3.jpg\",\"/vehicles/toyota-camry-trd/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk5nxyapyhogsc","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllxpxik5ozkmd7","slug":"honda-civic-type-r","marca":"Honda","modelo":"Civic Type R","año":2024,"precio":44990,"motor":"2.0L Turbo Inline-4 (K20C1)","potencia":315,"torque":420,"transmision":"Manual 6 velocidades","combustible":"Gasolina","traccion":"FWD","velocidadMaxima":275,"aceleracion0a100":5.4,"categoria":"Hatchback","descripcion":"La Honda Civic Type R es el rey indiscutible de los compactos deportivos. Su motor turboalimentado de 315 CV acoplado a una transmisión manual de seis velocidades y un chasis afinado en el Nürburgring la convierten en la alegría pura de conducir.","images":"[\"/vehicles/honda-civic-type-r/1.jpg\",\"/vehicles/honda-civic-type-r/2.jpg\",\"/vehicles/honda-civic-type-r/3.jpg\",\"/vehicles/honda-civic-type-r/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk2i6be90u5vuv","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll1j87mdx98h48","slug":"honda-nsx-types","marca":"Honda","modelo":"NSX Type S","año":2022,"precio":171495,"motor":"3.5L Twin-Turbo V6 Híbrido","potencia":600,"torque":667,"transmision":"DCT 9 velocidades","combustible":"Híbrido","traccion":"AWD","velocidadMaxima":307,"aceleracion0a100":3,"categoria":"Superdeportivo","descripcion":"La Honda NSX Type S despide a la segunda generación del superdeportivo japonés con 600 CV combinados de su V6 biturbo y tres motores eléctricos. Una obra maestra de precisión híbrida con tracción integral SH-AWD y la filosofía pura de Honda.","images":"[\"/vehicles/honda-nsx-types/1.jpg\",\"/vehicles/honda-nsx-types/2.jpg\",\"/vehicles/honda-nsx-types/3.jpg\",\"/vehicles/honda-nsx-types/4.jpg\"]","stock":4,"available":1,"featured":0,"brandId":"cmt0qdqlk2i6be90u5vuv","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllc77z69w24v9k","slug":"honda-accord","marca":"Honda","modelo":"Accord Sport","año":2024,"precio":31895,"motor":"1.5L Turbo Inline-4 (L15CH)","potencia":192,"torque":260,"transmision":"CVT","combustible":"Gasolina","traccion":"FWD","velocidadMaxima":195,"aceleracion0a100":7.2,"categoria":"Sedán","descripcion":"La Honda Accord Sport combina la elegancia de una berlina mediana con un toque deportivo. Su motor turboalimentado de 192 CV ofrece eficiencia y respuesta ágil, en un interior refinado y tecnológico que redefine el segmento.","images":"[\"/vehicles/honda-accord/1.jpg\",\"/vehicles/honda-accord/2.jpg\",\"/vehicles/honda-accord/3.jpg\",\"/vehicles/honda-accord/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk2i6be90u5vuv","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll38mccfibz126","slug":"honda-integra-types","marca":"Honda","modelo":"Integra Type S","año":2024,"precio":51900,"motor":"2.0L Turbo Inline-4 (K20C1)","potencia":320,"torque":420,"transmision":"Manual 6 velocidades","combustible":"Gasolina","traccion":"FWD","velocidadMaxima":265,"aceleracion0a100":5.2,"categoria":"Sedán","descripcion":"La Acura Integra Type S revive el legendario nombre con un enfoque moderno. Comparte el motor turbo de 320 CV del Civic Type R en un chasis propio, con transmisión manual y un carácter más refinado pero igual de emocionante.","images":"[\"/vehicles/honda-integra-types/1.jpg\",\"/vehicles/honda-integra-types/2.jpeg\",\"/vehicles/honda-integra-types/3.jpg\",\"/vehicles/honda-integra-types/4.jpg\"]","stock":3,"available":1,"featured":0,"brandId":"cmt0qdqlk2i6be90u5vuv","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll9ue5cvicxuye","slug":"ford-mustang-gt","marca":"Ford","modelo":"Mustang GT","año":2024,"precio":43545,"motor":"5.0L V8 (Coyote)","potencia":480,"torque":570,"transmision":"Manual 6 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":250,"aceleracion0a100":4.2,"categoria":"Coupé","descripcion":"El Ford Mustang GT es la encarnación moderna del muscle car americano. Su legendario V8 Coyote de 5.0 litros ruge con 480 CV, combinando la herencia de seis décadas de libertad con la tecnología y el confort de la séptima generación.","images":"[\"/vehicles/ford-mustang-gt/1.jpg\",\"/vehicles/ford-mustang-gt/2.jpg\",\"/vehicles/ford-mustang-gt/3.jpg\",\"/vehicles/ford-mustang-gt/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkyjnnmix224t8","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll2bwn6ftok4xc","slug":"ford-gt","marca":"Ford","modelo":"GT","año":2023,"precio":500000,"motor":"3.5L Twin-Turbo V6 (EcoBoost)","potencia":660,"torque":746,"transmision":"DCT 7 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":347,"aceleracion0a100":2.8,"categoria":"Superdeportivo","descripcion":"El Ford GT es el superdeportivo de motor central inspirado en el legendario GT40. Su chasis de fibra de carbono y el V6 EcoBoost biturbo de 660 CV rinden homenaje a las victorias de Le Mans, combinando aerodinámica activa y diseño de vanguardia.","images":"[\"/vehicles/ford-gt/1.jpg\",\"/vehicles/ford-gt/2.jpg\",\"/vehicles/ford-gt/3.jpg\",\"/vehicles/ford-gt/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkyjnnmix224t8","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll8jb14j6y6zn8","slug":"ford-f150-raptor-r","marca":"Ford","modelo":"F-150 Raptor R","año":2024,"precio":109145,"motor":"5.2L Supercharged V8 (Predator)","potencia":720,"torque":868,"transmision":"Automática 10 velocidades","combustible":"Gasolina","traccion":"4WD","velocidadMaxima":180,"aceleracion0a100":3.7,"categoria":"Pickup","descripcion":"La Ford F-150 Raptor R lleva el V8 supercargado de 720 CV del Shelby GT500 al rey de las pickups todoterreno. Con suspensión de largo recorrido y tracción 4x4, es la máquina definitiva para conquistar cualquier terreno a alta velocidad.","images":"[\"/vehicles/ford-f150-raptor-r/1.jpg\",\"/vehicles/ford-f150-raptor-r/2.jpg\",\"/vehicles/ford-f150-raptor-r/3.jpg\",\"/vehicles/ford-f150-raptor-r/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkyjnnmix224t8","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllx6akww7ibq3c","slug":"ford-bronco-raptor","marca":"Ford","modelo":"Bronco Raptor","año":2024,"precio":89535,"motor":"3.0L Twin-Turbo V6 (EcoBoost)","potencia":418,"torque":587,"transmision":"Automática 10 velocidades","combustible":"Gasolina","traccion":"4WD","velocidadMaxima":180,"aceleracion0a100":5.5,"categoria":"SUV","descripcion":"El Ford Bronco Raptor combina la capacidad todoterreno extrema con la filosofía de rendimiento Raptor. Su V6 biturbo de 418 CV, suspensión FOX Live Valve y trocha ampliada lo convierten en el SUV todoterreno de alta velocidad más capaz del mercado.","images":"[\"/vehicles/ford-bronco-raptor/1.jpg\",\"/vehicles/ford-bronco-raptor/2.jpg\",\"/vehicles/ford-bronco-raptor/3.jpg\",\"/vehicles/ford-bronco-raptor/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkyjnnmix224t8","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllj5cpvvcn941o","slug":"chevrolet-corvette-z06","marca":"Chevrolet","modelo":"Corvette Z06","año":2024,"precio":112700,"motor":"5.5L V8 Atmosférico (LT6)","potencia":670,"torque":623,"transmision":"DCT 8 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":312,"aceleracion0a100":2.6,"categoria":"Superdeportivo","descripcion":"La Chevrolet Corvette Z06 eleva el ícono americano al territorio de los superdeportivos. Su motor V8 atmosférico de 5.5L con cigüeñal plano gira hasta 8.600 rpm entregando 670 CV, con un chasis de motor central que compite con lo mejor de Europa.","images":"[\"/vehicles/chevrolet-corvette-z06/1.jpg\",\"/vehicles/chevrolet-corvette-z06/2.jpg\",\"/vehicles/chevrolet-corvette-z06/3.jpg\",\"/vehicles/chevrolet-corvette-z06/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlk9n5d63w5hkye","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll9y9xta4yzjr8","slug":"chevrolet-camaro-zl1","marca":"Chevrolet","modelo":"Camaro ZL1","año":2024,"precio":76995,"motor":"6.2L Supercharged V8 (LT4)","potencia":650,"torque":881,"transmision":"Manual 6 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":318,"aceleracion0a100":3.5,"categoria":"Coupé","descripcion":"La Chevrolet Camaro ZL1 es la respuesta de Chevy al muscle car extremo. Su V8 supercargado LT4 de 650 CV, aerodinámica de pista y un chasis extraordinariamente afinado la convierten en una Bestia track-day con un carácter americano inconfundible.","images":"[\"/vehicles/chevrolet-camaro-zl1/1.jpg\",\"/vehicles/chevrolet-camaro-zl1/2.jpg\",\"/vehicles/chevrolet-camaro-zl1/3.jpg\",\"/vehicles/chevrolet-camaro-zl1/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk9n5d63w5hkye","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlllrqxgad1m0rx","slug":"chevrolet-silverado-zr2","marca":"Chevrolet","modelo":"Silverado ZR2","año":2024,"precio":72175,"motor":"6.2L V8 (L87)","potencia":420,"torque":624,"transmision":"Automática 10 velocidades","combustible":"Gasolina","traccion":"4WD","velocidadMaxima":160,"aceleracion0a100":5.8,"categoria":"Pickup","descripcion":"La Chevrolet Silverado ZR2 es la pickup todoterreno más capaz de Chevy. Con suspensión Multimático de posición variable, diferenciales de bloqueo electrónicos delantero y trasero, y un V8 de 420 CV, está lista para conquistar los terrenos más hostiles.","images":"[\"/vehicles/chevrolet-silverado-zr2/1.jpg\",\"/vehicles/chevrolet-silverado-zr2/2.jpg\",\"/vehicles/chevrolet-silverado-zr2/3.jpg\",\"/vehicles/chevrolet-silverado-zr2/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk9n5d63w5hkye","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll540tf1hrsfet","slug":"chevrolet-tahoe-rst","marca":"Chevrolet","modelo":"Tahoe RST","año":2024,"precio":65200,"motor":"6.2L V8 (L87)","potencia":420,"torque":624,"transmision":"Automática 10 velocidades","combustible":"Gasolina","traccion":"4WD","velocidadMaxima":200,"aceleracion0a100":5.9,"categoria":"SUV","descripcion":"La Chevrolet Tahoe RST combina la capacidad de un SUV de tamaño completo con un estilo deportivo agresivo. Su V8 de 420 CV, detalles exteriores en negro y rines de 22 pulgadas la convierten en una opción imponente para la familia que no renuncia al estilo.","images":"[\"/vehicles/chevrolet-tahoe-rst/1.jpg\",\"/vehicles/chevrolet-tahoe-rst/2.jpg\",\"/vehicles/chevrolet-tahoe-rst/3.jpg\",\"/vehicles/chevrolet-tahoe-rst/4.jpg\"]","stock":4,"available":1,"featured":0,"brandId":"cmt0qdqlk9n5d63w5hkye","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlluykmuc07lj5t","slug":"nissan-gtr-nismo","marca":"Nissan","modelo":"GT-R Nismo","año":2023,"precio":215000,"motor":"3.8L Twin-Turbo V6 (VR38DETT)","potencia":600,"torque":652,"transmision":"DCT 6 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":315,"aceleracion0a100":2.5,"categoria":"Superdeportivo","descripcion":"La Nissan GT-R Nismo, conocida como Godzilla, es el máximo exponente de la ingeniería japonesa de rendimiento. Cada motor es ensamblado a mano por un maestro Takumi, entregando 600 CV con una tracción integral ATTESA E-TS que domina cualquier trazada.","images":"[\"/vehicles/nissan-gtr-nismo/1.jpg\",\"/vehicles/nissan-gtr-nismo/2.jpg\",\"/vehicles/nissan-gtr-nismo/3.jpg\",\"/vehicles/nissan-gtr-nismo/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkfuipsqjw3svk","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll06ste6f2te83","slug":"nissan-z-nismo","marca":"Nissan","modelo":"Z Nismo","año":2024,"precio":52970,"motor":"3.0L Twin-Turbo V6 (VR30DDTT)","potencia":420,"torque":520,"transmision":"Automática 9 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":250,"aceleracion0a100":4,"categoria":"Coupé","descripcion":"La Nissan Z Nismo revive la leyenda del deportivo japonés con un V6 biturbo de 420 CV. Su diseño rinde homenaje a los Z clásicos mientras incorpora tecnología moderna y una puesta a punto Nismo orientada a circuito para una experiencia pura y emocionante.","images":"[\"/vehicles/nissan-z-nismo/1.jpg\",\"/vehicles/nissan-z-nismo/2.jpg\",\"/vehicles/nissan-z-nismo/3.jpg\",\"/vehicles/nissan-z-nismo/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlkfuipsqjw3svk","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllyjv1m9ngu02u","slug":"nissan-ariya","marca":"Nissan","modelo":"Ariya","año":2024,"precio":51530,"motor":"Dual-Motor Eléctrico AWD (e-4ORCE)","potencia":389,"torque":600,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":200,"aceleracion0a100":5.1,"categoria":"SUV","descripcion":"La Nissan Ariya es el SUV crossover eléctrico que redefine la movilidad de la marca. Con el sistema de tracción integral e-4ORCE de 389 CV, ofrece una conducción suave y refinada, interior minimalista y una autonomía pensada para el uso diario sin compromisos.","images":"[\"/vehicles/nissan-ariya/1.png\",\"/vehicles/nissan-ariya/2.jpg\",\"/vehicles/nissan-ariya/3.jpg\",\"/vehicles/nissan-ariya/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkfuipsqjw3svk","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll13opfvuh1jcl","slug":"nissan-frontier","marca":"Nissan","modelo":"Frontier PRO-4X","año":2024,"precio":39120,"motor":"3.8L V6 Atmosférico (VQ40DE)","potencia":310,"torque":381,"transmision":"Automática 9 velocidades","combustible":"Gasolina","traccion":"4WD","velocidadMaxima":180,"aceleracion0a100":7,"categoria":"Pickup","descripcion":"La Nissan Frontier PRO-4X es la pickup mediana todoterreno robusta y fiable. Su V6 atmosférico de 310 CV, tracción 4x4 con diferencial de bloqueo trasero y suspensión afinada para off-road la convierten en una compañera ideal para la aventura.","images":"[\"/vehicles/nissan-frontier/1.jpg\",\"/vehicles/nissan-frontier/2.jpg\",\"/vehicles/nissan-frontier/3.jpg\",\"/vehicles/nissan-frontier/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkfuipsqjw3svk","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll3ve76a67n6ep","slug":"mclaren-750s","marca":"McLaren","modelo":"750S","año":2024,"precio":324000,"motor":"4.0L Twin-Turbo V8 (M840T)","potencia":740,"torque":800,"transmision":"DCT 7 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":332,"aceleracion0a100":2.8,"categoria":"Superdeportivo","descripcion":"El McLaren 750S es la encarnación más ligera y potente de la serie Super. Su V8 biturbo de 740 CV y un peso de solo 1.389 kg lo convierten en uno de los deportivos más rápidos y puros del mundo, con una relación peso-potencia extraordinaria.","images":"[\"/vehicles/mclaren-750s/1.jpg\",\"/vehicles/mclaren-750s/2.jpg\",\"/vehicles/mclaren-750s/3.jpeg\",\"/vehicles/mclaren-750s/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkyxt9qyslui2e","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllj027yfg5nysk","slug":"mclaren-artura","marca":"McLaren","modelo":"Artura","año":2024,"precio":233000,"motor":"3.0L Twin-Turbo V6 Híbrido","potencia":671,"torque":720,"transmision":"DCT 8 velocidades","combustible":"Híbrido","traccion":"RWD","velocidadMaxima":330,"aceleracion0a100":3,"categoria":"Superdeportivo","descripcion":"El McLaren Artura inaugura una nueva plataforma de carbono híbrida. Su V6 biturbo combinado con un motor eléctrico entrega 671 CV, ofreciendo la respuesta inmediata de la electrificación con el carácter explosivo de McLaren.","images":"[\"/vehicles/mclaren-artura/1.jpg\",\"/vehicles/mclaren-artura/2.jpg\",\"/vehicles/mclaren-artura/3.jpg\",\"/vehicles/mclaren-artura/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkyxt9qyslui2e","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll2nvge2qzxjoe","slug":"aston-martin-db12","marca":"Aston Martin","modelo":"DB12","año":2024,"precio":245000,"motor":"4.0L Twin-Turbo V8","potencia":671,"torque":800,"transmision":"ZF 8 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":325,"aceleracion0a100":3.6,"categoria":"Coupé","descripcion":"El Aston Martin DB12 redefine el gran turismo británico. Su V8 biturbo de 671 CV combinado con un chasis radicalmente nuevo ofrece una mezcla perfecta de refinamiento de largo recorrido y prestaciones de superdeportivo.","images":"[\"/vehicles/aston-martin-db12/1.jpg\",\"/vehicles/aston-martin-db12/2.jpg\",\"/vehicles/aston-martin-db12/3.jpg\",\"/vehicles/aston-martin-db12/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlkdlik7f4ehm14","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlltgpaw8fcok6r","slug":"aston-martin-vantage","marca":"Aston Martin","modelo":"Vantage","año":2024,"precio":191000,"motor":"4.0L Twin-Turbo V8","potencia":656,"torque":800,"transmision":"ZF 8 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":325,"aceleracion0a100":3.5,"categoria":"Coupé","descripcion":"El Aston Martin Vantage es el deportivo puro de la marca británica. Con 656 CV de su V8 biturbo y un diseño agresivo, combina la elegancia característica de Aston Martin con una ferocidad orientada a pista.","images":"[\"/vehicles/aston-martin-vantage/1.jpg\",\"/vehicles/aston-martin-vantage/2.jpg\",\"/vehicles/aston-martin-vantage/3.jpeg\",\"/vehicles/aston-martin-vantage/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlkdlik7f4ehm14","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll3x9prywr65hj","slug":"bentley-continental-gt","marca":"Bentley","modelo":"Continental GT Speed","año":2024,"precio":287000,"motor":"6.0L Twin-Turbo W12","potencia":650,"torque":900,"transmision":"DCT 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":335,"aceleracion0a100":3.5,"categoria":"Coupé","descripcion":"El Bentley Continental GT Speed representa la cúspide del gran turismo de lujo. Su legendario W12 biturbo de 650 CV envuelve al conductor en un interior de artesanía incomparable, con capacidad de alcanzar 335 km/h con serenidad absoluta.","images":"[\"/vehicles/bentley-continental-gt/1.jpg\",\"/vehicles/bentley-continental-gt/2.jpg\",\"/vehicles/bentley-continental-gt/3.jpg\",\"/vehicles/bentley-continental-gt/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkfzc5cslqlyrr","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll4e9z71123ltw","slug":"bentley-bentayga","marca":"Bentley","modelo":"Bentayga EWB","año":2024,"precio":246000,"motor":"4.0L Twin-Turbo V8","potencia":542,"torque":770,"transmision":"ZF 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":290,"aceleracion0a100":4.5,"categoria":"SUV","descripcion":"El Bentley Bentayga EWB es el SUV de lujo definitivo. Con batalla extendida y un V8 biturbo de 542 CV, combina el confort de una limusina con la capacidad de un todoterreno y el refinamiento característico de Crewe.","images":"[\"/vehicles/bentley-bentayga/1.jpg\",\"/vehicles/bentley-bentayga/2.jpg\",\"/vehicles/bentley-bentayga/3.jpg\",\"/vehicles/bentley-bentayga/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkfzc5cslqlyrr","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllxpmnz90mvmxs","slug":"rolls-royce-ghost","marca":"Rolls-Royce","modelo":"Ghost","año":2024,"precio":355000,"motor":"6.75L Twin-Turbo V12","potencia":563,"torque":850,"transmision":"ZF 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":250,"aceleracion0a100":4.7,"categoria":"Sedán","descripcion":"El Rolls-Royce Ghost encarna el lujo sereno. Su V12 biturbo de 6.75 litros funciona con una suavidad sobrenatural, mientras el Planar Suspension System crea la sensación de 'volar' por la carretera. Lujo puro sin concesiones.","images":"[\"/vehicles/rolls-royce-ghost/1.jpg\",\"/vehicles/rolls-royce-ghost/2.jpg\",\"/vehicles/rolls-royce-ghost/3.jpg\",\"/vehicles/rolls-royce-ghost/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkaa3a2jcdsz2q","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll487oiailgxkk","slug":"rolls-royce-cullinan","marca":"Rolls-Royce","modelo":"Cullinan","año":2024,"precio":390000,"motor":"6.75L Twin-Turbo V12","potencia":563,"torque":850,"transmision":"ZF 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":250,"aceleracion0a100":5.2,"categoria":"SUV","descripcion":"El Rolls-Royce Cullinan es el SUV de lujo más exclusivo del mundo. Su V12 de 563 CV y la suspensión mágica lo convierten en un santuario móvil capaz de conquistar cualquier terreno con una elegancia inigualable.","images":"[\"/vehicles/rolls-royce-cullinan/1.jpg\",\"/vehicles/rolls-royce-cullinan/2.jpg\",\"/vehicles/rolls-royce-cullinan/3.jpg\",\"/vehicles/rolls-royce-cullinan/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkaa3a2jcdsz2q","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllrjkm50iniztl","slug":"lexus-lc500","marca":"Lexus","modelo":"LC 500","año":2024,"precio":99300,"motor":"5.0L V8 Atmosférico (2UR-GSE)","potencia":471,"torque":540,"transmision":"Automática 10 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":270,"aceleracion0a100":4.4,"categoria":"Coupé","descripcion":"El Lexus LC 500 es un gran turismo japonés con un V8 atmosférico de 471 CV que entrega una experiencia sonora y táctil incomparable. Su diseño sculptural y su interior artesanal lo convierten en una obra de arte rodante.","images":"[\"/vehicles/lexus-lc500/1.jpg\",\"/vehicles/lexus-lc500/2.jpg\",\"/vehicles/lexus-lc500/3.jpg\",\"/vehicles/lexus-lc500/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkwkj4rc1awmot","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll0w7lxpf97sv5","slug":"lexus-rx-fsport","marca":"Lexus","modelo":"RX 450h+ F Sport","año":2024,"precio":73000,"motor":"2.5L Híbrido Enchufable","potencia":309,"torque":335,"transmision":"e-CVT","combustible":"Híbrido","traccion":"AWD","velocidadMaxima":200,"aceleracion0a100":6.5,"categoria":"SUV","descripcion":"El Lexus RX 450h+ F Sport combina la eficiencia híbrida enchufable con la deportividad F Sport. Su sistema de 309 CV ofrece una conducción refinada y silenciosa, con el lujo y la fiabilidad característicos de Lexus.","images":"[\"/vehicles/lexus-rx-fsport/1.jpeg\",\"/vehicles/lexus-rx-fsport/2.jpg\",\"/vehicles/lexus-rx-fsport/3.jpg\",\"/vehicles/lexus-rx-fsport/4.jpg\"]","stock":3,"available":1,"featured":0,"brandId":"cmt0qdqlkwkj4rc1awmot","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll1wsttcurr3xp","slug":"volvo-xc90-recharge","marca":"Volvo","modelo":"XC90 Recharge","año":2024,"precio":71900,"motor":"2.0L Turbo Híbrido Enchufable","potencia":455,"torque":709,"transmision":"Automática 8 velocidades","combustible":"Híbrido","traccion":"AWD","velocidadMaxima":180,"aceleracion0a100":5.3,"categoria":"SUV","descripcion":"El Volvo XC90 Recharge combina la seguridad escandinava con la electrificación. Su sistema híbrido enchufable de 455 CV ofrece prestaciones de deportivo en un SUV familiar de siete plazas, con la elegancia minimalista de Volvo.","images":"[\"/vehicles/volvo-xc90-recharge/1.jpg\",\"/vehicles/volvo-xc90-recharge/2.jpg\",\"/vehicles/volvo-xc90-recharge/3.jpg\",\"/vehicles/volvo-xc90-recharge/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk3s2vxcj1kn78","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllg1tyzf0y9yfr","slug":"volvo-xc60","marca":"Volvo","modelo":"XC60 B5","año":2024,"precio":47000,"motor":"2.0L Turbo Mild Hybrid","potencia":247,"torque":360,"transmision":"Automática 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":220,"aceleracion0a100":7.1,"categoria":"SUV","descripcion":"El Volvo XC60 B5 es el SUV premium compacto por excelencia. Con 247 CV de su motor turbo híbrido ligero, ofrece un equilibrio perfecto entre confort, seguridad y diseño escandinavo atemporal.","images":"[\"/vehicles/volvo-xc60/1.jpg\",\"/vehicles/volvo-xc60/2.jpg\",\"/vehicles/volvo-xc60/3.jpg\",\"/vehicles/volvo-xc60/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk3s2vxcj1kn78","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlljgth5llqb73x","slug":"rivian-r1t","marca":"Rivian","modelo":"R1T","año":2024,"precio":71700,"motor":"Quad-Motor Eléctrico AWD","potencia":835,"torque":0,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":177,"aceleracion0a100":3,"categoria":"Pickup","descripcion":"La Rivian R1T reinventa la pickup eléctrica con cuatro motores independientes que generan 835 CV. Capaz de cruzar ríos de 1 metro de profundidad y acelerar de 0 a 100 en 3 segundos, es la aventura eléctrica definitiva.","images":"[\"/vehicles/rivian-r1t/1.jpg\",\"/vehicles/rivian-r1t/2.jpg\",\"/vehicles/rivian-r1t/3.jpg\",\"/vehicles/rivian-r1t/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkuudko79sxog5","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllguini4zfkpva","slug":"rivian-r1s","marca":"Rivian","modelo":"R1S","año":2024,"precio":75700,"motor":"Quad-Motor Eléctrico AWD","potencia":835,"torque":0,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":201,"aceleracion0a100":3,"categoria":"SUV","descripcion":"La Rivian R1S lleva la misma tecnología quad-motor de 835 CV de la R1T a un SUV de siete plazas. Con capacidad todoterreno excepcional y autonomía de hasta 640 km, es el SUV eléctrico de aventura más capaz.","images":"[\"/vehicles/rivian-r1s/1.jpg\",\"/vehicles/rivian-r1s/2.jpg\",\"/vehicles/rivian-r1s/3.jpg\",\"/vehicles/rivian-r1s/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkuudko79sxog5","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll04078ejoi7d1","slug":"byd-han-ev","marca":"BYD","modelo":"Han EV","año":2024,"precio":45000,"motor":"Dual-Motor Eléctrico AWD","potencia":517,"torque":0,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":185,"aceleracion0a100":3.9,"categoria":"Sedán","descripcion":"El BYD Han EV es la berlina eléctrica insignia de la marca china. Con 517 CV de sus dos motores y la tecnología de batería Blade, ofrece prestaciones de deportivo con la seguridad y autonomía de última generación.","images":"[\"/vehicles/byd-han-ev/1.jpg\",\"/vehicles/byd-han-ev/2.jpeg\",\"/vehicles/byd-han-ev/3.jpg\",\"/vehicles/byd-han-ev/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlknqx5flfs1z7i","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllycrqiiz7s3dq","slug":"byd-seal","marca":"BYD","modelo":"Seal","año":2024,"precio":38000,"motor":"Dual-Motor Eléctrico AWD","potencia":523,"torque":0,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":180,"aceleracion0a100":3.8,"categoria":"Sedán","descripcion":"El BYD Seal es un sedán eléctrico deportivo con 523 CV y la batería Blade de seguridad extrema. Su diseño aerodinámico y su plataforma e-Platform 3.0 lo posicionan como un competidor de primer nivel en la electromovilidad.","images":"[\"/vehicles/byd-seal/1.jpg\",\"/vehicles/byd-seal/2.png\",\"/vehicles/byd-seal/3.jpeg\",\"/vehicles/byd-seal/4.jpg\"]","stock":3,"available":1,"featured":0,"brandId":"cmt0qdqlknqx5flfs1z7i","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlle71g9qkopgya","slug":"dodge-charger-hellcat","marca":"Dodge","modelo":"Charger Hellcat Redeye","año":2023,"precio":82000,"motor":"6.2L Supercharged V8 (Hellcat)","potencia":797,"torque":959,"transmision":"Automática 8 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":326,"aceleracion0a100":3.6,"categoria":"Sedán","descripcion":"El Dodge Charger Hellcat Redeye es el sedán de producción más potente del mundo. Su V8 supercargado de 797 CV hace rugir el muscle car americano en una berlina de cuatro puertas capaz de superar los 320 km/h.","images":"[\"/vehicles/dodge-charger-hellcat/1.jpg\",\"/vehicles/dodge-charger-hellcat/2.jpg\",\"/vehicles/dodge-charger-hellcat/3.jpg\",\"/vehicles/dodge-charger-hellcat/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk2vcbw7ewdqp3","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllls5t386sb34c","slug":"dodge-demon-170","marca":"Dodge","modelo":"Challenger SRT Demon 170","año":2023,"precio":96666,"motor":"6.2L Supercharged V8 (Hemi)","potencia":1025,"torque":1281,"transmision":"Automática 8 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":350,"aceleracion0a100":1.66,"categoria":"Coupé","descripcion":"El Dodge Challenger SRT Demon 170 es el muscle car más extremo jamás construido. Con 1.025 CV con combustible E85, es el primer coche de producción en bajar de los 2 segundos en el cuarto de milla. Una despedida épica del V8.","images":"[\"/vehicles/dodge-demon-170/1.jpg\",\"/vehicles/dodge-demon-170/2.jpg\",\"/vehicles/dodge-demon-170/3.jpg\",\"/vehicles/dodge-demon-170/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk2vcbw7ewdqp3","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllpobzuamfl50z","slug":"jeep-wrangler-rubicon","marca":"Jeep","modelo":"Wrangler Rubicon 392","año":2024,"precio":85000,"motor":"6.4L V8 (SRT)","potencia":470,"torque":637,"transmision":"Automática 8 velocidades","combustible":"Gasolina","traccion":"4WD","velocidadMaxima":160,"aceleracion0a100":4.5,"categoria":"SUV","descripcion":"El Jeep Wrangler Rubicon 392 combina la legendaria capacidad todoterreno del Wrangler con un V8 de 470 CV. El único Wrangler con motor V8 de fábrica, ofrece un rugido inconfundible y una capacidad off-road sin igual.","images":"[\"/vehicles/jeep-wrangler-rubicon/1.jpg\",\"/vehicles/jeep-wrangler-rubicon/2.jpg\",\"/vehicles/jeep-wrangler-rubicon/3.jpg\",\"/vehicles/jeep-wrangler-rubicon/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlke70nz1ick2na","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllyk4z5pkno0q5","slug":"jeep-grand-cherokee-trackhawk","marca":"Jeep","modelo":"Grand Cherokee Trackhawk","año":2023,"precio":89000,"motor":"6.2L Supercharged V8 (Hellcat)","potencia":707,"torque":875,"transmision":"Automática 8 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":290,"aceleracion0a100":3.5,"categoria":"SUV","descripcion":"El Jeep Grand Cherokee Trackhawk es el SUV más loco del mundo, con el motor Hellcat supercargado de 707 CV. Un familiar de cinco plazas que acelera de 0 a 100 en 3.5 segundos y alcanza 290 km/h.","images":"[\"/vehicles/jeep-grand-cherokee-trackhawk/1.jpg\",\"/vehicles/jeep-grand-cherokee-trackhawk/2.jpg\",\"/vehicles/jeep-grand-cherokee-trackhawk/3.jpg\",\"/vehicles/jeep-grand-cherokee-trackhawk/4.jpg\"]","stock":3,"available":1,"featured":0,"brandId":"cmt0qdqlke70nz1ick2na","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlljd1h1vnvh7y4","slug":"subaru-wrx-sti","marca":"Subaru","modelo":"WRX STI","año":2024,"precio":45000,"motor":"2.5L Turbo Boxer-4 (EJ257)","potencia":310,"torque":392,"transmision":"Manual 6 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":255,"aceleracion0a100":5.3,"categoria":"Sedán","descripcion":"El Subaru WRX STI es el icono de los rallyes moderno. Su motor bóxer turbo de 310 CV y la legendaria tracción симmetrical AWD con DCCD ofrecen una dinámica de conducción única, nacida en los tramos especiales del WRC.","images":"[\"/vehicles/subaru-wrx-sti/1.jpg\",\"/vehicles/subaru-wrx-sti/2.jpg\",\"/vehicles/subaru-wrx-sti/3.jpg\",\"/vehicles/subaru-wrx-sti/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlke3pybsq9rvrr","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllsv7zb45zam8a","slug":"subaru-outback","marca":"Subaru","modelo":"Outback Wilderness","año":2024,"precio":38000,"motor":"2.4L Turbo Boxer-4","potencia":260,"torque":377,"transmision":"CVT","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":220,"aceleracion0a100":5.9,"categoria":"Familiar","descripcion":"El Subaru Outback Wilderness es el familiar aventurero definitivo. Con suspensión elevada, motor bóxer turbo de 260 CV y tracción симmetrical AWD, combina la practicidad de un familiar con la capacidad todoterreno de un SUV.","images":"[\"/vehicles/subaru-outback/1.jpg\",\"/vehicles/subaru-outback/2.jpg\",\"/vehicles/subaru-outback/3.jpg\",\"/vehicles/subaru-outback/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlke3pybsq9rvrr","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll1mvaymhf8m7y","slug":"peugeot-308-gt","marca":"Peugeot","modelo":"308 GT","año":2024,"precio":35000,"motor":"1.6L Turbo Inline-4 (PureTech)","potencia":225,"torque":300,"transmision":"Automática 8 velocidades","combustible":"Gasolina","traccion":"FWD","velocidadMaxima":235,"aceleracion0a100":7.5,"categoria":"Hatchback","descripcion":"El Peugeot 308 GT combina el diseño elegante francés con un motor turbo de 225 CV. Su interior i-Cockpit con pantalla 3D y su chasis afinado ofrecen una experiencia de conducción refinada y deportiva en un compacto premium.","images":"[\"/vehicles/peugeot-308-gt/1.jpg\",\"/vehicles/peugeot-308-gt/2.jpg\",\"/vehicles/peugeot-308-gt/3.jpg\",\"/vehicles/peugeot-308-gt/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkaxjkhenovrnf","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllkqyakk3icgly","slug":"peugeot-508-peugeot-sport","marca":"Peugeot","modelo":"508 PSE","año":2024,"precio":62000,"motor":"1.6L Turbo Híbrido Enchufable AWD","potencia":360,"torque":520,"transmision":"Automática 8 velocidades","combustible":"Híbrido","traccion":"AWD","velocidadMaxima":250,"aceleracion0a100":5.2,"categoria":"Sedán","descripcion":"El Peugeot 508 Peugeot Sport Engineered es el modelo más potente de la historia de Peugeot. Con 360 CV combinados de su sistema híbrido enchufable AWD, fusiona la elegancia de una berlina deportiva con la eficiencia eléctrica.","images":"[\"/vehicles/peugeot-508-peugeot-sport/1.jpg\",\"/vehicles/peugeot-508-peugeot-sport/2.jpg\",\"/vehicles/peugeot-508-peugeot-sport/3.jpg\",\"/vehicles/peugeot-508-peugeot-sport/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkaxjkhenovrnf","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll5rifwkf0zg3w","slug":"renault-megane-rs","marca":"Renault","modelo":"Mégane R.S. Ultime","año":2024,"precio":42000,"motor":"1.8L Turbo Inline-4","potencia":300,"torque":420,"transmision":"Manual 6 velocidades","combustible":"Gasolina","traccion":"FWD","velocidadMaxima":260,"aceleracion0a100":5.4,"categoria":"Hatchback","descripcion":"El Renault Mégane R.S. Ultime despide al hot hatch francés con 300 CV y tracción 4Control de cuatro ruedas directrices. Un compacto deportivo nacido en el circuito de Nürburgring, con un carácter vivo y comunicativo.","images":"[\"/vehicles/renault-megane-rs/1.jpg\",\"/vehicles/renault-megane-rs/2.jpg\",\"/vehicles/renault-megane-rs/3.jpg\",\"/vehicles/renault-megane-rs/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlksmvzi1q02ri7","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlldwsb5m0t1ycl","slug":"renault-arkana","marca":"Renault","modelo":"Arkana","año":2024,"precio":28000,"motor":"1.3L Turbo Mild Hybrid","potencia":158,"torque":270,"transmision":"Automática 7 velocidades","combustible":"Gasolina","traccion":"FWD","velocidadMaxima":195,"aceleracion0a100":9.5,"categoria":"SUV","descripcion":"El Renault Arkana es un SUV coupé que combina la elegancia de un coupé con la robustez de un SUV. Con 158 CV de su motor turbo híbrido ligero, ofrece un diseño diferenciado y una eficiencia optimizada para el uso diario.","images":"[\"/vehicles/renault-arkana/1.jpg\",\"/vehicles/renault-arkana/2.jpg\",\"/vehicles/renault-arkana/3.jpg\",\"/vehicles/renault-arkana/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlksmvzi1q02ri7","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllurbuctlj806u","slug":"suzuki-jimny","marca":"Suzuki","modelo":"Jimny","año":2024,"precio":25000,"motor":"1.5L Atmosférico Inline-4 (K15B)","potencia":102,"torque":130,"transmision":"Manual 5 velocidades","combustible":"Gasolina","traccion":"4WD","velocidadMaxima":145,"aceleracion0a100":12,"categoria":"SUV","descripcion":"El Suzuki Jimny es un todoterreno compacto con alma de legend. Con tracción 4x4 con reductora, chasis de largueros y travesaños y un diseño cuadrado icónico, conquista los terrenos más difíciles con un tamaño mínimo.","images":"[\"/vehicles/suzuki-jimny/1.jpg\",\"/vehicles/suzuki-jimny/2.jpg\",\"/vehicles/suzuki-jimny/3.jpg\",\"/vehicles/suzuki-jimny/4.png\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkn2zj2yb780wy","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll5ialt221d6tr","slug":"suzuki-swift-sport","marca":"Suzuki","modelo":"Swift Sport","año":2024,"precio":22000,"motor":"1.4L Turbo Mild Hybrid (K14D)","potencia":129,"torque":235,"transmision":"Manual 6 velocidades","combustible":"Gasolina","traccion":"FWD","velocidadMaxima":210,"aceleracion0a100":8.1,"categoria":"Hatchback","descripcion":"El Suzuki Swift Sport es la alegría de conducir en estado puro. Con solo 970 kg y 129 CV turbo, su relación peso-potencia y su chasis afilado ofrecen una diversión táctil que pocos hot hatch modernos pueden igualar.","images":"[\"/vehicles/suzuki-swift-sport/1.jpg\",\"/vehicles/suzuki-swift-sport/2.jpg\",\"/vehicles/suzuki-swift-sport/3.jpg\",\"/vehicles/suzuki-swift-sport/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlkn2zj2yb780wy","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllvwf9ei0412xi","slug":"mazda-mx5-miata","marca":"Mazda","modelo":"MX-5 Miata","año":2024,"precio":30000,"motor":"2.0L Skyactiv-G Atmosférico","potencia":181,"torque":205,"transmision":"Manual 6 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":219,"aceleracion0a100":6.5,"categoria":"Convertible","descripcion":"El Mazda MX-5 Miata es el roadster más vendido de la historia y la encarnación moderna del jin-itei, la idea de que coche y conductor son uno. Ligero, con motor central-delantero y tracción trasera, es la pureza hecha automóvil.","images":"[\"/vehicles/mazda-mx5-miata/1.jpg\",\"/vehicles/mazda-mx5-miata/2.png\",\"/vehicles/mazda-mx5-miata/3.png\",\"/vehicles/mazda-mx5-miata/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk9x4whr7tewjw","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllhu7g1xgr1r8n","slug":"mazda-cx5","marca":"Mazda","modelo":"CX-5 2.5 Turbo","año":2024,"precio":38000,"motor":"2.5L Turbo Skyactiv-G","potencia":256,"torque":433,"transmision":"Automática 6 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":220,"aceleracion0a100":6.1,"categoria":"SUV","descripcion":"El Mazda CX-5 2.5 Turbo combina el diseño Kodo elegante con 256 CV turbo. Su enfoque en el refinamiento, la calidad interior premium y la dinámica de conducción Jinba-Ittai lo posicionan como el SUV más deportivo de su segmento.","images":"[\"/vehicles/mazda-cx5/1.jpg\",\"/vehicles/mazda-cx5/2.jpg\",\"/vehicles/mazda-cx5/3.jpg\",\"/vehicles/mazda-cx5/4.jpg\"]","stock":4,"available":1,"featured":0,"brandId":"cmt0qdqlk9x4whr7tewjw","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllqwajcayagtcw","slug":"hyundai-i30n","marca":"Hyundai","modelo":"i30 N","año":2024,"precio":35000,"motor":"2.0L Turbo Inline-4","potencia":280,"torque":392,"transmision":"Manual 6 velocidades","combustible":"Gasolina","traccion":"FWD","velocidadMaxima":250,"aceleracion0a100":5.9,"categoria":"Hatchback","descripcion":"El Hyundai i30 N es el hot hatch nacido en el Nürburgring. Con 280 CV, diferencial de deslizamiento limitado electrônico y la filosofía N de Hyundai, ofrece prestaciones de pista con la practicidad de un compacto de cinco plazas.","images":"[\"/vehicles/hyundai-i30n/1.jpg\",\"/vehicles/hyundai-i30n/2.jpg\",\"/vehicles/hyundai-i30n/3.jpg\",\"/vehicles/hyundai-i30n/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlkhzb2n6lg4dri","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll7rt57e0o531l","slug":"hyundai-ioniq5n","marca":"Hyundai","modelo":"Ioniq 5 N","año":2024,"precio":66000,"motor":"Dual-Motor Eléctrico AWD","potencia":641,"torque":770,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":260,"aceleracion0a100":3.4,"categoria":"SUV","descripcion":"El Hyundai Ioniq 5 N es el primer SUV eléctrico de rendimiento N. Con 641 CV, simulación de cambios de marcha y un sonido sintético de motor, lleva la emoción de los deportivos a la era eléctrica con personalidad propia.","images":"[\"/vehicles/hyundai-ioniq5n/1.jpg\",\"/vehicles/hyundai-ioniq5n/2.jpg\",\"/vehicles/hyundai-ioniq5n/3.jpg\",\"/vehicles/hyundai-ioniq5n/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkhzb2n6lg4dri","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqll7cbu09ra8cd3","slug":"kia-stinger-gt","marca":"Kia","modelo":"Stinger GT","año":2023,"precio":50000,"motor":"3.3L Twin-Turbo V6 (Lambda)","potencia":365,"torque":510,"transmision":"Automática 8 velocidades","combustible":"Gasolina","traccion":"RWD","velocidadMaxima":270,"aceleracion0a100":4.7,"categoria":"Sedán","descripcion":"El Kia Stinger GT es la berlina deportiva que cambió la percepción de Kia. Con un V6 biturbo de 365 CV y tracción trasera, rinde homenaje a los gran turismo clásicos con un diseño agresivo y prestaciones de verdadero deportivo.","images":"[\"/vehicles/kia-stinger-gt/1.png\",\"/vehicles/kia-stinger-gt/2.jpg\",\"/vehicles/kia-stinger-gt/3.jpg\",\"/vehicles/kia-stinger-gt/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlkidfewrqzqr1o","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllnsmy3n553mt9","slug":"kia-ev6-gt","marca":"Kia","modelo":"EV6 GT","año":2024,"precio":61000,"motor":"Dual-Motor Eléctrico AWD","potencia":576,"torque":740,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":260,"aceleracion0a100":3.5,"categoria":"SUV","descripcion":"El Kia EV6 GT es el crossover eléctrico más potente de Kia. Con 576 CV y aceleración de 0 a 100 en 3.5 segundos, combina la versatilidad de un crossover con prestaciones de superdeportivo en un diseño futurista.","images":"[\"/vehicles/kia-ev6-gt/1.jpg\",\"/vehicles/kia-ev6-gt/2.jpg\",\"/vehicles/kia-ev6-gt/3.jpg\",\"/vehicles/kia-ev6-gt/4.jpg\"]","stock":2,"available":1,"featured":1,"brandId":"cmt0qdqlkidfewrqzqr1o","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllbi3whmy2mxan","slug":"volkswagen-golf-r","marca":"Volkswagen","modelo":"Golf R","año":2024,"precio":46000,"motor":"2.0L Turbo Inline-4 (EA888)","potencia":329,"torque":420,"transmision":"DSG 7 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":270,"aceleracion0a100":4.6,"categoria":"Hatchback","descripcion":"El Volkswagen Golf R es el compacto deportivo definitivo. Con 329 CV y tracción integral 4Motion con vectorización de par, ofrece prestaciones de deportivo con la discreción y practicidad que han hecho legendario al Golf.","images":"[\"/vehicles/volkswagen-golf-r/1.jpg\",\"/vehicles/volkswagen-golf-r/2.jpg\",\"/vehicles/volkswagen-golf-r/3.jpg\",\"/vehicles/volkswagen-golf-r/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkwnbrhsepvy9k","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllbtllfwjehkqs","slug":"volkswagen-id4","marca":"Volkswagen","modelo":"ID.4","año":2024,"precio":41000,"motor":"Dual-Motor Eléctrico AWD","potencia":295,"torque":0,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":180,"aceleracion0a100":5.4,"categoria":"SUV","descripcion":"El Volkswagen ID.4 es el SUV eléctrico familiar por excelencia. Con 295 CV en versión dual-motor y un interior espacioso y luminoso, democratiza la electromovilidad con el pragmatismo alemán característico de Volkswagen.","images":"[\"/vehicles/volkswagen-id4/1.jpg\",\"/vehicles/volkswagen-id4/2.jpg\",\"/vehicles/volkswagen-id4/3.jpg\",\"/vehicles/volkswagen-id4/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkwnbrhsepvy9k","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqlllq26wejrwp3z","slug":"volkswagen-touareg","marca":"Volkswagen","modelo":"Touareg R","año":2024,"precio":85000,"motor":"3.0L Turbo V6 Híbrido Enchufable","potencia":462,"torque":700,"transmision":"Tiptronic 8 velocidades","combustible":"Híbrido","traccion":"AWD","velocidadMaxima":250,"aceleracion0a100":5.1,"categoria":"SUV","descripcion":"El Volkswagen Touareg R es el SUV más potente de VW. Con 462 CV de su sistema híbrido enchufable y suspensión neumática adaptativa, combina la capacidad todoterreno con el rendimiento deportivo y el confort de larga distancia.","images":"[\"/vehicles/volkswagen-touareg/1.jpg\",\"/vehicles/volkswagen-touareg/2.jpg\",\"/vehicles/volkswagen-touareg/3.jpg\",\"/vehicles/volkswagen-touareg/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkwnbrhsepvy9k","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllp9wzeg4z1bfo","slug":"mercedes-amg-gle63","marca":"Mercedes-Benz","modelo":"AMG GLE 63 S","año":2024,"precio":130000,"motor":"4.0L Twin-Turbo V8 Mild Hybrid","potencia":603,"torque":850,"transmision":"AMG SPEEDSHIFT 9 velocidades","combustible":"Gasolina","traccion":"AWD","velocidadMaxima":280,"aceleracion0a100":3.7,"categoria":"SUV","descripcion":"El Mercedes-AMG GLE 63 S es el SUV deportivo más extremo de Mercedes. Su V8 biturbo de 603 CV con sistema híbrido EQ Boost y suspensión activa AMG Ride Control+ lo convierten en un SUV con alma de superdeportivo.","images":"[\"/vehicles/mercedes-amg-gle63/1.jpg\",\"/vehicles/mercedes-amg-gle63/2.jpg\",\"/vehicles/mercedes-amg-gle63/3.jpg\",\"/vehicles/mercedes-amg-gle63/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkz2mckudlsfeu","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllrssued63yov3","slug":"bmw-i7","marca":"BMW","modelo":"i7 xDrive60","año":2024,"precio":120000,"motor":"Dual-Motor Eléctrico AWD","potencia":536,"torque":745,"transmision":"Automática 1 velocidad","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":240,"aceleracion0a100":4.5,"categoria":"Sedán","descripcion":"El BMW i7 xDrive60 es la berlina de lujo eléctrica definitiva. Con 536 CV, autonomía de hasta 615 km y un interior con pantallas Theater Screen y cristales electrocrómicos, redefine el lujo silencioso del siglo XXI.","images":"[\"/vehicles/bmw-i7/1.jpg\",\"/vehicles/bmw-i7/2.jpg\",\"/vehicles/bmw-i7/3.jpg\",\"/vehicles/bmw-i7/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlk4wbheylbbebo","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"},{"id":"cmt0qdqllz2m4k2vxl4ee","slug":"audi-etron-gt","marca":"Audi","modelo":"e-tron GT RS","año":2024,"precio":147000,"motor":"Dual-Motor Eléctrico AWD","potencia":637,"torque":830,"transmision":"Automática 2 velocidades","combustible":"Eléctrico","traccion":"AWD","velocidadMaxima":250,"aceleracion0a100":3.1,"categoria":"Sedán","descripcion":"El Audi e-tron GT RS es el gran turismo eléctrico de Audi. Con 637 CV y tracción integral quattro, comparte plataforma con el Porsche Taycan. Un deportivo eléctrico de cuatro plazas con la elegancia característica de Audi.","images":"[\"/vehicles/audi-etron-gt/1.jpg\",\"/vehicles/audi-etron-gt/2.jpg\",\"/vehicles/audi-etron-gt/3.jpg\",\"/vehicles/audi-etron-gt/4.jpg\"]","stock":2,"available":1,"featured":0,"brandId":"cmt0qdqlkbpfs38h542xy","createdAt":"2026-08-19T23:36:48.873Z","updatedAt":"2026-08-19T23:36:48.873Z"}],"brands":[{"id":"cmt0qdqlkdlik7f4ehm14","name":"Aston Martin","slug":"aston-martin","description":"Elegancia y potencia británicas con más de un siglo de historia.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkbpfs38h542xy","name":"Audi","slug":"audi","description":"Tecnología de vanguardia y diseño progresista alemán.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlk4wbheylbbebo","name":"BMW","slug":"bmw","description":"Pura alegría de conducir con precisión bávara.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlknqx5flfs1z7i","name":"BYD","slug":"byd","description":"Electromovilidad china líder mundial con batería Blade.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkfzc5cslqlyrr","name":"Bentley","slug":"bentley","description":"Lujo artesanal británico con alma de gran turismo.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlk9n5d63w5hkye","name":"Chevrolet","slug":"chevrolet","description":"El corazón performance de América desde 1911.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlk2vcbw7ewdqp3","name":"Dodge","slug":"dodge","description":"Muscle car americano en su forma más brutal.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkqsznwvc5w2wm","name":"Ferrari","slug":"ferrari","description":"La pasión y el rendimiento de Maranello llevados a la perfección.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkyjnnmix224t8","name":"Ford","slug":"ford","description":"Herencia americana y muscle car desde 1903.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlk2i6be90u5vuv","name":"Honda","slug":"honda","description":"Ingeniería eficiente con alma deportiva japonesa.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkhzb2n6lg4dri","name":"Hyundai","slug":"hyundai","description":"Performance N y tecnología eléctrica de vanguardia.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlke70nz1ick2na","name":"Jeep","slug":"jeep","description":"Capacidad todoterreno legendaria desde 1941.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkidfewrqzqr1o","name":"Kia","slug":"kia","description":"Diseño audaz y electromovilidad accesible.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlke6dbw3o7o8lv","name":"Lamborghini","slug":"lamborghini","description":"Diseño extremo y potencia salvaje desde Sant'Agata Bolognese.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkwkj4rc1awmot","name":"Lexus","slug":"lexus","description":"Refinamiento japonés y fiabilidad híbrida premium.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlk9x4whr7tewjw","name":"Mazda","slug":"mazda","description":"Diseño Kodo y la filosofía Jinba-Ittai.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkyxt9qyslui2e","name":"McLaren","slug":"mclaren","description":"Tecnología de F1 aplicada a superdeportivos de carretera.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkz2mckudlsfeu","name":"Mercedes-Benz","slug":"mercedes-benz","description":"Lujo, innovación y herencia automovilística desde 1886.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkfuipsqjw3svk","name":"Nissan","slug":"nissan","description":"Innovación japonesa y el ADN de Godzilla.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkaxjkhenovrnf","name":"Peugeot","slug":"peugeot","description":"Diseño francés elegante y ingeniería deportiva.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkwsd586vu8qfg","name":"Porsche","slug":"porsche","description":"Ingeniería deportiva alemana sin concesiones desde 1948.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlksmvzi1q02ri7","name":"Renault","slug":"renault","description":"Innovación francesa con espíritu de competición.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkuudko79sxog5","name":"Rivian","slug":"rivian","description":"Aventura eléctrica con vehículos todoterreno de nueva generación.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkaa3a2jcdsz2q","name":"Rolls-Royce","slug":"rolls-royce","description":"La cúspide absoluta del lujo automovilístico mundial.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlke3pybsq9rvrr","name":"Subaru","slug":"subaru","description":"Bóxer y tracción simétrica, nacido para la aventura.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkn2zj2yb780wy","name":"Suzuki","slug":"suzuki","description":"Compactos ágiles y todoterreno sin concesiones.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkm3aob2qa9lkw","name":"Tesla","slug":"tesla","description":"La revolución eléctrica que transformó la industria.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlk5nxyapyhogsc","name":"Toyota","slug":"toyota","description":"Fiabilidad legendaria y espíritu Gazoo Racing.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlkwnbrhsepvy9k","name":"Volkswagen","slug":"volkswagen","description":"Pragmatismo alemán para el conductor cotidiano.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"},{"id":"cmt0qdqlk3s2vxcj1kn78","name":"Volvo","slug":"volvo","description":"Seguridad escandinava y diseño minimalista atemporal.","createdAt":"2026-08-19T23:36:48.872Z","updatedAt":"2026-08-19T23:36:48.872Z"}],"favorites":[{"id":"cmt0qdqvunt7r9d8rjkmb","userId":"cmt0qdqmzovvqncm0614r","vehicleId":"cmt0qdqll4e9z71123ltw","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvukcajcp75mawp","userId":"cmt0qdqmzovvqncm0614r","vehicleId":"cmt0qdqllavm2uu5yn02u","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvu6ka9t6cgft0z","userId":"cmt0qdqmzovvqncm0614r","vehicleId":"cmt0qdqlllrqxgad1m0rx","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvudv4c84ohziyx","userId":"cmt0qdqobo9w28eeifukb","vehicleId":"cmt0qdqlle71g9qkopgya","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuh5fticq9w41p","userId":"cmt0qdqobo9w28eeifukb","vehicleId":"cmt0qdqlljd1h1vnvh7y4","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuj413c0w3z8i9","userId":"cmt0qdqpdlbu8mrr68cuc","vehicleId":"cmt0qdqllyk4z5pkno0q5","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvut6m1ulmkli45","userId":"cmt0qdqpdlbu8mrr68cuc","vehicleId":"cmt0qdqllavm2uu5yn02u","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvulefuqiiacxe7","userId":"cmt0qdqpdlbu8mrr68cuc","vehicleId":"cmt0qdqlluknkb5rhntsh","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvu8y08vtamhr5g","userId":"cmt0qdqpdlbu8mrr68cuc","vehicleId":"cmt0qdqlli3v096iy3swt","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuljtc77hdtzok","userId":"cmt0qdqqgvm14jvgz51db","vehicleId":"cmt0qdqll3x9prywr65hj","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvu9a0fn8jfwj3f","userId":"cmt0qdqqgvm14jvgz51db","vehicleId":"cmt0qdqll30ygttzphb9y","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuylc90immreg3","userId":"cmt0qdqqgvm14jvgz51db","vehicleId":"cmt0qdqllvwf9ei0412xi","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuyjpk495kx6wp","userId":"cmt0qdqrih3pmy6rg8fvc","vehicleId":"cmt0qdqllimr6qjf233m1","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvupcy2m5wxoq7u","userId":"cmt0qdqrih3pmy6rg8fvc","vehicleId":"cmt0qdqllxpxik5ozkmd7","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuxxd0okf2eg0e","userId":"cmt0qdqrih3pmy6rg8fvc","vehicleId":"cmt0qdqll5ialt221d6tr","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuei5q1jesfde3","userId":"cmt0qdqrih3pmy6rg8fvc","vehicleId":"cmt0qdqll30ygttzphb9y","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvumkrarjy7fzvc","userId":"cmt0qdqske77ggzu9wq0y","vehicleId":"cmt0qdqlltgpaw8fcok6r","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuzl3x2ftsl626","userId":"cmt0qdqske77ggzu9wq0y","vehicleId":"cmt0qdqll13opfvuh1jcl","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuesc7jcechztl","userId":"cmt0qdqske77ggzu9wq0y","vehicleId":"cmt0qdqllxakzj4qyar10","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuifbeb09m054l","userId":"cmt0qdqske77ggzu9wq0y","vehicleId":"cmt0qdqllyjv1m9ngu02u","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvurs1lul0kir06","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":"cmt0qdqlltjkv7j7szyv8","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvu09m7iapdxi1b","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":"cmt0qdqlltgpaw8fcok6r","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvugqxr90nbl8bd","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":"cmt0qdqllgcesd7m8pb99","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvu98ktnxbrlesa","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":"cmt0qdqllx6gfwasn3pn2","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvujcvdp7283jw5","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":"cmt0qdqlllq26wejrwp3z","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvudea77261t2p2","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":"cmt0qdqlllrqxgad1m0rx","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvunb0z9qurnk4y","userId":"cmt0qdqun62x53cm42li2","vehicleId":"cmt0qdqllsv7zb45zam8a","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvuqdlm03ko3t5l","userId":"cmt0qdqun62x53cm42li2","vehicleId":"cmt0qdqlltjkv7j7szyv8","createdAt":"2026-08-19T23:36:49.242Z"},{"id":"cmt0qdqvu8sf4ue061i8s","userId":"cmt0qdqun62x53cm42li2","vehicleId":"cmt0qdqllyk4z5pkno0q5","createdAt":"2026-08-19T23:36:49.242Z"}],"orders":[{"id":"cmt0qdqvsagwyfrp7vb6b","number":"LXC-2025-00001","userId":"cmt0qdqpdlbu8mrr68cuc","status":"CANCELLED","total":155000,"createdAt":"2025-10-14T00:00:00.000Z","updatedAt":"2025-10-14T00:00:00.000Z"},{"id":"cmt0qdqvscekwfrba8g9m","number":"LXC-2025-00002","userId":"cmt0qdqrih3pmy6rg8fvc","status":"CANCELLED","total":147500,"createdAt":"2025-09-11T00:00:00.000Z","updatedAt":"2025-09-11T00:00:00.000Z"},{"id":"cmt0qdqvsf1gadfe50eij","number":"LXC-2025-00003","userId":"cmt0qdqtllmxi79ser5nr","status":"COMPLETED","total":55950,"createdAt":"2025-11-12T00:00:00.000Z","updatedAt":"2025-11-12T00:00:00.000Z"},{"id":"cmt0qdqvswwb6ljnewf6a","number":"LXC-2026-00004","userId":"cmt0qdqqgvm14jvgz51db","status":"CANCELLED","total":291895,"createdAt":"2026-01-01T00:00:00.000Z","updatedAt":"2026-01-01T00:00:00.000Z"},{"id":"cmt0qdqvshqycsvlp3dsl","number":"LXC-2025-00005","userId":"cmt0qdqqgvm14jvgz51db","status":"PROCESSING","total":46000,"createdAt":"2025-03-19T00:00:00.000Z","updatedAt":"2025-03-19T00:00:00.000Z"},{"id":"cmt0qdqvsdly5zg59a7s6","number":"LXC-2026-00006","userId":"cmt0qdqmzovvqncm0614r","status":"PROCESSING","total":35000,"createdAt":"2026-07-06T00:00:00.000Z","updatedAt":"2026-07-06T00:00:00.000Z"},{"id":"cmt0qdqvs9m9vz26bebwf","number":"LXC-2026-00007","userId":"cmt0qdqqgvm14jvgz51db","status":"COMPLETED","total":72175,"createdAt":"2026-03-21T00:00:00.000Z","updatedAt":"2026-03-21T00:00:00.000Z"},{"id":"cmt0qdqvsul05qaoocpml","number":"LXC-2026-00008","userId":"cmt0qdqtllmxi79ser5nr","status":"PROCESSING","total":55950,"createdAt":"2026-04-16T00:00:00.000Z","updatedAt":"2026-04-16T00:00:00.000Z"},{"id":"cmt0qdqvstbd1qt266a5i","number":"LXC-2026-00009","userId":"cmt0qdqmzovvqncm0614r","status":"CANCELLED","total":46000,"createdAt":"2026-08-10T00:00:00.000Z","updatedAt":"2026-08-10T00:00:00.000Z"},{"id":"cmt0qdqvs04dz87a303m5","number":"LXC-2026-00010","userId":"cmt0qdqqgvm14jvgz51db","status":"COMPLETED","total":136000,"createdAt":"2026-01-12T00:00:00.000Z","updatedAt":"2026-01-12T00:00:00.000Z"},{"id":"cmt0qdqvsqot8j68txq8j","number":"LXC-2026-00011","userId":"cmt0qdqobo9w28eeifukb","status":"PROCESSING","total":55950,"createdAt":"2026-01-20T00:00:00.000Z","updatedAt":"2026-01-20T00:00:00.000Z"},{"id":"cmt0qdqvs61dz8o87u0hn","number":"LXC-2025-00012","userId":"cmt0qdqmzovvqncm0614r","status":"COMPLETED","total":71900,"createdAt":"2025-10-25T00:00:00.000Z","updatedAt":"2025-10-25T00:00:00.000Z"},{"id":"cmt0qdqvst4db2ox3m1xp","number":"LXC-2024-00013","userId":"cmt0qdqpdlbu8mrr68cuc","status":"COMPLETED","total":233000,"createdAt":"2024-11-27T00:00:00.000Z","updatedAt":"2024-11-27T00:00:00.000Z"},{"id":"cmt0qdqvssskgr6t2hga4","number":"LXC-2025-00014","userId":"cmt0qdqske77ggzu9wq0y","status":"COMPLETED","total":145145,"createdAt":"2025-06-22T00:00:00.000Z","updatedAt":"2025-06-22T00:00:00.000Z"},{"id":"cmt0qdqvsjp1pw6wewo6k","number":"LXC-2025-00015","userId":"cmt0qdqtllmxi79ser5nr","status":"CANCELLED","total":73000,"createdAt":"2025-04-24T00:00:00.000Z","updatedAt":"2025-04-24T00:00:00.000Z"},{"id":"cmt0qdqvsti3ex2kzlyz2","number":"LXC-2026-00016","userId":"cmt0qdqqgvm14jvgz51db","status":"COMPLETED","total":35000,"createdAt":"2026-07-17T00:00:00.000Z","updatedAt":"2026-07-17T00:00:00.000Z"},{"id":"cmt0qdqvst06j7gf5tzu3","number":"LXC-2026-00017","userId":"cmt0qdqtllmxi79ser5nr","status":"PROCESSING","total":85000,"createdAt":"2026-02-22T00:00:00.000Z","updatedAt":"2026-02-22T00:00:00.000Z"},{"id":"cmt0qdqvs0i5gagce0sw9","number":"LXC-2024-00018","userId":"cmt0qdqun62x53cm42li2","status":"COMPLETED","total":192900,"createdAt":"2024-10-02T00:00:00.000Z","updatedAt":"2024-10-02T00:00:00.000Z"},{"id":"cmt0qdqvsjzyqmrxgslfl","number":"LXC-2024-00019","userId":"cmt0qdqun62x53cm42li2","status":"CANCELLED","total":356666,"createdAt":"2024-10-25T00:00:00.000Z","updatedAt":"2024-10-25T00:00:00.000Z"},{"id":"cmt0qdqvs604t9yyfl19o","number":"LXC-2025-00020","userId":"cmt0qdqobo9w28eeifukb","status":"COMPLETED","total":192900,"createdAt":"2025-05-04T00:00:00.000Z","updatedAt":"2025-05-04T00:00:00.000Z"},{"id":"cmt0qdqvsll8nm1qpji6r","number":"LXC-2026-00021","userId":"cmt0qdqqgvm14jvgz51db","status":"COMPLETED","total":28000,"createdAt":"2026-07-17T00:00:00.000Z","updatedAt":"2026-07-17T00:00:00.000Z"},{"id":"cmt0qdqvsk3eav08v1v8j","number":"LXC-2026-00022","userId":"cmt0qdqtllmxi79ser5nr","status":"COMPLETED","total":245000,"createdAt":"2026-02-01T00:00:00.000Z","updatedAt":"2026-02-01T00:00:00.000Z"},{"id":"cmt0qdqvsi01ubm9qarll","number":"LXC-2026-00023","userId":"cmt0qdqrih3pmy6rg8fvc","status":"COMPLETED","total":25000,"createdAt":"2026-03-23T00:00:00.000Z","updatedAt":"2026-03-23T00:00:00.000Z"},{"id":"cmt0qdqvs3973nn96d9mn","number":"LXC-2025-00024","userId":"cmt0qdqqgvm14jvgz51db","status":"COMPLETED","total":108000,"createdAt":"2025-04-11T00:00:00.000Z","updatedAt":"2025-04-11T00:00:00.000Z"},{"id":"cmt0qdqvs44tcn9l2o050","number":"LXC-2024-00025","userId":"cmt0qdqobo9w28eeifukb","status":"CANCELLED","total":79100,"createdAt":"2024-10-26T00:00:00.000Z","updatedAt":"2024-10-26T00:00:00.000Z"},{"id":"cmt0qdqvt7ihorfn9dv3t","number":"LXC-2025-00026","userId":"cmt0qdqmzovvqncm0614r","status":"COMPLETED","total":31895,"createdAt":"2025-10-14T00:00:00.000Z","updatedAt":"2025-10-14T00:00:00.000Z"},{"id":"cmt0qdqvtcb95i66t44ij","number":"LXC-2026-00027","userId":"cmt0qdqobo9w28eeifukb","status":"PENDING","total":156535,"createdAt":"2026-07-16T00:00:00.000Z","updatedAt":"2026-07-16T00:00:00.000Z"},{"id":"cmt0qdqvts4agr9kf4mt7","number":"LXC-2025-00028","userId":"cmt0qdqun62x53cm42li2","status":"CANCELLED","total":475000,"createdAt":"2025-02-17T00:00:00.000Z","updatedAt":"2025-02-17T00:00:00.000Z"},{"id":"cmt0qdqvti594xo1887c4","number":"LXC-2026-00029","userId":"cmt0qdqske77ggzu9wq0y","status":"COMPLETED","total":287000,"createdAt":"2026-06-03T00:00:00.000Z","updatedAt":"2026-06-03T00:00:00.000Z"},{"id":"cmt0qdqvtoqwcolx2ru0l","number":"LXC-2026-00030","userId":"cmt0qdqun62x53cm42li2","status":"PENDING","total":191000,"createdAt":"2026-06-20T00:00:00.000Z","updatedAt":"2026-06-20T00:00:00.000Z"},{"id":"cmt0qdqvtsdyzpmkl6amu","number":"LXC-2025-00031","userId":"cmt0qdqske77ggzu9wq0y","status":"PENDING","total":109145,"createdAt":"2025-04-03T00:00:00.000Z","updatedAt":"2025-04-03T00:00:00.000Z"},{"id":"cmt0qdqvt4cm0blevw9zt","number":"LXC-2026-00032","userId":"cmt0qdqtllmxi79ser5nr","status":"COMPLETED","total":125700,"createdAt":"2026-02-05T00:00:00.000Z","updatedAt":"2026-02-05T00:00:00.000Z"},{"id":"cmt0qdqvtzc1gbvcrfoa2","number":"LXC-2026-00033","userId":"cmt0qdqqgvm14jvgz51db","status":"COMPLETED","total":35500,"createdAt":"2026-05-12T00:00:00.000Z","updatedAt":"2026-05-12T00:00:00.000Z"},{"id":"cmt0qdqvtad1sk9p6pwog","number":"LXC-2025-00034","userId":"cmt0qdqqgvm14jvgz51db","status":"PROCESSING","total":388986,"createdAt":"2025-10-18T00:00:00.000Z","updatedAt":"2025-10-18T00:00:00.000Z"},{"id":"cmt0qdqvtntkrxan7vwu6","number":"LXC-2026-00035","userId":"cmt0qdqrih3pmy6rg8fvc","status":"COMPLETED","total":151145,"createdAt":"2026-01-16T00:00:00.000Z","updatedAt":"2026-01-16T00:00:00.000Z"},{"id":"cmt0qdqvtec2onyd355hc","number":"LXC-2024-00036","userId":"cmt0qdqtllmxi79ser5nr","status":"COMPLETED","total":122300,"createdAt":"2024-12-05T00:00:00.000Z","updatedAt":"2024-12-05T00:00:00.000Z"},{"id":"cmt0qdqvtcgloi5z6jpta","number":"LXC-2025-00037","userId":"cmt0qdqun62x53cm42li2","status":"COMPLETED","total":42000,"createdAt":"2025-07-05T00:00:00.000Z","updatedAt":"2025-07-05T00:00:00.000Z"},{"id":"cmt0qdqvtnwa7vzgeug0b","number":"LXC-2024-00038","userId":"cmt0qdqrih3pmy6rg8fvc","status":"CANCELLED","total":46000,"createdAt":"2024-10-03T00:00:00.000Z","updatedAt":"2024-10-03T00:00:00.000Z"},{"id":"cmt0qdqvt7t8rl95kttry","number":"LXC-2024-00039","userId":"cmt0qdqmzovvqncm0614r","status":"COMPLETED","total":137990,"createdAt":"2024-10-08T00:00:00.000Z","updatedAt":"2024-10-08T00:00:00.000Z"},{"id":"cmt0qdqvtwkygdhntwxd6","number":"LXC-2024-00040","userId":"cmt0qdqtllmxi79ser5nr","status":"COMPLETED","total":66000,"createdAt":"2024-09-12T00:00:00.000Z","updatedAt":"2024-09-12T00:00:00.000Z"},{"id":"cmt0qdqvtpl7sn38pl3ti","number":"LXC-2026-00041","userId":"cmt0qdqtllmxi79ser5nr","status":"COMPLETED","total":730300,"createdAt":"2026-03-12T00:00:00.000Z","updatedAt":"2026-03-12T00:00:00.000Z"},{"id":"cmt0qdqvu593wxneht3g3","number":"LXC-2025-00042","userId":"cmt0qdqpdlbu8mrr68cuc","status":"PROCESSING","total":114400,"createdAt":"2025-03-07T00:00:00.000Z","updatedAt":"2025-03-07T00:00:00.000Z"},{"id":"cmt0qdqvut48pqsn9vxx9","number":"LXC-2026-00043","userId":"cmt0qdqrih3pmy6rg8fvc","status":"COMPLETED","total":55950,"createdAt":"2026-01-01T00:00:00.000Z","updatedAt":"2026-01-01T00:00:00.000Z"},{"id":"cmt0qdqvuqebbrzj9pvij","number":"LXC-2026-00044","userId":"cmt0qdqtllmxi79ser5nr","status":"COMPLETED","total":52990,"createdAt":"2026-02-25T00:00:00.000Z","updatedAt":"2026-02-25T00:00:00.000Z"},{"id":"cmt0qdqvu2u176ck09izi","number":"LXC-2024-00045","userId":"cmt0qdqtllmxi79ser5nr","status":"COMPLETED","total":324000,"createdAt":"2024-09-15T00:00:00.000Z","updatedAt":"2024-09-15T00:00:00.000Z"},{"id":"cmt0qdqvufzt81mq3vxav","number":"LXC-2025-00046","userId":"cmt0qdqmzovvqncm0614r","status":"PROCESSING","total":249290,"createdAt":"2025-09-19T00:00:00.000Z","updatedAt":"2025-09-19T00:00:00.000Z"},{"id":"cmt0qdqvufdjd251cprwr","number":"LXC-2025-00047","userId":"cmt0qdqun62x53cm42li2","status":"PENDING","total":215000,"createdAt":"2025-01-26T00:00:00.000Z","updatedAt":"2025-01-26T00:00:00.000Z"},{"id":"cmt0qdqvur8ma3z79n57d","number":"LXC-2026-00048","userId":"cmt0qdqmzovvqncm0614r","status":"CANCELLED","total":324000,"createdAt":"2026-07-28T00:00:00.000Z","updatedAt":"2026-07-28T00:00:00.000Z"},{"id":"cmt0qdqvuayfnn0ekbz0s","number":"LXC-2024-00049","userId":"cmt0qdqobo9w28eeifukb","status":"COMPLETED","total":196300,"createdAt":"2024-09-20T00:00:00.000Z","updatedAt":"2024-09-20T00:00:00.000Z"},{"id":"cmt0qdqvuyubbv9aj3um1","number":"LXC-2026-00050","userId":"cmt0qdqpdlbu8mrr68cuc","status":"PROCESSING","total":65200,"createdAt":"2026-07-06T00:00:00.000Z","updatedAt":"2026-07-06T00:00:00.000Z"},{"id":"cmt0qdqvufnyx7sajor3i","number":"LXC-2026-00051","userId":"cmt0qdqpdlbu8mrr68cuc","status":"PENDING","total":51530,"createdAt":"2026-04-20T00:00:00.000Z","updatedAt":"2026-04-20T00:00:00.000Z"},{"id":"cmt0qdqvuqeoouguiybrr","number":"LXC-2026-00052","userId":"cmt0qdqobo9w28eeifukb","status":"COMPLETED","total":507300,"createdAt":"2026-04-20T00:00:00.000Z","updatedAt":"2026-04-20T00:00:00.000Z"},{"id":"cmt0qdqvum36s28u9tush","number":"LXC-2025-00053","userId":"cmt0qdqmzovvqncm0614r","status":"COMPLETED","total":28000,"createdAt":"2025-05-03T00:00:00.000Z","updatedAt":"2025-05-03T00:00:00.000Z"},{"id":"cmt0qdqvuk4jjyw4bih57","number":"LXC-2025-00054","userId":"cmt0qdqpdlbu8mrr68cuc","status":"PROCESSING","total":757600,"createdAt":"2025-10-18T00:00:00.000Z","updatedAt":"2025-10-18T00:00:00.000Z"},{"id":"cmt0qdqvu7q1z5pvwcsg7","number":"LXC-2025-00055","userId":"cmt0qdqun62x53cm42li2","status":"PROCESSING","total":38000,"createdAt":"2025-11-21T00:00:00.000Z","updatedAt":"2025-11-21T00:00:00.000Z"},{"id":"cmt0qdqvuri8g15dbzxdm","number":"LXC-2025-00056","userId":"cmt0qdqobo9w28eeifukb","status":"PENDING","total":68000,"createdAt":"2025-02-21T00:00:00.000Z","updatedAt":"2025-02-21T00:00:00.000Z"},{"id":"cmt0qdqvulq8glyan5liv","number":"LXC-2025-00057","userId":"cmt0qdqske77ggzu9wq0y","status":"COMPLETED","total":72000,"createdAt":"2025-12-18T00:00:00.000Z","updatedAt":"2025-12-18T00:00:00.000Z"},{"id":"cmt0qdqvum44wpzkrbyc6","number":"LXC-2025-00058","userId":"cmt0qdqpdlbu8mrr68cuc","status":"PENDING","total":156900,"createdAt":"2025-08-20T00:00:00.000Z","updatedAt":"2025-08-20T00:00:00.000Z"},{"id":"cmt0qdqvusmimlyrfykbp","number":"LXC-2024-00059","userId":"cmt0qdqpdlbu8mrr68cuc","status":"PENDING","total":39120,"createdAt":"2024-10-23T00:00:00.000Z","updatedAt":"2024-10-23T00:00:00.000Z"},{"id":"cmt0qdqvu6uj2gemuhi0h","number":"LXC-2025-00060","userId":"cmt0qdqtllmxi79ser5nr","status":"COMPLETED","total":71700,"createdAt":"2025-09-15T00:00:00.000Z","updatedAt":"2025-09-15T00:00:00.000Z"}],"order_items":[{"id":"cmt0qdqvs4dfiplk6pmyp","orderId":"cmt0qdqvsagwyfrp7vb6b","vehicleId":"cmt0qdqll7rt57e0o531l","priceAtPurchase":66000,"quantity":1},{"id":"cmt0qdqvst5wt5xzkv6xw","orderId":"cmt0qdqvsagwyfrp7vb6b","vehicleId":"cmt0qdqllyk4z5pkno0q5","priceAtPurchase":89000,"quantity":1},{"id":"cmt0qdqvs4z3f8sc9v0y7","orderId":"cmt0qdqvscekwfrba8g9m","vehicleId":"cmt0qdqllavm2uu5yn02u","priceAtPurchase":147500,"quantity":1},{"id":"cmt0qdqvsy0ybgw42neyp","orderId":"cmt0qdqvsf1gadfe50eij","vehicleId":"cmt0qdqlle2has94mup7c","priceAtPurchase":55950,"quantity":1},{"id":"cmt0qdqvsemq6ev3ycsyx","orderId":"cmt0qdqvswwb6ljnewf6a","vehicleId":"cmt0qdqllc77z69w24v9k","priceAtPurchase":31895,"quantity":1},{"id":"cmt0qdqvs2y279hx9gj7e","orderId":"cmt0qdqvswwb6ljnewf6a","vehicleId":"cmt0qdqllx6gfwasn3pn2","priceAtPurchase":260000,"quantity":1},{"id":"cmt0qdqvshaez0x233163","orderId":"cmt0qdqvshqycsvlp3dsl","vehicleId":"cmt0qdqllbi3whmy2mxan","priceAtPurchase":46000,"quantity":1},{"id":"cmt0qdqvs52vf4bn4g1gs","orderId":"cmt0qdqvsdly5zg59a7s6","vehicleId":"cmt0qdqll1mvaymhf8m7y","priceAtPurchase":35000,"quantity":1},{"id":"cmt0qdqvspu3ko46al7ra","orderId":"cmt0qdqvs9m9vz26bebwf","vehicleId":"cmt0qdqlllrqxgad1m0rx","priceAtPurchase":72175,"quantity":1},{"id":"cmt0qdqvsvtt4xrru9yn1","orderId":"cmt0qdqvsul05qaoocpml","vehicleId":"cmt0qdqlle2has94mup7c","priceAtPurchase":55950,"quantity":1},{"id":"cmt0qdqvs462wcpnc1qwr","orderId":"cmt0qdqvstbd1qt266a5i","vehicleId":"cmt0qdqllbi3whmy2mxan","priceAtPurchase":46000,"quantity":1},{"id":"cmt0qdqvsnlog4py6efq1","orderId":"cmt0qdqvs04dz87a303m5","vehicleId":"cmt0qdqllxakzj4qyar10","priceAtPurchase":136000,"quantity":1},{"id":"cmt0qdqvsna5kcirex3ch","orderId":"cmt0qdqvsqot8j68txq8j","vehicleId":"cmt0qdqlle2has94mup7c","priceAtPurchase":55950,"quantity":1},{"id":"cmt0qdqvs6nk04mgaxenq","orderId":"cmt0qdqvs61dz8o87u0hn","vehicleId":"cmt0qdqll1wsttcurr3xp","priceAtPurchase":71900,"quantity":1},{"id":"cmt0qdqvscq593buhqxfn","orderId":"cmt0qdqvst4db2ox3m1xp","vehicleId":"cmt0qdqllj027yfg5nysk","priceAtPurchase":233000,"quantity":1},{"id":"cmt0qdqvs091ajo4lf73m","orderId":"cmt0qdqvssskgr6t2hga4","vehicleId":"cmt0qdqll26s2puu3c73t","priceAtPurchase":36000,"quantity":1},{"id":"cmt0qdqvsy9u3gg2v4lr1","orderId":"cmt0qdqvssskgr6t2hga4","vehicleId":"cmt0qdqll8jb14j6y6zn8","priceAtPurchase":109145,"quantity":1},{"id":"cmt0qdqvs47vswomjtc22","orderId":"cmt0qdqvsjp1pw6wewo6k","vehicleId":"cmt0qdqll0w7lxpf97sv5","priceAtPurchase":73000,"quantity":1},{"id":"cmt0qdqvs1l2svy8q5mzq","orderId":"cmt0qdqvsti3ex2kzlyz2","vehicleId":"cmt0qdqll1mvaymhf8m7y","priceAtPurchase":35000,"quantity":1},{"id":"cmt0qdqvsk1k08gzo9zn4","orderId":"cmt0qdqvst06j7gf5tzu3","vehicleId":"cmt0qdqlllq26wejrwp3z","priceAtPurchase":85000,"quantity":1},{"id":"cmt0qdqvsulle0827arel","orderId":"cmt0qdqvs0i5gagce0sw9","vehicleId":"cmt0qdqllimr6qjf233m1","priceAtPurchase":192900,"quantity":1},{"id":"cmt0qdqvsmdxhtla0704b","orderId":"cmt0qdqvsjzyqmrxgslfl","vehicleId":"cmt0qdqllls5t386sb34c","priceAtPurchase":96666,"quantity":1},{"id":"cmt0qdqvs8nsz37k8nzkn","orderId":"cmt0qdqvsjzyqmrxgslfl","vehicleId":"cmt0qdqllx6gfwasn3pn2","priceAtPurchase":260000,"quantity":1},{"id":"cmt0qdqvsc4ugbyw289mf","orderId":"cmt0qdqvs604t9yyfl19o","vehicleId":"cmt0qdqllimr6qjf233m1","priceAtPurchase":192900,"quantity":1},{"id":"cmt0qdqvssgqknpn34cow","orderId":"cmt0qdqvsll8nm1qpji6r","vehicleId":"cmt0qdqlldwsb5m0t1ycl","priceAtPurchase":28000,"quantity":1},{"id":"cmt0qdqvs109i40nf5hv1","orderId":"cmt0qdqvsk3eav08v1v8j","vehicleId":"cmt0qdqll2nvge2qzxjoe","priceAtPurchase":245000,"quantity":1},{"id":"cmt0qdqvsoaoj0s9r2c5q","orderId":"cmt0qdqvsi01ubm9qarll","vehicleId":"cmt0qdqllurbuctlj806u","priceAtPurchase":25000,"quantity":1},{"id":"cmt0qdqvse4incm55ypru","orderId":"cmt0qdqvs3973nn96d9mn","vehicleId":"cmt0qdqllnsmy3n553mt9","priceAtPurchase":61000,"quantity":1},{"id":"cmt0qdqvsqbwketfmc5xx","orderId":"cmt0qdqvs3973nn96d9mn","vehicleId":"cmt0qdqllg1tyzf0y9yfr","priceAtPurchase":47000,"quantity":1},{"id":"cmt0qdqvs7kzbq561vtse","orderId":"cmt0qdqvs44tcn9l2o050","vehicleId":"cmt0qdqllt6xvmzyvl61x","priceAtPurchase":79100,"quantity":1},{"id":"cmt0qdqvten38ifsygbcp","orderId":"cmt0qdqvt7ihorfn9dv3t","vehicleId":"cmt0qdqllc77z69w24v9k","priceAtPurchase":31895,"quantity":1},{"id":"cmt0qdqvtukjx84dgbq7a","orderId":"cmt0qdqvtcb95i66t44ij","vehicleId":"cmt0qdqllmeiqb1sv08tg","priceAtPurchase":99990,"quantity":1},{"id":"cmt0qdqvt45f7j7cmjm7f","orderId":"cmt0qdqvtcb95i66t44ij","vehicleId":"cmt0qdqllkq8walybay7h","priceAtPurchase":56545,"quantity":1},{"id":"cmt0qdqvtvy874gfwnp9g","orderId":"cmt0qdqvts4agr9kf4mt7","vehicleId":"cmt0qdqlluykmuc07lj5t","priceAtPurchase":215000,"quantity":1},{"id":"cmt0qdqvtjeo37rsmapl6","orderId":"cmt0qdqvts4agr9kf4mt7","vehicleId":"cmt0qdqllx6gfwasn3pn2","priceAtPurchase":260000,"quantity":1},{"id":"cmt0qdqvtugx42royzx6t","orderId":"cmt0qdqvti594xo1887c4","vehicleId":"cmt0qdqll3x9prywr65hj","priceAtPurchase":287000,"quantity":1},{"id":"cmt0qdqvtfsqjcy9axeag","orderId":"cmt0qdqvtoqwcolx2ru0l","vehicleId":"cmt0qdqlltgpaw8fcok6r","priceAtPurchase":191000,"quantity":1},{"id":"cmt0qdqvtijz2odvydz6o","orderId":"cmt0qdqvtsdyzpmkl6amu","vehicleId":"cmt0qdqll8jb14j6y6zn8","priceAtPurchase":109145,"quantity":1},{"id":"cmt0qdqvtjg63jnhafxk9","orderId":"cmt0qdqvt4cm0blevw9zt","vehicleId":"cmt0qdqll7cbu09ra8cd3","priceAtPurchase":50000,"quantity":1},{"id":"cmt0qdqvtea4pn63jo1wq","orderId":"cmt0qdqvt4cm0blevw9zt","vehicleId":"cmt0qdqllguini4zfkpva","priceAtPurchase":75700,"quantity":1},{"id":"cmt0qdqvt9fpmqg8ir1ta","orderId":"cmt0qdqvtzc1gbvcrfoa2","vehicleId":"cmt0qdqllmswqrol0tf10","priceAtPurchase":35500,"quantity":1},{"id":"cmt0qdqvtzfawydpji4an","orderId":"cmt0qdqvtad1sk9p6pwog","vehicleId":"cmt0qdqll7rt57e0o531l","priceAtPurchase":66000,"quantity":1},{"id":"cmt0qdqvtred0c5ltjuu5","orderId":"cmt0qdqvtad1sk9p6pwog","vehicleId":"cmt0qdqll2prytkni1xlc","priceAtPurchase":322986,"quantity":1},{"id":"cmt0qdqvtliu3d3xvmrcr","orderId":"cmt0qdqvtntkrxan7vwu6","vehicleId":"cmt0qdqll5rifwkf0zg3w","priceAtPurchase":42000,"quantity":1},{"id":"cmt0qdqvtximuqn1vzjxd","orderId":"cmt0qdqvtntkrxan7vwu6","vehicleId":"cmt0qdqll8jb14j6y6zn8","priceAtPurchase":109145,"quantity":1},{"id":"cmt0qdqvtqbhoyyagi0ea","orderId":"cmt0qdqvtec2onyd355hc","vehicleId":"cmt0qdqllchb2ia0v2ck9","priceAtPurchase":122300,"quantity":1},{"id":"cmt0qdqvtk2iueiu0l557","orderId":"cmt0qdqvtcgloi5z6jpta","vehicleId":"cmt0qdqll5rifwkf0zg3w","priceAtPurchase":42000,"quantity":1},{"id":"cmt0qdqvtupfu6qlnm03d","orderId":"cmt0qdqvtnwa7vzgeug0b","vehicleId":"cmt0qdqllbi3whmy2mxan","priceAtPurchase":46000,"quantity":1},{"id":"cmt0qdqvtwyqvibjo2sml","orderId":"cmt0qdqvt7t8rl95kttry","vehicleId":"cmt0qdqllmeiqb1sv08tg","priceAtPurchase":99990,"quantity":1},{"id":"cmt0qdqvt57ehpcb0svpi","orderId":"cmt0qdqvt7t8rl95kttry","vehicleId":"cmt0qdqllsv7zb45zam8a","priceAtPurchase":38000,"quantity":1},{"id":"cmt0qdqvtzjyvr71ntxnv","orderId":"cmt0qdqvtwkygdhntwxd6","vehicleId":"cmt0qdqll7rt57e0o531l","priceAtPurchase":66000,"quantity":1},{"id":"cmt0qdqvub5qsixk7t9ch","orderId":"cmt0qdqvtpl7sn38pl3ti","vehicleId":"cmt0qdqllchb2ia0v2ck9","priceAtPurchase":122300,"quantity":1},{"id":"cmt0qdqvu5k5lx1f9d8um","orderId":"cmt0qdqvtpl7sn38pl3ti","vehicleId":"cmt0qdqll5jyptoj9ffl4","priceAtPurchase":608000,"quantity":1},{"id":"cmt0qdqvuah3ncgkeze37","orderId":"cmt0qdqvu593wxneht3g3","vehicleId":"cmt0qdqll2pksjx4wysfr","priceAtPurchase":114400,"quantity":1},{"id":"cmt0qdqvuolh5ttw6epi4","orderId":"cmt0qdqvut48pqsn9vxx9","vehicleId":"cmt0qdqlle2has94mup7c","priceAtPurchase":55950,"quantity":1},{"id":"cmt0qdqvu7juy86laqvd1","orderId":"cmt0qdqvuqebbrzj9pvij","vehicleId":"cmt0qdqllrpkzjbqgocmg","priceAtPurchase":52990,"quantity":1},{"id":"cmt0qdqvubb247r28ljo6","orderId":"cmt0qdqvu2u176ck09izi","vehicleId":"cmt0qdqll3ve76a67n6ep","priceAtPurchase":324000,"quantity":1},{"id":"cmt0qdqvufolmaimpkdyw","orderId":"cmt0qdqvufzt81mq3vxav","vehicleId":"cmt0qdqllw91krozn4mc0","priceAtPurchase":196300,"quantity":1},{"id":"cmt0qdqvuk18pjqdhastf","orderId":"cmt0qdqvufzt81mq3vxav","vehicleId":"cmt0qdqllrpkzjbqgocmg","priceAtPurchase":52990,"quantity":1},{"id":"cmt0qdqvu6ap1yl5tdsu0","orderId":"cmt0qdqvufdjd251cprwr","vehicleId":"cmt0qdqlluykmuc07lj5t","priceAtPurchase":215000,"quantity":1},{"id":"cmt0qdqvutd8yr3znyekd","orderId":"cmt0qdqvur8ma3z79n57d","vehicleId":"cmt0qdqll3ve76a67n6ep","priceAtPurchase":324000,"quantity":1},{"id":"cmt0qdqvu1l4dieslmgrm","orderId":"cmt0qdqvuayfnn0ekbz0s","vehicleId":"cmt0qdqllw91krozn4mc0","priceAtPurchase":196300,"quantity":1},{"id":"cmt0qdqvuyu2d4hfsmnc5","orderId":"cmt0qdqvuyubbv9aj3um1","vehicleId":"cmt0qdqll540tf1hrsfet","priceAtPurchase":65200,"quantity":1},{"id":"cmt0qdqvulj8b151m4llm","orderId":"cmt0qdqvufnyx7sajor3i","vehicleId":"cmt0qdqllyjv1m9ngu02u","priceAtPurchase":51530,"quantity":1},{"id":"cmt0qdqvub6ksuy623j8a","orderId":"cmt0qdqvuqeoouguiybrr","vehicleId":"cmt0qdqllnsuf0nefqwwc","priceAtPurchase":507300,"quantity":1},{"id":"cmt0qdqvulvunsfvg9lbr","orderId":"cmt0qdqvum36s28u9tush","vehicleId":"cmt0qdqlldwsb5m0t1ycl","priceAtPurchase":28000,"quantity":1},{"id":"cmt0qdqvu3xfsd2mthocn","orderId":"cmt0qdqvuk4jjyw4bih57","vehicleId":"cmt0qdqll5jyptoj9ffl4","priceAtPurchase":608000,"quantity":1},{"id":"cmt0qdqvumeybqozj8t6o","orderId":"cmt0qdqvuk4jjyw4bih57","vehicleId":"cmt0qdqll30ygttzphb9y","priceAtPurchase":149600,"quantity":1},{"id":"cmt0qdqvud10ieqnqhigj","orderId":"cmt0qdqvu7q1z5pvwcsg7","vehicleId":"cmt0qdqllhu7g1xgr1r8n","priceAtPurchase":38000,"quantity":1},{"id":"cmt0qdqvumsw2n6521a73","orderId":"cmt0qdqvuri8g15dbzxdm","vehicleId":"cmt0qdqllsv7zb45zam8a","priceAtPurchase":38000,"quantity":1},{"id":"cmt0qdqvub9phmq0f79zd","orderId":"cmt0qdqvuri8g15dbzxdm","vehicleId":"cmt0qdqllvwf9ei0412xi","priceAtPurchase":30000,"quantity":1},{"id":"cmt0qdqvu6x1c4u780ri9","orderId":"cmt0qdqvulq8glyan5liv","vehicleId":"cmt0qdqll5ialt221d6tr","priceAtPurchase":22000,"quantity":1},{"id":"cmt0qdqvufu3cdhku5e4g","orderId":"cmt0qdqvulq8glyan5liv","vehicleId":"cmt0qdqll7cbu09ra8cd3","priceAtPurchase":50000,"quantity":1},{"id":"cmt0qdqvuch4ho5msv2ay","orderId":"cmt0qdqvum44wpzkrbyc6","vehicleId":"cmt0qdqll1wsttcurr3xp","priceAtPurchase":71900,"quantity":1},{"id":"cmt0qdqvuqojbhlnz5muj","orderId":"cmt0qdqvum44wpzkrbyc6","vehicleId":"cmt0qdqllgcesd7m8pb99","priceAtPurchase":85000,"quantity":1},{"id":"cmt0qdqvuabi2j0c90d4z","orderId":"cmt0qdqvusmimlyrfykbp","vehicleId":"cmt0qdqll13opfvuh1jcl","priceAtPurchase":39120,"quantity":1},{"id":"cmt0qdqvu4nh73c5e6mu7","orderId":"cmt0qdqvu6uj2gemuhi0h","vehicleId":"cmt0qdqlljgth5llqb73x","priceAtPurchase":71700,"quantity":1}],"reviews":[{"id":"cmt0qdqvuhjfug83or8cx","userId":"cmt0qdqobo9w28eeifukb","vehicleId":"cmt0qdqllimr6qjf233m1","rating":4,"comment":"Conducción pura y sensación premium en cada detalle.","createdAt":"2025-05-04T00:00:00.000Z","updatedAt":"2025-05-04T00:00:00.000Z"},{"id":"cmt0qdqvv4p0sdwqwfjle","userId":"cmt0qdqske77ggzu9wq0y","vehicleId":"cmt0qdqll3x9prywr65hj","rating":4,"comment":"Conducción pura y sensación premium en cada detalle.","createdAt":"2026-06-03T00:00:00.000Z","updatedAt":"2026-06-03T00:00:00.000Z"},{"id":"cmt0qdqvv0kwv10enow4z","userId":"cmt0qdqun62x53cm42li2","vehicleId":"cmt0qdqll5rifwkf0zg3w","rating":5,"comment":"Rendimiento espectacular y acabados de lujo. Muy recomendable.","createdAt":"2025-07-05T00:00:00.000Z","updatedAt":"2025-07-05T00:00:00.000Z"},{"id":"cmt0qdqvvaj7i3kzczw1p","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":"cmt0qdqll5jyptoj9ffl4","rating":4,"comment":"Una obra de arte sobre ruedas. La entrega fue inmediata.","createdAt":"2026-03-12T00:00:00.000Z","updatedAt":"2026-03-12T00:00:00.000Z"},{"id":"cmt0qdqvvr1228jwnc5zb","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":"cmt0qdqlljgth5llqb73x","rating":4,"comment":"Una obra de arte sobre ruedas. La entrega fue inmediata.","createdAt":"2025-09-15T00:00:00.000Z","updatedAt":"2025-09-15T00:00:00.000Z"}],"events":[{"id":"cmt0qdqvsl5zfyrwh7hql","type":"PURCHASE_COMPLETED","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":null,"orderId":"cmt0qdqvsf1gadfe50eij","metadata":"{\"total\":55950}","createdAt":"2025-11-12T00:00:00.000Z"},{"id":"cmt0qdqvs85nmv89v6dm2","type":"PURCHASE_COMPLETED","userId":"cmt0qdqqgvm14jvgz51db","vehicleId":null,"orderId":"cmt0qdqvs9m9vz26bebwf","metadata":"{\"total\":72175}","createdAt":"2026-03-21T00:00:00.000Z"},{"id":"cmt0qdqvspmpm8w03ebg0","type":"PURCHASE_COMPLETED","userId":"cmt0qdqqgvm14jvgz51db","vehicleId":null,"orderId":"cmt0qdqvs04dz87a303m5","metadata":"{\"total\":136000}","createdAt":"2026-01-12T00:00:00.000Z"},{"id":"cmt0qdqvshurt3t26iy9r","type":"PURCHASE_COMPLETED","userId":"cmt0qdqmzovvqncm0614r","vehicleId":null,"orderId":"cmt0qdqvs61dz8o87u0hn","metadata":"{\"total\":71900}","createdAt":"2025-10-25T00:00:00.000Z"},{"id":"cmt0qdqvskuxp5ig0pe3i","type":"PURCHASE_COMPLETED","userId":"cmt0qdqpdlbu8mrr68cuc","vehicleId":null,"orderId":"cmt0qdqvst4db2ox3m1xp","metadata":"{\"total\":233000}","createdAt":"2024-11-27T00:00:00.000Z"},{"id":"cmt0qdqvs0by0f8xwrq48","type":"PURCHASE_COMPLETED","userId":"cmt0qdqske77ggzu9wq0y","vehicleId":null,"orderId":"cmt0qdqvssskgr6t2hga4","metadata":"{\"total\":145145}","createdAt":"2025-06-22T00:00:00.000Z"},{"id":"cmt0qdqvs2fu71a06n0x6","type":"PURCHASE_COMPLETED","userId":"cmt0qdqqgvm14jvgz51db","vehicleId":null,"orderId":"cmt0qdqvsti3ex2kzlyz2","metadata":"{\"total\":35000}","createdAt":"2026-07-17T00:00:00.000Z"},{"id":"cmt0qdqvsfu4hqw04ssk7","type":"PURCHASE_COMPLETED","userId":"cmt0qdqun62x53cm42li2","vehicleId":null,"orderId":"cmt0qdqvs0i5gagce0sw9","metadata":"{\"total\":192900}","createdAt":"2024-10-02T00:00:00.000Z"},{"id":"cmt0qdqvsew5b3tm8jubw","type":"PURCHASE_COMPLETED","userId":"cmt0qdqobo9w28eeifukb","vehicleId":null,"orderId":"cmt0qdqvs604t9yyfl19o","metadata":"{\"total\":192900}","createdAt":"2025-05-04T00:00:00.000Z"},{"id":"cmt0qdqvs7ggzt533z9sd","type":"PURCHASE_COMPLETED","userId":"cmt0qdqqgvm14jvgz51db","vehicleId":null,"orderId":"cmt0qdqvsll8nm1qpji6r","metadata":"{\"total\":28000}","createdAt":"2026-07-17T00:00:00.000Z"},{"id":"cmt0qdqvsua9gv0puewqr","type":"PURCHASE_COMPLETED","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":null,"orderId":"cmt0qdqvsk3eav08v1v8j","metadata":"{\"total\":245000}","createdAt":"2026-02-01T00:00:00.000Z"},{"id":"cmt0qdqvs3al3oa6qqd58","type":"PURCHASE_COMPLETED","userId":"cmt0qdqrih3pmy6rg8fvc","vehicleId":null,"orderId":"cmt0qdqvsi01ubm9qarll","metadata":"{\"total\":25000}","createdAt":"2026-03-23T00:00:00.000Z"},{"id":"cmt0qdqvs7y22vdskp1gk","type":"PURCHASE_COMPLETED","userId":"cmt0qdqqgvm14jvgz51db","vehicleId":null,"orderId":"cmt0qdqvs3973nn96d9mn","metadata":"{\"total\":108000}","createdAt":"2025-04-11T00:00:00.000Z"},{"id":"cmt0qdqvtk7wqpz157u2a","type":"PURCHASE_COMPLETED","userId":"cmt0qdqmzovvqncm0614r","vehicleId":null,"orderId":"cmt0qdqvt7ihorfn9dv3t","metadata":"{\"total\":31895}","createdAt":"2025-10-14T00:00:00.000Z"},{"id":"cmt0qdqvterzxwcpfxiu2","type":"PURCHASE_COMPLETED","userId":"cmt0qdqske77ggzu9wq0y","vehicleId":null,"orderId":"cmt0qdqvti594xo1887c4","metadata":"{\"total\":287000}","createdAt":"2026-06-03T00:00:00.000Z"},{"id":"cmt0qdqvt9lek71wyho8y","type":"PURCHASE_COMPLETED","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":null,"orderId":"cmt0qdqvt4cm0blevw9zt","metadata":"{\"total\":125700}","createdAt":"2026-02-05T00:00:00.000Z"},{"id":"cmt0qdqvtig0n7pjnlkye","type":"PURCHASE_COMPLETED","userId":"cmt0qdqqgvm14jvgz51db","vehicleId":null,"orderId":"cmt0qdqvtzc1gbvcrfoa2","metadata":"{\"total\":35500}","createdAt":"2026-05-12T00:00:00.000Z"},{"id":"cmt0qdqvt1i3e0u4jwzkg","type":"PURCHASE_COMPLETED","userId":"cmt0qdqrih3pmy6rg8fvc","vehicleId":null,"orderId":"cmt0qdqvtntkrxan7vwu6","metadata":"{\"total\":151145}","createdAt":"2026-01-16T00:00:00.000Z"},{"id":"cmt0qdqvtk1n6l7wk26ix","type":"PURCHASE_COMPLETED","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":null,"orderId":"cmt0qdqvtec2onyd355hc","metadata":"{\"total\":122300}","createdAt":"2024-12-05T00:00:00.000Z"},{"id":"cmt0qdqvtljmrnye3veqe","type":"PURCHASE_COMPLETED","userId":"cmt0qdqun62x53cm42li2","vehicleId":null,"orderId":"cmt0qdqvtcgloi5z6jpta","metadata":"{\"total\":42000}","createdAt":"2025-07-05T00:00:00.000Z"},{"id":"cmt0qdqvtivbb9bxra3xt","type":"PURCHASE_COMPLETED","userId":"cmt0qdqmzovvqncm0614r","vehicleId":null,"orderId":"cmt0qdqvt7t8rl95kttry","metadata":"{\"total\":137990}","createdAt":"2024-10-08T00:00:00.000Z"},{"id":"cmt0qdqvtmfrxaihbgqo5","type":"PURCHASE_COMPLETED","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":null,"orderId":"cmt0qdqvtwkygdhntwxd6","metadata":"{\"total\":66000}","createdAt":"2024-09-12T00:00:00.000Z"},{"id":"cmt0qdqvuqo6y3eht2pwb","type":"PURCHASE_COMPLETED","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":null,"orderId":"cmt0qdqvtpl7sn38pl3ti","metadata":"{\"total\":730300}","createdAt":"2026-03-12T00:00:00.000Z"},{"id":"cmt0qdqvuswg79j3o36eb","type":"PURCHASE_COMPLETED","userId":"cmt0qdqrih3pmy6rg8fvc","vehicleId":null,"orderId":"cmt0qdqvut48pqsn9vxx9","metadata":"{\"total\":55950}","createdAt":"2026-01-01T00:00:00.000Z"},{"id":"cmt0qdqvumn6bssd7m2xv","type":"PURCHASE_COMPLETED","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":null,"orderId":"cmt0qdqvuqebbrzj9pvij","metadata":"{\"total\":52990}","createdAt":"2026-02-25T00:00:00.000Z"},{"id":"cmt0qdqvuja3k8fqo658t","type":"PURCHASE_COMPLETED","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":null,"orderId":"cmt0qdqvu2u176ck09izi","metadata":"{\"total\":324000}","createdAt":"2024-09-15T00:00:00.000Z"},{"id":"cmt0qdqvuef8m6c4bkabc","type":"PURCHASE_COMPLETED","userId":"cmt0qdqobo9w28eeifukb","vehicleId":null,"orderId":"cmt0qdqvuayfnn0ekbz0s","metadata":"{\"total\":196300}","createdAt":"2024-09-20T00:00:00.000Z"},{"id":"cmt0qdqvucwo9mym9c5qk","type":"PURCHASE_COMPLETED","userId":"cmt0qdqobo9w28eeifukb","vehicleId":null,"orderId":"cmt0qdqvuqeoouguiybrr","metadata":"{\"total\":507300}","createdAt":"2026-04-20T00:00:00.000Z"},{"id":"cmt0qdqvud31lfvetq204","type":"PURCHASE_COMPLETED","userId":"cmt0qdqmzovvqncm0614r","vehicleId":null,"orderId":"cmt0qdqvum36s28u9tush","metadata":"{\"total\":28000}","createdAt":"2025-05-03T00:00:00.000Z"},{"id":"cmt0qdqvu6k60i7ymd2lf","type":"PURCHASE_COMPLETED","userId":"cmt0qdqske77ggzu9wq0y","vehicleId":null,"orderId":"cmt0qdqvulq8glyan5liv","metadata":"{\"total\":72000}","createdAt":"2025-12-18T00:00:00.000Z"},{"id":"cmt0qdqvul9ld7jas0vn0","type":"PURCHASE_COMPLETED","userId":"cmt0qdqtllmxi79ser5nr","vehicleId":null,"orderId":"cmt0qdqvu6uj2gemuhi0h","metadata":"{\"total\":71700}","createdAt":"2025-09-15T00:00:00.000Z"},{"id":"cmt0qdqvvni478c258dre","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllrpkzjbqgocmg","orderId":null,"metadata":"{}","createdAt":"2025-11-03T00:00:00.000Z"},{"id":"cmt0qdqvvg958wsp9z9xy","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll5rifwkf0zg3w","orderId":null,"metadata":"{}","createdAt":"2026-07-28T00:00:00.000Z"},{"id":"cmt0qdqvvq4sp100h2cim","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsuf0nefqwwc","orderId":null,"metadata":"{}","createdAt":"2026-08-16T00:00:00.000Z"},{"id":"cmt0qdqvvae9s9bun5yv8","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll3u26cqg6ft71","orderId":null,"metadata":"{}","createdAt":"2026-07-02T00:00:00.000Z"},{"id":"cmt0qdqvvpt3ene12ppqi","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllwn0cryike8jz","orderId":null,"metadata":"{}","createdAt":"2025-10-27T00:00:00.000Z"},{"id":"cmt0qdqvvoja7uvu1j3r5","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllc77z69w24v9k","orderId":null,"metadata":"{}","createdAt":"2026-06-23T00:00:00.000Z"},{"id":"cmt0qdqvv31mloy5x6z9k","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllchb2ia0v2ck9","orderId":null,"metadata":"{}","createdAt":"2026-02-02T00:00:00.000Z"},{"id":"cmt0qdqvv8qdj5hqd1cmd","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllj5cpvvcn941o","orderId":null,"metadata":"{}","createdAt":"2026-02-20T00:00:00.000Z"},{"id":"cmt0qdqvvmzhxhrypl4pz","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll30ygttzphb9y","orderId":null,"metadata":"{}","createdAt":"2026-02-18T00:00:00.000Z"},{"id":"cmt0qdqvve3iox2vtb1pn","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllavm2uu5yn02u","orderId":null,"metadata":"{}","createdAt":"2025-09-09T00:00:00.000Z"},{"id":"cmt0qdqvvxmi8zj1as1ch","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll7cbu09ra8cd3","orderId":null,"metadata":"{}","createdAt":"2026-04-12T00:00:00.000Z"},{"id":"cmt0qdqvvvuvfkpyf6cxd","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll13opfvuh1jcl","orderId":null,"metadata":"{}","createdAt":"2026-02-08T00:00:00.000Z"},{"id":"cmt0qdqvveanxfl0h7d8v","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllx6akww7ibq3c","orderId":null,"metadata":"{}","createdAt":"2025-09-19T00:00:00.000Z"},{"id":"cmt0qdqvva33odh11w0lw","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll1f81zp3qy5qy","orderId":null,"metadata":"{}","createdAt":"2026-05-11T00:00:00.000Z"},{"id":"cmt0qdqvvz8o4xbh6az8e","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll1f81zp3qy5qy","orderId":null,"metadata":"{}","createdAt":"2025-10-17T00:00:00.000Z"},{"id":"cmt0qdqvv63wnywx1v15g","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlle71g9qkopgya","orderId":null,"metadata":"{}","createdAt":"2026-03-12T00:00:00.000Z"},{"id":"cmt0qdqvvk7i3i72cq47f","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll5rifwkf0zg3w","orderId":null,"metadata":"{}","createdAt":"2026-03-27T00:00:00.000Z"},{"id":"cmt0qdqvv88pkipgy0fsx","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll9ue5cvicxuye","orderId":null,"metadata":"{}","createdAt":"2025-10-05T00:00:00.000Z"},{"id":"cmt0qdqvv0ww5qbh2ux01","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllbtllfwjehkqs","orderId":null,"metadata":"{}","createdAt":"2026-03-05T00:00:00.000Z"},{"id":"cmt0qdqvvicz4fvv7tjmk","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlle2has94mup7c","orderId":null,"metadata":"{}","createdAt":"2025-12-26T00:00:00.000Z"},{"id":"cmt0qdqvvyk2078084h7x","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllmswqrol0tf10","orderId":null,"metadata":"{}","createdAt":"2025-10-21T00:00:00.000Z"},{"id":"cmt0qdqvvpdqhb1jnx7eo","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll0w7lxpf97sv5","orderId":null,"metadata":"{}","createdAt":"2026-06-25T00:00:00.000Z"},{"id":"cmt0qdqvvb8r5nqnisnb9","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll4e9z71123ltw","orderId":null,"metadata":"{}","createdAt":"2026-06-02T00:00:00.000Z"},{"id":"cmt0qdqvvshkac9swjkbx","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllimr6qjf233m1","orderId":null,"metadata":"{}","createdAt":"2026-02-04T00:00:00.000Z"},{"id":"cmt0qdqvv73fenn5lxxf9","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll3ve76a67n6ep","orderId":null,"metadata":"{}","createdAt":"2026-02-14T00:00:00.000Z"},{"id":"cmt0qdqvvo8pqrc6sdrbj","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllyjv1m9ngu02u","orderId":null,"metadata":"{}","createdAt":"2025-12-13T00:00:00.000Z"},{"id":"cmt0qdqvvgzz1a393v77f","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllrjkm50iniztl","orderId":null,"metadata":"{}","createdAt":"2026-02-10T00:00:00.000Z"},{"id":"cmt0qdqvvgg5k4s4mkbkz","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlltgpaw8fcok6r","orderId":null,"metadata":"{}","createdAt":"2026-01-18T00:00:00.000Z"},{"id":"cmt0qdqvvaftboarjzc7q","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll2bwn6ftok4xc","orderId":null,"metadata":"{}","createdAt":"2026-05-10T00:00:00.000Z"},{"id":"cmt0qdqvvmm82zlm0sz82","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllbi3whmy2mxan","orderId":null,"metadata":"{}","createdAt":"2026-03-05T00:00:00.000Z"},{"id":"cmt0qdqvvdtgay88wa30f","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllx6gfwasn3pn2","orderId":null,"metadata":"{}","createdAt":"2026-02-24T00:00:00.000Z"},{"id":"cmt0qdqvvv5hnpidokhbb","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllmeiqb1sv08tg","orderId":null,"metadata":"{}","createdAt":"2025-10-20T00:00:00.000Z"},{"id":"cmt0qdqvv9wcjw5brllzz","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll5rifwkf0zg3w","orderId":null,"metadata":"{}","createdAt":"2026-05-06T00:00:00.000Z"},{"id":"cmt0qdqvvndmnj15ami7y","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll1f81zp3qy5qy","orderId":null,"metadata":"{}","createdAt":"2025-09-24T00:00:00.000Z"},{"id":"cmt0qdqvvkgzgsgo69hnh","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlli3v096iy3swt","orderId":null,"metadata":"{}","createdAt":"2025-09-15T00:00:00.000Z"},{"id":"cmt0qdqvvyrxz148waz8i","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlllrqxgad1m0rx","orderId":null,"metadata":"{}","createdAt":"2025-10-12T00:00:00.000Z"},{"id":"cmt0qdqvvui8issz2dr7y","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllpobzuamfl50z","orderId":null,"metadata":"{}","createdAt":"2026-02-25T00:00:00.000Z"},{"id":"cmt0qdqvvey7toxts7x5q","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllkq8walybay7h","orderId":null,"metadata":"{}","createdAt":"2026-05-24T00:00:00.000Z"},{"id":"cmt0qdqvvgpxl3abinfp3","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllimr6qjf233m1","orderId":null,"metadata":"{}","createdAt":"2025-09-10T00:00:00.000Z"},{"id":"cmt0qdqvvsr2b05w0qsek","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll5rifwkf0zg3w","orderId":null,"metadata":"{}","createdAt":"2026-01-12T00:00:00.000Z"},{"id":"cmt0qdqvvttww3lh8y4ac","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllvwf9ei0412xi","orderId":null,"metadata":"{}","createdAt":"2026-08-13T00:00:00.000Z"},{"id":"cmt0qdqvvk8lpr2ykxcll","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll487oiailgxkk","orderId":null,"metadata":"{}","createdAt":"2026-06-04T00:00:00.000Z"},{"id":"cmt0qdqvvrmiq8yebkngm","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlle71g9qkopgya","orderId":null,"metadata":"{}","createdAt":"2026-07-08T00:00:00.000Z"},{"id":"cmt0qdqvvu0cgobp7hifs","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll38mccfibz126","orderId":null,"metadata":"{}","createdAt":"2026-01-04T00:00:00.000Z"},{"id":"cmt0qdqvvzv0i6gy1d4bu","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll26s2puu3c73t","orderId":null,"metadata":"{}","createdAt":"2026-08-25T00:00:00.000Z"},{"id":"cmt0qdqvv6kdk88ev3q3d","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllz2wgy0oqo2oa","orderId":null,"metadata":"{}","createdAt":"2025-09-24T00:00:00.000Z"},{"id":"cmt0qdqvvr2rj8d1fzuvg","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxpxik5ozkmd7","orderId":null,"metadata":"{}","createdAt":"2026-03-22T00:00:00.000Z"},{"id":"cmt0qdqvv04iv27yogah2","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll1mvaymhf8m7y","orderId":null,"metadata":"{}","createdAt":"2026-05-11T00:00:00.000Z"},{"id":"cmt0qdqvvn5q9gd2i1z3k","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllvwf9ei0412xi","orderId":null,"metadata":"{}","createdAt":"2026-06-06T00:00:00.000Z"},{"id":"cmt0qdqvvd1jjc3o35qk4","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllw91krozn4mc0","orderId":null,"metadata":"{}","createdAt":"2026-04-20T00:00:00.000Z"},{"id":"cmt0qdqvvzx5cqo6qnkoa","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsmy3n553mt9","orderId":null,"metadata":"{}","createdAt":"2026-08-02T00:00:00.000Z"},{"id":"cmt0qdqvv8pe8dlskurgq","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll13opfvuh1jcl","orderId":null,"metadata":"{}","createdAt":"2026-06-15T00:00:00.000Z"},{"id":"cmt0qdqvvdnp7u53wi7ek","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll04078ejoi7d1","orderId":null,"metadata":"{}","createdAt":"2026-07-08T00:00:00.000Z"},{"id":"cmt0qdqvvask6i6asqf96","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll1mvaymhf8m7y","orderId":null,"metadata":"{}","createdAt":"2025-11-17T00:00:00.000Z"},{"id":"cmt0qdqvvvqsmo9gblnwj","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll7rt57e0o531l","orderId":null,"metadata":"{}","createdAt":"2025-12-15T00:00:00.000Z"},{"id":"cmt0qdqvvb5l607jelri0","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlluknkb5rhntsh","orderId":null,"metadata":"{}","createdAt":"2025-12-02T00:00:00.000Z"},{"id":"cmt0qdqvvshxpgq5vkqoe","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllkqyakk3icgly","orderId":null,"metadata":"{}","createdAt":"2025-09-07T00:00:00.000Z"},{"id":"cmt0qdqvv4o6oc3aubhsm","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllguini4zfkpva","orderId":null,"metadata":"{}","createdAt":"2025-09-22T00:00:00.000Z"},{"id":"cmt0qdqvvz3eqo2ga2mq5","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlltjkv7j7szyv8","orderId":null,"metadata":"{}","createdAt":"2025-10-04T00:00:00.000Z"},{"id":"cmt0qdqvvyol2wzb3x20x","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll5rifwkf0zg3w","orderId":null,"metadata":"{}","createdAt":"2026-04-27T00:00:00.000Z"},{"id":"cmt0qdqvv9qnznchw0bwr","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllhu7g1xgr1r8n","orderId":null,"metadata":"{}","createdAt":"2026-06-11T00:00:00.000Z"},{"id":"cmt0qdqvvozibmp68pwdl","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllc77z69w24v9k","orderId":null,"metadata":"{}","createdAt":"2026-08-09T00:00:00.000Z"},{"id":"cmt0qdqvve5ul5ajom9g2","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllpzsytuapua13","orderId":null,"metadata":"{}","createdAt":"2026-07-10T00:00:00.000Z"},{"id":"cmt0qdqvv4zwz5p280tdy","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllguini4zfkpva","orderId":null,"metadata":"{}","createdAt":"2026-08-19T00:00:00.000Z"},{"id":"cmt0qdqvvihwlwi7fbnwz","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlle71g9qkopgya","orderId":null,"metadata":"{}","createdAt":"2026-02-02T00:00:00.000Z"},{"id":"cmt0qdqvv244tnso92gu6","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllbtllfwjehkqs","orderId":null,"metadata":"{}","createdAt":"2026-04-01T00:00:00.000Z"},{"id":"cmt0qdqvvbmw4d6oedrwl","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxakzj4qyar10","orderId":null,"metadata":"{}","createdAt":"2026-08-07T00:00:00.000Z"},{"id":"cmt0qdqvvabv9nzlbslk0","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlluknkb5rhntsh","orderId":null,"metadata":"{}","createdAt":"2026-07-13T00:00:00.000Z"},{"id":"cmt0qdqvviobdcjqu7fxl","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll04078ejoi7d1","orderId":null,"metadata":"{}","createdAt":"2025-09-01T00:00:00.000Z"},{"id":"cmt0qdqvvh8wr5r2j1u9w","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllchb2ia0v2ck9","orderId":null,"metadata":"{}","createdAt":"2026-07-05T00:00:00.000Z"},{"id":"cmt0qdqvvs1hv5b5zli52","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllw91krozn4mc0","orderId":null,"metadata":"{}","createdAt":"2026-08-01T00:00:00.000Z"},{"id":"cmt0qdqvvsifoab5oc61z","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllz2m4k2vxl4ee","orderId":null,"metadata":"{}","createdAt":"2026-04-18T00:00:00.000Z"},{"id":"cmt0qdqvvqbdc11k9pk39","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll26s2puu3c73t","orderId":null,"metadata":"{}","createdAt":"2026-07-10T00:00:00.000Z"},{"id":"cmt0qdqvvwpk920zhuub9","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllmeiqb1sv08tg","orderId":null,"metadata":"{}","createdAt":"2026-07-09T00:00:00.000Z"},{"id":"cmt0qdqvv9x5g5e91ubc3","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllyjv1m9ngu02u","orderId":null,"metadata":"{}","createdAt":"2026-03-23T00:00:00.000Z"},{"id":"cmt0qdqvvpg51dl417swo","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllrjkm50iniztl","orderId":null,"metadata":"{}","createdAt":"2026-07-11T00:00:00.000Z"},{"id":"cmt0qdqvv7mp8haepkple","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllhu7g1xgr1r8n","orderId":null,"metadata":"{}","createdAt":"2026-08-13T00:00:00.000Z"},{"id":"cmt0qdqvvnpsdf0fst5r1","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlluknkb5rhntsh","orderId":null,"metadata":"{}","createdAt":"2025-10-10T00:00:00.000Z"},{"id":"cmt0qdqvv81xronaydcj8","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllrpkzjbqgocmg","orderId":null,"metadata":"{}","createdAt":"2026-02-09T00:00:00.000Z"},{"id":"cmt0qdqvv4swh6un68ijn","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllz2m4k2vxl4ee","orderId":null,"metadata":"{}","createdAt":"2026-03-23T00:00:00.000Z"},{"id":"cmt0qdqvv50hm9vcltrxu","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlllrqxgad1m0rx","orderId":null,"metadata":"{}","createdAt":"2026-03-09T00:00:00.000Z"},{"id":"cmt0qdqvv9x8l4mag8uhn","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllw0hcpjw6h0lc","orderId":null,"metadata":"{}","createdAt":"2026-02-11T00:00:00.000Z"},{"id":"cmt0qdqvvm6hq5pg7cvmn","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll1j87mdx98h48","orderId":null,"metadata":"{}","createdAt":"2026-05-02T00:00:00.000Z"},{"id":"cmt0qdqvv9qqjsa55aqqd","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxakzj4qyar10","orderId":null,"metadata":"{}","createdAt":"2025-10-12T00:00:00.000Z"},{"id":"cmt0qdqvvs4zenof7jdeu","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllpobzuamfl50z","orderId":null,"metadata":"{}","createdAt":"2026-07-09T00:00:00.000Z"},{"id":"cmt0qdqvvrhqh85c8of74","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlllq26wejrwp3z","orderId":null,"metadata":"{}","createdAt":"2026-06-28T00:00:00.000Z"},{"id":"cmt0qdqvv8gnqzs0lste2","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllqwajcayagtcw","orderId":null,"metadata":"{}","createdAt":"2025-12-01T00:00:00.000Z"},{"id":"cmt0qdqvvctbamz460rbh","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll06ste6f2te83","orderId":null,"metadata":"{}","createdAt":"2026-04-12T00:00:00.000Z"},{"id":"cmt0qdqvvxisnqufwjadi","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllqwajcayagtcw","orderId":null,"metadata":"{}","createdAt":"2026-02-26T00:00:00.000Z"},{"id":"cmt0qdqvv9iaws6mwatxq","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxakzj4qyar10","orderId":null,"metadata":"{}","createdAt":"2026-07-06T00:00:00.000Z"},{"id":"cmt0qdqvvxixc69brb409","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllpobzuamfl50z","orderId":null,"metadata":"{}","createdAt":"2026-04-21T00:00:00.000Z"},{"id":"cmt0qdqvvhaytdnn8hg0t","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllw91krozn4mc0","orderId":null,"metadata":"{}","createdAt":"2026-06-21T00:00:00.000Z"},{"id":"cmt0qdqvv9gs9l70mxscx","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllqwajcayagtcw","orderId":null,"metadata":"{}","createdAt":"2026-04-01T00:00:00.000Z"},{"id":"cmt0qdqvv1y0ri1c57gob","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll3ve76a67n6ep","orderId":null,"metadata":"{}","createdAt":"2026-07-02T00:00:00.000Z"},{"id":"cmt0qdqvvrjsapulxro8d","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllfqsn1mwqxm04","orderId":null,"metadata":"{}","createdAt":"2026-01-08T00:00:00.000Z"},{"id":"cmt0qdqvvh6evulurlurk","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsmy3n553mt9","orderId":null,"metadata":"{}","createdAt":"2025-11-04T00:00:00.000Z"},{"id":"cmt0qdqvvl8s36yqsekul","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll540tf1hrsfet","orderId":null,"metadata":"{}","createdAt":"2025-09-20T00:00:00.000Z"},{"id":"cmt0qdqvv44kmyjo70l0j","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll38mccfibz126","orderId":null,"metadata":"{}","createdAt":"2025-09-27T00:00:00.000Z"},{"id":"cmt0qdqvvgy9lbj558d5y","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll540tf1hrsfet","orderId":null,"metadata":"{}","createdAt":"2026-01-08T00:00:00.000Z"},{"id":"cmt0qdqvvqiww0uxbyial","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll06ste6f2te83","orderId":null,"metadata":"{}","createdAt":"2026-01-02T00:00:00.000Z"},{"id":"cmt0qdqvvmwy5fn2gnxrm","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll1j87mdx98h48","orderId":null,"metadata":"{}","createdAt":"2026-05-06T00:00:00.000Z"},{"id":"cmt0qdqvv16fqmrcak8hn","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxpmnz90mvmxs","orderId":null,"metadata":"{}","createdAt":"2026-06-28T00:00:00.000Z"},{"id":"cmt0qdqvvo4tombhc01qp","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsmy3n553mt9","orderId":null,"metadata":"{}","createdAt":"2026-05-16T00:00:00.000Z"},{"id":"cmt0qdqvvsoq28j9q2abj","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlli3v096iy3swt","orderId":null,"metadata":"{}","createdAt":"2026-05-06T00:00:00.000Z"},{"id":"cmt0qdqvvyjdiih2u2spr","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllrjkm50iniztl","orderId":null,"metadata":"{}","createdAt":"2026-01-17T00:00:00.000Z"},{"id":"cmt0qdqvvbi8q1x16cjat","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllt6xvmzyvl61x","orderId":null,"metadata":"{}","createdAt":"2026-02-10T00:00:00.000Z"},{"id":"cmt0qdqvv3i12fm1zjos1","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllimr6qjf233m1","orderId":null,"metadata":"{}","createdAt":"2026-07-21T00:00:00.000Z"},{"id":"cmt0qdqvv6s7wb7aomyyi","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlle71g9qkopgya","orderId":null,"metadata":"{}","createdAt":"2025-12-06T00:00:00.000Z"},{"id":"cmt0qdqvvh84vngrtj7jd","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlltjkv7j7szyv8","orderId":null,"metadata":"{}","createdAt":"2026-01-14T00:00:00.000Z"},{"id":"cmt0qdqvvf07655ysx8s1","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllz2m4k2vxl4ee","orderId":null,"metadata":"{}","createdAt":"2026-04-24T00:00:00.000Z"},{"id":"cmt0qdqvv2o1fp76vbbcw","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllc77z69w24v9k","orderId":null,"metadata":"{}","createdAt":"2026-02-02T00:00:00.000Z"},{"id":"cmt0qdqvvbrsp38c3mtdu","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllyk4z5pkno0q5","orderId":null,"metadata":"{}","createdAt":"2026-07-27T00:00:00.000Z"},{"id":"cmt0qdqvvxxzp0qgzylf7","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlllrqxgad1m0rx","orderId":null,"metadata":"{}","createdAt":"2026-04-06T00:00:00.000Z"},{"id":"cmt0qdqvvpxo94k47tpyr","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll06ste6f2te83","orderId":null,"metadata":"{}","createdAt":"2026-06-03T00:00:00.000Z"},{"id":"cmt0qdqvvjvzvklykgn4w","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllx6gfwasn3pn2","orderId":null,"metadata":"{}","createdAt":"2026-05-19T00:00:00.000Z"},{"id":"cmt0qdqvvr488ttptfg3x","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlltgpaw8fcok6r","orderId":null,"metadata":"{}","createdAt":"2026-08-25T00:00:00.000Z"},{"id":"cmt0qdqvvko5fe9kbnx1q","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll2bwn6ftok4xc","orderId":null,"metadata":"{}","createdAt":"2025-12-18T00:00:00.000Z"},{"id":"cmt0qdqvvq4cruebbq8k5","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllx6gfwasn3pn2","orderId":null,"metadata":"{}","createdAt":"2026-02-18T00:00:00.000Z"},{"id":"cmt0qdqvvkp4xi0ke61su","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllkq8walybay7h","orderId":null,"metadata":"{}","createdAt":"2026-03-12T00:00:00.000Z"},{"id":"cmt0qdqvvkdbm745wtwki","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlltjkv7j7szyv8","orderId":null,"metadata":"{}","createdAt":"2026-04-14T00:00:00.000Z"},{"id":"cmt0qdqvv3eeut0tk48kf","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxpmnz90mvmxs","orderId":null,"metadata":"{}","createdAt":"2026-05-26T00:00:00.000Z"},{"id":"cmt0qdqvvm19ro1xaqget","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllc77z69w24v9k","orderId":null,"metadata":"{}","createdAt":"2026-01-18T00:00:00.000Z"},{"id":"cmt0qdqvv6sxy1x2atugr","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll5rifwkf0zg3w","orderId":null,"metadata":"{}","createdAt":"2025-12-19T00:00:00.000Z"},{"id":"cmt0qdqvvluvkp74qasi9","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsmy3n553mt9","orderId":null,"metadata":"{}","createdAt":"2025-09-16T00:00:00.000Z"},{"id":"cmt0qdqvv250vyibnbs21","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllz2m4k2vxl4ee","orderId":null,"metadata":"{}","createdAt":"2026-02-25T00:00:00.000Z"},{"id":"cmt0qdqvvknpz2vit4fln","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllp9wzeg4z1bfo","orderId":null,"metadata":"{}","createdAt":"2026-03-23T00:00:00.000Z"},{"id":"cmt0qdqvvt1bd7xajgucp","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlltjkv7j7szyv8","orderId":null,"metadata":"{}","createdAt":"2026-04-22T00:00:00.000Z"},{"id":"cmt0qdqvvcl54cgiiziwc","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllqwajcayagtcw","orderId":null,"metadata":"{}","createdAt":"2026-08-08T00:00:00.000Z"},{"id":"cmt0qdqvvbrtmi8oyjv2k","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllzm6sq5k2utnq","orderId":null,"metadata":"{}","createdAt":"2025-12-20T00:00:00.000Z"},{"id":"cmt0qdqvvvl028i64qk2m","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll487oiailgxkk","orderId":null,"metadata":"{}","createdAt":"2026-02-07T00:00:00.000Z"},{"id":"cmt0qdqvv5c9g4p7ro7va","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllw91krozn4mc0","orderId":null,"metadata":"{}","createdAt":"2026-08-07T00:00:00.000Z"},{"id":"cmt0qdqvv5g2dj5vy8ihy","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllg1tyzf0y9yfr","orderId":null,"metadata":"{}","createdAt":"2026-06-20T00:00:00.000Z"},{"id":"cmt0qdqvvg3hm4y43ge7k","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll4e9z71123ltw","orderId":null,"metadata":"{}","createdAt":"2025-09-04T00:00:00.000Z"},{"id":"cmt0qdqvv5gfzru7p1xvd","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllrpkzjbqgocmg","orderId":null,"metadata":"{}","createdAt":"2026-04-24T00:00:00.000Z"},{"id":"cmt0qdqvv52lmxamrnbfa","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlli3v096iy3swt","orderId":null,"metadata":"{}","createdAt":"2025-12-08T00:00:00.000Z"},{"id":"cmt0qdqvv5lm61c8o4lwo","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll1f81zp3qy5qy","orderId":null,"metadata":"{}","createdAt":"2026-01-05T00:00:00.000Z"},{"id":"cmt0qdqvv59t0ve5p3ihu","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll9ue5cvicxuye","orderId":null,"metadata":"{}","createdAt":"2026-06-28T00:00:00.000Z"},{"id":"cmt0qdqvvlba1opnxq6jh","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllzm6sq5k2utnq","orderId":null,"metadata":"{}","createdAt":"2026-01-13T00:00:00.000Z"},{"id":"cmt0qdqvvaoeze415gl87","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll540tf1hrsfet","orderId":null,"metadata":"{}","createdAt":"2025-09-15T00:00:00.000Z"},{"id":"cmt0qdqvv55ash8c2fanp","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll26s2puu3c73t","orderId":null,"metadata":"{}","createdAt":"2025-11-28T00:00:00.000Z"},{"id":"cmt0qdqvv1dz3atq2uo31","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllx6akww7ibq3c","orderId":null,"metadata":"{}","createdAt":"2026-06-16T00:00:00.000Z"},{"id":"cmt0qdqvvhizwhevkpg7j","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllguini4zfkpva","orderId":null,"metadata":"{}","createdAt":"2025-10-26T00:00:00.000Z"},{"id":"cmt0qdqvv14pso06xgrw8","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllj027yfg5nysk","orderId":null,"metadata":"{}","createdAt":"2026-01-19T00:00:00.000Z"},{"id":"cmt0qdqvvd3is9hpyd7j2","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllp9wzeg4z1bfo","orderId":null,"metadata":"{}","createdAt":"2025-12-19T00:00:00.000Z"},{"id":"cmt0qdqvvchxqjz10kc3h","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlltjkv7j7szyv8","orderId":null,"metadata":"{}","createdAt":"2025-11-10T00:00:00.000Z"},{"id":"cmt0qdqvv8wm7g4f8l0tm","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll2nvge2qzxjoe","orderId":null,"metadata":"{}","createdAt":"2025-12-20T00:00:00.000Z"},{"id":"cmt0qdqvv5wrqb91fde4r","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllw91krozn4mc0","orderId":null,"metadata":"{}","createdAt":"2026-06-06T00:00:00.000Z"},{"id":"cmt0qdqvvsm1jsi88ehak","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlluykmuc07lj5t","orderId":null,"metadata":"{}","createdAt":"2025-10-27T00:00:00.000Z"},{"id":"cmt0qdqvvluhggxdccd3d","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllmeiqb1sv08tg","orderId":null,"metadata":"{}","createdAt":"2026-04-28T00:00:00.000Z"},{"id":"cmt0qdqvvn2u0j9fimzmj","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllz2m4k2vxl4ee","orderId":null,"metadata":"{}","createdAt":"2025-12-18T00:00:00.000Z"},{"id":"cmt0qdqvvxjbjyguf5o07","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlluknkb5rhntsh","orderId":null,"metadata":"{}","createdAt":"2026-05-17T00:00:00.000Z"},{"id":"cmt0qdqvvgxv9l6yfvxz5","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllj5cpvvcn941o","orderId":null,"metadata":"{}","createdAt":"2026-03-08T00:00:00.000Z"},{"id":"cmt0qdqvv0yfvgsikdayv","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllj5cpvvcn941o","orderId":null,"metadata":"{}","createdAt":"2026-06-25T00:00:00.000Z"},{"id":"cmt0qdqvvfk5ku57jf0pn","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllimr6qjf233m1","orderId":null,"metadata":"{}","createdAt":"2025-12-07T00:00:00.000Z"},{"id":"cmt0qdqvvb6ykh76uhy1g","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsmy3n553mt9","orderId":null,"metadata":"{}","createdAt":"2026-04-12T00:00:00.000Z"},{"id":"cmt0qdqvvbq3vvuplnvlx","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll2nvge2qzxjoe","orderId":null,"metadata":"{}","createdAt":"2025-10-24T00:00:00.000Z"},{"id":"cmt0qdqvvdk3hzih1q49j","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlle2has94mup7c","orderId":null,"metadata":"{}","createdAt":"2026-03-16T00:00:00.000Z"},{"id":"cmt0qdqvvcdi73xtx0m1v","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlllrqxgad1m0rx","orderId":null,"metadata":"{}","createdAt":"2025-09-01T00:00:00.000Z"},{"id":"cmt0qdqvvxx1eyoh61ihx","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllkqyakk3icgly","orderId":null,"metadata":"{}","createdAt":"2026-07-08T00:00:00.000Z"},{"id":"cmt0qdqvwsxkfxjiq7krw","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll2nvge2qzxjoe","orderId":null,"metadata":"{}","createdAt":"2025-09-03T00:00:00.000Z"},{"id":"cmt0qdqvwoo6wka001xgb","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllrpkzjbqgocmg","orderId":null,"metadata":"{}","createdAt":"2026-04-08T00:00:00.000Z"},{"id":"cmt0qdqvwkzahvhtiwwdb","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllwn0cryike8jz","orderId":null,"metadata":"{}","createdAt":"2025-10-17T00:00:00.000Z"},{"id":"cmt0qdqvwz4me8kfcd5tq","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll38mccfibz126","orderId":null,"metadata":"{}","createdAt":"2026-03-17T00:00:00.000Z"},{"id":"cmt0qdqvwjyjyd3i4hzeu","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsmy3n553mt9","orderId":null,"metadata":"{}","createdAt":"2026-07-06T00:00:00.000Z"},{"id":"cmt0qdqvw8uqbgi25sfca","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllj027yfg5nysk","orderId":null,"metadata":"{}","createdAt":"2026-08-04T00:00:00.000Z"},{"id":"cmt0qdqvw8ib2w8am12t6","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll7cbu09ra8cd3","orderId":null,"metadata":"{}","createdAt":"2025-11-20T00:00:00.000Z"},{"id":"cmt0qdqvwdaow72ihcvqf","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllycrqiiz7s3dq","orderId":null,"metadata":"{}","createdAt":"2026-08-18T00:00:00.000Z"},{"id":"cmt0qdqvwg94dkxit9f0x","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll2pksjx4wysfr","orderId":null,"metadata":"{}","createdAt":"2026-08-13T00:00:00.000Z"},{"id":"cmt0qdqvwfbmxm76e6qlu","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll1mvaymhf8m7y","orderId":null,"metadata":"{}","createdAt":"2025-09-22T00:00:00.000Z"},{"id":"cmt0qdqvwn9mmd5aizp81","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsuf0nefqwwc","orderId":null,"metadata":"{}","createdAt":"2026-07-02T00:00:00.000Z"},{"id":"cmt0qdqvwfhc1wxou31f6","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll2pksjx4wysfr","orderId":null,"metadata":"{}","createdAt":"2026-08-12T00:00:00.000Z"},{"id":"cmt0qdqvw0jes2etdp28x","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll13opfvuh1jcl","orderId":null,"metadata":"{}","createdAt":"2026-08-10T00:00:00.000Z"},{"id":"cmt0qdqvwdf14ui0a07oc","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxakzj4qyar10","orderId":null,"metadata":"{}","createdAt":"2026-04-08T00:00:00.000Z"},{"id":"cmt0qdqvwh90dz6regbty","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxpxik5ozkmd7","orderId":null,"metadata":"{}","createdAt":"2026-08-03T00:00:00.000Z"},{"id":"cmt0qdqvwr6n52lwfxwyo","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllguini4zfkpva","orderId":null,"metadata":"{}","createdAt":"2026-02-21T00:00:00.000Z"},{"id":"cmt0qdqvwgejb22et7c3a","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsmy3n553mt9","orderId":null,"metadata":"{}","createdAt":"2026-03-15T00:00:00.000Z"},{"id":"cmt0qdqvw9f0cqpxt27ii","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllj5cpvvcn941o","orderId":null,"metadata":"{}","createdAt":"2026-04-20T00:00:00.000Z"},{"id":"cmt0qdqvwagzu2jfc26f7","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllguini4zfkpva","orderId":null,"metadata":"{}","createdAt":"2026-05-08T00:00:00.000Z"},{"id":"cmt0qdqvw4cc975zdy9j9","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll4e9z71123ltw","orderId":null,"metadata":"{}","createdAt":"2026-05-16T00:00:00.000Z"},{"id":"cmt0qdqvwihopqlqxbiwz","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll8jb14j6y6zn8","orderId":null,"metadata":"{}","createdAt":"2025-10-08T00:00:00.000Z"},{"id":"cmt0qdqvwzjgf94m8t6go","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxpxik5ozkmd7","orderId":null,"metadata":"{}","createdAt":"2025-09-08T00:00:00.000Z"},{"id":"cmt0qdqvww5ohs68d00po","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxpxik5ozkmd7","orderId":null,"metadata":"{}","createdAt":"2025-11-27T00:00:00.000Z"},{"id":"cmt0qdqvwoesytwrncfvy","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxpxik5ozkmd7","orderId":null,"metadata":"{}","createdAt":"2026-03-23T00:00:00.000Z"},{"id":"cmt0qdqvw2z1nfut964xp","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllp9wzeg4z1bfo","orderId":null,"metadata":"{}","createdAt":"2026-07-03T00:00:00.000Z"},{"id":"cmt0qdqvwoldqwf77prdx","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll2bwn6ftok4xc","orderId":null,"metadata":"{}","createdAt":"2025-12-23T00:00:00.000Z"},{"id":"cmt0qdqvwlkosep6ryh91","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll5rifwkf0zg3w","orderId":null,"metadata":"{}","createdAt":"2026-08-01T00:00:00.000Z"},{"id":"cmt0qdqvwq356xvaxgcb2","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll13opfvuh1jcl","orderId":null,"metadata":"{}","createdAt":"2026-03-15T00:00:00.000Z"},{"id":"cmt0qdqvwr1gq5gqwnh6i","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllsv7zb45zam8a","orderId":null,"metadata":"{}","createdAt":"2026-07-21T00:00:00.000Z"},{"id":"cmt0qdqvwqd9xctk1ygyy","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllvwf9ei0412xi","orderId":null,"metadata":"{}","createdAt":"2025-12-22T00:00:00.000Z"},{"id":"cmt0qdqvwopjbu50tjn02","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqll487oiailgxkk","orderId":null,"metadata":"{}","createdAt":"2026-02-01T00:00:00.000Z"},{"id":"cmt0qdqvwv5el6nkieve5","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsuf0nefqwwc","orderId":null,"metadata":"{}","createdAt":"2026-05-28T00:00:00.000Z"},{"id":"cmt0qdqvwav700ix1w678","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllpzsytuapua13","orderId":null,"metadata":"{}","createdAt":"2026-04-11T00:00:00.000Z"},{"id":"cmt0qdqvw5rbvk79bjtwe","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllc77z69w24v9k","orderId":null,"metadata":"{}","createdAt":"2026-04-23T00:00:00.000Z"},{"id":"cmt0qdqvwkv844jlu0dgj","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllkqyakk3icgly","orderId":null,"metadata":"{}","createdAt":"2026-04-28T00:00:00.000Z"},{"id":"cmt0qdqvwn0k0d5fcjsxp","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllkq8walybay7h","orderId":null,"metadata":"{}","createdAt":"2025-09-03T00:00:00.000Z"},{"id":"cmt0qdqvwtjybepied9f7","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllxpxik5ozkmd7","orderId":null,"metadata":"{}","createdAt":"2026-05-17T00:00:00.000Z"},{"id":"cmt0qdqvw26p1qggrylol","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllt6xvmzyvl61x","orderId":null,"metadata":"{}","createdAt":"2026-07-11T00:00:00.000Z"},{"id":"cmt0qdqvwvaqm0mbuxlqj","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllt6xvmzyvl61x","orderId":null,"metadata":"{}","createdAt":"2026-04-04T00:00:00.000Z"},{"id":"cmt0qdqvwkingu1oufbwh","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqllnsuf0nefqwwc","orderId":null,"metadata":"{}","createdAt":"2026-03-07T00:00:00.000Z"},{"id":"cmt0qdqvwv5xrleqiw3t0","type":"VEHICLE_VIEWED","userId":null,"vehicleId":"cmt0qdqlldwsb5m0t1ycl","orderId":null,"metadata":"{}","createdAt":"2026-01-02T00:00:00.000Z"},{"id":"cmt0qdqvwbc50gyf5klmi","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll487oiailgxkk","orderId":null,"metadata":"{}","createdAt":"2026-06-27T00:00:00.000Z"},{"id":"cmt0qdqvwbqxtjay0zg6o","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll9ue5cvicxuye","orderId":null,"metadata":"{}","createdAt":"2025-10-26T00:00:00.000Z"},{"id":"cmt0qdqvw02zz4cqud9me","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll30ygttzphb9y","orderId":null,"metadata":"{}","createdAt":"2026-07-01T00:00:00.000Z"},{"id":"cmt0qdqvw25jnexhkech4","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll3ve76a67n6ep","orderId":null,"metadata":"{}","createdAt":"2026-07-12T00:00:00.000Z"},{"id":"cmt0qdqvw91b4cflhrakw","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllz2wgy0oqo2oa","orderId":null,"metadata":"{}","createdAt":"2026-04-07T00:00:00.000Z"},{"id":"cmt0qdqvwv3efqg6pnmyk","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllmswqrol0tf10","orderId":null,"metadata":"{}","createdAt":"2026-05-02T00:00:00.000Z"},{"id":"cmt0qdqvwere5kqfeth6j","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll540tf1hrsfet","orderId":null,"metadata":"{}","createdAt":"2026-02-20T00:00:00.000Z"},{"id":"cmt0qdqvwhre2dd0konae","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllgcesd7m8pb99","orderId":null,"metadata":"{}","createdAt":"2026-04-03T00:00:00.000Z"},{"id":"cmt0qdqvwcgjfcmchqe0t","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqlltjkv7j7szyv8","orderId":null,"metadata":"{}","createdAt":"2026-05-14T00:00:00.000Z"},{"id":"cmt0qdqvwwcxwfkdtvz1k","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllsv7zb45zam8a","orderId":null,"metadata":"{}","createdAt":"2026-08-26T00:00:00.000Z"},{"id":"cmt0qdqvwe3rti26od8y9","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllkqyakk3icgly","orderId":null,"metadata":"{}","createdAt":"2026-03-09T00:00:00.000Z"},{"id":"cmt0qdqvw80sk51jmu5aq","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllhu7g1xgr1r8n","orderId":null,"metadata":"{}","createdAt":"2025-10-16T00:00:00.000Z"},{"id":"cmt0qdqvwbb509xq83f79","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllwn0cryike8jz","orderId":null,"metadata":"{}","createdAt":"2026-03-18T00:00:00.000Z"},{"id":"cmt0qdqvwgq4w7hy1llxm","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllj5cpvvcn941o","orderId":null,"metadata":"{}","createdAt":"2026-07-06T00:00:00.000Z"},{"id":"cmt0qdqvwk52ixiicbzqp","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll1f81zp3qy5qy","orderId":null,"metadata":"{}","createdAt":"2026-03-04T00:00:00.000Z"},{"id":"cmt0qdqvwqp0n36cwpuew","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllj5cpvvcn941o","orderId":null,"metadata":"{}","createdAt":"2026-06-21T00:00:00.000Z"},{"id":"cmt0qdqvwebd90k2vhtbe","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqlly5fbkg1hesoh","orderId":null,"metadata":"{}","createdAt":"2026-06-20T00:00:00.000Z"},{"id":"cmt0qdqvwikahs9l9o33o","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll5ialt221d6tr","orderId":null,"metadata":"{}","createdAt":"2026-05-06T00:00:00.000Z"},{"id":"cmt0qdqvwqmbsq8p6b94i","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllj027yfg5nysk","orderId":null,"metadata":"{}","createdAt":"2026-04-21T00:00:00.000Z"},{"id":"cmt0qdqvwo6o8qrb62q2t","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllt6xvmzyvl61x","orderId":null,"metadata":"{}","createdAt":"2026-03-12T00:00:00.000Z"},{"id":"cmt0qdqvwskgf7p5odbzc","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll1wsttcurr3xp","orderId":null,"metadata":"{}","createdAt":"2026-04-20T00:00:00.000Z"},{"id":"cmt0qdqvw57fhid9jqf5b","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllavm2uu5yn02u","orderId":null,"metadata":"{}","createdAt":"2026-08-28T00:00:00.000Z"},{"id":"cmt0qdqvwdroijt39pgpj","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllguini4zfkpva","orderId":null,"metadata":"{}","createdAt":"2026-05-18T00:00:00.000Z"},{"id":"cmt0qdqvwsrmpmooj1fls","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllx6gfwasn3pn2","orderId":null,"metadata":"{}","createdAt":"2026-04-13T00:00:00.000Z"},{"id":"cmt0qdqvwgj3ztwgk6fd1","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll3x9prywr65hj","orderId":null,"metadata":"{}","createdAt":"2026-06-20T00:00:00.000Z"},{"id":"cmt0qdqvwcytbyjmfcc4l","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqlli3v096iy3swt","orderId":null,"metadata":"{}","createdAt":"2026-06-20T00:00:00.000Z"},{"id":"cmt0qdqvw7iboe1eejt1g","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll2pksjx4wysfr","orderId":null,"metadata":"{}","createdAt":"2026-08-01T00:00:00.000Z"},{"id":"cmt0qdqvw7ea452dpjffw","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll5ialt221d6tr","orderId":null,"metadata":"{}","createdAt":"2026-01-24T00:00:00.000Z"},{"id":"cmt0qdqvwq2iro3kgdqbv","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllavm2uu5yn02u","orderId":null,"metadata":"{}","createdAt":"2026-05-02T00:00:00.000Z"},{"id":"cmt0qdqvwzacfiyckou3y","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqlle71g9qkopgya","orderId":null,"metadata":"{}","createdAt":"2026-06-23T00:00:00.000Z"},{"id":"cmt0qdqvwymjq9f8vxd9m","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllgcesd7m8pb99","orderId":null,"metadata":"{}","createdAt":"2026-03-07T00:00:00.000Z"},{"id":"cmt0qdqvw4u658gdsl1fx","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll2pksjx4wysfr","orderId":null,"metadata":"{}","createdAt":"2026-02-01T00:00:00.000Z"},{"id":"cmt0qdqvwa7dhlnm7dgny","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll7cbu09ra8cd3","orderId":null,"metadata":"{}","createdAt":"2025-10-05T00:00:00.000Z"},{"id":"cmt0qdqvwoym69gegip8p","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllgcesd7m8pb99","orderId":null,"metadata":"{}","createdAt":"2026-03-10T00:00:00.000Z"},{"id":"cmt0qdqvwhphdhe5shoba","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll3ve76a67n6ep","orderId":null,"metadata":"{}","createdAt":"2026-02-07T00:00:00.000Z"},{"id":"cmt0qdqvwg08063elz58w","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllnsuf0nefqwwc","orderId":null,"metadata":"{}","createdAt":"2026-05-26T00:00:00.000Z"},{"id":"cmt0qdqvwtikuo7gf8xa8","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllchb2ia0v2ck9","orderId":null,"metadata":"{}","createdAt":"2026-07-28T00:00:00.000Z"},{"id":"cmt0qdqvwyo9rup0kbwse","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqll1wsttcurr3xp","orderId":null,"metadata":"{}","createdAt":"2026-02-22T00:00:00.000Z"},{"id":"cmt0qdqvw64q157p344mf","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllzm6sq5k2utnq","orderId":null,"metadata":"{}","createdAt":"2026-04-18T00:00:00.000Z"},{"id":"cmt0qdqvwjtdmwt9g2wft","type":"CART_ADDED","userId":null,"vehicleId":"cmt0qdqllrpkzjbqgocmg","orderId":null,"metadata":"{}","createdAt":"2026-06-17T00:00:00.000Z"}]};

/* ---- format.js ---- */
/** Formatting helpers — port of src/lib/format.ts. */
function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(precio)
}
function formatearNumero(n) {
  return new Intl.NumberFormat("es-ES").format(n)
}
function formatFecha(iso, opciones = { day: "numeric", month: "long", year: "numeric" }) {
  try {
    return new Date(iso).toLocaleDateString("es-ES", opciones)
  } catch {
    return iso
  }
}

/* ---- ui.js ---- */
/**
 * UI primitives: escapeHtml, progressive SmartImage, reveal-on-scroll and
 * scroll parallax helpers (replacing framer-motion).
 */
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Progressive image with skeleton shimmer + blur-up fade-in.
 * Replaces the SmartImage component. `el` receives the markup; the inner
 * image fades in once loaded (min 350ms skeleton, como el original).
 */
function smartImageMarkup({ src, alt, className = "h-full w-full object-cover", containerClassName = "h-full w-full", priority = false, hoverScale }) {
  const zoomCls = hoverScale ? "group-hover/smartimg:scale-[var(--hover-scale)]" : ""
  return `
    <div class="relative overflow-hidden bg-secondary ${containerClassName}">
      <div class="smartimg-skeleton absolute inset-0 animate-pulse bg-gradient-to-br from-secondary via-accent/40 to-secondary"></div>
      <img src="${escapeHtml(assetPath(src))}" alt="${escapeHtml(alt)}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'}
           class="smartimg-img ${className} opacity-0 transition-[opacity,transform,filter] duration-700 ${hoverScale ? "group-hover/smartimg:scale-[--hover-scale]" : ""}"
           style="${hoverScale ? `--hover-scale: ${hoverScale}` : ""}" />
      <div class="smartimg-error hidden h-full w-full items-center justify-center bg-secondary">
        <span class="text-xs text-muted-foreground">Sin imagen</span>
      </div>
    </div>`
}

/** Wire a rendered smart-image container (call after innerHTML injection). */
function hydrateSmartImages(root = document) {
  root.querySelectorAll("img.smartimg-img").forEach((img) => {
    if (img.dataset.hydrated) return
    img.dataset.hydrated = "1"
    const skeleton = img.closest(".relative")?.querySelector(".smartimg-skeleton")
    const done = () => {
      img.classList.remove("opacity-0")
      if (skeleton) skeleton.remove()
    }
    const fail = () => {
      const err = img.closest(".relative")?.querySelector(".smartimg-error")
      if (skeleton) skeleton.remove()
      img.remove()
      if (err) { err.classList.remove("hidden"); err.classList.add("flex") }
    }
    if (img.complete && img.naturalWidth > 0) { done(); return }
    img.addEventListener("load", () => setTimeout(done, 50))
    img.addEventListener("error", fail)
  })
}

// --- Reveal on scroll --------------------------------------------------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible")
        revealObserver.unobserve(e.target)
      }
    })
  },
  { threshold: 0.15 }
)
function hydrateReveals(root = document) {
  root.querySelectorAll(".reveal").forEach((el) => {
    if (el.dataset.revealed) return
    el.dataset.revealed = "1"
    revealObserver.observe(el)
  })
}

// --- Parallax (hero/showcase) -------------------------------------------------
/**
 * Simple parallax: elements with [data-parallax] move slower than the scroll.
 * data-parallax="40" means max ±40px translate.
 */
function initParallax() {
  const els = [...document.querySelectorAll("[data-parallax]")]
  if (!els.length) return
  const onScroll = () => {
    for (const el of els) {
      const range = Number(el.dataset.parallax) || 80
      const rect = el.parentElement.getBoundingClientRect()
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      const clamped = Math.min(1, Math.max(0, progress))
      el.style.transform = `translateY(${(clamped - 0.5) * 2 * range}px)`
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
}


/* ---- icons.js ---- */
/** Lucide icons (ISC license) as inline SVG content — replaces lucide-react. */
const ICONS = {
  "Gauge": "<path d=\"m12 14 4-4\" />\n  <path d=\"M3.34 19a10 10 0 1 1 17.32 0\" />",
  "Store": "<path d=\"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5\" />\n  <path d=\"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244\" />\n  <path d=\"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05\" />",
  "CarFront": "<path d=\"m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8\" />\n  <path d=\"M7 14h.01\" />\n  <path d=\"M17 14h.01\" />\n  <rect width=\"18\" height=\"8\" x=\"3\" y=\"10\" rx=\"2\" />\n  <path d=\"M5 18v2\" />\n  <path d=\"M19 18v2\" />",
  "Home": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" />\n  <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  "ShoppingCart": "<circle cx=\"8\" cy=\"21\" r=\"1\" />\n  <circle cx=\"19\" cy=\"21\" r=\"1\" />\n  <path d=\"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12\" />",
  "Heart": "<path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\" />",
  "GitCompareArrows": "<circle cx=\"5\" cy=\"6\" r=\"3\" />\n  <path d=\"M12 6h5a2 2 0 0 1 2 2v7\" />\n  <path d=\"m15 9-3-3 3-3\" />\n  <circle cx=\"19\" cy=\"18\" r=\"3\" />\n  <path d=\"M12 18H7a2 2 0 0 1-2-2V9\" />\n  <path d=\"m9 15 3 3-3 3\" />",
  "Building2": "<path d=\"M10 12h4\" />\n  <path d=\"M10 8h4\" />\n  <path d=\"M14 21v-3a2 2 0 0 0-4 0v3\" />\n  <path d=\"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2\" />\n  <path d=\"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16\" />",
  "Menu": "<path d=\"M4 5h16\" />\n  <path d=\"M4 12h16\" />\n  <path d=\"M4 19h16\" />",
  "Shield": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" />",
  "User": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" />\n  <circle cx=\"12\" cy=\"7\" r=\"4\" />",
  "LogOut": "<path d=\"m16 17 5-5-5-5\" />\n  <path d=\"M21 12H9\" />\n  <path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" />",
  "Receipt": "<path d=\"M12 17V7\" />\n  <path d=\"M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8\" />\n  <path d=\"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z\" />",
  "ArrowRight": "<path d=\"M5 12h14\" />\n  <path d=\"m12 5 7 7-7 7\" />",
  "ArrowLeft": "<path d=\"m12 19-7-7 7-7\" />\n  <path d=\"M19 12H5\" />",
  "ArrowUpRight": "<path d=\"M7 7h10v10\" />\n  <path d=\"M7 17 17 7\" />",
  "ChevronDown": "<path d=\"m6 9 6 6 6-6\" />",
  "ChevronRight": "<path d=\"m9 18 6-6-6-6\" />",
  "Search": "<path d=\"m21 21-4.34-4.34\" />\n  <circle cx=\"11\" cy=\"11\" r=\"8\" />",
  "SlidersHorizontal": "<path d=\"M10 5H3\" />\n  <path d=\"M12 19H3\" />\n  <path d=\"M14 3v4\" />\n  <path d=\"M16 17v4\" />\n  <path d=\"M21 12h-9\" />\n  <path d=\"M21 19h-5\" />\n  <path d=\"M21 5h-7\" />\n  <path d=\"M8 10v4\" />\n  <path d=\"M8 12H3\" />",
  "X": "<path d=\"M18 6 6 18\" />\n  <path d=\"m6 6 12 12\" />",
  "Zap": "<path d=\"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z\" />",
  "Check": "<path d=\"M20 6 9 17l-5-5\" />",
  "BadgeCheck": "<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\" />\n  <path d=\"m9 12 2 2 4-4\" />",
  "Battery": "<path d=\"M 22 14 L 22 10\" />\n  <rect x=\"2\" y=\"6\" width=\"16\" height=\"12\" rx=\"2\" />",
  "Flame": "<path d=\"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4\" />",
  "Crown": "<path d=\"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z\" />\n  <path d=\"M5 21h14\" />",
  "Ban": "<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <path d=\"M4.929 4.929 19.07 19.071\" />",
  "Cookie": "<path d=\"M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5\" />\n  <path d=\"M8.5 8.5v.01\" />\n  <path d=\"M16 15.5v.01\" />\n  <path d=\"M12 12v.01\" />\n  <path d=\"M11 17v.01\" />\n  <path d=\"M7 14v.01\" />",
  "Palette": "<path d=\"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z\" />\n  <circle cx=\"13.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\" />\n  <circle cx=\"17.5\" cy=\"10.5\" r=\".5\" fill=\"currentColor\" />\n  <circle cx=\"6.5\" cy=\"12.5\" r=\".5\" fill=\"currentColor\" />\n  <circle cx=\"8.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />",
  "Star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />",
  "Loader2": "<path d=\"M21 12a9 9 0 1 1-6.219-8.56\" />",
  "AlertCircle": "<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\" />\n  <line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\" />",
  "MessageSquare": "<path d=\"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z\" />",
  "PenLine": "<path d=\"M13 21h8\" />\n  <path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" />",
  "LogIn": "<path d=\"m10 17 5-5-5-5\" />\n  <path d=\"M15 12H3\" />\n  <path d=\"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4\" />",
  "Trash2": "<path d=\"M10 11v6\" />\n  <path d=\"M14 11v6\" />\n  <path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\" />\n  <path d=\"M3 6h18\" />\n  <path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\" />",
  "ShoppingBag": "<path d=\"M16 10a4 4 0 0 1-8 0\" />\n  <path d=\"M3.103 6.034h17.794\" />\n  <path d=\"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z\" />",
  "Award": "<path d=\"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526\" />\n  <circle cx=\"12\" cy=\"8\" r=\"6\" />",
  "ShieldCheck": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" />\n  <path d=\"m9 12 2 2 4-4\" />",
  "Calculator": "<rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\" />\n  <line x1=\"8\" x2=\"16\" y1=\"6\" y2=\"6\" />\n  <line x1=\"16\" x2=\"16\" y1=\"14\" y2=\"18\" />\n  <path d=\"M16 10h.01\" />\n  <path d=\"M12 10h.01\" />\n  <path d=\"M8 10h.01\" />\n  <path d=\"M12 14h.01\" />\n  <path d=\"M8 14h.01\" />\n  <path d=\"M12 18h.01\" />\n  <path d=\"M8 18h.01\" />",
  "TrendingUp": "<path d=\"M16 7h6v6\" />\n  <path d=\"m22 7-8.5 8.5-5-5L2 17\" />",
  "TrendingDown": "<path d=\"M16 17h6v-6\" />\n  <path d=\"m22 17-8.5-8.5-5 5L2 7\" />",
  "Wallet": "<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\" />\n  <path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\" />",
  "Cog": "<path d=\"M11 10.27 7 3.34\" />\n  <path d=\"m11 13.73-4 6.93\" />\n  <path d=\"M12 22v-2\" />\n  <path d=\"M12 2v2\" />\n  <path d=\"M14 12h8\" />\n  <path d=\"m17 20.66-1-1.73\" />\n  <path d=\"m17 3.34-1 1.73\" />\n  <path d=\"M2 12h2\" />\n  <path d=\"m20.66 17-1.73-1\" />\n  <path d=\"m20.66 7-1.73 1\" />\n  <path d=\"m3.34 17 1.73-1\" />\n  <path d=\"m3.34 7 1.73 1\" />\n  <circle cx=\"12\" cy=\"12\" r=\"2\" />\n  <circle cx=\"12\" cy=\"12\" r=\"8\" />",
  "Fuel": "<path d=\"M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5\" />\n  <path d=\"M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16\" />\n  <path d=\"M2 21h13\" />\n  <path d=\"M3 9h11\" />",
  "Calendar": "<path d=\"M8 2v3\" />\n  <path d=\"M16 2v3\" />\n  <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" />\n  <path d=\"M3 9h18\" />",
  "Rocket": "<path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\" />\n  <path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09\" />\n  <path d=\"M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z\" />\n  <path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05\" />",
  "Wind": "<path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\" />\n  <path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\" />\n  <path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\" />",
  "Timer": "<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\" />\n  <line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\" />\n  <circle cx=\"12\" cy=\"14\" r=\"8\" />",
  "CheckCircle2": "<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <path d=\"m9 12 2 2 4-4\" />",
  "Sparkles": "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\" />\n  <path d=\"M20 2v4\" />\n  <path d=\"M22 4h-4\" />\n  <circle cx=\"4\" cy=\"20\" r=\"2\" />",
  "Lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" />\n  <path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
  "CreditCard": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\" />\n  <line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\" />",
  "Mail": "<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\" />\n  <rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" />",
  "Phone": "<path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\" />",
  "Eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" />\n  <circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "EyeOff": "<path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\" />\n  <path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\" />\n  <path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\" />\n  <path d=\"m2 2 20 20\" />",
  "Car": "<path d=\"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2\" />\n  <circle cx=\"7\" cy=\"17\" r=\"2\" />\n  <path d=\"M9 17h6\" />\n  <circle cx=\"17\" cy=\"17\" r=\"2\" />",
  "Users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" />\n  <path d=\"M16 3.128a4 4 0 0 1 0 7.744\" />\n  <path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" />\n  <circle cx=\"9\" cy=\"7\" r=\"4\" />",
  "DollarSign": "<line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"22\" />\n  <path d=\"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\" />",
  "Target": "<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <circle cx=\"12\" cy=\"12\" r=\"6\" />\n  <circle cx=\"12\" cy=\"12\" r=\"2\" />",
  "Clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <path d=\"M12 6v6l4 2\" />",
  "Trophy": "<path d=\"M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2\" />\n  <path d=\"M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2\" />\n  <path d=\"M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3\" />\n  <path d=\"M4 22h16\" />\n  <path d=\"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z\" />\n  <path d=\"M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3\" />",
  "LayoutDashboard": "<rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\" />\n  <rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\" />\n  <rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\" />\n  <rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\" />",
  "Package": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\" />\n  <path d=\"M12 22V12\" />\n  <polyline points=\"3.29 7 12 12 20.71 7\" />\n  <path d=\"m7.5 4.27 9 5.15\" />",
  "CalendarDays": "<path d=\"M8 2v3\" />\n  <path d=\"M16 2v3\" />\n  <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" />\n  <path d=\"M3 9h18\" />\n  <path d=\"M8 13h.01\" />\n  <path d=\"M12 13h.01\" />\n  <path d=\"M16 13h.01\" />\n  <path d=\"M8 17h.01\" />\n  <path d=\"M12 17h.01\" />\n  <path d=\"M16 17h.01\" />",
  "Compass": "<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <path d=\"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z\" />",
  "Plus": "<path d=\"M5 12h14\" />\n  <path d=\"M12 5v14\" />",
  "Headset": "<path d=\"M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z\" />\n  <path d=\"M21 16v2a4 4 0 0 1-4 4h-5\" />"
};
function icon(name, cls = "h-4 w-4", strokeWidth = 2) {
  const body = ICONS[name] || "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${body}</svg>`;
}

/* ---- toast.js ---- */
/**
 * Toast notifications — replaces the shadcn/ui toaster (radix) with a small
 * DOM-based equivalent. Same look: bottom-right on desktop, top on mobile,
 * one toast at a time (TOAST_LIMIT = 1 como en el original).
 */
let container = null

function getContainer() {
  if (container) return container
  container = document.createElement("div")
  container.className =
    "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] pointer-events-none"
  document.body.appendChild(container)
  return container
}
function toast({ title, description }) {
  const el = document.createElement("div")
  el.className =
    "toast-enter pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg bg-background text-foreground"
  el.innerHTML = `
    <div class="grid gap-1">
      ${title ? `<div class="text-sm font-semibold [&+div]:text-xs"></div>` : ""}
      ${description ? `<div class="text-sm opacity-90"></div>` : ""}
    </div>
    <button type="button" class="toast-close absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none" aria-label="Cerrar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>`
  const [titleEl, descEl] = el.querySelectorAll(".grid > div")
  if (titleEl) titleEl.textContent = title
  if (descEl) descEl.textContent = description

  const box = getContainer()
  box.innerHTML = "" // TOAST_LIMIT = 1
  box.appendChild(el)

  const dismiss = () => {
    el.classList.add("toast-exit")
    setTimeout(() => el.remove(), 260)
  }
  el.querySelector(".toast-close").addEventListener("click", dismiss)
  setTimeout(dismiss, 4500)
}

/* ---- store.js ---- */
/**
 * Client-side store — port of the Zustand stores (src/store/use-store.ts and
 * src/store/use-tema.ts) using localStorage + a tiny pub/sub.
 * Persistent marketplace data lives in SQLite; this store only holds
 * cart/compare/recents/sort + guest favorites + theme preference.
 */
const MAX_COMPARAR = 3
const MAX_RECIENTES = 8
const STORE_KEY = "digital-marketplace-tienda"
const THEME_KEY = "digital-marketplace-tema"

// --- Temas (mismos 6 temas del original) ------------------------------------
const temas = [
  {
    id: "midnight", nombre: "Midnight", descripcion: "Noche profunda con acento champán", muestra: "#d4a857",
    variables: {
      "--background": "oklch(0.12 0.004 75)", "--foreground": "oklch(0.98 0.002 75)",
      "--card": "oklch(0.165 0.005 75)", "--popover": "oklch(0.17 0.005 75)",
      "--primary": "oklch(0.98 0.002 75)", "--primary-foreground": "oklch(0.12 0.004 75)",
      "--secondary": "oklch(0.215 0.005 75)", "--muted": "oklch(0.2 0.005 75)",
      "--muted-foreground": "oklch(0.64 0.012 75)", "--accent": "oklch(0.245 0.006 75)",
      "--border": "oklch(1 0 0 / 8%)", "--input": "oklch(1 0 0 / 12%)",
      "--ring": "oklch(0.98 0 0 / 35%)", "--signature": "oklch(0.85 0.09 80)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
  {
    id: "arctic", nombre: "Arctic", descripcion: "Azul hielo con luz de glaciar", muestra: "#60a5fa",
    variables: {
      "--background": "oklch(0.13 0.006 240)", "--foreground": "oklch(0.98 0.003 240)",
      "--card": "oklch(0.17 0.008 240)", "--popover": "oklch(0.18 0.008 240)",
      "--primary": "oklch(0.97 0.01 240)", "--primary-foreground": "oklch(0.13 0.006 240)",
      "--secondary": "oklch(0.22 0.008 240)", "--muted": "oklch(0.2 0.008 240)",
      "--muted-foreground": "oklch(0.66 0.015 240)", "--accent": "oklch(0.25 0.01 240)",
      "--border": "oklch(1 0 0 / 8%)", "--input": "oklch(1 0 0 / 12%)",
      "--ring": "oklch(0.7 0.12 240 / 40%)", "--signature": "oklch(0.72 0.12 220)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
  {
    id: "emerald", nombre: "Emerald", descripcion: "Verde esmeralda sofisticado", muestra: "#34d399",
    variables: {
      "--background": "oklch(0.12 0.006 160)", "--foreground": "oklch(0.98 0.003 160)",
      "--card": "oklch(0.165 0.008 160)", "--popover": "oklch(0.17 0.008 160)",
      "--primary": "oklch(0.97 0.01 160)", "--primary-foreground": "oklch(0.12 0.006 160)",
      "--secondary": "oklch(0.215 0.008 160)", "--muted": "oklch(0.2 0.008 160)",
      "--muted-foreground": "oklch(0.65 0.015 160)", "--accent": "oklch(0.245 0.01 160)",
      "--border": "oklch(1 0 0 / 8%)", "--input": "oklch(1 0 0 / 12%)",
      "--ring": "oklch(0.72 0.16 155 / 40%)", "--signature": "oklch(0.75 0.15 155)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
  {
    id: "crimson", nombre: "Crimson", descripcion: "Rojo intenso pasional y audaz", muestra: "#ef4444",
    variables: {
      "--background": "oklch(0.13 0.008 25)", "--foreground": "oklch(0.98 0.003 25)",
      "--card": "oklch(0.17 0.01 25)", "--popover": "oklch(0.18 0.01 25)",
      "--primary": "oklch(0.97 0.01 25)", "--primary-foreground": "oklch(0.13 0.008 25)",
      "--secondary": "oklch(0.22 0.01 25)", "--muted": "oklch(0.2 0.01 25)",
      "--muted-foreground": "oklch(0.66 0.018 25)", "--accent": "oklch(0.25 0.012 25)",
      "--border": "oklch(1 0 0 / 8%)", "--input": "oklch(1 0 0 / 12%)",
      "--ring": "oklch(0.62 0.22 25 / 40%)", "--signature": "oklch(0.65 0.22 25)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
  {
    id: "royal", nombre: "Royal", descripcion: "Púrpura regio y elegante", muestra: "#a78bfa",
    variables: {
      "--background": "oklch(0.13 0.008 290)", "--foreground": "oklch(0.98 0.003 290)",
      "--card": "oklch(0.17 0.01 290)", "--popover": "oklch(0.18 0.01 290)",
      "--primary": "oklch(0.97 0.01 290)", "--primary-foreground": "oklch(0.13 0.008 290)",
      "--secondary": "oklch(0.22 0.01 290)", "--muted": "oklch(0.2 0.01 290)",
      "--muted-foreground": "oklch(0.66 0.018 290)", "--accent": "oklch(0.25 0.012 290)",
      "--border": "oklch(1 0 0 / 8%)", "--input": "oklch(1 0 0 / 12%)",
      "--ring": "oklch(0.6 0.2 290 / 40%)", "--signature": "oklch(0.68 0.18 290)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
  {
    id: "carbon", nombre: "Carbon", descripcion: "Grafito neutro industrial", muestra: "#94a3b8",
    variables: {
      "--background": "oklch(0.11 0.002 250)", "--foreground": "oklch(0.96 0.002 250)",
      "--card": "oklch(0.155 0.003 250)", "--popover": "oklch(0.165 0.003 250)",
      "--primary": "oklch(0.96 0.002 250)", "--primary-foreground": "oklch(0.11 0.002 250)",
      "--secondary": "oklch(0.205 0.003 250)", "--muted": "oklch(0.19 0.003 250)",
      "--muted-foreground": "oklch(0.6 0.005 250)", "--accent": "oklch(0.235 0.004 250)",
      "--border": "oklch(1 0 0 / 7%)", "--input": "oklch(1 0 0 / 11%)",
      "--ring": "oklch(0.96 0 0 / 30%)", "--signature": "oklch(0.7 0.015 250)",
      "--success": "oklch(0.72 0.16 155)",
    },
  },
]

// --- Estado + pub/sub --------------------------------------------------------
const listeners = new Set()
let state = {
  carrito: [],
  garaje: [],
  favoritos: [],
  comparar: [],
  recientes: [],
  ordenamiento: "relevancia",
  temaActivo: "midnight",
}

function hydrateState() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Zustand persist guarda { state: {...} }; admite también formato plano.
      const s = parsed?.state ?? parsed ?? {}
      Object.assign(state, {
        carrito: Array.isArray(s.carrito) ? s.carrito : [],
        garaje: Array.isArray(s.garaje) ? s.garaje : [],
        favoritos: Array.isArray(s.favoritos) ? s.favoritos : [],
        comparar: Array.isArray(s.comparar) ? s.comparar : [],
        recientes: Array.isArray(s.recientes) ? s.recientes : [],
        ordenamiento: typeof s.ordenamiento === "string" ? s.ordenamiento : "relevancia",
      })
    }
    const temaRaw = localStorage.getItem(THEME_KEY)
    if (temaRaw) {
      const t = JSON.parse(temaRaw)?.state?.temaActivo ?? JSON.parse(temaRaw)?.temaActivo
      if (temas.some((x) => x.id === t)) state.temaActivo = t
    }
  } catch {
    /* localStorage bloqueado → valores por defecto */
  }
}
hydrateState()

function persist() {
  try {
    const payload = { state: { ...state, temaActivo: undefined } }
    localStorage.setItem(STORE_KEY, JSON.stringify(payload))
    localStorage.setItem(THEME_KEY, JSON.stringify({ state: { temaActivo: state.temaActivo } }))
  } catch (e) {
    window.__persistErrors = window.__persistErrors || []
    window.__persistErrors.push(String(e && e.message || e))
  }
}

function emit() {
  persist()
  listeners.forEach((fn) => {
    try { fn(state) } catch (e) { window.__emitErr = (window.__emitErr || []).concat(String(e && e.message || e)) }
  })
}
const tienda = {
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  get() {
    return state
  },

  // Carrito
  agregarAlCarrito(id, disponible = true) {
    if (!disponible || state.carrito.includes(id)) return false
    state = { ...state, carrito: [...state.carrito, id] }
    emit()
    return true
  },
  quitarDelCarrito(id) {
    state = { ...state, carrito: state.carrito.filter((v) => v !== id) }
    emit()
  },
  estaEnCarrito(id) { return state.carrito.includes(id) },
  vaciarCarrito() {
    state = { ...state, carrito: [] }
    emit()
  },

  // Garaje (comprados) — se sincroniza desde pedidos cuando hay sesión
  estaComprado(id) { return state.garaje.includes(id) },
  finalizarCompra() {
    if (state.carrito.length === 0) return
    const nuevos = state.carrito.filter((id) => !state.garaje.includes(id))
    state = { ...state, garaje: [...state.garaje, ...nuevos], carrito: [] }
    emit()
  },
  setGaraje(ids) {
    state = { ...state, garaje: Array.from(new Set(ids)) }
    emit()
  },

  // Favoritos
  toggleFavorito(id) {
    state = {
      ...state,
      favoritos: state.favoritos.includes(id)
        ? state.favoritos.filter((v) => v !== id)
        : [...state.favoritos, id],
    }
    emit()
  },
  esFavorito(id) { return state.favoritos.includes(id) },
  setFavoritos(ids) {
    state = { ...state, favoritos: Array.from(new Set(ids)) }
    emit()
  },

  // Comparador
  toggleComparar(id) {
    const actual = state.comparar
    if (actual.includes(id)) {
      state = { ...state, comparar: actual.filter((v) => v !== id) }
    } else if (actual.length < MAX_COMPARAR) {
      state = { ...state, comparar: [...actual, id] }
    }
    emit()
  },
  estaEnComparador(id) { return state.comparar.includes(id) },
  vaciarComparador() {
    state = { ...state, comparar: [] }
    emit()
  },

  // Vistos recientemente
  marcarVisto(id) {
    const actual = state.recientes.filter((v) => v !== id)
    state = { ...state, recientes: [id, ...actual].slice(0, MAX_RECIENTES) }
    emit()
  },

  // Ordenamiento
  setOrdenamiento(o) {
    state = { ...state, ordenamiento: o }
    emit()
  },

  // Tema
  setTema(id) {
    if (!temas.some((t) => t.id === id)) return
    state = { ...state, temaActivo: id }
    emit()
  },
}
function aplicarTema(temaId) {
  const tema = temas.find((t) => t.id === temaId) ?? temas[0]
  Object.entries(tema.variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })
}

/* ---- @@LOCAL_API@@ ---- */
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

/* ---- auth.js ---- */
/**
 * Auth state — port of src/lib/auth/auth-context.tsx + use-favorites-sync.ts.
 * Keeps the current session user in memory, syncs favorites with the DB
 * (guest favorites merge into the account on login) and hydrates the garage
 * from completed orders.
 */



const authListeners = new Set()
let currentUser = null
let authLoaded = false
let merged = false

function emitAuth() {
  authListeners.forEach((fn) => fn(currentUser))
}
const auth = {
  subscribe(fn) {
    authListeners.add(fn)
    return () => authListeners.delete(fn)
  },
  get user() { return currentUser },
  get loading() { return !authLoaded },
  get isAuthenticated() { return Boolean(currentUser) },
  get isAdmin() { return currentUser?.role === "ADMIN" },

  async refresh() {
    try {
      const data = await api.me()
      currentUser = data.user
    } catch {
      currentUser = null
    } finally {
      authLoaded = true
    }
    emitAuth()
    await syncAfterAuth()
    return currentUser
  },

  async login(email, password) {
    try {
      const data = await api.login(email, password)
      currentUser = data.user
      emitAuth()
      await syncAfterAuth()
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message || "Credenciales incorrectas" }
    }
  },

  async register(name, email, password) {
    try {
      const data = await api.register(name, email, password)
      currentUser = data.user
      emitAuth()
      await syncAfterAuth()
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message || "No se pudo registrar" }
    }
  },

  async logout() {
    try { await api.logout() } catch { /* ignore */ }
    currentUser = null
    merged = false
    emitAuth()
  },
}

/** Merge guest favorites into the DB and hydrate favorites + garage. */
async function syncAfterAuth() {
  if (!currentUser) return
  try {
    const res = await api.favoritos()
    const serverSet = new Set(res.favoritos)
    if (!merged) {
      merged = true
      const guestOnly = tienda.get().favoritos.filter((s) => !serverSet.has(s))
      if (guestOnly.length > 0) {
        const mergedRes = await api.mergeFavoritos(guestOnly)
        tienda.setFavoritos(mergedRes.favoritos)
      } else {
        tienda.setFavoritos(res.favoritos)
      }
    } else {
      tienda.setFavoritos(res.favoritos)
    }
  } catch {
    /* sin conexión — mantener estado local */
  }
  // Hidrata el garaje desde pedidos completados
  try {
    const { orders } = await api.pedidos()
    const comprados = []
    for (const o of orders) {
      if (o.status !== "COMPLETED") continue
      for (const it of o.items) comprados.push(it.vehicle.id)
    }
    tienda.setGaraje(comprados)
  } catch {
    /* ignore */
  }
}

/**
 * Toggle favorito con actualización optimista y sync con la API
 * (mismo comportamiento que useToggleFavorito del original).
 */
async function toggleFavorito(vehicleSlug) {
  const wasFav = tienda.esFavorito(vehicleSlug)
  tienda.toggleFavorito(vehicleSlug)
  if (!auth.isAuthenticated) return
  try {
    await api.toggleFavorito(vehicleSlug, wasFav ? "remove" : "add")
  } catch {
    tienda.toggleFavorito(vehicleSlug) // revertir
  }
}

// Carga inicial de sesión
const authReady = auth.refresh()

/* ---- vehicle-card.js ---- */
/**
 * Vehicle card — port of src/components/marketplace/vehicle-card.tsx (+ the
 * favorite/compare overlay buttons and the empty state).
 */
function estaDisponible(v) {
  return v.available !== false && (v.stock ?? 1) > 0
}

function obtenerEtiqueta(v) {
  if (v.combustible === "Eléctrico") return { texto: "Eléctrico", icono: "Battery", color: "text-[var(--chart-4)]" }
  if (v.categoria === "Superdeportivo") return { texto: "Superdeportivo", icono: "Flame", color: "text-[var(--signature)]" }
  if (v.precio > 200000) return { texto: "Edición exclusiva", icono: "Crown", color: "text-[var(--signature)]" }
  if (v.año >= 2024) return { texto: "Nuevo", icono: "Sparkle", color: "text-[var(--success)]" }
  return null
}

const SPARKLE_SVG = `<svg class="__CLS__" viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" /></svg>`

function iconoEtiqueta(etiqueta, cls) {
  if (etiqueta.icono === "Sparkle") {
    return SPARKLE_SVG.replace("__CLS__", `h-3 w-3 ${etiqueta.color}`)
  }
  return icon(etiqueta.icono, `h-3 w-3 ${etiqueta.color}`)
}
function vehicleCardMarkup(vehiculo, { etiquetaBoton = "Ver detalles", variante = "marketplace", index = 0 } = {}) {
  const s = tienda.get()
  const href = hrefFromApp(`/vehiculos/${vehiculo.id}`)
  const estaEnCarrito = tienda.estaEnCarrito(vehiculo.id)
  const estaComprado = tienda.estaComprado(vehiculo.id)
  const esFavorito = tienda.esFavorito(vehiculo.id)
  const enComparador = tienda.estaEnComparador(vehiculo.id)
  const disponible = estaDisponible(vehiculo)
  const nombreCompleto = `${vehiculo.marca} ${vehiculo.modelo}`
  const etiqueta = obtenerEtiqueta(vehiculo)

  let accionBoton
  if (!disponible) {
    accionBoton = `<span class="flex items-center gap-1.5">${icon("Ban", "h-4 w-4", 2.2)} Agotado</span>`
  } else if (estaComprado) {
    accionBoton = `<span class="flex items-center gap-1.5">${icon("BadgeCheck", "h-4 w-4", 2.3)} Comprado</span>`
  } else if (estaEnCarrito) {
    accionBoton = `<span class="flex items-center gap-1.5">${icon("Check", "h-4 w-4", 2.5)} En el carrito</span>`
  } else {
    accionBoton = `<span class="flex items-center gap-1.5">${icon("ShoppingCart", "h-4 w-4", 2.2)} Agregar al carrito</span>`
  }
  const botonClase = !disponible
    ? "cursor-not-allowed border-border/50 bg-secondary/40 text-muted-foreground"
    : estaComprado
      ? "cursor-default border-border/50 bg-secondary/50 text-muted-foreground"
      : estaEnCarrito
        ? "cursor-default border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
        : "border-border bg-secondary text-foreground hover:bg-accent"

  const acciones = (variante === "garaje" || variante === "favoritos")
    ? `<a href="${href}" class="group/btn mt-auto flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-semibold transition-all duration-300 hover:bg-accent">
        ${etiquetaBoton}${icon("ChevronRight", "h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5")}
      </a>`
    : `<div class="mt-auto flex flex-col gap-2.5 sm:flex-row">
        <button data-action="carrito" ${!disponible || estaEnCarrito || estaComprado ? "disabled" : ""}
          class="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${botonClase}">
          ${accionBoton}
        </button>
        <a href="${href}" class="group/btn flex flex-1 items-center justify-between gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          ${etiquetaBoton}${icon("ChevronRight", "h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5")}
        </a>
      </div>`

  return `
  <article class="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-all duration-500 ease-out hover:border-border/80 hover:bg-card/95 hover:shadow-card-hover" data-vehicle="${escapeHtml(vehiculo.id)}" data-nombre="${escapeHtml(nombreCompleto)}" style="--reveal-delay: ${Math.min(index * 0.04, 0.4)}s">
    <div class="relative block aspect-[16/10] w-full overflow-hidden bg-secondary">
      <a href="${href}" class="block h-full w-full" aria-label="Ver detalles del ${escapeHtml(nombreCompleto)}">
        ${smartImageMarkup({ src: vehiculo.imagenes[0] ?? "", alt: `${nombreCompleto} ${vehiculo.año}`, hoverScale: 1.04 })}
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-card/5 to-transparent"></div>
      </a>
      ${etiqueta
        ? `<span class="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-background/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide backdrop-blur-md">${iconoEtiqueta(etiqueta)} ${etiqueta.texto}</span>`
        : `<span class="pointer-events-none absolute left-3 top-3 rounded-lg bg-background/60 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-foreground backdrop-blur-md">${escapeHtml(vehiculo.marca)}</span>`}
      <div class="absolute right-3 top-3 flex items-center gap-1.5">
        <button data-action="comparar" class="flex items-center justify-center rounded-full transition-all duration-200 h-8 w-8 bg-background/60 text-foreground backdrop-blur-md hover:bg-background/80 sm:h-9 sm:w-9" aria-label="${enComparador ? `Quitar ${nombreCompleto} del comparador` : `Añadir ${nombreCompleto} al comparador`}">
          ${enComparador ? icon("Check", "h-3.5 w-3.5 text-[var(--success)] sm:h-4 sm:w-4", 2.5) : icon("GitCompareArrows", "h-3.5 w-3.5 sm:h-4 sm:w-4", 2)}
        </button>
        <button data-action="favorito" class="flex items-center justify-center rounded-full transition-all duration-200 h-8 w-8 bg-background/60 text-foreground backdrop-blur-md hover:bg-background/80 sm:h-9 sm:w-9" aria-label="${esFavorito ? `Quitar ${nombreCompleto} de favoritos` : `Añadir ${nombreCompleto} a favoritos`}">
          ${esFavorito ? icon("Heart", "h-3.5 w-3.5 fill-[var(--signature)] text-[var(--signature)] sm:h-4 sm:w-4", 2) : icon("Heart", "h-3.5 w-3.5 sm:h-4 sm:w-4", 2)}
        </button>
      </div>
      ${estaComprado ? `<span class="pointer-events-none absolute right-3 top-12 flex items-center gap-1 rounded-lg bg-[var(--success)]/15 px-2.5 py-1 text-[10px] font-semibold text-[var(--success)] backdrop-blur-md">${icon("BadgeCheck", "h-3 w-3", 2.5)} Comprado</span>` : ""}
      ${!disponible ? `<span class="pointer-events-none absolute inset-0 flex items-center justify-center"><span class="rounded-xl bg-background/85 px-4 py-2 text-sm font-bold uppercase tracking-wider text-muted-foreground shadow-lg backdrop-blur-md">Agotado</span></span>` : ""}
      <a href="${href}" class="absolute inset-x-0 bottom-0 p-4 text-left">
        <p class="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">${escapeHtml(vehiculo.marca)}</p>
        <h3 class="mt-0.5 text-lg font-semibold leading-tight text-foreground drop-shadow-sm sm:text-xl">${escapeHtml(vehiculo.modelo)}</h3>
        <p class="mt-0.5 text-[11px] font-medium text-muted-foreground">${vehiculo.año} · ${escapeHtml(vehiculo.categoria)}</p>
      </a>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Precio</p>
          <p class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">${formatearPrecio(vehiculo.precio)}</p>
        </div>
        <div class="flex items-center gap-3 text-right">
          <div>
            <p class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Potencia</p>
            <p class="flex items-center justify-end gap-1 text-sm font-semibold text-foreground">
              ${icon("Zap", "h-3 w-3 text-[var(--signature)]", 2.5)} ${formatearNumero(vehiculo.potencia)} HP
            </p>
          </div>
          <div class="hidden h-8 w-px bg-border sm:block"></div>
          <div class="hidden sm:block">
            <p class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">0-100</p>
            <p class="text-sm font-semibold text-foreground">${vehiculo.aceleracion0a100}s</p>
          </div>
        </div>
      </div>
      ${acciones}
    </div>
  </article>`
}

/** Wire all card buttons inside a rendered container. */
function hydrateVehicleCards(root = document) {
  hydrateSmartImages(root)
  root.querySelectorAll("[data-vehicle]").forEach((card) => {
    if (card.dataset.wired) return
    card.dataset.wired = "1"
    const id = card.dataset.vehicle
    const nombre = card.dataset.nombre
    card.querySelector('[data-action="favorito"]')?.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      const era = tienda.esFavorito(id)
      toggleFavorito(id)
      toast({
        title: era ? "Eliminado de favoritos" : "Añadido a favoritos",
        description: era ? `${nombre} se ha quitado de tus favoritos.` : `${nombre} se ha añadido a tus favoritos.`,
      })
    })
    card.querySelector('[data-action="comparar"]')?.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      const era = tienda.estaEnComparador(id)
      if (!era && tienda.get().comparar.length >= MAX_COMPARAR) {
        toast({ title: "Comparador lleno", description: "Solo puedes comparar hasta 3 vehículos a la vez." })
        return
      }
      tienda.toggleComparar(id)
      toast({
        title: era ? "Quitado del comparador" : "Añadido al comparador",
        description: era ? `${nombre} se ha quitado del comparador.` : `${nombre} se ha añadido al comparador.`,
      })
    })
    card.querySelector('[data-action="carrito"]')?.addEventListener("click", (e) => {
      e.preventDefault()
      const ok = tienda.agregarAlCarrito(id, true)
      if (ok) toast({ title: "Añadido al carrito", description: `${nombre} se ha añadido a tu carrito.` })
    })
  })
}

/** Empty state — port of empty-state.tsx. */
function emptyStateMarkup({ icono, titulo, descripcion, ctaLabel, ctaHref }) {
  return `
    <section class="hero-glow reveal relative mt-12 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-border/40 py-24 text-center sm:py-32">
      <div class="relative">
        <div class="absolute inset-0 -z-10 animate-pulse rounded-full bg-[var(--signature)]/10 blur-2xl"></div>
        <span class="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-card text-muted-foreground shadow-card">
          ${icon(icono, "h-9 w-9", 1.5)}
        </span>
      </div>
      <h3 class="text-display mt-7 text-2xl text-foreground sm:text-3xl">${escapeHtml(titulo)}</h3>
      <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">${escapeHtml(descripcion)}</p>
      <a href="${ctaHref}" class="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:shadow-[0_8px_30px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98]">
        ${escapeHtml(ctaLabel)} ${icon("ArrowRight", "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5")}
      </a>
    </section>`
}

/* ---- layout.js ---- */
/**
 * Shared site shell — port of src/components/layout/*.
 * Renders the sticky header, CTA banner, footer, sticky mobile CTA and the
 * cookie banner, and wires theme switching, badges and the account menu.
 */





const navItems = [
  { href: "/", label: "Inicio", iconName: "Home" },
  { href: "/marketplace", label: "Marketplace", iconName: "Store" },
  { href: "/marcas", label: "Marcas", iconName: "Building2" },
  { href: "/favoritos", label: "Favoritos", iconName: "Heart", badgeKey: "favoritos" },
  { href: "/comparar", label: "Comparar", iconName: "GitCompareArrows", badgeKey: "comparar" },
  { href: "/garaje", label: "Mi Garaje", iconName: "CarFront", badgeKey: "garaje" },
]

function estaActivo(href) {
  const path = currentAppRoute()
  if (href === "/") return path === "/"
  if (href === "/marketplace") return path.startsWith("/marketplace") || path.startsWith("/vehiculos")
  return path.startsWith(href)
}

function badgeSpan(n) {
  return n > 0
    ? `<span class="relative z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">${n}</span>`
    : ""
}

function logoMarkup(size = "h-9 w-9") {
  return `
    <span class="flex ${size} items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10">
      ${icon("Gauge", "h-5 w-5", 2.2)}
    </span>
    <span class="hidden flex-col items-start leading-none sm:flex">
      <span class="text-[15px] font-semibold tracking-tight text-foreground">
        Digital <span class="text-gradient">Marketplace</span>
      </span>
      <span class="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Alta Gama</span>
    </span>`
}

function navMarkup() {
  const s = tienda.get()
  return navItems.map((item) => {
    const activo = estaActivo(item.href)
    const badge = item.badgeKey ? badgeSpan(s[item.badgeKey]?.length ?? 0) : ""
    return `
      <a href="${hrefFromApp(item.href)}" aria-label="${item.label}"
         class="relative flex items-center gap-2 rounded-full px-2.5 py-2 text-sm font-medium transition-colors duration-200 lg:px-3.5 ${activo ? "text-foreground" : "text-muted-foreground hover:text-foreground"}">
        ${activo ? '<span class="absolute inset-0 rounded-full bg-secondary"></span>' : ""}
        ${icon(item.iconName, "relative z-10 h-4 w-4", 2)}
        <span class="relative z-10 hidden xl:inline">${item.label}</span>
        ${badge}
      </a>`
  }).join("")
}

function accountMarkup() {
  const user = auth.user
  if (!user) {
    return `
      <a href="${hrefFromApp("/login")}" aria-label="Iniciar sesión"
         class="hidden h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border/70 px-3 text-sm font-medium transition-all duration-300 hover:text-foreground sm:flex text-muted-foreground ${estaActivo("/login") ? "border-border bg-secondary text-foreground" : ""}">
        ${icon("User", "h-4 w-4", 2)}
        <span class="hidden lg:inline">Entrar</span>
      </a>`
  }
  return `
    <div class="relative" id="account-menu">
      <button id="account-trigger" class="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border/70 px-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground sm:px-3" aria-label="Menú de cuenta">
        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold uppercase text-primary-foreground">${escapeHtml((user.name ?? user.email ?? "?").charAt(0))}</span>
        <span class="hidden max-w-[90px] truncate lg:inline">${escapeHtml(user.name ?? "Cuenta")}</span>
      </button>
      <div id="account-dropdown" class="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-border/70 bg-card p-1 shadow-card-hover hidden">
        <div class="px-2 py-1.5">
          <p class="text-sm font-medium text-foreground truncate">${escapeHtml(user.name ?? "Cuenta")}</p>
          <p class="truncate text-xs text-muted-foreground">${escapeHtml(user.email)}</p>
        </div>
        <div class="my-1 h-px bg-border/60"></div>
        <a href="${hrefFromApp("/perfil")}" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary">${icon("User", "h-4 w-4")} Mi perfil</a>
        <a href="${hrefFromApp("/pedidos")}" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary">${icon("Receipt", "h-4 w-4")} Mis pedidos</a>
        ${user.role === "ADMIN" ? `<a href="${hrefFromApp("/admin")}" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary">${icon("Shield", "h-4 w-4")} Panel admin</a>` : ""}
        <div class="my-1 h-px bg-border/60"></div>
        <button id="logout-btn" class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10">${icon("LogOut", "h-4 w-4")} Cerrar sesión</button>
      </div>
    </div>`
}

function mobileMenuMarkup() {
  const open = document.getElementById("mobile-menu")
  if (!open) return
  const user = auth.user
  const s = tienda.get()
  open.innerHTML = `
    <div class="fixed inset-0 z-[100]">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" id="mobile-menu-overlay"></div>
      <aside class="anim-slide-in-right absolute right-0 top-0 h-full w-[280px] border-l border-border bg-background sm:w-[320px]">
        <div class="border-b border-border/60 px-6 py-5">
          <h2 class="text-left text-base font-semibold tracking-tight">Navegación</h2>
        </div>
        <nav class="flex flex-col gap-1 p-4">
          ${navItems.map((item) => {
            const activo = estaActivo(item.href)
            const badge = item.badgeKey ? badgeSpan(s[item.badgeKey]?.length ?? 0) : ""
            return `
              <a href="${hrefFromApp(item.href)}" class="menu-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${activo ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}">
                ${icon(item.iconName, "h-5 w-5", 2)}<span class="flex-1">${item.label}</span>${badge}
              </a>`
          }).join("")}
          <a href="${hrefFromApp("/carrito")}" class="menu-link mt-2 flex items-center gap-3 rounded-xl border-t border-border/60 px-4 pt-4 text-sm font-medium transition-colors ${estaActivo("/carrito") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}">
            ${icon("ShoppingCart", "h-5 w-5", 2)}<span class="flex-1">Carrito</span>${badgeSpan(s.carrito.length)}
          </a>
          ${user?.role === "ADMIN" ? `
            <a href="${hrefFromApp("/admin")}" class="menu-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${estaActivo("/admin") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}">
              ${icon("Shield", "h-5 w-5", 2)}<span class="flex-1">Panel admin</span>
            </a>` : ""}
          ${user ? `
            <a href="${hrefFromApp("/perfil")}" class="menu-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${estaActivo("/perfil") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}">
              ${icon("User", "h-5 w-5", 2)}<span class="flex-1">Mi perfil</span>
            </a>
            <a href="${hrefFromApp("/pedidos")}" class="menu-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${estaActivo("/pedidos") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}">
              ${icon("Receipt", "h-5 w-5", 2)}<span class="flex-1">Mis pedidos</span>
            </a>
            <button id="mobile-logout" class="menu-link flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10">
              ${icon("LogOut", "h-5 w-5", 2)}<span class="flex-1">Cerrar sesión</span>
            </button>` : `
            <a href="${hrefFromApp("/login")}" class="menu-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${estaActivo("/login") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}">
              ${icon("User", "h-5 w-5", 2)}<span class="flex-1">Iniciar sesión</span>
            </a>`}
          <div class="mt-2 border-t border-border/60 px-4 pt-4">
            <p class="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Tema visual</p>
            <div class="grid grid-cols-3 gap-2">
              ${temas.map((tema) => `
                <button data-tema="${tema.id}" class="tema-btn flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all ${tienda.get().temaActivo === tema.id ? "border-foreground/40 bg-secondary" : "border-border/50 hover:bg-secondary/50"}" aria-label="${tema.nombre}">
                  <span class="h-6 w-6 rounded-lg border border-border/50" style="background-color: ${tema.muestra}"></span>
                  <span class="text-[10px] font-medium text-muted-foreground">${tema.nombre}</span>
                </button>`).join("")}
            </div>
          </div>
        </nav>
      </aside>
    </div>`
  wireMobileMenu()
}

function closeMobileMenu() {
  const el = document.getElementById("mobile-menu")
  if (el) el.innerHTML = ""
}

function wireMobileMenu() {
  const root = document.getElementById("mobile-menu")
  if (!root) return
  root.querySelector("#mobile-menu-overlay")?.addEventListener("click", closeMobileMenu)
  root.querySelectorAll(".menu-link").forEach((a) => a.addEventListener("click", closeMobileMenu))
  root.querySelectorAll(".tema-btn").forEach((b) =>
    b.addEventListener("click", () => {
      tienda.setTema(b.dataset.tema)
      aplicarTema(b.dataset.tema)
    })
  )
  root.querySelector("#mobile-logout")?.addEventListener("click", async () => {
    await auth.logout()
    closeMobileMenu()
    window.location.reload()
  })
}

function themeDropdownMarkup() {
  return `
    <div class="relative hidden sm:block" id="theme-menu">
      <button id="theme-trigger" class="flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all duration-300 hover:text-foreground" aria-label="Cambiar tema">
        ${icon("Palette", "h-4 w-4", 2)}
      </button>
      <div id="theme-dropdown" class="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-border/70 bg-card p-2 shadow-card-hover hidden">
        <p class="px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Tema visual</p>
        <div class="space-y-0.5">
          ${temas.map((tema) => {
            const activo = tienda.get().temaActivo === tema.id
            return `
              <button data-tema="${tema.id}" class="tema-btn flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${activo ? "bg-secondary" : "hover:bg-secondary/50"}">
                <span class="h-6 w-6 shrink-0 rounded-lg border border-border/50" style="background-color: ${tema.muestra}"></span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-foreground">${tema.nombre}</p>
                  <p class="truncate text-[11px] text-muted-foreground">${tema.descripcion}</p>
                </div>
                ${activo ? icon("Check", "h-4 w-4 shrink-0 text-[var(--signature)]", 2.5) : ""}
              </button>`
          }).join("")}
        </div>
      </div>
    </div>`
}

function renderHeader() {
  const header = document.createElement("header")
  header.className = "sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50"
  header.innerHTML = `
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
      <a href="${hrefFromApp("/")}" class="group flex shrink-0 items-center gap-2.5" aria-label="Ir al inicio">${logoMarkup()}</a>
      <nav class="hidden items-center gap-0.5 lg:flex">${navMarkup()}</nav>
      <div class="flex items-center gap-1.5 sm:gap-2">
        ${themeDropdownMarkup()}
        <span id="account-slot" class="flex items-center">${accountMarkup()}</span>
        <a href="${hrefFromApp("/carrito")}" aria-label="Carrito con ${tienda.get().carrito.length} vehículo(s)"
           class="group relative flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-2 text-sm font-medium transition-all duration-200 sm:px-3.5 ${estaActivo("/carrito") ? "border-border bg-secondary text-foreground" : "border-border/70 text-muted-foreground hover:border-border hover:text-foreground"}">
          <span class="relative" id="carrito-bell">
            ${icon("ShoppingCart", "h-4 w-4 sm:h-[18px] sm:w-[18px]", 2)}
            <span class="carrito-badge ${tienda.get().carrito.length ? "" : "hidden"} absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">${tienda.get().carrito.length}</span>
          </span>
          <span class="hidden xl:inline">Carrito</span>
        </a>
        <button id="mobile-menu-btn" class="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground lg:hidden" aria-label="Abrir menú de navegación">
          ${icon("Menu", "h-5 w-5", 2)}
        </button>
      </div>
    </div>
    <div id="mobile-menu"></div>`
  return header
}

function wireHeader(header) {
  header.querySelector("#theme-trigger")?.addEventListener("click", (e) => {
    e.stopPropagation()
    const dd = header.querySelector("#theme-dropdown")
    dd.classList.toggle("hidden")
    dd.classList.add("anim-drop-in")
  })
  header.querySelectorAll(".tema-btn").forEach((b) =>
    b.addEventListener("click", () => {
      tienda.setTema(b.dataset.tema)
      aplicarTema(b.dataset.tema)
      setTimeout(() => header.querySelector("#theme-dropdown")?.classList.add("hidden"), 200)
    })
  )
  header.querySelector("#account-trigger")?.addEventListener("click", (e) => {
    e.stopPropagation()
    const dd = header.querySelector("#account-dropdown")
    dd.classList.toggle("hidden")
    dd.classList.add("anim-drop-in")
  })
  header.querySelector("#logout-btn")?.addEventListener("click", async () => {
    await auth.logout()
    window.location.reload()
  })
  header.querySelector("#mobile-menu-btn")?.addEventListener("click", mobileMenuMarkup)
  // Cierra dropdowns al hacer clic fuera (listener registrado una sola vez)
  if (!wireHeader.outsideWired) {
    wireHeader.outsideWired = true
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#theme-menu")) headerEl?.querySelector("#theme-dropdown")?.classList.add("hidden")
      if (!e.target.closest("#account-menu")) headerEl?.querySelector("#account-dropdown")?.classList.add("hidden")
    })
  }
}

function renderFooter() {
  const footer = document.createElement("footer")
  footer.className = "mt-auto border-t border-border/40 bg-background"
  const anio = new Date().getFullYear()
  footer.innerHTML = `
    <div class="mx-auto max-w-7xl px-4 py-12 pb-28 sm:px-6 lg:px-8 lg:pb-12">
      <div class="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-start">
        <div class="max-w-xs">
          <a href="${hrefFromApp("/")}" class="flex items-center gap-2.5" aria-label="Ir al inicio">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">${icon("Gauge", "h-4 w-4", 2.2)}</span>
            <span class="text-sm font-semibold tracking-tight">Digital <span class="text-gradient">Marketplace</span></span>
          </a>
        </div>
        <nav class="flex flex-wrap items-start gap-x-8 gap-y-3 text-sm text-muted-foreground sm:gap-x-10">
          <div class="flex flex-col gap-2">
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">Explorar</p>
            <a href="${hrefFromApp("/marketplace")}" class="transition-colors hover:text-foreground">Marketplace</a>
            <a href="${hrefFromApp("/marcas")}" class="transition-colors hover:text-foreground">Marcas</a>
            <a href="${hrefFromApp("/comparar")}" class="transition-colors hover:text-foreground">Comparar</a>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">Cuenta</p>
            <a href="${hrefFromApp("/favoritos")}" class="transition-colors hover:text-foreground">Favoritos</a>
            <a href="${hrefFromApp("/garaje")}" class="transition-colors hover:text-foreground">Mi Garaje</a>
            <a href="${hrefFromApp("/carrito")}" class="transition-colors hover:text-foreground">Carrito</a>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">Legal</p>
            <a href="${hrefFromApp("/privacidad")}" class="transition-colors hover:text-foreground">Privacidad</a>
            <a href="${hrefFromApp("/terminos")}" class="transition-colors hover:text-foreground">Términos</a>
          </div>
        </nav>
      </div>
      <div class="mt-10 border-t border-border/40 pt-6 text-xs text-muted-foreground">
        <div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p>© ${anio} Digital Marketplace. Todos los derechos reservados.</p>
          <p>Experiencia de compra simulada.</p>
        </div>
      </div>
    </div>`
  return footer
}

function renderCtaBanner() {
  const section = document.createElement("section")
  section.className = "relative overflow-hidden border-t border-border/40 bg-card"
  section.innerHTML = `
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 opacity-60" style="background: radial-gradient(60% 80% at 50% 0%, oklch(0.85 0.09 80 / 0.08), transparent 70%)"></div>
    <div class="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Digital Marketplace · Vehículos de Alta Gama</p>
      <h2 class="text-display mt-5 text-3xl text-foreground sm:text-4xl lg:text-5xl">Tu próximo vehículo te espera.</h2>
      <p class="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Explora la colección, compara y reserva el modelo que siempre quisiste. Experiencia de compra premium, de principio a fin.
      </p>
      <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href="${hrefFromApp("/marketplace")}" class="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:gap-3 hover:shadow-[0_12px_40px_-8px_oklch(0.98_0_0/0.35)] active:scale-[0.98] sm:w-auto">
          Explorar vehículos ${icon("ArrowRight", "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1")}
        </a>
        <a href="${hrefFromApp("/marcas")}" class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto">
          Ver marcas
        </a>
      </div>
    </div>`
  return section
}

// --- Sticky mobile CTA --------------------------------------------------------
const RUTAS_SIN_CTA = ["/login", "/registro", "/admin", "/privacidad", "/terminos", "/gracias"]
let stickyCtaEl = null
function wireStickyCta() {
  if (RUTAS_SIN_CTA.some((r) => currentAppRoute().startsWith(r))) return
  stickyCtaEl = document.createElement("div")
  stickyCtaEl.className = "fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 translate-y-full"
  document.body.appendChild(stickyCtaEl)
  const update = () => {
    const s = tienda.get()
    const hayCarrito = s.carrito.length > 0
    const href = hayCarrito ? "/carrito" : "/marketplace"
    const etiqueta = hayCarrito ? "Ir al carrito" : "Explorar vehículos"
    stickyCtaEl.innerHTML = `
      <div class="border-t border-border/70 bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <a href="${href}" class="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98]" aria-label="${etiqueta}">
          ${hayCarrito ? icon("ShoppingCart", "h-4 w-4", 2.2) : ""}${etiqueta}${hayCarrito ? "" : icon("ArrowRight", "h-4 w-4", 2.2)}
          ${hayCarrito ? `<span class="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-[11px] font-bold">${s.carrito.length}</span>` : ""}
        </a>
      </div>`
  }
  const onScroll = () => {
    if (window.scrollY > 320) stickyCtaEl.classList.remove("translate-y-full")
    else stickyCtaEl.classList.add("translate-y-full")
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  tienda.subscribe(update)
  update()
}

// --- Cookie banner -------------------------------------------------------------
const CONSENT_KEY = "dm-cookie-consent"
function hasAnalyticsConsent() {
  try { return localStorage.getItem(CONSENT_KEY) === "accepted" } catch { return false }
}
function wireCookieBanner() {
  let estado
  try { estado = localStorage.getItem(CONSENT_KEY) } catch { estado = null }
  if (estado) return
  const wrapper = document.createElement("div")
  wrapper.className = "fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:bottom-4 sm:left-4 sm:right-auto sm:px-0 sm:pb-0"
  wrapper.setAttribute("role", "region")
  wrapper.setAttribute("aria-label", "Banner de consentimiento de cookies")
  wrapper.innerHTML = `
    <div class="anim-pop-in mx-auto w-full max-w-3xl rounded-2xl border border-border/70 bg-card/95 p-4 shadow-card backdrop-blur-xl sm:max-w-md sm:p-5">
      <div class="flex items-start gap-3">
        <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
          ${icon("Cookie", "h-5 w-5", 2)}
        </span>
        <div class="flex-1">
          <p class="text-sm font-semibold text-foreground">Cookies y privacidad</p>
          <p class="mt-1 text-xs leading-relaxed text-muted-foreground">
            Usamos cookies propias para el funcionamiento del sitio y de análisis anónimo para entender cómo se usa. Puedes aceptar o rechazar el análisis en cualquier momento. Lee nuestra
            <a href="${hrefFromApp("/privacidad")}" class="font-medium text-[var(--signature)] hover:underline"> política de privacidad</a>.
          </p>
          <div class="mt-3 flex flex-col gap-2 sm:flex-row">
            <button data-consent="accepted" class="flex-1 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]">Aceptar todo</button>
            <button data-consent="rejected" class="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent active:scale-[0.98]">Solo necesarias</button>
          </div>
        </div>
        <button data-consent="rejected" aria-label="Cerrar banner de cookies" class="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          ${icon("X", "h-4 w-4", 2)}
        </button>
      </div>
    </div>`
  document.body.appendChild(wrapper)
  wrapper.querySelectorAll("[data-consent]").forEach((b) =>
    b.addEventListener("click", () => {
      try { localStorage.setItem(CONSENT_KEY, b.dataset.consent) } catch { /* ignore */ }
      wrapper.remove()
    })
  )
}

// --- Shell init ------------------------------------------------------------------
let headerEl = null

function renderShell({ cta = true } = {}) {
  const shell = document.createElement("div")
  shell.className = "flex min-h-screen flex-col bg-background"
  const main = document.querySelector("main") ?? document.querySelector("#main-root")
  const content = main ?? document.createElement("main")
  if (!main) content.className = "flex-1"

  headerEl = renderHeader()
  shell.appendChild(headerEl)
  shell.appendChild(content)
  if (cta) shell.appendChild(renderCtaBanner())
  shell.appendChild(renderFooter())

  // Mover el contenido existente dentro del shell
  document.body.prepend(shell)
  wireHeader(headerEl)
  subscribeBadges()
  wireStickyCta()
  wireCookieBanner()
}

// Actualiza badges cuando cambia el store o la sesión
function subscribeBadges() {
  const refreshBadges = () => {
    if (!headerEl) return
    headerEl.querySelector("nav").innerHTML = navMarkup()
    const badge = headerEl.querySelector(".carrito-badge")
    const n = tienda.get().carrito.length
    if (badge) {
      badge.textContent = n
      badge.classList.toggle("hidden", n === 0)
    }
    const slot = headerEl.querySelector("#account-slot")
    if (slot) {
      slot.innerHTML = accountMarkup()
      wireHeader(headerEl)
    }
  }
  tienda.subscribe(refreshBadges)
  auth.subscribe(refreshBadges)
}



/* ---- charts.js ---- */
/**
 * Vanilla SVG charts replacing recharts for the admin dashboard:
 * area, bar, horizontal bar and donut charts with hover tooltips.
 */


const CHART_COLORS = [
  "var(--signature)", "var(--success)", "#60a5fa", "#f472b6", "#a78bfa",
  "#fb923c", "#34d399", "#f87171", "#facc15", "#22d3ee",
]

function attachTooltip(svg) {
  const tooltip = document.createElement("div")
  tooltip.className = "chart-tooltip"
  svg.parentElement.appendChild(tooltip)
  svg.querySelectorAll("[data-tx]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const tx = el.dataset.tx
      const tw = el.dataset.tw
      tooltip.innerHTML = `
        <p class="font-semibold">${tx}</p>
        ${tw ? `<p class="text-muted-foreground">${tw}</p>` : ""}`
      tooltip.classList.add("is-visible")
    })
    el.addEventListener("mousemove", (e) => {
      const box = svg.parentElement.getBoundingClientRect()
      let x = e.clientX - box.left + 8
      let y = e.clientY - box.top - 8
      tooltip.style.left = `${x}px`
      tooltip.style.top = `${y}px`
    })
    el.addEventListener("mouseleave", () => tooltip.classList.remove("is-visible"))
  })
}

/** Area chart with gradient fill, dashed grid, axis ticks. */
function areaChart({ data, width = 900, height = 320, padding = { l: 60, r: 16, t: 12, b: 28 } }) {
  if (!data.length) return "<div class='py-20 text-center text-sm text-muted-foreground'>Sin datos</div>"
  const w = width - padding.l - padding.r
  const h = height - padding.t - padding.b
  const max = Math.max(...data.map((d) => d.value), 1)
  const pts = data.map((d, i) => [padding.l + (i * w) / Math.max(1, data.length - 1), padding.t + h - (d.value / max) * h])
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${padding.t + h} L${pts[0][0].toFixed(1)},${padding.t + h} Z`
  const gridLines = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padding.t + h - f * h
    return `<line x1="${padding.l}" x2="${padding.l + w}" y1="${y}" y2="${y}" stroke="oklch(1 0 0 / 6%)" stroke-dasharray="3 3"/>`
  })
  const xTicks = data.filter((_, i) => i % 3 === 0).map((d, i) => {
    const idx = i * 3
    const x = padding.l + (idx * w) / Math.max(1, data.length - 1)
    return `<text x="${x}" y="${padding.t + h + 18}" text-anchor="middle" fill="var(--muted-foreground)" font-size="11" font-family="inherit">${d.label}</text>`
  })
  const yTicks = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padding.t + h - f * h
    const v = max * f
    const label = v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `$${(v / 1e3).toFixed(0)}K` : `${Math.round(v)}`
    return `<text x="${padding.l - 8}" y="${y + 3}" text-anchor="end" fill="var(--muted-foreground)" font-size="11" font-family="inherit">${label}</text>`
  })
  const hitRects = pts.map((p, i) => `
    <rect class="cursor-pointer" x="${Math.max(p[0] - w / (2 * (data.length - 1)), padding.l)}" y="${padding.t}" width="${Math.max(w / (data.length - 1), 24)}" height="${h}" fill="transparent" data-tx="${data[i].label}: ${data[i].formatted}"></rect>`)
  const gradId = `grad-${Math.random().toString(36).slice(2, 8)}`
  return `
  <svg viewBox="0 0 ${width} ${height}" class="overflow-visible">
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stop-color="var(--signature)" stop-opacity="0.45"/>
        <stop offset="95%" stop-color="var(--signature)" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${gridLines.join("")}${yTicks.join("")}${xTicks.join("")}
    <path d="${area}" fill="url(#${gradId})"></path>
    <path d="${line}" fill="none" stroke="var(--signature)" stroke-width="2" class="chart-area-line"/>
    ${hitRects.join("")}
  </svg>`
}

/** Vertical bar chart. */
function barChart({ data, color = "var(--signature)", width = 560, height = 300, padding = { l: 56, r: 16, t: 12, b: 28 }, barRadius = 8, valueFormat }) {
  if (!data.length) return "<div class='py-20 text-center text-sm text-muted-foreground'>Sin datos</div>"
  const w = width - padding.l - padding.r
  const h = height - padding.t - padding.b
  const max = Math.max(...data.map((d) => d.value), 1)
  const barW = Math.min(w / data.length - 16, 64)
  const bars = data.map((d, i) => {
    const x = padding.l + (i * w) / data.length + (w / data.length - barW) / 2
    const bh = (d.value / max) * h
    const y = padding.t + h - bh
    const grad = d.color ?? color
    return `
      <rect class="origin-bottom" x="${x}" y="${y}" width="${barW}" height="${Math.max(bh, 0)}" rx="${barRadius}" fill="${grad}" data-tx="${d.label}: ${d.formatted}"/>
      <text x="${x + barW / 2}" y="${padding.t + h + 18}" text-anchor="middle" fill="var(--muted-foreground)" font-size="11" font-family="inherit">${d.label}</text>`
  })
  const gridLines = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padding.t + h - f * h
    return `<line x1="${padding.l}" x2="${padding.l + w}" y1="${y}" y2="${y}" stroke="oklch(1 0 0 / 6%)" stroke-dasharray="3 3"/>`
  })
  const yTicks = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padding.t + h - f * h
    const v = max * f
    const label = valueFormat ? valueFormat(v) : (v >= 1e6 ? `$${(v / 1e6).toFixed(0)}M` : Math.round(v))
    return `<text x="${padding.l - 8}" y="${y + 3}" text-anchor="end" fill="var(--muted-foreground)" font-size="11" font-family="inherit">${label}</text>`
  })
  return `
  <svg viewBox="0 0 ${width} ${height}" class="overflow-visible">
    ${gridLines.join("")}${yTicks.join("")}${bars.join("")}
  </svg>`
}

/** Horizontal bar chart (top brands). */
function hbarChart({ data, width = 700, height = 260, nameWidth = 96 }) {
  if (!data.length) return "<div class='py-20 text-center text-sm text-muted-foreground'>Sin datos</div>"
  const max = Math.max(...data.map((d) => d.value), 1)
  const rows = data.map((d, i) => {
    const rowH = height / data.length
    const y = i * rowH + (rowH - 22) / 2
    const barW = ((d.value / max) * (width - nameWidth - 16))
    return `
      <g>
        <text x="${nameWidth - 8}" y="${y + 16}" text-anchor="end" fill="var(--muted-foreground)" font-size="11" font-family="inherit">${d.label}</text>
        <rect x="${nameWidth}" y="${y + 2}" width="${Math.max(barW, 2)}" height="18" fill="${CHART_COLORS[i % CHART_COLORS.length]}" rx="6" data-tx="${d.label}: ${d.formatted}"/>
        <line x1="${nameWidth}" x2="${nameWidth}" y1="0" y2="${height}" stroke="oklch(1 0 0 / 12%)" stroke-dasharray="3 3"/>
      </g>`
  })
  return `
  <svg viewBox="0 0 ${width} ${height}" class="overflow-visible">
    ${rows.join("")}
  </svg>`
}

/** Donut chart (category distribution). */
function pieChart({ data, width = 320, height = 260, innerRatio = 0.55 }) {
  if (!data.length) return "<div class='py-20 text-center text-sm text-muted-foreground'>Sin datos</div>"
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const cx = width / 2
  const cy = height / 2
  const r = Math.min(width, height) / 2 - 6
  const ir = r * innerRatio
  let angle = -Math.PI / 2
  const slices = data.map((d, i) => {
    const frac = d.value / total
    const next = angle + frac * Math.PI * 2
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle)
    const x2 = cx + r * Math.cos(next), y2 = cy + r * Math.sin(next)
    const xi2 = cx + ir * Math.cos(next), yi2 = cy + ir * Math.sin(next)
    const xi1 = cx + ir * Math.cos(angle), yi1 = cy + ir * Math.sin(angle)
    const large = next - angle > Math.PI ? 1 : 0
    angle = next
    return `
      <path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${large} 0 ${xi1} ${yi1} Z"
        fill="${CHART_COLORS[i % CHART_COLORS.length]}" data-tx="${d.label}: ${Math.round(frac * 100)}%"/>
      `
  })
  const legend = data.map((d, i) => {
    const frac = d.value / total
    return `
    <div class="flex items-center gap-2 text-xs">
      <span class="h-2.5 w-2.5 rounded-full" style="background-color: ${CHART_COLORS[i % CHART_COLORS.length]}"></span>
      <span class="text-foreground">${d.label}</span>
      <span class="ml-auto text-muted-foreground">${Math.round(frac * 100)}%</span>
    </div>`
  })
  return `
  <div class="flex items-center justify-center gap-8">
    <svg viewBox="0 0 ${width} ${height}" class="w-[240px] shrink-0">${slices.join("")}</svg>
    <div class="hidden min-w-[180px] space-y-1.5 sm:block">${legend.join("")}</div>
  </div>`
}

// ---------- Demos: helpers para demos no sanitizados --------------------------


/* ---- checkout-modal.js ---- */
/**
 * Checkout modal — port of checkout-modal.tsx. Confirma la compra de los
 * vehículos del carrito (una ficha), muestra el progreso y finaliza en el
 * servidor. En caso de éxito vacía el carrito y redirige a /gracias.
 */








let modalEl = null
function openCheckoutModal(vehiculos, opts = {}) {
  if (!vehiculos.length) return
  closeCheckoutModal()
  const total = vehiculos.reduce((s, v) => s + v.precio, 0)
  modalEl = document.createElement("div")
  modalEl.className = "fixed inset-0 z-[80] flex items-center justify-center p-4"
  modalEl.innerHTML = `
    <div class="anim-fade-in absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
    <div class="anim-pop-in relative w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-card-hover" role="dialog" aria-modal="true">
      <button class="chx-close absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Cerrar">${icon("X", "h-4 w-4")}</button>
      <h2 class="text-display text-xl text-foreground">Confirmar compra</h2>
      <p class="mt-1.5 text-sm text-muted-foreground">Revisa los vehículos antes de completar la compra. Pago simulado, sin cargos reales.</p>
      <ol class="mt-4 max-h-56 space-y-2 overflow-y-auto">
        ${vehiculos.map((v, i) => `
          <li class="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-secondary/30 px-3 py-2.5">
            <span class="flex items-center gap-3">
              <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-muted-foreground">${i + 1}</span>
              <span class="text-sm font-medium text-foreground">${escapeHtml(v.marca)} ${escapeHtml(v.modelo)}</span>
            </span>
            <span class="text-sm font-semibold text-foreground">${formatearPrecio(v.precio)}</span>
          </li>`).join("")}
      </ol>
      <div class="mt-4 flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
        <p class="text-sm font-medium text-muted-foreground">Total</p>
        <p class="text-lg font-semibold text-foreground chx-total">${formatearPrecio(total)}</p>
      </div>
      <div class="mt-2.5 min-h-[18px] text-xs text-muted-foreground chx-msg"></div>
      <div class="mt-5 flex flex-col gap-2.5">
        <button class="chx-confirm flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
          ${icon("Check", "h-4 w-4")}<span class="chx-label">Completar compra</span>
        </button>
        <p class="chx-capitalize text-wrap flex items-center justify-center text-[11px] text-muted-foreground">
          Pago simulado · No se realiza ningún cargo real
        </p>
      </div>
    </div>`

  document.body.appendChild(modalEl)
  const steps = [
    "Comprobando disponibilidad…",
    "Generando número de pedido…",
    "Reservando vehículos…",
    "Guardando pedido…",
  ]
  let busy = false
  modalEl.querySelector(".chx-close").addEventListener("click", () => { if (!busy) closeCheckoutModal() })
  modalEl.querySelector(".absolute").addEventListener("click", () => { if (!busy) closeCheckoutModal() })

  modalEl.querySelector(".chx-confirm").addEventListener("click", async () => {
    if (busy) return
    if (!auth.isAuthenticated) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para completar la compra." })
      window.location.href = `/login?redirect=${encodeURIComponent(currentAppRoute())}`
      return
    }
    busy = true
    const btn = modalEl.querySelector(".chx-confirm")
    btn.disabled = true
    const msgEl = modalEl.querySelector(".chx-msg")
    let step = 0
    const iv = setInterval(() => {
      if (step < steps.length) {
        msgEl.textContent = steps[step]
        step++
      }
    }, 350)
    try {
      const items = vehiculos.map((v) => ({ vehicleSlug: v.id, quantity: 1 }))
      const result = await api.checkout(items)
      clearInterval(iv)
      modalEl.querySelector(".chx-label").textContent = "Compra completada"
      msgEl.textContent = `Pedido ${result.orderNumber ?? ""} creado correctamente.`
      tienda.finalizarCompra()
      setTimeout(() => {
        closeCheckoutModal()
        window.location.href = hrefFromApp("/gracias") + "?order=" + (result.orderId ?? "")
      }, 600)
    } catch (e) {
      clearInterval(iv)
      btn.disabled = false
      busy = false
      msgEl.textContent = e.message || "La compra no pudo completarse. Inténtalo de nuevo."
    }
  })
}
function closeCheckoutModal() {
  if (modalEl) {
    modalEl.remove()
    modalEl = null
  }
}
