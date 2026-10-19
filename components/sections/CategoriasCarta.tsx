import Image from "next/image";
import Link from "next/link";

import type { CategoriaPortada } from "@/data/categorias-portada";
import { Revelar } from "@/components/motion/Revelar";

/**
 * Categorías de «Nuestra carta».
 *
 * Antes era un carrusel horizontal en móvil. Se quitó a propósito: por
 * mucho que se blindara el gesto táctil (CSS `touch-action`, luego un
 * bloqueo por JavaScript, luego arrastre manual completo), en ciertos
 * navegadores móviles reales el deslizar vertical sobre el carrusel
 * seguía moviendo la página en vez de quedarse solo en el carrusel. En
 * vez de seguir compitiendo con el scroll nativo, ahora son tarjetas
 * apiladas normales: una columna en móvil, dos en tablet, cinco en
 * escritorio. El scroll de la página sobre esta zona es, simplemente, el
 * scroll de la página — no hay nada especial que pueda salir mal.
 */
export function CategoriasCarta({ categorias }: { categorias: CategoriaPortada[] }) {
  return (
    <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
      {categorias.map((categoria, i) => (
        <li key={categoria.slug}>
          <Revelar retardo={i * 0.06} desde="abajo" className="h-full">
            <Link
              href={categoria.href}
              className="
                group relative flex h-full min-h-[18rem] flex-col justify-end overflow-hidden
                rounded-lh-md border border-lh-madera-400/45 bg-lh-carbon
                shadow-lh-md transition-[transform,border-color,box-shadow] duration-[420ms] ease-lh
                hover:-translate-y-1.5 hover:border-lh-red/70 hover:shadow-lh-lg
                lg:min-h-[26rem]
              "
            >
              <Image
                src={categoria.imagen}
                alt={categoria.imagenAlt}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 20vw"
                className={`
                  object-cover transition-transform duration-[900ms] ease-lh
                  motion-safe:group-hover:scale-[1.07] ${categoria.encuadre ?? ""}
                `}
              />
              {/* Velo para contraste del texto: siempre, no solo en hover */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-lh-carbon via-lh-carbon/58 to-transparent transition-opacity duration-[420ms] group-hover:from-lh-carbon group-hover:via-lh-carbon/40"
              />

              <span className="relative z-10 p-5 lg:p-6">
                {/* `items-end` + altura mínima de dos líneas: los títulos de
                    una y dos líneas comparten la misma línea base en todas
                    las tarjetas. */}
                <span className="flex items-end justify-between gap-3">
                  <span className="flex min-h-[2.1em] items-end font-display text-titulo leading-tight text-lh-marfil">
                    {categoria.nombre}
                  </span>
                  <span
                    aria-hidden="true"
                    className="
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                      border border-lh-marfil/40 text-lh-marfil
                      transition-colors duration-[180ms]
                      group-hover:border-lh-red group-hover:bg-lh-red group-hover:text-white
                    "
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                      <path d="M5 12h13m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
                <span className="mt-2.5 block min-h-[2.6em] text-apunte uppercase leading-snug tracking-[0.12em] text-lh-marfil/60">
                  {categoria.gancho}
                </span>
              </span>
            </Link>
          </Revelar>
        </li>
      ))}
    </ul>
  );
}
