import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BotonEnlace, BotonExterno, FlechaCta } from "@/components/ui/Boton";
import { TarjetaLocal } from "@/components/locations/TarjetaLocal";
import { Rojo } from "@/components/ui/Resaltado";
import { MARCA } from "@/data/marca";
import { LOCALES } from "@/data/locales";
import { localPorSlug, localesCercanos, telefonoHref, urlComoLlegar, urlVerEnMapa } from "@/lib/locales";
import { construirMetadata, jsonLdMigas } from "@/lib/seo";
import { urlAbsoluta } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LOCALES.filter((l) => l.publicado).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const local = localPorSlug(slug);
  if (!local) return construirMetadata({ titulo: "Local no encontrado", descripcion: "", ruta: `/locales/${slug}`, noIndex: true });

  return construirMetadata({
    titulo: `LongHorn ${local.nombreCorto} | Dirección, Carta y Reservas`,
    descripcion: `LongHorn ${local.nombreCorto}: ${local.direccion}, ${local.distrito}, ${local.ciudad}. Carta de carnes y parrillas, cómo llegar y reserva de mesa online.`,
    ruta: `/locales/${local.slug}`,
  });
}

/** JSON-LD `Restaurant` por sede. Solo campos con dato verificado. */
function jsonLdRestaurante(local: NonNullable<ReturnType<typeof localPorSlug>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": urlAbsoluta(`/locales/${local.slug}#restaurante`),
    name: local.nombre,
    url: urlAbsoluta(`/locales/${local.slug}`),
    image: urlAbsoluta("/videos/hero-portada-fuego-poster.webp"),
    servesCuisine: ["Carnes y parrillas", "Peruana", "Americana"],
    priceRange: local.rangoPrecio ?? undefined,
    currenciesAccepted: "PEN",
    hasMenu: urlAbsoluta("/carta"),
    parentOrganization: { "@id": `${urlAbsoluta("/")}#organizacion` },
    address: {
      "@type": "PostalAddress",
      streetAddress: local.direccion,
      addressLocality: local.distrito,
      addressRegion: local.departamento,
      addressCountry: "PE",
      ...(local.codigoPostal ? { postalCode: local.codigoPostal } : {}),
    },
    ...(local.coordenadas
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: local.coordenadas.lat,
            longitude: local.coordenadas.lng,
          },
        }
      : {}),
    ...(local.telefonos.length > 0 ? { telephone: local.telefonos[0] } : {}),
    ...(local.urlReservas
      ? {
          acceptsReservations: "True",
          potentialAction: {
            "@type": "ReserveAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: local.urlReservas,
              inLanguage: "es-PE",
              actionPlatform: [
                "https://schema.org/DesktopWebPlatform",
                "https://schema.org/MobileWebPlatform",
              ],
            },
          },
        }
      : { acceptsReservations: "False" }),
    sameAs: MARCA.redes.map((r) => r.url),
  };
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-lh-madera-600/50 py-4">
      <dt className="eyebrow mb-1.5 text-lh-marfil/60">{etiqueta}</dt>
      <dd className="text-[0.95rem] leading-relaxed text-lh-marfil/88">{children}</dd>
    </div>
  );
}

