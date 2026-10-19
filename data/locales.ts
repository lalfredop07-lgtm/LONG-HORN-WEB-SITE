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
 * · «Centro Cívico» aparece en directorios de terceros y en una ficha de
 *   Google Maps propia, pero no en ninguna fuente oficial de la marca: NO
 *   se publica. Ver docs/locales-verificacion.md.
 *
 * COORDENADAS (marcador en el mapa interno de Leaflet/OpenStreetMap)
 * --------------------------------------------------------------------
 * Siguen viniendo del JSON-LD oficial, salvo correcciones puntuales
 * documentadas en `notas` cuando ese dato interno de la marca resultó
 * impreciso. San Juan de Lurigancho usa, además, la coordenada de su ficha
 * de Google Maps (ver más abajo), que confirmó el punto con ~5 m de
 * diferencia.
 *
 * GOOGLE MAPS — BOTONES «CÓMO LLEGAR» Y «ABRIR EN GOOGLE MAPS»
 * --------------------------------------------------------------------
 * `googleMapsCid` y `googleMapsNombre` vienen de abrir Google Maps y
 * buscar cada local por nombre + centro comercial/dirección, verificando
 * a mano que la ficha que resuelve tiene reseñas y fotos reales de ESE
 * restaurante (no del centro comercial, no de otro local de la cadena).
 * `googleMapsCid` es el identificador `0x<feature>:0x<cid>` que la propia
 * ficha pública expone en su URL — `lib/locales.ts` lo usa como
 * `destination_place_id`/`query_place_id`, el mismo mecanismo que un Place
 * ID de la API de pago de Google Places, pero obtenido gratis navegando la
 * web normal de Google Maps. Verificación hecha el 2026-10-19; metodología
 * completa y hallazgos en docs/locales-verificacion.md.
 *
 * Cuando `googleMapsCid` es `null` (solo Piura, de momento) no se inventa
 * nada: los botones caen a una búsqueda por nombre y dirección, y el local
 * queda marcado como pendiente de verificación en `notas`.
 *
 * HORARIOS
 * --------
 * LongHorn no publica horarios en ninguna fuente oficial consultable.
 * Se dejan en `null` y la interfaz lo indica de forma explícita en vez
 * de inventarlos. Ver docs/pendientes-cliente.md.
 * ================================================================== */

