import Image from "next/image";

import type { Plato } from "@/lib/schemas";
import { formatearPrecio } from "@/lib/carta";

/** Marca de «bajo en calorías», igual que en la carta impresa. */
function MarcaLigera() {
  return (
    <span title="Bajo en calorías" className="inline-flex shrink-0 translate-y-px">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-lh-red">
        <path d="M12 21s-7.5-4.7-9.4-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.4 12c-1.9 4.3-9.4 9-9.4 9Z" />
      </svg>
      <span className="solo-lectores">Bajo en calorías</span>
    </span>
  );
}

export function PlatoCarta({ plato }: { plato: Plato }) {
  const precio = formatearPrecio(plato.precio);

  return (
    <article
      id={plato.id}
      className="group scroll-mt-32 border-b border-lh-madera-600/40 py-5 last:border-b-0"
    >
      <div className="flex items-start gap-4 sm:gap-6">
        {plato.imagen ? (
          <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-lh sm:block lg:h-28 lg:w-28">
            <Image
              src={plato.imagen}
              alt={plato.imagenAlt ?? plato.nombre}
              fill
              sizes="112px"
              loading="lazy"
              className="object-cover transition-transform duration-[620ms] ease-lh motion-safe:group-hover:scale-105"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          {/* Nombre y precio: siempre en la misma línea base, precio nunca se corta */}
          <div className="flex items-baseline gap-3">
            <h3 className="flex min-w-0 items-baseline gap-1.5 font-sans text-[0.98rem] font-bold uppercase leading-snug tracking-[0.03em] text-lh-marfil sm:text-[1.02rem]">
              {plato.bajoEnCalorias ? <MarcaLigera /> : null}
              <span className="min-w-0">{plato.nombre}</span>
            </h3>

            <span
              aria-hidden="true"
              className="mb-1 hidden h-px flex-1 border-b border-dotted border-lh-madera-300/40 sm:block"
            />

            {precio ? (
              <p className="shrink-0 font-sans text-[1rem] font-bold tabular-nums text-lh-ambar-claro sm:text-[1.05rem]">
                {precio}
              </p>
            ) : (
              // Publicado pero sin precio verificado todavía (p. ej. un
              // cóctel que solo tiene precio de promoción 2x/3x): se dice
              // explícitamente en vez de dejar un hueco que parezca un error.
              <p className="shrink-0 text-[0.72rem] uppercase tracking-[0.1em] text-lh-marfil/45">
                Consultar precio
              </p>
            )}
          </div>

          {plato.presentacion || plato.comensales ? (
            <p className="mt-1 text-[0.75rem] uppercase tracking-[0.12em] text-lh-marfil/60">
              {[plato.presentacion, plato.comensales ? `Para ${plato.comensales}` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}

          {plato.descripcion ? (
            <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-lh-marfil/62">
              {plato.descripcion}
            </p>
          ) : null}

          {plato.ingredientes && plato.ingredientes.length > 0 ? (
            <p className="mt-1.5 max-w-2xl text-[0.8rem] italic leading-relaxed text-lh-marfil/50">
              {plato.ingredientes.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
