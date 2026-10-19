# LongHorn Perú — sitio web

Sitio web oficial de **LongHorn Grill & Drinks Perú**: portada cinematográfica, carta completa con filtros por categoría, directorio de locales con mapa interactivo, sistema de reservas (redirección al sistema oficial de mesa 24/7), experiencias gastronómicas, historia de la marca y páginas legales.

## 1. Descripción del proyecto

Aplicación Next.js (App Router) en TypeScript, con Tailwind CSS 4 para los estilos y un sistema de datos propio (en `data/`) validado con Zod, de donde sale toda la información real del negocio: carta, precios, locales, experiencias y textos de marca. No hay backend ni base de datos: todo el contenido es estático y se recompila cuando se edita alguno de esos archivos.

## 2. Tecnologías utilizadas

| Pieza | Para qué |
|---|---|
| **Next.js 16** (App Router, Turbopack) | Framework, enrutado, generación estática |
| **React 19** | UI |
| **TypeScript 5** | Tipado de datos y componentes |
| **Tailwind CSS 4** | Estilos (tokens de diseño en `styles/globals.css`) |
| **Zod** | Valida en build que los datos de `data/` tengan la forma correcta |
| **Leaflet + react-leaflet** | Mapa interactivo de locales (sin clave de API, ver §12) |
| **Vitest** | Pruebas unitarias (`tests/unit/`) |
| **Playwright** | Pruebas end-to-end (`tests/e2e/`), en dos perfiles: escritorio y móvil |

## 3. Requisitos de Node.js

Node **20.9 o superior** (ver `"engines"` en `package.json`). Se recomienda usar la misma versión mayor que usa Vercel por defecto para proyectos Next.js recientes (Node 20 LTS).

## 4. Instalación de dependencias

```bash
npm ci
```

`npm ci` (no `npm install`) instala exactamente las versiones fijadas en `package-lock.json`, igual que lo hace Vercel en cada despliegue.

## 5. Ejecución en desarrollo

```bash
npm run dev
```

Levanta el sitio en `http://localhost:3000` con recarga en caliente.

## 6. Compilación de producción

```bash
npm run build   # compila
npm run start   # sirve la build de producción en localhost:3000
```

Antes de dar por buena una build, conviene correr la verificación completa:

```bash
npm run verify   # lint + typecheck + tests unitarios + build, en ese orden
```

Pruebas end-to-end (abren un navegador real, tardan unos minutos):

```bash
npx playwright test
```

## 7. Estructura de carpetas

```
app/                  Rutas (App Router). Cada carpeta = una página o segmento de URL.
  locales/[slug]/     Ficha de cada local, generada a partir de data/locales.ts
components/
  layout/             Header, menú móvil, footer, cabeceras de página
  sections/           Bloques grandes de la portada (hero, carta, cortes, locales…)
  menu/                Carta: pestañas por categoría, tarjeta de plato
  locations/           Mapa Leaflet, tarjetas y fichas de local
  forms/               Selector de reserva
  motion/              Revelado por scroll (Revelar.tsx)
  ui/                   Botones, logo, resaltados — piezas reutilizables
data/                  TODA la información real del negocio (ver §8-§13)
lib/                    Helpers: lectura de datos (carta.ts, locales.ts), SEO (seo.ts),
                        esquemas de validación Zod (schemas.ts), hooks de navegador
docs/                   Notas internas sobre integraciones, fuentes de la carta, etc.
                        (no se usan en la web, son documentación del propio proyecto)
public/
  images/carta/         Fotografías de platos y categorías (WebP)
  images/marca/         Fotos de ambiente/marca
  videos/                Vídeo de portada (y copia de respaldo del anterior)
  brand/                 Logotipo e isotipo (cuernos) en PNG/SVG/WebP
scripts/                Scripts de apoyo (capturas de pantalla, generación de assets)
styles/globals.css      Tokens de diseño (colores, tipografías, espaciados) y utilidades
tests/unit/              Vitest — valida que los datos de data/ sean consistentes
tests/e2e/                Playwright — prueba la web real en navegador
```

## 8. Cómo actualizar los platos y precios

