import type { Metadata } from "next";
import Image from "next/image";

import { AVISO_CARTA, VERIFICADO_EL } from "@/data/carta";
import { MARCA } from "@/data/marca";
import { BotonEnlace, BotonExterno, FlechaCta } from "@/components/ui/Boton";
import { NavegacionCarta } from "@/components/menu/NavegacionCarta";
import { PlatoCarta } from "@/components/menu/PlatoCarta";
import { SelectorLocal } from "@/components/menu/SelectorLocal";
import { Rojo } from "@/components/ui/Resaltado";
import { VolverArriba } from "@/components/ui/VolverArriba";
import { cartaAgrupada, rangoPrecios, totalPlatosPublicados } from "@/lib/carta";
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

/** Datos estructurados del menú, solo con platos y precios verificados. */
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
  const total = totalPlatosPublicados();
  const rango = rangoPrecios();

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
          <p className="eyebrow mb-4 text-lh-ambar-claro">
            {total} platos · Precios en soles
          </p>
          <h1 className="text-display-lg font-normal text-lh-marfil">
            Descubre nuestra <Rojo>carta.</Rojo>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-cuerpo-lg leading-relaxed text-lh-marfil/75">
            Cortes, parrillas para compartir, piqueos y las especialidades que llevan años en
            nuestras mesas.
          </p>
        </div>
      </section>

      <div className="contenedor-ancho pb-seccion">
        <div className="mb-8">
          <SelectorLocal />
        </div>

        <NavegacionCarta grupos={grupos} />

        {/* Secciones de la carta */}
        <div className="mt-12 space-y-14 lg:mt-16 lg:space-y-16">
          {grupos.map((grupo, indice) => (
            <section
              key={grupo.id}
              id={grupo.id}
              aria-labelledby={`titulo-${grupo.id}`}
              className={[
                "scroll-mt-36 overflow-hidden rounded-lh-lg border p-6 sm:p-8 lg:p-10",
                // Alternar madera y carbón da ritmo al recorrido sin repetir
                // la misma textura en todas las secciones.
                indice % 2 === 0
                  ? "border-lh-madera-600/55 bg-lh-madera-800/55 veta-madera"
                  : "border-lh-madera-700/50 bg-lh-carbon-800/70",
              ].join(" ")}
            >
              <header className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-lh-red/45 pb-5">
                <div>
                  <p className="eyebrow mb-2 text-lh-ambar-claro">
                    {String(indice + 1).padStart(2, "0")}
                  </p>
                  <h2
                    id={`titulo-${grupo.id}`}
                    className="text-display-sm font-normal text-lh-marfil"
                  >
                    {grupo.nombre}
                  </h2>
                  {grupo.descripcion ? (
                    <p className="mt-2.5 max-w-2xl text-[0.92rem] leading-relaxed text-lh-marfil/60">
                      {grupo.descripcion}
                    </p>
                  ) : null}
                </div>
                {grupo.totalPlatos > 0 ? (
                  <p className="shrink-0 text-[0.75rem] uppercase tracking-[0.14em] text-lh-marfil/60">
                    {grupo.totalPlatos} {grupo.totalPlatos === 1 ? "plato" : "platos"}
                  </p>
                ) : null}
              </header>

              {grupo.sinCartaPublicada ? (
                <div className="rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-6 sm:p-8">
                  <p className="max-w-2xl text-[0.95rem] leading-relaxed text-lh-marfil/72">
                    {grupo.notaSinCarta}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <BotonExterno href={MARCA.enlaces.reservas} variante="secundario">
                      Reservar mesa
                    </BotonExterno>
                    <BotonExterno href={MARCA.contacto.whatsappUrl} variante="fantasma">
                      Preguntar por WhatsApp
                    </BotonExterno>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  {grupo.categorias
                    .filter((c) => c.platos.length > 0)
                    .map((categoria) => (
                      <div key={categoria.id}>
                        {categoria.subtitulo ? (
                          <h3 className="eyebrow mb-4 text-lh-ambar-claro">{categoria.subtitulo}</h3>
                        ) : null}
                        <div>
                          {categoria.platos.map((plato) => (
                            <PlatoCarta key={plato.id} plato={plato} />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Aviso legal literal de la carta */}
        <footer className="mt-16 border-t border-lh-madera-600/60 pt-8">
          <p className="text-[0.82rem] leading-relaxed text-lh-marfil/60">{AVISO_CARTA}</p>
          <p className="mt-2 text-[0.78rem] text-lh-marfil/60">
            Carta verificada el {new Date(VERIFICADO_EL).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}.
            {rango ? ` Precios entre S/ ${rango.min} y S/ ${rango.max}.` : ""} La disponibilidad puede
            variar por local.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
