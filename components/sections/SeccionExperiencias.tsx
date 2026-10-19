import Image from "next/image";

import { BotonExterno, FlechaCta } from "@/components/ui/Boton";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { EXPERIENCIAS } from "@/data/experiencias";
import { MARCA } from "@/data/marca";
import { formatearPrecio } from "@/lib/carta";

export function SeccionExperiencias() {
  const experiencia = EXPERIENCIAS[0];
  if (!experiencia) return null;

  return (
    <section
      aria-labelledby="titulo-experiencias"
      className="relative overflow-hidden bg-lh-madera-800 py-seccion"
    >
      {/* Costura superior: funde el corte duro con la sección anterior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-lh-carbon/40 to-transparent sm:h-28"
      />

      <div className="contenedor-ancho relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Revelar>
              <p className="eyebrow mb-4 text-lh-red">Experiencias</p>
              <h2
                id="titulo-experiencias"
                className="text-display-lg font-normal text-lh-marfil"
              >
                Para celebrar <Rojo>juntos.</Rojo>
              </h2>
              <p className="mt-6 max-w-md text-cuerpo-lg leading-relaxed text-lh-marfil/75">
                Hay días que piden algo más que una reserva. Nuestras experiencias gastronómicas
                están pensadas para eso: sentarse, brindar y dejar que la parrilla haga el resto.
              </p>
            </Revelar>

            <Revelar retardo={0.1} className="mt-8">
              <div className="rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-titulo text-lh-marfil">
                    {experiencia.nombre}
                  </h3>
                  {experiencia.precio ? (
                    <p className="font-sans text-titulo font-semibold text-lh-ambar-claro">
                      {formatearPrecio(experiencia.precio)}
                    </p>
                  ) : null}
                </div>
                <p className="mt-3 text-apunte leading-relaxed text-lh-marfil/65">
                  {experiencia.descripcion}
                </p>
                <p className="mt-4 text-[0.75rem] uppercase tracking-[0.13em] text-lh-marfil/60">
                  Disponible en {experiencia.localesDisponibles.length} locales
                </p>
              </div>
            </Revelar>

            <Revelar retardo={0.16} className="mt-8 flex justify-center lg:justify-start">
              {/* Directo al sistema oficial donde se ven y se compran las
                  experiencias (mismo enlace que «Ver y comprar» en
                  /experiencias) — no a la página interna de listado. */}
              <BotonExterno href={experiencia.url ?? MARCA.enlaces.experiencias} tamano="lg">
                Ver experiencias <FlechaCta />
              </BotonExterno>
            </Revelar>
          </div>

          <Revelar desde="derecha">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-lh-md shadow-lh-lg lg:aspect-[4/5]">
              <Image
                src="/images/carta/parrillada-bistec-verduras-brasa.webp"
                alt="Parrillada de bistec y verduras a la brasa, servida en braseros de mesa"
                fill
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-lh-carbon/55 to-transparent"
              />
            </figure>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
