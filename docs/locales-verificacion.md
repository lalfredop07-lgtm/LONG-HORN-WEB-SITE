# Locales — verificación y mantenimiento

## De dónde salen los datos

Los 12 locales reservables publican, en su página del sistema oficial de
reservas, un bloque **JSON-LD `Restaurant` de Schema.org** con nombre,
dirección, localidad, región, código postal, teléfono, rango de precio y
**coordenadas geográficas**. Eso es dato estructurado oficial de la propia
marca: es la fuente de la dirección, el teléfono y el código postal, y del
marcador que dibuja el mapa interno de Leaflet/OpenStreetMap (`coordenadas`).

## Botones externos de Google Maps («Cómo llegar» / «Abrir en Google Maps»)

**Corrección del 2026-10-19 — causa raíz y solución.** Los botones no
construían el enlace con datos inconsistentes entre sí; el problema era que
la fuente de datos (coordenadas del JSON-LD interno de la marca, o incluso
`query=lat,lng` directamente) no corresponde al pin que Google Maps asocia
con el restaurante. En varios locales de centro comercial esa coordenada
interna quedaba entre 60 y 490 m de la ficha de negocio real — y un enlace
`query=lat,lng` puede, además, mostrar el negocio indexado más cercano a ese
punto, que en un patio de comidas puede ser cualquier otro local.

La solución: cada uno de los 13 locales se buscó a mano en Google Maps (por
nombre + centro comercial/dirección) y se verificó que la ficha resultante
tiene reseñas y fotos reales de ESE restaurante. De esa ficha se tomaron dos
datos nuevos en `data/locales.ts`:

- `googleMapsNombre` — el nombre y dirección exactos que muestra la ficha.
- `googleMapsCid` — el identificador `0x<feature>:0x<cid>` que la propia
  ficha pública expone en su URL. `lib/locales.ts` lo añade como
  `destination_place_id` (botón «Cómo llegar», endpoint `/maps/dir/`) y
  `query_place_id` (botón «Abrir en Google Maps», endpoint `/maps/search/`)
  — el mismo mecanismo que usa un Place ID de la API de pago de Google
  Places, pero obtenido gratis navegando la web normal de Google Maps, sin
  contratar ninguna API. Los dos botones usan siempre el mismo CID: no
  pueden apuntar a sedes distintas.

12 de los 13 locales tienen `googleMapsCid` verificado. **Piura es el único
sin ficha propia en Google Maps** (comprobado dos veces, en sesiones de
navegador independientes): sus botones caen a una búsqueda por nombre y
dirección, sin identificador — nunca se inventó uno. Ver incidencia de Piura
más abajo.

Antes de este cambio, además, la página de cada local (`/locales/[slug]`)
tenía un bug propio: el botón etiquetado «Abrir en Google Maps» estaba
cableado a `urlComoLlegar` (el endpoint de indicaciones), no a `urlVerEnMapa`
(la ficha del negocio) — mismo destino final, pero el endpoint equivocado.
Corregido en `app/locales/[slug]/page.tsx`.

Pruebas automatizadas en `tests/unit/datos.test.ts` comprueban, para los 13
locales: que «Cómo llegar» use siempre `/maps/dir/` y «Abrir en Google Maps»
siempre `/maps/search/`; que ningún enlace se construya con `lat,lng` suelto;
que todo local con `googleMapsCid` lleve el mismo identificador en los dos
botones; y que el único sin ficha (Piura) lo deje explícito en vez de
inventar un identificador.

## Conciliación de la cifra

| Fuente | Dice |
|---|---|
| Web oficial / sistema de reservas | «13 locales a nivel nacional» |
| Selector de reservas | 12 locales reservables |
| Perú Retail (02-2024) | Apertura de Mall Aventura SJL |

**12 + San Juan de Lurigancho = 13.** Cuadra con la cifra oficial, y es lo que
publica el sitio.

## Estado de cada local

