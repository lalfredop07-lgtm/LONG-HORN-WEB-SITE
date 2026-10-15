# Investigación — LongHorn Grill & Drinks Perú

> Documento de trabajo. Recoge todo lo que se ha podido **verificar** sobre la
> marca antes de construir el sitio, con su fuente y su fecha de consulta.
> Todo dato publicado en la web procede de aquí.
>
> **Fecha de la investigación: 14 de octubre de 2026.**

---

## 1. Resumen ejecutivo

| Dato | Valor | Estado |
|---|---|---|
| Nombre comercial | LongHorn Grill & Drinks | Verificado |
| Año de fundación | 2001 | Verificado |
| Primer local | Jockey Plaza (Santiago de Surco, Lima) | Verificado |
| Sede corporativa | Santiago de Surco, Lima | Verificado |
| Plantilla | 501–1 000 personas | Verificado (autodeclarado) |
| Locales declarados | 13 a nivel nacional | Verificado |
| Locales con reserva online | 12 | Verificado |
| Referencias en la carta | 103 platos | Verificado |
| Horarios de atención | — | **No disponible** |

---

## 2. Fuentes consultadas

| # | Fuente | URL | Consultada | Confianza |
|---|---|---|---|---|
| 1 | Web oficial LongHorn Perú | https://longhornperu.com/ | 14-10-2026 | Alta |
| 2 | Sistema oficial de reservas (mesa 24/7) | https://longhorn.mesa247.pe/ | 14-10-2026 | Alta |
| 3 | Carta Lima Moderna (PDF oficial) | https://cdn.mesa247.io/archivos/ficheros/610/1774556599.pdf | 14-10-2026 | Alta |
| 4 | Carta digital (flipbook) | https://www.longhorn.com.pe/CartaDigital/01/mobile/index.html | 14-10-2026 | Alta |
| 5 | Catálogo de experiencias | https://longhorn.mesa247.pe/experiencias/ | 14-10-2026 | Alta |
| 6 | Pedidos online | https://longhorn.mesa247.pe/pideonline/610 | 14-10-2026 | Alta |
| 7 | LinkedIn corporativo | https://pe.linkedin.com/company/longhorn-grill-peru | 14-10-2026 | Media |
| 8 | Gestión — expansión LongHorn | https://gestion.pe/economia/empresas/longhorn-replantea-expansion-de-restaurantes-y-apuesta-por-canal-digital-longhorn-parrilla-restaurante-noticia/ | 14-10-2026 (art. 15-12-2020) | Media |
| 9 | Perú Retail — apertura SJL | https://www.peru-retail.com/longhorn-inaugura-su-primer-restaurante-en-san-juan-de-lurigancho-y-suma-12-locales-en-peru/ | 14-10-2026 (art. 17-02-2024) | Media |
| 10 | Instagram oficial | https://www.instagram.com/longhornperuoficial/ | 14-10-2026 | Media |
| 11 | Facebook oficial | https://www.facebook.com/LongHorn.Peru/ | 14-10-2026 | Media |

### Hallazgo sobre la web oficial

El enlace «Locales» de `longhornperu.com` **no lleva a una página de locales**:
es un acortador (`bit.ly/LongHornLOCALES`) que redirige a una búsqueda genérica
de Google. La marca no publica hoy un directorio propio de restaurantes. Es una
de las carencias que este proyecto resuelve.

---

## 3. Historia y posicionamiento

**Verificado.** LongHorn nace en **2001** (LinkedIn corporativo). La prensa
económica sitúa el primer local en el **Jockey Plaza**, abierto por **tres
socios** («hace 20 años» en un artículo de diciembre de 2020).

El nombre remite a la raza bovina *Texas Longhorn*, de cuernos largos, que
protagoniza el logotipo. De ahí la dirección artística western de la marca.

Descripción oficial, transcrita literalmente del sistema de reservas:

> «En LongHorn somos un restaurante de carnes, pastas y cócteles con 13 locales
> a nivel nacional, enfocados en brindar una experiencia gastronómica de
> calidad.»

Descripción corporativa en LinkedIn:

> «¡Bienvenidos LongHorn Perú! Transpórtate a un mundo sabores donde se
> fusionan nuestras carnes y pastas con los mejores vinos y cócteles, en un
> ambiente agradable de buen comer y beber, que te llevarán al máximo placer y
> disfrutar de una deliciosa experiencia.»

Especialidades declaradas: parrillas, pasta, cócteles, piqueos, cortes de carne
y **vinos premium**.

