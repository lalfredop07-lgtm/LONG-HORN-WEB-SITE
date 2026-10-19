# Despliegue

## Estado

**El sitio no está desplegado.** No hay acceso a una cuenta de Vercel ni de
GitHub de LongHorn, así que no se ha creado ningún proyecto ni se ha publicado
ninguna URL. El proyecto está **listo para desplegar**: build de producción
verificada y repositorio limpio.

No se afirma que exista ninguna URL en funcionamiento, porque no la hay.

## Comprobaciones ya hechas

| Comprobación | Estado |
|---|---|
| `npm run lint` | Sin errores |
| `npm run typecheck` | Sin errores |
| `npm run test` | 16/16 |
| `npm run test:e2e` | 79/79 |
| `npm run build` | 31 rutas estáticas |
| Build con variables de producción | Correcto |
| `robots.txt` según entorno | Verificado en ambos modos |
| Canonicals con dominio real | Verificado |
| Sitemap con dominio real | Verificado |
| Cabeceras de seguridad | Verificadas |

## Paso a paso

### 1. Repositorio

```bash
git init
git add .
git commit -m "LongHorn Perú — sitio web"
git branch -M main
git remote add origin git@github.com:ORGANIZACION/longhorn-peru.git
git push -u origin main
```

`.gitignore` ya excluye `node_modules`, `.next`, `.env*`, `capturas/`,
`test-results/` y `playwright-report/`.

> **Antes del primer push**, decidir qué hacer con `assets-generados/`
> (≈ 11 MB de originales de vídeo). Son las copias maestras sin comprimir. Si no
> se quieren en Git, añadirlos a `.gitignore` y guardarlos en el Drive del
> cliente. Los archivos que sirve la web viven en `public/` y sí deben ir.

### 2. Proyecto en Vercel

1. *Add New → Project* e importar el repositorio.
2. Framework: **Next.js** (se detecta solo).
3. Build Command, Output y Install: los valores por defecto.
4. Node.js: **20.x o superior**.

### 3. Variables de entorno

En *Settings → Environment Variables*. **Son variables de build**: cambiarlas
exige volver a desplegar.

**Production:**

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://longhornperu.com` |
| `NEXT_PUBLIC_INDEXABLE` | `true` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | *(la clave restringida)* |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | *(si se activa analítica)* |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | *(si se verifica por meta)* |

**Preview y Development:**

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | la URL de preview |
| `NEXT_PUBLIC_INDEXABLE` | `false` |

> ⚠️ `NEXT_PUBLIC_INDEXABLE` debe valer `true` **solo** en Production. Si se
> pone en Preview, las previews competirían con el sitio real en Google.

### 4. Dominio

1. *Settings → Domains* → añadir `longhornperu.com` y `www.longhornperu.com`.
2. Elegir una como canónica (recomendado: sin `www`) y redirigir la otra.
3. Configurar DNS según indique Vercel:
   - A → `76.76.21.21` para el apex, o
   - CNAME → `cname.vercel-dns.com` para `www`.
4. El certificado TLS y la renovación son automáticos.

> El cambio de DNS afecta al correo si está en el mismo dominio. **Conservar los
> registros MX existentes.**

### 5. Validar la preview antes de producción

```bash
URL_PRUEBAS=https://<preview>.vercel.app npm run test:e2e
node scripts/capturas.mjs --url https://<preview>.vercel.app
npx lighthouse https://<preview>.vercel.app --view
```

Lista de comprobación manual:

- [ ] El vídeo del hero arranca y hace bucle
- [ ] La carta muestra las 103 referencias con sus precios
- [ ] El mapa carga (si hay clave) y los marcadores coinciden
- [ ] «Cómo llegar» abre el punto correcto
- [ ] «Reservar mesa» llega al sistema oficial del local elegido
- [ ] Menú móvil en un teléfono real
- [ ] `robots.txt` bloquea la preview
- [ ] Compartir un enlace en WhatsApp muestra la imagen OG

### 6. Producción

Un *merge* a `main` despliega. Después:

```bash
curl -s https://longhornperu.com/robots.txt        # debe permitir
curl -s https://longhornperu.com/sitemap.xml | head
curl -sI https://longhornperu.com | grep -i content-security-policy
```

Y entonces sí, Search Console (ver `docs/seo.md`).

## Si se despliega en otro sitio

Nada ata el proyecto a Vercel: es una app Next.js estándar.

- **Netlify / Cloudflare Pages**: funcionan con el adaptador de Next.
- **Contenedor propio**: `npm run build && npm run start`, Node 20+.
- **Export estático**: casi viable (todo es estático), pero se perdería el
  optimizador de imágenes de `next/image`. Habría que pregenerar los tamaños o
  usar un loader externo.

## Monitorización

- **Vercel Analytics** (Speed Insights) da Core Web Vitals de campo.
- **Search Console** da cobertura y Core Web Vitals de usuarios reales.
- **Alerta de presupuesto en Google Cloud** para la clave de Maps.