| Local | Estado | Geo (mapa interno) | Ficha de Google Maps | Reserva | Teléfono |
|---|---|---|---|---|---|
| Jockey Plaza | Verificado | Sí (corregida) | Sí | Sí | Sí |
| San Isidro | Verificado | Sí (confirmada) | Sí | Sí | Sí |
| Salaverry | Verificado | Sí (corregida) | Sí | Sí | Sí |
| San Borja | Verificado | Sí (confirmada) | Sí | Sí | Sí |
| San Miguel | Verificado | Sí (corregida) | Sí | Sí | Sí |
| Santa Anita | Verificado | Sí (corregida) | Sí | Sí | Sí |
| Puruchuco | Verificado | Sí (corregida) | Sí | Sí | Sí |
| Mega Plaza | Verificado | Sí (corregida) | Sí | Sí | Sí |
| San Juan de Lurigancho | **Parcial** | Sí (confirmada por la ficha) | Sí | **No** | **No** |
| Chiclayo | **Parcial** | Sí (ficha, no JSON-LD) | Sí | Sí | **No** |
| Cajamarca | Verificado | Sí (corregida) | Sí | Sí | Sí |
| Huancayo | Verificado | Sí (corregida) | Sí | Sí | Sí |
| Piura | Verificado | Sí (sin cambios) | **No — ver incidencia** | Sí | Sí |

Ningún local tiene horario verificado: LongHorn no los publica.

### Incidencias

**Huancayo.** El JSON-LD oficial declara `addressLocality: "Tarma"` y
`addressRegion: "Tarma"`. La dirección (Av. Ferrocarril 1035, Real Plaza) es
de **Huancayo, Junín** —Tarma está a unos 110 km, en −11,42 / −75,69—. Se
corrigió la localidad. Coordenada ajustada además ~55 m el 2026-10-19 contra
la ficha de Google Maps verificada.

**San Juan de Lurigancho.** Documentado por Perú Retail (3.er nivel del Mall
Aventura SJL, 384,11 m², horario 12:00–23:00 en el momento de la apertura). No
figura en el sistema de reservas, así que no tiene enlace de reserva propio y
su página ofrece WhatsApp como alternativa. Antes del 2026-10-19 el mapa solo
tenía el centroide del centro comercial (OpenStreetMap); ahora tiene además
una ficha de Google Maps propia del restaurante (68 reseñas), que confirmó
ese punto con ~5 m de diferencia.

**Chiclayo — direcciones en conflicto, pendiente de confirmar con el
cliente.** El sistema de reservas (reconsultado el 2026-10-19) da «Calle
Miguel de Cervantes 300, int. 10, P.J. Diego Ferré»; la única ficha de
Google Maps de LongHorn en Chiclayo (30 reseñas) está en «Av. Andrés Avelino
Cáceres 252», a ~2 km de esa dirección. No hay una segunda ficha de LongHorn
en la ciudad. Se conservó `direccion` tal cual la publica la marca (no se
inventó un cambio) y se usan el nombre y la coordenada de la ficha de Google
Maps verificada en los botones — es el único de los dos puntos que un
cliente puede llegar a pie y encontrar el restaurante real. Recomendado:
confirmar con el local cuál dirección es la vigente (¿hubo un traslado?).

**Piura — sin ficha de Google Maps.** El 2026-10-19 no se encontró ninguna
ficha de negocio propia de «LongHorn Piura» (probado con «LongHorn Real
Plaza Piura», «LongHorn Piura», «LongHorn Grill Drinks Piura» y variantes,
en dos sesiones de navegador independientes); Google solo devuelve el centro
comercial Real Plaza Piura y fichas de otras sedes (Salaverry, Huancayo,
Centro Cívico) — ninguna en Piura. El local **sigue activo hoy** en el
sistema oficial de reservas, así que no se trata como cerrado ni se elimina
del directorio: los botones usan una búsqueda por nombre y dirección, sin
`googleMapsCid`. Es el único de los 13 sin ficha verificada.

### Local descartado: «Centro Cívico»

No aparece en la web oficial, ni en el sistema de reservas, ni en el de
pedidos (reconsultado el 2026-10-19: sigue sin estar). Reconsultado también
en Google Maps: tiene una ficha de negocio propia, «LongHorn Grill & Drinks
- Centro Civico» (4,1★, **823 reseñas**, 322 fotos, CC Real Plaza, Av.
Garcilaso de la Vega 1337, Lima), coherente con los directorios de terceros
que ya la documentaban. Ese volumen de reseñas no es compatible con un local
cerrado o inexistente — es una señal más fuerte que antes de que SÍ está
operando. Publicarlo llevaría el total a 14 y contradiría los «13 locales»
que declara la marca; el cliente mencionó además que algunos directorios de
terceros listan Centro Cívico **en lugar de** Piura entre los 13. Ninguna
fuente de la propia marca lo confirma, así que no se publica por decisión
unilateral: queda pendiente de que el cliente confirme si es un 14.º local
activo, si sustituye a Piura o a otro de los 13 actuales, o si ya no opera
bajo la marca LongHorn. Piura se mantiene mientras tanto sin cambios.