### Evolución de la red

| Momento | Locales | Fuente |
|---|---|---|
| Diciembre 2020 | 11 | Gestión |
| Febrero 2024 | 12 (apertura de SJL) | Perú Retail |
| Octubre 2026 | 13 declarados | Web oficial / reservas |

Planes de expansión anunciados en 2020 y su estado entonces: La Molina
(retrasado), Miraflores (suspendido), Cusco (descartado), Arequipa (en pausa).
**No hay confirmación de que ninguno se haya materializado**; no se mencionan en
el sitio.

---

## 4. Conciliación del número de locales ⚠️

Este fue el punto que más contradicciones presentaba. Resolución:

- La web oficial dice **13 locales a nivel nacional**.
- El selector del sistema de reservas lista **12 locales** reservables online.
- Perú Retail documenta el local de **Mall Aventura San Juan de Lurigancho**
  (febrero 2024), que **no aparece** en el selector de reservas.

**12 reservables + San Juan de Lurigancho = 13.** La cifra cuadra con la
declaración oficial, y es la que publica el sitio.

### Local descartado: «Centro Cívico»

Aparece en directorios de terceros alimentados por usuarios (con dirección en
Av. Garcilaso de la Vega 1337 y teléfono 934 086 966), pero **no figura** en la
web oficial, ni en el sistema de reservas, ni en el de pedidos. Incluirlo
elevaría el total a 14 y contradiría la cifra de la propia marca.

**Decisión: no se publica.** Pendiente de confirmación por el cliente
(ver `docs/pendientes-cliente.md`).

---

## 5. Locales verificados

Los 12 locales del sistema de reservas publican un bloque **JSON-LD
Schema.org `Restaurant`** con dirección, teléfono, código postal y coordenadas.
Ese es el origen de los datos del directorio: son datos oficiales estructurados,
no estimaciones.

| Local | Distrito | Ciudad | Coordenadas | Reserva online |
|---|---|---|---|---|
| Jockey Plaza | Santiago de Surco | Lima | −12.086962, −76.978994 | Sí |
| San Isidro | San Isidro | Lima | −12.101014, −77.037522 | Sí |
| Real Plaza Salaverry | Jesús María | Lima | −12.092962, −77.052748 | Sí |
| San Borja | San Borja | Lima | −12.090723, −77.004952 | Sí |
| Plaza San Miguel | San Miguel | Lima | −12.076948, −77.082804 | Sí |
| Mall Aventura Santa Anita | Santa Anita | Lima | −12.056415, −76.970807 | Sí |
| Real Plaza Puruchuco | Ate | Lima | −12.040900, −76.932057 | Sí |
| Mega Plaza | Independencia | Lima | −11.995609, −77.061335 | Sí |
| Chiclayo | Chiclayo | Lambayeque | −6.778215, −79.851170 | Sí |
| Real Plaza Piura | Piura | Piura | −5.186264, −80.642388 | Sí |
| Real Plaza Cajamarca | Cajamarca | Cajamarca | −7.154598, −78.505138 | Sí |
| Real Plaza Huancayo | Huancayo | Junín | −12.066589, −75.205596 | Sí |
| Mall Aventura SJL | San Juan de Lurigancho | Lima | *(sin verificar)* | No |

### Incidencias detectadas en los datos oficiales

1. **Huancayo**: el JSON-LD declara la localidad como «Tarma». Las coordenadas
   publicadas (−12,0666 / −75,2056) y la dirección (Av. Ferrocarril 1035, Real
   Plaza) corresponden inequívocamente a **Huancayo, Junín**. Se corrigió la
   localidad y se mantuvieron las coordenadas oficiales.
2. **Chiclayo**: el JSON-LD no incluye teléfono.
3. **Mega Plaza**: el JSON-LD no incluye código postal.
4. **San Juan de Lurigancho**: LongHorn no publica coordenadas. Las del mapa
   (*) proceden de **OpenStreetMap**, que sitúa el centro comercial Mall
   Aventura SJL en Av. Lurigancho 997, Zárate —coherente con la «cuadra 9»
   que documenta Perú Retail—. Marcan el edificio, no la unidad del 3.er
   nivel; queda anotado en la ficha del local.

### Razones sociales

Del Libro de Reclamaciones oficial se obtienen las empresas operadoras:

