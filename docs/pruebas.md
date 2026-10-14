# Pruebas

## Comandos

```bash
npm run lint          # ESLint (next/core-web-vitals + next/typescript)
npm run typecheck     # tsc --noEmit
npm run test          # Vitest — capa de datos
npm run test:e2e      # Playwright — escritorio y móvil
npm run build         # Build de producción
npm run verify        # lint + typecheck + test + build
node scripts/capturas.mjs   # QA visual: 90 capturas + auditoría de desbordes
```

## Resultados

| Suite | Resultado |
|---|---|
| ESLint | **0 errores, 0 avisos** |
| TypeScript (`strict`) | **0 errores** |
| Vitest (datos) | **16/16** |
| Playwright escritorio | **41/41** |
| Playwright móvil | **38/38** |
| Build | **31 rutas estáticas** |
| QA visual | **90 capturas, 0 desbordes** |

## Qué se prueba

### Datos (Vitest, 16)

Las 103 referencias están presentes · ninguna se pierde al agrupar ·
identificadores únicos · toda categoría pertenece a un grupo · todo plato tiene
precio, fuente y fecha · bebidas no publica platos inventados · formato de
precios · aviso legal literal · 13 locales · slugs únicos · solo 12 con
coordenadas y todas dentro de Perú · ningún horario inventado · «Cómo llegar»
siempre válido · teléfonos en E.164 · reservas siempre al sistema oficial ·
experiencias solo verificadas.

### Navegación (Playwright)

Portada con titular y CTA · títulos y descripciones únicos por página ·
canonical absoluto · enlaces legales en el pie · 404 real en español · menú
móvil que abre, navega y cierra con `Escape`.

### Carta

Las 103 referencias se renderizan · formato de precios en soles · precios
concretos correctos (Tomahawk S/ 200, Parrilla 4 Carnes S/ 255, Piqueo LongHorn
S/ 49, Ensalada César S/ 31, Choripapa S/ 36) · las 9 secciones con sus anclas ·
la navegación por categorías funciona · **bebidas no publica platos ni precios**
· aviso legal presente · el selector de local cambia el destino de la reserva.

### Locales

Los 13 listados · filtro por ciudad · el directorio funciona sin mapa ·
«Cómo llegar» siempre apunta a Google Maps · las 13 fichas responden 200 con sus
datos reales · JSON-LD `Restaurant` válido **y sin `aggregateRating` ni
`review`** · un local sin horario lo dice en vez de inventarlo · un local sin
reserva online ofrece alternativa.

### Accesibilidad

Ver `docs/accesibilidad.md`.

### Responsive

Sin desbordes en 13 anchos (320 → 2560) × 5 rutas · áreas táctiles de 44 px ·
campos de 16 px · la navegación cambia correctamente entre móvil y escritorio.

### SEO

Sitemap con todas las rutas y sin despublicadas · robots coherente con el
entorno · `Organization` y `WebSite` · `Menu` con 103 platos en PEN · Open Graph
completo · `lang="es-PE"` · todos los enlaces internos resuelven · cabeceras de
seguridad presentes.

## QA visual

`scripts/capturas.mjs` recorre **10 rutas × 9 viewports = 90 capturas** de
página completa y, en cada una, audita el DOM en busca de desbordes
horizontales y de elementos fuera del viewport. No es revisión «a ojo»: el
informe queda en `capturas/informe.json`.

Viewports: 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920.

Las capturas se toman con **movimiento reducido activado**, lo que las hace
deterministas y de paso verifica que esa variante del sitio esté completa.
También se fuerza la carga de imágenes diferidas antes de disparar, para que una
imagen `lazy` no salga en blanco y haga pensar en un fallo inexistente.

## Problemas reales que encontraron estas pruebas

No son pruebas decorativas. Esto es lo que detectaron:

| Prueba | Hallazgo |
|---|---|
| Unitaria de teléfonos | El prefijo `0` de larga distancia no se quitaba: `01 4213916` daba `+51014213916` |
| Jerarquía de encabezados | Salto de `h1` a `h3` en `/locales` |
| Áreas táctiles | El enlace del logotipo medía 38 px de alto |
| Nombre accesible | Los enlaces del menú móvil se anunciaban como «03 Carta» |
| Auditoría de desbordes | `whitespace-nowrap` en los botones desbordaba `/experiencias` a 320 px |
| Consola del navegador | Error de hidratación en todas las páginas por el script que marca `html.js` |
| Lighthouse | 42 clases de color por debajo del contraste AA |

## Limitaciones conocidas

**No se ha probado en Safari ni en WebKit.** Esta máquina de desarrollo corre
macOS 12 y Playwright ya no publica binarios compatibles:

```
Error: Playwright does not support chromium on mac12
```

La solución adoptada fue usar el **Chrome instalado en el sistema**
(`channel: "chrome"`, versión 150). Por eso el proyecto móvil emula un
**Galaxy S24** y no un iPhone: los perfiles de iPhone arrancan WebKit.

Consecuencias:

- El comportamiento se ha verificado en **Chromium**, no en Safari.
- La emulación móvil es fiel en viewport, DPR y eventos táctiles, pero **no
  reproduce el motor de Safari**.

Antes del lanzamiento conviene una pasada manual en iPhone real, prestando
atención a: reproducción del vídeo del hero (`playsInline`), zonas seguras en el
notch, scroll con rebote en el carrusel de la carta, y el menú móvil con el
teclado abierto.

En CI (Linux) basta con quitar `channel: "chrome"` de `playwright.config.ts`
para usar los navegadores propios de Playwright, incluido WebKit.
