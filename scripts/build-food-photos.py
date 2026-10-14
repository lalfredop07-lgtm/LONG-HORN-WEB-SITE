#!/usr/bin/env python3
"""
Extrae la fotografía gastronómica OFICIAL de la carta PDF de LongHorn
(Carta Lima Moderna) y genera versiones optimizadas para web.

Fuente: https://cdn.mesa247.io/archivos/ficheros/610/1774556599.pdf
Las fotos son material de marca real: NO son imágenes generadas por IA.

Requiere: pymupdf, pillow.  Uso: python3 scripts/build-food-photos.py <ruta-carta.pdf>
"""
import sys
from pathlib import Path

import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "carta"

# página del PDF (1-indexada) -> nombre de archivo del plato fotografiado
PHOTOS = {
    2: "alitas-de-pollo",
    3: "ensalada-quinua-longhorn",
    4: "fettuccini-lomo-funghi",
    5: "bife-angosto",
    6: "colita-de-cuadril",
    7: "parrilla-para-2",
    8: "costillas-longhorn-bbq",
    9: "apanado-lomo-pesto",
    10: "legumbres-a-la-parrilla",
}
COVER_PAGE = 1  # mitad derecha: corte a la parrilla de portada

# El PDF incrusta las fotos a ~596x841 px. Renderizamos a 150 dpi (~1240x1754),
# un reescalado suave que da densidad suficiente para pantallas retina sin
# inventar detalle.
DPI = 150


def render_half(page: fitz.Page, side: str) -> Image.Image:
    r = page.rect
    if side == "left":
        clip = fitz.Rect(r.x0, r.y0, r.x0 + r.width / 2, r.y1)
    else:
        clip = fitz.Rect(r.x0 + r.width / 2, r.y0, r.x1, r.y1)
    pix = page.get_pixmap(dpi=DPI, clip=clip)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def save(img: Image.Image, name: str) -> None:
    img.save(OUT / f"{name}.webp", quality=84, method=6)
    print(f"  {name}.webp  {img.size[0]}x{img.size[1]}")


def main() -> None:
    pdf = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "assets-fuente" / "carta.pdf"
    OUT.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf)
    for page_no, name in PHOTOS.items():
        save(render_half(doc[page_no - 1], "left"), name)
    save(render_half(doc[COVER_PAGE - 1], "right"), "portada-corte-parrilla")
    print(f"\n{len(PHOTOS) + 1} fotografías oficiales generadas en {OUT}")


if __name__ == "__main__":
    main()
