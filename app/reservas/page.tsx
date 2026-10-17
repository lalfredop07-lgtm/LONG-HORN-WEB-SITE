import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SelectorReserva } from "@/components/forms/SelectorReserva";
import { Rojo } from "@/components/ui/Resaltado";
import { MARCA } from "@/data/marca";
import { localesPublicados } from "@/lib/locales";
import { construirMetadata, jsonLdMigas } from "@/lib/seo";

export const metadata: Metadata = construirMetadata({
  titulo: "Reservar mesa en LongHorn Perú",
  descripcion:
    "Reserva tu mesa en cualquiera de los restaurantes LongHorn del Perú. Elige tu local y completa la reserva en el sistema oficial de LongHorn.",
  ruta: "/reservas",
});

export default function PaginaReservas() {
  const locales = localesPublicados();

  return (
    <>
      {/*
        Cabecera propia (no CabeceraPagina: esa la comparten otras páginas
        que no debían cambiar de diseño). Mismo fondo desenfocado que
        /locales, /carta y /nuestra-historia, con `isolate` obligatorio para
        que esos hijos con -z-10 no queden tapados por el fondo sólido de la
        sección. La foto de la parrilla va al lado del texto, pero pequeña
        (del alto del título, no una columna a pantalla completa).
      */}
      <section className="relative isolate overflow-hidden border-b border-lh-madera-700/50 bg-lh-carbon pb-14 pt-32 lg:pb-16 lg:pt-40">
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

        <div className="contenedor-ancho flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-center">
          <div className="text-center sm:text-left">
            <nav aria-label="Migas de pan" className="mb-7 flex justify-center sm:justify-start">
              <ol className="flex flex-wrap items-center gap-2 text-[0.75rem] uppercase tracking-[0.13em] text-lh-marfil/60">
                <li className="flex items-center gap-2">
                  <Link href="/" className="lh-inline transition-colors hover:text-lh-marfil">
                    Inicio
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <span aria-current="page" className="text-lh-marfil/80">
                    Reservas
                  </span>
                </li>
              </ol>
            </nav>

            <p className="eyebrow mb-4 text-lh-ambar-claro">Reservas</p>
            <h1 className="max-w-xl text-display-lg font-normal text-lh-marfil">
              Tu mesa te <Rojo>espera.</Rojo>
            </h1>
          </div>

          <figure className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lh-md shadow-lh-lg sm:w-[28rem] lg:w-[34rem]">
            <Image
              src="/images/carta/parrilla-para-compartir-horizontal.webp"
              alt="Mesa LongHorn servida con parrilla para compartir, papas y sangría, con el restaurante de fondo"
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 28rem, 34rem"
              className="object-cover"
            />
          </figure>
        </div>
      </section>

      <section className="contenedor-ancho py-seccion-sm">
        <SelectorReserva locales={locales} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-6">
            <h2 className="font-display text-titulo text-lh-marfil">¿Prefieres escribirnos?</h2>
            <p className="mt-3 text-apunte leading-relaxed text-lh-marfil/65">
              Para grupos grandes o cualquier duda sobre tu reserva, escríbenos por WhatsApp.
            </p>
            <a
              href={MARCA.contacto.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center rounded-lh border border-lh-marfil/30 px-5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-lh-marfil transition-colors hover:border-lh-marfil/70"
            >
              WhatsApp {MARCA.contacto.whatsapp}
            </a>
          </div>

          <div className="rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-6">
            <h2 className="font-display text-titulo text-lh-marfil">¿Prefieres comer en casa?</h2>
            <p className="mt-3 text-apunte leading-relaxed text-lh-marfil/65">
              Nuestra carta también llega a tu mesa con delivery y recojo en local.
            </p>
            <a
              href={MARCA.enlaces.pedidos}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center rounded-lh border border-lh-marfil/30 px-5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-lh-marfil transition-colors hover:border-lh-marfil/70"
            >
              Pedir online
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdMigas([
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Reservas", ruta: "/reservas" },
            ]),
          ),
        }}
      />
    </>
  );
}
