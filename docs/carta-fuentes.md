# Carta — fuentes, extracción y mantenimiento

## Origen de los datos

**Fuente principal:** PDF oficial «Carta Lima Moderna», distribuido por
mesa 24/7 en `https://cdn.mesa247.io/archivos/ficheros/610/1774556599.pdf`,
consultado el **14 de octubre de 2026**.

**Fuente de contraste:** carta digital en
`https://www.longhorn.com.pe/CartaDigital/01/mobile/index.html`.

## Cómo se extrajo

El PDF tiene 10 páginas A3 apaisadas (20 páginas de carta) y **no tiene capa de
texto**: la tipografía está vectorizada. Tampoco se podía usar OCR sobre las
imágenes incrustadas, porque esas imágenes son solo las fotografías; el texto
son trazos del propio PDF.

El proceso fue:

1. Renderizar cada página a 200 dpi.
2. Partir cada pliego A3 en sus dos páginas A4.
3. Transcribir cada página de texto, una por una.
4. Volcar la transcripción a `data/carta.ts`.
5. Verificar el recuento con una prueba automatizada.

Las fotografías se extrajeron aparte con `scripts/build-food-photos.py`.

## Recuento verificado

**103 referencias de alimentos** (de este PDF) **+ 56 de bebidas** (28
publicadas, 28 pendientes — ver «Bebidas» más abajo) **= 159 en total**, de
las que **131 están publicadas**. Comprobado en `tests/unit/datos.test.ts` y
en `tests/e2e/carta.spec.ts`, que fallan si alguno de estos números cambia
sin querer.

| Categoría | Platos | Rango |
|---|---|---|
| Piqueos | 20 | S/ 16 – 49 |
| Ensaladas | 6 | S/ 21 – 46 |
| Pastas | 11 | S/ 36 – 49 |
| Grill — Americana Premium | 6 | S/ 149 – 189 |
| Grill — Cortes Selectos | 5 | S/ 74 – 255 |
| Grill — Argentina Premium | 2 | S/ 140 – 155 |
| Grill — Nuestros Clásicos | 4 | S/ 65 – 89 |
| Más del Grill | 11 | S/ 22 – 139 |
| Especialidades | 12 | S/ 25 – 66 |
| Saltados | 5 | S/ 34 – 59 |
| Carne y Pasta | 5 | S/ 51 – 67 |
| Guarniciones | 10 | S/ 15 – 22 |
| Menú Kids | 6 | S/ 36 |
| **Total** | **103** | **S/ 15 – 255** |

## Criterios de transcripción

1. **Los nombres se copian tal cual**, incluidas grafías propias de la carta
   («Spaguetti», «Ravioles Oxtail», «Lasagna»). No se corrigen: así es como el
   cliente los pide en el restaurante.
2. **Si un plato no trae descripción en la carta, aquí tampoco la tiene.** No se
   redactan descripciones que parezcan oficiales.
3. La guarnición estándar de los cortes se transcribe literal y completa.
4. Los precios son enteros en soles, tal como figuran.
5. Las variantes («BBQ ó picantes ó naturales…») se guardan además como lista,
   para poder mostrarlas como etiquetas sin alterar el texto original.

### Una nota del documento original

«Parrilla para 2 Personas» tiene la descripción **recortada en el propio PDF**:
termina en «…papas fritas o papa al horno o camote» y se corta. En lugar de
inventar el final, se resumió como «Incluye guarnición a escoger.» y se dejó
constancia en el campo `notaFuente` del plato.

## Bebidas

El PDF oficial de alimentos **no incluye** bebidas, cócteles, cervezas, vinos
ni postres — ausencia llamativa, porque la marca se llama «Grill & Drinks».
Esa carencia se cerró investigando cuatro fuentes aparte (ver «Fuentes de
bebidas» abajo): la propia carta digital oficial, Rappi, y un recetario
histórico de terceros usado solo como lista de borradores.

**Resultado:** 56 bebidas en `data/carta.ts`, 28 publicadas y 28 ocultas.

