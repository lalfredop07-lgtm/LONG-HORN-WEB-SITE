"use client";

import Image from "next/image";
import Link from "next/link";

import type { Local } from "@/lib/schemas";
import { urlComoLlegar } from "@/lib/locales";
import { registrarEvento } from "@/lib/analitica";

type Props = {
  local: Local;
  /** Botón de cierre (hoja inferior en móvil). */
  alCerrar?: () => void;
  variante?: "popup" | "hoja";
};

/**
 * Ficha compacta de una sede.
 *
 * Se usa tanto en la ventana emergente del mapa en escritorio como en la
 * hoja inferior de móvil, para que la información y las acciones sean
 * exactamente las mismas en los dos sitios.
 */
export function FichaLocal({ local, alCerrar, variante = "popup" }: Props) {
  const esHoja = variante === "hoja";

  return (
    <div
      className={[
        "overflow-hidden border border-lh-madera-600/80 bg-lh-carbon-800 shadow-lh-lg",
        esHoja ? "rounded-t-lh-lg" : "rounded-lh-lg",
      ].join(" ")}
    >
      {local.imagen ? (
        <div className={`relative ${esHoja ? "h-28" : "h-32"} w-full`}>
          <Image
            src={local.imagen}
            alt={local.imagenAlt ?? ""}
            fill
            sizes="300px"
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-lh-carbon-800 via-lh-carbon-800/20 to-transparent"
          />
        </div>
      ) : null}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-[0.62rem] text-lh-ambar-claro">{local.ciudad}</p>
            <h3 className="mt-1 font-display text-[1.25rem] leading-tight text-lh-marfil">
              {local.nombreCorto}
            </h3>
          </div>

          {alCerrar ? (
            <button
              type="button"
              onClick={alCerrar}
              className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lh-marfil/70 transition-colors hover:bg-lh-marfil/10 hover:text-lh-marfil"
            >
              <span className="solo-lectores">Cerrar la ficha de {local.nombreCorto}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>

        <p className="mt-2 text-[0.78rem] leading-snug text-lh-marfil/65">
          {local.direccion}
          <span className="block">{local.distrito}</span>
        </p>

        <div className="mt-4 grid gap-2">
          <Link
            href={`/locales/${local.slug}`}
            className="inline-flex min-h-10 items-center justify-center rounded-lh bg-lh-red-accion px-4 text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-lh-red-profundo"
          >
            Ver local
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={urlComoLlegar(local)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => registrarEvento("clic_como_llegar", { local: local.slug })}
              className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-lh border border-lh-marfil/25 px-2 text-[0.66rem] font-semibold uppercase tracking-[0.06em] text-lh-marfil transition-colors hover:border-lh-marfil/70"
            >
              Cómo llegar
            </a>

            {local.urlReservas ? (
              <a
                href={local.urlReservas}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarEvento("clic_reservar", { local: local.slug })}
                className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-lh border border-lh-marfil/25 px-2 text-[0.66rem] font-semibold uppercase tracking-[0.06em] text-lh-marfil transition-colors hover:border-lh-marfil/70"
              >
                Reservar
              </a>
            ) : (
              <span className="inline-flex min-h-10 items-center justify-center rounded-lh border border-dashed border-lh-marfil/20 px-3 text-center text-[0.62rem] uppercase leading-tight tracking-[0.08em] text-lh-marfil/45">
                Sin reserva online
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
