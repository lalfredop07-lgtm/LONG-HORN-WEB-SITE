import Image from "next/image";

import { BotonEnlace, FlechaCta } from "@/components/ui/Boton";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { EXPERIENCIAS } from "@/data/experiencias";
import { formatearPrecio } from "@/lib/carta";

export function SeccionExperiencias() {
  const experiencia = EXPERIENCIAS[0];
  if (!experiencia) return null;

  return (
    <section
      aria-labelledby="titulo-experiencias"
      className="relative overflow-hidden bg-lh-carbon py-seccion"
    >
      <div className="contenedor-ancho">
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

            <Revelar retardo={0.16} className="mt-8">
              <BotonEnlace href="/experiencias" tamano="lg">
                Ver experiencias <FlechaCta />
              </BotonEnlace>
            </Revelar>
          </div>

          <Revelar desde="derecha">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-lh-md shadow-lh-lg lg:aspect-[4/5]">
              <Image
                src="/images/carta/costillas-longhorn-bbq.webp"
                alt="Costillas LongHorn glaseadas en salsa BBQ, servidas para compartir"
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