Queda registrado en `LOCALES_DESCARTADOS` dentro de `data/locales.ts`, con su
motivo actualizado (incluido el CID de su ficha de Google Maps), para que la
decisión sea auditable y reversible.

---

## Mantenimiento

### Añadir un local

En `data/locales.ts`:

```ts
{
  slug: "miraflores",                         // define la URL /locales/miraflores
  nombre: "LongHorn Miraflores",
  nombreCorto: "Miraflores",
  ciudad: "Lima",
  distrito: "Miraflores",
  departamento: "Lima",
  centroComercial: "C.C. Larcomar",           // opcional
  direccion: "Malecón de la Reserva 610",
  codigoPostal: "15074",                      // opcional
  telefonos: ["01 1234567"],
  coordenadas: { lat: -12.1319, lng: -77.0301 },  // null si no están verificadas
  horarios: null,                             // o la lista de tramos
  urlReservas: "https://longhorn.mesa247.pe/reservas/longhorn-miraflores",
  urlPedidos: "https://longhorn.mesa247.pe/pideonline/610",
  urlLibroReclamaciones: null,
  razonSocial: "L.H. MIRAFLORES S.A.C.",
  rangoPrecio: "S/ 100",
  estadoVerificacion: "verificado",
  fuenteIds: ["mesa247-reservas"],
  verificadoEl: "2026-11-02",
}
```

Al guardar, el local aparece automáticamente en el directorio, en el mapa (si
tiene coordenadas), en el sitemap, en el selector de reservas, en el de la carta
y con su propia página con datos estructurados.

> Hay que actualizar el total esperado en `tests/e2e/locales.spec.ts` y
> `tests/unit/datos.test.ts`.

### Añadir horarios

```ts
horarios: [
  { dias: ["lunes", "martes", "miercoles", "jueves"], abre: "12:00", cierra: "23:00" },
  { dias: ["viernes", "sabado"], abre: "12:00", cierra: "00:30" },
  { dias: ["domingo"], abre: "12:00", cierra: "22:00" },
],
```

En cuanto `horarios` deja de ser `null`, la ficha muestra la tabla en lugar del
aviso, y se puede añadir `openingHoursSpecification` al JSON-LD.

### Dar de baja un local

```ts
publicado: false,
```

Desaparece del directorio, del mapa, de los selectores y del sitemap. Conviene
además añadir una redirección en `next.config.ts`:

```ts
{ source: "/locales/slug-antiguo", destination: "/locales", permanent: true },
```

### Corregir coordenadas (marcador del mapa interno)

Obtenerlas en Google Maps (clic derecho sobre el punto exacto → la primera
opción copia `lat, lng`). **Nunca estimarlas desde la dirección**: un punto
aproximado puede mandar a un cliente a la manzana equivocada.

### Corregir o añadir la ficha de Google Maps (botones «Cómo llegar» / «Abrir en Google Maps»)

No se usan coordenadas para estos dos botones (ver sección de arriba). Para
verificar o cambiar la ficha de un local:

1. Busca en Google Maps `<nombre LongHorn> <centro comercial o dirección> <ciudad>`.
2. Confirma que la ficha que resuelve tiene reseñas y fotos reales de ESE
   restaurante (no del centro comercial ni de otra sede).
3. Copia el nombre + dirección que muestra la ficha → `googleMapsNombre`.
4. Abre la URL de esa ficha y busca en ella `!1s0x<hex>:0x<hex>!` (dentro del
   parámetro `data=`) → ese `0x<hex>:0x<hex>` es `googleMapsCid`.
5. Si no hay ficha propia, dejas `googleMapsCid: null` y `googleMapsNombre:
   null`, y lo explicas en `notas`. `lib/locales.ts` cae automáticamente a
   una búsqueda por nombre y dirección.
