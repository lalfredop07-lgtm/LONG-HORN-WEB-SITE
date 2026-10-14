import type { MetadataRoute } from "next";

import { LOCALES } from "@/data/locales";
import { SITE_URL } from "@/lib/site";

/**
 * Mapa del sitio.
 * Solo rutas públicas e indexables: no incluye páginas despublicadas ni
 * locales marcados como no publicados.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  const estaticas: { ruta: string; prioridad: number; frecuencia: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { ruta: "/", prioridad: 1, frecuencia: "weekly" },
    { ruta: "/carta", prioridad: 0.95, frecuencia: "weekly" },
    { ruta: "/locales", prioridad: 0.9, frecuencia: "monthly" },
    { ruta: "/nuestra-historia", prioridad: 0.7, frecuencia: "yearly" },
    { ruta: "/experiencias", prioridad: 0.7, frecuencia: "monthly" },
    { ruta: "/reservas", prioridad: 0.8, frecuencia: "monthly" },
    { ruta: "/contacto", prioridad: 0.6, frecuencia: "yearly" },
    { ruta: "/preguntas-frecuentes", prioridad: 0.6, frecuencia: "monthly" },
    { ruta: "/libro-de-reclamaciones", prioridad: 0.4, frecuencia: "yearly" },
    { ruta: "/privacidad", prioridad: 0.3, frecuencia: "yearly" },
    { ruta: "/terminos-y-condiciones", prioridad: 0.3, frecuencia: "yearly" },
    { ruta: "/cookies", prioridad: 0.3, frecuencia: "yearly" },
  ];

  return [
    ...estaticas.map((p) => ({
      url: `${SITE_URL}${p.ruta}`,
      lastModified: ahora,
      changeFrequency: p.frecuencia,
      priority: p.prioridad,
    })),
    ...LOCALES.filter((l) => l.publicado).map((local) => ({
      url: `${SITE_URL}/locales/${local.slug}`,
      lastModified: new Date(local.verificadoEl),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
