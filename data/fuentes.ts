import { fuenteSchema, parseColeccion, type Fuente } from "@/lib/schemas";

/**
 * Registro central de fuentes.
 *
 * Cada dato operativo del sitio (precio, dirección, teléfono, horario)
 * referencia una de estas entradas, de modo que toda afirmación del sitio
 * sea auditable y se pueda revisar su antigüedad.
 */
const REGISTROS = {
  "carta-pdf": {
    nombre: "Carta Lima Moderna (PDF oficial distribuido por mesa 24/7)",
    url: "https://cdn.mesa247.io/archivos/ficheros/610/1774556599.pdf",
    consultadoEl: "2026-10-14",
    confianza: "alta",
    notas:
      "Carta de alimentos de 10 páginas (103 referencias). No incluye bebidas, cócteles, vinos ni postres.",
  },
  "mesa247-reservas": {
    nombre: "Sistema oficial de reservas LongHorn (mesa 24/7)",
    url: "https://longhorn.mesa247.pe/",
    consultadoEl: "2026-10-14",
    confianza: "alta",
    notas:
      "Cada local publica JSON-LD Schema.org Restaurant con dirección, teléfono, código postal y coordenadas.",
  },
  "web-oficial": {
    nombre: "Web oficial LongHorn Perú",
    url: "https://longhornperu.com/",
    consultadoEl: "2026-10-14",
    confianza: "alta",
    notas: "Portada con enlaces a carta digital, reservas y pedidos.",
  },
  "mesa247-experiencias": {
    nombre: "Experiencias gastronómicas LongHorn (mesa 24/7)",
    url: "https://longhorn.mesa247.pe/experiencias/",
    consultadoEl: "2026-10-14",
    confianza: "alta",
  },
  linkedin: {
    nombre: "LinkedIn — LongHorn Grill & Drinks (perfil corporativo)",
    url: "https://pe.linkedin.com/company/longhorn-grill-peru",
    consultadoEl: "2026-10-14",
    confianza: "media",
    notas: "Año de fundación, sede corporativa, tamaño de plantilla y descripción de marca.",
  },
  "gestion-2020": {
    nombre: "Gestión — «LongHorn replantea expansión de restaurantes»",
    url: "https://gestion.pe/economia/empresas/longhorn-replantea-expansion-de-restaurantes-y-apuesta-por-canal-digital-longhorn-parrilla-restaurante-noticia/",
    consultadoEl: "2026-10-14",
    fechaDocumento: "2020-12-15",
    confianza: "media",
    notas: "Prensa económica. Datos de 2020: 11 locales, origen de la marca y planes de expansión.",
  },
  "peru-retail-2024": {
    nombre: "Perú Retail — apertura de LongHorn en San Juan de Lurigancho",
    url: "https://www.peru-retail.com/longhorn-inaugura-su-primer-restaurante-en-san-juan-de-lurigancho-y-suma-12-locales-en-peru/",
    consultadoEl: "2026-10-14",
    fechaDocumento: "2024-02-17",
    confianza: "media",
    notas:
      "Confirma el local de Mall Aventura SJL (3.er nivel, 384,11 m², 12:00–23:00) y el total de 12 locales en febrero de 2024.",
  },
  "logo-cliente": {
    nombre: "Logotipo oficial entregado por el cliente (LOGO.png)",
    consultadoEl: "2026-10-14",
    confianza: "alta",
    notas: "PNG 1774×887 RGBA. Rojo corporativo muestreado del archivo: #FC1B2B.",
  },
} as const;

export type FuenteId = keyof typeof REGISTROS;

export const FUENTE_IDS = Object.keys(REGISTROS) as FuenteId[];

export const FUENTES: Record<FuenteId, Fuente> = Object.fromEntries(
  FUENTE_IDS.map((id) => [
    id,
    parseColeccion(fuenteSchema, [REGISTROS[id]], `fuentes.${id}`)[0],
  ]),
) as Record<FuenteId, Fuente>;

export function fuente(id: FuenteId): Fuente {
  return FUENTES[id];
}
