# Seguridad

## Cabeceras

Definidas en `next.config.ts` y aplicadas a todas las rutas. Verificadas por una
prueba automatizada.

| Cabecera | Valor |
|---|---|
| `Content-Security-Policy` | Ver abajo |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), payment=(), interest-cohort=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |

## Content Security Policy

```
default-src 'self'
script-src  'self' 'unsafe-inline' https://www.googletagmanager.com
style-src   'self' 'unsafe-inline' https://fonts.googleapis.com
img-src     'self' data: blob: https://tile.openstreetmap.org https://*.tile.openstreetmap.org
            https://server.arcgisonline.com https://*.arcgisonline.com https://www.google-analytics.com
font-src    'self' data: https://fonts.gstatic.com
connect-src 'self' https://tile.openstreetmap.org https://server.arcgisonline.com https://www.google-analytics.com
            https://*.analytics.google.com https://*.googletagmanager.com
frame-src   'self' https://www.google.com https://longhorn.mesa247.pe
object-src  'none'
base-uri    'self'
form-action 'self' https://longhorn.mesa247.pe
frame-ancestors 'none'
upgrade-insecure-requests
```

Solo se abre lo que el sitio usa de verdad: las teselas del mapa
(OpenStreetMap y Esri) y, si se configura, Google Analytics. Las fuentes se auto-alojan con `next/font`, así que no hay
peticiones a Google Fonts en tiempo de ejecución.

### Sobre `'unsafe-inline'` en `script-src`

Es la única concesión, y es deliberada. La alternativa correcta —CSP con
*nonce*— obliga en Next.js a renderizar **todas** las rutas de forma dinámica,
porque el nonce cambia en cada petición. Eso significaría perder la generación
estática de las 31 rutas y, con ella, el caché de CDN y los tiempos actuales.

Para un sitio de marketing sin autenticación, sin formularios propios y sin
datos de usuario, el riesgo de XSS es muy bajo: **no hay ninguna entrada de
usuario que se renderice**. Todo el contenido procede de archivos TypeScript
revisados en el repositorio.

Es también la única deducción que queda en Lighthouse «Best Practices» (96/100).

**Vía de migración**, si en el futuro se añade contenido dinámico:

1. Crear `middleware.ts` que genere un nonce por petición.
2. Pasarlo a la CSP y a los `<script>` de Next.
3. Sustituir `'unsafe-inline'` por `'nonce-{valor}' 'strict-dynamic'`.
4. Asumir el coste: las rutas pasan a renderizarse bajo demanda.

### En desarrollo

`'unsafe-eval'` se añade **solo** cuando `NODE_ENV === "development"`, porque
React lo necesita para el refresco en caliente. La build de producción nunca lo
lleva.

## Secretos

- **No hay secretos en el repositorio.** Todas las variables son
  `NEXT_PUBLIC_*`, es decir, públicas por definición.
- `.gitignore` excluye `.env`, `.env*.local` y `.env.production`.
- `.env.example` documenta cada variable sin valores reales.
- Las credenciales de Higgsfield viven en `~/.config/higgsfield/credentials.env`
  (fuera del proyecto) y nunca se imprimen.

### Sin claves de mapa

El mapa de locales no usa ninguna clave de API: las teselas de OpenStreetMap
y Esri son de acceso público. No hay nada que restringir ni que vigilar en
una consola de facturación.

## Superficie de ataque

Deliberadamente mínima:

- **Sin backend propio.** 31 rutas estáticas.
- **Sin base de datos.**
- **Sin autenticación ni sesiones.**
- **Sin formularios propios** que acepten entrada de usuario.
- **Sin subida de archivos.**
- **Sin cookies propias.** Solo `localStorage` para dos preferencias.
- **Sin orígenes remotos de imagen**: `remotePatterns: []` impide usar el
  optimizador de Next como proxy de imágenes de terceros.

## Enlaces externos

Todos los `target="_blank"` llevan `rel="noopener noreferrer"`.

## Dependencias

9 dependencias de producción, todas con función justificada y versión fijada.
`package-lock.json` versionado para builds reproducibles.

Mantenimiento recomendado:

```bash
npm audit            # revisar vulnerabilidades
npm outdated         # ver versiones nuevas
```

Conviene activar Dependabot o Renovate en el repositorio.

## Qué revisar antes de publicar

- [ ] `NEXT_PUBLIC_INDEXABLE=true` **solo** en producción
- [ ] HTTPS forzado (automático en Vercel)
- [ ] Variables de entorno marcadas como «Sensitive» donde corresponda
- [ ] `npm audit` sin vulnerabilidades altas o críticas
