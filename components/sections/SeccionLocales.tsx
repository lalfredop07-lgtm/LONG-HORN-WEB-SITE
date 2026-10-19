import { BotonEnlace, FlechaCta } from "@/components/ui/Boton";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { TarjetaLocal } from "@/components/locations/TarjetaLocal";
import { localesPublicados } from "@/lib/locales";

const DESTACADOS = ["jockey-plaza", "san-isidro", "san-miguel"];

export function SeccionLocales() {
  const todos = localesPublicados();
  const destacados = DESTACADOS.map((slug) => todos.find((l) => l.slug === slug)).filter(
    (l): l is NonNullable<typeof l> => Boolean(l),
  );

  return (
    <section
      aria-labelledby="titulo-locales"
      className="relative overflow-hidden bg-lh-madera-900 py-seccion"
    >
      {/* Costura superior: funde el corte duro con la sección anterior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-lh-carbon/40 to-transparent sm:h-28"
      />

      <div className="contenedor-ancho relative">
        <Revelar className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow mb-4 text-lh-ambar-claro">Nuestros locales</p>
            <h2 id="titulo-locales" className="text-display-lg font-normal text-lh-marfil">
              Encuentra tu <Rojo>LongHorn.</Rojo>
            </h2>
          </div>
        </Revelar>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((local, i) => (
            <li key={local.slug}>
              <Revelar retardo={i * 0.07} className="h-full">
                <TarjetaLocal local={local} destacado />
              </Revelar>
            </li>
          ))}
        </ul>

        <Revelar retardo={0.12} className="mt-10 flex justify-center">
          <BotonEnlace href="/locales" variante="secundario" tamano="lg">
            Ver los {todos.length} locales <FlechaCta />
          </BotonEnlace>
        </Revelar>
      </div>
    </section>
  );
}
