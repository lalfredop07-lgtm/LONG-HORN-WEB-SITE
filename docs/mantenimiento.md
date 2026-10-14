# Mantenimiento

Guía práctica para el equipo de LongHorn. Cada tarea indica el archivo que hay
que tocar y qué pasa después.

Todos los cambios siguen el mismo ciclo: **editar → `npm run verify` → commit →
push**. Vercel despliega solo.

---

## Carta

### Cambiar un precio

**Archivo:** `data/carta.ts`

```ts
{ nombre: "Lomo Saltado", categoria: "saltados", precio: 62 },
//                                                       ↑ aquí
```

Actualizar también `VERIFICADO_EL` al principio del archivo. El precio cambia a
la vez en la carta, en los datos estructurados y en cualquier sección de la
portada que lo muestre.

### Añadir o quitar un plato

Ver `docs/carta-fuentes.md`, que tiene la plantilla completa.

### Ocultar un plato temporalmente

```ts
estado: "oculto",
```

Desaparece de todas partes sin perder el registro.

### Publicar la carta de bebidas

Cuando LongHorn facilite la lista:

1. Añadir los platos con `categoria: "bebidas"`.
2. En `GRUPOS_RAW`, poner `sinCartaPublicada: false` en el grupo `bebidas` y
   borrar `notaSinCarta`.
3. Actualizar la cuenta esperada en las pruebas.

La sección ya existe y está enlazada desde la portada: solo le falta contenido.

---

## Locales

### Añadir, modificar o dar de baja un local

Ver `docs/locales-verificacion.md`, con plantilla y advertencias.

### Añadir horarios (lo más pedido)

**Archivo:** `data/locales.ts`

```ts
horarios: [
  { dias: ["lunes", "martes", "miercoles", "jueves"], abre: "12:00", cierra: "23:00" },
  { dias: ["viernes", "sabado"], abre: "12:00", cierra: "00:30" },
  { dias: ["domingo"], abre: "12:00", cierra: "22:00" },
],
```

La ficha deja de mostrar el aviso y pinta la tabla.

### Cambiar un teléfono

```ts
telefonos: ["01 4213916", "945 186 438"],
```

Se actualiza en la ficha, en la página de contacto y en el JSON-LD, con el
enlace `tel:` bien formado automáticamente.

---

## Imágenes y vídeo

### Cambiar una fotografía de plato

Dejar el archivo en `public/images/carta/` y apuntar `imagen` en el plato.
Recomendado: WebP, lado largo ≈ 1 750 px, calidad 84.

```bash
python3 - <<'PY'
from PIL import Image
im = Image.open("origen.jpg").convert("RGB")
alto = 1754
im.resize((round(im.width*alto/im.height), alto), Image.LANCZOS) \
  .save("public/images/carta/nombre.webp", quality=84, method=6)
PY
```

### Sustituir el vídeo del hero

```bash
python3 scripts/optimizar-video.py ruta/al/nuevo-video.mp4 hero-parrilla
```

Genera los tres archivos (escritorio, móvil y póster) con los nombres que el
sitio ya usa. **No hay que tocar código.**

> El póster se extrae del fotograma 0 del vídeo nuevo, que es justo lo que hace
> falta para que el relevo imagen→vídeo siga siendo invisible.

### Regenerar la imagen para redes sociales

```bash
python3 scripts/build-og.py
```

### Regenerar los derivados del logotipo

```bash
python3 scripts/build-brand-assets.py
```

---

## Textos

| Qué | Dónde |
|---|---|
| Titulares y textos de la portada | `components/sections/*.tsx` |
| Historia e hitos | `app/nuestra-historia/page.tsx` |
| Preguntas frecuentes | `data/faq.ts` |
| Textos legales | `app/privacidad/`, `app/cookies/`, `app/terminos-y-condiciones/` |
| Datos de contacto y redes | `data/marca.ts` |
| Menús | `data/navegacion.ts` |

### Quitar el aviso de «documento pendiente de aprobación»

Cuando la asesoría legal apruebe los textos:

```tsx
<DocumentoLegal pendienteValidacion={false}>
```

---

## SEO

### Cambiar un título o una descripción

En la página correspondiente, dentro de `construirMetadata({...})`.

> Mantener títulos distintos entre páginas: hay una prueba que falla si se
> duplican.

### Añadir una página nueva

1. Crear `app/mi-ruta/page.tsx`.
2. Exportar `metadata` con `construirMetadata()`.
3. Añadir la ruta a `app/sitemap.ts`.
4. Enlazarla desde el menú (`data/navegacion.ts`) o desde el pie.

---

## Rutina recomendada

### Mensual
- [ ] Revisar que los precios coincidan con la carta vigente
- [ ] `npm audit`
- [ ] Core Web Vitals en Search Console

### Trimestral
- [ ] Revisar locales (aperturas, cierres, traslados)
- [ ] Revisar teléfonos y horarios
- [ ] `npm outdated` y actualizar menores
- [ ] Repasar el contenido de las FAQ

### Anual
- [ ] Revisión legal de los textos
- [ ] Actualizar fotografía
- [ ] Revisar el coste de la API de Google Maps

---

## Si algo se rompe

### La build falla con `[locales] registro #N inválido`

Es la validación de datos haciendo su trabajo. El mensaje dice el archivo, el
registro y el campo. Suele ser una coma de más, una coordenada mal pegada o un
campo obligatorio ausente.

### Una prueba falla tras añadir un plato o un local

Normal y buscado: las cuentas totales están fijadas en las pruebas para que un
cambio de recuento sea deliberado. Actualizar el número en
`tests/unit/datos.test.ts` y en `tests/e2e/*.spec.ts`.

### El mapa no carga

1. ¿Está `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` en Vercel?
2. ¿Se ha vuelto a desplegar después de añadirla? (Es variable de build.)
3. ¿El dominio está en los referentes permitidos de la clave?
4. ¿Está habilitada la facturación en Google Cloud?

Mientras tanto el directorio sigue funcionando: no es una caída del sitio.

### Volver atrás

En Vercel, *Deployments* → el despliegue anterior → *Promote to Production*.
Es inmediato.
