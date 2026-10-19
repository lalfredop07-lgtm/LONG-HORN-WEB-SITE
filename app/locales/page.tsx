import type { Metadata } from "next";
import Image from "next/image";

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
      <section className="relative isolate overflow-hidden border-b border-lh-madera-700/50 bg-lh-carbon pb-14 pt-32 lg:pb-16 lg:pt-40">
        {/*
          Fondo de ambiente. La imagen se sirve ya desenfocada (ver
          scripts/build-fondo-locales.py) y aquí solo se oscurece, de modo
          que acompañe sin competir con el titular.
        */}
        <Image
          src="/images/marca/interior-locales.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-lh-carbon/78 via-lh-carbon/55 to-lh-carbon"
        />

        <div className="contenedor-ancho text-center">
          <p className="eyebrow mb-4 text-lh-ambar-claro">
            {locales.length} locales · {ciudades.length} ciudades
          </p>
          <h1 className="mx-auto max-w-3xl text-display-lg font-normal text-lh-marfil">
            Encuentra tu <Rojo>LongHorn.</Rojo>
          </h1>
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
