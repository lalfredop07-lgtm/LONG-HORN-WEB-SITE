import { z } from "zod";

/* ------------------------------------------------------------------ *
 * Utilidades
 * ------------------------------------------------------------------ */

/** Convierte un nombre en un slug estable y legible para URLs y anclas. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/½/g, "media")
    .replace(/1\/2/g, "media")
    .replace(/&/g, "y")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ------------------------------------------------------------------ *
 * Trazabilidad de datos
 *
 * Toda información operativa (precio, dirección, teléfono, horario)
 * lleva fuente y estado de verificación. Nada se publica sin origen.
 * ------------------------------------------------------------------ */

export const estadoVerificacionSchema = z.enum([
  "verificado",
  "verificado-parcial",
  "pendiente-confirmar",
  "desactualizado",
  "no-disponible",
]);
export type EstadoVerificacion = z.infer<typeof estadoVerificacionSchema>;

export const fuenteSchema = z.object({
  nombre: z.string().min(1),
  url: z.string().url().optional(),
  consultadoEl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fechaDocumento: z.string().optional(),
  confianza: z.enum(["alta", "media", "baja"]),
  notas: z.string().optional(),
});
export type Fuente = z.infer<typeof fuenteSchema>;

/* ------------------------------------------------------------------ *
 * Carta
 * ------------------------------------------------------------------ */

export const categoriaIdSchema = z.enum([
  "piqueos",
  "ensaladas",
  "pastas",
  "grill-americana-premium",
  "grill-cortes-selectos",
  "grill-argentina-premium",
  "grill-nuestros-clasicos",
  "mas-del-grill",
  "especialidades",
  "saltados",
  "carne-y-pasta",
  "guarniciones",
  "menu-kids",
  "bebidas",
]);
export type CategoriaId = z.infer<typeof categoriaIdSchema>;

export const grupoIdSchema = z.enum([
  "piqueos",
  "ensaladas",
  "pastas",
  "grill",
  "mas-del-grill",
  "especialidades",
  "guarniciones",
  "menu-kids",
  "bebidas",
]);
export type GrupoId = z.infer<typeof grupoIdSchema>;

export const categoriaSchema = z.object({
  id: categoriaIdSchema,
  grupo: grupoIdSchema,
  nombre: z.string().min(1),
  /** Subtítulo que aparece dentro del grupo (p. ej. "Americana Premium"). */
  subtitulo: z.string().optional(),
  descripcion: z.string().optional(),
  orden: z.number().int().nonnegative(),
});
export type Categoria = z.infer<typeof categoriaSchema>;

export const grupoSchema = z.object({
  id: grupoIdSchema,
  nombre: z.string().min(1),
  /** Texto corto para la navegación por pestañas. */
  nombreCorto: z.string().min(1),
  descripcion: z.string().optional(),
  orden: z.number().int().nonnegative(),
  /** Cuando no hay datos publicables todavía (p. ej. carta de bebidas). */
  sinCartaPublicada: z.boolean().default(false),
  notaSinCarta: z.string().optional(),
});
export type Grupo = z.infer<typeof grupoSchema>;

export const platoSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  nombre: z.string().min(1),
  categoria: categoriaIdSchema,
  descripcion: z.string().optional(),
  /** Precio en soles. Ausente = sin precio verificado publicable. */
  precio: z.number().positive().optional(),
  moneda: z.literal("PEN").default("PEN"),
  /** Gramaje o formato tal y como aparece en la carta ("400g", "4 unidades"). */
  presentacion: z.string().optional(),
  /** Número de comensales cuando la carta lo indica explícitamente. */
  comensales: z.number().int().positive().optional(),
  variantes: z.array(z.string()).optional(),
  /** El plato incluye guarnición a escoger. */
  incluyeGuarnicion: z.boolean().default(false),
  bajoEnCalorias: z.boolean().default(false),
  destacado: z.boolean().default(false),
  imagen: z.string().optional(),
  imagenAlt: z.string().optional(),
  /** Slugs de locales. Vacío = disponible en toda la red. */
  disponibleEn: z.array(z.string()).default([]),
  fuenteId: z.string().min(1),
  verificadoEl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  estado: z.enum(["publicado", "oculto"]).default("publicado"),
  /** Texto literal recortado en el documento original, si aplica. */
  notaFuente: z.string().optional(),
});
export type Plato = z.infer<typeof platoSchema>;

