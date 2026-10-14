# Arquitectura técnica

## Stack

| Pieza | Versión | Por qué |
|---|---|---|
| Next.js | 16.4.1 | App Router, generación estática, optimización de imagen |
| React | 19.3.1 | Requisito de Next 16 |
| TypeScript | 5.9.3 | `strict` + `noUncheckedIndexedAccess` |
| Tailwind CSS | 4.3.3 | Tokens en CSS, sin archivo de configuración JS |
| Zod | 4.6.7 | Validación de la capa de datos en tiempo de build |
| GSAP | 3.15.0 | Disponible para animación avanzada (ver nota) |
| @googlemaps/js-api-loader | 2.1.3 | Carga del mapa bajo demanda |
| Playwright | 1.64.1 | Pruebas end-to-end |
| Vitest | 3.2.4 | Pruebas unitarias de la capa de datos |

Las versiones están **fijadas sin rango** (`"next": "16.4.1"`, no `"^16.4.1"`)
y hay `package-lock.json`, de modo que la build es reproducible.

### Nota sobre GSAP

El briefing pedía GSAP + ScrollTrigger. Está instalado y disponible, pero el
sistema de revelado al hacer scroll acabó resolviéndose con
`IntersectionObserver` + transiciones CSS, que para este caso concreto:

- pesa **0 KB** de JavaScript adicional frente a ~70 KB de GSAP + ScrollTrigger,
- no bloquea el hilo principal (las transiciones las resuelve el compositor),
- y permite que el contenido sea visible sin JavaScript.

Dado que el briefing también exigía no instalar librerías sin función y cuidar
los Core Web Vitals, se optó por la solución nativa. GSAP queda disponible para
cuando se añada una animación que realmente lo requiera (líneas de tiempo
encadenadas, *pinning*, morphing). Si se decide no usarlo, basta con
desinstalarlo: ningún componente lo importa hoy.

---

## Estructura

```
app/                        Rutas (App Router)
  layout.tsx                Shell, fuentes, JSON-LD global, analítica
  page.tsx                  Portada
  carta/                    Carta completa
  locales/                  Directorio + [slug] por sede
  nuestra-historia/
  experiencias/
  reservas/
  contacto/
  preguntas-frecuentes/
  privacidad/ cookies/ terminos-y-condiciones/ libro-de-reclamaciones/
  not-found.tsx             404
  sitemap.ts  robots.ts     SEO generado
  icon.png  apple-icon.png  Iconos derivados del logotipo

components/
  layout/      Header, MenuMovil, Footer, CabeceraPagina, DocumentoLegal
  sections/    Secciones de la portada
  menu/        PlatoCarta, NavegacionCarta, SelectorLocal
  locations/   DirectorioLocales, MapaLocales, MapaNoDisponible, TarjetaLocal
  forms/       SelectorReserva
  motion/      Revelar
  analytics/   Analitica, RegistroEventos
  ui/          Boton, Logo, Seccion, Resaltado, AvisoCookies, VolverArriba

data/          Capa de contenido (ver abajo)
lib/           schemas, carta, locales, seo, site, analitica, hooks
styles/        globals.css — tokens y utilidades
scripts/       Generación de assets y QA visual
tests/         unit (Vitest) + e2e (Playwright)
docs/          Esta documentación
assets-fuente/ Originales del cliente (logo, referencia, carta PDF)
assets-generados/ Originales sin comprimir de Higgsfield
```

---

## Capa de datos

Todo el contenido vive en `data/` como TypeScript tipado y **validado con Zod
en el momento de la importación**. Si alguien introduce un plato sin precio o un
local sin fuente, la build falla con un mensaje que señala el registro exacto:

```
[locales] registro #4 inválido → coordenadas.lat: Number must be <= 90
```

| Archivo | Contenido |
|---|---|
| `data/fuentes.ts` | Registro central de fuentes con URL, fecha y nivel de confianza |
| `data/carta.ts` | 103 platos, categorías y grupos |
| `data/locales.ts` | 13 locales + los descartados, con su motivo |
| `data/experiencias.ts` | Experiencias del catálogo oficial |
| `data/marca.ts` | Datos de marca, contacto, redes, razones sociales |
| `data/navegacion.ts` | Menús |
| `data/faq.ts` | Preguntas frecuentes |
| `data/categorias-portada.ts` | Las cinco puertas a la carta de la portada |

### Trazabilidad

Cada dato operativo lleva `fuenteId`, `verificadoEl` y, donde aplica,
`estadoVerificacion`:

```ts
estadoVerificacion: "verificado" | "verificado-parcial" |
                    "pendiente-confirmar" | "desactualizado" | "no-disponible"
```

Esto no es decorativo: la interfaz **cambia** según el estado. Un local sin
coordenadas verificadas no sale en el mapa; un local sin horario muestra un
enlace a Google Maps en vez de una tabla inventada.

---

## Renderizado

Las 31 rutas son **estáticas** (`○ Static` / `● SSG`). No hay renderizado en
servidor por petición, lo que significa:

- HTML completo para los rastreadores sin ejecutar JavaScript,
- respuesta desde CDN,
- y un coste de hosting mínimo.

Las partes interactivas (cabecera, mapa, selectores, carrusel) son componentes
cliente aislados; el contenido que importa para SEO se renderiza en el servidor.

### Mejora progresiva

El contenido **nunca** depende de JavaScript para ser visible. Las animaciones
de entrada ocultan contenido solo bajo `html.js`, clase que añade un script en
línea antes del primer pintado. Sin JavaScript, la página se ve completa.

Hay una prueba automatizada que lo verifica
(`tests/e2e/accesibilidad.spec.ts` → «sin JavaScript el contenido principal
sigue siendo visible»).

---

## Variables de entorno

Todas son `NEXT_PUBLIC_*` y, por tanto, **se incrustan en tiempo de build**.
Cambiarlas exige volver a desplegar. Ver `.env.example` y `docs/despliegue.md`.

| Variable | Obligatoria | Efecto si falta |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sí en producción | Canonicals y sitemap apuntan a `localhost` |
| `NEXT_PUBLIC_INDEXABLE` | Sí en producción | `robots.txt` bloquea todo el rastreo |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | El mapa se sustituye por un aviso; el directorio sigue completo |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | No | Se usan estilos declarados en código |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | No se carga analítica ni aviso de cookies |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Sin meta de verificación |

El valor por defecto de `NEXT_PUBLIC_INDEXABLE` es `false`: un despliegue mal
configurado **no se indexa**, en lugar de indexarse por error.
