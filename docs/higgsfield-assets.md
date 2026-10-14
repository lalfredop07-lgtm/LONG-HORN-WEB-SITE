# Recursos audiovisuales generados con Higgsfield

## Resumen

Se generaron **3 recursos** con la API de Higgsfield
(`api.higgsfield.ai`, cuenta de desarrollador con saldo en USD).

| # | Recurso | Endpoint | Parámetros | Resultado |
|---|---|---|---|---|
| 1 | Vídeo del hero | `kling-video/v2.5-turbo/pro/text-to-video` | 5 s, cfg 0.5 | 1920×1080, 24 fps, 10,3 MB |
| 2 | Bucle de brasas | `minimax/hailuo-2.3/standard/text-to-video` | 6 s | 721 KB |
| 3 | Cóctel de barra | `higgsfield-ai/soul/standard` | 3:4, 1080p | 1536×2048 |

Hubo además **una llamada rechazada** por validación (parámetros
`aspect_ratio: "4:5"` y `resolution: "2K"`, que la especificación OpenAPI
publicada declaraba pero la API real no acepta). Al ser un error 422, **no se
creó ningún trabajo y no se consumió saldo**.

## Coste

La API de Higgsfield **no expone un endpoint de precios ni de saldo**, así que
no es posible informar del importe exacto consumido desde aquí. A las tarifas
habituales de estos modelos (≈ 0,35 USD por clip de Kling 2.5 Turbo Pro,
≈ 0,30 USD por clip de Hailuo 2.3 Standard y unos céntimos por imagen de Soul),
el consumo estimado está en torno a **1 USD**, muy por debajo de los 10 USD
autorizados.

**El saldo real debe consultarse en `console.higgsfield.ai`.**

## Prompts utilizados

### 1. Vídeo del hero

```
Cinematic commercial food cinematography: an extreme close-up of a thick,
well-marbled ribeye steak searing on a cast-iron grill over glowing orange
charcoal embers. Real orange flames lick up around the edges of the meat, thin
wisps of smoke drift slowly upward. The crust is dark and caramelized with
visible grill marks and glistening rendered fat catching warm firelight. Very
slow, steady cinematic push-in. Shallow depth of field, anamorphic look, warm
amber key light against a dark background, rich browns and deep blacks.
Photoreal, high-end steakhouse advertising, 35mm film grain, no text, no
people, no hands.
```

Negativo: `text, watermark, logo, letters, captions, people, hands, cartoon,
cgi, plastic look, oversaturated, blurry, distorted meat, raw bloody meat, low
quality`.

### 2. Brasas

```
Extreme macro close-up of glowing orange charcoal embers in a dark grill,
pulsing softly with heat, thin wisps of pale smoke drifting slowly upward
through the frame. Deep black background, intense amber and red glow, tiny
sparks occasionally rising. Very slow subtle movement, no camera motion,
abstract and atmospheric, photoreal, cinematic macro cinematography, shallow
depth of field. No text, no people, no food.
```

### 3. Cóctel

```
Professional steakhouse bar photography: a classic old-fashioned cocktail in a
heavy cut-crystal rocks glass with a large clear ice cube and an orange peel
twist, on a dark polished walnut bar top. Warm amber tungsten lighting from
behind, soft bokeh of a dimly lit restaurant bar with bottles out of focus,
deep browns and blacks with golden highlights. Moody, premium, cinematic,
shallow depth of field, photoreal advertising photography. No text, no logos,
no people.
```

## Optimización

Los originales están en `assets-generados/` (fuera del despliegue). Los
derivados que sirve la web se generan con `scripts/optimizar-video.py`:

```bash
python3 scripts/optimizar-video.py assets-generados/hero-parrilla-original.mp4 hero-parrilla
python3 scripts/optimizar-video.py assets-generados/brasas-original.mp4 brasas
```

| Archivo servido | Dimensiones | Peso |
|---|---|---|
| `hero-parrilla.mp4` | 1600 × 900 | 1 117 KB |
| `hero-parrilla-movil.mp4` | 720 × 405 | 205 KB |
| `hero-parrilla-poster.webp` | 1600 × 900 | 80 KB |
| `brasas.mp4` | 1600 × 900 | 833 KB |
| `brasas-movil.mp4` | 720 × 405 | 150 KB |
| `brasas-poster.webp` | 1600 × 900 | 58 KB |
| `coctel-longhorn.webp` | 1316 × 1754 | 95 KB |

El hero pasó de **10,3 MB a 1,1 MB** (205 KB en móvil) sin pérdida perceptible
a pantalla completa bajo un degradado.

### Cómo se cargan

El póster es el **fotograma 0 del propio vídeo**, no una imagen distinta. Eso
permite que el relevo entre imagen y vídeo sea invisible y que no haga falta un
fundido largo (un fundido largo retrasaría el LCP).

Secuencia en la portada:

1. El póster se descarga con `priority` y `fetchPriority="high"`. Es el elemento
   que mide el LCP y no compite con nada.
2. Cuando el póster termina de cargar (`onLoad`), se monta el vídeo.
3. El vídeo arranca en su fotograma 0 —idéntico al póster— y entra con un
   fundido de 200 ms.

Además: `muted`, `loop`, `playsInline`, pausa automática al salir de pantalla
(IntersectionObserver), y **no se carga** si la persona ha pedido reducir
movimiento o si el navegador declara ahorro de datos o una conexión lenta.

## Uso responsable

Esto es importante y se respetó estrictamente:

- Los recursos generados muestran **comida y ambientes conceptuales**: un corte
  en la parrilla, brasas, un cóctel en una barra. Son escenas genéricas de
  categoría, no de un local concreto.
- **Ninguna imagen generada se presenta como fotografía de una sucursal real.**
- **No hay fachadas ni interiores de locales generados por IA.** Por eso las
  tarjetas de local son composiciones tipográficas de marca y no «fotos» de
  restaurantes que no existen.
- **El logotipo nunca se envió a un modelo generativo**, para que no pudiera
  redibujarlo mal. Todo uso del logotipo parte del PNG original del cliente.
- Las **fotografías de los platos de la carta son reales**: se extrajeron del
  PDF oficial de LongHorn.

## Reproducir una generación

```bash
node scripts/higgsfield/generar.mjs <endpoint> '<json-de-entrada>' <archivo-destino>
```

Las credenciales se leen de `~/.config/higgsfield/credentials.env`, **fuera del
repositorio**. Nunca se escriben aquí ni se imprimen en consola.

> Cada ejecución consume saldo real. La especificación OpenAPI publicada no
> siempre coincide con la API en producción (ver el rechazo documentado arriba):
> conviene confirmar los valores admitidos en `console.higgsfield.ai` antes de
> lanzar un lote.
