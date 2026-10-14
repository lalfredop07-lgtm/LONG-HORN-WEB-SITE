/**
 * Configuración de entorno del sitio.
 * Centraliza la lectura de variables para que ningún componente las lea
 * directamente y para poder razonar sobre qué pasa cuando faltan.
 */

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (rawUrl && rawUrl.length > 0 ? rawUrl : "http://localhost:3000").replace(
  /\/+$/,
  "",
);

export const ES_INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === "true";

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
export const GOOGLE_MAPS_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() ?? "";
export const HAY_MAPA = GOOGLE_MAPS_API_KEY.length > 0;

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
export const HAY_ANALITICA = /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);

export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ?? "";

export function urlAbsoluta(ruta: string): string {
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return `${SITE_URL}${ruta.startsWith("/") ? ruta : `/${ruta}`}`;
}