export default async function PaginaLocal({ params }: Props) {
  const { slug } = await params;
  const local = localPorSlug(slug);
  if (!local) notFound();

  const cercanos = localesCercanos(local.slug, 3);

  return (
    <>
      <section className="border-b border-lh-madera-700/50 bg-lh-carbon pb-12 pt-32 lg:pt-40">
        <div className="contenedor-ancho">
          <nav aria-label="Migas de pan" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[0.75rem] uppercase tracking-[0.13em] text-lh-marfil/60">
              <li><Link href="/" className="lh-inline transition-colors hover:text-lh-marfil">Inicio</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/locales" className="lh-inline transition-colors hover:text-lh-marfil">Locales</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-lh-marfil/80">{local.nombreCorto}</li>
            </ol>
          </nav>

          <p className="eyebrow mb-4 text-lh-ambar-claro">
            {local.distrito} · {local.ciudad}
          </p>
          <h1 className="max-w-3xl text-display-lg font-normal text-lh-marfil">
            LongHorn <Rojo>{local.nombreCorto}.</Rojo>
          </h1>
          <p className="mt-5 max-w-xl text-cuerpo-lg leading-relaxed text-lh-marfil/75">
            {local.direccion}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            {local.urlReservas ? (
              <BotonExterno href={local.urlReservas} tamano="lg">
                Reservar mesa <FlechaCta />
              </BotonExterno>
            ) : (
              <BotonEnlace href="/reservas" tamano="lg">
                Reservar mesa <FlechaCta />
              </BotonEnlace>
            )}
            <BotonExterno href={urlComoLlegar(local)} variante="secundario" tamano="lg">
              Cómo llegar
            </BotonExterno>
            {local.urlPedidos ? (
              <BotonExterno href={local.urlPedidos} variante="fantasma" tamano="lg">
                Pedir delivery
              </BotonExterno>
            ) : null}
          </div>
        </div>
      </section>

      <section className="contenedor-ancho py-seccion-sm">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          {/* Ficha de datos */}
          <div>
            <h2 className="mb-6 font-display text-display-sm text-lh-marfil">
              Información del local
            </h2>

            <dl className="border-t border-lh-madera-600/50">
              <Dato etiqueta="Dirección">
                {local.direccion}
                <br />
                {local.distrito}, {local.ciudad}
                {local.codigoPostal ? ` ${local.codigoPostal}` : ""}
              </Dato>

              {local.centroComercial ? (
                <Dato etiqueta="Ubicación">{local.centroComercial}</Dato>
              ) : null}

              <Dato etiqueta="Teléfono">
                {local.telefonos.length > 0 ? (
                  <span className="flex flex-wrap gap-x-4 gap-y-1">
                    {local.telefonos.map((t) => (
                      <a
                        key={t}
                        href={telefonoHref(t)}
                        className="lh-inline underline underline-offset-4 transition-colors hover:text-lh-red"
                      >
                        {t}
                      </a>
                    ))}
                  </span>
                ) : (
                  <span className="text-lh-marfil/60">
                    Este local no publica teléfono directo. Escríbenos por{" "}
                    <a
                      href={MARCA.contacto.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lh-inline underline underline-offset-4 hover:text-lh-red"
                    >
                      WhatsApp
                    </a>
                    .
                  </span>
                )}
              </Dato>

              {local.servicios.length > 0 ? (
                <Dato etiqueta="Servicios">
                  <ul className="flex flex-wrap gap-2">
                    {local.servicios.map((s) => (
                      <li
                        key={s}
                        className="rounded-lh border border-lh-madera-500 px-2.5 py-1 text-[0.75rem] text-lh-marfil/75"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Dato>
              ) : null}
            </dl>

            {local.notas ? (
              <p className="mt-6 rounded-lh border-l-2 border-lh-ambar bg-lh-carbon-800 px-5 py-4 text-[0.82rem] leading-relaxed text-lh-marfil/60">
                {local.notas}
              </p>
            ) : null}
          </div>

          {/* Mapa estático + accesos */}
          <div className="space-y-6">
            <div className="rounded-lh-md border border-lh-madera-600/70 bg-lh-madera-800/55 veta-madera p-7">
              <h2 className="font-display text-titulo text-lh-marfil">Cómo llegar</h2>
              <p className="mt-3 text-apunte leading-relaxed text-lh-marfil/65">
                {local.coordenadas
                  ? "Abre la ruta en Google Maps desde tu ubicación actual."
                  : "Buscaremos este local por su nombre y dirección en Google Maps."}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <BotonExterno href={urlVerEnMapa(local)} variante="secundario">
                  Abrir en Google Maps
                </BotonExterno>
                <BotonEnlace href="/locales" variante="fantasma">
                  Ver todos los locales
                </BotonEnlace>
              </div>
            </div>

            <div className="rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-7">
              <h2 className="font-display text-titulo text-lh-marfil">La carta de este local</h2>
              <p className="mt-3 text-apunte leading-relaxed text-lh-marfil/65">
                Nuestra carta de carnes, parrillas, pastas y especialidades, con precios en soles.
              </p>
              <div className="mt-5">
                <BotonEnlace href="/carta">
                  Ver la carta <FlechaCta />
                </BotonEnlace>
              </div>
            </div>
          </div>
        </div>

        {/* Otras sedes */}
        {cercanos.length > 0 ? (
          <div className="mt-16 border-t border-lh-madera-700/50 pt-12">
            <h2 className="mb-7 font-display text-display-sm text-lh-marfil">Otras sedes</h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cercanos.map((otro) => (
                <li key={otro.slug}>
                  <TarjetaLocal local={otro} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            jsonLdRestaurante(local),
            jsonLdMigas([
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Locales", ruta: "/locales" },
              { nombre: local.nombreCorto, ruta: `/locales/${local.slug}` },
            ]),
          ]),
        }}
      />
    </>
  );
}
