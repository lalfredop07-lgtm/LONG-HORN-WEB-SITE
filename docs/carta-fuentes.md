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

**103 referencias.** Comprobado en `tests/unit/datos.test.ts` y en
`tests/e2e/carta.spec.ts`, que fallan si el número cambia sin querer.

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

## Categorías sin datos publicables ⚠️

El PDF oficial **no incluye**:

- bebidas sin alcohol
- cervezas
- cócteles y destilados
- vinos
- postres
- combos y promociones

Es una ausencia llamativa, porque la marca se llama «Grill & Drinks» y declara
cócteles y vinos premium entre sus especialidades.

**Decisión tomada:** la sección «Bebidas y cócteles» existe en la navegación y
en la carta, con una explicación honesta de que la lista se consulta en el
restaurante. **No se publica ni un solo nombre o precio de bebida.**

La estructura ya está lista para recibirlos: en cuanto el cliente facilite la
carta de bebidas, basta con añadir los platos con `categoria: "bebidas"` y poner
`sinCartaPublicada: false` en el grupo.

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
