import type { Metadata } from "next";

import { MARCA } from "@/data/marca";
import { ES_INDEXABLE, SITE_URL, urlAbsoluta } from "@/lib/site";

const OG_POR_DEFECTO = "/og/longhorn-og.jpg";

type MetaParams = {
  titulo: string;
  descripcion: string;
  ruta: string;
  imagen?: string;
  imagenAlt?: string;
  tipo?: "website" | "article";
  noIndex?: boolean;
};

/**
 * Construye los metadatos de una página.
 *
 * `title` llega ya compuesto desde cada página para evitar títulos
 * repetidos; el `template` del layout añade la marca cuando procede.
 */
export function construirMetadata({
  titulo,
  descripcion,
  ruta,
  imagen = OG_POR_DEFECTO,
  imagenAlt,
  tipo = "website",
  noIndex = false,
}: MetaParams): Metadata {
  const url = urlAbsoluta(ruta);
  const indexable = ES_INDEXABLE && !noIndex;

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      type: tipo,
      url,
      title: titulo,
      description: descripcion,
      siteName: MARCA.nombreCompleto,
      locale: "es_PE",
      images: [
        {
          url: urlAbsoluta(imagen),
          width: 1200,
          height: 630,
          alt: imagenAlt ?? `${MARCA.nombreCompleto} — ${titulo}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [urlAbsoluta(imagen)],
    },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
      : { index: false, follow: false },
  };
}

/* ------------------------------------------------------------------ *
 * Datos estructurados (JSON-LD)
 * Solo se emiten datos verificados. Sin valoraciones ni reseñas.
 * ------------------------------------------------------------------ */

export function jsonLdOrganizacion() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organizacion`,
    name: MARCA.nombreCompleto,
    alternateName: MARCA.nombre,
    url: SITE_URL,
    logo: urlAbsoluta("/brand/longhorn-logo.png"),
    description: MARCA.descripcionOficial,
    foundingDate: String(MARCA.anioFundacion),
    areaServed: { "@type": "Country", name: "Perú" },
    sameAs: MARCA.redes.map((r) => r.url),
  };
}

export function jsonLdWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: MARCA.nombreCompleto,
    inLanguage: "es-PE",
    publisher: { "@id": `${SITE_URL}/#organizacion` },
  };
}

export function jsonLdMigas(items: { nombre: string; ruta: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nombre,
      item: urlAbsoluta(item.ruta),
    })),
  };
}
