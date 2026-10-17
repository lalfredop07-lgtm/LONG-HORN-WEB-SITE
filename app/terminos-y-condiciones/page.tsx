import type { Metadata } from "next";

import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { DocumentoLegal } from "@/components/layout/DocumentoLegal";
import { construirMetadata } from "@/lib/seo";

export const metadata: Metadata = construirMetadata({
  titulo: "Términos y condiciones | LongHorn Perú",
  descripcion: "Condiciones de uso del sitio web de LongHorn Grill & Drinks Perú.",
  ruta: "/terminos-y-condiciones",
});

export default function PaginaTerminos() {
  return (
    <>
      <CabeceraPagina
        titulo="Términos y condiciones"
        descripcion="Condiciones de uso de este sitio web."
        migas={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: "Términos y condiciones", ruta: "/terminos-y-condiciones" },
        ]}
      />

      <DocumentoLegal>
        <h2>Objeto</h2>
        <p>
          Este sitio web tiene una finalidad informativa: presentar los restaurantes LongHorn, su
          carta y sus canales oficiales de reserva y pedido.
        </p>

        <h2>Carta y precios</h2>
        <p>
          Los platos y precios publicados reproducen la carta oficial de LongHorn vigente en la
          fecha de verificación indicada al pie de la carta. Los precios están expresados en soles
          (PEN) e incluyen IGV y servicio. La disponibilidad de los platos puede variar según el
          local y el momento. En caso de discrepancia, prevalece la carta física del restaurante.
        </p>

        <h2>Reservas y pedidos</h2>
        <p>
          Las reservas, los pedidos a domicilio y la compra de experiencias gastronómicas se
          realizan en plataformas de terceros autorizadas por LongHorn. Este sitio no confirma
          reservas ni procesa pagos: únicamente enlaza a esos sistemas. Las condiciones de
          cancelación, pago anticipado y atención son las que establezca cada plataforma y cada
          local.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          La marca LongHorn, su logotipo, sus fotografías y los textos de su carta son propiedad de
          sus titulares. No está permitida su reproducción sin autorización.
        </p>

        <h2>Enlaces a terceros</h2>
        <p>
          El sitio enlaza a servicios externos (reservas, pedidos, mapas y redes sociales). No
          respondemos del contenido ni de las políticas de esos servicios.
        </p>

        <h2>Limitación de responsabilidad</h2>
        <p>
          Procuramos que la información publicada sea exacta y esté actualizada. Aun así, pueden
          producirse cambios en la carta, los horarios o los locales entre dos actualizaciones del
          sitio. Para información crítica, recomendamos confirmar directamente con el restaurante.
        </p>

        <h2>Legislación aplicable</h2>
        <p>
          Estas condiciones se rigen por la legislación peruana. Para cualquier reclamo puedes
          utilizar el <a href="/libro-de-reclamaciones">Libro de Reclamaciones</a>.
        </p>
      </DocumentoLegal>
    </>
  );
}
