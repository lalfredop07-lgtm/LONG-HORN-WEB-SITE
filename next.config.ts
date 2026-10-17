import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Solo se abre lo que el sitio usa de verdad: Google Maps (mapa de locales)
 * y, si se configura, Google Analytics 4. Las fuentes se auto-alojan con
 * next/font, así que no hay peticiones a Google Fonts en runtime.
 *
 * Nota: se usa 'unsafe-inline' en script-src porque el sitio es estático y
 * un CSP con nonce obligaría a renderizado dinámico en todas las rutas,
 * perjudicando el caché y los Core Web Vitals. La vía de migración a nonce
 * está documentada en docs/seguridad.md.
 */
const esDesarrollo = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  // 'unsafe-eval' SOLO en desarrollo: React lo necesita para el refresco en
  // caliente y las trazas de error. La build de producción nunca lo lleva.
  `script-src 'self' 'unsafe-inline'${esDesarrollo ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Teselas del mapa de locales: OpenStreetMap (vista «Mapa») y Esri
  // (vista «Satélite»). Ambas gratuitas y sin clave; ver docs/integraciones.md.
  "img-src 'self' data: blob: https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://server.arcgisonline.com https://*.arcgisonline.com https://www.google-analytics.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://tile.openstreetmap.org https://server.arcgisonline.com https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src 'self' https://www.google.com https://longhorn.mesa247.pe",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://longhorn.mesa247.pe",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), payment=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Una sola forma canónica de cada URL (sin barra final).
  trailingSlash: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [96, 160, 240, 320, 420, 560],
    // Todo el material gráfico es local: no se permiten orígenes remotos.
    remotePatterns: [],
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/brand/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  async redirects() {
    return [
      // Rutas que un visitante o un enlace antiguo podría intentar.
      { source: "/menu", destination: "/carta", permanent: true },
      { source: "/carta-digital", destination: "/carta", permanent: true },
      { source: "/restaurantes", destination: "/locales", permanent: true },
      { source: "/sedes", destination: "/locales", permanent: true },
      { source: "/reservar", destination: "/reservas", permanent: true },
      { source: "/historia", destination: "/nuestra-historia", permanent: true },
    ];
  },
};

export default nextConfig;
