#!/usr/bin/env python3
"""
Genera el fondo desenfocado de la cabecera de /locales.

El desenfoque se hornea en el archivo en lugar de aplicarse con
`filter: blur()` en CSS porque:
  · una imagen desenfocada comprime muchísimo mejor (menos bytes), y
  · desenfocar en CSS un elemento a pantalla completa es costoso en
    móviles, mientras que servirla ya difuminada no cuesta nada.

El oscurecimiento sí se deja en CSS, para poder ajustarlo sin regenerar.

Uso: python3 scripts/build-fondo-locales.py
"""
from pathlib import Path

from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "assets-generados" / "interior-restaurante.png"
DESTINO = RAIZ / "public" / "images" / "marca" / "interior-locales.webp"

ANCHO = 1600
DESENFOQUE = 9  # radio gaussiano sobre el ancho final


def main() -> None:
    im = Image.open(ORIGEN).convert("RGB")
    alto = round(im.height * ANCHO / im.width)
    im = im.resize((ANCHO, alto), Image.LANCZOS)
    im = im.filter(ImageFilter.GaussianBlur(radius=DESENFOQUE))

    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    # Calidad baja a propósito: sobre una imagen difuminada no se aprecia.
    im.save(DESTINO, quality=68, method=6)
    print(f"{DESTINO.relative_to(RAIZ)}  {im.size[0]}x{im.size[1]}  "
          f"{DESTINO.stat().st_size / 1024:,.0f} KB")


if __name__ == "__main__":
    main()
