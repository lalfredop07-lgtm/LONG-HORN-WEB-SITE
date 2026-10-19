"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { formatearPrecio } from "@/lib/carta";

type Corte = {
  id: string;
  nombre: string;
  familia: string;
  presentacion: string;
  precio: number;
  imagen: string;
  imagenAlt: string;
};

/**
 * Selección de cortes destacados.
 * Nombres, gramajes y precios proceden de la carta oficial verificada.
 */
const CORTES: Corte[] = [
  {
    id: "bife-angosto",
    nombre: "Bife Angosto",
    familia: "Americana Premium",
    presentacion: "400g",
    precio: 155,
    imagen: "/images/carta/bife-angosto-nuevo.webp",
    imagenAlt: "Bife angosto LongHorn con marcas de parrilla sobre tabla de madera, con romero y sal",
  },
  {
    id: "colita-cuadril",
    nombre: "Colita de Cuadril",
    familia: "Cortes Selectos",
    presentacion: "300g",
    precio: 74,
    imagen: "/images/carta/colita-de-cuadril-nueva.webp",
    imagenAlt: "Colita de cuadril americana cortada en láminas sobre tabla, con copa de vino",
  },
  {
    id: "tomahawk",
    nombre: "Tomahawk Nacional",
    familia: "Cortes Selectos",
    presentacion: "1200g",
    precio: 200,
    imagen: "/images/carta/tomahawk-nacional-nuevo.webp",
    imagenAlt: "Tomahawk Nacional a la parrilla con hueso, servido en bandeja con romero",
  },
  {
    id: "parrilla-4-carnes",
    nombre: "Parrilla 4 Carnes",
    familia: "Cortes Selectos",
    presentacion: "Para 2",
    precio: 255,
    imagen: "/images/carta/parrilla-4-carnes-nueva.webp",
    imagenAlt: "Parrilla 4 Carnes LongHorn con chorizos, morcillas y cortes a la brasa",
  },
];

export function SeccionCortes() {
  const [activo, setActivo] = useState(0);
  const corte = CORTES[activo]!;

  return (
    <section
      id="cortes"
      aria-labelledby="titulo-cortes"
      className="relative overflow-hidden bg-lh-madera-900 py-seccion"
    >
      {/* Costura superior: funde el corte duro con la sección anterior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-lh-carbon/40 to-transparent sm:h-28"
      />
      {/* Brasa tenue: el fuego reaparece aquí, sin invadir */}
      <div
        aria-hidden="true"
        className="resplandor-brasa pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-40 motion-safe:animate-[latido-brasa_7s_ease-in-out_infinite]"
      />

      <div className="contenedor-ancho relative">
        <Revelar className="max-w-2xl">
          <p className="eyebrow mb-4 text-lh-ambar-claro">Los cortes LongHorn</p>
          <h2 id="titulo-cortes" className="text-display-lg font-normal text-lh-marfil">
            El arte de la <Rojo>parrilla.</Rojo>
          </h2>
        </Revelar>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-stretch lg:gap-14">
          {/* Protagonista */}
          <Revelar desde="escala">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-lh-md shadow-lh-lg sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[32rem]">
              {CORTES.map((c, i) => (
                <Image
                  key={c.id}
                  src={c.imagen}
                  alt={c.imagenAlt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 52vw"
                  priority={i === 0}
                  className={[
                    "object-cover transition-opacity duration-[700ms] ease-lh",
                    i === activo ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                  aria-hidden={i !== activo}
                />
              ))}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-lh-carbon/80 via-lh-carbon/10 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <div>
                  <p className="eyebrow text-lh-ambar-claro">{corte.familia}</p>
                  <p className="mt-1.5 font-display text-display-sm leading-none text-lh-marfil">
                    {corte.nombre}
                  </p>
                </div>
                <p className="shrink-0 font-sans text-titulo font-semibold text-lh-marfil">
                  {formatearPrecio(corte.precio)}
                </p>
              </figcaption>
            </figure>
          </Revelar>

          {/* Selector */}
          <Revelar retardo={0.1} className="flex flex-col">
            <ul className="mt-6 divide-y divide-lh-madera-600/70 border-y border-lh-madera-600/70">
              {CORTES.map((c, i) => {
                const seleccionado = i === activo;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setActivo(i)}
                      aria-pressed={seleccionado}
                      className={[
                        "group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors",
                        seleccionado ? "text-lh-marfil" : "text-lh-marfil/60 hover:text-lh-marfil/85",
                      ].join(" ")}
                    >
                      <span className="flex min-w-0 items-baseline gap-3">
                        <span
                          aria-hidden="true"
                          className={[
                            "h-px shrink-0 transition-all duration-[420ms] ease-lh",
                            seleccionado ? "w-8 bg-lh-red" : "w-3 bg-lh-madera-300 group-hover:w-5",
                          ].join(" ")}
                        />
                        <span className="truncate font-display text-titulo leading-snug">
                          {c.nombre}
                        </span>
                      </span>
                      <span className="shrink-0 font-sans text-[0.78rem] uppercase tracking-[0.14em] text-lh-marfil/60">
                        {c.presentacion}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 text-apunte text-lh-marfil/60">
              Todos los cortes incluyen guarnición a escoger.
            </p>

            <Link
              href="/carta#grill"
              className="group mt-5 inline-flex w-fit items-center gap-2 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-lh-red transition-colors hover:text-lh-red-brasa"
            >
              Ver todos los cortes
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                <path d="M5 12h13m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
