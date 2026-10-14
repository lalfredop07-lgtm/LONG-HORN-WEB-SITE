#!/usr/bin/env python3
"""
Genera los derivados web del logotipo oficial de LongHorn a partir de
assets-fuente/LOGO.png.

IMPORTANTE: nunca redibuja ni recrea el logotipo. Solo recorta (trim de
transparencia), escala y cambia de formato conservando proporciones.

Uso:  python3 scripts/build-brand-assets.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-fuente" / "LOGO.png"
BRAND = ROOT / "public" / "brand"
APP = ROOT / "app"

# Geometría medida sobre el archivo original (1774x887 RGBA).
BULL_BBOX = (401, 103, 1372, 530)

# Rojo exacto muestreado del logotipo oficial.
BRAND_RED = (252, 27, 43)
BRAND_CHARCOAL = (21, 17, 15)


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)
    logo = Image.open(SRC).convert("RGBA")

    # 1. Logotipo completo, recortado a su contenido real.
    full = logo.crop(logo.getbbox())
    full.save(BRAND / "longhorn-logo.png", optimize=True)
    full.save(BRAND / "longhorn-logo.webp", quality=92, method=6)
    w, h = full.size
    print(f"logo completo      {w}x{h}")

    # 2. Isotipo (cabeza de toro) aislado, conservando transparencia.
    bull = logo.crop(BULL_BBOX)
    bull.save(BRAND / "longhorn-isotipo.png", optimize=True)
    bull.save(BRAND / "longhorn-isotipo.webp", quality=92, method=6)
    print(f"isotipo            {bull.size[0]}x{bull.size[1]}")

    # 3. Favicon e iconos: isotipo blanco sobre cuadrado carbón de marca.
    for size, name in ((512, "icon.png"), (180, "apple-icon.png")):
        canvas = Image.new("RGBA", (size, size), BRAND_CHARCOAL + (255,))
        inner = int(size * 0.90)
        scale = min(inner / bull.size[0], inner / bull.size[1])
        bw, bh = int(bull.size[0] * scale), int(bull.size[1] * scale)
        canvas.paste(
            bull.resize((bw, bh), Image.LANCZOS),
            ((size - bw) // 2, (size - bh) // 2),
            bull.resize((bw, bh), Image.LANCZOS),
        )
        canvas.convert("RGB").save(APP / name, optimize=True)
        print(f"{name:18s} {size}x{size}")

    # 4. Variante del logotipo sobre fondo claro para documentos/OG.
    light = Image.new("RGBA", full.size, (243, 234, 223, 255))
    light.alpha_composite(full)
    light.convert("RGB").save(BRAND / "longhorn-logo-sobre-marfil.png", optimize=True)
    print("variante marfil    ok")


if __name__ == "__main__":
    main()
