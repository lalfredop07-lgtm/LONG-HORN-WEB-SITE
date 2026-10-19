import { LOCALES } from "@/data/locales";
import type { Local } from "@/lib/schemas";

export const localesPublicados = (): Local[] => LOCALES.filter((l) => l.publicado);

export function localPorSlug(slug: string): Local | undefined {
  return localesPublicados().find((l) => l.slug === slug);
}

/** Locales con coordenadas verificadas: los únicos que se marcan en el mapa. */
export function localesConMapa(): Local[] {
  return localesPublicados().filter((l) => l.coordenadas !== null);
}

export function ciudades(): string[] {
  return [...new Set(localesPublicados().map((l) => l.ciudad))].sort((a, b) =>
    a === "Lima" ? -1 : b === "Lima" ? 1 : a.localeCompare(b, "es"),
  );
}

export function distritosDe(ciudad: string): string[] {
  return [...new Set(localesPublicados().filter((l) => l.ciudad === ciudad).map((l) => l.distrito))].sort(
    (a, b) => a.localeCompare(b, "es"),
  );
}

export function localesPorCiudad(): { ciudad: string; locales: Local[] }[] {
  return ciudades().map((ciudad) => ({
    ciudad,
    locales: localesPublicados()
      .filter((l) => l.ciudad === ciudad)
      .sort((a, b) => a.nombreCorto.localeCompare(b.nombreCorto, "es")),
  }));
}

/** Otras sedes de la misma ciudad, para enlazado interno. */
export function localesCercanos(slug: string, limite = 3): Local[] {
  const actual = localPorSlug(slug);
  if (!actual) return [];
  const mismaCiudad = localesPublicados().filter(
    (l) => l.slug !== slug && l.ciudad === actual.ciudad,
  );
  const resto = localesPublicados().filter((l) => l.slug !== slug && l.ciudad !== actual.ciudad);
  return [...mismaCiudad, ...resto].slice(0, limite);
}

/**
 * Texto de Google Maps para los dos botones externos: el nombre y la
 * dirección EXACTOS que devuelve la ficha de negocio verificada
 * (`googleMapsNombre`) cuando existe. Nunca unas coordenadas sueltas:
 * `query=lat,lng` o `destination=lat,lng` hace que Google muestre el punto
 * más cercano que tenga indexado, que en un centro comercial puede ser
 * cualquier otro local — precisamente el bug que se reportó.
 *
 * Si no hay ficha verificada (ver `googleMapsVerificado` más abajo), se usa
 * el nombre + centro comercial + distrito que ya teníamos: una búsqueda
 * específica, nunca un punto inventado.
 */
function textoGoogleMaps(local: Local): string {
  if (local.googleMapsNombre) return local.googleMapsNombre;
  return [local.nombre, local.centroComercial, local.distrito, local.ciudad]
    .filter((parte): parte is string => Boolean(parte))
    .join(", ");
}

/** `true` cuando el local tiene una ficha de Google Maps confirmada a mano. */
export function googleMapsVerificado(local: Local): boolean {
  return local.googleMapsCid !== null;
}

/**
 * Enlace «Cómo llegar»: indicaciones de navegación.
 *
 * Con ficha verificada añade `destination_place_id`, el identificador que
 * la propia ficha pública de Google Maps expone en su URL (formato
 * `0x<feature>:0x<cid>`) — Google lo resuelve exactamente igual que un
 * Place ID de la API de pago de Places, pero se obtiene gratis navegando la
 * web normal. Sin ficha verificada, cae a una búsqueda por nombre y
 * dirección (nunca a coordenadas sueltas ni a un identificador inventado).
 */
export function urlComoLlegar(local: Local): string {
  const destino = encodeURIComponent(textoGoogleMaps(local));
  const base = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
  return local.googleMapsCid
    ? `${base}&destination_place_id=${encodeURIComponent(local.googleMapsCid)}`
    : base;
}

/** Enlace «Abrir en Google Maps»: la ficha comercial completa del local. */
export function urlVerEnMapa(local: Local): string {
  const consulta = encodeURIComponent(textoGoogleMaps(local));
  const base = `https://www.google.com/maps/search/?api=1&query=${consulta}`;
  return local.googleMapsCid
    ? `${base}&query_place_id=${encodeURIComponent(local.googleMapsCid)}`
    : base;
}

/**
 * Teléfono normalizado a formato E.164 peruano para enlaces `tel:`.
 *
 * En Perú el «0» inicial es prefijo de larga distancia nacional y no forma
 * parte del número internacional: (01) 421 3916 → +51 1 421 3916.
 */
export function telefonoHref(telefono: string): string {
  let digitos = telefono.replace(/\D/g, "");
  // Ya viene con código de país (+51 + 8 o 9 dígitos).
  if (digitos.startsWith("51") && digitos.length >= 10 && digitos.length <= 12) {
    return `tel:+${digitos}`;
  }
  digitos = digitos.replace(/^0+/, "");
  return `tel:+51${digitos}`;
}
