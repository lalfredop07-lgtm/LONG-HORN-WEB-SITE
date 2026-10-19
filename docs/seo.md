# SEO técnico

## Resultados medidos

Lighthouse, categoría SEO, sobre build de producción indexable:

| Página | Móvil | Escritorio |
|---|---|---|
| Portada | **100** | **100** |
| Carta | **100** | **100** |
| Locales | **100** | **100** |

## Indexabilidad

Las 31 rutas se generan **estáticamente**. El HTML que recibe un rastreador ya
contiene los 103 platos con sus precios, los 13 locales con sus direcciones y
todos los textos: no hace falta ejecutar JavaScript para leer el contenido.

Hay una prueba que lo comprueba desactivando JavaScript por completo.

## Metadatos

Cada ruta define su `title`, `description` y `canonical` absoluto mediante
`construirMetadata()` (`lib/seo.ts`). Una prueba verifica que **ningún título se
repita** entre páginas.

| Ruta | Title |
|---|---|
| `/` | LongHorn Perú \| Carnes, Parrillas y Restaurantes |
| `/carta` | Carta LongHorn Perú \| Cortes, Parrillas y Especialidades |
| `/locales` | Restaurantes LongHorn en Perú \| Encuentra tu Local |
| `/locales/[slug]` | LongHorn {Local} \| Dirección, Carta y Reservas |
| `/nuestra-historia` | Nuestra historia \| Más que una parrilla |
| `/experiencias` | Experiencias gastronómicas LongHorn |
| `/reservas` | Reservar mesa en LongHorn Perú |
| `/contacto` | Contacto \| LongHorn Perú |
| `/preguntas-frecuentes` | Preguntas frecuentes \| LongHorn Perú |

El `template` del layout añade « | LongHorn Grill & Drinks» a las páginas
interiores; la portada y las que ya llevan marca definen su título completo.

Open Graph y Twitter Card completos en todas, con imagen social de 1200 × 630
generada por `scripts/build-og.py` a partir del póster del hero y el logotipo
oficial.

## Datos estructurados (JSON-LD)

| Tipo | Dónde | Contenido |
|---|---|---|
| `Organization` | Todas | Nombre, logo, fundación, redes |
| `WebSite` | Todas | URL, idioma, editor |
| `Menu` | `/carta` | 9 secciones, 103 `MenuItem` con `Offer` en PEN |
| `Restaurant` | `/locales/[slug]` | Dirección, geo, teléfono, menú, `ReserveAction` |
| `ItemList` | `/locales` | Los 13 locales |
| `BreadcrumbList` | Todas las interiores | Migas |
| `FAQPage` | `/preguntas-frecuentes` | 11 preguntas reales |

**No se emite `aggregateRating` ni `review`.** LongHorn no publica valoraciones
propias y fabricarlas sería, además de deshonesto, motivo de sanción manual por
parte de Google. Hay una prueba automatizada que falla si alguien las añade.

En `Restaurant` solo se emiten campos con dato verificado: si un local no tiene
teléfono, no se inventa la propiedad; si no tiene coordenadas, no se emite
`geo`; si no admite reserva online, se declara `acceptsReservations: "False"`
en lugar de enlazar a un flujo que no existe.

`openingHoursSpecification` **no se emite** porque no hay horarios verificados.
Es el campo que más conviene añadir en cuanto el cliente los facilite.

## Sitemap

`/sitemap.xml` se genera en `app/sitemap.ts` a partir de los datos reales:
12 rutas estáticas + una por local publicado. Un local con `publicado: false`
desaparece del sitemap automáticamente.

Prioridades: portada 1.0, carta 0.95, locales 0.9, fichas de local 0.85,
reservas 0.8, resto por debajo.

## Robots

`/robots.txt` depende de `NEXT_PUBLIC_INDEXABLE`:

| Entorno | robots.txt | Meta robots |
|---|---|---|
| Producción (`true`) | `Allow: /` + `Sitemap:` + `Host:` | `index, follow` |
| Preview / local (por defecto) | `Disallow: /` | `noindex, nofollow` |

El valor por defecto es el seguro: **si alguien despliega sin configurar la
variable, el sitio no se indexa**, en lugar de indexarse por accidente. Así las
previews de Vercel no compiten con producción.

No se bloquea ningún recurso necesario para renderizar (JS, CSS, imágenes).

## Canonicals y duplicados

- `trailingSlash: false`: una sola forma de cada URL.
- Canonical absoluto y autorreferente en cada página.
- Redirecciones 301 para las rutas que alguien podría escribir o que podrían
  venir de un sitio anterior:

| Desde | Hacia |
|---|---|
| `/menu`, `/carta-digital` | `/carta` |
| `/restaurantes`, `/sedes` | `/locales` |
| `/reservar` | `/reservas` |
| `/historia` | `/nuestra-historia` |

## SEO de imágenes

- Nombres de archivo descriptivos (`bife-angosto.webp`, no `img_01.webp`).
- `alt` en todas; las decorativas llevan `alt=""` + `aria-hidden`, que es lo
  correcto, y una prueba comprueba que ninguna carezca de atributo.
- AVIF y WebP automáticos vía `next/image`, con `srcset` por densidad.
- `priority` solo en el póster del hero; el resto, carga diferida.
- Dimensiones siempre declaradas → **CLS de 0**.

## Idioma y moneda

`lang="es-PE"`, `og:locale = es_PE`, precios en soles (PEN) con el formato de la
carta impresa. No se ha generado versión en inglés: hacerlo sin una estrategia
aprobada crearía contenido duplicado y páginas sin mantenimiento.

## Search Console — pendiente

No hay acceso a la propiedad, así que **no se ha verificado nada**. Pasos:

1. Dar de alta la propiedad de dominio `longhornperu.com` en
   [Search Console](https://search.google.com/search-console).
2. Verificar por **registro DNS TXT** (recomendado: cubre todos los
   subdominios) o, si se prefiere la meta etiqueta, poner el token en
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` y redesplegar.
3. Enviar `https://longhornperu.com/sitemap.xml`.
4. Inspeccionar la portada, `/carta` y dos fichas de local.
5. Validar los datos estructurados en el
   [Test de resultados enriquecidos](https://search.google.com/test/rich-results).
6. Vigilar Cobertura y Core Web Vitals las primeras semanas.

> El SEO técnico está implementado y medido. El **posicionamiento** depende
> además de factores externos (autoridad, competencia, reseñas, tiempo) y no se
> promete ninguna posición concreta.
