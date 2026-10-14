"use client";

/**
 * Capa de analítica.
 *
 * Reglas:
 *  · Nada se carga ni se envía sin consentimiento explícito.
 *  · No se envían datos personales: solo nombre de evento y parámetros
 *    de contexto (local, categoría, origen del clic).
 *  · Si GA4 no está configurado, estas funciones no hacen nada; la web
 *    funciona igual.
 */

export const CLAVE_CONSENTIMIENTO = "longhorn:consentimiento-cookies";

export type Consentimiento = "aceptado" | "rechazado";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function leerConsentimiento(): Consentimiento | null {
  try {
    const valor = window.localStorage.getItem(CLAVE_CONSENTIMIENTO);
    return valor === "aceptado" || valor === "rechazado" ? valor : null;
  } catch {
    return null;
  }
}

export function guardarConsentimiento(valor: Consentimiento): void {
  try {
    window.localStorage.setItem(CLAVE_CONSENTIMIENTO, valor);
  } catch {
    /* almacenamiento bloqueado: la sesión sigue sin recordar la elección */
  }
}

/** Eventos de negocio que se miden. Nombres estables y en un solo sitio. */
export type EventoLongHorn =
  | "ver_carta"
  | "cambiar_categoria_carta"
  | "seleccionar_local"
  | "clic_reservar"
  | "clic_como_llegar"
  | "clic_delivery"
  | "clic_telefono"
  | "clic_whatsapp"
  | "ver_experiencia"
  | "usar_buscador_locales";

export function registrarEvento(
  evento: EventoLongHorn,
  parametros: Record<string, string | number> = {},
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", evento, parametros);
}
