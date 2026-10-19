# Bebidas pendientes de aprobación

Estos 28 productos **no están publicados** en la carta (`estado: "oculto"` en
`data/carta.ts`). Existen en la base de datos, listos para activarse, pero
nadie los ve en el sitio hasta que alguien de LongHorn confirme que siguen
vigentes y, si corresponde, su precio.

**Por qué están aquí y no en la carta pública:** la única fuente de todos
ellos es un recetario de coctelería de terceros en Scribd, fechado en 2018
(`docs/carta-fuentes.md` → fuente `scribd-recetario-2018`), sin relación
confirmada con la carta actual del restaurante. Scribd también lo etiqueta
como «2024» en sus metadatos de SEO, lo cual tampoco se ha podido verificar.
Ante la duda, no se publica.

**Búsqueda de precio, intentos realizados (dos rondas):** carta digital
oficial (40 páginas descargadas y revisadas una a una), Rappi San Borja
(revisado dos veces, buscando específicamente chilcanos y cócteles),
`longhorn.mesa247.pe` y su «Pide online» (`/pideonline/610` exige iniciar
sesión con Facebook/Google/email — no se creó ninguna cuenta para entrar),
Instagram y Facebook oficiales (no accesibles sin sesión), y los documentos
del propio proyecto (`assets-fuente/carta.pdf`, confirmado que son las
mismas 10 páginas ya transcritas, sin bebidas). Ningún precio unitario
nuevo apareció: **el único precio publicado que no es de delivery es el de
los 7 vinos por copa.** Todo chilcano y cóctel clásico de Happy Hour solo
tiene precio de combo (2 x S/ 29), nunca un precio por unidad — publicarlo
como si lo tuviera sería inventar una cifra.

## Tabla para rellenar — lo que falta por confirmar

La forma más rápida de completar esto: la encargada marca el precio (o
«sigue igual: combo 2x29» si no hay precio suelto) y nos lo envía. Todo lo
demás —fecha, fuente, estado— lo actualizamos nosotros al volcarlo a
`data/carta.ts`.

| Producto | Precio por unidad (S/) |
|---|---|
| Chilcano de Limón | _____ |
| Chilcano de Anís Estrella y Mandarina | _____ |
| Chilcano de Maracuyá | _____ |
| Chilcano de Naranja | _____ |
| Chilcano de Aguaymanto | _____ |
| Chilcano de Camu Camu | _____ |
| Chilcano de Coca | _____ |
| Chilcano de Lima | _____ |
| Chilcano de Finas Hierbas | _____ |
| Chilcano de Hierba Luisa | _____ |
| Piña Colada (precio suelto, fuera de Happy Hour) | _____ |
| Fresa Colada (precio suelto, fuera de Happy Hour) | _____ |
| Margarita (precio suelto, fuera de Happy Hour) | _____ |
| Mojito (precio suelto, fuera de Happy Hour) | _____ |
| Cóctel de Algarrobina (precio suelto, fuera de Happy Hour) | _____ |
| Pisco Sour Clásico / Aguaymanto / Arándanos / Coca / Maracuyá (precio suelto) | _____ |
| Long Island Iced Tea | _____ |
| Bloody Mary | _____ |
| Apple Martini | _____ |
| Daiquiri | _____ |
| Miami Vice | _____ |
| Caipiriña | _____ |
| Margarita LongHorn | _____ |
| Inkatexas Cocktail, Manantial, Sierra, Pasión, Cuzqueño, Machupicchu, Punch Supremo, Tinto del Ruedo | _____ (uno por uno, o «ya no se sirven») |
| Cervezas y bebidas sin alcohol: ¿mismo precio en mesa que en delivery San Borja? | Sí / No — si no, indicar precio de mesa |

## Cómo activar uno

En `data/carta.ts`, localizar el plato por su nombre y:

1. Cambiar `estado: "oculto"` → quitar la línea (el valor por defecto ya es
   `"publicado"`).
2. Cambiar `estadoVerificacion: "historico"` → `"verificado"`.
3. Añadir `precio` si el restaurante lo confirma (en soles, sin IGV aparte:
   mismo criterio que el resto de la carta).
4. Cambiar `fuenteId: "scribd-recetario-2018"` por una fuente propia (añadir
   el registro en `data/fuentes.ts` si la confirmación llega por un canal
   nuevo — un PDF, un correo, una carta física).
5. Actualizar `verificadoEl` a la fecha real de la confirmación.
6. Revisar `ingredientes` (cuando los haya): están transcritos del recetario
   **sin cantidades**, porque el documento fuente usa una fuente tipográfica
   con los glifos remapeados (protección anti-copia de Scribd) y las
   cantidades no se pudieron verificar letra por letra con fiabilidad — los
   nombres de ingrediente sí, las cifras no. Si el restaurante confirma el
   cóctel, lo ideal es pedir también la receta con cantidades reales en vez
   de confiar en esta transcripción.