| Subcategoría | Publicadas | Ocultas (pendientes) | Fuente de lo publicado |
|---|---|---|---|
| Vinos por Copa | 7 | 0 | Carta digital oficial — precio individual real |
| Pisco Sours | 5 | 3 | Festival de Sours (carta digital) — sin precio unitario |
| Chilcanos | 1 (genérico) | 10 (sabores) | Happy Hour (carta digital) — sin precio unitario |
| Cócteles Clásicos | 5 | 7 | Happy Hour (carta digital) — sin precio unitario |
| Cervezas | 3 | 0 | Rappi, delivery San Borja |
| Bebidas sin Alcohol | 7 | 0 | Rappi, delivery San Borja |
| Cócteles de Autor | 0 | 8 | — (ninguno confirmado; la pestaña no aparece) |

Las 28 ocultas, por qué y cómo publicarlas: **`docs/bebidas-pendientes.md`**.

### Fuentes de bebidas

- **Carta digital oficial** (`longhorn-carta-digital-bebidas` en
  `data/fuentes.ts`) — visor de 40 páginas sin capa de texto en
  `longhorn.com.pe/CartaDigital/01/mobile/index.html`; solo 2 de las 40
  páginas tratan bebidas: «Happy Hour» (2x S/29) y «Vino por Copa» (precio
  individual). Esas promociones dan **nombre** verificado pero no un precio
  por unidad, así que esos platos se publican con `precio` ausente y un
  texto «Consultar precio» en vez de un número inventado.
- **Rappi, sede San Borja** (`rappi-san-borja`) — cervezas y bebidas sin
  alcohol con precio de delivery/recojo de una sola sede. Se publican con
  `disponibleEn: ["san-borja"]`, nunca como precio general de la red.
- **Recetario histórico de 2018** (`scribd-recetario-2018`, confianza baja)
  — documento de terceros en Scribd con 27 cócteles. Nunca se publica
  directamente: solo alimenta `docs/bebidas-pendientes.md` como borradores
  que el restaurante debe confirmar.
- **mesa 24/7, Pide online** (`mesa247-pideonline`) — probablemente tiene
  precios reales, pero exige iniciar sesión antes de mostrar nada y no hay
  modo invitado. Nunca se creó una cuenta para sortear el login; queda
  registrada como fuente intentada y bloqueada, no como consultada.

### Por qué «Cócteles de Autor» no aparece como pestaña

`CartaPorCategorias.tsx` solo muestra una subcategoría cuando tiene al menos
un producto **publicado**. Ninguno de los 8 cócteles de autor está
confirmado en una fuente vigente, así que la pestaña simplemente no se
renderiza — no hace falta ocultarla a mano, y aparecerá sola en cuanto se
publique el primero.

## Cómo mantener la carta

### Cambiar un precio

`data/carta.ts`, localizar el plato y cambiar `precio`. Actualizar también
`VERIFICADO_EL` al principio del archivo.

```ts
{ nombre: "Lomo Saltado", categoria: "saltados", precio: 62 },
```

### Añadir un plato

```ts
{
  nombre: "Nombre exacto de la carta",
  categoria: "especialidades",
  precio: 72,
  descripcion: "Descripción literal de la carta.",
  presentacion: "350g",      // opcional
  comensales: 2,             // opcional, solo si la carta lo indica
  bajoEnCalorias: true,      // opcional, el corazón de la carta
  destacado: true,           // opcional, lo saca en la portada
  imagen: "/images/carta/archivo.webp",
  imagenAlt: "Descripción de la foto para lectores de pantalla",
}
```

El `id` y el `slug` se generan solos a partir del nombre y la categoría.

> Si cambia el número total de platos, hay que actualizar la cifra en
> `tests/unit/datos.test.ts` y `tests/e2e/carta.spec.ts`. Es deliberado: obliga
> a que una modificación del recuento sea una decisión consciente.

### Ocultar un plato temporalmente

```ts
estado: "oculto",
```

Desaparece de la carta, del buscador y de los datos estructurados, pero el
registro se conserva con su histórico.

### Reordenar categorías

Cambiar `orden` en `CATEGORIAS_RAW` o `GRUPOS_RAW`.

### Cambiar una fotografía

Dejar el archivo en `public/images/carta/` y apuntar `imagen` ahí. Formato
recomendado: WebP, lado largo ≈ 1 750 px, calidad 84.

### Precios distintos por local

El modelo ya contempla `disponibleEn: string[]` por plato. Hoy está vacío en
todos (la carta es única para la red). Si en el futuro hay diferencias, se
rellena con los slugs de local y la interfaz filtrará automáticamente.
