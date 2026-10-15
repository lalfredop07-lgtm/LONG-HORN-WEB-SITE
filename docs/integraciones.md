# Integraciones

## 1. Mapa de locales (Leaflet + OpenStreetMap) — **operativo**

### Estado

**Funciona sin ninguna clave de API y sin facturación.** Probado en
escritorio, tablet y móvil, con pruebas automatizadas que verifican que las
teselas cargan y que los marcadores llevan el símbolo de la marca.

Se descartó Google Maps JavaScript API por decisión del cliente.

### Tecnología

| Pieza | Versión | Papel |
|---|---|---|
| `leaflet` | 1.9.4 | Motor del mapa |
| `react-leaflet` | 5.0.0 | Integración con React 19 |
| `@types/leaflet` | 1.9.22 | Tipos |

No se usa `leaflet.markercluster`: la agrupación está implementada a medida
(≈40 líneas) para controlar el aspecto de la pastilla y evitar 30 KB de
dependencia con estilos genéricos.

> **Licencia de react-leaflet:** Hippocratic 2.1, no es OSI pero es de uso
> gratuito y sin coste. No impone regalías ni restricciones relevantes para
> un restaurante. Conviene que el cliente lo sepa.

### Proveedores de teselas

| Vista | Proveedor | Clave | Atribución |
|---|---|---|---|
| **Mapa** | OpenStreetMap estándar | No | «© colaboradores de OpenStreetMap» |
| **Satélite** | Esri World Imagery | No | «Imágenes © Esri, Maxar, Earthstar Geographics» |

Ambas atribuciones se muestran siempre en el mapa, como exigen sus
licencias.

**Por qué no CARTO.** La primera implementación usaba CARTO Dark Matter por
su estética oscura, pero sus teselas ahora llegan con la marca de agua
«API KEY REQUIRED» impresa encima: ya no son gratuitas sin registro. Se
cambió a OpenStreetMap.

**Cómo se consigue el aspecto oscuro.** Las teselas de OpenStreetMap son
claras. Se invierten y se corrige el tono con un filtro CSS aplicado solo al
panel de teselas (`styles/mapa.css`), de modo que los marcadores rojos no se
ven afectados:

```css
filter: invert(1) hue-rotate(190deg) brightness(.66) contrast(1) saturate(.22) sepia(.4);
```

> **Volumen de uso.** La política de uso de teselas de OpenStreetMap admite
> tráfico moderado como el de este sitio, pero desaconseja usos intensivos.
> Si la web llegara a un volumen alto, lo razonable es contratar un
> proveedor de teselas (MapTiler, Mapbox, Stadia) y cambiar una única
> constante en `components/locations/MapaLeaflet.tsx`.

### Marcadores

Los pines usan el **símbolo oficial de los cuernos** entregado por el
cliente (`RECURSOS/MARCA DE CUERNOS.png`). No se ha redibujado: se vectorizó
con `scripts/build-cuernos.py`, que traza el contorno real del archivo y
genera `public/brand/cuernos-longhorn.svg` y el trazado incrustable
`lib/cuernos-path.ts`. La comparación superpuesta confirma que encaja pixel
a pixel con el original.

Cada marcador es una gota roja con los cuernos blancos encima, con tres
estados: normal, hover y seleccionado (más grande, rojo de marca, resplandor
y un pulso discreto que se desactiva con `prefers-reduced-motion`).

Para regenerarlos si cambia el archivo de marca:

```bash
python3 scripts/build-cuernos.py
```

### Qué hace el mapa

- Dibuja **los 13 locales**; los que caen muy juntos se funden en una
  pastilla con el número, que al pulsarla acerca a ese grupo.
- **Sincronizado con el listado** en ambos sentidos: elegir una tarjeta
  centra y resalta su marcador; tocar un marcador selecciona su tarjeta.
- **Buscador** por nombre, distrito, ciudad, dirección o centro comercial,
  insensible a tildes y mayúsculas.
