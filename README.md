# LongHorn Grill & Drinks — Perú

Sitio web de LongHorn Perú: carnes, parrillas y cócteles, con 13 restaurantes en
cinco ciudades del país.

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · 31 rutas estáticas

---

## Arrancar

```bash
npm install
cp .env.example .env.local      # rellenar lo que haga falta
npm run dev                     # http://localhost:3000
```

El sitio funciona sin ninguna variable configurada: sin clave de Google Maps el
directorio de locales sigue completo y el mapa se sustituye por un aviso; sin
Measurement ID no se carga analítica.

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run start        # servir la build

npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run test         # Vitest — capa de datos
npm run test:e2e     # Playwright — escritorio y móvil
npm run verify       # lint + typecheck + test + build

node scripts/capturas.mjs             # 90 capturas + auditoría de desbordes
python3 scripts/build-brand-assets.py # derivados del logotipo
python3 scripts/build-food-photos.py  # fotos de la carta desde el PDF oficial
python3 scripts/build-og.py           # imagen para redes sociales
python3 scripts/optimizar-video.py <origen.mp4> <nombre>
```

## Estado

| | |
|---|---|
| Lint · TypeScript | **0 errores** |
| Pruebas unitarias | **16/16** |
| Pruebas end-to-end | **79/79** |
| Build | **31 rutas estáticas** |
| QA visual | **90 capturas, 0 desbordes** |
| Lighthouse escritorio | Perf **99–100** · A11y **100** · BP 96 · SEO **100** |
| Lighthouse móvil | Perf **90–95** · A11y **100** · BP 96 · SEO **100** |
| Despliegue | **Pendiente de accesos** |

## Contenido

| | |
|---|---|
| Platos en la carta | **103**, con precio, de la carta oficial |
| Locales | **13** (12 con coordenadas verificadas) |
| Experiencias | 1 («Sabores LongHorn»), en 6 locales |
| Fotografía de platos | 10 imágenes oficiales extraídas del PDF de la carta |
| Recursos generados | 2 vídeos + 1 imagen (Higgsfield) |

---

## Cómo está organizado

```
app/          Rutas (App Router) — todas estáticas
components/   layout · sections · menu · locations · forms · motion · ui
data/         Contenido tipado y validado con Zod ← se edita aquí
lib/          schemas · carta · locales · seo · site · analitica · hooks
styles/       globals.css — tokens de diseño
scripts/      Generación de assets y QA visual
tests/        unit (Vitest) + e2e (Playwright)
docs/         Documentación del proyecto
```

**Para cambiar contenido casi siempre basta con tocar `data/`.** Precios, platos,
locales, teléfonos, FAQ y datos de marca viven ahí, tipados y validados: si falta
un campo obligatorio, la build falla con un mensaje que señala el registro.

---

## Principio del proyecto

Nada de lo que afirma este sitio está inventado.

Cada precio, dirección, teléfono y coordenada procede de una fuente oficial
registrada en `data/fuentes.ts`, con su URL y su fecha de consulta. Cuando un
dato no se pudo verificar —los horarios, la carta de bebidas, las coordenadas de
San Juan de Lurigancho—, **el sitio lo dice en vez de rellenar el hueco**.

Eso explica algunas decisiones que de otro modo parecerían carencias:

- Las fichas de local no tienen foto de fachada, porque no hay material
  autorizado y generar un edificio con IA para presentarlo como un restaurante
  real sería engañar al cliente final.
- La sección de bebidas no lista ningún cóctel, porque el documento oficial de
  la carta no los incluye.
- No hay formulario de contacto, porque no hay buzón al que enviar los mensajes.
- Los datos estructurados no llevan valoraciones, porque no existen reseñas
  propias.

Hay pruebas automatizadas que impiden que esto se degrade con el tiempo.

---

## Documentación

| Documento | Contenido |
|---|---|
| [investigacion-longhorn.md](docs/investigacion-longhorn.md) | Toda la investigación de marca, con fuentes y fechas |
| [identidad-visual.md](docs/identidad-visual.md) | Logotipo, color, tipografía, texturas |
| [arquitectura.md](docs/arquitectura.md) | Stack, estructura, capa de datos, variables |
| [carta-fuentes.md](docs/carta-fuentes.md) | Origen de la carta y cómo mantenerla |
| [locales-verificacion.md](docs/locales-verificacion.md) | Verificación de los 13 locales |
| [integraciones.md](docs/integraciones.md) | Google Maps, reservas, pedidos, analítica |
| [higgsfield-assets.md](docs/higgsfield-assets.md) | Recursos generados, prompts y coste |
| [seo.md](docs/seo.md) · [seo-local.md](docs/seo-local.md) | SEO técnico y local |
| [analytics.md](docs/analytics.md) | GA4, consentimiento y eventos |
| [rendimiento.md](docs/rendimiento.md) | Core Web Vitals y qué se optimizó |
| [accesibilidad.md](docs/accesibilidad.md) | WCAG 2.2 AA |
| [seguridad.md](docs/seguridad.md) | Cabeceras, CSP, secretos |
| [pruebas.md](docs/pruebas.md) | Qué se prueba y qué encontró |
| [despliegue.md](docs/despliegue.md) | Publicar en Vercel |
| [mantenimiento.md](docs/mantenimiento.md) | **Guía práctica del día a día** |
| [pendientes-cliente.md](docs/pendientes-cliente.md) | **Lo que hace falta de LongHorn** |

---

## Antes de publicar

Ver [docs/pendientes-cliente.md](docs/pendientes-cliente.md). Lo que bloquea:

1. Clave de Google Maps Platform restringida.
2. Aprobación legal de privacidad, cookies y términos.
3. Accesos de GitHub, Vercel y DNS.
