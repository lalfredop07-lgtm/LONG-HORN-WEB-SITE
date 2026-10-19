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
  openstreetmap: {
    nombre: "OpenStreetMap (Nominatim) — ubicación de centros comerciales",
    url: "https://nominatim.openstreetmap.org/",
    consultadoEl: "2026-10-15",
    confianza: "media",
    notas:
      "Datos abiertos de OpenStreetMap. Se usa únicamente para situar el edificio de un centro comercial cuando la marca no publica coordenadas propias; nunca para inventar una sucursal.",
  },
  "google-maps-ficha-negocio": {
    nombre: "Google Maps — ficha de negocio verificada de cada local",
    url: "https://www.google.com/maps",
    consultadoEl: "2026-10-19",
    confianza: "alta",
    notas:
      "Cada local se buscó por nombre + centro comercial/dirección. Solo se tomaron coordenadas cuando Google " +
      "Maps resolvió una única ficha de negocio con reseñas y fotos reales (no una coincidencia aproximada ni el " +
      "centro comercial genérico). Sustituye, cuando difiere, a la coordenada del JSON-LD interno de la marca: en " +
      "varios locales dentro de centros comerciales esa coordenada interna no correspondía a ningún lugar que " +
      "Google reconociera como el restaurante (ver docs/locales-verificacion.md).",
  },
  "logo-cliente": {
    nombre: "Logotipo oficial entregado por el cliente (LOGO.png)",
    consultadoEl: "2026-10-14",
    confianza: "alta",
    notas: "PNG 1774×887 RGBA. Rojo corporativo muestreado del archivo: #FC1B2B.",
  },
  "longhorn-carta-digital-bebidas": {
    nombre: "Carta digital oficial LongHorn — páginas de bebidas (Happy Hour, Festival de Sours, Vino por Copa)",
    url: "https://www.longhorn.com.pe/CartaDigital/01/mobile/index.html",
    consultadoEl: "2026-10-16",
    confianza: "alta",
    notas:
      "Visor de 40 páginas sin capa de texto (imágenes). De las 40, solo las páginas 39 y 40 corresponden a bebidas: " +
      "«Happy Hour» (2x S/29, lunes a viernes: fresa colada, piña colada, chilcanos, pisco sours, algarrobina, " +
      "margarita, mojito), «Festival de Sours» (3x S/25: aguaymanto, arándanos, coca, maracuyá y el tradicional) " +
      "y «Vino por Copa» (7 vinos con precio individual). Las promociones dan nombre verificado pero NO un precio " +
      "unitario (solo el precio del combo 2x o 3x); esos platos se publican sin `precio`. Vigente para 5 de los " +
      "13 locales (Jockey Plaza, San Isidro, Real Plaza Salaverry, Plaza San Miguel y La Rambla - San Borja), " +
      "según el pie de página de ambas láminas.",
  },
  "rappi-san-borja": {
    nombre: "Rappi — carta de delivery y recojo, sede San Borja",
    url: "https://www.rappi.com.pe/restaurantes/1081-longhorn",
    consultadoEl: "2026-10-16",
    confianza: "media",
    notas:
      "Gaseosas, aguas y cervezas con precio de delivery/recojo de una sede concreta (San Borja). No es la carta " +
      "de consumo en mesa de la red completa: los precios se publican con `disponibleEn: [\"san-borja\"]` y una " +
      "nota explícita de que no están confirmados para el resto de locales ni para consumo en mesa. Revisado una " +
      "segunda vez, específicamente buscando chilcanos y cócteles: el menú de Rappi no incluye ninguna bebida " +
      "preparada, solo gaseosas, agua y cerveza embotellada (coherente con que el delivery no suele vender tragos).",
  },
  "mesa247-pideonline": {
    nombre: "mesa 24/7 — pedidos en línea (longhorn.mesa247.pe/pideonline/610)",
    url: "https://longhorn.mesa247.pe/pideonline/610",
    consultadoEl: "2026-10-17",
    confianza: "baja",
    notas:
      "Posible carta con precios reales de delivery, pero el sitio exige iniciar sesión (Facebook/Google/email) " +
      "antes de mostrar un solo producto; no existe modo de invitado. No se creó ninguna cuenta para acceder " +
      "— está fuera de lo que se puede hacer de forma autónoma. Ni longhorn.mesa247.pe/carta ni la portada de " +
      "longhorn.mesa247.pe publican un menú visible sin iniciar sesión. Esta fuente queda registrada como " +
      "intentada y bloqueada, no como consultada.",
  },
  "scribd-recetario-2018": {
    nombre: "Recetario histórico de coctelería LongHorn (documento de terceros en Scribd)",
    url: "https://es.scribd.com/document/467572562/RECETARIO-DE-CARTA-DE-TRAGOS-2018-Recetario-Longhorn",
    consultadoEl: "2026-10-16",
    fechaDocumento: "2018",
    confianza: "baja",
    notas:
      "«Ficha técnica de coctelería»: 8 cócteles de autor y 6 pisco sours con receta completa (método, cristalería, " +
      "ingredientes, decoración) en la vista previa gratuita; el resto del documento (chilcanos, cócteles clásicos) " +
      "queda tras el muro de pago y no se ha podido verificar directamente, solo se contrasta con la lista que " +
      "facilitó la clienta. La propia Scribd etiqueta el documento también como «Carta de Cócteles Longhorn 2024» " +
      "en sus metadatos de SEO, lo cual NO se ha podido confirmar como una revisión real de 2024: se trata como un " +
      "documento de 2018 de antigüedad y vigencia desconocidas. Ningún precio ni ingrediente de esta fuente se " +
      "publica: solo nombres, como lista de borradores pendientes de aprobación (ver docs/bebidas-pendientes.md).",
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