- **Filtros** por ciudad y distrito, encadenados.
- Conmutador **Mapa / Satélite**.
- Encuadre inicial en **Lima** (9 de 13 sedes), con un botón para ver todo
  el país. Encuadrar el Perú entero de inicio dejaba las sedes de Lima
  amontonadas en un punto.
- **Gestos cooperativos**: en táctil hacen falta dos dedos para mover el
  mapa y con ratón Ctrl + rueda para el zoom, de modo que el mapa nunca
  secuestra el scroll de la página. Si alguien lo intenta con un dedo,
  aparece un aviso.

### Experiencia móvil

- Pestañas **Lista / Mapa** bien visibles.
- Filtros plegables tras un botón «Filtros» con contador, para que el mapa
  no quede empujado fuera de la pantalla.
- Al tocar un marcador aparece una ficha bajo el mapa, que además se acerca
  sola a la vista.
- La selección se conserva al cambiar de pestaña.
- El umbral de agrupación se adapta al ancho: con un valor fijo, un móvil
  acababa mostrando un único grupo con todas las sedes de Lima.

### Una trampa que conviene conocer

En móvil el mapa se monta dentro de la pestaña «Lista», oculta, así que su
contenedor mide 0 px. Encuadrarlo en ese estado produce coordenadas `NaN` y
**Leaflet lanza `Invalid LatLng object`, que tumba el componente entero**.
El código lo evita de dos formas: no calcula nada mientras el contenedor
mida cero, y vuelve a encuadrar cuando un `ResizeObserver` detecta que ya
tiene tamaño.

## 2. Reservas (mesa 24/7) — **operativo**

LongHorn gestiona sus reservas en mesa 24/7. **No se ha construido un sistema
de reservas propio ni se muestra ninguna confirmación falsa.**

Flujo implementado:

1. La persona entra en `/reservas` (o pulsa cualquier CTA de reserva).
2. Elige su local en un selector agrupado por ciudad.
3. La página dice explícitamente qué va a pasar: que el siguiente paso ocurre
   en el sistema oficial y que **la reserva solo queda confirmada cuando ese
   sistema lo indique**.
4. El botón abre el *deep link* del local en una pestaña nueva.

Los 12 enlaces están en `data/locales.ts` (`urlReservas`) y una prueba comprueba
que todos apunten a `longhorn.mesa247.pe/reservas/`.

**San Juan de Lurigancho** no tiene reserva online: su ficha lo dice y ofrece
WhatsApp.

### Integración más profunda

Un widget embebido o una API de disponibilidad requerirían credenciales
comerciales de mesa 24/7 a nombre de LongHorn. Si el cliente las consigue, el
componente `SelectorReserva` es el punto de entrada natural para sustituir la
redirección por un flujo embebido.

---

## 3. Pedidos / delivery — **operativo**

Enlace al sistema oficial `longhorn.mesa247.pe/pideonline/610`, presente en el
pie, en el menú móvil, en la carta, en reservas y en cada ficha de local.

También queda enlazada la página oficial de **zonas de reparto**.

No se ha integrado ningún conector con POS o pasarela de pago: haría falta
documentación y credenciales específicas.

---

## 4. Analítica (GA4) — **preparado, sin ID**

Ver `docs/analytics.md`.

Sin `NEXT_PUBLIC_GA_MEASUREMENT_ID` **no se carga ningún script de Google** y el
aviso de cookies no aparece, porque no habría cookies que consentir.

---

## 5. Formulario de contacto — **no implementado, a propósito**

LongHorn no publica ningún correo de contacto ni dispone de un servicio de
recepción de mensajes al que conectarse. Montar un formulario que dijera
«mensaje enviado» sin entregarlo a nadie habría sido peor que no tenerlo.

La página de contacto ofrece los canales que **sí** funcionan (WhatsApp,
central telefónica, pedidos, redes y los teléfonos de cada local) y explica la
ausencia.

Para activarlo hará falta: un buzón de destino y un servicio de envío (Resend,
Formspree, SendGrid…). Con eso, es trabajo de una tarde: formulario con
validación, estados de carga, manejo de errores de red y protección antispam.

---

## 6. Higgsfield API — **consumido**

Ver `docs/higgsfield-assets.md`.
