# Pendientes del cliente

Lo que necesitamos de LongHorn para cerrar el proyecto. Ordenado por impacto.

---

## 🔴 Bloquean el lanzamiento

### 1. ~~Clave de Google Maps Platform~~ — **resuelto**

Ya no hace falta. El mapa se reimplementó con **Leaflet + OpenStreetMap**:
funciona sin clave, sin facturación y sin coste. Ver `docs/integraciones.md`.

Lo único a tener en cuenta: la política de teselas de OpenStreetMap admite
tráfico moderado. Si el sitio creciera mucho, convendría contratar un
proveedor de teselas; es cambiar una constante.

### 2. Aprobación de los textos legales

**Por qué:** privacidad, cookies y términos están redactados como base técnica,
pero **no pueden publicarse sin revisión legal**. Hoy muestran un aviso visible
que lo advierte.

**Qué hace falta:**
- Razón social responsable del tratamiento de datos, **RUC** y domicilio fiscal.
- Revisión por la asesoría legal conforme a la Ley N.º 29733.
- Confirmar que el acceso al Libro de Reclamaciones por razón social es correcto.

Al aprobarse, poner `pendienteValidacion={false}` (ver `docs/mantenimiento.md`).

---

### 3. Dominio y accesos de despliegue

**Qué hace falta:** acceso a GitHub y Vercel de LongHorn, y control del DNS de
`longhornperu.com`.

> El dominio ya aloja la web actual. Hay que planificar el cambio y **conservar
> los registros MX** si el correo corporativo está en el mismo dominio.

---

## 🟡 Afectan a la calidad del contenido

### 4. Horarios de atención

**Por qué:** es el dato que más se busca de un restaurante y **LongHorn no lo
publica en ningún canal oficial**.

**Decisión tomada:** no inventarlos. Cada ficha remite al Google Maps del local.

**Qué hace falta:** horario semanal de los 13 locales, con sus excepciones
(feriados, horario de centro comercial). Formato en `docs/mantenimiento.md`.

**Impacto:** alto en SEO local. Habilita `openingHoursSpecification` en los
datos estructurados.

---

### 5. Carta de bebidas y cócteles

**Por qué:** la marca es «Grill & **Drinks**» y declara cócteles y vinos premium,
pero el PDF oficial de la carta **no incluye** bebidas, cervezas, vinos ni
postres.

**Decisión tomada:** no publicar ni un nombre ni un precio. La sección existe y
explica que la lista se consulta en el restaurante.

**Qué hace falta:** la carta de bebidas con nombres y precios. El sistema ya
está preparado.

---

### 6. Confirmar el local «Centro Cívico»

**Por qué:** aparece en directorios de terceros pero no en ningún canal oficial.
Publicarlo llevaría el total a 14 y contradiría los «13 locales» que declara la
marca.

**Pregunta concreta:** ¿sigue abierto el local del C.C. Real Plaza Centro
Cívico? Si sí, hace falta su dirección exacta, teléfono, coordenadas y enlace de
reserva. Si no, queda descartado y el recuento de 13 es correcto.

---

### 7. Afinar la ubicación de San Juan de Lurigancho

**Resuelto a medias.** Ya aparece en el mapa: sus coordenadas salen de
OpenStreetMap, que sitúa el **centro comercial** Mall Aventura SJL en
Av. Lurigancho 997 (Zárate) — la cuadra 9 que documenta Perú Retail.

**Qué falta:** el punto marca el edificio, no la unidad del 3.er nivel. Si
LongHorn facilita la coordenada exacta de la entrada del restaurante, se
sustituye en `data/locales.ts`. También sigue sin enlace de reserva online.

### 8. Fotografía de locales

**Por qué:** las tarjetas y fichas de local **no llevan foto**. No se ha
generado ninguna con IA porque presentar un edificio inventado como un
restaurante real sería engañar al cliente final.

**Qué hace falta:** fotografías autorizadas de fachadas e interiores, a ser
posible de los 13 locales. Con ellas, las tarjetas y las fichas del mapa
ganan mucho.

**Mientras tanto:** las tarjetas usan la **fotografía gastronómica oficial**
de LongHorn, extraída de su carta. Es material de marca auténtico y el texto
alternativo describe el plato, nunca el local, para no dar a entender que es
una foto del establecimiento. Basta con cambiar el campo `imagen` de cada
local en `data/locales.ts`.

---

## 🟢 Mejoras

### 9. Google Analytics 4

Measurement ID (`G-XXXXXXXXXX`). Sin él no se carga analítica ni aparece el
aviso de cookies. Ver `docs/analytics.md`.

### 10. Google Search Console

Acceso para verificar el dominio, enviar el sitemap y vigilar la cobertura.
Pasos en `docs/seo.md`.

### 11. Correo de contacto

LongHorn no publica ninguno, así que **no hay formulario de contacto**: un
formulario que no entrega el mensaje a nadie es peor que no tenerlo. Con un
buzón de destino, se implementa en una tarde.

### 12. Perfiles de Empresa en Google

No es trabajo de la web, pero es lo que más mueve el SEO local: reclamar y
actualizar la ficha de cada local, con horarios, fotos y enlace a su página
específica de este sitio. Ver `docs/seo-local.md`.

### 13. Revisión en Safari / iPhone real

Las pruebas se ejecutaron sobre Chromium: la máquina de desarrollo (macOS 12) no
admite los binarios de WebKit de Playwright. Conviene una pasada manual en un
iPhone real antes de publicar. Detalle en `docs/pruebas.md`.

---

## Decisiones tomadas que conviene ratificar

| Decisión | Motivo |
|---|---|
| Rojo de marca `#FC1B2B` | Muestreado del logotipo real, no el `#C62828` provisional del briefing |
| 13 locales | 12 reservables + SJL, cuadra con la cifra oficial |
| Sin fotos de fachadas | No generar edificios con IA y presentarlos como reales |
| Sin bebidas en la carta | No hay fuente oficial verificable |
| Sin horarios | No hay fuente oficial verificable |
| Sin formulario de contacto | No hay buzón de destino real |
| Sin valoraciones en JSON-LD | No existen reseñas propias; inventarlas es sancionable |
| Reservas por redirección | LongHorn usa mesa 24/7; no se construye un sistema paralelo |