LONGHORN GRILL S.A.C. · L.H. FOOD S.A.C. · L.H. SALAVERRY S.A.C. ·
L.H. SAN BORJA S.A.C. · L.H. SAN MIGUEL S.A.C. · L.H. SANTA ANITA S.A.C. ·
L.H. HUANCAYO S.A.C. · LH CAJAMARCA S.A.C. · ZPM CHICLAYO S.A.C.

---

## 6. Carta

Fuente: **PDF oficial «Carta Lima Moderna»** distribuido por mesa 24/7, 10
páginas en A3 apaisado (20 páginas de carta). El texto está vectorizado, sin
capa de texto seleccionable, por lo que se transcribió página a página.

**103 referencias** distribuidas así:

| Categoría | Platos |
|---|---|
| Piqueos | 20 |
| Ensaladas | 6 |
| Pastas | 11 |
| Grill LongHorn — Americana Premium | 6 |
| Grill LongHorn — Cortes Selectos | 5 |
| Grill LongHorn — Argentina Premium | 2 |
| Grill LongHorn — Nuestros Clásicos | 4 |
| Más del Grill | 11 |
| Especialidades | 12 |
| Saltados | 5 |
| Carne y Pasta | 5 |
| Guarniciones | 10 |
| Menú Kids | 6 |
| **Total** | **103** |

Aviso legal al pie de cada página, transcrito literalmente:

> «Derecho de pan y mantequilla S/ 3.00 por persona. Precios en soles incluyen
> I.G.V. y servicio. (No aplica delivery y recojo)»

Rango de precios: **S/ 15 – S/ 255**.

### Categorías sin fuente verificable ⚠️

El documento oficial **no incluye** bebidas, cócteles, cervezas, vinos ni
postres, pese a que la marca se llama «Grill & Drinks» y declara cócteles y
vinos premium entre sus especialidades.

**Decisión: no se publica ninguna bebida con nombre o precio.** La sección
existe en la carta del sitio y explica que la lista se consulta en el
restaurante. Ver `docs/carta-fuentes.md`.

### Fotografía

El PDF incluye **10 fotografías gastronómicas profesionales** de la propia
marca. Se extrajeron y optimizaron para la web: son material auténtico de
LongHorn, no imágenes generadas.

---

## 7. Canales comerciales

| Canal | Enlace | Estado |
|---|---|---|
| Reservas | `longhorn.mesa247.pe/reservas/<local>` | Operativo, 12 locales |
| Pedidos (delivery y recojo) | `longhorn.mesa247.pe/pideonline/610` | Operativo |
| Zonas de reparto | `longhorn.mesa247.pe/pideonline/1447/delivery-zones` | Operativo |
| Experiencias | `longhorn.mesa247.pe/experiencias/` | Operativo |
| WhatsApp | +51 945 186 438 | Verificado |
| Central telefónica | 01 421 3916 | Verificado |

**No existe** un correo electrónico de contacto publicado, ni formulario propio.

### Experiencias gastronómicas

El catálogo oficial mostraba 6 publicaciones activas el 14-10-2026, todas de
**«Sabores LongHorn»**, a **S/ 215**, en seis locales: Jockey Plaza, San Isidro,
Salaverry, San Borja, San Miguel y Santa Anita. Filtro declarado:
«Experiencia para dos».

---

## 8. Identidad visual

Del archivo `LOGO.png` entregado por el cliente (1774 × 887, RGBA con
transparencia) se muestrearon los colores reales:

- **Rojo corporativo: `#FC1B2B`** (no `#C62828`, que era el valor provisional
  del briefing).
- Blanco del isotipo y del «Grill & Drinks»: `#FDFDFD`.

El detalle completo está en `docs/identidad-visual.md`.

---

## 9. Qué NO se pudo verificar

| Dato | Motivo | Impacto |
|---|---|---|
| Horarios de atención | No publicados en ningún canal oficial | La ficha de cada local remite a su Google Maps |
| Carta de bebidas | No incluida en el PDF oficial | Sección informativa, sin platos inventados |
| Coordenadas exactas de SJL | LongHorn no las publica | El mapa usa el punto del centro comercial (OpenStreetMap) |
| Correo de contacto | No publicado | Sin formulario de contacto |
| Datos fiscales (RUC, domicilio) | No publicados | Textos legales pendientes de aprobación |
| Estado del local «Centro Cívico» | Fuentes contradictorias | No publicado |
| Fotografías de interiores y fachadas | Sin material autorizado | Tarjetas de local tipográficas, sin fachadas inventadas |

Todos estos puntos están recogidos como tareas para el cliente en
`docs/pendientes-cliente.md`.
