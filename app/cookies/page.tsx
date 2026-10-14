import type { Metadata } from "next";

import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { DocumentoLegal } from "@/components/layout/DocumentoLegal";
import { construirMetadata } from "@/lib/seo";

export const metadata: Metadata = construirMetadata({
  titulo: "Política de cookies | LongHorn Perú",
  descripcion:
    "Qué cookies y almacenamiento local utiliza el sitio web de LongHorn Perú y cómo controlarlos.",
  ruta: "/cookies",
});

export default function PaginaCookies() {
  return (
    <>
      <CabeceraPagina
        titulo="Política de cookies"
        descripcion="Qué guardamos en tu navegador y para qué."
        migas={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: "Cookies", ruta: "/cookies" },
        ]}
      />

      <DocumentoLegal>
        <h2>Cookies estrictamente necesarias</h2>
        <p>
          Este sitio no instala cookies propias para funcionar. La navegación, la carta y el
          directorio de locales funcionan sin ninguna cookie.
        </p>

        <h2>Preferencias</h2>
        <p>
          Guardamos en el almacenamiento local de tu navegador dos cosas, solo si tú las eliges: el
          local que prefieres en la carta y tu respuesta al aviso de cookies. No son cookies de
          seguimiento, no viajan a ningún servidor y se borran al limpiar los datos del sitio.
        </p>

        <h2>Analítica (opcional)</h2>
        <p>
          Si LongHorn activa Google Analytics 4, sus cookies solo se cargan después de que aceptes
          las cookies no esenciales en el aviso. Si las rechazas, el script de analítica no se
          descarga y el sitio sigue funcionando con normalidad.
        </p>

        <h2>Google Maps</h2>
        <p>
          El mapa de la página de locales se carga desde los servidores de Google, que puede
          utilizar sus propias cookies. El mapa solo se carga en esa página; el resto del sitio no
          lo incluye.
        </p>

        <h2>Cómo cambiar tu decisión</h2>
        <p>
          Puedes revocar tu consentimiento en cualquier momento desde el enlace «Preferencias de
          cookies» del aviso, o borrando los datos del sitio en los ajustes de tu navegador.
        </p>
      </DocumentoLegal>
    </>
  );
}
