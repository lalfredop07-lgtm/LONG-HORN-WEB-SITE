import type { Metadata } from "next";

import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
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
      <CabeceraPagina
        eyebrow="Reservas"
        titulo={<>Tu mesa te <Rojo>espera.</Rojo></>}
        descripcion="Elige el local donde quieres sentarte. Te llevaremos al sistema oficial de reservas de LongHorn para elegir día, hora y número de comensales."
        migas={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: "Reservas", ruta: "/reservas" },
        ]}
      />

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
