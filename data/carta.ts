import {
  categoriaSchema,
  grupoSchema,
  parseColeccion,
  platoSchema,
  slugify,
  type Categoria,
  type CategoriaId,
  type EstadoVerificacion,
  type Grupo,
  type Plato,
} from "@/lib/schemas";
import type { FuenteId } from "@/data/fuentes";

/* ================================================================== *
 * CARTA LONGHORN
 *
 * Fuente única: carta oficial en PDF «Lima Moderna» distribuida por
 * mesa 24/7 (ver data/fuentes.ts → "carta-pdf"), contrastada con la
 * carta digital de longhorn.com.pe.
 *
 * Reglas de este archivo:
 *  · Nombres, descripciones y precios se transcriben literalmente.
 *  · Si la carta no da descripción, el plato va sin descripción. No se
 *    redactan textos que aparenten ser oficiales.
 *  · Los precios son soles (PEN) e incluyen IGV y servicio.
 * ================================================================== */

export const VERIFICADO_EL = "2026-10-14";

export const NOTA_MENU_KIDS =
  "Promoción para niños hasta 12 años. Todas las opciones vienen con un huevo de chocolate Kinder.";

/* ------------------------------------------------------------------ *
 * Grupos de navegación
 * ------------------------------------------------------------------ */

// Orden de pestañas pedido explícitamente por el cliente: Piqueos, Cortes,
// Parrillas y Pastas primero (en ese orden), el resto después.
const GRUPOS_RAW = [
  { id: "piqueos", nombre: "Piqueos", nombreCorto: "Piqueos", orden: 0, sinCartaPublicada: false, descripcion: "El inicio perfecto: chorizos, tequeños, anticuchos y piqueos para compartir." },
  { id: "grill", nombre: "Grill LongHorn", nombreCorto: "Cortes", orden: 1, sinCartaPublicada: false, descripcion: "Nuestros cortes: americanos premium, argentinos, selectos y los clásicos de la casa." },
  { id: "mas-del-grill", nombre: "Más del Grill", nombreCorto: "Parrillas", orden: 2, sinCartaPublicada: false, descripcion: "Parrillas para compartir, cerdo, pollo y hamburguesas a la brasa." },
  { id: "pastas", nombre: "Pastas", nombreCorto: "Pastas", orden: 3, sinCartaPublicada: false, descripcion: "Pasta fresca, raviolis rellenos y salsas de siempre." },
  { id: "ensaladas", nombre: "Ensaladas", nombreCorto: "Ensaladas", orden: 4, sinCartaPublicada: false, descripcion: "Frescas, generosas y pensadas también para quien busca algo ligero." },
  { id: "especialidades", nombre: "Especialidades", nombreCorto: "Especialidades", orden: 5, sinCartaPublicada: false, descripcion: "Las recetas que nos hicieron conocidos, saltados y combinaciones de carne y pasta." },
  { id: "guarniciones", nombre: "Guarniciones", nombreCorto: "Guarniciones", orden: 6, sinCartaPublicada: false },
  { id: "menu-kids", nombre: "Menú Kids", nombreCorto: "Kids", orden: 7, sinCartaPublicada: false, descripcion: NOTA_MENU_KIDS },
  {
    id: "bebidas",
    nombre: "Bebidas y cócteles",
    nombreCorto: "Bebidas",
    orden: 8,
    sinCartaPublicada: false,
    descripcion:
      "La barra LongHorn: vinos por copa, cervezas, bebidas sin alcohol y los cócteles que hemos podido verificar en la carta vigente. El resto de la coctelería se confirma en sala.",
  },
] as const;

export const GRUPOS: Grupo[] = parseColeccion(grupoSchema, GRUPOS_RAW as unknown as unknown[], "grupos").sort(
  (a, b) => a.orden - b.orden,
);

/* ------------------------------------------------------------------ *
 * Categorías (fieles a la estructura del documento original)
 * ------------------------------------------------------------------ */

const CATEGORIAS_RAW = [
  { id: "piqueos", grupo: "piqueos", nombre: "Piqueos", orden: 0 },
  { id: "ensaladas", grupo: "ensaladas", nombre: "Ensaladas", orden: 1 },
  { id: "pastas", grupo: "pastas", nombre: "Pastas", orden: 2 },
  { id: "grill-americana-premium", grupo: "grill", nombre: "Grill LongHorn", subtitulo: "Americana Premium", orden: 3 },
  { id: "grill-cortes-selectos", grupo: "grill", nombre: "Grill LongHorn", subtitulo: "Cortes Selectos", orden: 4 },
  { id: "grill-argentina-premium", grupo: "grill", nombre: "Grill LongHorn", subtitulo: "Argentina Premium", orden: 5 },
  { id: "grill-nuestros-clasicos", grupo: "grill", nombre: "Grill LongHorn", subtitulo: "Nuestros Clásicos", orden: 6 },
  { id: "mas-del-grill", grupo: "mas-del-grill", nombre: "Más del Grill", orden: 7 },
  { id: "especialidades", grupo: "especialidades", nombre: "Especialidades", orden: 8 },
  { id: "saltados", grupo: "especialidades", nombre: "Saltados", orden: 9 },
  { id: "carne-y-pasta", grupo: "especialidades", nombre: "Carne y Pasta", subtitulo: "La combinación perfecta", orden: 10 },
  { id: "guarniciones", grupo: "guarniciones", nombre: "Guarniciones", orden: 11 },
  { id: "menu-kids", grupo: "menu-kids", nombre: "Menú Kids", orden: 12 },

  /*
   * Bebidas: subcategorías seleccionables (pestañas internas del grupo,
   * ver CartaPorCategorias.tsx). Solo se muestra una pestaña cuando tiene
   * al menos un producto publicado — así que "Cócteles de Autor" no
   * aparece hasta que el restaurante confirme alguno de esos 8 tragos
   * (siguen en PLATOS_RAW, ocultos, listos para publicarse).
   */
  { id: "bebidas-vinos", grupo: "bebidas", nombre: "Vinos por Copa", subtitulo: "Vinos", orden: 13 },
  { id: "bebidas-pisco-sours", grupo: "bebidas", nombre: "Pisco Sours", subtitulo: "Pisco Sours", orden: 14 },
  { id: "bebidas-chilcanos", grupo: "bebidas", nombre: "Chilcanos", subtitulo: "Chilcanos", orden: 15 },
  { id: "bebidas-cocteles-clasicos", grupo: "bebidas", nombre: "Cócteles Clásicos", subtitulo: "Clásicos", orden: 16 },
  { id: "bebidas-cervezas", grupo: "bebidas", nombre: "Cervezas", subtitulo: "Cervezas", orden: 17 },
  { id: "bebidas-sin-alcohol", grupo: "bebidas", nombre: "Bebidas sin Alcohol", subtitulo: "Sin alcohol", orden: 18 },
  { id: "bebidas-cocteles-autor", grupo: "bebidas", nombre: "Cócteles de Autor", subtitulo: "Cócteles de autor", orden: 19 },
] as const;

