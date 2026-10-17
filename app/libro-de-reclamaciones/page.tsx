import type { Metadata } from "next";

import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { Rojo } from "@/components/ui/Resaltado";
import { RAZONES_SOCIALES, URL_LIBRO_RECLAMACIONES } from "@/data/marca";
import { LOCALES } from "@/data/locales";
import { construirMetadata } from "@/lib/seo";

export const metadata: Metadata = construirMetadata({
  titulo: "Libro de Reclamaciones | LongHorn Perú",
  descripcion:
    "Accede al Libro de Reclamaciones virtual de los restaurantes LongHorn en el Perú, conforme al Código de Protección y Defensa del Consumidor.",
  ruta: "/libro-de-reclamaciones",
});

export default function PaginaReclamaciones() {
  // Locales asociados a cada razón social, para orientar al usuario.
  const localesPorRazon = new Map<string, string[]>();
  for (const local of LOCALES) {
    if (!local.razonSocial) continue;
    const lista = localesPorRazon.get(local.razonSocial) ?? [];
    lista.push(local.nombreCorto);
    localesPorRazon.set(local.razonSocial, lista);
  }

  return (
    <>
      <CabeceraPagina
        eyebrow="Atención al consumidor"
        titulo={<>Libro de <Rojo>Reclamaciones.</Rojo></>}
        descripcion="Conforme al Código de Protección y Defensa del Consumidor del Perú, cada empresa que opera un restaurante LongHorn pone a tu disposición su Libro de Reclamaciones virtual."
        migas={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: "Libro de Reclamaciones", ruta: "/libro-de-reclamaciones" },
        ]}
      />

      <section className="contenedor py-seccion-sm">
        <div className="rounded-lh border-l-2 border-lh-ambar bg-lh-carbon-800 px-5 py-4">
          <p className="text-apunte leading-relaxed text-lh-marfil/70">
            Elige la empresa que opera el local sobre el que quieres dejar tu queja o reclamo. Si no
            estás seguro, puedes verlo en la ficha de cada restaurante dentro de la sección Locales.
            El registro se completa en el libro virtual oficial de LongHorn.
          </p>
        </div>

        <ul className="mt-8 divide-y divide-lh-madera-600/50 border-y border-lh-madera-600/50">
          {RAZONES_SOCIALES.map((razon) => {
            const locales = localesPorRazon.get(razon.nombre);
            return (
              <li key={razon.clienteId} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div className="min-w-0">
                  <p className="font-sans text-[0.95rem] font-semibold text-lh-marfil">
                    {razon.nombre}
                  </p>
                  {locales && locales.length > 0 ? (
                    <p className="mt-1 text-apunte text-lh-marfil/60">{locales.join(" · ")}</p>
                  ) : null}
                </div>
                <a
                  href={URL_LIBRO_RECLAMACIONES(razon.clienteId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center rounded-lh border border-lh-marfil/30 px-5 text-[0.75rem] font-semibold uppercase tracking-[0.13em] text-lh-marfil transition-colors hover:border-lh-red hover:text-lh-red"
                >
                  Abrir libro
                  <span className="solo-lectores"> de reclamaciones de {razon.nombre}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 max-w-prose text-[0.78rem] leading-relaxed text-lh-marfil/60">
          Los enlaces apuntan al libro de reclamaciones virtual publicado por LongHorn en su
          plataforma oficial. Esta página no almacena ni procesa reclamos: únicamente dirige al
          registro oficial de cada empresa.
        </p>
      </section>
    </>
  );
}
