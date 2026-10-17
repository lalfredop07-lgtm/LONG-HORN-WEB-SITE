import type { Metadata } from "next";
import Image from "next/image";

import { BotonExterno, FlechaCta } from "@/components/ui/Boton";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { EXPERIENCIAS } from "@/data/experiencias";
import { MARCA } from "@/data/marca";
import { formatearPrecio } from "@/lib/carta";
import { localPorSlug } from "@/lib/locales";
import { construirMetadata, jsonLdMigas } from "@/lib/seo";

export const metadata: Metadata = construirMetadata({
  titulo: "Experiencias gastronómicas LongHorn",
  descripcion:
    "Experiencias gastronómicas de LongHorn para compartir y celebrar, disponibles en nuestros restaurantes de Lima a través del sistema oficial de reservas.",
  ruta: "/experiencias",
});

export default function PaginaExperiencias() {
  return (
    <>
      <CabeceraPagina
        eyebrow="Experiencias"
        titulo={<>Para celebrar <Rojo>juntos.</Rojo></>}
        descripcion="Hay días que piden algo más que una reserva. Estas son las experiencias que LongHorn tiene publicadas ahora mismo."
      />

      <section className="contenedor-ancho py-seccion-sm">
        <ul className="grid gap-8">
          {EXPERIENCIAS.map((experiencia) => {
            const locales = experiencia.localesDisponibles
              .map((slug) => localPorSlug(slug))
              .filter((l): l is NonNullable<typeof l> => Boolean(l));

            return (
              <li key={experiencia.slug}>
                <Revelar>
                  <article className="grid overflow-hidden rounded-lh-lg border border-lh-madera-600/70 bg-lh-carbon-800 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                    {experiencia.imagen ? (
                      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]">
                        <Image
                          src={experiencia.imagen}
                          alt={experiencia.imagenAlt ?? experiencia.nombre}
                          fill
                          sizes="(max-width: 1024px) 100vw, 45vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="p-7 lg:p-10">
                      <div className="flex flex-wrap items-baseline justify-between gap-4">
                        <h2 className="font-display text-display-sm text-lh-marfil">
                          {experiencia.nombre}
                        </h2>
                        {experiencia.precio ? (
                          <p className="font-sans text-titulo font-semibold text-lh-ambar-claro">
                            {formatearPrecio(experiencia.precio)}
                          </p>
                        ) : null}
                      </div>

                      <p className="mt-4 max-w-prose text-[0.95rem] leading-relaxed text-lh-marfil/72">
                        {experiencia.descripcion}
                      </p>

                      <div className="mt-7">
                        <h3 className="eyebrow mb-3 text-lh-marfil/60">
                          Disponible en {locales.length} locales
                        </h3>
                        <ul className="flex flex-wrap gap-2">
                          {locales.map((local) => (
                            <li
                              key={local.slug}
                              className="rounded-lh border border-lh-madera-500 px-3 py-1.5 text-[0.75rem] text-lh-marfil/75"
                            >
                              {local.nombreCorto}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {experiencia.url ? (
                        <div className="mt-8">
                          <BotonExterno href={experiencia.url} tamano="lg">
                            Ver y comprar <FlechaCta />
                          </BotonExterno>
                        </div>
                      ) : null}
                    </div>
                  </article>
                </Revelar>
              </li>
            );
          })}
        </ul>

        <div className="mt-10">
          <BotonExterno href={MARCA.enlaces.experiencias} variante="secundario">
            Ver todas las experiencias publicadas
          </BotonExterno>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdMigas([
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Experiencias", ruta: "/experiencias" },
            ]),
          ),
        }}
      />
    </>
  );
}
