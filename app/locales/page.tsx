import type { Metadata } from "next";

import { DirectorioLocales } from "@/components/locations/DirectorioLocales";
import { Rojo } from "@/components/ui/Resaltado";
import { localesPublicados } from "@/lib/locales";
import { construirMetadata, jsonLdMigas } from "@/lib/seo";
import { MARCA } from "@/data/marca";
import { urlAbsoluta } from "@/lib/site";

export const metadata: Metadata = construirMetadata({
  titulo: "Restaurantes LongHorn en Perú | Encuentra tu Local",
  descripcion:
    "Todos los restaurantes LongHorn en Perú: direcciones, teléfonos, cómo llegar y reserva online. Lima, Piura, Chiclayo, Cajamarca y Huancayo.",
  ruta: "/locales",
});

export default function PaginaLocales() {
  const locales = localesPublicados();
  const ciudades = [...new Set(locales.map((l) => l.ciudad))];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Restaurantes ${MARCA.nombreCompleto} en Perú`,
    numberOfItems: locales.length,
    itemListElement: locales.map((local, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: urlAbsoluta(`/locales/${local.slug}`),
      name: local.nombre,
    })),
  };

  return (
    <>
      <section className="border-b border-lh-madera-700/50 bg-lh-carbon pb-12 pt-32 lg:pb-14 lg:pt-40">
        <div className="contenedor-ancho">
          <p className="eyebrow mb-4 text-lh-ambar-claro">
            {locales.length} locales · {ciudades.length} ciudades
          </p>
          <h1 className="max-w-3xl text-display-lg font-normal text-lh-marfil">
            Encuentra tu <Rojo>LongHorn.</Rojo>
          </h1>
          <p className="mt-5 max-w-xl text-cuerpo-lg leading-relaxed text-lh-marfil/75">
            Filtra por ciudad o distrito, mira el mapa y reserva directamente en la sede que te
            quede mejor.
          </p>
        </div>
      </section>

      <section className="contenedor-ancho py-seccion-sm">
        <DirectorioLocales locales={locales} />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            jsonLd,
            jsonLdMigas([
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Locales", ruta: "/locales" },
            ]),
          ]),
        }}
      />
    </>
  );
}
