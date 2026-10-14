# Locales — verificación y mantenimiento

## De dónde salen los datos

Los 12 locales reservables publican, en su página del sistema oficial de
reservas, un bloque **JSON-LD `Restaurant` de Schema.org** con nombre,
dirección, localidad, región, código postal, teléfono, rango de precio y
**coordenadas geográficas**.

Eso es dato estructurado oficial de la propia marca. Es lo que se ha
reproducido, sin geocodificar nada por nuestra cuenta ni estimar posiciones.

## Conciliación de la cifra

| Fuente | Dice |
|---|---|
| Web oficial / sistema de reservas | «13 locales a nivel nacional» |
| Selector de reservas | 12 locales reservables |
| Perú Retail (02-2024) | Apertura de Mall Aventura SJL |

**12 + San Juan de Lurigancho = 13.** Cuadra con la cifra oficial, y es lo que
publica el sitio.

## Estado de cada local

| Local | Estado | Geo | Reserva | Teléfono | Horario |
|---|---|---|---|---|---|
| Jockey Plaza | Verificado | Sí | Sí | Sí | — |
| San Isidro | Verificado | Sí | Sí | Sí | — |
| Salaverry | Verificado | Sí | Sí | Sí | — |
| San Borja | Verificado | Sí | Sí | Sí | — |
| San Miguel | Verificado | Sí | Sí | Sí | — |
| Santa Anita | Verificado | Sí | Sí | Sí | — |
| Puruchuco | Verificado | Sí | Sí | Sí | — |
| Mega Plaza | Verificado | Sí | Sí | Sí | — |
| Chiclayo | Verificado | Sí | Sí | **No** | — |
| Piura | Verificado | Sí | Sí | Sí | — |
| Cajamarca | Verificado | Sí | Sí | Sí | — |
| Huancayo | Verificado* | Sí | Sí | Sí | — |
| San Juan de Lurigancho | **Parcial** | **No** | **No** | **No** | — |

Ningún local tiene horario verificado: LongHorn no los publica.

### Incidencias

**Huancayo.** El JSON-LD oficial declara `addressLocality: "Tarma"` y
`addressRegion: "Tarma"`. Las coordenadas publicadas (−12,0666 / −75,2056) y la
dirección (Av. Ferrocarril 1035, Real Plaza) son de **Huancayo, Junín** —Tarma
está a unos 110 km, en −11,42 / −75,69—. Se corrigió la localidad y se
conservaron las coordenadas oficiales. Queda anotado en el campo `notas` del
local, visible en su ficha.

**San Juan de Lurigancho.** Documentado por Perú Retail (3.er nivel del Mall
Aventura SJL, 384,11 m², horario 12:00–23:00 en el momento de la apertura). No
figura en el sistema de reservas, así que:

- aparece en el directorio con su dirección,
- **no se dibuja marcador en el mapa** (sin coordenadas oficiales),
- su botón «Cómo llegar» abre una **búsqueda** en Google Maps por nombre y
  dirección, no un punto concreto,
- y su página ofrece WhatsApp como alternativa de reserva.

**Chiclayo.** Sin teléfono en la fuente oficial. Su ficha lo dice y ofrece
WhatsApp.

### Local descartado: «Centro Cívico»

Aparece en directorios de terceros alimentados por usuarios, con dirección en
Av. Garcilaso de la Vega 1337 (C.C. Real Plaza) y teléfono 934 086 966. **No
está** en la web oficial, ni en reservas, ni en pedidos. Publicarlo llevaría el
total a 14 y contradiría la cifra de la marca.

Queda registrado en `LOCALES_DESCARTADOS` dentro de `data/locales.ts`, con su
motivo, para que la decisión sea auditable y reversible.

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

### Corregir coordenadas

Obtenerlas en Google Maps (clic derecho sobre el punto exacto → la primera
opción copia `lat, lng`). **Nunca estimarlas desde la dirección**: un punto
aproximado puede mandar a un cliente a la manzana equivocada.