const VERIFICADO_EL = "2026-10-19";
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
    // Coordenada corregida: el JSON-LD interno (-12.0869621, -76.9789942)
    // no correspondía a ningún lugar que Google Maps reconociera como el
    // restaurante (~490 m de la ficha real).
    coordenadas: { lat: -12.0850651, lng: -76.9748967 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_jockey_plaza",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=542",
    razonSocial: "LONGHORN GRILL S.A.C.",
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/bife-angosto.webp",
    imagenAlt: "Bife angosto a la parrilla, de la carta LongHorn",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    // Ficha de Google Maps verificada a mano el 2026-10-19: "LongHorn Grill
    // & Drinks - Jockey Plaza", 4,3★, 2762 reseñas, 973 fotos. Confirmado
    // también el enlace final con destination_place_id/query_place_id.
    googleMapsCid: "0x9105c7b28cd68067:0x8c4ccbc754b63ae2",
    googleMapsNombre: "LongHorn Grill & Drinks - Jockey Plaza, Av. Javier Prado Este 4200, Santiago de Surco 15023, Perú",
    notas:
      "Primer local de la marca. Según prensa económica, LongHorn nació aquí a comienzos de los 2000. " +
      "Coordenadas y enlaces de Google Maps corregidos el 2026-10-19 (ver docs/locales-verificacion.md).",
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
    // Confirmada contra la ficha de Google Maps: coincide con el JSON-LD
    // interno a menos de 2 m.
    coordenadas: { lat: -12.1011127, lng: -77.0375226 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_san_isidro",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=543",
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/parrilla-para-2.webp",
    imagenAlt: "Parrilla LongHorn para compartir",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    // Ficha verificada el 2026-10-19: "LongHorn Grill & Drinks - San
    // Isidro", 4,3★, 3940 reseñas. destination_place_id/query_place_id
    // comprobados manualmente (prioridad explícita del cliente).
    googleMapsCid: "0x9105c843bf0c4ad9:0xcfb6f10d7dbf2056",
    googleMapsNombre: "LongHorn Grill & Drinks - San Isidro, C. Los Libertadores 302, San Isidro 15073, Perú",
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
    // Coordenada corregida: el JSON-LD interno quedaba a ~285 m de la ficha
    // de negocio real en Google Maps.
    coordenadas: { lat: -12.0904015, lng: -77.0525007 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_salaverry",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=546",
    razonSocial: "L.H. SALAVERRY S.A.C.",
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/costillas-longhorn-bbq.webp",
    imagenAlt: "Costillas LongHorn en salsa BBQ",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    // Ficha verificada el 2026-10-19: "LongHorn Grill & Drinks -
    // Salaverry", 4,2★, 2603 reseñas.
    googleMapsCid: "0x9105c8544faaaaab:0xfef746ffcf2ca511",
    googleMapsNombre:
      "LongHorn Grill & Drinks - Salaverry, Real Plaza Salaverry, Av. Gral. Felipe Salaverry 2370, Jesús María 15076, Perú",
    notas: "Coordenadas y enlaces de Google Maps corregidos el 2026-10-19 (ver docs/locales-verificacion.md).",
  },
  {
    slug: "san-borja",
    nombre: "LongHorn San Borja",
    nombreCorto: "San Borja",
    ciudad: "Lima",
    distrito: "San Borja",
    departamento: "Lima",
    centroComercial: "C.C. La Rambla",
    direccion: "Jirón Carpaccio 210",
    codigoPostal: "15036",
    telefonos: ["01 7652212"],
    // Confirmada contra la ficha de Google Maps: coincide con el JSON-LD
    // interno a pocos metros.
    coordenadas: { lat: -12.090716, lng: -77.0048807 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-san-borja",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=547",
    razonSocial: "L.H. SAN BORJA S.A.C.",
    rangoPrecio: "S/ 120",
    imagen: "/images/carta/colita-de-cuadril.webp",
    imagenAlt: "Colita de cuadril a la parrilla, cortada en láminas",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    // Ficha verificada el 2026-10-19: Google Maps la lista como "LongHorn
    // Grill & Drinks - San Borja" (4,3★, 1397 reseñas), no como "La
    // Rambla" — se añadió `centroComercial` para que quede documentado que
    // son la misma sede.
    googleMapsCid: "0x9105c7d6b237a92b:0xc3bb453bb79bcdd2",
    googleMapsNombre: "LongHorn Grill & Drinks - San Borja, Vittore Carpaccio 210, San Borja 15036, Perú",
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
    // Coordenada corregida: el JSON-LD interno quedaba a ~70 m de la ficha
    // de negocio real en Google Maps.
    coordenadas: { lat: -12.0763926, lng: -77.082508 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_san_miguel",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=549",
    razonSocial: "L.H. SAN MIGUEL S.A.C.",
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/apanado-lomo-pesto.webp",
    imagenAlt: "Apanado de lomo con fettuccine al pesto",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    // Ficha verificada el 2026-10-19: "LongHorn Grill & Drinks - San
    // Miguel", 4,3★, 3728 reseñas. destination_place_id/query_place_id
    // comprobados manualmente (prioridad explícita del cliente): abren la
    // ficha de LongHorn, no la genérica de Plaza San Miguel.
    googleMapsCid: "0x9105c972728fffff:0x2853eb72b2bf5484",
    googleMapsNombre: "LongHorn Grill & Drinks - San Miguel, Plaza San Miguel, Av. de la Marina 2000, San Miguel 15035, Perú",
    notas: "Coordenadas y enlaces de Google Maps corregidos el 2026-10-19 (ver docs/locales-verificacion.md).",
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
    // Coordenada corregida: el JSON-LD interno quedaba a ~65 m de la ficha
    // de negocio real en Google Maps.
    coordenadas: { lat: -12.0569346, lng: -76.9705541 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_santa_anita",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=990",
    razonSocial: "L.H. SANTA ANITA S.A.C.",
    rangoPrecio: "S/ 100",
    imagen: "/images/carta/alitas-de-pollo.webp",
    imagenAlt: "Alitas de pollo LongHorn glaseadas en salsa BBQ",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    // Ficha verificada el 2026-10-19: "LongHorn Grill & Drinks - Santa
    // Anita", 4,1★, 616 reseñas. Confirmado que corresponde a Santa Anita y
    // no a otro Mall Aventura de la cadena de centros comerciales.
    googleMapsCid: "0x9105c66688b7c0cf:0x8e29a96d706aa11b",
    googleMapsNombre:
      "LongHorn Grill & Drinks - Santa Anita, Centro Comercial Aventura, Ca. Minería 122, Santa Anita 15008, Perú",
    notas: "Coordenadas y enlaces de Google Maps corregidos el 2026-10-19 (ver docs/locales-verificacion.md).",
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
    // Coordenada corregida: el JSON-LD interno quedaba a ~70 m de la ficha
    // de negocio real en Google Maps.
    coordenadas: { lat: -12.0413083, lng: -76.9315362 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-puruchuco",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: null,
    rangoPrecio: "S/ 120",
    imagen: "/images/carta/fettuccini-lomo-funghi.webp",
    imagenAlt: "Fettuccini con trozos de lomo fino al funghi",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    // Ficha verificada el 2026-10-19: "LongHorn Grill & Drinks -
    // Puruchuco", 4,3★, 200 reseñas.
    googleMapsCid: "0x9105c71c0b8a1d17:0xe9ed7ce8760087d6",
    googleMapsNombre:
      "LongHorn Grill & Drinks - Puruchuco, Prolongacion Javier Prado 8680, Ate 15494, Ate 15004, Perú",
    notas: "Coordenadas y enlaces de Google Maps corregidos el 2026-10-19 (ver docs/locales-verificacion.md).",
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
    // Coordenada corregida: el JSON-LD interno quedaba a ~85 m de la ficha
    // de negocio real en Google Maps.
    coordenadas: { lat: -11.9949856, lng: -77.0617764 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn_mega_plaza",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: null,
    rangoPrecio: "S/ 80",
    imagen: "/images/carta/portada-corte-parrilla.webp",
    imagenAlt: "Corte de res a la parrilla sobre tabla de madera",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    // Ficha verificada el 2026-10-19: "LongHorn Grill & Drinks - Mega
    // Plaza", 4,2★, 1184 reseñas.
    googleMapsCid: "0x9105ce56bd3c0001:0x34abf67194f313a2",
    googleMapsNombre: "LongHorn Grill & Drinks - Mega Plaza, Mega Plaza, Av. Alfredo Mendiola 3698, Independencia 15311, Perú",
    notas:
      "El JSON-LD oficial no incluye código postal para este local. " +
      "Coordenadas y enlaces de Google Maps corregidos el 2026-10-19 (ver docs/locales-verificacion.md).",
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
    // Antes se usaba el centroide del centro comercial (OpenStreetMap), sin
    // ficha propia del restaurante. El 2026-10-19 se encontró en Google
    // Maps la ficha de negocio «LongHorn Grill & Drinks - San Juan» (68
    // reseñas), que cae a ~5 m del punto anterior: confirma la ubicación y
    // sube la precisión al restaurante, no solo al edificio.
    coordenadas: { lat: -12.0162345, lng: -76.9991907 },
    horarios: null,
    urlReservas: null,
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: null,
    imagen: "/images/carta/ensalada-quinua-longhorn.webp",
    imagenAlt: "Ensalada de quinua al estilo LongHorn",
    estadoVerificacion: "verificado-parcial",
    fuenteIds: ["peru-retail-2024", "web-oficial", "openstreetmap", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    servicios: ["Carta completa"],
    googleMapsCid: "0x9105c5073637556b:0xc30eff006eb82cd7",
    googleMapsNombre: "LongHorn Grill & Drinks - San Juan, Av. Lurigancho Cdra. 9, San Juan de Lurigancho 15427, Perú",
    notas:
      "Apertura documentada por Perú Retail (17-02-2024): 3.er nivel, 384,11 m². No figura en el selector de " +
      "reservas de mesa 24/7, por lo que no tiene enlace de reserva propio. Sigue marcado «verificado-parcial» " +
      "por la falta de teléfono y reserva propios, aunque desde el 2026-10-19 los botones de Google Maps usan " +
      "la ficha de negocio verificada del restaurante, no solo el centro comercial.",
  },

  /* --------------------------- PROVINCIAS ------------------------- */
  {
    slug: "chiclayo",
    nombre: "LongHorn Chiclayo",
    nombreCorto: "Chiclayo",
    ciudad: "Chiclayo",
    distrito: "Chiclayo",
    departamento: "Lambayeque",
    centroComercial: "C.C. Real Plaza Chiclayo",
    direccion: "Calle Miguel de Cervantes 300, int. 10, P.J. Diego Ferré",
    codigoPostal: "14008",
    telefonos: [],
    // ATENCIÓN — direcciones en conflicto (pendiente de confirmar con el
    // cliente). El JSON-LD interno de mesa 24/7 da «Miguel de Cervantes
    // 300, P.J. Diego Ferré», a ~2 km de la única ficha de negocio que
    // Google Maps reconoce como «LongHorn Grill & Drinks - Chiclayo» (30
    // reseñas), en Av. Andrés Avelino Cáceres 252. No hay una segunda
    // ficha de LongHorn en Chiclayo. Se usa la coordenada y el nombre de la
    // ficha verificada para los botones (es el único punto que un cliente
    // puede llegar a pie y encontrar el restaurante real); `direccion` se
    // conserva tal cual la publica la marca, sin inventar un cambio.
    coordenadas: { lat: -6.7779543, lng: -79.8329257 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-chiclayo",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=989",
    razonSocial: "ZPM CHICLAYO S.A.C.",
    rangoPrecio: "S/ 89",
    imagen: "/images/carta/legumbres-a-la-parrilla.webp",
    imagenAlt: "Legumbres a la parrilla LongHorn",
    estadoVerificacion: "verificado-parcial",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    googleMapsCid: "0x904cef0bcc82ba9d:0xd6cd30c76f3364a1",
    googleMapsNombre: "LongHorn Grill & Drinks - Chiclayo, Andrés Avelino Cáceres 252, Chiclayo 14008, Perú",
    notas:
      "El JSON-LD oficial no publica teléfono para este local. Dirección pendiente de confirmar: el sistema de " +
      "reservas da «Miguel de Cervantes 300, P.J. Diego Ferré» pero la única ficha de Google Maps de LongHorn en " +
      "Chiclayo está en «Av. Andrés Avelino Cáceres 252», a ~2 km. Se usan la coordenada y el nombre de la ficha " +
      "verificada para los botones de Google Maps.",
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
    // Sin ficha propia en Google Maps: se probó "LongHorn Piura", "LongHorn
    // Real Plaza Piura" y variantes el 2026-10-19 (dos veces, en sesiones
    // de navegador independientes) y Google solo devuelve el centro
    // comercial Real Plaza Piura y fichas de otras sedes (Salaverry,
    // Huancayo, Centro Cívico) — ninguna en Piura. El local SÍ sigue activo
    // hoy en el sistema oficial de reservas, así que no se trata como
    // cerrado ni se elimina: se conserva la coordenada del JSON-LD sin
    // cambios y los botones usan una búsqueda por nombre y dirección, sin
    // `googleMapsCid`. Es el único de los 13 sin ficha verificada.
    googleMapsCid: null,
    googleMapsNombre: null,
    notas:
      "PENDIENTE DE VERIFICACIÓN: no se encontró ninguna ficha de negocio propia de «LongHorn Piura» en Google " +
      "Maps (revisado dos veces el 2026-10-19). El local sigue activo hoy en el sistema oficial de reservas, así " +
      "que se conserva la coordenada del JSON-LD sin cambios; los botones de Google Maps usan una búsqueda por " +
      "nombre y dirección (sin identificador de ficha) hasta poder confirmarlo in situ o cuando Google indexe " +
      "una ficha propia.",
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
    // Coordenada corregida: el JSON-LD interno quedaba a ~90 m de la ficha
    // de negocio real en Google Maps.
    coordenadas: { lat: -7.1547068, lng: -78.5059364 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-cajamarca",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=1261",
    razonSocial: "LH CAJAMARCA S.A.C.",
    rangoPrecio: "S/ 100",
    imagen: "/images/carta/parrilla-para-2.webp",
    imagenAlt: "Parrilla LongHorn para compartir",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    // Ficha verificada el 2026-10-19: "LongHorn Grill & Drinks -
    // Cajamarca", 4,0★, 172 reseñas.
    googleMapsCid: "0x91b25ae5a6884d61:0xd3c90972b376c922",
    googleMapsNombre: "LongHorn Grill & Drinks - Cajamarca, Vía de Evitamiento Nte. Lote 1, Cajamarca 06002, Perú",
    notas: "Coordenadas y enlaces de Google Maps corregidos el 2026-10-19 (ver docs/locales-verificacion.md).",
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
    // Coordenada corregida: el JSON-LD interno quedaba a ~55 m de la ficha
    // de negocio real en Google Maps.
    coordenadas: { lat: -12.0668835, lng: -75.205146 },
    horarios: null,
    urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-huancayo",
    urlPedidos: PEDIDOS,
    urlLibroReclamaciones: "https://longhorn.mesa247.pe/?page=libro-reclamaciones&clienteId=845",
    razonSocial: "L.H. HUANCAYO S.A.C.",
    rangoPrecio: "S/ 89",
    imagen: "/images/carta/costillas-longhorn-bbq.webp",
    imagenAlt: "Costillas LongHorn en salsa BBQ",
    estadoVerificacion: "verificado",
    fuenteIds: ["mesa247-reservas", "google-maps-ficha-negocio"],
    verificadoEl: VERIFICADO_EL,
    // Ficha verificada el 2026-10-19: "LongHorn Grill & Drinks -
    // Huancayo", 3,8★, 144 reseñas.
    googleMapsCid: "0x910e963a8be5aaab:0x3fc7dcad5e90f903",
    googleMapsNombre: "LongHorn Grill & Drinks - Huancayo, Real Plaza, Av. Ferrocarril 1035, Huancayo 12001, Perú",
    notas:
      "El JSON-LD oficial indica por error localidad «Tarma». La dirección corresponde a Huancayo, Junín; se ha " +
      "corregido la localidad. Coordenadas y enlaces de Google Maps corregidos el 2026-10-19 (ver " +
      "docs/locales-verificacion.md).",
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
      "No aparece en la web oficial, ni en el sistema de reservas, ni en el de pedidos. Reconsultado el " +
      "2026-10-19: Google Maps tiene una ficha de negocio propia «LongHorn Grill & Drinks - Centro Civico» " +
      "(4,1★, 823 reseñas, 322 fotos, CC Real Plaza, Av. Garcilaso de la Vega 1337, Lima, lat -12.0560946 / " +
      "lng -77.0373028, CID 0x904a1a9a4ff3ffff:0xc67739d51322059e), coherente con varios directorios de " +
      "terceros. Publicarlo llevaría el total a 14 y contradiría los «13 locales» que declara la marca. " +
      "Pendiente de que el cliente confirme si es un 14.º local activo o sustituye a alguno de los 13 actuales " +
      "(el propio cliente apuntó que algunos directorios listan Centro Cívico en lugar de Piura — ver incidencia " +
      "de Piura arriba; ambos se mantienen en su estado actual hasta confirmación).",
    fuenteIds: ["web-oficial", "mesa247-reservas"],
  },
] as const;
