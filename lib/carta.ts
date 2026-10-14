import { CATEGORIAS, GRUPOS, PLATOS } from "@/data/carta";
import type { Categoria, CategoriaId, Grupo, GrupoId, Plato } from "@/lib/schemas";

export type GrupoConPlatos = Grupo & {
  categorias: (Categoria & { platos: Plato[] })[];
  totalPlatos: number;
};

const publicados = () => PLATOS.filter((p) => p.estado === "publicado");

/** Carta completa agrupada y ordenada, lista para renderizar. */
export function cartaAgrupada(): GrupoConPlatos[] {
  return GRUPOS.map((grupo) => {
    const categorias = CATEGORIAS.filter((c) => c.grupo === grupo.id).map((categoria) => ({
      ...categoria,
      platos: publicados().filter((p) => p.categoria === categoria.id),
    }));
    return {
      ...grupo,
      categorias,
      totalPlatos: categorias.reduce((n, c) => n + c.platos.length, 0),
    };
  });
}

export function platosDeCategoria(id: CategoriaId): Plato[] {
  return publicados().filter((p) => p.categoria === id);
}

export function grupoPorId(id: GrupoId): Grupo | undefined {
  return GRUPOS.find((g) => g.id === id);
}

export function platosDestacados(limite?: number): Plato[] {
  const destacados = publicados().filter((p) => p.destacado);
  return typeof limite === "number" ? destacados.slice(0, limite) : destacados;
}

/** Platos de cortes con fotografía, para la sección «El arte de la parrilla». */
export function cortesDestacados(): Plato[] {
  const ids: CategoriaId[] = [
    "grill-americana-premium",
    "grill-cortes-selectos",
    "grill-argentina-premium",
    "grill-nuestros-clasicos",
  ];
  return publicados().filter((p) => ids.includes(p.categoria));
}

export function totalPlatosPublicados(): number {
  return publicados().length;
}

/** Formatea un precio en soles con el estilo usado en la carta impresa. */
export function formatearPrecio(precio: number | undefined): string | null {
  if (typeof precio !== "number") return null;
  return `S/ ${precio.toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/** Rango de precios de una lista de platos, para datos estructurados. */
export function rangoPrecios(platos: Plato[] = publicados()): { min: number; max: number } | null {
  const precios = platos.map((p) => p.precio).filter((p): p is number => typeof p === "number");
  if (precios.length === 0) return null;
  return { min: Math.min(...precios), max: Math.max(...precios) };
}