export const CATEGORIAS: Categoria[] = parseColeccion(
  categoriaSchema,
  CATEGORIAS_RAW as unknown as unknown[],
  "categorias",
).sort((a, b) => a.orden - b.orden);

/* ------------------------------------------------------------------ *
 * Platos
 * ------------------------------------------------------------------ */

/* -------------------------- Bebidas: notas compartidas ------------------ */

const NOTA_HAPPY_HOUR =
  "Promoción Happy Hour, de lunes a viernes: 2 x S/ 29. La carta digital no publica un precio por unidad.";
const NOTA_FESTIVAL_SOURS =
  "Promoción Festival de Sours: 3 x S/ 25. La carta digital no publica un precio por unidad.";
const NOTA_5_LOCALES =
  "Carta digital vigente en 5 de los 13 locales: Jockey Plaza, San Isidro, Real Plaza Salaverry, Plaza San Miguel y La Rambla - San Borja.";
const LOCALES_CARTA_DIGITAL = ["jockey-plaza", "san-isidro", "salaverry", "san-miguel", "san-borja"];
const NOTA_DELIVERY_SAN_BORJA =
  "Precio de delivery y recojo publicado por Rappi para la sede de San Borja. No confirmado para consumo en mesa ni para el resto de la red.";
const NOTA_HISTORICO =
  "Nombre documentado en un recetario de coctelería de 2018 (fuente de terceros, no oficial). No hay confirmación de que siga vigente: borrador pendiente de aprobación, ver docs/bebidas-pendientes.md.";

/** Guarnición estándar que acompaña a los cortes, transcrita de la carta. */
const GUARNICION =
  "Incluye guarnición a escoger: papas fritas o papa al horno o camote frito o camote al horno o ensalada parrillera.";

type PlatoRaw = {
  nombre: string;
  categoria: CategoriaId;
  descripcion?: string;
  precio?: number;
  presentacion?: string;
  comensales?: number;
  variantes?: string[];
  incluyeGuarnicion?: boolean;
  bajoEnCalorias?: boolean;
  destacado?: boolean;
  imagen?: string;
  imagenAlt?: string;
  notaFuente?: string;
  /** Ingredientes principales, solo cuando la fuente los enumera. */
  ingredientes?: string[];
  /** Locales donde está confirmado. Vacío/ausente = toda la red. */
  disponibleEn?: string[];
  /** Por defecto "carta-pdf" (los 103 platos de alimentos). Las bebidas
   *  citan su propia fuente: carta digital, Rappi o el recetario histórico. */
  fuenteId?: FuenteId;
  /** Por defecto la fecha de verificación de la carta de alimentos. */
  verificadoEl?: string;
  /** Por defecto "publicado". Las bebidas pendientes o históricas van
   *  "oculto": quedan en la base de datos, listas para activarse, pero no
   *  se renderizan ni se cuentan en la carta pública. */
  estado?: "publicado" | "oculto";
  /** Trazabilidad editorial (ver estadoVerificacionSchema). */
  estadoVerificacion?: EstadoVerificacion;
};

