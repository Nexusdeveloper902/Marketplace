/** Static brand descriptions, preserved from the original brands data layer. */
const BRAND_DESCRIPTIONS = {
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

const DEFAULT_DESCRIPTION = "Fabricante de automóviles de alta gama."

function brandDescription(name) {
  return BRAND_DESCRIPTIONS[name] ?? DEFAULT_DESCRIPTION
}

module.exports = { BRAND_DESCRIPTIONS, brandDescription }
