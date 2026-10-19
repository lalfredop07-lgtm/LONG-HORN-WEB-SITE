"use client";

import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * Hooks de lectura del navegador.
 *
 * Todos usan `useSyncExternalStore`, que es la forma que React ofrece
 * para suscribirse a estado externo: evita `setState` dentro de efectos
 * (cascadas de render) y permite declarar explícitamente el valor del
 * servidor, de modo que la hidratación nunca desencaje.
 * ------------------------------------------------------------------ */

/** Responde a una media query y se actualiza si la preferencia cambia. */
export function useMediaQuery(consulta: string, valorEnServidor = false): boolean {
  return useSyncExternalStore(
    (alCambiar) => {
      const mq = window.matchMedia(consulta);
      mq.addEventListener("change", alCambiar);
      return () => mq.removeEventListener("change", alCambiar);
    },
    () => window.matchMedia(consulta).matches,
    () => valorEnServidor,
  );
}

/**
 * Preferencia de movimiento reducido.
 * En servidor devuelve `true`: ante la duda, nunca se arranca movimiento.
 */
export function useMovimientoReducido(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}

/** `true` cuando la página se ha desplazado más allá del umbral indicado. */
export function useDesplazado(umbral: number): boolean {
  return useSyncExternalStore(
    (alCambiar) => {
      window.addEventListener("scroll", alCambiar, { passive: true });
      return () => window.removeEventListener("scroll", alCambiar);
    },
    () => window.scrollY > umbral,
    () => false,
  );
}

/**
 * Progreso de desplazamiento entre 0 y 1, a lo largo de `distanciaPx`.
 *
 * Pensado para relevos continuos ligados al scroll (p. ej. el logotipo
 * grande del hero cediéndole protagonismo al logotipo pequeño del header):
 * no hay transición CSS de por medio a propósito, porque el propio scroll
 * ya dispara eventos con suficiente frecuencia para que el ojo lo perciba
 * fluido, y una transición añadida solo introduciría un retraso respecto a
 * la posición real.
 *
 * El valor en servidor es 0 (como si no se hubiera scrolleado nada): es el
 * estado real de la mayoría de visitas que aterrizan arriba, y evita que el
 * primer pintado y la primera hidratación discrepen con un parpadeo.
 */
export function useProgresoScroll(distanciaPx: number): number {
  return useSyncExternalStore(
    (alCambiar) => {
      window.addEventListener("scroll", alCambiar, { passive: true });
      return () => window.removeEventListener("scroll", alCambiar);
    },
    () => Math.min(1, Math.max(0, window.scrollY / distanciaPx)),
    () => 0,
  );
}

/**
 * Distancia de scroll (px) del relevo entre el logotipo grande del hero de
 * inicio y el logotipo del header. Compartida por ambos para que el
 * desvanecido de uno y la aparición del otro queden sincronizados.
 */
export const DISTANCIA_RELEVO_LOGO = 320;

type ConexionNavegador = { saveData?: boolean; effectiveType?: string };

/**
 * Indica si la conexión admite cargar vídeo decorativo.
 * Respeta el modo de ahorro de datos y evita el vídeo en redes lentas.
 */
export function useConexionAptaParaVideo(): boolean {
  return useSyncExternalStore(
    (alCambiar) => {
      const conexion = (navigator as Navigator & { connection?: EventTarget & ConexionNavegador })
        .connection;
      // Navegadores sin Network Information API: no hay nada a lo que
      // suscribirse, pero hay que devolver una limpieza válida.
      if (!conexion?.addEventListener) return () => {};
      conexion.addEventListener("change", alCambiar);
      return () => conexion.removeEventListener("change", alCambiar);
    },
    () => {
      const conexion = (navigator as Navigator & { connection?: ConexionNavegador }).connection;
      if (!conexion) return true;
      if (conexion.saveData) return false;
      if (conexion.effectiveType && /^(slow-2g|2g|3g)$/.test(conexion.effectiveType)) return false;
      return true;
    },
    () => false,
  );
}

/**
 * Lee una clave del almacenamiento local y reacciona a sus cambios,
 * tanto desde otras pestañas (`storage`) como desde esta misma página
 * (evento propio con el nombre de la clave).
 */
export function useAlmacenamientoLocal(clave: string): string | null {
  return useSyncExternalStore(
    (alCambiar) => {
      window.addEventListener("storage", alCambiar);
      window.addEventListener(clave, alCambiar);
      return () => {
        window.removeEventListener("storage", alCambiar);
        window.removeEventListener(clave, alCambiar);
      };
    },
    () => {
      try {
        return window.localStorage.getItem(clave);
      } catch {
        return null;
      }
    },
    () => null,
  );
}

/**
 * Lee el fragmento de la URL (sin la almohadilla) y se mantiene
 * sincronizado con él.
 *
 * Se suscribe al evento `hashchange`, que el navegador dispara con la
 * navegación real (clic en un enlace `#ancla`, atrás/adelante) pero NO al
 * usar `history.replaceState`. Por eso, quien actualice el hash de forma
 * programática (para no provocar el salto brusco que sí hace
 * `location.hash = …`) debe despachar un evento `hashchange` manualmente
 * justo después, el mismo patrón que ya usa `useAlmacenamientoLocal` con
 * sus eventos propios.
 *
 * En servidor devuelve cadena vacía: ningún hash llega nunca al servidor.
 */
export function useHash(): string {
  return useSyncExternalStore(
    (alCambiar) => {
      window.addEventListener("hashchange", alCambiar);
      return () => window.removeEventListener("hashchange", alCambiar);
    },
    () => decodeURIComponent(window.location.hash.replace(/^#/, "")),
    () => "",
  );
}
