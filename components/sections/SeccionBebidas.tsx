import Image from "next/image";

import { BotonEnlace, BotonExterno, FlechaCta } from "@/components/ui/Boton";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { MARCA } from "@/data/marca";

/**
 * «Grill & Drinks»: el lado de barra de la marca.
 *
 * No se publican nombres ni precios de cócteles porque la carta de
 * bebidas no está en el documento oficial verificado. El bloque invita a
 * consultarla en sala, que es lo honesto mientras no llegue la fuente.
 */
export function SeccionBebidas() {
  return (
    <section
      aria-labelledby="titulo-bebidas"
      className="relative overflow-hidden bg-lh-madera-800 py-seccion"
    >
      <div className="contenedor-ancho">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          <Revelar desde="izquierda">
            <figure className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-lh-md shadow-lh-lg">
              <Image
                src="/images/carta/pisco-sour-barra-v2.webp"
                alt="Pisco sour servido en la barra de LongHorn"
                fill
                sizes="(max-width: 1024px) 88vw, 36vw"
                className="object-cover"
              />
            </figure>
          </Revelar>

          <div>
            <Revelar>
              <p className="eyebrow mb-4 text-lh-red">Grill &amp; Drinks</p>
              <h2 id="titulo-bebidas" className="text-display-lg font-normal text-lh-marfil">
                La barra también <Rojo>cuenta.</Rojo>
              </h2>
              <p className="mt-6 max-w-md text-cuerpo-lg leading-relaxed text-lh-marfil/75">
                El apellido de la casa no es decorativo. Junto a la parrilla hay una barra con
                cócteles, cervezas y una selección de vinos pensada para acompañar carne.
              </p>
            </Revelar>

            <Revelar retardo={0.16} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BotonEnlace href="/carta#bebidas" variante="secundario">
                Ver la carta <FlechaCta />
              </BotonEnlace>
              <BotonExterno href={MARCA.enlaces.reservas} variante="fantasma">
                Reservar una mesa
              </BotonExterno>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  );
}
