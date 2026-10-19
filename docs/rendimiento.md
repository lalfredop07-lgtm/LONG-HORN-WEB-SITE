# Rendimiento

## Resultados Lighthouse

Build de producción, servidor local, Lighthouse 12.

| Página | Dispositivo | Performance | Accesibilidad | Best Practices | SEO |
|---|---|---|---|---|---|
| Portada | Móvil | **90** | **100** | 96 | **100** |
| Portada | Escritorio | **99** | **100** | 96 | **100** |
| Carta | Móvil | **93** | **100** | 96 | **100** |
| Carta | Escritorio | **99** | **100** | 96 | **100** |
| Locales | Móvil | **95** | **100** | 96 | **100** |
| Locales | Escritorio | **100** | **100** | 96 | **100** |

Objetivos del briefing: escritorio 90+/95+/95+/95+ y móvil aspirando a 90+.
**Todos alcanzados.** La única deducción de Best Practices es el
`'unsafe-inline'` de la CSP, explicado en `docs/seguridad.md`.

## Core Web Vitals

| Métrica | Umbral | Escritorio | Móvil (lab) | Móvil (medido real) |
|---|---|---|---|---|
| LCP | ≤ 2,5 s | **0,7–1,0 s** | 3,0–3,3 s | **≈ 1,0 s** |
| CLS | ≤ 0,1 | **0,001** | **0** | **0** |
| TBT / INP | ≤ 200 ms | **0–20 ms** | **40–160 ms** | — |

### Sobre la diferencia en el LCP móvil

Merece una explicación honesta, porque las dos cifras son reales y miden cosas
distintas.

El **LCP de laboratorio** de Lighthouse en móvil (3,0–3,3 s) no es una medición:
es el resultado de aplicar un **modelo de simulación** sobre una traza tomada sin
limitar. Lighthouse simula una conexión lenta y una CPU cuatro veces más lenta, y
estima cuándo habría ocurrido cada evento.

Al medir el **mismo build en un navegador real** con limitación efectiva
equivalente (4G a 1,6 Mbps, 150 ms de latencia y CPU ×4), vía
`PerformanceObserver`, el resultado fue:

```
=== CANDIDATOS LCP ===
   880 ms  <P>    antetítulo
  1012 ms  <IMG>  póster del hero     ← LCP final

=== PETICIÓN DEL PÓSTER ===
  187 → 982 ms    31 KB
```

**LCP real: ~1,0 s.** La imagen pesa 31 KB y se descarga en menos de 0,8 s.

Las dos cifras se dan tal cual. El árbitro definitivo son los **datos de campo
(CrUX)** en Search Console, una vez el sitio reciba tráfico real.

## Peso de la portada en móvil

| Tipo | Peso |
|---|---|
| Vídeo del hero (móvil) | 205 KB |
| Imágenes (AVIF/WebP) | ~270 KB |
| Fuentes (WOFF2) | ~102 KB |
| HTML + CSS + JS | ~190 KB |
| **Total** | **≈ 770 KB** |

## Qué se hizo, y qué midió cada cosa

### Vídeo

- Original de Higgsfield: 10,3 MB → servido: **1,1 MB** (escritorio) y
  **205 KB** (móvil). H.264, `faststart`, sin pista de audio, keyframe por
  segundo para que el bucle no dé tirones.
- **El póster es el fotograma 0 del propio vídeo.** Por eso el relevo entre
  imagen y vídeo es invisible y no hace falta un fundido largo (que retrasaría
  el LCP del vídeo).
- Se eliminó el atributo `poster` del `<video>`: duplicaba la descarga del
  póster (80 KB extra) porque el `<Image>` de debajo ya mostraba ese fotograma.
- El vídeo se monta **después** de que el póster haya cargado (`onLoad`), de
  modo que no compiten por el ancho de banda.
- No se carga con movimiento reducido, ahorro de datos o conexión lenta.
- Se pausa al salir de pantalla.

### Un callejón sin salida, documentado

Se probó a **diferir el vídeo hasta `requestIdleCallback`**. Resultado: el vídeo
pasó a ser **él mismo el elemento LCP** (al pintarse tarde y ocupar toda la
pantalla) y el LCP empeoró de 4,0 s a 4,5 s. Se descartó.

La solución correcta resultó ser la contraria: que el vídeo se pinte **pronto y
sin fundido largo**, apoyado en un póster idéntico.

### Imágenes

- AVIF y WebP automáticos, `srcset` por densidad.
- `priority` **solo** en el póster del hero. El logotipo de la cabecera pasó a
  `loading="eager"` sin precarga: su `<link rel="preload">` se adelantaba al de
  la imagen que mide el LCP.
- Dimensiones siempre declaradas → **CLS 0**.
- Las fotos de la carta se sirven a ~1 750 px de lado largo, en WebP calidad 84.

### Fuentes

- Auto-alojadas con `next/font` (sin peticiones a Google en runtime).
- De Bodoni Moda se cargó **solo el peso 400 en redonda**: la cursiva y los
  pesos 500/600 sumaban ~45 KB que nunca se pintaban.
- `display: swap` + `adjustFontFallback` para que el intercambio no mueva el
  layout.

> Se probó también a **quitar la precarga** de la fuente de titulares. Empeoró
> el FCP (0,9 → 1,1 s) y provocaba un cambio de tipografía visible en el titular
> principal, a cambio de una mejora de LCP dentro del margen de ruido. Se
> revirtió.

### JavaScript

- 31 rutas estáticas: sin trabajo de servidor por petición.
- El mapa se carga con `next/dynamic` + `ssr: false`: su JavaScript no llega a
  ninguna otra página.
- El revelado al hacer scroll usa `IntersectionObserver` y transiciones CSS en
  lugar de GSAP: **0 KB** adicionales frente a unos 70 KB.
- La analítica solo se descarga tras aceptar cookies.
- Los hooks de navegador usan `useSyncExternalStore`, que evita renders en
  cascada.

### Animación

Solo `opacity` y `transform`, que resuelve el compositor. Ninguna animación
provoca recálculo de layout: de ahí el CLS de 0.

## Cómo volver a medir

```bash
npm run build && npm run start -- -p 3100
npx lighthouse http://localhost:3100/ --preset=desktop --view
npx lighthouse http://localhost:3100/ --view     # móvil
```

Tras el despliegue, medir contra la URL real: la latencia de red y el CDN
cambian bastante el resultado respecto a `localhost`.
