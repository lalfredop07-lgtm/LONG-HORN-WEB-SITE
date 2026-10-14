"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { BotonEnlace, FlechaCta } from "@/components/ui/Boton";
import { Revelar } from "@/components/motion/Revelar";
import { Rojo } from "@/components/ui/Resaltado";
import { useConexionAptaParaVideo, useMovimientoReducido } from "@/lib/hooks/navegador";

const POSTER = "/videos/brasas-poster.webp";

/**
 * Cierre inmersivo. Recupera la atmósfera de la parrilla con un bucle de
 * brasas muy ligero (833 KB / 312 KB en móvil) que solo se carga cuando
 * la sección está cerca y el usuario no ha pedido reducir movimiento.
 */
export function CtaFinal() {
  const movimientoReducido = useMovimientoReducido();
  const conexionApta = useConexionAptaParaVideo();
  const [cerca, setCerca] = useState(false);
  const [listo, setListo] = useState(false);
  const seccion = useRef<HTMLElement>(null);

  // El bucle de brasas solo se descarga si la sección se acerca y además
  // el contexto lo permite (movimiento y conexión).
  const cargarVideo = cerca && !movimientoReducido && conexionApta;

  useEffect(() => {
    const nodo = seccion.current;
    if (!nodo || movimientoReducido) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) {
          setCerca(true);
          observador.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, [movimientoReducido]);

  return (
    <section
      ref={seccion}
      aria-labelledby="titulo-cta-final"
      className="relative isolate flex min-h-[32rem] items-center overflow-hidden py-seccion"
    >
      <div className="absolute inset-0 -z-10">
        <Image src={POSTER} alt="" aria-hidden="true" fill sizes="100vw" className="object-cover" />
        {cargarVideo ? (
          <video
            muted
            loop
            autoPlay
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setListo(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${listo ? "opacity-100" : "opacity-0"}`}
          >
            <source src="/videos/brasas-movil.mp4" type="video/mp4" media="(max-width: 640px)" />
            <source src="/videos/brasas.mp4" type="video/mp4" />
          </video>
        ) : null}
        <div aria-hidden="true" className="absolute inset-0 bg-lh-carbon/78" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-lh-carbon via-transparent to-lh-carbon"
        />
      </div>

      <div className="contenedor relative text-center">
        <Revelar>
          <p className="eyebrow mb-5 text-lh-ambar-claro">Buena comida. Mejores encuentros.</p>
          <h2
            id="titulo-cta-final"
            className="text-display-lg font-normal text-lh-marfil"
          >
            Tu mesa te <Rojo>espera.</Rojo>
          </h2>
        </Revelar>

        <Revelar retardo={0.1}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <BotonEnlace href="/reservas" tamano="lg">
              Reservar mesa <FlechaCta />
            </BotonEnlace>
            <BotonEnlace href="/locales" variante="secundario" tamano="lg">
              Encuentra tu local
            </BotonEnlace>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