Todo vive en **`data/carta.ts`**:

- `GRUPOS_RAW` — las pestañas de `/carta` (Piqueos, Cortes, Parrillas…). El campo `orden` controla en qué posición aparece cada una.
- `CATEGORIAS_RAW` — subdivisiones dentro de un grupo (p. ej. dentro de «Grill LongHorn»: Americana Premium, Cortes Selectos…).
- Más abajo en el mismo archivo, el array de **platos**: cada uno con `nombre`, `descripcion`, `precio` (en soles, numérico), `categoria` y `estado` (`"publicado"` para que aparezca en la web).

Para cambiar un precio o texto, edita el campo correspondiente y guarda — no hace falta tocar ningún componente. `npm run test` valida automáticamente que no queden referencias rotas (categoría inexistente, etc.).

**No se inventan platos ni precios**: todo lo que aparece en la carta tiene que figurar en la carta oficial del cliente (ver `docs/carta-fuentes.md`).

## 9. Cómo sustituir fotografías

1. Convierte la foto nueva a **WebP** (calidad ~84 es un buen equilibrio; ver `scripts/` para ejemplos de conversión con Python/Pillow).
2. Colócala en `public/images/carta/` (platos y categorías) o `public/images/marca/` (ambiente), con un nombre descriptivo en minúsculas y guiones.
3. Si vas a **reemplazar** una foto que ya se usa en algún sitio, dale un **nombre de archivo distinto** al anterior (no sobrescribas el mismo nombre): los navegadores cachean imágenes de forma agresiva por URL/nombre y un visitante que ya vio la página puede seguir viendo la foto vieja aunque recargue.
4. Actualiza la referencia en el componente o en `data/categorias-portada.ts` / `data/experiencias.ts` según corresponda.
5. Si la foto no se recorta bien por defecto, se le puede añadir `object-position` (ver el campo opcional `encuadre` en `data/categorias-portada.ts`, o la prop `className` del `<Image>` en el componente).

## 10. Cómo actualizar el vídeo de portada

El hero (`components/sections/HeroCinematico.tsx`) usa tres archivos en `public/videos/`:

- `hero-portada-fuego-poster.webp` — imagen fija que se ve primero (y siempre, si el navegador no reproduce vídeo o el usuario pidió reducir movimiento).
- `hero-portada-fuego.mp4` — vídeo para escritorio/tablet.
- `hero-portada-fuego-movil.mp4` — versión más ligera para móvil (se sirve solo por debajo de 640px de ancho).

**Importante**: al sustituir el vídeo, usa nombres de archivo **nuevos** (p. ej. añadiendo `-v2`) y actualiza las tres constantes al principio de `HeroCinematico.tsx` (`POSTER`, `VIDEO_ESCRITORIO`, `VIDEO_MOVIL`). Igual que con las fotos: si se mantiene el mismo nombre, los visitantes que ya cargaron la página antes pueden seguir viendo el vídeo anterior desde su caché.

El póster debería ser, idealmente, el fotograma 0 del vídeo nuevo, para que el cambio entre imagen fija y vídeo no se note.

## 11. Cómo modificar información de los locales

Todo en **`data/locales.ts`**: nombre, dirección, distrito, ciudad, teléfonos, coordenadas (`lat`/`lng`), enlace de reservas (`urlReservas`), enlace de pedidos, servicios disponibles y el campo `publicado` (en `false` oculta el local de la web sin borrarlo del archivo).

Cada local publicado genera automáticamente su propia página en `/locales/<slug>` — no hay que crear nada a mano en `app/`.

## 12. Cómo actualizar los marcadores del mapa

El mapa (`components/locations/MapaLeaflet.tsx`) usa **Leaflet + OpenStreetMap, sin ninguna clave de API** (no hace falta configurar nada en variables de entorno para que el mapa funcione). Lee las coordenadas directamente de `data/locales.ts`, así que para mover un marcador basta con corregir `lat`/`lng` de ese local.

