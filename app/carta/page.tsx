import type { Metadata } from "next";
import Image from "next/image";

import { VERIFICADO_EL } from "@/data/carta";
import { MARCA } from "@/data/marca";
import { BotonEnlace, BotonExterno, FlechaCta } from "@/components/ui/Boton";
import { CartaPorCategorias } from "@/components/menu/CartaPorCategorias";
import { SelectorLocal } from "@/components/menu/SelectorLocal";
import { Rojo } from "@/components/ui/Resaltado";
import { VolverArriba } from "@/components/ui/VolverArriba";
import { cartaAgrupada } from "@/lib/carta";
import { construirMetadata, jsonLdMigas } from "@/lib/seo";
import { urlAbsoluta } from "@/lib/site";

export const metadata: Metadata = construirMetadata({
  titulo: "Carta LongHorn Perú | Cortes, Parrillas y Especialidades",
  descripcion:
    "La carta completa de LongHorn: cortes americanos y argentinos, parrillas para compartir, piqueos, pastas y especialidades, con precios en soles.",
  ruta: "/carta",
  imagen: "/images/carta/bife-angosto.webp",
  imagenAlt: "Bife angosto LongHorn recién salido de la parrilla",
});

/**
 * Datos estructurados del menú, con TODOS los grupos y platos.
 *
 * Es independiente de qué categoría muestre la interfaz en cada momento:
 * un rastreador que solo lea este bloque ya conoce la carta completa.
 */
function jsonLdMenu() {
  const grupos = cartaAgrupada().filter((g) => g.totalPlatos > 0);
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `Carta ${MARCA.nombreCompleto}`,
    url: urlAbsoluta("/carta"),
    inLanguage: "es-PE",
    dateModified: VERIFICADO_EL,
    hasMenuSection: grupos.map((grupo) => ({
      "@type": "MenuSection",
      name: grupo.nombre,
      ...(grupo.descripcion ? { description: grupo.descripcion } : {}),
      hasMenuItem: grupo.categorias.flatMap((categoria) =>
        categoria.platos.map((plato) => ({
          "@type": "MenuItem",
          name: plato.nombre,
          ...(plato.descripcion ? { description: plato.descripcion } : {}),
          ...(plato.precio
            ? {
                offers: {
                  "@type": "Offer",
                  price: plato.precio,
                  priceCurrency: "PEN",
                },
              }
            : {}),
        })),
      ),
    })),
  };
}

export default function PaginaCarta() {
  const grupos = cartaAgrupada();

  return (
    <>
      {/* Cabecera */}
      <section className="relative isolate overflow-hidden pb-14 pt-32 lg:pb-16 lg:pt-40">
        <Image
          src="/images/carta/bife-angosto.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-lh-carbon/92 via-lh-carbon/80 to-lh-carbon"
        />

        <div className="contenedor-ancho text-center">
          <h1 className="text-display-lg font-normal text-lh-marfil">
            Descubre nuestra <Rojo>carta.</Rojo>
          </h1>
        </div>
      </section>

      <div className="contenedor-ancho pb-seccion">
        <div className="mb-8">
          <SelectorLocal />
        </div>

        {/*
          Filtro por categoría: solo se ve una a la vez. Las pestañas y
          los paneles viven en un único componente cliente porque
          comparten estado (la categoría activa, derivada del hash de la
          URL). Ver el comentario de cabecera de CartaPorCategorias.tsx.
        */}
        <CartaPorCategorias grupos={grupos} />

        <footer className="mt-16 border-t border-lh-madera-600/60 pt-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <BotonEnlace href="/reservas" tamano="lg">
              Reservar mesa <FlechaCta />
            </BotonEnlace>
            <BotonExterno href={MARCA.enlaces.pedidos} variante="secundario" tamano="lg">
              Pedir delivery
            </BotonExterno>
          </div>
        </footer>
      </div>

      <VolverArriba />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            jsonLdMenu(),
            jsonLdMigas([
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Carta", ruta: "/carta" },
            ]),
          ]),
        }}
      />
    </>
  );
}
