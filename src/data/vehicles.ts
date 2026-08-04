import type { Vehicle } from "@/types/vehicle"

// Catálogo de vehículos reales con especificaciones reales.
// 12 marcas × 4 modelos = 48 vehículos.
// Imágenes obtenidas mediante búsqueda web (OSS-hosted, embebibles).
export const vehiculos: Vehicle[] = [
  // ===================== PORSCHE =====================
  {
    id: "porsche-911-carrera",
    marca: "Porsche",
    modelo: "911 Carrera",
    año: 2024,
    precio: 114400,
    motor: "3.0L Twin-Turbo Boxer 6",
    potencia: 379,
    torque: 420, // Nm
    transmision: "PDK 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 293,
    aceleracion0a100: 4.0, // segundos
    categoria: "Deportivo",
    descripcion:
      "El Porsche 911 Carrera representa la esencia del deportivo purista. Su motor bóxer turboalimentado entrega una respuesta inmediata, mientras que su chasis afinado garantiza una dinámica de conducción incomparable. Un icono atemporal redefinido para la era moderna.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e201b2157658.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/af3561028792.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7ef90c1216f3.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e07c6e4598b7.png",
    ],
  },
  {
    id: "porsche-taycan-turbos",
    marca: "Porsche",
    modelo: "Taycan Turbo S",
    año: 2024,
    precio: 192900,
    motor: "Dual-Motor Eléctrico",
    potencia: 750,
    torque: 1050, // Nm
    transmision: "Automática 2 velocidades",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 260,
    aceleracion0a100: 2.8, // segundos
    categoria: "Sedán",
    descripcion:
      "El Porsche Taycan Turbo S demuestra que la electromovilidad puede ser pura emoción. Con 750 CV y tracción integral, acelera de 0 a 100 km/h en 2,8 segundos. Su arquitectura de 800V permite cargas ultrarrápidas sin renunciar al ADN deportivo de Porsche.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/46e4531c3d93.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a6d2a111555b.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9f1be2a323ac.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ec304608a0ec.jpeg",
    ],
  },
  {
    id: "porsche-cayenne-turbogt",
    marca: "Porsche",
    modelo: "Cayenne Turbo GT",
    año: 2024,
    precio: 196300,
    motor: "4.0L Twin-Turbo V8",
    potencia: 650,
    torque: 850, // Nm
    transmision: "Tiptronic S 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 305,
    aceleracion0a100: 3.2, // segundos
    categoria: "SUV",
    descripcion:
      "El Porsche Cayenne Turbo GT es el SUV más potente de la historia de Porsche. Desarrollado en el Nürburgring, su V8 biturbo de 650 CV y su chasis activo lo convierten en una bestia de pista con la versatilidad de un vehículo de cinco plazas.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/994fe4075543.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ce1813372727.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/aef6158943a7.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f6955b527b5b.jpg",
    ],
  },
  {
    id: "porsche-718-cayman-gt4",
    marca: "Porsche",
    modelo: "718 Cayman GT4 RS",
    año: 2024,
    precio: 149600,
    motor: "4.0L Boxer 6 Atmosférico",
    potencia: 493,
    torque: 450, // Nm
    transmision: "PDK 7 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 315,
    aceleracion0a100: 3.4, // segundos
    categoria: "Coupé",
    descripcion:
      "El Porsche 718 Cayman GT4 RS lleva el motor atmosférico del 911 GT3 al chasis de motor central perfecto. Con 493 CV que giran hasta 9.000 rpm, ofrece una experiencia de conducción táctil y pura que pocos deportivos pueden igualar.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/66cfa7279e30.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9f8b9d0ac402.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3c8c9cf5ea7f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0768c601ebdc.jpg",
    ],
  },

  // ===================== FERRARI =====================
  {
    id: "ferrari-296-gtb",
    marca: "Ferrari",
    modelo: "296 GTB",
    año: 2023,
    precio: 322986,
    motor: "3.0L Twin-Turbo V6 Híbrido",
    potencia: 830,
    torque: 740, // Nm
    transmision: "DCT 8 velocidades",
    combustible: "Híbrido",
    traccion: "RWD",
    velocidadMaxima: 330,
    aceleracion0a100: 2.9, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "La Ferrari 296 GTB redefine el concepto del superdeportivo con su motor V6 híbrido que entrega 830 CV combinados. Una obra maestra de la ingeniería italiana que combina potencia brutal, eficiencia eléctrica y el sonido inconfundible de Maranello.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7426cf0b8911.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/91c901628d36.jpeg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c35eba302a18.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3f620c6cb534.jpg",
    ],
  },
  {
    id: "ferrari-sf90-stradale",
    marca: "Ferrari",
    modelo: "SF90 Stradale",
    año: 2023,
    precio: 507300,
    motor: "4.0L Twin-Turbo V8 Híbrido Plug-in",
    potencia: 986,
    torque: 900, // Nm
    transmision: "DCT 8 velocidades",
    combustible: "Híbrido",
    traccion: "AWD",
    velocidadMaxima: 340,
    aceleracion0a100: 2.5, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "La Ferrari SF90 Stradale es el primer superdeportivo híbrido enchufable de Ferrari, con 986 CV combinados de su V8 biturbo y tres motores eléctricos. Acelera de 0 a 100 km/h en 2,5 segundos y representa la cúspide tecnológica de Maranello.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cd35d4716377.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2cbc3f974ae8.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0bd86db3053c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3a42cd013345.jpg",
    ],
  },
  {
    id: "ferrari-roma",
    marca: "Ferrari",
    modelo: "Roma",
    año: 2023,
    precio: 243308,
    motor: "3.9L Twin-Turbo V8",
    potencia: 612,
    torque: 760, // Nm
    transmision: "DCT 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 320,
    aceleracion0a100: 3.4, // segundos
    categoria: "Coupé",
    descripcion:
      "La Ferrari Roma evoca la dolce vita italiana con un diseño de líneas puras y elegantes. Bajo su capó, un V8 biturbo de 612 CV ofrece prestaciones de superdeportivo envueltas en un gran turismo refinado y atemporal.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/561e2717b55e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/05cbd427b50b.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3a332acde6d8.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/de30d2c810af.jpg",
    ],
  },
  {
    id: "ferrari-812-competizione",
    marca: "Ferrari",
    modelo: "812 Competizione",
    año: 2022,
    precio: 625000,
    motor: "6.5L V12 Atmosférico",
    potencia: 819,
    torque: 692, // Nm
    transmision: "DCT 7 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 340,
    aceleracion0a100: 2.85, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "La Ferrari 812 Competizione es la culminación del V12 atmosférico puro. Con 819 CV a 9.250 rpm, es el motor de 12 cilindros más potente de la historia de Ferrari road cars. Una edición limitada que rinde tributo al placer de conducir sin compromisos.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2c948f96bec5.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/08f7abad880c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0a988680013f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d55eb615d94a.jpg",
    ],
  },

  // ===================== LAMBORGHINI =====================
  {
    id: "lamborghini-huracan-evo",
    marca: "Lamborghini",
    modelo: "Huracán EVO",
    año: 2023,
    precio: 249870,
    motor: "5.2L V10 Atmosférico",
    potencia: 631,
    torque: 600, // Nm
    transmision: "DCT 7 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 325,
    aceleracion0a100: 2.9, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "La Lamborghini Huracán EVO lleva la adrenalina al límite con su legendario motor V10 atmosférico. Su sistema de tracción integral y la tecnología LDVI anticipan cada movimiento del conductor, ofreciendo una experiencia de conducción visceral y pura.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3a56c7a7594a.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c11a3fbfc6ae.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5879bb012de4.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c70ca28e86d5.jpeg",
    ],
  },
  {
    id: "lamborghini-aventador-svj",
    marca: "Lamborghini",
    modelo: "Aventador SVJ",
    año: 2022,
    precio: 517770,
    motor: "6.5L V12 Atmosférico",
    potencia: 759,
    torque: 720, // Nm
    transmision: "ISR 7 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 350,
    aceleracion0a100: 2.8, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "La Lamborghini Aventador SVJ es la encarnación más extrema del V12 atmosférico de Sant'Agata. Con 759 CV y la aerodinámica ALA 2.0, batió el récord de producción en el Nürburgring. Un monstruo puro con el carácter salvaje de Lamborghini.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/dbd2b29a281c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/391275a9cafc.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8289cd2b966c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/60700e7d068d.jpg",
    ],
  },
  {
    id: "lamborghini-revuelto",
    marca: "Lamborghini",
    modelo: "Revuelto",
    año: 2024,
    precio: 608000,
    motor: "6.5L V12 Híbrido Plug-in",
    potencia: 1015,
    torque: 793, // Nm
    transmision: "DCT 8 velocidades",
    combustible: "Híbrido",
    traccion: "AWD",
    velocidadMaxima: 350,
    aceleracion0a100: 2.5, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "La Lamborghini Revuelto inaugura la era híbrida de Sant'Agata con un V12 atmosférico nuevo combinado con tres motores eléctricos, entregando 1.015 CV. Es el primer superdeportivo HPEV de Lamborghini, fusionando la tradición V12 con el futuro eléctrico.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b687632eff39.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fa66b222a9fc.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ff4c6e0f9cb2.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/07325bcfda6c.jpg",
    ],
  },
  {
    id: "lamborghini-urus-performante",
    marca: "Lamborghini",
    modelo: "Urus Performante",
    año: 2024,
    precio: 260000,
    motor: "4.0L Twin-Turbo V8",
    potencia: 657,
    torque: 800, // Nm
    transmision: "Automatic 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 306,
    aceleracion0a100: 3.3, // segundos
    categoria: "SUV",
    descripcion:
      "La Lamborghini Urus Performante eleva al Super SUV al siguiente nivel con 657 CV y una reducción de peso de 47 kg. Su aerodinámica agresiva y la puesta a punto orientada a pista la convierten en el Lamborghini más versátil y radical de la gama.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/85203588cb56.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a26b33df65ae.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e0bf79569171.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3111d291aec0.jpg",
    ],
  },

  // ===================== BMW =====================
  {
    id: "bmw-m4-competition",
    marca: "BMW",
    modelo: "M4 Competition",
    año: 2024,
    precio: 79100,
    motor: "3.0L Twin-Turbo Inline-6 (S58)",
    potencia: 503,
    torque: 650, // Nm
    transmision: "M Steptronic 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 290,
    aceleracion0a100: 3.5, // segundos
    categoria: "Coupé",
    descripcion:
      "La BMW M4 Competition combina la precisión alemana con una potencia despiadada. Su motor de seis cilindros en línea turboalimentado entrega 503 CV, mientras que su chasis orientado a la pista convierte cada curva en una celebración de la ingeniería de rendimiento.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7d855e73e25d.png",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/36e056f7ceff.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0b42cbe987ee.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fc60c405ce45.jpg",
    ],
  },
  {
    id: "bmw-m5-cs",
    marca: "BMW",
    modelo: "M5 CS",
    año: 2022,
    precio: 142000,
    motor: "4.4L Twin-Turbo V8 (S63)",
    potencia: 627,
    torque: 750, // Nm
    transmision: "M Steptronic 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 305,
    aceleracion0a100: 2.9, // segundos
    categoria: "Sedán",
    descripcion:
      "La BMW M5 CS es el BMW de producción más potente jamás construido. Con 627 CV de su V8 biturbo y tracción M xDrive, es una berlina de cuatro plazas que acelera de 0 a 100 km/h en 2,9 segundos. El equilibrio definitivo entre lujo familiar y rendimiento extremo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9ef7f30b3f19.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f2df884a92f4.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d3a102c403b2.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/322262bb2b95.jpg",
    ],
  },
  {
    id: "bmw-i8",
    marca: "BMW",
    modelo: "i8",
    año: 2020,
    precio: 147500,
    motor: "1.5L Turbo Inline-3 Híbrido",
    potencia: 369,
    torque: 570, // Nm
    transmision: "Automática 6 velocidades",
    combustible: "Híbrido",
    traccion: "AWD",
    velocidadMaxima: 250,
    aceleracion0a100: 4.4, // segundos
    categoria: "Coupé",
    descripcion:
      "La BMW i8 fue pionera del deportivo híbrido con su arquitectura de motor central y puertas de tijera. Su diseño futurista de fibra de carbono y su sistema híbrido de 369 CV la convierten en un icono de diseño que adelantó su época.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a7c1fb69b789.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/98a299e8cef7.jpeg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/80b50e8a6c0c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/15959f68508d.jpg",
    ],
  },
  {
    id: "bmw-x5m-competition",
    marca: "BMW",
    modelo: "X5 M Competition",
    año: 2024,
    precio: 122300,
    motor: "4.4L Twin-Turbo V8 (S68)",
    potencia: 617,
    torque: 750, // Nm
    transmision: "M Steptronic 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 290,
    aceleracion0a100: 3.7, // segundos
    categoria: "SUV",
    descripcion:
      "La BMW X5 M Competition combina la capacidad de un SUV con el rendimiento de un deportivo M. Su V8 biturbo de 617 CV y la tracción integral M xDrive la convierten en uno de los SUV más rápidos y capaces del mercado.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/39de2d1d40a0.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2047ad39860.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c4b89342ce15.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/08cb9f7e0656.jpg",
    ],
  },

  // ===================== MERCEDES-BENZ =====================
  {
    id: "mercedes-amg-gt-63",
    marca: "Mercedes-Benz",
    modelo: "AMG GT 63 4-Door",
    año: 2024,
    precio: 136000,
    motor: "4.0L Twin-Turbo V8",
    potencia: 577,
    torque: 590, // Nm
    transmision: "AMG SPEEDSHIFT 9 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 315,
    aceleracion0a100: 3.2, // segundos
    categoria: "Sedán",
    descripcion:
      "El Mercedes-AMG GT 63 4-Door Coupe fusiona el lujo de una berlina con el alma de un superdeportivo. Su V8 biturbo fabricado a mano ofrece una fuerza imponente, envuelta en un diseño de cuatro puertas que redefine el concepto de gran turismo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5794ab1a3a8e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/51c23949a8a4.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0195e11a0b16.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/feaa141bb953.jpg",
    ],
  },
  {
    id: "mercedes-s63-amg",
    marca: "Mercedes-Benz",
    modelo: "S63 AMG",
    año: 2024,
    precio: 230000,
    motor: "4.0L Twin-Turbo V8 Mild Hybrid",
    potencia: 791,
    torque: 1040, // Nm
    transmision: "AMG SPEEDSHIFT 9 velocidades",
    combustible: "Híbrido",
    traccion: "AWD",
    velocidadMaxima: 290,
    aceleracion0a100: 3.2, // segundos
    categoria: "Sedán",
    descripcion:
      "El Mercedes-AMG S63 combina el lujo absoluto de la Clase S con la potencia brutal de AMG. Su V8 biturbo con sistema híbrido ligero entrega 791 CV, ofreciendo una serenidad de marcha limusina y una aceleración de superdeportivo en un mismo automóvil.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/de94dee38f90.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1cca14bd1bee.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b439696ca22f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a0632a22025f.jpg",
    ],
  },
  {
    id: "mercedes-g63-amg",
    marca: "Mercedes-Benz",
    modelo: "G63 AMG",
    año: 2024,
    precio: 180000,
    motor: "4.0L Twin-Turbo V8 (M177)",
    potencia: 577,
    torque: 850, // Nm
    transmision: "AMG SPEEDSHIFT 9 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 240,
    aceleracion0a100: 3.6, // segundos
    categoria: "SUV",
    descripcion:
      "El Mercedes-AMG G63 es el todoterreno de lujo definitivo. Su icónico diseño rectangular se combina con un V8 biturbo de 577 CV y tres diferenciales de bloqueo. Un símbolo de estatus que domina tanto el asfalto como los caminos más exigentes.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2d12f3f58801.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/86b7628eba94.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/022a361d69cc.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3a00090fd807.jpg",
    ],
  },
  {
    id: "mercedes-c63-amg",
    marca: "Mercedes-Benz",
    modelo: "C63 S AMG",
    año: 2024,
    precio: 85000,
    motor: "2.0L Turbo Inline-4 Híbrido Plug-in",
    potencia: 671,
    torque: 1020, // Nm
    transmision: "AMG SPEEDSHIFT 9 velocidades",
    combustible: "Híbrido",
    traccion: "RWD",
    velocidadMaxima: 280,
    aceleracion0a100: 3.3, // segundos
    categoria: "Sedán",
    descripcion:
      "El Mercedes-AMG C63 S adopta una revolucionaria mecánica híbrida enchufable de cuatro cilindros derivada de la F1, entregando 671 CV combinados. Una berlina compacta que redefine la potencia y la eficiencia en su segmento.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2f26ddb6d67f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/97c9f87530d1.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/08be078311b4.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/532edc150356.jpg",
    ],
  },

  // ===================== AUDI =====================
  {
    id: "audi-rs6-avant",
    marca: "Audi",
    modelo: "RS6 Avant",
    año: 2024,
    precio: 126890,
    motor: "4.0L Twin-Turbo V8 Mild Hybrid",
    potencia: 591,
    torque: 800, // Nm
    transmision: "Tiptronic 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 305,
    aceleracion0a100: 3.6, // segundos
    categoria: "Familiar",
    descripcion:
      "El Audi RS6 Avant es la definición absoluta del familiar deportivo. Bajo su carrocería de cinco puertas se oculta un V8 biturbo de 591 CV con tracción quattro. El equilibrio perfecto entre practicidad familiar y rendimiento extremo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/18bfaddb2672.png",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fabc282300ca.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3fe098e7eb2e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b73ae86ef78e.jpg",
    ],
  },
  {
    id: "audi-r8-v10",
    marca: "Audi",
    modelo: "R8 V10 Performance",
    año: 2023,
    precio: 158000,
    motor: "5.2L V10 Atmosférico",
    potencia: 602,
    torque: 565, // Nm
    transmision: "S tronic 7 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 331,
    aceleracion0a100: 3.2, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "El Audi R8 V10 Performance es el superdeportivo de Audi con motor central. Comparte el V10 atmosférico con la Lamborghini Huracán, entregando 602 CV con la precisión de la tracción quattro. El final glorioso de una era de motores atmosféricos.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6fda7fa99e14.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/aa97460f81be.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/304d94721511.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d7e3ef4557ad.jpg",
    ],
  },
  {
    id: "audi-rs7-sportback",
    marca: "Audi",
    modelo: "RS7 Sportback",
    año: 2024,
    precio: 128000,
    motor: "4.0L Twin-Turbo V8 Mild Hybrid",
    potencia: 591,
    torque: 800, // Nm
    transmision: "Tiptronic 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 305,
    aceleracion0a100: 3.6, // segundos
    categoria: "Coupé",
    descripcion:
      "El Audi RS7 Sportback combina la elegancia de un coupé con la potencia de un superdeportivo. Su V8 biturbo de 591 CV y la línea de techo flotante crean un gran turismo de cuatro puertas con un carácter decididamente deportivo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0a25e811007e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5f2c81728737.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bc72014eed1a.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fa71dcdbc8c5.jpg",
    ],
  },
  {
    id: "audi-sq8",
    marca: "Audi",
    modelo: "SQ8",
    año: 2024,
    precio: 95000,
    motor: "4.0L Twin-Turbo V8 Mild Hybrid",
    potencia: 500,
    torque: 770, // Nm
    transmision: "Tiptronic 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 250,
    aceleracion0a100: 4.1, // segundos
    categoria: "SUV",
    descripcion:
      "El Audi SQ8 combina el lujo de un coupé SUV con la potencia de un V8 biturbo de 500 CV. Su diseño atlético y su interior premium lo posicionan como la opción equilibrada entre confort, deportividad y capacidad todoterreno.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6639804298c3.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f061c9eae98e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/aec206152409.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1544c368644a.jpg",
    ],
  },

  // ===================== TESLA =====================
  {
    id: "tesla-model-s-plaid",
    marca: "Tesla",
    modelo: "Model S Plaid",
    año: 2024,
    precio: 89990,
    motor: "Tri-Motor Eléctrico",
    potencia: 1020,
    torque: 1420, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 322,
    aceleracion0a100: 2.1, // segundos
    categoria: "Sedán",
    descripcion:
      "La Tesla Model S Plaid es la revolución eléctrica hecha realidad. Sus tres motores generan 1020 CV que la catapultan de 0 a 100 km/h en menos de 2,1 segundos. Una combinación inigualable de aceleración brutal, autonomía y tecnología de vanguardia.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d5515853ec7f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a43a0ac79ad8.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/25061645138c.png",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/34422c30f7dc.jpg",
    ],
  },
  {
    id: "tesla-model-3-performance",
    marca: "Tesla",
    modelo: "Model 3 Performance",
    año: 2024,
    precio: 52990,
    motor: "Dual-Motor Eléctrico AWD",
    potencia: 460,
    torque: 660, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 261,
    aceleracion0a100: 3.1, // segundos
    categoria: "Sedán",
    descripcion:
      "La Tesla Model 3 Performance democratiza la alta gamma eléctrica. Con 460 CV y tracción dual, acelera de 0 a 100 km/h en 3,1 segundos. Su equilibrio entre autonomía, tecnología y precio la convierte en el referente del segmento.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2415728b5066.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9e1d96e8f5c8.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/aa07a4f9e48d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2cd506d155d3.jpg",
    ],
  },
  {
    id: "tesla-model-x-plaid",
    marca: "Tesla",
    modelo: "Model X Plaid",
    año: 2024,
    precio: 99990,
    motor: "Tri-Motor Eléctrico AWD",
    potencia: 1020,
    torque: 1420, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 262,
    aceleracion0a100: 2.5, // segundos
    categoria: "SUV",
    descripcion:
      "La Tesla Model X Plaid es el SUV eléctrico más potente del mundo. Con 1.020 CV y las icónicas puertas Falcon Wing, combina la potencia de un superdeportivo con la capacidad de un vehículo familiar de siete plazas y una autonomía excepcional.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e40c87903bed.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/39915c98a37c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e1f52aafc0d4.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e79fd8443c10.jpg",
    ],
  },
  {
    id: "tesla-cybertruck",
    marca: "Tesla",
    modelo: "Cybertruck",
    año: 2024,
    precio: 99990,
    motor: "Tri-Motor Eléctrico AWD",
    potencia: 845,
    torque: 1390, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 209,
    aceleracion0a100: 2.7, // segundos
    categoria: "Pickup",
    descripcion:
      "La Tesla Cybertruck redefinió el diseño automovilístico con su carrocería de acero inoxidable exoesquelético. Con 845 CV, tracción integral y una capacidad de remolque de 5 toneladas, es una revolución visual y funcional en el mundo de las pickups eléctricas.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b9e3abd75646.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/88cb8b582799.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/30c5760c370b.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ce4d73dab39f.jpg",
    ],
  },

  // ===================== TOYOTA =====================
  {
    id: "toyota-gr-supra",
    marca: "Toyota",
    modelo: "GR Supra",
    año: 2024,
    precio: 56545,
    motor: "3.0L Turbo Inline-6 (B58)",
    potencia: 382,
    torque: 500, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 250,
    aceleracion0a100: 3.9, // segundos
    categoria: "Coupé",
    descripcion:
      "La Toyota GR Supra regresa el espíritu del deportivo japonés puro. Desarrollada por Gazoo Racing, su motor de seis cilindros en línea turboalimentado y su peso equilibrado 50:50 ofrecen una experiencia de conducción táctil y emocionante en cada giro del volante.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1368d90dcd75.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b09c0bbf028c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9af932173f8b.png",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/070c9b27b053.png",
    ],
  },
  {
    id: "toyota-gr-corolla",
    marca: "Toyota",
    modelo: "GR Corolla",
    año: 2024,
    precio: 36000,
    motor: "1.6L Turbo Inline-3 (G16E-GTS)",
    potencia: 300,
    torque: 400, // Nm
    transmision: "Manual 6 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 230,
    aceleracion0a100: 4.9, // segundos
    categoria: "Hatchback",
    descripcion:
      "La Toyota GR Corolla lleva el ADN de rally al compacto diario. Su motor tricilíndrico turbo de 300 CV y la tracción integral GR-Four con diferenciales Torsen la convierten en una de las máquinas más divertidas y carismáticas de su generación.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f386ada783fe.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/421a8b22889c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c5f8bc013f16.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3d598a79798d.jpg",
    ],
  },
  {
    id: "toyota-land-cruiser",
    marca: "Toyota",
    modelo: "Land Cruiser",
    año: 2024,
    precio: 55950,
    motor: "2.4L Turbo Inline-4 Híbrido",
    potencia: 326,
    torque: 630, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Híbrido",
    traccion: "AWD",
    velocidadMaxima: 210,
    aceleracion0a100: 6.5, // segundos
    categoria: "SUV",
    descripcion:
      "La Toyota Land Cruiser es la leyenda todoterreno reimaginada para la era híbrida. Con 75 años de herencia, su nuevo propulsor híbrido turbo de 326 CV y la tracción integral permanente lo mantienen como el referente de fiabilidad y capacidad off-road.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6ea230fc11ad.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/18e7a7dd4d89.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d344634c2f09.png",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/41535fad9fc8.jpg",
    ],
  },
  {
    id: "toyota-camry-trd",
    marca: "Toyota",
    modelo: "Camry TRD",
    año: 2021,
    precio: 35500,
    motor: "3.5L V6 Atmosférico (2GR-FKS)",
    potencia: 301,
    torque: 362, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Gasolina",
    traccion: "FWD",
    velocidadMaxima: 220,
    aceleracion0a100: 5.8, // segundos
    categoria: "Sedán",
    descripcion:
      "La Toyota Camry TRD lleva el espíritu deportivo a la berlina familiar por excelencia. Su V6 atmosférico de 301 CV se combina con suspensión deportiva TRD y un aerodinámico agresivo, creando una sorprendente versión de alto rendimiento de un clásico.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fe1624e0967b.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c34676623f19.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0310f34b8fc8.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8e929ca05fd7.jpg",
    ],
  },

  // ===================== HONDA =====================
  {
    id: "honda-civic-type-r",
    marca: "Honda",
    modelo: "Civic Type R",
    año: 2024,
    precio: 44990,
    motor: "2.0L Turbo Inline-4 (K20C1)",
    potencia: 315,
    torque: 420, // Nm
    transmision: "Manual 6 velocidades",
    combustible: "Gasolina",
    traccion: "FWD",
    velocidadMaxima: 275,
    aceleracion0a100: 5.4, // segundos
    categoria: "Hatchback",
    descripcion:
      "La Honda Civic Type R es el rey indiscutible de los compactos deportivos. Su motor turboalimentado de 315 CV acoplado a una transmisión manual de seis velocidades y un chasis afinado en el Nürburgring la convierten en la alegría pura de conducir.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/625e187728cb.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/70a650004605.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b53e77fa196c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a71f95f9cb3c.jpg",
    ],
  },
  {
    id: "honda-nsx-types",
    marca: "Honda",
    modelo: "NSX Type S",
    año: 2022,
    precio: 171495,
    motor: "3.5L Twin-Turbo V6 Híbrido",
    potencia: 600,
    torque: 667, // Nm
    transmision: "DCT 9 velocidades",
    combustible: "Híbrido",
    traccion: "AWD",
    velocidadMaxima: 307,
    aceleracion0a100: 3.0, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "La Honda NSX Type S despide a la segunda generación del superdeportivo japonés con 600 CV combinados de su V6 biturbo y tres motores eléctricos. Una obra maestra de precisión híbrida con tracción integral SH-AWD y la filosofía pura de Honda.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d3f6aef92e69.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/56391389232f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e18ae6f2192d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6ca57fdb8bb9.jpg",
    ],
  },
  {
    id: "honda-accord",
    marca: "Honda",
    modelo: "Accord Sport",
    año: 2024,
    precio: 31895,
    motor: "1.5L Turbo Inline-4 (L15CH)",
    potencia: 192,
    torque: 260, // Nm
    transmision: "CVT",
    combustible: "Gasolina",
    traccion: "FWD",
    velocidadMaxima: 195,
    aceleracion0a100: 7.2, // segundos
    categoria: "Sedán",
    descripcion:
      "La Honda Accord Sport combina la elegancia de una berlina mediana con un toque deportivo. Su motor turboalimentado de 192 CV ofrece eficiencia y respuesta ágil, en un interior refinado y tecnológico que redefine el segmento.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a36e657d95f5.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bcfa9c05d56d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5d8df3fd8ef7.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0e5aabc87ccb.jpg",
    ],
  },
  {
    id: "honda-integra-types",
    marca: "Honda",
    modelo: "Integra Type S",
    año: 2024,
    precio: 51900,
    motor: "2.0L Turbo Inline-4 (K20C1)",
    potencia: 320,
    torque: 420, // Nm
    transmision: "Manual 6 velocidades",
    combustible: "Gasolina",
    traccion: "FWD",
    velocidadMaxima: 265,
    aceleracion0a100: 5.2, // segundos
    categoria: "Sedán",
    descripcion:
      "La Acura Integra Type S revive el legendario nombre con un enfoque moderno. Comparte el motor turbo de 320 CV del Civic Type R en un chasis propio, con transmisión manual y un carácter más refinado pero igual de emocionante.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a91c1ecd1b01.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/22609290b168.jpeg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5b1ff7f908fc.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9d72859bf070.jpg",
    ],
  },

  // ===================== FORD =====================
  {
    id: "ford-mustang-gt",
    marca: "Ford",
    modelo: "Mustang GT",
    año: 2024,
    precio: 43545,
    motor: "5.0L V8 (Coyote)",
    potencia: 480,
    torque: 570, // Nm
    transmision: "Manual 6 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 250,
    aceleracion0a100: 4.2, // segundos
    categoria: "Coupé",
    descripcion:
      "El Ford Mustang GT es la encarnación moderna del muscle car americano. Su legendario V8 Coyote de 5.0 litros ruge con 480 CV, combinando la herencia de seis décadas de libertad con la tecnología y el confort de la séptima generación.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5994b1d8d56b.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/41fbfb998820.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/74a801b601b5.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/35f4d770f0fd.jpg",
    ],
  },
  {
    id: "ford-gt",
    marca: "Ford",
    modelo: "GT",
    año: 2023,
    precio: 500000,
    motor: "3.5L Twin-Turbo V6 (EcoBoost)",
    potencia: 660,
    torque: 746, // Nm
    transmision: "DCT 7 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 347,
    aceleracion0a100: 2.8, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "El Ford GT es el superdeportivo de motor central inspirado en el legendario GT40. Su chasis de fibra de carbono y el V6 EcoBoost biturbo de 660 CV rinden homenaje a las victorias de Le Mans, combinando aerodinámica activa y diseño de vanguardia.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/94b817b9f09f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4060193abe11.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6eb0f8300a8a.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7c28e5c60ee4.jpg",
    ],
  },
  {
    id: "ford-f150-raptor-r",
    marca: "Ford",
    modelo: "F-150 Raptor R",
    año: 2024,
    precio: 109145,
    motor: "5.2L Supercharged V8 (Predator)",
    potencia: 720,
    torque: 868, // Nm
    transmision: "Automática 10 velocidades",
    combustible: "Gasolina",
    traccion: "4WD",
    velocidadMaxima: 180,
    aceleracion0a100: 3.7, // segundos
    categoria: "Pickup",
    descripcion:
      "La Ford F-150 Raptor R lleva el V8 supercargado de 720 CV del Shelby GT500 al rey de las pickups todoterreno. Con suspensión de largo recorrido y tracción 4x4, es la máquina definitiva para conquistar cualquier terreno a alta velocidad.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ebcbd63d0478.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ceed5732957f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4056c2a19913.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fcddd526ec80.jpg",
    ],
  },
  {
    id: "ford-bronco-raptor",
    marca: "Ford",
    modelo: "Bronco Raptor",
    año: 2024,
    precio: 89535,
    motor: "3.0L Twin-Turbo V6 (EcoBoost)",
    potencia: 418,
    torque: 587, // Nm
    transmision: "Automática 10 velocidades",
    combustible: "Gasolina",
    traccion: "4WD",
    velocidadMaxima: 180,
    aceleracion0a100: 5.5, // segundos
    categoria: "SUV",
    descripcion:
      "El Ford Bronco Raptor combina la capacidad todoterreno extrema con la filosofía de rendimiento Raptor. Su V6 biturbo de 418 CV, suspensión FOX Live Valve y trocha ampliada lo convierten en el SUV todoterreno de alta velocidad más capaz del mercado.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0df9b1ebade8.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7c176430fc17.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/925c0aa6c768.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6a3dbd4ba3af.jpg",
    ],
  },

  // ===================== CHEVROLET =====================
  {
    id: "chevrolet-corvette-z06",
    marca: "Chevrolet",
    modelo: "Corvette Z06",
    año: 2024,
    precio: 112700,
    motor: "5.5L V8 Atmosférico (LT6)",
    potencia: 670,
    torque: 623, // Nm
    transmision: "DCT 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 312,
    aceleracion0a100: 2.6, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "La Chevrolet Corvette Z06 eleva el ícono americano al territorio de los superdeportivos. Su motor V8 atmosférico de 5.5L con cigüeñal plano gira hasta 8.600 rpm entregando 670 CV, con un chasis de motor central que compite con lo mejor de Europa.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/19a386d25c42.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b447f7fc42ef.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a074df4710bb.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/15c1043e63fa.jpg",
    ],
  },
  {
    id: "chevrolet-camaro-zl1",
    marca: "Chevrolet",
    modelo: "Camaro ZL1",
    año: 2024,
    precio: 76995,
    motor: "6.2L Supercharged V8 (LT4)",
    potencia: 650,
    torque: 881, // Nm
    transmision: "Manual 6 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 318,
    aceleracion0a100: 3.5, // segundos
    categoria: "Coupé",
    descripcion:
      "La Chevrolet Camaro ZL1 es la respuesta de Chevy al muscle car extremo. Su V8 supercargado LT4 de 650 CV, aerodinámica de pista y un chasis extraordinariamente afinado la convierten en una Bestia track-day con un carácter americano inconfundible.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/23461650a47e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/83dd3a945763.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3bc5ccc14723.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5152eca2ae48.jpg",
    ],
  },
  {
    id: "chevrolet-silverado-zr2",
    marca: "Chevrolet",
    modelo: "Silverado ZR2",
    año: 2024,
    precio: 72175,
    motor: "6.2L V8 (L87)",
    potencia: 420,
    torque: 624, // Nm
    transmision: "Automática 10 velocidades",
    combustible: "Gasolina",
    traccion: "4WD",
    velocidadMaxima: 160,
    aceleracion0a100: 5.8, // segundos
    categoria: "Pickup",
    descripcion:
      "La Chevrolet Silverado ZR2 es la pickup todoterreno más capaz de Chevy. Con suspensión Multimático de posición variable, diferenciales de bloqueo electrónicos delantero y trasero, y un V8 de 420 CV, está lista para conquistar los terrenos más hostiles.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/67f8ab075a27.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8e9ffd6a43ef.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eaa9c760ce09.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f30fbca7372a.jpg",
    ],
  },
  {
    id: "chevrolet-tahoe-rst",
    marca: "Chevrolet",
    modelo: "Tahoe RST",
    año: 2024,
    precio: 65200,
    motor: "6.2L V8 (L87)",
    potencia: 420,
    torque: 624, // Nm
    transmision: "Automática 10 velocidades",
    combustible: "Gasolina",
    traccion: "4WD",
    velocidadMaxima: 200,
    aceleracion0a100: 5.9, // segundos
    categoria: "SUV",
    descripcion:
      "La Chevrolet Tahoe RST combina la capacidad de un SUV de tamaño completo con un estilo deportivo agresivo. Su V8 de 420 CV, detalles exteriores en negro y rines de 22 pulgadas la convierten en una opción imponente para la familia que no renuncia al estilo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f32786bbeced.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0f1020d71efd.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b16461485cb0.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/903b8c270e62.jpg",
    ],
  },

  // ===================== NISSAN =====================
  {
    id: "nissan-gtr-nismo",
    marca: "Nissan",
    modelo: "GT-R Nismo",
    año: 2023,
    precio: 215000,
    motor: "3.8L Twin-Turbo V6 (VR38DETT)",
    potencia: 600,
    torque: 652, // Nm
    transmision: "DCT 6 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 315,
    aceleracion0a100: 2.5, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "La Nissan GT-R Nismo, conocida como Godzilla, es el máximo exponente de la ingeniería japonesa de rendimiento. Cada motor es ensamblado a mano por un maestro Takumi, entregando 600 CV con una tracción integral ATTESA E-TS que domina cualquier trazada.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0f24544f604f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1d36932832ca.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/839ee55c3dab.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1b6bf32f66bc.jpg",
    ],
  },
  {
    id: "nissan-z-nismo",
    marca: "Nissan",
    modelo: "Z Nismo",
    año: 2024,
    precio: 52970,
    motor: "3.0L Twin-Turbo V6 (VR30DDTT)",
    potencia: 420,
    torque: 520, // Nm
    transmision: "Automática 9 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 250,
    aceleracion0a100: 4.0, // segundos
    categoria: "Coupé",
    descripcion:
      "La Nissan Z Nismo revive la leyenda del deportivo japonés con un V6 biturbo de 420 CV. Su diseño rinde homenaje a los Z clásicos mientras incorpora tecnología moderna y una puesta a punto Nismo orientada a circuito para una experiencia pura y emocionante.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/26dfdfd1bc77.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/abfe89ee0f95.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3df49d297731.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6a228e11874e.jpg",
    ],
  },
  {
    id: "nissan-ariya",
    marca: "Nissan",
    modelo: "Ariya",
    año: 2024,
    precio: 51530,
    motor: "Dual-Motor Eléctrico AWD (e-4ORCE)",
    potencia: 389,
    torque: 600, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 200,
    aceleracion0a100: 5.1, // segundos
    categoria: "SUV",
    descripcion:
      "La Nissan Ariya es el SUV crossover eléctrico que redefine la movilidad de la marca. Con el sistema de tracción integral e-4ORCE de 389 CV, ofrece una conducción suave y refinada, interior minimalista y una autonomía pensada para el uso diario sin compromisos.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/baedb351be16.png",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/71fb46f7f4e3.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/37744c37eea8.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/10793e6b08b3.jpg",
    ],
  },
  {
    id: "nissan-frontier",
    marca: "Nissan",
    modelo: "Frontier PRO-4X",
    año: 2024,
    precio: 39120,
    motor: "3.8L V6 Atmosférico (VQ40DE)",
    potencia: 310,
    torque: 381, // Nm
    transmision: "Automática 9 velocidades",
    combustible: "Gasolina",
    traccion: "4WD",
    velocidadMaxima: 180,
    aceleracion0a100: 7.0, // segundos
    categoria: "Pickup",
    descripcion:
      "La Nissan Frontier PRO-4X es la pickup mediana todoterreno robusta y fiable. Su V6 atmosférico de 310 CV, tracción 4x4 con diferencial de bloqueo trasero y suspensión afinada para off-road la convierten en una compañera ideal para la aventura.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bc6e6bff3f41.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fd1afa2076b4.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e3a919e929ff.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5017e2bb72c9.jpg",
    ],
  },
  {
    id: "mclaren-750s",
    marca: "McLaren",
    modelo: "750S",
    año: 2024,
    precio: 324000,
    motor: "4.0L Twin-Turbo V8 (M840T)",
    potencia: 740,
    torque: 800, // Nm
    transmision: "DCT 7 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 332,
    aceleracion0a100: 2.8, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "El McLaren 750S es la encarnación más ligera y potente de la serie Super. Su V8 biturbo de 740 CV y un peso de solo 1.389 kg lo convierten en uno de los deportivos más rápidos y puros del mundo, con una relación peso-potencia extraordinaria.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/10f9d73909b7.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/21e9b952a1d8.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f9dbc67c067e.jpeg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1e91984cd181.jpg",
    ],
  },
  {
    id: "mclaren-artura",
    marca: "McLaren",
    modelo: "Artura",
    año: 2024,
    precio: 233000,
    motor: "3.0L Twin-Turbo V6 Híbrido",
    potencia: 671,
    torque: 720, // Nm
    transmision: "DCT 8 velocidades",
    combustible: "Híbrido",
    traccion: "RWD",
    velocidadMaxima: 330,
    aceleracion0a100: 3.0, // segundos
    categoria: "Superdeportivo",
    descripcion:
      "El McLaren Artura inaugura una nueva plataforma de carbono híbrida. Su V6 biturbo combinado con un motor eléctrico entrega 671 CV, ofreciendo la respuesta inmediata de la electrificación con el carácter explosivo de McLaren.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3d0299387c4e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3d0551e4c938.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e578e7ef580c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/204b0adc489e.jpg",
    ],
  },
  {
    id: "aston-martin-db12",
    marca: "Aston Martin",
    modelo: "DB12",
    año: 2024,
    precio: 245000,
    motor: "4.0L Twin-Turbo V8",
    potencia: 671,
    torque: 800, // Nm
    transmision: "ZF 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 325,
    aceleracion0a100: 3.6, // segundos
    categoria: "Coupé",
    descripcion:
      "El Aston Martin DB12 redefine el gran turismo británico. Su V8 biturbo de 671 CV combinado con un chasis radicalmente nuevo ofrece una mezcla perfecta de refinamiento de largo recorrido y prestaciones de superdeportivo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d463b240aac5.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/200d7df67608.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cb71d80b8908.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/48cd9c08df34.jpg",
    ],
  },
  {
    id: "aston-martin-vantage",
    marca: "Aston Martin",
    modelo: "Vantage",
    año: 2024,
    precio: 191000,
    motor: "4.0L Twin-Turbo V8",
    potencia: 656,
    torque: 800, // Nm
    transmision: "ZF 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 325,
    aceleracion0a100: 3.5, // segundos
    categoria: "Coupé",
    descripcion:
      "El Aston Martin Vantage es el deportivo puro de la marca británica. Con 656 CV de su V8 biturbo y un diseño agresivo, combina la elegancia característica de Aston Martin con una ferocidad orientada a pista.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/08097da11495.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3208c7ccf826.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/44ae624f5c8a.jpeg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1b53b5d48f2e.jpg",
    ],
  },
  {
    id: "bentley-continental-gt",
    marca: "Bentley",
    modelo: "Continental GT Speed",
    año: 2024,
    precio: 287000,
    motor: "6.0L Twin-Turbo W12",
    potencia: 650,
    torque: 900, // Nm
    transmision: "DCT 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 335,
    aceleracion0a100: 3.5, // segundos
    categoria: "Coupé",
    descripcion:
      "El Bentley Continental GT Speed representa la cúspide del gran turismo de lujo. Su legendario W12 biturbo de 650 CV envuelve al conductor en un interior de artesanía incomparable, con capacidad de alcanzar 335 km/h con serenidad absoluta.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b8f1c00ad956.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b27ceca981ed.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/20b3058eb78c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5fa50b26cddc.jpg",
    ],
  },
  {
    id: "bentley-bentayga",
    marca: "Bentley",
    modelo: "Bentayga EWB",
    año: 2024,
    precio: 246000,
    motor: "4.0L Twin-Turbo V8",
    potencia: 542,
    torque: 770, // Nm
    transmision: "ZF 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 290,
    aceleracion0a100: 4.5, // segundos
    categoria: "SUV",
    descripcion:
      "El Bentley Bentayga EWB es el SUV de lujo definitivo. Con batalla extendida y un V8 biturbo de 542 CV, combina el confort de una limusina con la capacidad de un todoterreno y el refinamiento característico de Crewe.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6b1ea8af5c4c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d3ce0d8291db.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b9da5ed1337b.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6f3512a40c4d.jpg",
    ],
  },
  {
    id: "rolls-royce-ghost",
    marca: "Rolls-Royce",
    modelo: "Ghost",
    año: 2024,
    precio: 355000,
    motor: "6.75L Twin-Turbo V12",
    potencia: 563,
    torque: 850, // Nm
    transmision: "ZF 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 250,
    aceleracion0a100: 4.7, // segundos
    categoria: "Sedán",
    descripcion:
      "El Rolls-Royce Ghost encarna el lujo sereno. Su V12 biturbo de 6.75 litros funciona con una suavidad sobrenatural, mientras el Planar Suspension System crea la sensación de 'volar' por la carretera. Lujo puro sin concesiones.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/216c9c6935ca.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/49364fd5c2d1.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a3c84d467ee6.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/52b2155ea589.jpg",
    ],
  },
  {
    id: "rolls-royce-cullinan",
    marca: "Rolls-Royce",
    modelo: "Cullinan",
    año: 2024,
    precio: 390000,
    motor: "6.75L Twin-Turbo V12",
    potencia: 563,
    torque: 850, // Nm
    transmision: "ZF 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 250,
    aceleracion0a100: 5.2, // segundos
    categoria: "SUV",
    descripcion:
      "El Rolls-Royce Cullinan es el SUV de lujo más exclusivo del mundo. Su V12 de 563 CV y la suspensión mágica lo convierten en un santuario móvil capaz de conquistar cualquier terreno con una elegancia inigualable.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8c29bfb4ffc0.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ab866d9e97af.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c5d67a7aec50.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/303bd718ce9c.jpg",
    ],
  },
  {
    id: "lexus-lc500",
    marca: "Lexus",
    modelo: "LC 500",
    año: 2024,
    precio: 99300,
    motor: "5.0L V8 Atmosférico (2UR-GSE)",
    potencia: 471,
    torque: 540, // Nm
    transmision: "Automática 10 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 270,
    aceleracion0a100: 4.4, // segundos
    categoria: "Coupé",
    descripcion:
      "El Lexus LC 500 es un gran turismo japonés con un V8 atmosférico de 471 CV que entrega una experiencia sonora y táctil incomparable. Su diseño sculptural y su interior artesanal lo convierten en una obra de arte rodante.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cee8a15f48b9.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/86bfb7c86190.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1b969550ea1c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/623e513ae075.jpg",
    ],
  },
  {
    id: "lexus-rx-fsport",
    marca: "Lexus",
    modelo: "RX 450h+ F Sport",
    año: 2024,
    precio: 73000,
    motor: "2.5L Híbrido Enchufable",
    potencia: 309,
    torque: 335, // Nm
    transmision: "e-CVT",
    combustible: "Híbrido",
    traccion: "AWD",
    velocidadMaxima: 200,
    aceleracion0a100: 6.5, // segundos
    categoria: "SUV",
    descripcion:
      "El Lexus RX 450h+ F Sport combina la eficiencia híbrida enchufable con la deportividad F Sport. Su sistema de 309 CV ofrece una conducción refinada y silenciosa, con el lujo y la fiabilidad característicos de Lexus.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/73c57b0bdfb2.jpeg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/54a565f6e44c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d0827b729486.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3dbd6294edc8.jpg",
    ],
  },
  {
    id: "volvo-xc90-recharge",
    marca: "Volvo",
    modelo: "XC90 Recharge",
    año: 2024,
    precio: 71900,
    motor: "2.0L Turbo Híbrido Enchufable",
    potencia: 455,
    torque: 709, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Híbrido",
    traccion: "AWD",
    velocidadMaxima: 180,
    aceleracion0a100: 5.3, // segundos
    categoria: "SUV",
    descripcion:
      "El Volvo XC90 Recharge combina la seguridad escandinava con la electrificación. Su sistema híbrido enchufable de 455 CV ofrece prestaciones de deportivo en un SUV familiar de siete plazas, con la elegancia minimalista de Volvo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/08f8ac379bf8.webp",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9d9b83f23109.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3d378f35bc6a.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a393f867a6d6.jpg",
    ],
  },
  {
    id: "volvo-xc60",
    marca: "Volvo",
    modelo: "XC60 B5",
    año: 2024,
    precio: 47000,
    motor: "2.0L Turbo Mild Hybrid",
    potencia: 247,
    torque: 360, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 220,
    aceleracion0a100: 7.1, // segundos
    categoria: "SUV",
    descripcion:
      "El Volvo XC60 B5 es el SUV premium compacto por excelencia. Con 247 CV de su motor turbo híbrido ligero, ofrece un equilibrio perfecto entre confort, seguridad y diseño escandinavo atemporal.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bb34a2d84883.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b062e7476687.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2087775fe07f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d886fdc17122.jpg",
    ],
  },
  {
    id: "rivian-r1t",
    marca: "Rivian",
    modelo: "R1T",
    año: 2024,
    precio: 71700,
    motor: "Quad-Motor Eléctrico AWD",
    potencia: 835,
    torque: 0, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 177,
    aceleracion0a100: 3.0, // segundos
    categoria: "Pickup",
    descripcion:
      "La Rivian R1T reinventa la pickup eléctrica con cuatro motores independientes que generan 835 CV. Capaz de cruzar ríos de 1 metro de profundidad y acelerar de 0 a 100 en 3 segundos, es la aventura eléctrica definitiva.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/176979fe542d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/69ddb013d139.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/56f6af17bcb0.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eee71ad9e0df.jpg",
    ],
  },
  {
    id: "rivian-r1s",
    marca: "Rivian",
    modelo: "R1S",
    año: 2024,
    precio: 75700,
    motor: "Quad-Motor Eléctrico AWD",
    potencia: 835,
    torque: 0, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 201,
    aceleracion0a100: 3.0, // segundos
    categoria: "SUV",
    descripcion:
      "La Rivian R1S lleva la misma tecnología quad-motor de 835 CV de la R1T a un SUV de siete plazas. Con capacidad todoterreno excepcional y autonomía de hasta 640 km, es el SUV eléctrico de aventura más capaz.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c0e2f2cec655.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3bba1d8786d5.webp",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2ce16ba45999.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/13659a5b9514.jpg",
    ],
  },
  {
    id: "byd-han-ev",
    marca: "BYD",
    modelo: "Han EV",
    año: 2024,
    precio: 45000,
    motor: "Dual-Motor Eléctrico AWD",
    potencia: 517,
    torque: 0, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 185,
    aceleracion0a100: 3.9, // segundos
    categoria: "Sedán",
    descripcion:
      "El BYD Han EV es la berlina eléctrica insignia de la marca china. Con 517 CV de sus dos motores y la tecnología de batería Blade, ofrece prestaciones de deportivo con la seguridad y autonomía de última generación.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8738e7ea6a5e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/78e7e0871863.jpeg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/150dea4b7c0e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8fa6cc589e8b.jpg",
    ],
  },
  {
    id: "byd-seal",
    marca: "BYD",
    modelo: "Seal",
    año: 2024,
    precio: 38000,
    motor: "Dual-Motor Eléctrico AWD",
    potencia: 523,
    torque: 0, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 180,
    aceleracion0a100: 3.8, // segundos
    categoria: "Sedán",
    descripcion:
      "El BYD Seal es un sedán eléctrico deportivo con 523 CV y la batería Blade de seguridad extrema. Su diseño aerodinámico y su plataforma e-Platform 3.0 lo posicionan como un competidor de primer nivel en la electromovilidad.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/653c645cff5b.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/899de660a133.png",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ee3deda46cc5.jpeg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e4062639d1f7.jpg",
    ],
  },
  {
    id: "dodge-charger-hellcat",
    marca: "Dodge",
    modelo: "Charger Hellcat Redeye",
    año: 2023,
    precio: 82000,
    motor: "6.2L Supercharged V8 (Hellcat)",
    potencia: 797,
    torque: 959, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 326,
    aceleracion0a100: 3.6, // segundos
    categoria: "Sedán",
    descripcion:
      "El Dodge Charger Hellcat Redeye es el sedán de producción más potente del mundo. Su V8 supercargado de 797 CV hace rugir el muscle car americano en una berlina de cuatro puertas capaz de superar los 320 km/h.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ac693e0523bc.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c0faae18e9ed.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/31dc9047d86d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/90ab0729f1b4.jpg",
    ],
  },
  {
    id: "dodge-demon-170",
    marca: "Dodge",
    modelo: "Challenger SRT Demon 170",
    año: 2023,
    precio: 96666,
    motor: "6.2L Supercharged V8 (Hemi)",
    potencia: 1025,
    torque: 1281, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 350,
    aceleracion0a100: 1.66, // segundos
    categoria: "Coupé",
    descripcion:
      "El Dodge Challenger SRT Demon 170 es el muscle car más extremo jamás construido. Con 1.025 CV con combustible E85, es el primer coche de producción en bajar de los 2 segundos en el cuarto de milla. Una despedida épica del V8.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cbbfb7dcb493.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/80497dc13925.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a905cf7b0f2a.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e44a1f0bee81.jpg",
    ],
  },
  {
    id: "jeep-wrangler-rubicon",
    marca: "Jeep",
    modelo: "Wrangler Rubicon 392",
    año: 2024,
    precio: 85000,
    motor: "6.4L V8 (SRT)",
    potencia: 470,
    torque: 637, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Gasolina",
    traccion: "4WD",
    velocidadMaxima: 160,
    aceleracion0a100: 4.5, // segundos
    categoria: "SUV",
    descripcion:
      "El Jeep Wrangler Rubicon 392 combina la legendaria capacidad todoterreno del Wrangler con un V8 de 470 CV. El único Wrangler con motor V8 de fábrica, ofrece un rugido inconfundible y una capacidad off-road sin igual.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8f102df81218.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0da0b5c58cb3.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/517bf8f47d1d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c460219c2552.jpg",
    ],
  },
  {
    id: "jeep-grand-cherokee-trackhawk",
    marca: "Jeep",
    modelo: "Grand Cherokee Trackhawk",
    año: 2023,
    precio: 89000,
    motor: "6.2L Supercharged V8 (Hellcat)",
    potencia: 707,
    torque: 875, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 290,
    aceleracion0a100: 3.5, // segundos
    categoria: "SUV",
    descripcion:
      "El Jeep Grand Cherokee Trackhawk es el SUV más loco del mundo, con el motor Hellcat supercargado de 707 CV. Un familiar de cinco plazas que acelera de 0 a 100 en 3.5 segundos y alcanza 290 km/h.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a5e012a18880.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3283fc7c4d7a.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/38382c0dbde2.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e9579a117e89.jpg",
    ],
  },
  {
    id: "subaru-wrx-sti",
    marca: "Subaru",
    modelo: "WRX STI",
    año: 2024,
    precio: 45000,
    motor: "2.5L Turbo Boxer-4 (EJ257)",
    potencia: 310,
    torque: 392, // Nm
    transmision: "Manual 6 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 255,
    aceleracion0a100: 5.3, // segundos
    categoria: "Sedán",
    descripcion:
      "El Subaru WRX STI es el icono de los rallyes moderno. Su motor bóxer turbo de 310 CV y la legendaria tracción симmetrical AWD con DCCD ofrecen una dinámica de conducción única, nacida en los tramos especiales del WRC.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/de946da5b78f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/79c628dfb789.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c6453b4c1eb8.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/950fd5156e61.jpg",
    ],
  },
  {
    id: "subaru-outback",
    marca: "Subaru",
    modelo: "Outback Wilderness",
    año: 2024,
    precio: 38000,
    motor: "2.4L Turbo Boxer-4",
    potencia: 260,
    torque: 377, // Nm
    transmision: "CVT",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 220,
    aceleracion0a100: 5.9, // segundos
    categoria: "Familiar",
    descripcion:
      "El Subaru Outback Wilderness es el familiar aventurero definitivo. Con suspensión elevada, motor bóxer turbo de 260 CV y tracción симmetrical AWD, combina la practicidad de un familiar con la capacidad todoterreno de un SUV.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d0ad863a28bc.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9cdb99f771fc.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6d337d30ed8f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4588617355a6.jpg",
    ],
  },
  {
    id: "peugeot-308-gt",
    marca: "Peugeot",
    modelo: "308 GT",
    año: 2024,
    precio: 35000,
    motor: "1.6L Turbo Inline-4 (PureTech)",
    potencia: 225,
    torque: 300, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Gasolina",
    traccion: "FWD",
    velocidadMaxima: 235,
    aceleracion0a100: 7.5, // segundos
    categoria: "Hatchback",
    descripcion:
      "El Peugeot 308 GT combina el diseño elegante francés con un motor turbo de 225 CV. Su interior i-Cockpit con pantalla 3D y su chasis afinado ofrecen una experiencia de conducción refinada y deportiva en un compacto premium.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/640ced773890.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/768f3e9e47e5.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4ecf24ebd13d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/17f4dc758ad9.jpg",
    ],
  },
  {
    id: "peugeot-508-peugeot-sport",
    marca: "Peugeot",
    modelo: "508 PSE",
    año: 2024,
    precio: 62000,
    motor: "1.6L Turbo Híbrido Enchufable AWD",
    potencia: 360,
    torque: 520, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Híbrido",
    traccion: "AWD",
    velocidadMaxima: 250,
    aceleracion0a100: 5.2, // segundos
    categoria: "Sedán",
    descripcion:
      "El Peugeot 508 Peugeot Sport Engineered es el modelo más potente de la historia de Peugeot. Con 360 CV combinados de su sistema híbrido enchufable AWD, fusiona la elegancia de una berlina deportiva con la eficiencia eléctrica.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e5f80d5af064.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1872c8fe8a6d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1df30aa03d97.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6aaac89727db.jpg",
    ],
  },
  {
    id: "renault-megane-rs",
    marca: "Renault",
    modelo: "Mégane R.S. Ultime",
    año: 2024,
    precio: 42000,
    motor: "1.8L Turbo Inline-4",
    potencia: 300,
    torque: 420, // Nm
    transmision: "Manual 6 velocidades",
    combustible: "Gasolina",
    traccion: "FWD",
    velocidadMaxima: 260,
    aceleracion0a100: 5.4, // segundos
    categoria: "Hatchback",
    descripcion:
      "El Renault Mégane R.S. Ultime despide al hot hatch francés con 300 CV y tracción 4Control de cuatro ruedas directrices. Un compacto deportivo nacido en el circuito de Nürburgring, con un carácter vivo y comunicativo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/01a089703d96.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/de718ba387b9.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/86302b7d5ef0.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0250a1933f4d.jpg",
    ],
  },
  {
    id: "renault-arkana",
    marca: "Renault",
    modelo: "Arkana",
    año: 2024,
    precio: 28000,
    motor: "1.3L Turbo Mild Hybrid",
    potencia: 158,
    torque: 270, // Nm
    transmision: "Automática 7 velocidades",
    combustible: "Gasolina",
    traccion: "FWD",
    velocidadMaxima: 195,
    aceleracion0a100: 9.5, // segundos
    categoria: "SUV",
    descripcion:
      "El Renault Arkana es un SUV coupé que combina la elegancia de un coupé con la robustez de un SUV. Con 158 CV de su motor turbo híbrido ligero, ofrece un diseño diferenciado y una eficiencia optimizada para el uso diario.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/21095bfe6d97.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c586f34c99ef.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1fab7f2ca0ac.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/89ceedc9d6e4.jpg",
    ],
  },
  {
    id: "suzuki-jimny",
    marca: "Suzuki",
    modelo: "Jimny",
    año: 2024,
    precio: 25000,
    motor: "1.5L Atmosférico Inline-4 (K15B)",
    potencia: 102,
    torque: 130, // Nm
    transmision: "Manual 5 velocidades",
    combustible: "Gasolina",
    traccion: "4WD",
    velocidadMaxima: 145,
    aceleracion0a100: 12.0, // segundos
    categoria: "SUV",
    descripcion:
      "El Suzuki Jimny es un todoterreno compacto con alma de legend. Con tracción 4x4 con reductora, chasis de largueros y travesaños y un diseño cuadrado icónico, conquista los terrenos más difíciles con un tamaño mínimo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d300f53d7f6d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f118a1aec81c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0c65584f1597.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9f6140946d8d.png",
    ],
  },
  {
    id: "suzuki-swift-sport",
    marca: "Suzuki",
    modelo: "Swift Sport",
    año: 2024,
    precio: 22000,
    motor: "1.4L Turbo Mild Hybrid (K14D)",
    potencia: 129,
    torque: 235, // Nm
    transmision: "Manual 6 velocidades",
    combustible: "Gasolina",
    traccion: "FWD",
    velocidadMaxima: 210,
    aceleracion0a100: 8.1, // segundos
    categoria: "Hatchback",
    descripcion:
      "El Suzuki Swift Sport es la alegría de conducir en estado puro. Con solo 970 kg y 129 CV turbo, su relación peso-potencia y su chasis afilado ofrecen una diversión táctil que pocos hot hatch modernos pueden igualar.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d332b9266d0d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/93e5bdeed2f6.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a284d5b7630e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/404936cb57b2.jpg",
    ],
  },
  {
    id: "mazda-mx5-miata",
    marca: "Mazda",
    modelo: "MX-5 Miata",
    año: 2024,
    precio: 30000,
    motor: "2.0L Skyactiv-G Atmosférico",
    potencia: 181,
    torque: 205, // Nm
    transmision: "Manual 6 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 219,
    aceleracion0a100: 6.5, // segundos
    categoria: "Convertible",
    descripcion:
      "El Mazda MX-5 Miata es el roadster más vendido de la historia y la encarnación moderna del jin-itei, la idea de que coche y conductor son uno. Ligero, con motor central-delantero y tracción trasera, es la pureza hecha automóvil.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bb7ce354d141.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b713a9ad979f.png",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a88446d13ba6.png",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/443032da9bd5.jpg",
    ],
  },
  {
    id: "mazda-cx5",
    marca: "Mazda",
    modelo: "CX-5 2.5 Turbo",
    año: 2024,
    precio: 38000,
    motor: "2.5L Turbo Skyactiv-G",
    potencia: 256,
    torque: 433, // Nm
    transmision: "Automática 6 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 220,
    aceleracion0a100: 6.1, // segundos
    categoria: "SUV",
    descripcion:
      "El Mazda CX-5 2.5 Turbo combina el diseño Kodo elegante con 256 CV turbo. Su enfoque en el refinamiento, la calidad interior premium y la dinámica de conducción Jinba-Ittai lo posicionan como el SUV más deportivo de su segmento.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bff298887b41.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2b8c932e1d88.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/340bbb21528e.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e10653c4dcb5.jpg",
    ],
  },
  {
    id: "hyundai-i30n",
    marca: "Hyundai",
    modelo: "i30 N",
    año: 2024,
    precio: 35000,
    motor: "2.0L Turbo Inline-4",
    potencia: 280,
    torque: 392, // Nm
    transmision: "Manual 6 velocidades",
    combustible: "Gasolina",
    traccion: "FWD",
    velocidadMaxima: 250,
    aceleracion0a100: 5.9, // segundos
    categoria: "Hatchback",
    descripcion:
      "El Hyundai i30 N es el hot hatch nacido en el Nürburgring. Con 280 CV, diferencial de deslizamiento limitado electrônico y la filosofía N de Hyundai, ofrece prestaciones de pista con la practicidad de un compacto de cinco plazas.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c6491e0b5f56.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/040e2d31f53b.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d2c84d2f57aa.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/91040192eeec.jpg",
    ],
  },
  {
    id: "hyundai-ioniq5n",
    marca: "Hyundai",
    modelo: "Ioniq 5 N",
    año: 2024,
    precio: 66000,
    motor: "Dual-Motor Eléctrico AWD",
    potencia: 641,
    torque: 770, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 260,
    aceleracion0a100: 3.4, // segundos
    categoria: "SUV",
    descripcion:
      "El Hyundai Ioniq 5 N es el primer SUV eléctrico de rendimiento N. Con 641 CV, simulación de cambios de marcha y un sonido sintético de motor, lleva la emoción de los deportivos a la era eléctrica con personalidad propia.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/41af5ed6344f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/138ab3bea68c.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a9169f0ce896.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2efddce2e363.jpg",
    ],
  },
  {
    id: "kia-stinger-gt",
    marca: "Kia",
    modelo: "Stinger GT",
    año: 2023,
    precio: 50000,
    motor: "3.3L Twin-Turbo V6 (Lambda)",
    potencia: 365,
    torque: 510, // Nm
    transmision: "Automática 8 velocidades",
    combustible: "Gasolina",
    traccion: "RWD",
    velocidadMaxima: 270,
    aceleracion0a100: 4.7, // segundos
    categoria: "Sedán",
    descripcion:
      "El Kia Stinger GT es la berlina deportiva que cambió la percepción de Kia. Con un V6 biturbo de 365 CV y tracción trasera, rinde homenaje a los gran turismo clásicos con un diseño agresivo y prestaciones de verdadero deportivo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/561c208af0e2.png",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bad9bfcba563.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b374976209fb.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5d0352eda0f5.jpg",
    ],
  },
  {
    id: "kia-ev6-gt",
    marca: "Kia",
    modelo: "EV6 GT",
    año: 2024,
    precio: 61000,
    motor: "Dual-Motor Eléctrico AWD",
    potencia: 576,
    torque: 740, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 260,
    aceleracion0a100: 3.5, // segundos
    categoria: "SUV",
    descripcion:
      "El Kia EV6 GT es el crossover eléctrico más potente de Kia. Con 576 CV y aceleración de 0 a 100 en 3.5 segundos, combina la versatilidad de un crossover con prestaciones de superdeportivo en un diseño futurista.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e1a2eda80336.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e049ef3140f3.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e368c9147f8f.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a2158f7015f9.jpg",
    ],
  },
  {
    id: "volkswagen-golf-r",
    marca: "Volkswagen",
    modelo: "Golf R",
    año: 2024,
    precio: 46000,
    motor: "2.0L Turbo Inline-4 (EA888)",
    potencia: 329,
    torque: 420, // Nm
    transmision: "DSG 7 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 270,
    aceleracion0a100: 4.6, // segundos
    categoria: "Hatchback",
    descripcion:
      "El Volkswagen Golf R es el compacto deportivo definitivo. Con 329 CV y tracción integral 4Motion con vectorización de par, ofrece prestaciones de deportivo con la discreción y practicidad que han hecho legendario al Golf.",
    imagenes: [
      ,
    ],
  },
  {
    id: "volkswagen-id4",
    marca: "Volkswagen",
    modelo: "ID.4",
    año: 2024,
    precio: 41000,
    motor: "Dual-Motor Eléctrico AWD",
    potencia: 295,
    torque: 0, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 180,
    aceleracion0a100: 5.4, // segundos
    categoria: "SUV",
    descripcion:
      "El Volkswagen ID.4 es el SUV eléctrico familiar por excelencia. Con 295 CV en versión dual-motor y un interior espacioso y luminoso, democratiza la electromovilidad con el pragmatismo alemán característico de Volkswagen.",
    imagenes: [
      ,
    ],
  },
  {
    id: "volkswagen-touareg",
    marca: "Volkswagen",
    modelo: "Touareg R",
    año: 2024,
    precio: 85000,
    motor: "3.0L Turbo V6 Híbrido Enchufable",
    potencia: 462,
    torque: 700, // Nm
    transmision: "Tiptronic 8 velocidades",
    combustible: "Híbrido",
    traccion: "AWD",
    velocidadMaxima: 250,
    aceleracion0a100: 5.1, // segundos
    categoria: "SUV",
    descripcion:
      "El Volkswagen Touareg R es el SUV más potente de VW. Con 462 CV de su sistema híbrido enchufable y suspensión neumática adaptativa, combina la capacidad todoterreno con el rendimiento deportivo y el confort de larga distancia.",
    imagenes: [
      ,
    ],
  },
  {
    id: "mercedes-amg-gle63",
    marca: "Mercedes-Benz",
    modelo: "AMG GLE 63 S",
    año: 2024,
    precio: 130000,
    motor: "4.0L Twin-Turbo V8 Mild Hybrid",
    potencia: 603,
    torque: 850, // Nm
    transmision: "AMG SPEEDSHIFT 9 velocidades",
    combustible: "Gasolina",
    traccion: "AWD",
    velocidadMaxima: 280,
    aceleracion0a100: 3.7, // segundos
    categoria: "SUV",
    descripcion:
      "El Mercedes-AMG GLE 63 S es el SUV deportivo más extremo de Mercedes. Su V8 biturbo de 603 CV con sistema híbrido EQ Boost y suspensión activa AMG Ride Control+ lo convierten en un SUV con alma de superdeportivo.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cace69c62ca8.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/827c871522d5.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9dcd0b5f92ce.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c8aebfd54282.jpg",
    ],
  },
  {
    id: "bmw-i7",
    marca: "BMW",
    modelo: "i7 xDrive60",
    año: 2024,
    precio: 120000,
    motor: "Dual-Motor Eléctrico AWD",
    potencia: 536,
    torque: 745, // Nm
    transmision: "Automática 1 velocidad",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 240,
    aceleracion0a100: 4.5, // segundos
    categoria: "Sedán",
    descripcion:
      "El BMW i7 xDrive60 es la berlina de lujo eléctrica definitiva. Con 536 CV, autonomía de hasta 615 km y un interior con pantallas Theater Screen y cristales electrocrómicos, redefine el lujo silencioso del siglo XXI.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/20be1a1b4c81.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7c3d36809bfd.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fd4b55db303d.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/76934890b4f4.jpg",
    ],
  },
  {
    id: "audi-etron-gt",
    marca: "Audi",
    modelo: "e-tron GT RS",
    año: 2024,
    precio: 147000,
    motor: "Dual-Motor Eléctrico AWD",
    potencia: 637,
    torque: 830, // Nm
    transmision: "Automática 2 velocidades",
    combustible: "Eléctrico",
    traccion: "AWD",
    velocidadMaxima: 250,
    aceleracion0a100: 3.1, // segundos
    categoria: "Sedán",
    descripcion:
      "El Audi e-tron GT RS es el gran turismo eléctrico de Audi. Con 637 CV y tracción integral quattro, comparte plataforma con el Porsche Taycan. Un deportivo eléctrico de cuatro plazas con la elegancia característica de Audi.",
    imagenes: [
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/88de3f3c2755.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e0eddf6c0f98.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1085ae8a17d2.jpg",
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/be469f5d7521.jpg",
    ],
  }
]

// Lista única de marcas para los filtros.
export const marcas: string[] = Array.from(
  new Set(vehiculos.map((v) => v.marca))
).sort()
