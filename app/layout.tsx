import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Familjen_Grotesk } from "next/font/google";

import "@/styles/globals.css";

import { Analitica } from "@/components/analytics/Analitica";
import { AvisoCookies } from "@/components/ui/AvisoCookies";
import { RegistroEventos } from "@/components/analytics/RegistroEventos";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MARCA } from "@/data/marca";
import { jsonLdOrganizacion, jsonLdWebSite } from "@/lib/seo";
import { ES_INDEXABLE, GOOGLE_SITE_VERIFICATION, SITE_URL } from "@/lib/site";

/**
 * Tipografía editorial: Bodoni Moda aporta el contraste y la elegancia
 * de una carta impresa. Solo se usa en tamaños grandes, donde sus finos
 * se leen bien.
 */
const display = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--fuente-display",
  // Solo el peso y el estilo que usa el diseño: la cursiva y los pesos
  // intermedios añadían ~45 KB de fuente que nunca se pintaban.
  weight: ["400"],
  style: ["normal"],
  // Se mantiene la precarga: quitarla empeoraba el FCP (0,9 s → 1,1 s) y
  // provocaba un cambio de tipografía visible en el titular principal, a
  // cambio de una mejora de LCP dentro del margen de ruido.
  adjustFontFallback: true,
});

/**
 * Tipografía funcional. Pasó por Inter (demasiado genérica, de interfaz)
 * y por Plus Jakarta Sans (más editorial, pero aún una grotesca bastante
 * vista). Familjen Grotesk tiene rasgos propios —la «g» de caja baja, las
 * curvas de la «a»— que la hacen reconocible sin perder legibilidad en
 * párrafos largos ni en móvil.
 */
const sans = Familjen_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--fuente-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LongHorn Perú | Carnes, Parrillas y Restaurantes",
    template: `%s | ${MARCA.nombreCompleto}`,
  },
  description: MARCA.descripcionOficial,
  applicationName: MARCA.nombreCompleto,
  authors: [{ name: MARCA.nombreCompleto }],
  creator: MARCA.nombreCompleto,
  publisher: MARCA.nombreCompleto,
  formatDetection: { telephone: true, address: false, email: false },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  robots: ES_INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#15110f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning` solo en <html>: el script de arriba añade la
    // clase `js` antes de la hidratación, así que el atributo `class` del
    // servidor y el del cliente difieren a propósito.
    <html
      lang="es-PE"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Marca que el JavaScript está disponible ANTES del primer pintado.
          Las animaciones de entrada solo ocultan contenido bajo `html.js`:
          sin JS, la página se ve completa. Sin flash de contenido oculto.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a href="#contenido" className="solo-lectores saltar-contenido">
          Saltar al contenido principal
        </a>

        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <AvisoCookies />
        <Analitica />
        <RegistroEventos />

        <script
          type="application/ld+json"
          // Datos estructurados estáticos y verificados; no hay entrada de usuario.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([jsonLdOrganizacion(), jsonLdWebSite()]),
          }}
        />
      </body>
    </html>
  );
}
