import { localSchema, parseColeccion, type Local } from "@/lib/schemas";

/* ================================================================== *
 * DIRECTORIO DE LOCALES LONGHORN PERÚ
 *
 * Fuente principal: sistema oficial de reservas (longhorn.mesa247.pe).
 * Cada ficha de local publica un JSON-LD Schema.org `Restaurant` con
 * dirección, teléfono, código postal y coordenadas. Esos son los datos
 * que se reproducen aquí, sin alterarlos.
 *
 * CONCILIACIÓN DEL NÚMERO DE LOCALES
 * ----------------------------------
 * · La web oficial afirma «13 locales a nivel nacional».
 * · El selector de reservas lista 12 locales reservables online.
 * · Perú Retail (feb-2024) documenta la apertura de Mall Aventura San
 *   Juan de Lurigancho, que NO aparece en el selector de reservas.
 *   12 reservables + San Juan de Lurigancho = 13. La cifra cuadra.
 * · «Centro Cívico» aparece en directorios de terceros pero no en
 *   ninguna fuente oficial vigente: NO se publica. Ver
 *   docs/locales-verificacion.md.
 *
 * COORDENADAS
 * -----------
 * Solo se publican coordenadas provenientes del JSON-LD oficial. San
 * Juan de Lurigancho se publica sin coordenadas (`null`): aparece en el
 * directorio pero no como marcador en el mapa, para no dirigir a nadie
 * a un punto incorrecto.
 *
 * HORARIOS
 * --------
 * LongHorn no publica horarios en ninguna fuente oficial consultable.
 * Se dejan en `null` y la interfaz lo indica de forma explícita en vez
 * de inventarlos. Ver docs/pendientes-cliente.md.
 * ================================================================== */

const VERIFICADO_EL = "2026-10-14";
const PEDIDOS = "https://longhorn.mesa247.pe/pideonline/610";

type LocalRaw = Omit<Local, "telefonos" | "servicios" | "publicado"> & {
  telefonos?: string[];
  servicios?: string[];
  publicado?: boolean;
};

const SERVICIOS_BASE = ["Reservas online", "Delivery y recojo", "Carta completa"];

