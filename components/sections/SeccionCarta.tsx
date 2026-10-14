import Image from "next/image";
import Link from "next/link";

import { CATEGORIAS_PORTADA } from "@/data/categorias-portada";
import { BotonEnlace, FlechaCta } from "@/components/ui/Boton";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { totalPlatosPublicados } from "@/lib/carta";

/**
 * «Nuestra carta»: la sección más importante después de la portada.
 *
 * Va sobre madera de tono medio para que se despegue del hero oscuro, y
 * las cinco categorías son enlaces reales a secciones de /carta.
 * En móvil es un carrusel con scroll-snap (no depende de hover);
 * en escritorio, una rejilla de cinco columnas.
 */
export function SeccionCarta() {
  const total = totalPlatosPublicados();

  return (
    <section
      id="nuestra-carta"
      aria-labelledby="titulo-carta"
      className="relative overflow-hidden bg-lh-madera-600 veta-madera py-seccion"
    >
      {/* El resplandor del hero se apaga aquí: continuidad del fuego */}
      <div
        aria-hidden="true"
        className="resplandor-brasa pointer-events-none absolute inset-x-0 -top-24 h-48 rotate-180 opacity-55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lh-carbon/45 via-transparent to-lh-madera-900/55"
      />

      <div className="contenedor-ancho relative">
        <Revelar className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-4 text-lh-ambar-claro">Sabores que conectan</p>
          <h2 id="titulo-carta" className="text-display-lg font-normal text-lh-marfil">
            Nuestra <Rojo>Carta</Rojo>
          </h2>
          <p className="mt-5 text-cuerpo-lg text-lh-marfil/78">
            Mucho más que cortes.
          </p>
          <span aria-hidden="true" className="mx-auto mt-7 block h-px w-16 bg-lh-red" />
        </Revelar>

        {/* Categorías */}
        <ul
          className="
            mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5
            [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]
            lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0
          "
        >
          {CATEGORIAS_PORTADA.map((categoria, i) => (
            <li
              key={categoria.slug}
              className="w-[78vw] max-w-[20rem] shrink-0 snap-center sm:w-[46vw] lg:w-auto lg:max-w-none"
            >
              <Revelar retardo={i * 0.06} desde="abajo" className="h-full">
                <Link
                  href={categoria.href}
                  className="
                    group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden
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
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 20vw"
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

        {/* Pista de desplazamiento solo donde hay carrusel */}
        <p className="mt-1 text-center text-[0.75rem] text-lh-marfil/60 lg:hidden" aria-hidden="true">
          Desliza para ver más categorías
        </p>

        <Revelar retardo={0.1} className="mt-12 flex flex-col items-center gap-4">
          <BotonEnlace href="/carta" tamano="lg">
            Ver la carta completa <FlechaCta />
          </BotonEnlace>
          <p className="text-apunte text-lh-marfil/60">
            {total} platos y cortes, con sus precios actualizados.
          </p>
        </Revelar>
      </div>
    </section>
  );
}
