# Identidad visual

## 1. El logotipo

**Archivo original:** `assets-fuente/LOGO.png` (1774 × 887 px, RGBA con
transparencia).

El logotipo entregado por el cliente es el único que se usa en todo el sitio.
**No se ha recreado, redibujado ni reinterpretado** en ningún momento, ni con
IA ni a mano. Los derivados se generan por recorte y escalado con
`scripts/build-brand-assets.py`, que es reproducible:

```bash
python3 scripts/build-brand-assets.py
```

| Archivo generado | Qué es | Uso |
|---|---|---|
| `public/brand/longhorn-logo.png` | Lockup completo recortado a su contenido (1717 × 864) | Cabecera, pie, OG |
| `public/brand/longhorn-logo.webp` | Mismo lockup en WebP | Alternativa ligera |
| `public/brand/longhorn-isotipo.png` | Cabeza de toro aislada (971 × 427) | Ornamentos, marcadores del mapa |
| `public/brand/longhorn-isotipo.webp` | Isotipo en WebP | Idem |
| `public/brand/longhorn-logo-sobre-marfil.png` | Lockup sobre fondo marfil | Documentos y fondos claros |
| `app/icon.png` | Favicon 512 × 512 | Pestaña del navegador |
| `app/apple-icon.png` | Icono 180 × 180 | iOS |

El favicon es el **isotipo real** recortado del logotipo sobre el carbón de
marca. No es un dibujo nuevo.

### Reglas de uso

- Se escala, nunca se deforma: la proporción 1717 : 864 está fijada en el
  componente `components/ui/Logo.tsx`.
- No se recolorea, ni se le aplican filtros, sombras o contornos.
- Se usa siempre sobre fondos oscuros o fotografía oscurecida, que es donde la
  versión blanca del isotipo funciona.

---

## 2. Color

### Rojo corporativo

El briefing proponía `#C62828` como valor provisional y pedía validarlo contra
los activos originales. Al muestrear el PNG oficial, el rojo real resultó ser
notablemente más saturado:

| | Valor | Origen |
|---|---|---|
| Rojo real del logotipo | **`#FC1B2B`** | Muestreado del archivo del cliente |
| Valor provisional del briefing | `#C62828` | Descartado |

### Paleta

```
Rojo de marca       #FC1B2B   logotipo, acentos tipográficos, detalles
Rojo de acción      #D01424   fondos de botón con texto blanco (AA 5,5:1)
Rojo profundo       #8E0C18   estados hover/activo
Brasa               #FF5A3C   resplandores y degradados de fuego

Carbón              #15110F   fondo general
Carbón 800          #1F1916   tarjetas y bloques
Carbón 700          #2A211C   bordes y elevaciones

Madera 900          #241711   secciones oscuras de madera
Madera 800          #352217   paneles de madera
Madera 700          #452C1D
Madera 600          #503323   bordes
Madera 500          #614029
Madera 400          #755034   madera media
Madera 300          #98704B   madera clara
Madera 200          #B89273

Marfil              #F3EADF   texto principal
Marfil suave        #E4D7C7
Ámbar               #C0803D   acentos cálidos (solo elementos grandes)
Ámbar claro         #E0A85F   antetítulos y texto de apoyo
Cuero               #7A4A2B
```

### Por qué hay dos rojos

`#FC1B2B` es el rojo de la marca y se usa tal cual en el wordmark, en los
acentos tipográficos y en los detalles finos. Pero como **fondo de botón con
texto blanco solo alcanza 3,9:1**, por debajo del 4,5:1 que exige WCAG AA para
texto normal.

Por eso los botones usan `#D01424`, una versión oscurecida que **conserva el
tono** y alcanza **5,5:1** con blanco. Visualmente se lee como el mismo rojo;
técnicamente, cumple.

### Distribución de color

El objetivo del briefing era ~45 % madera, 25 % fotografía, 20 % carbón,
7 % marfil y 3 % rojo. La implementación sigue ese reparto:

- Secciones sobre madera: carta (portada), cortes, locales, hitos de historia,
  pie, y las secciones impares de la página de carta.
- Secciones sobre carbón: hero, historia, bebidas, experiencias, legales.
- Fotografía a sangre: hero, «hechos para compartir», CTA final.
- El rojo aparece como acento: una palabra por titular, los botones primarios,
  los filetes y los estados activos. Nunca como fondo de sección.

---

## 3. Tipografía

| Rol | Familia | Por qué |
|---|---|---|
| Editorial / display | **Bodoni Moda** | Alto contraste, carácter de carta impresa. Da la elegancia que pedía la referencia sin recurrir a una tipografía western de cartel. |
| Funcional / interfaz | **Inter** | Legibilidad excelente en móvil, que es donde se lee la carta. |

Ambas se auto-alojan con `next/font/google`: **no hay ninguna petición a
Google Fonts en tiempo de ejecución**, lo que además simplifica la CSP.

De Bodoni Moda se carga **solo el peso 400 en redonda**. La cursiva y los pesos
intermedios añadían unos 45 KB de fuente que el diseño nunca llegaba a pintar.

### Escala fluida

Un único token por tamaño, con `clamp()`, válido de 320 px a 2560 px sin
*media queries*:

```css
--text-display-xl: clamp(3rem,     1.6rem  + 7vw,   8.5rem);  /* hero */
--text-display-lg: clamp(2.5rem,   1.4rem  + 5.2vw, 6rem);    /* titulares */
--text-display-md: clamp(2rem,     1.25rem + 3.4vw, 4rem);
--text-display-sm: clamp(1.625rem, 1.15rem + 2.1vw, 2.75rem);
--text-titulo:     clamp(1.375rem, 1.1rem  + 1.2vw, 1.875rem);
--text-cuerpo-lg:  clamp(1.0625rem,1rem    + 0.35vw,1.25rem);
--text-cuerpo:     clamp(1rem,     0.97rem + 0.15vw,1.0625rem);
--text-apunte:     clamp(0.8125rem,0.79rem + 0.1vw, 0.875rem);
```

El detalle western discreto está en los **antetítulos**: versales con
`letter-spacing: 0.22em`, que evocan la rotulación clásica sin usar una
tipografía temática.

---

## 4. Texturas

La referencia repetía la misma fotografía de madera en varias secciones. Aquí
la madera se construye con **degradados CSS** (`veta-madera`), lo que permite:

- variar el tono por sección sin cargar imágenes nuevas,
- cero bytes adicionales,
- y que no se note la repetición de un mismo archivo.

Se alterna con fondos planos de carbón, fotografía a sangre y paneles limpios,
de modo que ninguna textura domine el recorrido.

El resplandor de brasa (`resplandor-brasa`) es también CSS: un degradado radial
cálido que aparece en las transiciones entre secciones y acompaña al hilo
narrativo del fuego.

---

## 5. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--ease-lh` | `cubic-bezier(0.22, 1, 0.36, 1)` | Transiciones generales |
| `--ease-lh-entrada` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas de contenido |
| `--duracion-rapida` | 180 ms | Hover, foco |
| `--duracion-media` | 420 ms | Cambios de estado |
| `--duracion-lenta` | 820 ms | Revelados |

Solo se animan `opacity` y `transform`. Ninguna animación provoca
recálculo de layout, y de ahí el CLS de 0 en todas las páginas medidas.

Ver `docs/accesibilidad.md` para el comportamiento con movimiento reducido.