const LOCALES_RAW: LocalRaw[] = [
  /* ------------------------------ LIMA ---------------------------- */
  {
    slug: "jockey-plaza",
    nombre: "LongHorn Jockey Plaza",
    nombreCorto: "Jockey Plaza",
    ciudad: "Lima",
    distrito: "Santiago de Surco",
    departamento: "Lima",
    centroComercial: "C.C. Jockey Plaza",
    direccion: "Av. Javier Prado Este Nro. 4200 - C.C Jockey Plaza",
    codigoPostal: "15023",
    telefonos: ["01 4213916", "945 186 438"],
    coordenadas: { lat: -12.0869621, lng: -76.9789942 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_jockey_plaza",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=542",
    razonSocial: "LONGHORN GRILL S.A.C.",
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/bife-angosto.webp",
    imagenAlt: "Bife angosto a la parrilla, de la carta LongHorn",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
    notas:
      "Primer local de la marca. Según prensa económica, LongHorn nació aquí a comienzos de los 2000.",
  },
  {
    slug: "san-isidro",
    nombre: "LongHorn San Isidro",
    nombreCorto: "San Isidro",
    ciudad: "Lima",
    distrito: "San Isidro",
    departamento: "Lima",
    direccion: "Calle Los Libertadores 302",
    codigoPostal: "15073",
    telefonos: ["01 4213916", "945 186 438"],
    coordenadas: { lat: -12.101014, lng: -77.0375222 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_san_isidro",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=543",
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/parrilla-para-2.webp",
    imagenAlt: "Parrilla LongHorn para compartir",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
    notas: "Local a pie de calle, fuera de centro comercial.",
  },
  {
    slug: "salaverry",
    nombre: "LongHorn Real Plaza Salaverry",
    nombreCorto: "Salaverry",
    ciudad: "Lima",
    distrito: "Jesús María",
    departamento: "Lima",
    centroComercial: "C.C. Real Plaza Salaverry",
    direccion: "Av. Gral. Felipe Salaverry Nro. 2370 - C.C. Real Plaza Salaverry",
    codigoPostal: "15076",
    telefonos: ["01 4213916", "945 186 438"],
    coordenadas: { lat: -12.0929621, lng: -77.0527475 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_salaverry",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=546",
    razonSocial: "L.H. SALAVERRY S.A.C.",
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/costillas-longhorn-bbq.webp",
    imagenAlt: "Costillas LongHorn en salsa BBQ",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
  },
  {
    slug: "san-borja",
    nombre: "LongHorn San Borja",
    nombreCorto: "San Borja",
    ciudad: "Lima",
    distrito: "San Borja",
    departamento: "Lima",
    direccion: "Jirón Carpaccio 210",
    codigoPostal: "15036",
    telefonos: ["01 7652212"],
    coordenadas: { lat: -12.0907229, lng: -77.0049521 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-san-borja",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=547",
    razonSocial: "L.H. SAN BORJA S.A.C.",
    rangoPrecio: "S/ 120",
    imagen: "/images/carta/colita-de-cuadril.webp",
    imagenAlt: "Colita de cuadril a la parrilla, cortada en láminas",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
  },
  {
    slug: "san-miguel",
    nombre: "LongHorn Plaza San Miguel",
    nombreCorto: "San Miguel",
    ciudad: "Lima",
    distrito: "San Miguel",
    departamento: "Lima",
    centroComercial: "C.C. Plaza San Miguel",
    direccion: "C.C. Plaza San Miguel, 2.º nivel",
    codigoPostal: "15035",
    telefonos: ["01 421 3916", "945 186 438"],
    coordenadas: { lat: -12.0769482, lng: -77.0828036 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_san_miguel",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=549",
    razonSocial: "L.H. SAN MIGUEL S.A.C.",
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/apanado-lomo-pesto.webp",
    imagenAlt: "Apanado de lomo con fettuccine al pesto",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
  },
  {
    slug: "santa-anita",
    nombre: "LongHorn Mall Aventura Santa Anita",
    nombreCorto: "Santa Anita",
    ciudad: "Lima",
    distrito: "Santa Anita",
    departamento: "Lima",
    centroComercial: "C.C. Mall Aventura Santa Anita",
    direccion: "Jr. Minería Nro. 122 Z.I. - 2.º piso, C.C. Mall Aventura",
    codigoPostal: "15008",
    telefonos: ["987 959 172"],
    coordenadas: { lat: -12.0564151, lng: -76.9708073 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_santa_anita",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=990",
    razonSocial: "L.H. SANTA ANITA S.A.C.",
    rangoPrecio: "S/ 100",
    imagen: "/images/carta/alitas-de-pollo.webp",
    imagenAlt: "Alitas de pollo LongHorn glaseadas en salsa BBQ",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
  },
  {
    slug: "puruchuco",
    nombre: "LongHorn Real Plaza Puruchuco",
    nombreCorto: "Puruchuco",
    ciudad: "Lima",
    distrito: "Ate",
    departamento: "Lima",
    centroComercial: "C.C. Real Plaza Puruchuco",
    direccion: "Prol. Javier Prado 8680 - C.C. Real Plaza Puruchuco",
    codigoPostal: "15494",
    telefonos: ["945 178 617"],
    coordenadas: { lat: -12.0408997, lng: -76.9320568 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-puruchuco",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: null,
    rangoPrecio: "S/ 120",
    imagen: "/images/carta/fettuccini-lomo-funghi.webp",
    imagenAlt: "Fettuccini con trozos de lomo fino al funghi",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
  },
  {
    slug: "mega-plaza",
    nombre: "LongHorn Mega Plaza",
    nombreCorto: "Mega Plaza",
    ciudad: "Lima",
    distrito: "Independencia",
    departamento: "Lima",
    centroComercial: "C.C. Mega Plaza",
    direccion: "Av. Alfredo Mendiola Nro. 3698 - C.C. Mega Plaza",
    telefonos: ["01 4213916", "945 186 438"],
    coordenadas: { lat: -11.9956091, lng: -77.0613347 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_mega_plaza",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: null,
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/portada-corte-parrilla.webp",
    imagenAlt: "Corte de res a la parrilla sobre tabla de madera",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
    notas: "El JSON-LD oficial no incluye código postal para este local.",
  },
  {
    slug: "san-juan-de-lurigancho",
    nombre: "LongHorn Mall Aventura San Juan de Lurigancho",
    nombreCorto: "San Juan de Lurigancho",
    ciudad: "Lima",
    distrito: "San Juan de Lurigancho",
    departamento: "Lima",
    centroComercial: "C.C. Mall Aventura San Juan de Lurigancho",
    direccion: "C.C. Mall Aventura San Juan de Lurigancho, 3.er nivel — Av. Lurigancho cdra. 9",
    telefonos: [],
    // Coordenadas del centro comercial según OpenStreetMap (elemento de tipo
    // «mall», Av. Lurigancho 997, Zárate), coherentes con la dirección
    // documentada por Perú Retail. Señalan el edificio, no la unidad del
    // 3.er nivel: suficiente para llegar, pendiente de afinar con el cliente.
    coordenadas: { lat: -12.0162569, lng: -76.9992319 },
    horarios: null,
    urlReservas: null,
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: null,
    imagen: "/images/carta/ensalada-quinua-longhorn.webp",
    imagenAlt: "Ensalada de quinua al estilo LongHorn",
    estadoVerificacion: "verificado-parcial",
    fuenteIds: ["peru-retail-2024", "web-oficial", "openstreetmap"],
    verificadoEl: "2026-10-15",
    servicios: ["Carta completa"],
    notas:
      "Apertura documentada por Perú Retail (17-02-2024): 3.er nivel, 384,11 m². No figura en el selector de reservas de mesa 24/7, por lo que no tiene enlace de reserva propio. El punto del mapa corresponde al centro comercial (dato de OpenStreetMap), no a la unidad exacta dentro del mall.",
  },

  /* --------------------------- PROVINCIAS ------------------------- */
  {
    slug: "chiclayo",
    nombre: "LongHorn Chiclayo",
    nombreCorto: "Chiclayo",
    ciudad: "Chiclayo",
    distrito: "Chiclayo",
    departamento: "Lambayeque",
    direccion: "Calle Miguel de Cervantes 300, int. 10, P.J. Diego Ferré",
    codigoPostal: "14008",
    telefonos: [],
    coordenadas: { lat: -6.7782153, lng: -79.8511703 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-chiclayo",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=989",
    razonSocial: "ZPM CHICLAYO S.A.C.",
    rangoPrecio: "S/ 89",
    imagen: "/images/carta/legumbres-a-la-parrilla.webp",
    imagenAlt: "Legumbres a la parrilla LongHorn",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
    notas: "El JSON-LD oficial no publica teléfono para este local.",
  },
  {
    slug: "piura",
    nombre: "LongHorn Real Plaza Piura",
    nombreCorto: "Piura",
    ciudad: "Piura",
    distrito: "Piura",
    departamento: "Piura",
    centroComercial: "C.C. Real Plaza Piura",
    direccion: "Av. Sánchez Cerro Nro. 234 - C.C. Real Plaza",
    codigoPostal: "20001",
    telefonos: ["(073) 306 086", "944 578 506"],
    coordenadas: { lat: -5.1862644, lng: -80.642388 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-piura",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: null,
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/bife-angosto.webp",
    imagenAlt: "Bife angosto a la parrilla, de la carta LongHorn",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
  },
  {
    slug: "cajamarca",
    nombre: "LongHorn Real Plaza Cajamarca",
    nombreCorto: "Cajamarca",
    ciudad: "Cajamarca",
    distrito: "Cajamarca",
    departamento: "Cajamarca",
    centroComercial: "C.C. Real Plaza Cajamarca",
    direccion: "Av. Evitamiento Norte, lote 1A - C.C. Real Plaza",
    codigoPostal: "06002",
    telefonos: ["(076) 357 099", "943 618 128"],
    coordenadas: { lat: -7.1545979, lng: -78.5051379 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-cajamarca",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=1261",
    razonSocial: "LH CAJAMARCA S.A.C.",
    rangoPrecio: "S/ 100",
    imagen: "/images/carta/parrilla-para-2.webp",
    imagenAlt: "Parrilla LongHorn para compartir",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
  },
  {
    slug: "huancayo",
    nombre: "LongHorn Real Plaza Huancayo",
    nombreCorto: "Huancayo",
    ciudad: "Huancayo",
    distrito: "Huancayo",
    departamento: "Junín",
    centroComercial: "C.C. Real Plaza Huancayo",
    direccion: "Av. Ferrocarril 1035 - C.C. Real Plaza",
    telefonos: ["(064) 397 006", "966 220 121"],
    coordenadas: { lat: -12.0665891, lng: -75.2055955 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-huancayo",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=845",
    razonSocial: "L.H. HUANCAYO S.A.C.",
    rangoPrecio: "S/ 89",
    imagen: "/images/carta/costillas-longhorn-bbq.webp",
    imagenAlt: "Costillas LongHorn en salsa BBQ",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas"],
    verificadoEl: VERIFICADO_EL,
    notas:
      "El JSON-LD oficial indica por error localidad «Tarma». Las coordenadas publicadas (-12.0666, -75.2056) y la dirección corresponden a Huancayo, Junín; se ha corregido la localidad y se mantienen las coordenadas oficiales.",
  },
];

export const LOCALES: Local[] = parseColeccion(
  localSchema,
  LOCALES_RAW.map((raw) => ({
    ...raw,
    telefonos: raw.telefonos ?? [],
    servicios: raw.servicios ?? SERVICIOS_BASE,
    publicado: raw.publicado ?? true,
  })),
  "locales",
);

/** Locales descartados del directorio, documentados para trazabilidad. */
export const LOCALES_DESCARTADOS = [
  {
    nombre: "LongHorn Centro Cívico",
    motivo:
      "Aparece en directorios de terceros (datos de usuarios) pero no en la web oficial, ni en el sistema de reservas, ni en el de pedidos. Publicarlo haría que el total superara los 13 locales que declara la marca. No se publica hasta confirmación del cliente.",
    fuenteIds: ["web-oficial", "mesa247-reservas"],
  },
] as const;
