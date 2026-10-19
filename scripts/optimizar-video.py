#!/usr/bin/env python3
"""
Convierte un vídeo original (pesado) en los derivados que sirve la web.

Genera, para cada origen:
  · <nombre>.mp4         H.264 para escritorio/tablet
  · <nombre>-movil.mp4   versión ligera para móvil
  · <nombre>-poster.webp fotograma de póster (es el LCP del hero)

Requiere imageio-ffmpeg (trae un binario estático de ffmpeg):
    python3 -m pip install --user imageio-ffmpeg

Uso: python3 scripts/optimizar-video.py <origen.mp4> <nombre-destino>
"""
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
VIDEOS = ROOT / "public" / "videos"
FF = imageio_ffmpeg.get_ffmpeg_exe()

PERFILES = [
    # (sufijo, ancho, crf, preset)
    #
    # El perfil móvil es deliberadamente agresivo: el vídeo compite por el
    # ancho de banda con la imagen LCP del hero. A 720 px y CRF 32 el clip
    # pesa menos de 200 KB y, a pantalla completa sobre un degradado, la
    # diferencia visual no se aprecia.
    ("", 1600, 27, "slower"),
    ("-movil", 720, 32, "slower"),
]


def ejecutar(args: list[str]) -> None:
    resultado = subprocess.run(args, capture_output=True, text=True)
    if resultado.returncode != 0:
        sys.exit(f"ffmpeg falló:\n{resultado.stderr[-1500:]}")


def main() -> None:
    origen = Path(sys.argv[1])
    nombre = sys.argv[2]
    VIDEOS.mkdir(parents=True, exist_ok=True)

    for sufijo, ancho, crf, preset in PERFILES:
        destino = VIDEOS / f"{nombre}{sufijo}.mp4"
        ejecutar([
            FF, "-y", "-loglevel", "error", "-i", str(origen),
            # Escala a ancho fijo y fuerza dimensiones pares (requisito de H.264).
            "-vf", f"scale={ancho}:-2:flags=lanczos",
            "-c:v", "libx264", "-profile:v", "high", "-level", "4.0",
            "-crf", str(crf), "-preset", preset,
            "-pix_fmt", "yuv420p",
            # Un keyframe por segundo: arranque y bucle más limpios.
            "-g", "24", "-keyint_min", "24",
            "-an",                      # vídeo decorativo: sin pista de audio
            "-movflags", "+faststart",  # metadatos al inicio: empieza antes
            str(destino),
        ])
        kb = destino.stat().st_size / 1024
        print(f"  {destino.name:30s} ancho={ancho:<5d} crf={crf}  {kb:,.0f} KB")

    poster = VIDEOS / f"{nombre}-poster.webp"
    ejecutar([
        FF, "-y", "-loglevel", "error", "-i", str(origen),
        "-vf", "select=eq(n\\,0),scale=1600:-2:flags=lanczos",
        "-frames:v", "1", "-quality", "82", str(poster),
    ])
    print(f"  {poster.name:30s} {poster.stat().st_size / 1024:,.0f} KB")


if __name__ == "__main__":
    main()