Si cambia el número de pendientes o de publicados, actualizar los recuentos
en `tests/unit/datos.test.ts`, `tests/e2e/carta.spec.ts` y
`tests/e2e/seo.spec.ts` (ver `docs/carta-fuentes.md`).

## Cócteles de Autor (8) — ninguno publicado

Ninguno de estos 8 aparece en ninguna fuente vigente (ni la carta digital
oficial ni Rappi). Si el restaurante los confirma, la pestaña «Cócteles de
autor» aparecerá sola en la carta en cuanto el primero se publique.

| Nombre | Ingredientes (sin cantidades, ver nota arriba) |
|---|---|
| Inkatexas Cocktail | Pisco, moras, romero, jarabe de goma, soda |
| Manantial | Pisco, infusión de manzanilla y anís, jugo de lima, ginger ale |
| Sierra | Pisco, muña y huacatay, piña, ginger ale |
| Pasión | Vodka, maracuyá, lima, jarabe de goma |
| Cuzqueño | Pisco, cointreau, moras, infusión de toronjil, zumo de limón, miel de abeja, soda |
| Machupicchu | Pisco acholado, jugo de naranja, jarabe de granadina, licor de menta |
| Punch Supremo | Pisco quebranta, jugo de maracuyá, crema de menta, ginger ale |
| Tinto del Ruedo | Vino, jugo de piña, jugo de naranja, splash de limón, jarabe de granadina |

## Pisco Sours — 3 sin confirmar (5 de 8 ya están publicados)

Camu Camu Sour, Lima Sour y Pisco Sour Catedral aparecen en el recetario de
2018 pero no en el «Festival de Sours» vigente de la carta digital (que sí
cubre Aguaymanto, Arándanos, Coca, Maracuyá y el Clásico — esos 5 **ya están
publicados**, sin precio unitario, con nota de que su precio real es la
promoción 3 x S/ 25).

## Chilcanos — 10 sabores sin confirmar (solo el genérico está publicado)

La carta digital solo nombra «chilcanos» en Happy Hour, sin especificar
sabor — eso es lo único publicado. Estos 10 sabores del recetario de 2018
necesitan confirmación:

Limón · Anís estrella y mandarina · Maracuyá · Naranja · Aguaymanto · Camu
camu · Coca · Lima · Finas hierbas · Hierba luisa.

## Cócteles clásicos — 7 sin confirmar (5 de 12 ya están publicados)

Piña Colada, Fresa Colada, Margarita, Mojito y Cóctel de Algarrobina
**ya están publicados** (nombrados explícitamente en Happy Hour). Estos 7
solo aparecen en el recetario de 2018:

Long Island Iced Tea · Bloody Mary · Apple Martini · Daiquiri · Miami Vice ·
Caipiriña · Margarita LongHorn.

Nota de nombres: la fuente oficial dice literalmente «Fresa colada», no
«Daiquiri de Fresa» — son preparaciones distintas y solo la primera está
confirmada. El «Daiquiri» a secas de esta lista (sin sabor) es otro
producto, sin confirmar, del recetario de 2018.

## Lo que NO está en este documento (ya publicado, sin pendientes)

- **7 vinos por copa** — carta digital oficial, con precio individual real.
  Único grupo de bebidas con precio unitario 100 % confirmado.
- **3 cervezas** y **7 bebidas sin alcohol** — Rappi, delivery San Borja.
  Publicadas con `disponibleEn: ["san-borja"]`: el precio no se afirma para
  el resto de la red ni para consumo en mesa, solo para esa sede en
  delivery/recojo. Si el restaurante confirma que el precio de mesa es el
  mismo (o distinto) en más locales, ampliar `disponibleEn` en cada plato.

## Preguntas concretas para el restaurante

1. ¿Los 8 «Cócteles de Autor» del recetario de 2018 siguen en carta? ¿Con
   qué precio?
2. ¿Los 10 sabores de chilcano siguen disponibles sueltos (no solo en Happy
   Hour) y con qué precio cada uno?
3. ¿Los 7 cócteles clásicos adicionales (Bloody Mary, Daiquiri, etc.) siguen
   en carta?
4. ¿El precio de cervezas y bebidas sin alcohol de San Borja (Rappi) es el
   mismo para consumo en mesa y en el resto de los 13 locales?
5. ¿Existe una carta de vinos y destilados más amplia que «Vino por Copa»
   (botella completa, licores, etc.)?