El símbolo de los marcadores (los cuernos de LongHorn) está vectorizado en `lib/cuernos-path.ts`, generado a partir del logo oficial del cliente con `scripts/build-cuernos.py`. Si cambia el archivo de marca, se puede volver a generar ejecutando ese script — no hay que tocar el SVG a mano.

Más detalle técnico (proveedores de teselas, por qué Leaflet y no Google Maps, limitaciones conocidas) en `docs/integraciones.md`.

## 13. Cómo modificar los enlaces de reservas

- Enlace general de reservas y pedidos: `data/marca.ts` (`MARCA.enlaces`).
- Enlace de reserva **por local** (cuando existe uno específico): campo `urlReservas` en `data/locales.ts`. Si un local no tiene reserva online, su ficha ofrece WhatsApp como alternativa automáticamente — no hay que inventar un enlace que no existe.

La web **no implementa un sistema de reservas propio**: siempre redirige al sistema oficial de mesa 24/7 del cliente. No se muestra ninguna confirmación falsa de reserva dentro de la web.

## 14. Variables de entorno necesarias

Copia `.env.example` a `.env.local` y complétalo:

| Variable | Obligatoria | Para qué |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sí | URL pública del sitio (canonicals, sitemap, robots, Open Graph) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4. Vacía = no se carga ningún script de analítica ni aviso de cookies |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Meta tag de verificación de Google Search Console |
| `NEXT_PUBLIC_INDEXABLE` | Sí | `"true"` en producción, `"false"` en entornos de prueba (evita que Google indexe una preview sin aprobar) |

El mapa **no necesita ninguna variable**: funciona sin clave de API (ver §12).

## 15. Proceso para publicar en Vercel

1. En el panel de Vercel, el proyecto debe tener conectado el repositorio `lalfredop07-lgtm/LONG-HORN-WEB-SITE`, rama de producción `main`.
2. Framework: Vercel detecta Next.js automáticamente (no requiere configuración manual de build command ni output directory).
3. En **Settings → Environment Variables**, configura las variables de §14 (como mínimo `NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_INDEXABLE`).
4. Cada `git push` a `main` dispara un despliegue nuevo automáticamente. También se puede forzar un redeploy manual desde la pestaña **Deployments** del proyecto.
5. Revisa los **logs del build** en esa misma pestaña si algo falla — ahí aparece exactamente qué archivo o import causó el error.

## 16. Proceso para actualizar GitHub

```bash
git add -A
git status              # revisa qué se va a subir antes de confirmar
git commit -m "Describe aquí el cambio"
git push origin main
```

El repositorio ya tiene configurado `.gitignore` para excluir automáticamente `node_modules`, `.next`, archivos `.env*.local`, cachés de pruebas y el material fuente sin procesar (fotos/vídeos originales en `NUEVAS FOTOS/`, `RECURSOS/`, etc. — la web usa las versiones ya optimizadas que están en `public/`). No hace falta excluir nada a mano.

## 17. Scripts de apoyo

No forman parte de la web en ejecución — son herramientas para el desarrollo:

| Script | Para qué |
|---|---|
| `node scripts/capturas.mjs` | Capturas de pantalla de todas las páginas en 9 anchos distintos + auditoría de desbordamiento horizontal |
| `python3 scripts/build-cuernos.py` | Regenera el SVG/path de los cuernos a partir del logo oficial (§12) |
| `python3 scripts/build-brand-assets.py` | Genera derivados del logotipo (tamaños, formatos) |
| `python3 scripts/build-food-photos.py` | Extrae fotos de platos desde el PDF oficial de la carta |
| `python3 scripts/build-og.py` | Genera la imagen para compartir en redes sociales (Open Graph) |
| `python3 scripts/build-fondo-locales.py` | Genera la imagen de fondo desenfocada usada en varias cabeceras |
| `python3 scripts/optimizar-video.py <origen.mp4> <nombre>` | Comprime y prepara un vídeo nuevo para `public/videos/` |

---

**Nota de seguridad:** este repositorio y el ZIP de entrega no contienen ninguna clave de API, token ni contraseña. Las credenciales de servicios de terceros (si se usan) viven únicamente en las variables de entorno configuradas directamente en el panel de Vercel, nunca en el código fuente.
