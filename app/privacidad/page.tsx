import type { Metadata } from "next";

import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { DocumentoLegal } from "@/components/layout/DocumentoLegal";
import { MARCA } from "@/data/marca";
import { construirMetadata } from "@/lib/seo";

export const metadata: Metadata = construirMetadata({
  titulo: "Política de privacidad | LongHorn Perú",
  descripcion:
    "Cómo tratamos los datos personales en el sitio web de LongHorn Perú, conforme a la Ley de Protección de Datos Personales del Perú.",
  ruta: "/privacidad",
});

export default function PaginaPrivacidad() {
  return (
    <>
      <CabeceraPagina
        titulo="Política de privacidad"
        descripcion="Cómo tratamos la información cuando visitas este sitio."
        migas={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: "Política de privacidad", ruta: "/privacidad" },
        ]}
      />

      <DocumentoLegal>
        <h2>Qué datos recogemos en esta web</h2>
        <p>
          Este sitio es informativo. No tiene formularios de registro, no crea cuentas de usuario y
          no solicita datos personales para navegar por él. No recogemos nombre, correo ni teléfono
          en ninguna página.
        </p>

        <h2>Reservas y pedidos</h2>
        <p>
          Las reservas y los pedidos no se procesan en esta web. Cuando pulsas «Reservar mesa» o
          «Pedir delivery» te dirigimos a la plataforma{" "}
          <a href="https://www.mesa247.pe/" target="_blank" rel="noopener noreferrer">mesa 24/7</a>,
          que es el sistema oficial de LongHorn. Los datos que introduzcas allí se rigen por las
          políticas de privacidad de esa plataforma y de LongHorn, no por esta página.
        </p>

        <h2>Preferencias guardadas en tu navegador</h2>
        <p>
          Si eliges un local preferido en la carta, lo guardamos en el almacenamiento local de tu
          navegador para recordarlo en tu próxima visita. Esa información no sale de tu dispositivo,
          no se envía a ningún servidor y puedes borrarla limpiando los datos del sitio.
        </p>

        <h2>Analítica</h2>
        <p>
          Si LongHorn activa la medición de audiencia, se utilizará Google Analytics 4 con la
          finalidad de entender de forma agregada cómo se usa el sitio. No se envían datos que
          permitan identificarte personalmente y la medición solo se activa si aceptas las cookies
          no esenciales. Puedes consultar el detalle en la{" "}
          <a href="/cookies">política de cookies</a>.
        </p>

        <h2>Servicios de terceros</h2>
        <ul>
          <li>
            <strong>Google Maps</strong>, para mostrar la ubicación de los restaurantes en la página
            de locales. Al cargar el mapa, Google puede recibir tu dirección IP.
          </li>
          <li>
            <strong>mesa 24/7</strong>, para reservas, pedidos y experiencias gastronómicas.
          </li>
        </ul>

        <h2>Tus derechos</h2>
        <p>
          De acuerdo con la Ley N.º 29733, Ley de Protección de Datos Personales, y su reglamento,
          puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición sobre los
          datos personales que LongHorn trate. Para hacerlo, escríbenos por{" "}
          <a href={MARCA.contacto.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>{" "}
          o acude a cualquiera de nuestros restaurantes.
        </p>

        <h2>Responsable del tratamiento</h2>
        <p>
          Los restaurantes LongHorn son operados por distintas empresas, cuya relación puedes
          consultar en la página de <a href="/libro-de-reclamaciones">Libro de Reclamaciones</a>. La
          identificación completa del responsable del tratamiento, con su RUC y domicilio fiscal,
          será incorporada por LongHorn antes de la publicación definitiva de este documento.
        </p>

        <h2>Cambios en esta política</h2>
        <p>
          Si modificamos esta política publicaremos la versión actualizada en esta misma página.
        </p>
      </DocumentoLegal>
    </>
  );
}
