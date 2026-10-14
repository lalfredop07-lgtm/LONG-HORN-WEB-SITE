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
