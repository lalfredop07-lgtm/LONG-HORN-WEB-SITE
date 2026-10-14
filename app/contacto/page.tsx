import type { Metadata } from "next";

import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { Rojo } from "@/components/ui/Resaltado";
import { MARCA } from "@/data/marca";
import { localesPublicados, telefonoHref } from "@/lib/locales";
import { construirMetadata, jsonLdMigas } from "@/lib/seo";

export const metadata: Metadata = construirMetadata({
  titulo: "Contacto | LongHorn Perú",
  descripcion:
    "Contacta con LongHorn Perú: WhatsApp, teléfono central, redes sociales y los datos de cada uno de nuestros 13 restaurantes.",
  ruta: "/contacto",
});

export default function PaginaContacto() {
  const locales = localesPublicados();
  const conTelefono = locales.filter((l) => l.telefonos.length > 0);

  return (
    <>
      <CabeceraPagina
        eyebrow="Contacto"
        titulo={<>Hablemos de <Rojo>mesas.</Rojo></>}
        descripcion="Reservas, pedidos, grupos grandes o cualquier duda: estos son los canales oficiales de LongHorn Perú."
        migas={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: "Contacto", ruta: "/contacto" },
        ]}
      />

      <section className="contenedor-ancho py-seccion-sm">
        {/* Canales directos */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={MARCA.contacto.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-6 transition-colors hover:border-lh-red/70"
          >
            <p className="eyebrow mb-2 text-lh-ambar-claro">WhatsApp</p>
            <p className="font-display text-titulo text-lh-marfil">{MARCA.contacto.whatsapp}</p>
            <p className="mt-3 text-apunte text-lh-marfil/60">
              La vía más rápida para reservas y consultas.
            </p>
          </a>

          <a
            href={telefonoHref(MARCA.contacto.telefonoCentral)}
            className="group rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-6 transition-colors hover:border-lh-red/70"
          >
            <p className="eyebrow mb-2 text-lh-ambar-claro">Central telefónica</p>
            <p className="font-display text-titulo text-lh-marfil">
              {MARCA.contacto.telefonoCentral}
            </p>
            <p className="mt-3 text-apunte text-lh-marfil/60">
              Atención para los locales de Lima.
            </p>
          </a>

          <a
            href={MARCA.enlaces.pedidos}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-6 transition-colors hover:border-lh-red/70"
          >
            <p className="eyebrow mb-2 text-lh-ambar-claro">Pedidos</p>
            <p className="font-display text-titulo text-lh-marfil">Delivery y recojo</p>
            <p className="mt-3 text-apunte text-lh-marfil/60">
              Pide online en el sistema oficial de LongHorn.
            </p>
          </a>
        </div>

        {/* Nota sobre el formulario */}
        <div className="mt-8 rounded-lh border-l-2 border-lh-ambar bg-lh-carbon-800 px-5 py-4">
          <p className="max-w-3xl text-apunte leading-relaxed text-lh-marfil/65">
            Esta web no incluye formulario de contacto propio: LongHorn no tiene publicado un
            correo ni un servicio de recepción de mensajes que podamos conectar sin inventarlo. En
            cuanto el equipo facilite un buzón, el formulario se activa en una tarde.
          </p>
        </div>

        {/* Redes */}
        <div className="mt-12">
          <h2 className="mb-5 font-display text-display-sm text-lh-marfil">Redes sociales</h2>
          <ul className="flex flex-wrap gap-3">
            {MARCA.redes.map((red) => (
              <li key={red.nombre}>
                <a
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-lh border border-lh-madera-500 px-5 text-[0.78rem] text-lh-marfil/80 transition-colors hover:border-lh-red hover:text-lh-marfil"
                >
                  {red.nombre} · {red.usuario}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Teléfonos por local */}
        <div className="mt-14">
          <h2 className="mb-5 font-display text-display-sm text-lh-marfil">
            Teléfonos de cada local
          </h2>
          <ul className="grid gap-x-8 gap-y-px sm:grid-cols-2">
            {conTelefono.map((local) => (
              <li
                key={local.slug}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-lh-madera-600/45 py-3.5"
              >
                <span className="font-sans text-[0.9rem] font-semibold text-lh-marfil">
                  {local.nombreCorto}
                  <span className="ml-2 font-normal text-lh-marfil/60">{local.ciudad}</span>
                </span>
                <span className="flex flex-wrap gap-x-3">
                  {local.telefonos.map((t) => (
                    <a
                      key={t}
                      href={telefonoHref(t)}
                      className="lh-inline text-[0.88rem] tabular-nums text-lh-ambar-claro underline underline-offset-4 transition-colors hover:text-lh-red"
                    >
                      {t}
                    </a>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.78rem] text-lh-marfil/60">
            Los locales no incluidos en esta lista no publican teléfono directo en los canales
            oficiales de LongHorn.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdMigas([
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Contacto", ruta: "/contacto" },
            ]),
          ),
        }}
      />
    </>
  );
}
