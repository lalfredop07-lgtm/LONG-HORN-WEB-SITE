"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/ui/Logo";
import {
  DISTANCIA_RELEVO_LOGO,
  useConexionAptaParaVideo,
  useMovimientoReducido,
  useProgresoScroll,
} from "@/lib/hooks/navegador";

/**
 * Fotograma 0 del propio vídeo: evita cualquier salto visual al arrancar.
 *
 * El nombre lleva sufijo de versión a propósito. Los navegadores guardan el
 * vídeo en una caché de medios propia, indexada por URL, que ni siquiera una
 * recarga forzada vacía: si se sustituye el archivo conservando el nombre, el
 * visitante que ya estuvo en la página sigue viendo el vídeo antiguo. Al
 * cambiar de contenido hay que cambiar también de nombre.
 */
const POSTER = "/videos/hero-portada-fuego-poster.webp";
const VIDEO_ESCRITORIO = "/videos/hero-portada-fuego.mp4";
const VIDEO_MOVIL = "/videos/hero-portada-fuego-movil.mp4";

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

  // El logo del header, al pulsarse ya en inicio, pide repetir la entrada
  // del logotipo grande (ver Header.tsx). Cambiar `key` fuerza a React a
  // desmontar y volver a montar el <h1>, lo que reinicia desde cero su
  // animación CSS `aparecer` (el mismo deslizamiento hacia arriba del
  // primer pintado) — más barato y más suave que recargar la página.
  const [reinicioId, setReinicioId] = useState(0);
  useEffect(() => {
    const alReiniciar = () => setReinicioId((n) => n + 1);
    window.addEventListener("inicio:reiniciar", alReiniciar);
    return () => window.removeEventListener("inicio:reiniciar", alReiniciar);
  }, []);

  // Relevo logotipo grande (aquí) → logotipo del header, a medida que se
  // hace scroll. `DISTANCIA_RELEVO_LOGO` es la misma constante que usa
  // Header, para que un lado se apague exactamente al ritmo que el otro
  // se enciende.
  const progreso = useProgresoScroll(DISTANCIA_RELEVO_LOGO);

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
      // Pantalla completa de verdad: antes se quedaba corto a propósito
      // (88svh/94svh) para insinuar la siguiente sección. El `max()` solo
      // protege viewports realmente bajos (apaisado en móvil), no reduce
      // la altura en el resto de casos.
      className="relative isolate flex min-h-[max(34rem,100svh)] flex-col justify-center overflow-hidden"
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
          // `onLoad` solo no basta: cuando el póster ya está en la caché del
          // navegador termina de cargarse antes de que React hidrate, el
          // evento se pierde y el vídeo no llega a montarse nunca. El callback
          // de ref se ejecuta en el commit y consulta el estado real del
          // <img>, así que cubre también ese caso.
          ref={(nodo) => {
            if (nodo?.complete) setPosterPintado(true);
          }}
          onLoad={() => setPosterPintado(true)}
          // El encuadre cambia por dispositivo: en vertical interesa la carne,
          // no el fondo. `object-position` evita recortes desafortunados.
          className="object-cover object-[40%_center] sm:object-center"
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
              "absolute inset-0 h-full w-full object-cover object-[40%_center] transition-opacity duration-200 sm:object-center",
              videoListo ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            {/* El móvil descarga 418 KB en vez de 1,1 MB. */}
            <source src={VIDEO_MOVIL} type="video/mp4" media="(max-width: 640px)" />
            <source src={VIDEO_ESCRITORIO} type="video/mp4" />
          </video>
        ) : null}

        {/* Gradiente de legibilidad: vertical en vez de lateral a propósito.
            Con el contenido centrado (logo + CTA en medio de la pantalla,
            no ya anclado abajo a la izquierda), un degradado que solo
            oscurece un lado deja la mitad del logo sobre vídeo claro. Uno
            vertical oscurece parejo bajo todo el bloque centrado, en
            cualquier ancho. Más suave en móvil que en escritorio: el
            logotipo ya se lee bien gracias a su propio halo, así que no
            hace falta tapar tanto el vídeo en la pantalla chica. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-lh-carbon/65 via-lh-carbon/30 to-lh-carbon/15 sm:from-lh-carbon/80 sm:via-lh-carbon/50 sm:to-lh-carbon/28"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-lh-carbon to-transparent"
        />
      </div>

      {/* Contenido: columna centrada, con el logotipo como titular.
          Protagonismo de marca a propósito: ver nota junto a `progreso`.
          `-translate-y-*` en `svh` (no px fijos) a propósito: la posición
          «centrada entre el header y la carne» depende del ALTO real del
          viewport (326/900 de la imagen fuente, con la matemática de
          `object-cover` sin recorte vertical), que varía bastante entre
          celulares — un valor en px fijo queda bien en un alto y se monta
          sobre la carne en otro más bajo (320×720 lo demostró). Resta un
          pelín (2 svh) sobre el centro matemático exacto: se ve mejor un
          poco más abajo que justo a medio camino. */}
      <div className="contenedor-ancho relative flex -translate-y-[calc(30svh-2px)] flex-col items-center pb-16 pt-32 text-center sm:-translate-y-[calc(30svh-10px)] sm:pb-20 lg:-translate-y-[calc(30svh-7px)] lg:pt-36">
        {/*
          El titular visible de la portada ya no es la frase «El fuego nos
          une»: es el propio logotipo, grande y centrado. Sigue siendo un
          <h1> real y siempre visible (no `solo-lectores`): su nombre
          accesible pasa a ser el alt del logotipo («LongHorn Grill &
          Drinks»), que es justamente lo que ahora representa.

          `opacity` va directo al valor de scroll, sin transición CSS: ver
          la nota en `useProgresoScroll`. Con JS desactivado o antes de
          hidratar, `progreso` es 0 y el logotipo queda simplemente
          visible, nunca atascado invisible. Va en el contenedor que
          envuelve también al halo, para que ambos se apaguen juntos.
        */}
        <div className="relative flex items-center justify-center" style={{ opacity: 1 - progreso }}>
          {/* Halo oscuro y difuminado detrás del logo: lo separa del vídeo
              de fondo (que puede traer zonas claras justo ahí) sin
              depender solo del degradado general de la sección. */}
          <span
            aria-hidden="true"
            className="absolute -inset-x-16 -inset-y-10 -z-10 rounded-[50%] bg-lh-carbon/85 blur-3xl sm:-inset-x-24 sm:-inset-y-14 lg:-inset-x-32 lg:-inset-y-20"
          />
          <h1 key={reinicioId} id="titular-portada" data-entrada="2">
            {/* Por ancho, no por alto: a 320px de viewport un alto fijo
                grande desborda (284px útiles de ancho tras el padding del
                contenedor). Por ancho se puede crecer mucho en pantallas
                grandes sin arriesgar el desborde en las chicas. */}
            <Logo
              alto={300}
              prioridad
              className="h-auto w-[88vw] max-w-md drop-shadow-[0_6px_28px_rgba(0,0,0,0.45)] sm:w-[26rem] sm:max-w-none lg:w-[34rem]"
            />
          </h1>
        </div>
      </div>
    </section>
  );
}