const PLATOS_RAW: PlatoRaw[] = [
  /* ---------------------------- PIQUEOS --------------------------- */
  { nombre: "1/2 Porción Chorizo", categoria: "piqueos", precio: 18, presentacion: "2 unidades" },
  { nombre: "Porción de Chorizo", categoria: "piqueos", precio: 29, presentacion: "4 unidades" },
  { nombre: "1/2 Porción de Morcillas", categoria: "piqueos", precio: 16, presentacion: "2 unidades" },
  { nombre: "Porción de Morcillas", categoria: "piqueos", precio: 26, presentacion: "4 unidades" },
  {
    nombre: "Carpaccio de Lomo",
    categoria: "piqueos",
    precio: 39,
    descripcion:
      "Finas láminas de lomo con parmesano, vinagre balsámico, aceite de oliva, arúgula y albahaca acompañado con tostadas.",
  },
  {
    nombre: "Tequeños Parrilleros",
    categoria: "piqueos",
    precio: 25,
    descripcion: "6 tequeños rellenos de bondiola y chorizo acompañados de guacamole y pico de gallo.",
  },
  {
    nombre: "Tequeños de Morcilla",
    categoria: "piqueos",
    precio: 25,
    descripcion: "6 tequeños rellenos de morcilla, acompañados de guacamole y pico de gallo.",
  },
  {
    nombre: "Tequeños de Queso",
    categoria: "piqueos",
    precio: 25,
    descripcion: "6 tequeños rellenos de queso, acompañados de guacamole y pico de gallo.",
  },
  {
    nombre: "Tequeños Mixtos",
    categoria: "piqueos",
    precio: 25,
    descripcion: "6 tequeños parrilleros de queso y morcilla, acompañados de guacamole y pico de gallo.",
  },
  {
    nombre: "Papas Rústicas al Ajito Picoso",
    categoria: "piqueos",
    precio: 22,
    descripcion:
      "Papas Huamantanga presentadas en rodajas salteadas, cebolla, tocino crocante, perejil y un toque de rocoto.",
  },
  {
    nombre: "Mollejas de Res",
    categoria: "piqueos",
    precio: 30,
    presentacion: "10 unidades",
    descripcion: "10 unidades hechas en nuestra parrilla capturando sus mejores aromas.",
  },
  {
    nombre: "Alitas de Pollo",
    categoria: "piqueos",
    precio: 47,
    descripcion: "BBQ ó picantes ó naturales ó orientales ó de maracuyá.",
    variantes: ["BBQ", "Picantes", "Naturales", "Orientales", "De maracuyá"],
    destacado: true,
    imagen: "/images/carta/alitas-de-pollo.webp",
    imagenAlt: "Alitas de pollo LongHorn glaseadas en salsa BBQ con salsa de acompañamiento",
  },
  {
    nombre: "Anticuchos de Corazón",
    categoria: "piqueos",
    precio: 39,
    presentacion: "3 unidades",
    descripcion: "3 unidades acompañados con papa grillada, choclo, salsa de rocoto y huancaína.",
  },
  {
    nombre: "Champiñones a la Parrilla",
    categoria: "piqueos",
    precio: 39,
    descripcion: "Los mas frescos champiñones hechos en nuestra parrilla.",
  },
  {
    nombre: "Champiñones al Ajillo",
    categoria: "piqueos",
    precio: 39,
    descripcion: "Una tradición, salteados con ajo, vino blanco y perejil.",
  },
  {
    nombre: "Ceviche de Champiñones",
    categoria: "piqueos",
    precio: 39,
    descripcion:
      "La mejor fusión saludable a nuestro estilo norteño, champiñones en láminas, limón, cebolla, ají limo, culantro acompañado con camote y choclo tierno.",
  },
  {
    nombre: "Langostinos al Panko",
    categoria: "piqueos",
    precio: 38,
    descripcion:
      "Langostinos empanizados al panko crocante acompañados con salsa de ají amarillo y maracuyá.",
  },
  {
    nombre: "Taquitos de Lomo",
    categoria: "piqueos",
    precio: 35,
    descripcion:
      "Los mejores taquitos con nuestro lomito a la parrilla, frejol negro, acompañado de guacamole y pico de gallo.",
  },
  {
    nombre: "Taquitos de Pollo",
    categoria: "piqueos",
    precio: 35,
    descripcion:
      "Los mejores de pollo a la parrilla, frejol negro, acompañado de guacamole y pico de gallo.",
  },
  {
    nombre: "Piqueo LongHorn",
    categoria: "piqueos",
    precio: 49,
    destacado: true,
    descripcion:
      "Piqueo que consta de 2 chorizos y 2 palitos de anticucho de corazón, 2 morcillas y mollejas de res.",
  },

  /* --------------------------- ENSALADAS -------------------------- */
  {
    nombre: "Ensalada Parrillera Chica",
    categoria: "ensaladas",
    precio: 21,
    bajoEnCalorias: true,
    descripcion: "Las más frescas lechugas, rabanitos, cebollas y tomates con el aliño de la casa.",
  },
  {
    nombre: "Ensalada Parrillera Grande",
    categoria: "ensaladas",
    precio: 29,
    bajoEnCalorias: true,
    descripcion: "Las más frescas lechugas, rabanitos, cebollas y tomates con el aliño de la casa.",
  },
  {
    nombre: "Ensalada de Quinua al Estilo LongHorn",
    categoria: "ensaladas",
    precio: 39,
    destacado: true,
    imagen: "/images/carta/ensalada-quinua-longhorn.webp",
    imagenAlt:
      "Ensalada de quinua al estilo LongHorn con pollo a la parrilla, palta, huevo y aceitunas",
    descripcion:
      "La mejor selección de quinua, pollo a la parrilla en cortes largos, pimiento, palta, tomate, aceitunas negras y verdes, queso fresco y cebolla blanca, choclo y huevo. Aliñada con salsa a la limoneta.",
  },
  {
    nombre: "Ensalada César",
    categoria: "ensaladas",
    precio: 31,
    descripcion:
      "Tiernas lechugas romanas, crocantes crutones de pan y parmesano del día, acompañado de la tradicional salsa de anchoas, aceite de oliva y mostaza.",
  },
  {
    nombre: "Ensalada César con Pollo",
    categoria: "ensaladas",
    precio: 39,
    descripcion:
      "Lechugas romanas, crocantes crutones de pan y parmesano del día, con salsa de anchoas, aceite de oliva y mostaza con pechuga de pollo a la parrilla.",
  },
  {
    nombre: "Ensalada de Pollo Crocante LongHorn",
    categoria: "ensaladas",
    precio: 46,
    descripcion:
      "Selección de lechugas mixtas: palta, espárragos, pecanas acarameladas, tomate cherry, tomate italiano, arúgula, pollo empanizado, queso roquefort, aliñada con salsa de miel y mostaza.",
  },

  /* ----------------------------- PASTAS --------------------------- */
  {
    nombre: "Risotto con Funghi Porcini",
    categoria: "pastas",
    precio: 39,
    descripcion: "Risotto con funghi con crema fresca y parmesano.",
  },
  {
    nombre: "Canelones Ricota y Espinaca a los 4 Quesos",
    categoria: "pastas",
    precio: 36,
    descripcion:
      "Las inconfundibles, rellenos con espinaca, queso ricota y parmesano. bañados con salsa a los 4 quesos.",
  },
  {
    nombre: "Fettuccini con Trozos de Lomo al Funghi Mixto",
    categoria: "pastas",
    precio: 49,
    destacado: true,
    imagen: "/images/carta/fettuccini-lomo-funghi.webp",
    imagenAlt: "Fettuccini con trozos de lomo fino, hongos funghi y parmesano recién rallado",
    descripcion:
      "Mixtura de hongos funghi porcini y champiñones salteados con trozos de lomo fino en reducción de oporto y crema fresca.",
  },
  {
    nombre: "Spaguetti o Fettuccini",
    categoria: "pastas",
    precio: 38,
    descripcion: "Pídelo con la salsa de tu elección: huancaína, pesto, Alfredo, mediterránea, putanesca y bolognesa.",
    variantes: ["Huancaína", "Pesto", "Alfredo", "Mediterránea", "Putanesca", "Bolognesa"],
  },
  { nombre: "Lasagna de Carne", categoria: "pastas", precio: 39, descripcion: "La tradicional de la casa." },
  {
    nombre: "Lasagna de Morcilla",
    categoria: "pastas",
    precio: 39,
    descripcion:
      "Fusionamos nuestra morcilla parrillera para obtener una de las mejores lasagnas, con pasta fresca y los mejores quesos de nuestra selección.",
  },
  {
    nombre: "Ravioles de Alcachofa en Salsa Mediterránea",
    categoria: "pastas",
    precio: 37,
    descripcion: "Rellenos de alcachofa, bañados con nuestra salsa mediterránea.",
  },
  {
    nombre: "Ravioles de la Abuela",
    categoria: "pastas",
    precio: 37,
    descripcion: "Rellenos de estofado de la Nonna con aceite de oliva y finas hierbas.",
  },
  {
    nombre: "Ravioles de Lomo Saltado",
    categoria: "pastas",
    precio: 37,
    descripcion: "Ravioles crocantes rellenos con el tradicional lomo saltado.",
  },
  {
    nombre: "Ravioles de 2 Quesos",
    categoria: "pastas",
    precio: 36,
    descripcion: "Rellenos con queso de cabra y queso ricota, bañados de una deliciosa salsa pesto o al Alfredo.",
  },
  {
    nombre: "Ravioles Oxtail",
    categoria: "pastas",
    precio: 37,
    descripcion: "Rellenos de cola de buey estofada, bañados con una exquisita salsa de finas hierbas.",
  },

  /* ------------------- GRILL · AMERICANA PREMIUM ------------------ */
  {
    nombre: "Bife Angosto 400g",
    categoria: "grill-americana-premium",
    precio: 155,
    presentacion: "400g",
    incluyeGuarnicion: true,
    destacado: true,
    imagen: "/images/carta/bife-angosto.webp",
    imagenAlt: "Bife angosto LongHorn marcado a la parrilla sobre tabla de madera",
    descripcion: GUARNICION,
  },
  { nombre: "Bife Ancho 400g", categoria: "grill-americana-premium", precio: 189, presentacion: "400g", incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Entraña Fina 300g", categoria: "grill-americana-premium", precio: 189, presentacion: "300g", incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Asado de Tira con Hueso 500g", categoria: "grill-americana-premium", precio: 180, presentacion: "500g", comensales: 2, incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "New York Steak 600g", categoria: "grill-americana-premium", precio: 149, presentacion: "600g", incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Picanha 500g", categoria: "grill-americana-premium", precio: 164, presentacion: "500g", incluyeGuarnicion: true, descripcion: GUARNICION },

  /* -------------------- GRILL · CORTES SELECTOS ------------------- */
  { nombre: "Colita de Cuadril Americana 300g", categoria: "grill-cortes-selectos", precio: 74, presentacion: "300g", incluyeGuarnicion: true, descripcion: GUARNICION, imagen: "/images/carta/colita-de-cuadril.webp", imagenAlt: "Colita de cuadril a la parrilla cortada en láminas sobre tabla" },
  { nombre: "Colita de Cuadril Americana 600g", categoria: "grill-cortes-selectos", precio: 148, presentacion: "600g", comensales: 2, incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Picanha Americana 600g", categoria: "grill-cortes-selectos", precio: 154, presentacion: "600g", comensales: 2, incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Tomahawk Nacional 1200g", categoria: "grill-cortes-selectos", precio: 200, presentacion: "1200g", incluyeGuarnicion: true, destacado: true, descripcion: GUARNICION },
  {
    nombre: "Parrilla 4 Carnes",
    categoria: "grill-cortes-selectos",
    precio: 255,
    comensales: 2,
    incluyeGuarnicion: true,
    destacado: true,
    descripcion:
      "Picanha 250g + Bife de Chorizo 300g + Colita de Cuadril 250g + Lomo Fino 250g o Pechuga de Pollo 300g. " + GUARNICION,
  },

  /* ------------------- GRILL · ARGENTINA PREMIUM ------------------ */
  { nombre: "Bife Angosto 400g", categoria: "grill-argentina-premium", precio: 140, presentacion: "400g", incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Bife Ancho 400g", categoria: "grill-argentina-premium", precio: 155, presentacion: "400g", incluyeGuarnicion: true, descripcion: GUARNICION },

  /* ------------------- GRILL · NUESTROS CLÁSICOS ------------------ */
  { nombre: "Lomo Fino 250g", categoria: "grill-nuestros-clasicos", precio: 65, presentacion: "250g", incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Lomo Fino 400g", categoria: "grill-nuestros-clasicos", precio: 89, presentacion: "400g", incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Cuadril 250g", categoria: "grill-nuestros-clasicos", precio: 65, presentacion: "250g", incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Cuadril 400g", categoria: "grill-nuestros-clasicos", precio: 89, presentacion: "400g", incluyeGuarnicion: true, descripcion: GUARNICION },

  /* -------------------------- MÁS DEL GRILL ----------------------- */
  { nombre: "1/2 Pechuga de Pollo", categoria: "mas-del-grill", precio: 22, incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Pechuga de Pollo", categoria: "mas-del-grill", precio: 35, incluyeGuarnicion: true, descripcion: GUARNICION },
  {
    nombre: "Hamburguesa",
    categoria: "mas-del-grill",
    precio: 29,
    descripcion: "Americana, Criolla, A lo Pobre y LongHorn + guarnición de papas fritas.",
    variantes: ["Americana", "Criolla", "A lo Pobre", "LongHorn"],
  },
  {
    nombre: "Smash Burger",
    categoria: "mas-del-grill",
    precio: 32,
    descripcion: "Americana, A lo Pobre y LongHorn + guarnición de papas fritas.",
    variantes: ["Americana", "A lo Pobre", "LongHorn"],
  },
  { nombre: "Choriburger", categoria: "mas-del-grill", precio: 29, descripcion: "+ guarnición de papas fritas." },
  { nombre: "Lomito de Cerdo 300g", categoria: "mas-del-grill", precio: 39, presentacion: "300g", incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Lomito de Cerdo 600g", categoria: "mas-del-grill", precio: 76, presentacion: "600g", comensales: 2, incluyeGuarnicion: true, descripcion: GUARNICION },
  { nombre: "Bondiola de Cerdo 600g", categoria: "mas-del-grill", precio: 76, presentacion: "600g", comensales: 2, incluyeGuarnicion: true, descripcion: GUARNICION },
  {
    nombre: "Festival de Cerdo",
    categoria: "mas-del-grill",
    precio: 134,
    comensales: 2,
    incluyeGuarnicion: true,
    destacado: true,
    descripcion:
      "Panceta de cerdo (250g), bife de chorizo de cerdo (250g), bondiola de cerdo (300g), costillas de cerdo (300g). " + GUARNICION,
  },
  {
    nombre: "Chateaubriand Lomo Fino 600g",
    categoria: "mas-del-grill",
    precio: 139,
    presentacion: "600g",
    comensales: 2,
    incluyeGuarnicion: true,
    descripcion: GUARNICION + " Se acompaña con salsa pepper.",
  },
  {
    nombre: "Parrilla para 2 Personas",
    categoria: "mas-del-grill",
    precio: 138,
    comensales: 2,
    incluyeGuarnicion: true,
    destacado: true,
    imagen: "/images/carta/parrilla-para-2.webp",
    imagenAlt: "Parrilla LongHorn para dos personas con anticuchos, chorizos, morcillas y chuletas",
    descripcion:
      "2 anticuchos de corazón, 2 chorizos, 2 morcillas, 2 chuletas (130g c/u), 2 carnes parrilleras (125g c/u) o 2 medias pechugas de pollo (150g c/u). Incluye guarnición a escoger.",
    notaFuente:
      "La descripción de la guarnición aparece recortada en el PDF original («…papas fritas o papa al horno o camote»). Se ha resumido sin inventar el texto faltante.",
  },

  /* ------------------------- ESPECIALIDADES ----------------------- */
  {
    nombre: "Costillas LongHorn en Salsa BBQ",
    categoria: "especialidades",
    precio: 64,
    destacado: true,
    imagen: "/images/carta/costillas-longhorn-bbq.webp",
    imagenAlt: "Costillas LongHorn glaseadas en salsa BBQ",
    descripcion: "Las mejores costillas en salsa BBQ, hechas con nuestra receta insuperable.",
  },
  { nombre: "Pepper Steak", categoria: "especialidades", precio: 65, descripcion: "Nuestra tradicional salsa de pimienta que baña un lomito fino." },
  {
    nombre: "Filet Mignon",
    categoria: "especialidades",
    precio: 65,
    descripcion:
      "Inconfundible lomo fino con nuestra tradicional salsa de champiñones con vino tinto y papas fritas o papa al horno.",
  },
  {
    nombre: "Lomo a lo Pobre al Estilo LongHorn",
    categoria: "especialidades",
    precio: 65,
    descripcion:
      "Lomo fino en salsa de vino tinto, acompañado con nuestro inconfundible tacu tacu de pallares verdes con huevo y plátano frito.",
  },
  {
    nombre: "Lomo de la Casa",
    categoria: "especialidades",
    precio: 66,
    descripcion:
      "Lomo fino con queso gratinado en una humeante salsa de champiñones y papas fritas amarillas o papa al horno o ensalada.",
  },
  {
    nombre: "Apanado de Pollo",
    categoria: "especialidades",
    precio: 34,
    descripcion: "Pechuga de pollo apanado, se acompaña con papas fritas amarillas o papa al horno.",
  },
  {
    nombre: "Apanado de Lomo",
    categoria: "especialidades",
    precio: 59,
    imagen: "/images/carta/apanado-lomo-pesto.webp",
    imagenAlt: "Apanado de lomo LongHorn acompañado de fettuccine al pesto",
    descripcion: "Lomo fino apanado, se acompaña con papas fritas amarillas o papa al horno.",
  },
  {
    nombre: "Pollo Relleno de la Casa",
    categoria: "especialidades",
    precio: 39,
    descripcion:
      "Relleno de queso mozarella, espinaca y jamón, acompañado con puré de papas amarillas y nuestra salsa blue cheese.",
  },
  {
    nombre: "Chuletas de Cerdo a Nuestro Estilo",
    categoria: "especialidades",
    precio: 39,
    descripcion:
      "Deliciosas chuletas a la parrilla, bañadas con salsa de durazno y acompañadas con puré de papa de la casa.",
  },
  {
    nombre: "Estofado de la Nonna",
    categoria: "especialidades",
    precio: 49,
    descripcion:
      "La gran receta de la abuela a base de carne de res y estofado en vino tinto con champiñones, cebolla charlot y tocino, acompañados con fettuccini a la crema.",
  },
  {
    nombre: "Salmón a la Parrilla",
    categoria: "especialidades",
    precio: 65,
    bajoEnCalorias: true,
    descripcion: "Salmón fresco, preparado en nuestra parrilla, acompañado de una ensalada fresca a la limoneta.",
  },
  {
    nombre: "Dieta de Pollo",
    categoria: "especialidades",
    precio: 25,
    bajoEnCalorias: true,
    descripcion: "Sabor tradicional con cabello de ángel, zanahoria, apio, papa amarilla y pollo.",
  },

  /* ---------------------------- SALTADOS -------------------------- */
  { nombre: "Pollo Saltado", categoria: "saltados", precio: 34 },
  { nombre: "Lomo Saltado", categoria: "saltados", precio: 59, destacado: true },
  {
    nombre: "Lomo Saltado con Tacu Tacu",
    categoria: "saltados",
    precio: 59,
    descripcion: "Lomo saltado flambeado y acompañado con tacu tacu de pallares.",
  },
  { nombre: "Spaguetti Saltado Criollo de Lomo o Pollo", categoria: "saltados", precio: 41, variantes: ["Lomo", "Pollo"] },
  {
    nombre: "Saltado LongHorn con Fettuccini a la Crema",
    categoria: "saltados",
    precio: 59,
    descripcion: "La combinación perfecta: lomito saltado acompañado con fettuccini a la crema.",
  },

  /* -------------------------- CARNE Y PASTA ----------------------- */
  { nombre: "Lomo Fino con Fettuccini al Alfredo o Pesto", categoria: "carne-y-pasta", precio: 67, variantes: ["Alfredo", "Pesto"] },
  { nombre: "Lomo Fino con Spaguetti al Alfredo o Pesto", categoria: "carne-y-pasta", precio: 67, variantes: ["Alfredo", "Pesto"] },
  { nombre: "Apanado de Lomo con Spaguetti o Fettuccini al Pesto", categoria: "carne-y-pasta", precio: 61, variantes: ["Spaguetti", "Fettuccini"] },
  { nombre: "Apanado de Pollo con Fettuccini al Alfredo o Pesto", categoria: "carne-y-pasta", precio: 51, variantes: ["Alfredo", "Pesto"] },
  { nombre: "Fettuccini a la Huancaína con Lomitos Salteados", categoria: "carne-y-pasta", precio: 62 },

  /* -------------------------- GUARNICIONES ------------------------ */
  { nombre: "Papa al Horno", categoria: "guarniciones", precio: 19 },
  { nombre: "Camote Frito", categoria: "guarniciones", precio: 15 },
  { nombre: "Camote al Horno", categoria: "guarniciones", precio: 15 },
  { nombre: "Arroz de la Casa", categoria: "guarniciones", precio: 17 },
  { nombre: "Papas Amarillas Fritas", categoria: "guarniciones", precio: 19 },
  {
    nombre: "Legumbres a la Parrilla",
    categoria: "guarniciones",
    precio: 22,
    bajoEnCalorias: true,
    imagen: "/images/carta/legumbres-a-la-parrilla.webp",
    imagenAlt: "Legumbres a la parrilla LongHorn: espárragos, zuccini, berenjena y pimiento",
    descripcion: "Cebolla blanca, pimiento, espárragos, zuccini y berenjena.",
  },
  {
    nombre: "Legumbres Salteadas",
    categoria: "guarniciones",
    precio: 21,
    bajoEnCalorias: true,
    descripcion: "Brócoli, alcachofas, espárragos y zanahorias.",
  },
  { nombre: "Puré de Papas", categoria: "guarniciones", precio: 20 },
  { nombre: "Espárragos a la Parrilla", categoria: "guarniciones", precio: 21, bajoEnCalorias: true },
  { nombre: "Tacu Tacu de Pallares", categoria: "guarniciones", precio: 20 },

  /* --------------------------- MENÚ KIDS -------------------------- */
  { nombre: "6 Alitas de Pollo BBQ + Papas Fritas + Chicha", categoria: "menu-kids", precio: 36 },
  {
    nombre: "Hamburguesa + Guarnición + Chicha",
    categoria: "menu-kids",
    precio: 36,
    descripcion: "Acompañada de una guarnición a tu elección: papas fritas o camote frito o puré de papa o arroz.",
  },
  {
    nombre: "1/2 Pechuga de Pollo + Guarnición + Chicha",
    categoria: "menu-kids",
    precio: 36,
    descripcion: "Acompañada de una guarnición a tu elección: papas fritas o camote frito o puré de papa o arroz.",
  },
  { nombre: "Fettuccini al Alfredo + Chicha", categoria: "menu-kids", precio: 36 },
  { nombre: "Salchipapa + Chicha", categoria: "menu-kids", precio: 36 },
  { nombre: "Choripapa + Chicha", categoria: "menu-kids", precio: 36 },

  /* ========================================================================
   * BEBIDAS Y CÓCTELES
   * Ver docs/carta-fuentes.md (sección «Bebidas») y docs/bebidas-pendientes.md.
   * ===================================================================== */

  /* ----------------------------- VINOS POR COPA ---------------------------
   * Fuente: carta digital oficial, lámina «Vino por Copa» (40/40).
   * Vigente en 5 de los 13 locales — ver disponibleEn y NOTA_5_LOCALES. */
  {
    nombre: "Tacama Blanco de Blancos",
    categoria: "bebidas-vinos",
    precio: 20,
    presentacion: "Copa",
    descripcion: "Vino blanco peruano, por copa.",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_5_LOCALES,
  },
  {
    nombre: "Pata Negra Roble Tempranillo",
    categoria: "bebidas-vinos",
    precio: 20,
    presentacion: "Copa",
    descripcion: "Vino tinto Tempranillo español, por copa.",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_5_LOCALES,
  },
  {
    nombre: "Santa Julia Malbec",
    categoria: "bebidas-vinos",
    precio: 24,
    presentacion: "Copa",
    descripcion: "Vino tinto Malbec argentino, por copa.",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_5_LOCALES,
  },
  {
    nombre: "Casillero del Diablo Dark Red Malbec",
    categoria: "bebidas-vinos",
    precio: 26,
    presentacion: "Copa",
    descripcion: "Vino tinto Malbec chileno, por copa.",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_5_LOCALES,
  },
  {
    nombre: "Navarro Correas Malbec",
    categoria: "bebidas-vinos",
    precio: 26,
    presentacion: "Copa",
    descripcion: "Vino tinto Malbec argentino, por copa.",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_5_LOCALES,
  },
  {
    nombre: "Santa Julia Malbec Reserva",
    categoria: "bebidas-vinos",
    precio: 27,
    presentacion: "Copa",
    descripcion: "Vino tinto Malbec Reserva argentino, por copa.",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_5_LOCALES,
  },
  {
    nombre: "Felino Cabernet Sauvignon",
    categoria: "bebidas-vinos",
    precio: 32,
    presentacion: "Copa",
    descripcion: "Vino tinto Cabernet Sauvignon argentino, por copa.",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_5_LOCALES,
  },

  /* ------------------------------ PISCO SOURS ------------------------------
   * Publicados: «Festival de Sours» de la carta digital (3x S/25), sin
   * precio unitario. El resto del recetario histórico de 2018 queda oculto. */
  {
    nombre: "Pisco Sour Clásico",
    categoria: "bebidas-pisco-sours",
    descripcion: "El tradicional, con pisco quebranta.",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente:
      NOTA_FESTIVAL_SOURS +
      " También aparece en Happy Hour (2x S/29) y, con los nombres «Pisco Sour Clásico», «Tradicional» y «Catedral», en el recetario histórico de 2018.",
  },
  {
    nombre: "Sour de Aguaymanto",
    categoria: "bebidas-pisco-sours",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_FESTIVAL_SOURS,
  },
  {
    nombre: "Sour de Arándanos",
    categoria: "bebidas-pisco-sours",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_FESTIVAL_SOURS,
  },
  {
    nombre: "Coca Sour",
    categoria: "bebidas-pisco-sours",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_FESTIVAL_SOURS + " También documentado en el recetario histórico de 2018.",
  },
  {
    nombre: "Sour de Maracuyá",
    categoria: "bebidas-pisco-sours",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_FESTIVAL_SOURS,
  },
  {
    nombre: "Camu Camu Sour",
    categoria: "bebidas-pisco-sours",
    ingredientes: ["Pisco macerado de camu camu", "Jarabe de goma", "Clara de huevo"],
    estado: "oculto",
    fuenteId: "scribd-recetario-2018",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "historico",
    notaFuente: NOTA_HISTORICO,
  },
  {
    nombre: "Lima Sour",
    categoria: "bebidas-pisco-sours",
    ingredientes: ["Pisco macerado de cáscara de lima", "Jugo de lima", "Jugo de limón", "Jarabe de goma", "Clara de huevo"],
    estado: "oculto",
    fuenteId: "scribd-recetario-2018",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "historico",
    notaFuente: NOTA_HISTORICO,
  },
  {
    nombre: "Pisco Sour Catedral",
    categoria: "bebidas-pisco-sours",
    ingredientes: ["Pisco quebranta", "Jugo de limón", "Jarabe de goma", "Clara de huevo"],
    estado: "oculto",
    fuenteId: "scribd-recetario-2018",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "historico",
    notaFuente: NOTA_HISTORICO,
  },

  /* -------------------------------- CHILCANOS -------------------------------
   * Publicado: «Chilcanos» genérico de Happy Hour. Los 10 sabores que cita
   * el recetario histórico de 2018 quedan ocultos hasta confirmarlos. */
  {
    nombre: "Chilcano",
    categoria: "bebidas-chilcanos",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_HAPPY_HOUR + " La promoción no especifica sabor.",
  },
  { nombre: "Chilcano de Limón", categoria: "bebidas-chilcanos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Chilcano de Anís Estrella y Mandarina", categoria: "bebidas-chilcanos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Chilcano de Maracuyá", categoria: "bebidas-chilcanos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Chilcano de Naranja", categoria: "bebidas-chilcanos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Chilcano de Aguaymanto", categoria: "bebidas-chilcanos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Chilcano de Camu Camu", categoria: "bebidas-chilcanos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Chilcano de Coca", categoria: "bebidas-chilcanos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Chilcano de Lima", categoria: "bebidas-chilcanos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Chilcano de Finas Hierbas", categoria: "bebidas-chilcanos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Chilcano de Hierba Luisa", categoria: "bebidas-chilcanos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },

  /* --------------------------- CÓCTELES CLÁSICOS ---------------------------
   * Publicados: los que nombra Happy Hour. El resto de la lista histórica
   * de 2018 queda oculta hasta confirmarla. */
  {
    nombre: "Piña Colada",
    categoria: "bebidas-cocteles-clasicos",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_HAPPY_HOUR,
  },
  {
    nombre: "Fresa Colada",
    categoria: "bebidas-cocteles-clasicos",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente:
      NOTA_HAPPY_HOUR +
      " Nombre literal de la lámina («Fresa colada»), no confundir con un «Daiquiri de Fresa»: son preparaciones distintas y la fuente solo confirma la primera.",
  },
  {
    nombre: "Margarita",
    categoria: "bebidas-cocteles-clasicos",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_HAPPY_HOUR,
  },
  {
    nombre: "Mojito",
    categoria: "bebidas-cocteles-clasicos",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_HAPPY_HOUR,
  },
  {
    nombre: "Cóctel de Algarrobina",
    categoria: "bebidas-cocteles-clasicos",
    disponibleEn: LOCALES_CARTA_DIGITAL,
    fuenteId: "longhorn-carta-digital-bebidas",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado",
    notaFuente: NOTA_HAPPY_HOUR + " También documentado en el recetario histórico de 2018.",
  },
  { nombre: "Long Island Iced Tea", categoria: "bebidas-cocteles-clasicos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Bloody Mary", categoria: "bebidas-cocteles-clasicos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Apple Martini", categoria: "bebidas-cocteles-clasicos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Daiquiri", categoria: "bebidas-cocteles-clasicos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Miami Vice", categoria: "bebidas-cocteles-clasicos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Caipiriña", categoria: "bebidas-cocteles-clasicos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Margarita LongHorn", categoria: "bebidas-cocteles-clasicos", estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },

  /* ---------------------------------- CERVEZAS ------------------------------
   * Fuente: Rappi, delivery/recojo San Borja. Ver NOTA_DELIVERY_SAN_BORJA. */
  {
    nombre: "Pilsen Callao",
    categoria: "bebidas-cervezas",
    precio: 12,
    presentacion: "305 ml",
    disponibleEn: ["san-borja"],
    fuenteId: "rappi-san-borja",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado-parcial",
    notaFuente: NOTA_DELIVERY_SAN_BORJA,
  },
  {
    nombre: "Cusqueña Dorada",
    categoria: "bebidas-cervezas",
    precio: 12,
    presentacion: "310 ml",
    disponibleEn: ["san-borja"],
    fuenteId: "rappi-san-borja",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado-parcial",
    notaFuente: NOTA_DELIVERY_SAN_BORJA,
  },
  {
    nombre: "Corona",
    categoria: "bebidas-cervezas",
    precio: 14,
    presentacion: "355 ml",
    disponibleEn: ["san-borja"],
    fuenteId: "rappi-san-borja",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado-parcial",
    notaFuente: NOTA_DELIVERY_SAN_BORJA,
  },

  /* ------------------------------ BEBIDAS SIN ALCOHOL ------------------------
   * Fuente: Rappi, delivery/recojo San Borja. Ver NOTA_DELIVERY_SAN_BORJA. */
  {
    nombre: "Inca Kola Original",
    categoria: "bebidas-sin-alcohol",
    precio: 8,
    presentacion: "500 ml",
    disponibleEn: ["san-borja"],
    fuenteId: "rappi-san-borja",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado-parcial",
    notaFuente: NOTA_DELIVERY_SAN_BORJA,
  },
  {
    nombre: "Inca Kola Sin Azúcar",
    categoria: "bebidas-sin-alcohol",
    precio: 8,
    presentacion: "500 ml",
    disponibleEn: ["san-borja"],
    fuenteId: "rappi-san-borja",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado-parcial",
    notaFuente: NOTA_DELIVERY_SAN_BORJA,
  },
  {
    nombre: "Coca-Cola Original",
    categoria: "bebidas-sin-alcohol",
    precio: 8,
    presentacion: "500 ml",
    disponibleEn: ["san-borja"],
    fuenteId: "rappi-san-borja",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado-parcial",
    notaFuente: NOTA_DELIVERY_SAN_BORJA,
  },
  {
    nombre: "Coca-Cola Sin Azúcar",
    categoria: "bebidas-sin-alcohol",
    precio: 8,
    presentacion: "500 ml",
    disponibleEn: ["san-borja"],
    fuenteId: "rappi-san-borja",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado-parcial",
    notaFuente: NOTA_DELIVERY_SAN_BORJA,
  },
  {
    nombre: "Sprite",
    categoria: "bebidas-sin-alcohol",
    precio: 8,
    presentacion: "500 ml",
    disponibleEn: ["san-borja"],
    fuenteId: "rappi-san-borja",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado-parcial",
    notaFuente: NOTA_DELIVERY_SAN_BORJA,
  },
  {
    nombre: "San Luis Con Gas",
    categoria: "bebidas-sin-alcohol",
    precio: 8,
    presentacion: "500 ml",
    disponibleEn: ["san-borja"],
    fuenteId: "rappi-san-borja",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado-parcial",
    notaFuente: NOTA_DELIVERY_SAN_BORJA,
  },
  {
    nombre: "San Luis Sin Gas",
    categoria: "bebidas-sin-alcohol",
    precio: 8,
    presentacion: "500 ml",
    disponibleEn: ["san-borja"],
    fuenteId: "rappi-san-borja",
    verificadoEl: "2026-10-16",
    estadoVerificacion: "verificado-parcial",
    notaFuente: NOTA_DELIVERY_SAN_BORJA,
  },

  /* ------------------------------ CÓCTELES DE AUTOR --------------------------
   * Los 8 cócteles del recetario histórico de 2018. Ninguno está confirmado
   * en la carta vigente: los 8 quedan ocultos, con los ingredientes que se
   * pudieron transcribir del documento (sin cantidades: la fuente no permite
   * verificarlas con fiabilidad). Ver docs/bebidas-pendientes.md. */
  { nombre: "Inkatexas Cocktail", categoria: "bebidas-cocteles-autor", ingredientes: ["Pisco", "Moras", "Romero", "Jarabe de goma", "Soda"], estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Manantial", categoria: "bebidas-cocteles-autor", ingredientes: ["Pisco", "Infusión de manzanilla y anís", "Jugo de lima", "Ginger ale"], estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Sierra", categoria: "bebidas-cocteles-autor", ingredientes: ["Pisco", "Muña y huacatay", "Piña", "Ginger ale"], estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Pasión", categoria: "bebidas-cocteles-autor", ingredientes: ["Vodka", "Maracuyá", "Lima", "Jarabe de goma"], estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Cuzqueño", categoria: "bebidas-cocteles-autor", ingredientes: ["Pisco", "Cointreau", "Moras", "Infusión de toronjil", "Zumo de limón", "Miel de abeja", "Soda"], estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Machupicchu", categoria: "bebidas-cocteles-autor", ingredientes: ["Pisco acholado", "Jugo de naranja", "Jarabe de granadina", "Licor de menta"], estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Punch Supremo", categoria: "bebidas-cocteles-autor", ingredientes: ["Pisco quebranta", "Jugo de maracuyá", "Crema de menta", "Ginger ale"], estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
  { nombre: "Tinto del Ruedo", categoria: "bebidas-cocteles-autor", ingredientes: ["Vino", "Jugo de piña", "Jugo de naranja", "Splash de limón", "Jarabe de granadina"], estado: "oculto", fuenteId: "scribd-recetario-2018", verificadoEl: "2026-10-16", estadoVerificacion: "historico", notaFuente: NOTA_HISTORICO },
];

export const PLATOS: Plato[] = parseColeccion(
  platoSchema,
  PLATOS_RAW.map((raw) => ({
    ...raw,
    id: `${raw.categoria}--${slugify(raw.nombre)}`,
    slug: slugify(raw.nombre),
    moneda: "PEN" as const,
    incluyeGuarnicion: raw.incluyeGuarnicion ?? false,
    bajoEnCalorias: raw.bajoEnCalorias ?? false,
    destacado: raw.destacado ?? false,
    disponibleEn: raw.disponibleEn ?? [],
    fuenteId: raw.fuenteId ?? "carta-pdf",
    verificadoEl: raw.verificadoEl ?? VERIFICADO_EL,
    estado: raw.estado ?? "publicado",
  })),
  "platos",
);
