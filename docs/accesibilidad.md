# Accesibilidad

**Objetivo:** WCAG 2.2 nivel AA.
**Resultado medido:** Lighthouse Accesibilidad **100/100** en portada, carta y
locales, en móvil y escritorio.

Lighthouse no basta por sí solo, así que además hay pruebas propias y revisión
manual.

## Contraste

Se calcularon los ratios reales de la paleta sobre cada fondo que se usa.
Resultado: el marfil necesita **al menos 60 % de opacidad** para superar 4,5:1
sobre el fondo más claro del sitio (madera-600), y el ámbar oscuro `#C0803D`
**no llega** a 4,5:1 sobre maderas.

Correcciones aplicadas (42 clases de color):

- Todo texto en marfil por debajo del 60 % de opacidad se subió al 60 %.
- El ámbar oscuro se sustituyó por ámbar claro `#E0A85F` en texto pequeño.
- Los botones primarios usan `#D01424` en lugar del rojo de marca `#FC1B2B`,
  porque este último solo alcanza 3,9:1 con texto blanco.

| Combinación | Ratio | Cumple |
|---|---|---|
| Marfil 100 % / carbón | 15,8:1 | AAA |
| Marfil 60 % / carbón | 6,2:1 | AA |
| Marfil 60 % / madera-600 | 4,6:1 | AA |
| Ámbar claro / carbón | 8,9:1 | AAA |
| Blanco / rojo de acción `#D01424` | 5,5:1 | AA |
| Blanco / rojo de marca `#FC1B2B` | 3,9:1 | Solo texto grande y UI |

## Teclado

- Enlace **«Saltar al contenido principal»** como primer elemento enfocable.
- Foco visible y uniforme: contorno ámbar de 2 px con 3 px de separación,
  definido una sola vez en `:focus-visible`.
- El menú móvil es un diálogo con **foco atrapado**, cierre con `Escape` y
  devolución del foco al botón que lo abrió.
- El selector de cortes de la portada son `<button>` reales con `aria-pressed`,
  no `<div>` con `onClick`.
- La navegación de la carta son enlaces a anclas reales: funcionan con teclado y
  se pueden abrir en pestaña nueva.

## Estructura

- Un solo `<h1>` por página, verificado automáticamente.
- Jerarquía de encabezados sin saltos, verificada automáticamente. (Esta prueba
  detectó un salto real de `h1` a `h3` en `/locales`, corregido con encabezados
  para lectores de pantalla en los bloques de filtros, listado y mapa.)
- Puntos de referencia: `<header>`, `<nav>` con `aria-label`, `<main>`,
  `<footer>`.
- Listas reales (`<ul>`, `<ol>`, `<dl>`) para contenido enumerado.

## Nombres accesibles

Todo control interactivo tiene nombre, verificado automáticamente.

Detalle que la prueba sacó a la luz: en el menú móvil, la numeración decorativa
(«01», «02»…) formaba parte del nombre accesible de cada enlace, que se
anunciaba como «03 Carta». Ahora está marcada con `aria-hidden` y el enlace se
llama simplemente «Carta».

Los enlaces que abren en pestaña nueva lo avisan con texto para lectores de
pantalla.

## Imágenes

- Todas tienen `alt`, verificado automáticamente.
- Las decorativas llevan `alt=""` y `aria-hidden="true"`.
- Las informativas describen el plato, no el archivo.

## Formularios

Todo `<select>` tiene su `<label>` asociado con `for`/`id`, verificado
automáticamente. Los cambios de estado se anuncian con `aria-live="polite"`
(por ejemplo, el recuento de locales filtrados).

## Movimiento reducido

Con `prefers-reduced-motion: reduce`:

- las animaciones de entrada se desactivan y **el contenido aparece visible
  desde el primer fotograma**,
- no se carga ningún vídeo de fondo: queda el póster estático,
- el parallax y los resplandores se detienen,
- el desplazamiento suave pasa a instantáneo,
- **toda la funcionalidad sigue disponible**.

Hay una prueba que comprueba que ningún elemento con revelado quede invisible
en ese modo.

## Sin JavaScript

El contenido es visible sin JavaScript. Las animaciones de entrada solo ocultan
contenido bajo `html.js`, clase que añade un script en línea antes del primer
pintado; si ese script no se ejecuta, nada se oculta.

Hay una prueba que carga la portada y la carta con JavaScript desactivado y
comprueba que el titular, los CTA y los platos se ven.

## Táctil

- Áreas de 44 × 44 px como mínimo en móvil, verificado automáticamente. (Esta
  prueba detectó que el enlace del logotipo medía 38 px de alto; corregido.)
- Campos de formulario a 16 px mínimo, para que iOS no haga zoom al enfocarlos.
  También verificado.
- Nada depende de `hover`: toda la información accesible al pasar el ratón está
  disponible de otra forma.
- Se respetan las zonas seguras (`env(safe-area-inset-*)`) en el menú móvil, el
  botón de volver arriba y el aviso de cookies.

## Pruebas automatizadas

`tests/e2e/accesibilidad.spec.ts`, sobre 6 rutas y en dos proyectos (escritorio
y móvil):

1. Un solo `h1` y jerarquía sin saltos.
2. Toda imagen con `alt`.
3. Todo control con nombre accesible.
4. Todo campo con etiqueta.
5. Enlace de salto al contenido.
6. Navegación por teclado.
7. Contenido visible con movimiento reducido.
8. Contenido visible sin JavaScript.

## Limitaciones conocidas

- **No se ha probado con lectores de pantalla reales** (VoiceOver, NVDA, JAWS).
  Las comprobaciones son programáticas. Antes del lanzamiento conviene un repaso
  con VoiceOver en iOS, que es donde estará buena parte del tráfico.
- **No se ha probado en Safari real**: esta máquina de desarrollo (macOS 12) no
  admite los binarios de WebKit de Playwright. Ver `docs/pruebas.md`.
