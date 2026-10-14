#!/usr/bin/env python3
"""
Genera la imagen Open Graph (1200x630) componiendo el póster del hero con
el logotipo oficial. El logotipo no se redibuja: solo se escala.

Uso: python3 scripts/build-og.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
ROJO = (252, 27, 43, 255)
CARBON = (21, 17, 15)


def recortar(img: Image.Image) -> Image.Image:
    objetivo = W / H
    actual = img.width / img.height
    if actual > objetivo:
        ancho = int(img.height * objetivo)
        izq = (img.width - ancho) // 2
        img = img.crop((izq, 0, izq + ancho, img.height))
    else:
        alto = int(img.width / objetivo)
        arr = (img.height - alto) // 2
        img = img.crop((0, arr, img.width, arr + alto))
    return img.resize((W, H), Image.LANCZOS)


def main() -> None:
    fondo = recortar(Image.open(ROOT / "public/videos/hero-parrilla-poster.webp").convert("RGB"))
    fondo = ImageEnhance.Brightness(fondo).enhance(0.58)
    lienzo = fondo.convert("RGBA")

    # Velo horizontal: casi opaco bajo el logotipo, transparente a la derecha.
    velo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(velo)
    for x in range(W):
        t = min(1.0, x / (W * 0.66))
        alpha = int(248 * (1 - t) ** 1.6)
        d.line([(x, 0), (x, H)], fill=CARBON + (alpha,))
    lienzo = Image.alpha_composite(lienzo, velo)

    # Viñeta inferior para asentar la composición.
    vineta = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dv = ImageDraw.Draw(vineta)
    for y in range(H):
        t = max(0.0, (y - H * 0.6) / (H * 0.4))
        dv.line([(0, y), (W, y)], fill=CARBON + (int(120 * t), ))
    lienzo = Image.alpha_composite(lienzo, vineta)

    logo = Image.open(ROOT / "public/brand/longhorn-logo.png").convert("RGBA")
    ancho = 460
    alto = round(logo.height * ancho / logo.width)
    logo = logo.resize((ancho, alto), Image.LANCZOS)
    x0, y0 = 78, (H - alto) // 2 - 26
    lienzo.alpha_composite(logo, (x0, y0))

    d2 = ImageDraw.Draw(lienzo)
    y = y0 + alto + 16
    d2.rectangle([x0, y, x0 + 104, y + 4], fill=ROJO)

    salida = ROOT / "public/og/longhorn-og.jpg"
    salida.parent.mkdir(parents=True, exist_ok=True)
    lienzo.convert("RGB").save(salida, quality=88, optimize=True)
    print(f"{salida.relative_to(ROOT)}  {W}x{H}  {salida.stat().st_size / 1024:,.0f} KB")


if __name__ == "__main__":
    main()
