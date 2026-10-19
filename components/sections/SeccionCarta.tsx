import { CATEGORIAS_PORTADA } from "@/data/categorias-portada";
import { BotonEnlace, FlechaCta } from "@/components/ui/Boton";
import { CategoriasCarta } from "@/components/sections/CategoriasCarta";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";

/**
 * «Nuestra carta»: la sección más importante después de la portada.
 *
 * Va sobre madera de tono medio para que se despegue del hero oscuro, y
 * las cinco categorías son enlaces reales a secciones de /carta.
 * Tarjetas apiladas (una columna en móvil, dos en tablet, cinco en
 * escritorio) — ver la nota en CategoriasCarta.tsx sobre por qué ya no es
 * un carrusel.
 */
export function SeccionCarta() {

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
          <span aria-hidden="true" className="mx-auto mt-7 block h-px w-16 bg-lh-red" />
        </Revelar>

        <CategoriasCarta categorias={CATEGORIAS_PORTADA} />

        <Revelar retardo={0.1} className="mt-12 flex flex-col items-center gap-4">
          <BotonEnlace href="/carta" tamano="lg">
            Ver la carta completa <FlechaCta />
          </BotonEnlace>
        </Revelar>
      </div>
    </section>
  );
}
