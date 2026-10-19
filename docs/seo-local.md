# SEO local

El objetivo de negocio es claro: que alguien que busca «parrilla en San Isidro»
o «restaurante de carnes Real Plaza Salaverry» encuentre el local correcto.

## Una página por local

13 páginas en `/locales/[slug]`, generadas estáticamente, cada una con:

- `<h1>` con el nombre del local,
- dirección, distrito, ciudad y código postal,
- teléfonos con enlace `tel:` en formato E.164,
- enlace «Cómo llegar»,
- enlace de reserva al sistema oficial de esa sede,
- enlace a la carta,
- razón social que opera el local,
- migas de pan,
- enlaces a otras sedes.

### Contenido diferenciado

El briefing avisaba: *«No crees páginas repetidas cambiando solo el distrito»*.
Cada ficha varía en dirección, teléfonos, código postal, centro comercial, rango
de precio, razón social, servicios y notas específicas. Por ejemplo:

- **Huancayo** explica la discrepancia de localidad de la fuente oficial.
- **Chiclayo** indica que no publica teléfono directo y ofrece WhatsApp.
- **San Juan de Lurigancho** explica que todavía no admite reserva online.
- **Mega Plaza** no muestra código postal porque la fuente no lo trae.
- **San Isidro** señala que es local a pie de calle, no de centro comercial.

## Consistencia NAP

**N**ombre, **A**dirección y **T**eléfono salen de una sola fuente de verdad
(`data/locales.ts`) y se usan igual en la ficha, el directorio, el JSON-LD, el
sitemap y los enlaces de mapas. No hay forma de que se desincronicen.

El nombre sigue siempre el patrón `LongHorn {Local}`, coherente con cómo la
marca se nombra en su sistema de reservas.

## Datos estructurados por sede

`Restaurant` con `name`, `url`, `image`, `servesCuisine`, `priceRange`,
`currenciesAccepted`, `hasMenu`, `parentOrganization`, `address` completo,
`geo`, `telephone`, `acceptsReservations`, `potentialAction` (`ReserveAction`)
y `sameAs`.

Solo con datos verificados. Sin `aggregateRating`. Sin horarios inventados.

## Títulos y descripciones

```
LongHorn San Isidro | Dirección, Carta y Reservas
LongHorn San Isidro: Calle Los Libertadores 302, San Isidro, Lima. Carta de
carnes y parrillas, cómo llegar y reserva de mesa online.
```

El patrón incluye el distrito y la ciudad, que es como se busca en local.

## Enlazado interno

- Portada → 3 locales destacados → directorio.
- Directorio → las 13 fichas.
- Cada ficha → otras 3 sedes (misma ciudad primero).
- Pie → directorio desde cualquier página.

Ninguna ficha queda huérfana.

## Lo que falta para competir en local

Esto **no depende del sitio web** y hay que decirlo con claridad:

1. **Perfil de Empresa en Google** de cada local, reclamado y actualizado, con:
   horarios reales, fotos, categoría «Restaurante de carnes», atributos y enlace
   a la ficha correspondiente de este sitio (no a la portada).
2. **Horarios publicados.** Es el dato más buscado y hoy no existe en ninguna
   fuente oficial. En cuanto se tengan, se cargan en `data/locales.ts` y se
   añade `openingHoursSpecification` al JSON-LD.
3. **Reseñas.** Las valoraciones de Google pesan mucho en el paquete local. No
   se pueden fabricar; se consiguen pidiéndolas en sala.
4. **Coordenadas de San Juan de Lurigancho**, para que aparezca en el mapa.
5. **Citaciones NAP** coherentes en directorios (centros comerciales,
   agregadores gastronómicos) usando exactamente el mismo nombre, dirección y
   teléfono que aquí.

Ver `docs/pendientes-cliente.md`.
