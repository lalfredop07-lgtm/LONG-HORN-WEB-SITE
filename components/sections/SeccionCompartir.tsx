import Image from "next/image";

import { BotonEnlace, FlechaCta } from "@/components/ui/Boton";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { formatearPrecio } from "@/lib/carta";

const PARA_COMPARTIR = [
  { nombre: "Parrilla 4 Carnes", detalle: "Picanha, bife de chorizo, colita de cuadril y lomo fino", precio: 255 },
  { nombre: "Parrilla para 2 Personas", detalle: "Anticuchos, chorizos, morcillas y chuletas", precio: 138 },
  { nombre: "Festival de Cerdo", detalle: "Panceta, bife de chorizo, bondiola y costillas", precio: 134 },
];

/**
 * «Hechos para compartir»: el lado social de LongHorn.
 * Los tres platos y sus precios salen de la carta oficial verificada.
 */
export function SeccionCompartir() {
  return (
    <section
      aria-labelledby="titulo-compartir"
      className="relative isolate overflow-hidden py-seccion"
    >
      {/* Fotografía a sangre como fondo de sección */}
      <Image
        src="/images/carta/parrilla-para-2.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="-z-10 object-cover object-[70%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-lh-carbon/72 sm:bg-gradient-to-r sm:from-lh-carbon sm:via-lh-carbon/82 sm:to-lh-carbon/15"
      />

      <div className="contenedor-ancho">
        <div className="max-w-xl">
          <Revelar>
            <p className="eyebrow mb-4 text-lh-ambar-claro">Hechos para compartir</p>
            <h2 id="titulo-compartir" className="text-display-lg font-normal text-lh-marfil">
              Los mejores momentos se <Rojo>comparten.</Rojo>
            </h2>
          </Revelar>

          <Revelar retardo={0.1}>
            <ul className="mt-10 space-y-px">
              {PARA_COMPARTIR.map((plato) => (
                <li
                  key={plato.nombre}
                  className="flex items-baseline gap-4 border-b border-lh-madera-500/45 py-4 first:border-t"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-titulo leading-snug text-lh-marfil">
                      {plato.nombre}
                    </p>
                    <p className="mt-1 text-apunte text-lh-marfil/60">{plato.detalle}</p>
                  </div>
                  <p className="shrink-0 font-sans text-cuerpo-lg font-semibold text-lh-ambar-claro">
                    {formatearPrecio(plato.precio)}
                  </p>
                </li>
              ))}
            </ul>
          </Revelar>

          <Revelar retardo={0.16} className="mt-9">
            <BotonEnlace href="/carta#mas-del-grill" tamano="lg">
              Ver parrillas para compartir <FlechaCta />
            </BotonEnlace>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
