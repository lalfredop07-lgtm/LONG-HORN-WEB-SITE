# Analítica y medición

## Estado

**Preparado, sin activar.** No hay Measurement ID de GA4, y no se ha inventado
ninguno. Sin la variable configurada, **no se descarga ni un byte de Google**, y
el aviso de cookies no aparece —no habría cookies que consentir—.

## Activación

1. Crear una propiedad GA4 para `longhornperu.com`.
2. Copiar el *Measurement ID* (formato `G-XXXXXXXXXX`).
3. Añadirlo en Vercel como `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
4. Volver a desplegar (es una variable de build).

El código valida el formato con `/^G-[A-Z0-9]+$/i`: un valor mal escrito no
carga nada en vez de fallar en silencio.

## Consentimiento primero

El orden es el correcto: **sin aceptación, no hay script**.

1. Si hay GA configurado y no hay respuesta previa, aparece el aviso.
2. «Rechazar» y «Aceptar» tienen el mismo peso visual y el mismo tamaño.
3. Solo al aceptar se inyecta `gtag.js`.
4. La respuesta se guarda en `localStorage` (no es una cookie).
5. Se inicializa con `ad_storage`, `ad_user_data` y `ad_personalization`
   denegados, y `anonymize_ip: true`.

Si se rechaza, **el sitio funciona exactamente igual**. No hay muro, ni
degradación, ni insistencia.

## Eventos

Definidos en un único sitio (`lib/analitica.ts`) para que no se dupliquen ni se
escriban de dos formas distintas:

| Evento | Cuándo | Parámetros |
|---|---|---|
| `ver_carta` | Clic en cualquier enlace a la carta | `origen` |
| `cambiar_categoria_carta` | Cambio de categoría en la carta | `categoria` |
| `seleccionar_local` | Selección de un local | `local` |
| `clic_reservar` | Clic en cualquier CTA de reserva | `origen` |
| `clic_como_llegar` | Clic en «Cómo llegar» | — |
| `clic_delivery` | Clic en pedidos online | — |
| `clic_telefono` | Clic en un `tel:` | — |
| `clic_whatsapp` | Clic en WhatsApp | — |
| `usar_buscador_locales` | Uso de los filtros | `ciudad` |

### Cómo se recogen

Mediante **un solo listener delegado** en `document`
(`components/analytics/RegistroEventos.tsx`), que deduce el evento a partir del
destino del enlace. Ventajas: no hay `onClick` repartidos por decenas de
componentes, no se pueden duplicar eventos, y añadir un CTA nuevo no exige
acordarse de instrumentarlo.

### Privacidad

No se envía ningún dato personal: solo nombre de evento y parámetros de
contexto (local, categoría, página de origen). No se registran búsquedas libres,
ni correos, ni teléfonos.

## Qué mirar una vez activo

Para un restaurante, las métricas que importan:

1. **Clics en «Reservar mesa»** por página de origen → mide si el CTA funciona.
2. **`ver_carta`** → la carta es el contenido más consultado de un restaurante.
3. **`seleccionar_local`** → qué sedes se buscan más, útil para marketing local.
4. **`clic_como_llegar` y `clic_telefono`** → intención de visita real.
5. **Móvil vs escritorio** → esperable un fuerte sesgo móvil.

Conviene marcar `clic_reservar`, `clic_delivery` y `clic_telefono` como
**conversiones** en GA4.
