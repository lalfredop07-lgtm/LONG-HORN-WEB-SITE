import Image from "next/image";

import { BotonEnlace, FlechaCta } from "@/components/ui/Boton";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { MARCA } from "@/data/marca";

/**
 * «Más que una parrilla»: bloque editorial partido.
 *
 * La fotografía es material oficial de la carta de LongHorn (no es una
 * imagen generada presentada como real). Ver docs/higgsfield-assets.md.
 */
export function SeccionHistoria() {
  return (
    <section
      aria-labelledby="titulo-historia"
      className="relative overflow-hidden bg-lh-carbon py-seccion"
    >
      <div className="contenedor-ancho">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Imagen — primero en móvil, segunda en escritorio */}
          <Revelar desde="escala" className="order-1 lg:order-2">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-lh-md sm:aspect-[3/2] lg:aspect-[4/5]">
              <Image
                src="/images/carta/colita-de-cuadril.webp"
                alt="Colita de cuadril LongHorn recién salida de la parrilla, cortada en láminas sobre tabla de madera"
                fill
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-lh-carbon/70 via-transparent to-transparent"
              />
              {/* Dato de marca, anclado sobre la imagen */}
              <figcaption className="absolute bottom-0 left-0 p-6">
                <span className="block font-display text-display-sm leading-none text-lh-marfil">
                  {new Date().getFullYear() - MARCA.anioFundacion}
                </span>
                <span className="eyebrow mt-2 block text-lh-ambar-claro">
                  años de parrilla
                </span>
              </figcaption>
            </figure>
          </Revelar>

          {/* Texto */}
          <div className="order-2 lg:order-1">
            <Revelar>
              <p className="eyebrow mb-4 text-lh-red">Nuestra historia</p>
              <h2
                id="titulo-historia"
                className="text-display-lg font-normal text-lh-marfil"
              >
                Más que
                <br />
                una <Rojo>parrilla.</Rojo>
              </h2>
            </Revelar>

            <Revelar retardo={0.08}>
              <div className="mt-7 space-y-5 text-cuerpo-lg leading-relaxed text-lh-marfil/75">
                <p>
                  LongHorn nació en {MARCA.anioFundacion} en el Jockey Plaza, con una idea sencilla y
                  difícil de hacer bien: cortes de verdad, fuego de verdad y una mesa donde nadie
                  tenga prisa.
                </p>
                <p>
                  Desde entonces hemos crecido hasta {MARCA.totalLocalesDeclarado} locales en todo el
                  Perú, de Lima a Piura, Chiclayo, Cajamarca y Huancayo. Cambian las ciudades, no la
                  brasa.
                </p>
              </div>
            </Revelar>

            <Revelar retardo={0.14} className="mt-9">
              <BotonEnlace href="/nuestra-historia" variante="secundario" tamano="lg">
                Conocer nuestra historia <FlechaCta />
              </BotonEnlace>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  );
}
