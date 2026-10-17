import { experienciaSchema, parseColeccion, type Experiencia } from "@/lib/schemas";

/* ================================================================== *
 * EXPERIENCIAS GASTRONÓMICAS
 *
 * Fuente: catálogo oficial de experiencias de LongHorn en mesa 24/7.
 * Solo se publica lo que figura en el catálogo. No se inventan paquetes
 * ni servicios comerciales.
 * ================================================================== */

const EXPERIENCIAS_RAW = [
  {
    slug: "sabores-longhorn",
    nombre: "Sabores LongHorn",
    descripcion:
      "La experiencia para dos del catálogo oficial de LongHorn: una selección de la casa pensada para compartir mesa, parrilla y sobremesa.",
    precio: 215,
    moneda: "PEN" as const,
    localesDisponibles: [
      "jockey-plaza",
      "san-isidro",
      "salaverry",
      "san-borja",
      "san-miguel",
      "santa-anita",
    ],
    url: "https://longhorn.mesa247.pe/experiencias/",
    imagen: "/images/carta/parrilla-para-2.webp",
    imagenAlt: "Parrilla LongHorn servida para compartir entre dos personas",
    fuenteId: "mesa247-experiencias",
    verificadoEl: "2026-10-14",
    estadoVerificacion: "verificado" as const,
  },
];

export const EXPERIENCIAS: Experiencia[] = parseColeccion(
  experienciaSchema,
  EXPERIENCIAS_RAW,
  "experiencias",
);

/**
 * El catálogo oficial mostraba 6 publicaciones activas el 14-10-2026,
 * todas de «Sabores LongHorn» (una por local). Aquí se modela como una
 * experiencia disponible en 6 locales, que es lo que describe la fuente.
 */
export const NOTA_EXPERIENCIAS =
  "Las experiencias se compran y gestionan en el sistema oficial de LongHorn en mesa 24/7. Disponibilidad y precio pueden variar por local y fecha.";
