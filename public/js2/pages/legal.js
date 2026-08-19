/**
 * Legal pages (privacidad + terminos) — port of the LegalShell + the two
 * static content pages. The body content is identical to the original.
 */
import { renderShell } from "../layout.js"
import { icon } from "../icons.js"
import { hydrateReveals } from "../ui.js"

const ACTUALIZADO = "1 de junio de 2026"

const CONTENIDO = {
  privacidad: {
    titulo: "Política de Privacidad",
    intro: "En Digital Marketplace respetamos tu privacidad. Esta política explica qué datos recopilamos, cómo los usamos y qué derechos tienes sobre ellos, en cumplimiento del Reglamento General de Protección de Datos (RGPD/UE 2016/679).",
    secciones: [
      { h: "1. Responsable del tratamiento", p: ["El responsable del tratamiento de tus datos personales es <strong>Digital Marketplace</strong>. Al tratarse de una experiencia de compra simulada, los datos que facilitas se usan únicamente para el funcionamiento de la demo y no se comparten con terceros con fines comerciales."] },
      { h: "2. Datos que recopilamos", list: [
        "<strong>Cuenta:</strong> nombre, correo electrónico y contraseña (almacenada con hash scrypt, nunca en texto plano) cuando creas una cuenta.",
        "<strong>Pedidos:</strong> datos de contacto (nombre, email, teléfono) que facilitas durante el checkout para gestionar tus compras simuladas.",
        "<strong>Preferencias:</strong> tus favoritos, comparaciones y garaje, guardados en tu navegador o en tu cuenta.",
        "<strong>Analítica:</strong> métricas de uso anónimas y agregadas (páginas vistas, eventos) mediante cookies propias de análisis. No vendemos ni compartimos datos personales con terceros con fines comerciales.",
      ] },
      { h: "3. Finalidad del tratamiento", p: ["Tratamos tus datos para: gestionar tu cuenta y autenticarte, procesar y conservar tus pedidos, ofrecer la experiencia personalizada (favoritos, garaje) y mejorar el servicio mediante analítica anónima. La base legal es la ejecución de un contrato (tu cuenta y pedidos) y nuestro interés legítimo en mejorar el producto (analítica)."] },
      { h: "4. Cookies", p: ["Usamos cookies técnicas esenciales para el funcionamiento del sitio (sesión y preferencias) y cookies de análisis anónimo. Puedes aceptar o rechazar el análisis desde el banner de cookies que aparece en tu primera visita. Tu elección se guarda en tu navegador."] },
      { h: "5. Conservación de los datos", p: ["Conservamos tus datos mientras mantengas la cuenta activa y el tiempo necesario para cumplir con obligaciones legales o fiscales. Puedes solicitar su eliminación en cualquier momento."] },
      { h: "6. Tus derechos", p: ["Como interesado tienes derecho a acceder, rectificar, suprimir, oponerte, limitar y portar tus datos personales, así como a retirar el consentimiento prestado. También puedes reclamar ante la Agencia Española de Protección de Datos (AEPD)."] },
      { h: "7. Seguridad", p: ["Aplicamos medidas técnicas y organizativas adecuadas: contraseñas con hash scrypt, sesiones firmadas, acceso restringido a datos y comunicación cifrada (HTTPS). Ningún método es absolutamente seguro, pero trabajamos para proteger tu información."] },
      { h: "8. Naturaleza simulada", p: ["Digital Marketplace es una experiencia de compra simulada: no se realizan cobros reales ni transacciones financieras. Los datos de pago no se almacenan ni se procesan; los datos de contacto se usan únicamente para simular y mostrar tus pedidos."] },
    ],
  },
  terminos: {
    titulo: "Términos y Condiciones",
    intro: "Estos términos regulan el acceso y uso de Digital Marketplace. Al navegar o crear una cuenta aceptas quedar vinculado por ellos.",
    secciones: [
      { h: "1. Aceptación", p: ["El acceso a este sitio implica la aceptación de los presentes términos y la política de privacidad. Si no estás de acuerdo, te pedimos que no uses el sitio."] },
      { h: "2. Titular", p: ["El titular de este sitio es <strong>Digital Marketplace</strong>, una experiencia de compra simulada."] },
      { h: "3. Naturaleza simulada", p: ["Digital Marketplace es una plataforma de demostración. Los vehículos mostrados, precios, existencias y compras son simulados: no se realizan transacciones reales, ni cobros, ni entregas. El checkout no procesa pagos ni almacena datos de tarjeta."] },
      { h: "4. Cuentas de usuario", p: ["Eres responsable de la veracidad de los datos facilitados al crear tu cuenta y de mantener la confidencialidad de tu contraseña. Nos reservamos el derecho a suspender cuentas que incumplan estos términos."] },
      { h: "5. Propiedad intelectual", p: ["El diseño, código, contenidos y marcas del sitio pertenecen a Digital Marketplace o a sus licenciantes. Las imágenes de los vehículos se incluyen con fines ilustrativos. Queda prohibida la reproducción no autorizada del contenido sin permiso."] },
      { h: "6. Uso aceptable", p: ["Te comprometes a no usar el sitio para fines ilícitos, a no intentar acceder a datos ajenos o alterar el funcionamiento del servicio, y a no automatizar el acceso de forma que degrade la experiencia de otros usuarios."] },
      { h: "7. Limitación de responsabilidad", p: ["Digital Marketplace no garantiza la disponibilidad continua del servicio ni la ausencia de errores. Dado el carácter simulado del sitio, no se realiza ningún cobro ni entrega, y no se asume responsabilidad por decisiones basadas en la información mostrada."] },
      { h: "8. Modificaciones", p: ["Podemos modificar estos términos en cualquier momento. La versión vigente es la publicada en esta página; la fecha de última actualización indica cuándo se revisaron por última vez."] },
      { h: "9. Legislación aplicable", p: ["Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Madrid, con renuncia a cualquier otro fuero que pudiera corresponderles."] },
    ],
  },
}

function legalMarkup(doc) {
  return `
  <article class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
    <a href="/" class="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
      ${icon("ArrowLeft", "h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5")} Volver al inicio
    </a>
    <header class="mb-10">
      <p class="text-eyebrow text-[11px] text-[var(--signature)]">Digital Marketplace · Legal</p>
      <h1 class="text-display mt-4 text-4xl text-foreground sm:text-5xl">${doc.titulo}</h1>
      <p class="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">${doc.intro}</p>
      <p class="mt-4 text-xs text-muted-foreground">Última actualización: ${ACTUALIZADO}</p>
    </header>
    <div class="space-y-10 text-sm leading-relaxed text-muted-foreground sm:text-base">
      ${doc.secciones.map((s) => `
        <section>
          <h2 class="text-xl font-semibold text-foreground">${s.h}</h2>
          ${s.list
            ? `<ul class="mt-3 list-disc space-y-2 pl-5">${s.list.map((l) => `<li>${l}</li>`).join("")}</ul>`
            : s.p.map((p) => `<p class="mt-3">${p}</p>`).join("")}
        </section>`).join("")}
    </div>
    <footer class="mt-16 border-t border-border/40 pt-8 text-xs text-muted-foreground">
      <p>Digital Marketplace · Vehículos de Alta Gama</p>
      <p class="mt-1">Experiencia de compra simulada.</p>
    </footer>
  </article>`
}

function iniciar() {
  const slug = window.location.pathname.replace("/", "")
  const doc = CONTENIDO[slug] ?? CONTENIDO.privacidad
  renderShell()
  document.getElementById("main").innerHTML = legalMarkup(doc)
  hydrateReveals()
}

iniciar()
