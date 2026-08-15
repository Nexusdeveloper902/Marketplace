import type { Metadata } from "next"
import { LegalShell } from "@/components/layout/legal-shell"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y condiciones de uso de Digital Marketplace: condiciones de acceso, propiedad, compras simuladas, propiedad intelectual y limitación de responsabilidad.",
  alternates: { canonical: "/terminos" },
}

const ACTUALIZADO = "1 de junio de 2026"

export default function TerminosPage() {
  return (
    <LegalShell
      titulo="Términos y Condiciones"
      intro="Estos términos regulan el acceso y uso de Digital Marketplace. Al navegar o crear una cuenta aceptas quedar vinculado por ellos."
      ultimaActualizacion={ACTUALIZADO}
    >
      <section>
        <h2 className="text-xl font-semibold text-foreground">1. Aceptación</h2>
        <p className="mt-3">
          El acceso a este sitio implica la aceptación de los presentes
          términos y la política de privacidad. Si no estás de acuerdo, te
          pedimos que no uses el sitio.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">2. Titular</h2>
        <p className="mt-3">
          El titular de este sitio es{" "}
          <strong className="text-foreground">{siteConfig.name}</strong>, una
          experiencia de compra simulada.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">3. Naturaleza simulada</h2>
        <p className="mt-3">
          Digital Marketplace es una plataforma de demostración. Los vehículos
          mostrados, precios, existencias y compras son simulados: no se
          realizan transacciones reales, ni cobros, ni entregas. El checkout no
          procesa pagos ni almacena datos de tarjeta.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">4. Cuentas de usuario</h2>
        <p className="mt-3">
          Eres responsable de la veracidad de los datos facilitados al crear
          tu cuenta y de mantener la confidencialidad de tu contraseña. Nos
          reservamos el derecho a suspender cuentas que incumplan estos
          términos.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">5. Propiedad intelectual</h2>
        <p className="mt-3">
          El diseño, código, contenidos y marcas del sitio pertenecen a{" "}
          {siteConfig.name} o a sus licenciantes. Las imágenes de los vehículos
          se incluyen con fines ilustrativos. Queda prohibida la reproducción
          no autorizada del contenido sin permiso.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">6. Uso aceptable</h2>
        <p className="mt-3">
          Te comprometes a no usar el sitio para fines ilícitos, a no intentar
          acceder a datos ajenos o alterar el funcionamiento del servicio, y a
          no automatizar el acceso de forma que degrade la experiencia de otros
          usuarios.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">7. Limitación de responsabilidad</h2>
        <p className="mt-3">
          {siteConfig.name} no garantiza la disponibilidad continua del
          servicio ni la ausencia de errores. Dado el carácter simulado del
          sitio, no se realiza ningún cobro ni entrega, y no se asume
          responsabilidad por decisiones basadas en la información mostrada.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">8. Modificaciones</h2>
        <p className="mt-3">
          Podemos modificar estos términos en cualquier momento. La versión
          vigente es la publicada en esta página; la fecha de última
          actualización indica cuándo se revisaron por última vez.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">9. Legislación aplicable</h2>
        <p className="mt-3">
          Estos términos se rigen por la legislación española. Para cualquier
          controversia, las partes se someten a los juzgados y tribunales de
          Madrid, con renuncia a cualquier otro fuero que pudiera
          corresponderles.
        </p>
      </section>
    </LegalShell>
  )
}
