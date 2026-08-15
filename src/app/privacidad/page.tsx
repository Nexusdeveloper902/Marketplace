import type { Metadata } from "next"
import { LegalShell } from "@/components/layout/legal-shell"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de Digital Marketplace: qué datos recopilamos, cómo los usamos, con quién los compartimos y tus derechos como usuario.",
  alternates: { canonical: "/privacidad" },
}

const ACTUALIZADO = "1 de junio de 2026"

export default function PrivacidadPage() {
  return (
    <LegalShell
      titulo="Política de Privacidad"
      intro="En Digital Marketplace respetamos tu privacidad. Esta política explica qué datos recopilamos, cómo los usamos y qué derechos tienes sobre ellos, en cumplimiento del Reglamento General de Protección de Datos (RGPD/UE 2016/679)."
      ultimaActualizacion={ACTUALIZADO}
    >
      <section>
        <h2 className="text-xl font-semibold text-foreground">1. Responsable del tratamiento</h2>
        <p className="mt-3">
          El responsable del tratamiento de tus datos personales es{" "}
          <strong className="text-foreground">{siteConfig.name}</strong>. Al
          tratarse de una experiencia de compra simulada, los datos que facilitas
          se usan únicamente para el funcionamiento de la demo y no se comparten
          con terceros con fines comerciales.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">2. Datos que recopilamos</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Cuenta:</strong> nombre, correo
            electrónico y contraseña (almacenada con hash scrypt, nunca en
            texto plano) cuando creas una cuenta.
          </li>
          <li>
            <strong className="text-foreground">Pedidos:</strong> datos de
            contacto (nombre, email, teléfono) que facilitas durante el
            checkout para gestionar tus compras simuladas.
          </li>
          <li>
            <strong className="text-foreground">Preferencias:</strong> tus
            favoritos, comparaciones y garaje, guardados en tu navegador o en
            tu cuenta.
          </li>
          <li>
            <strong className="text-foreground">Analítica:</strong> métricas
            de uso anónimas y agregadas (páginas vistas, eventos) mediante
            Vercel Web Analytics y cookies propias de análisis. No vendemos ni
            compartimos datos personales con terceros con fines comerciales.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">3. Finalidad del tratamiento</h2>
        <p className="mt-3">
          Tratamos tus datos para: gestionar tu cuenta y autenticarte, procesar
          y conservar tus pedidos, ofrecer la experiencia personalizada
          (favoritos, garaje) y mejorar el servicio mediante analítica anónima.
          La base legal es la ejecución de un contrato (tu cuenta y pedidos) y
          nuestro interés legítimo en mejorar el producto (analítica).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">4. Cookies</h2>
        <p className="mt-3">
          Usamos cookies técnicas esenciales para el funcionamiento del sitio
          (sesión y preferencias) y cookies de análisis anónimo. Puedes
          aceptar o rechazar el análisis desde el banner de cookies que aparece
          en tu primera visita. Tu elección se guarda en tu navegador.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">5. Conservación de los datos</h2>
        <p className="mt-3">
          Conservamos tus datos mientras mantengas la cuenta activa y el tiempo
          necesario para cumplir con obligaciones legales o fiscales. Puedes
          solicitar su eliminación en cualquier momento.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">6. Tus derechos</h2>
        <p className="mt-3">
          Como interesado tienes derecho a acceder, rectificar, suprimir,
          oponerte, limitar y portar tus datos personales, así como a retirar el
          consentimiento prestado. También puedes reclamar ante la Agencia
          Española de Protección de Datos (AEPD).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">7. Seguridad</h2>
        <p className="mt-3">
          Aplicamos medidas técnicas y organizativas adecuadas: contraseñas
          con hash scrypt, sesiones firmadas, acceso restringido a datos y
          comunicación cifrada (HTTPS). Ningún método es absolutamente seguro,
          pero trabajamos para proteger tu información.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">8. Naturaleza simulada</h2>
        <p className="mt-3">
          Digital Marketplace es una experiencia de compra simulada: no se
          realizan cobros reales ni transacciones financieras. Los datos de
          pago no se almacenan ni se procesan; los datos de contacto se usan
          únicamente para simular y mostrar tus pedidos.
        </p>
      </section>
    </LegalShell>
  )
}
