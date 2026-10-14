# Integraciones

## 1. Google Maps Platform — **pendiente de clave**

### Estado

La implementación está **completa y escrita**, pero **no se ha podido probar
contra la API real** porque no hay clave disponible. No se declara operativa.

Lo que sí está probado: el comportamiento **sin** clave, que es el que verá
cualquiera hasta que se configure.

### Cómo activarlo

1. Crear un proyecto en [Google Cloud Console](https://console.cloud.google.com/).
2. Habilitar **Maps JavaScript API**. (Places y Geocoding **no** hacen falta:
   las coordenadas ya están en los datos.)
3. Crear una **clave de API** del tipo «clave de navegador».
4. **Restringirla**, que es el paso que no se puede saltar:
   - *Restricciones de aplicación* → **Sitios web**, con los referentes:
     ```
     https://longhornperu.com/*
     https://www.longhornperu.com/*
     https://*.vercel.app/*        (solo mientras se usen previews)
     ```
   - *Restricciones de API* → **solo Maps JavaScript API**.
5. Activar la facturación y poner una **alerta de presupuesto** (p. ej. 50 USD)
   y una cuota diaria de peticiones.
6. Añadir en Vercel la variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` y volver a
   desplegar.

> La clave de Maps es **pública por diseño**: viaja en el HTML. Lo que impide su
> abuso es la restricción por referente, no el secreto. Por eso el paso 4 es
> obligatorio.

### Map ID (opcional)

Con `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` se usa un estilo gestionado desde la nube
de Google. Sin él, se aplica el estilo LongHorn declarado en el código
(`ESTILO_LONGHORN` en `components/locations/MapaLocales.tsx`): maderas, carbón y
ámbar, sin puntos de interés que compitan con los restaurantes.

### Qué hace el mapa

- Dibuja **solo** los locales con coordenadas oficiales verificadas (12 de 13).
- Marcadores personalizados con la cabeza de toro del logotipo, en SVG, con
  estado activo en rojo de marca.
- Ajuste automático de encuadre a todos los marcadores.
- **Sincronizado con el listado**: al elegir una sede en la lista el mapa centra
  y resalta su marcador, y al tocar un marcador se selecciona en la lista.
- `gestureHandling: "cooperative"`, para que el mapa **no secuestre el scroll**
  de la página en móvil.
- Se carga con `next/dynamic` y `ssr: false`: su JavaScript no se descarga en
  ninguna otra página.

### Si no hay clave o Maps falla

El componente `MapaNoDisponible` ocupa su lugar y explica la situación sin
fingir ser un mapa. El directorio sigue completo: filtros, direcciones,
teléfonos, «Cómo llegar», «Ver local» y «Reservar» funcionan igual.

Hay una prueba que lo verifica: *«sin clave de Google Maps el directorio sigue
siendo utilizable»*.

---

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
