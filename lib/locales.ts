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
 * Enlace «Cómo llegar». Con coordenadas verificadas apunta al punto exacto;
 * si no, a una búsqueda por nombre y dirección (nunca a un punto inventado).
 */
export function urlComoLlegar(local: Local): string {
  if (local.coordenadas) {
    const { lat, lng } = local.coordenadas;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  const consulta = encodeURIComponent(`${local.nombre}, ${local.direccion}, ${local.distrito}`);
  return `https://www.google.com/maps/search/?api=1&query=${consulta}`;
}

export function urlVerEnMapa(local: Local): string {
  if (local.coordenadas) {
    const { lat, lng } = local.coordenadas;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return urlComoLlegar(local);
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
