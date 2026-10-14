import Link from "next/link";

import type { Local } from "@/lib/schemas";
import { urlComoLlegar } from "@/lib/locales";

/**
 * Tarjeta de local.
 *
 * No usa fotografías de fachada: LongHorn no publica imágenes
 * autorizadas de sus locales y generar una con IA sería presentar un
 * edificio inventado como real. En su lugar, una composición tipográfica
 * de marca con los datos que sí están verificados.
 */
export function TarjetaLocal({ local, destacado = false }: { local: Local; destacado?: boolean }) {
  return (
    <article
      className={[
        "group relative flex flex-col overflow-hidden rounded-lh-md",
        "border border-lh-madera-600/70 bg-lh-madera-800 veta-madera",
        "transition-[transform,border-color,box-shadow] duration-[420ms] ease-lh",
        "hover:-translate-y-1 hover:border-lh-red/60 hover:shadow-lh-lg",
        destacado ? "min-h-[16rem]" : "min-h-[14rem]",
      ].join(" ")}
    >
      {/* Brasa de fondo que se aviva al pasar por encima */}
      <span
        aria-hidden="true"
        className="resplandor-brasa pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-0 transition-opacity duration-[420ms] group-hover:opacity-70"
      />

      <div className="relative flex flex-1 flex-col p-6">
        <p className="eyebrow text-lh-ambar-claro">{local.ciudad}</p>

        <h3 className="mt-2 font-display text-titulo leading-tight text-lh-marfil">
          <Link href={`/locales/${local.slug}`} className="after:absolute after:inset-0">
            {local.nombreCorto}
          </Link>
        </h3>

        <p className="mt-3 text-apunte leading-relaxed text-lh-marfil/62">
          {local.direccion}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6">
          <span className="text-[0.75rem] uppercase tracking-[0.14em] text-lh-marfil/60">
            {local.distrito}
          </span>
          {local.urlReservas ? (
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] uppercase tracking-[0.14em] text-lh-marfil/60">
              <span aria-hidden="true" className="block h-1 w-1 rounded-full bg-lh-ambar" />
              Reserva online
            </span>
          ) : null}
        </div>
      </div>

      {/* Acciones: por encima del enlace que cubre la tarjeta */}
      <div className="relative z-10 flex border-t border-lh-madera-600/70">
        <a
          href={urlComoLlegar(local)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-5 py-3.5 text-center text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-lh-marfil/70 transition-colors hover:bg-lh-marfil/8 hover:text-lh-marfil"
        >
          Cómo llegar
          <span className="solo-lectores"> a LongHorn {local.nombreCorto} (abre Google Maps)</span>
        </a>
        <span aria-hidden="true" className="w-px bg-lh-madera-600/70" />
        <Link
          href={`/locales/${local.slug}`}
          className="flex-1 px-5 py-3.5 text-center text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-lh-red transition-colors hover:bg-lh-red/12"
        >
          Ver local
          <span className="solo-lectores"> LongHorn {local.nombreCorto}</span>
        </Link>
      </div>
    </article>
  );
}
