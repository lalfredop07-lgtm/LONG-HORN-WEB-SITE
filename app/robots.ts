import type { MetadataRoute } from "next";

import { ES_INDEXABLE, SITE_URL } from "@/lib/site";

/**
 * robots.txt
 *
 * En entornos que no son producción (`NEXT_PUBLIC_INDEXABLE` != "true")
 * se bloquea todo el rastreo, para que las previews de Vercel nunca se
 * indexen. En producción se permite el rastreo completo.
 */
export default function robots(): MetadataRoute.Robots {
  if (!ES_INDEXABLE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nada que ocultar: no se bloquean recursos necesarios para
        // renderizar (JS, CSS, imágenes).
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
