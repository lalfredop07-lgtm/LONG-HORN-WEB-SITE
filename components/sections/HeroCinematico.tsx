"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { BotonEnlace, FlechaCta } from "@/components/ui/Boton";
import { Rojo } from "@/components/ui/Resaltado";
import { useConexionAptaParaVideo, useMovimientoReducido } from "@/lib/hooks/navegador";

/** Fotograma 0 del propio vídeo: evita cualquier salto visual al arrancar. */
const POSTER = "/videos/hero-parrilla-poster.webp";
const VIDEO_ESCRITORIO = "/videos/hero-parrilla.mp4";
const VIDEO_MOVIL = "/videos/hero-parrilla-movil.mp4";

/**
 * Portada cinematográfica.
 *
 * Estrategia de carga: el póster (imagen optimizada, con `priority`) es el
 * LCP y se muestra siempre. El vídeo se monta encima solo cuando:
 *   · el usuario no ha pedido reducir movimiento,
 *   · la conexión no está en modo ahorro de datos,
 *   · y el archivo existe.
 * Así el hero nunca depende del vídeo para verse bien ni para medir rápido.
 */
export function HeroCinematico() {
  const movimientoReducido = useMovimientoReducido();
  const conexionApta = useConexionAptaParaVideo();
  const [videoListo, setVideoListo] = useState(false);
  const [posterPintado, setPosterPintado] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  /*
   * Secuencia de carga del hero, pensada alrededor del LCP.
   *
   * 1. El póster (imagen optimizada, `priority`) se descarga solo: es el
   *    elemento que mide el LCP y no compite con nada.
   * 2. Cuando el póster ya está pintado, se monta el vídeo.
   * 3. El vídeo arranca en su fotograma 0, que ES exactamente el póster,
   *    así que el relevo no se percibe y no hace falta un fundido largo
   *    (un fundido largo retrasaría el LCP del propio vídeo).
   */
  const mostrarVideo = !movimientoReducido && conexionApta && posterPintado;

  // Pausa el vídeo cuando el hero sale de pantalla: no gasta CPU ni batería.
  useEffect(() => {
    const nodo = video.current;
    if (!nodo || !mostrarVideo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) void nodo.play().catch(() => {});
        else nodo.pause();
      },
      { threshold: 0.05 },
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, [mostrarVideo]);

  return (
    <section
      className="relative isolate flex min-h-[max(34rem,88svh)] flex-col justify-end overflow-hidden lg:min-h-[max(40rem,94svh)]"
      aria-labelledby="titular-portada"
    >
      {/* Capa visual */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={POSTER}
          alt=""
          aria-hidden="true"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          onLoad={() => setPosterPintado(true)}
          // El encuadre cambia por dispositivo: en vertical interesa la carne,
          // no el fondo. `object-position` evita recortes desafortunados.
          className="object-cover object-[62%_center] sm:object-center"
        />

        {mostrarVideo ? (
          <video
            ref={video}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            onCanPlay={() => setVideoListo(true)}
            aria-hidden="true"
            tabIndex={-1}
            className={[
              "absolute inset-0 h-full w-full object-cover object-[62%_center] transition-opacity duration-200 sm:object-center",
              videoListo ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            {/* El móvil descarga 418 KB en vez de 1,1 MB. */}
            <source src={VIDEO_MOVIL} type="video/mp4" media="(max-width: 640px)" />
            <source src={VIDEO_ESCRITORIO} type="video/mp4" />
          </video>
        ) : null}

        {/* Gradientes de legibilidad: el texto siempre sobre zona controlada */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-lh-carbon via-lh-carbon/55 to-lh-carbon/35 sm:bg-gradient-to-r sm:from-lh-carbon sm:via-lh-carbon/72 sm:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-lh-carbon to-transparent"
        />
      </div>

      {/* Contenido */}
      <div className="contenedor-ancho relative pb-20 pt-32 sm:pb-24 lg:pb-32">
        <div className="max-w-2xl">
          <p
            className="eyebrow mb-5 text-lh-ambar-claro"
            data-entrada="1"
          >
            Carnes · Parrillas · Grill &amp; Drinks
          </p>

          <h1
            id="titular-portada"
            className="text-display-xl font-normal leading-[0.92] text-lh-marfil"
            data-entrada="2"
          >
            El fuego
            <br />
            nos <Rojo>une.</Rojo>
          </h1>

          <p
            className="mt-6 max-w-md text-cuerpo-lg leading-relaxed text-lh-marfil/80"
            data-entrada="3"
          >
            Buena carne. Grandes momentos.
          </p>

          <div
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4"
            data-entrada="4"
          >
            <BotonEnlace href="/carta" tamano="lg">
              Ver nuestra carta <FlechaCta />
            </BotonEnlace>
            <BotonEnlace href="/reservas" variante="secundario" tamano="lg">
              Reservar mesa
            </BotonEnlace>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#nuestra-carta"
        className="group absolute inset-x-0 bottom-5 mx-auto hidden w-fit flex-col items-center gap-2 text-lh-marfil/60 transition-colors hover:text-lh-marfil lg:flex"
      >
        <span className="eyebrow text-[0.68rem]">Descubre</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 motion-safe:animate-bounce">
          <path d="M12 4v15m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="solo-lectores">Ir a la sección Nuestra carta</span>
      </a>
    </section>
  );
}
