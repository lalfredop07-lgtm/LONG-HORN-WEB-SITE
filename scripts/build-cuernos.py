#!/usr/bin/env python3
"""
Convierte el símbolo oficial de los cuernos LongHorn en recursos web.

Partimos de RECURSOS/MARCA DE CUERNOS.png (blanco sobre transparente) y
generamos:
  · public/brand/cuernos-longhorn.svg   vector trazado del original
  · public/brand/cuernos-longhorn.png   PNG recortado y optimizado (respaldo)

IMPORTANTE: el símbolo NO se redibuja. El SVG es un trazado automático del
contorno real del archivo del cliente, por lo que conserva forma y
proporciones originales.

Requiere: pillow, potracer.
Uso: python3 scripts/build-cuernos.py
"""
from pathlib import Path

import numpy as np
import potrace
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "RECURSOS" / "MARCA DE CUERNOS.png"
DESTINO = RAIZ / "public" / "brand"

# Margen en píxeles que se deja alrededor del contenido al recortar.
MARGEN = 8


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)

    im = Image.open(ORIGEN).convert("RGBA")
    caja = im.getbbox()
    if caja is None:
        raise SystemExit("El archivo de cuernos está vacío.")

    # Recorte ajustado al contenido real, con un pequeño margen.
    x0, y0, x1, y1 = caja
    x0 = max(0, x0 - MARGEN)
    y0 = max(0, y0 - MARGEN)
    x1 = min(im.width, x1 + MARGEN)
    y1 = min(im.height, y1 + MARGEN)
    recorte = im.crop((x0, y0, x1, y1))
    ancho, alto = recorte.size
    print(f"recorte: {ancho}x{alto} (desde {im.size})")

    # --- PNG optimizado (respaldo y usos donde no convenga SVG) ---
    png = DESTINO / "cuernos-longhorn.png"
    recorte.save(png, optimize=True)
    print(f"  {png.name:28s} {png.stat().st_size / 1024:,.0f} KB")

    # --- Trazado vectorial del canal alfa ---
    alfa = np.array(recorte.getchannel("A"))
    simbolo = alfa > 128  # True donde hay símbolo

    # potracer trata como «tinta» los valores falsos del array, así que se
    # invierte la máscara para que trace el símbolo y no el fondo.
    # Comprobación: el símbolo es una mancha sólida, debe dar 1 contorno.
    bitmap = potrace.Bitmap(~simbolo)
    # turdsize elimina motas sueltas; alphamax suaviza las esquinas.
    camino = bitmap.trace(turdsize=6, alphamax=1.0, opticurve=True, opttolerance=0.2)

    partes: list[str] = []
    for curva in camino:
        inicio = curva.start_point
        d = [f"M{inicio.x:.2f},{inicio.y:.2f}"]
        for segmento in curva:
            fin = segmento.end_point
            if segmento.is_corner:
                c = segmento.c
                d.append(f"L{c.x:.2f},{c.y:.2f}L{fin.x:.2f},{fin.y:.2f}")
            else:
                c1, c2 = segmento.c1, segmento.c2
                d.append(
                    f"C{c1.x:.2f},{c1.y:.2f} {c2.x:.2f},{c2.y:.2f} {fin.x:.2f},{fin.y:.2f}"
                )
        d.append("Z")
        partes.append("".join(d))

    ruta = " ".join(partes)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ancho} {alto}" '
        f'fill="currentColor" role="img" aria-label="LongHorn">'
        f'<path fill-rule="evenodd" d="{ruta}"/></svg>'
    )

    destino_svg = DESTINO / "cuernos-longhorn.svg"
    destino_svg.write_text(svg, encoding="utf-8")
    print(f"  {destino_svg.name:28s} {destino_svg.stat().st_size / 1024:,.1f} KB"
          f"  ({len(partes)} contorno(s))")

    # Deja el `d` suelto para poder incrustarlo en componentes React.
    datos = RAIZ / "lib" / "cuernos-path.ts"
    datos.write_text(
        "// Generado por scripts/build-cuernos.py a partir del símbolo oficial\n"
        "// RECURSOS/MARCA DE CUERNOS.png. No editar a mano: regenerar el script.\n"
        f"export const CUERNOS_VIEWBOX = \"0 0 {ancho} {alto}\";\n"
        f"export const CUERNOS_PATH =\n  \"{ruta}\";\n",
        encoding="utf-8",
    )
    print(f"  {datos.name:28s} {datos.stat().st_size / 1024:,.1f} KB")


if __name__ == "__main__":
    main()
