import type { Metadata } from "next";
import Image from "next/image";

import { BotonEnlace, FlechaCta } from "@/components/ui/Boton";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { MARCA } from "@/data/marca";
import { localesPublicados } from "@/lib/locales";
import { construirMetadata, jsonLdMigas } from "@/lib/seo";

export const metadata: Metadata = construirMetadata({
  titulo: "Nuestra historia | Más que una parrilla",
  descripcion:
    "LongHorn nació en 2001 en el Jockey Plaza. Hoy somos 13 restaurantes de carnes, parrillas y cócteles en todo el Perú. Esta es nuestra historia.",
  ruta: "/nuestra-historia",
});

const HITOS = [
  {
    anio: "2001",
    titulo: "El primer local",
    texto:
      "LongHorn abre en el Jockey Plaza de Santiago de Surco. Una parrilla, unos cuantos cortes y la idea de que una buena carne no necesita adornos.",
  },
  {
    anio: "2020",
    titulo: "Once restaurantes",
    texto:
      "La marca llega a once locales en Lima, Piura, Cajamarca y Huancayo, y abre su canal digital de pedidos.",
  },
  {
    anio: "Hoy",
    titulo: "Trece locales",
    texto:
      "Trece restaurantes en cinco ciudades, con la misma brasa encendida que el primer día en el Jockey Plaza.",
  },
];

export default function PaginaHistoria() {
  const locales = localesPublicados();
  const ciudades = [...new Set(locales.map((l) => l.ciudad))];

  return (
    <>
      {/*
        Cabecera propia (no CabeceraPagina: esa la comparten otras páginas
        sin foto de fondo y centradas sería un cambio que no les toca).
        Mismo patrón que /locales y /carta: imagen ya desenfocada +
        degradado para legibilidad. `isolate` es obligatorio aquí: sin él,
        el fondo sólido de la sección tapa a sus hijos con -z-10 y la
        imagen nunca llega a pintarse.
      */}
      <section className="relative isolate overflow-hidden border-b border-lh-madera-700/50 bg-lh-carbon pb-14 pt-32 lg:pb-16 lg:pt-40">
        <Image
          src="/images/marca/interior-locales.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-lh-carbon/78 via-lh-carbon/55 to-lh-carbon"
        />

        <div className="contenedor-ancho text-center">
          <p className="eyebrow mb-4 text-lh-ambar-claro">Nuestra historia</p>
          <h1 className="mx-auto max-w-3xl text-display-lg font-normal text-lh-marfil">
            Más que una <Rojo>parrilla.</Rojo>
          </h1>
        </div>
      </section>

      {/* Relato */}
      <section className="contenedor-ancho py-seccion-sm">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Revelar className="max-w-lectura space-y-5 text-cuerpo-lg leading-relaxed text-lh-marfil/78">
            <p>
              LongHorn empezó en {MARCA.anioFundacion}, en el Jockey Plaza, con tres socios y una
              apuesta sencilla de enunciar y difícil de sostener: tratar bien la carne y dejar que
              el fuego haga el resto.
            </p>
            <p>
              El nombre viene del longhorn, la raza de ganado tejana de cuernos largos que preside
              nuestro logotipo. De ahí también el aire western de la casa: madera, cuero, luz cálida
              y mesas grandes. Nada de disfraces.
            </p>
            <p>
              Hoy somos {MARCA.totalLocalesDeclarado} restaurantes en {ciudades.length} ciudades, con
              más de medio millar de personas en sala, cocina y parrilla. Cambia la ciudad y cambia
              el edificio; la brasa es la misma.
            </p>
          </Revelar>

          <Revelar desde="escala">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-lh-md shadow-lh-lg">
              <Image
                src="/images/carta/bife-a-la-parrilla-flama.webp"
                alt="Cortes de carne a la parrilla entre llamas vivas"
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
            </figure>
          </Revelar>
        </div>
      </section>

      {/* Hitos */}
      <section
        aria-labelledby="titulo-hitos"
        className="bg-lh-madera-800 veta-madera py-seccion"
      >
        <div className="contenedor-ancho">
          <Revelar>
            <h2 id="titulo-hitos" className="text-display-md font-normal text-lh-marfil">
              El camino hasta aquí
            </h2>
          </Revelar>

          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {HITOS.map((hito, i) => (
              <li key={hito.anio}>
                <Revelar retardo={i * 0.07} className="h-full">
                  <div className="h-full border-t-2 border-lh-red pt-5">
                    <p className="font-display text-display-sm leading-none text-lh-marfil">
                      {hito.anio}
                    </p>
                    <h3 className="mt-4 font-sans text-[0.82rem] font-bold uppercase tracking-[0.13em] text-lh-ambar-claro">
                      {hito.titulo}
                    </h3>
                    <p className="mt-3 text-apunte leading-relaxed text-lh-marfil/65">{hito.texto}</p>
                  </div>
                </Revelar>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="contenedor-ancho py-seccion-sm text-center">
        <Revelar>
          <h2 className="text-display-md font-normal text-lh-marfil">
            Ven a probarlo.
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <BotonEnlace href="/carta" tamano="lg">
              Ver la carta <FlechaCta />
            </BotonEnlace>
            <BotonEnlace href="/locales" variante="secundario" tamano="lg">
              Encuentra tu local
            </BotonEnlace>
          </div>
        </Revelar>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdMigas([
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Nuestra historia", ruta: "/nuestra-historia" },
            ]),
          ),
        }}
      />
    </>
  );
}
