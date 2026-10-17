import Image from "next/image";

import { BotonEnlace, FlechaCta } from "@/components/ui/Boton";
import { Rojo } from "@/components/ui/Resaltado";

export const metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NoEncontrada() {
  return (
    <section className="relative isolate flex min-h-[36rem] items-center overflow-hidden py-seccion">
      <Image
        src="/videos/brasas-poster.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-lh-carbon/86" />

      <div className="contenedor relative text-center">
        <p className="eyebrow mb-5 text-lh-ambar-claro">Error 404</p>
        <h1 className="text-display-lg font-normal text-lh-marfil">
          Esta mesa no <Rojo>existe.</Rojo>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-cuerpo-lg leading-relaxed text-lh-marfil/75">
          La página que buscas se movió o nunca estuvo aquí. Pero la parrilla sigue encendida.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BotonEnlace href="/" tamano="lg">
            Volver al inicio <FlechaCta />
          </BotonEnlace>
          <BotonEnlace href="/carta" variante="secundario" tamano="lg">
            Ver la carta
          </BotonEnlace>
          <BotonEnlace href="/locales" variante="fantasma" tamano="lg">
            Encuentra tu local
          </BotonEnlace>
        </div>
      </div>
    </section>
  );
}