/* ------------------------------------------------------------------ *
 * Locales
 * ------------------------------------------------------------------ */

export const coordenadasSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type Coordenadas = z.infer<typeof coordenadasSchema>;

export const diaSemanaSchema = z.enum([
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
]);

export const tramoHorarioSchema = z.object({
  dias: z.array(diaSemanaSchema).min(1),
  abre: z.string().regex(/^\d{2}:\d{2}$/),
  cierra: z.string().regex(/^\d{2}:\d{2}$/),
});
export type TramoHorario = z.infer<typeof tramoHorarioSchema>;

export const localSchema = z.object({
  slug: z.string().min(1),
  nombre: z.string().min(1),
  nombreCorto: z.string().min(1),
  ciudad: z.string().min(1),
  distrito: z.string().min(1),
  departamento: z.string().min(1),
  /** Centro comercial o referencia del emplazamiento, si aplica. */
  centroComercial: z.string().optional(),
  direccion: z.string().min(1),
  codigoPostal: z.string().optional(),
  telefonos: z.array(z.string()).default([]),
  coordenadas: coordenadasSchema.nullable(),
  /** Horario semanal. null = no verificado, la UI lo indica explícitamente. */
  horarios: z.array(tramoHorarioSchema).nullable(),
  /** Deep link al sistema oficial de reservas (mesa 24/7). */
  urlReservas: z.string().url().nullable(),
  urlPedidos: z.string().url().nullable(),
  urlLibroReclamaciones: z.string().url().nullable(),
  /** Razón social que opera el local (según Libro de Reclamaciones oficial). */
  razonSocial: z.string().optional(),
  rangoPrecio: z.string().optional(),
  imagen: z.string().optional(),
  imagenAlt: z.string().optional(),
  servicios: z.array(z.string()).default([]),
  estadoVerificacion: estadoVerificacionSchema,
  fuenteIds: z.array(z.string()).min(1),
  verificadoEl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Se publica en el directorio y el sitemap. */
  publicado: z.boolean().default(true),
  notas: z.string().optional(),
});
export type Local = z.infer<typeof localSchema>;

/* ------------------------------------------------------------------ *
 * Experiencias
 * ------------------------------------------------------------------ */

export const experienciaSchema = z.object({
  slug: z.string().min(1),
  nombre: z.string().min(1),
  descripcion: z.string().min(1),
  precio: z.number().positive().nullable(),
  moneda: z.literal("PEN").default("PEN"),
  /** Slugs de locales donde la experiencia está disponible. */
  localesDisponibles: z.array(z.string()),
  url: z.string().url().nullable(),
  imagen: z.string().optional(),
  imagenAlt: z.string().optional(),
  fuenteId: z.string().min(1),
  verificadoEl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  estadoVerificacion: estadoVerificacionSchema,
});
export type Experiencia = z.infer<typeof experienciaSchema>;

/* ------------------------------------------------------------------ *
 * Helpers de validación
 * ------------------------------------------------------------------ */

/**
 * Valida una colección y falla de forma ruidosa en build/desarrollo con un
 * mensaje que identifica el registro problemático.
 */
export function parseColeccion<T extends z.ZodTypeAny>(
  schema: T,
  registros: unknown[],
  etiqueta: string,
): z.infer<T>[] {
  return registros.map((registro, i) => {
    const resultado = schema.safeParse(registro);
    if (!resultado.success) {
      const detalle = resultado.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`[${etiqueta}] registro #${i} inválido → ${detalle}`);
    }
    return resultado.data;
  });
}
