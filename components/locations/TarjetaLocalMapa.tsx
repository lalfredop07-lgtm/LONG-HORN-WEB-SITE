"use client";

import Image from "next/image";
import Link from "next/link";

import type { Local } from "@/lib/schemas";
import { urlComoLlegar } from "@/lib/locales";
import { registrarEvento } from "@/lib/analitica";

/** Icono de ubicación que precede a la dirección, como en la referencia. */
function IconoPin() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-lh-red">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

type Props = {
  local: Local;
  activo: boolean;
  /** Selecciona la sede y centra el mapa en ella. */
  alElegir: (slug: string) => void;
};

/**
 * Tarjeta del listado de locales.
 *
 * Sigue la composición de la referencia: miniatura a la izquierda,
 * ciudad, nombre, dirección con icono y tres acciones.
 *
 * Sobre la fotografía: LongHorn no publica imágenes autorizadas de sus
 * fachadas, así que se usa su fotografía gastronómica oficial (extraída
 * de la carta). El texto alternativo describe el plato, nunca el local,
 * para no dar a entender que es una foto del establecimiento.
 */
export function TarjetaLocalMapa({ local, activo, alElegir }: Props) {
  const sinReserva = !local.urlReservas;

  return (
    <article
      data-activo={activo || undefined}
      className={[
        "group relative overflow-hidden rounded-lh-md border transition-[border-color,background-color,transform]",
        "duration-[320ms] ease-lh",
        activo
          ? "border-lh-red/80 bg-lh-madera-800/70"
          : "border-lh-madera-600/55 bg-lh-carbon-800/80 hover:border-lh-madera-400 hover:bg-lh-madera-900/70",
      ].join(" ")}
    >
      {/* Filete rojo que marca la tarjeta seleccionada */}
      <span
        aria-hidden="true"
        className={[
          "absolute inset-y-0 left-0 w-[3px] origin-top bg-lh-red transition-transform duration-[320ms] ease-lh",
          activo ? "scale-y-100" : "scale-y-0",
        ].join(" ")}
      />

      <div className="flex gap-4 p-3.5 sm:gap-5 sm:p-4">
        {/* Miniatura */}
        {local.imagen ? (
          <button
            type="button"
            onClick={() => alElegir(local.slug)}
            aria-label={`Centrar el mapa en LongHorn ${local.nombreCorto}`}
            className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-lh sm:h-[104px] sm:w-[124px]"
          >
            <Image
              src={local.imagen}
              alt={local.imagenAlt ?? ""}
              fill
              sizes="124px"
              loading="lazy"
              className="object-cover transition-transform duration-[620ms] ease-lh motion-safe:group-hover:scale-105"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-lh-carbon/55 to-transparent"
            />
          </button>
        ) : null}

        {/* Contenido */}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="eyebrow text-[0.66rem] text-lh-ambar-claro">{local.ciudad}</p>

          <h3 className="mt-1 font-display text-[1.15rem] leading-tight text-lh-marfil sm:text-[1.3rem]">
            <button
              type="button"
              onClick={() => alElegir(local.slug)}
              className="text-left transition-colors hover:text-lh-ambar-claro"
            >
              {local.nombreCorto}
            </button>
          </h3>

          <p className="mt-1.5 flex gap-1.5 text-[0.78rem] leading-snug text-lh-marfil/60">
            <IconoPin />
            <span className="min-w-0">
              {local.direccion}
              <span className="block text-lh-marfil/60">
                {local.distrito}
                {local.centroComercial ? ` · ${local.centroComercial}` : ""}
              </span>
            </span>
          </p>

          {/* Acciones */}
          <div className="mt-3.5 flex flex-wrap gap-2">
            <Link
              href={`/locales/${local.slug}`}
              className="inline-flex min-h-9 items-center rounded-lh border border-lh-marfil/25 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-lh-marfil transition-colors hover:border-lh-marfil/70 hover:bg-lh-marfil/8"
            >
              Ver local
            </Link>

            <a
              href={urlComoLlegar(local)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => registrarEvento("clic_como_llegar", { local: local.slug })}
              className="inline-flex min-h-9 items-center rounded-lh border border-lh-marfil/25 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-lh-marfil transition-colors hover:border-lh-marfil/70 hover:bg-lh-marfil/8"
            >
              Cómo llegar
              <span className="solo-lectores"> a LongHorn {local.nombreCorto} (abre Google Maps)</span>
            </a>

            {sinReserva ? null : (
              <a
                href={local.urlReservas!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarEvento("clic_reservar", { local: local.slug })}
                className="inline-flex min-h-9 items-center rounded-lh bg-lh-red-accion px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-lh-red-profundo"
              >
                Reservar
                <span className="solo-lectores"> mesa en LongHorn {local.nombreCorto}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
