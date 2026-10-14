/* ================================================================== *
 * IDENTIDAD Y DATOS DE MARCA
 * Todo dato factual incluido aquí procede de data/fuentes.ts.
 * ================================================================== */

export const MARCA = {
  nombre: "LongHorn",
  nombreCompleto: "LongHorn Grill & Drinks",
  nombreLegalPrincipal: "LONGHORN GRILL S.A.C.",
  pais: "Perú",
  idioma: "es-PE",
  moneda: "PEN",

  /** Concepto narrativo aprobado para esta web. */
  claim: "El fuego nos une.",
  subclaim: "Buena carne. Grandes momentos.",

  /**
   * Descripción oficial de la marca, transcrita del sistema de reservas.
   * Fuente: mesa247-reservas.
   */
  descripcionOficial:
    "En LongHorn somos un restaurante de carnes, pastas y cócteles con 13 locales a nivel nacional, enfocados en brindar una experiencia gastronómica de calidad.",

  /** Fundación según el perfil corporativo de LinkedIn. */
  anioFundacion: 2001,
  sedeCorporativa: "Santiago de Surco, Lima, Perú",

  /** Total declarado por la propia marca. Ver data/locales.ts. */
  totalLocalesDeclarado: 13,

  contacto: {
    whatsapp: "+51 945 186 438",
    whatsappUrl: "https://api.whatsapp.com/send?phone=51945186438",
    telefonoCentral: "01 421 3916",
  },

  enlaces: {
    webOficial: "https://longhornperu.com/",
    reservas: "https://longhorn.mesa247.pe/",
    pedidos: "https://longhorn.mesa247.pe/pideonline/610",
    zonasReparto: "https://longhorn.mesa247.pe/pideonline/1447/delivery-zones",
    experiencias: "https://longhorn.mesa247.pe/experiencias/",
    cartaDigitalPdf: "https://cdn.mesa247.io/archivos/ficheros/610/1774556599.pdf",
  },

  redes: [
    { nombre: "Instagram", url: "https://www.instagram.com/longhornperuoficial/", usuario: "@longhornperuoficial" },
    { nombre: "Facebook", url: "https://www.facebook.com/LongHorn.Peru/", usuario: "LongHorn.Peru" },
  ],
} as const;

/**
 * Razones sociales que operan la red, tomadas de los enlaces oficiales
 * al Libro de Reclamaciones del sistema de reservas.
 */
export const RAZONES_SOCIALES = [
  { nombre: "LONGHORN GRILL S.A.C.", clienteId: 542 },
  { nombre: "L.H. FOOD S.A.C.", clienteId: 548 },
  { nombre: "L.H. SALAVERRY S.A.C.", clienteId: 546 },
  { nombre: "L.H. SAN BORJA S.A.C.", clienteId: 547 },
  { nombre: "L.H. SAN MIGUEL S.A.C.", clienteId: 549 },
  { nombre: "L.H. SANTA ANITA S.A.C.", clienteId: 990 },
  { nombre: "L.H. HUANCAYO S.A.C.", clienteId: 845 },
  { nombre: "LH CAJAMARCA S.A.C.", clienteId: 1261 },
  { nombre: "ZPM CHICLAYO S.A.C.", clienteId: 989 },
] as const;

export const URL_LIBRO_RECLAMACIONES = (clienteId: number) =>
  `https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=${clienteId}`;
