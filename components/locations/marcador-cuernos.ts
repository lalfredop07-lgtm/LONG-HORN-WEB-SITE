import { CUERNOS_PATH, CUERNOS_VIEWBOX } from "@/lib/cuernos-path";

/* ================================================================== *
 * MARCADOR DE MAPA LONGHORN
 *
 * Gota roja oscura con los cuernos ORIGINALES del logotipo encima. El
 * trazado de los cuernos (`CUERNOS_PATH`) procede de vectorizar el
 * archivo del cliente «RECURSOS/MARCA DE CUERNOS.png»: no se ha
 * redibujado nada, solo se ha convertido a vector para que sea nítido a
 * cualquier tamaño y no cueste una petición extra.
 *
 * Se devuelve HTML en texto porque Leaflet lo inserta con `divIcon`, lo
 * que permite animar los estados con CSS.
 * ================================================================== */

export const MARCADOR = {
  ancho: 46,
  alto: 58,
  anchoActivo: 58,
  altoActivo: 73,
} as const;

/** Gota del pin, dibujada a mano para encajar con la referencia. */
const GOTA = "M24 62C24 62 45 38.4 45 23.5A21 21 0 1 0 3 23.5C3 38.4 24 62 24 62Z";

type Opciones = {
  activo?: boolean;
  /** Etiqueta bajo el pin, como en la referencia de diseño. */
  etiqueta?: string;
};

export function htmlMarcador({ activo = false, etiqueta }: Opciones = {}): string {
  const escala = activo ? MARCADOR.anchoActivo / MARCADOR.ancho : 1;

  return `
<div class="lh-pin${activo ? " lh-pin--activo" : ""}" style="--lh-pin-escala:${escala}">
  <svg class="lh-pin__gota" viewBox="0 0 48 64" aria-hidden="true">
    <defs>
      <linearGradient id="lh-g${activo ? "-a" : ""}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${activo ? "#FC1B2B" : "#C1121F"}"/>
        <stop offset="100%" stop-color="${activo ? "#C1121F" : "#7E0C16"}"/>
      </linearGradient>
    </defs>
    <path d="${GOTA}" fill="url(#lh-g${activo ? "-a" : ""})"
          stroke="${activo ? "rgba(255,255,255,.92)" : "rgba(243,234,223,.45)"}" stroke-width="2"/>
  </svg>
  <svg class="lh-pin__cuernos" viewBox="${CUERNOS_VIEWBOX}" aria-hidden="true">
    <path d="${CUERNOS_PATH}" fill="#fff"/>
  </svg>
  ${etiqueta ? `<span class="lh-pin__etiqueta">${escaparHtml(etiqueta)}</span>` : ""}
</div>`.trim();
}

/** Pastilla de agrupación cuando varios locales caen casi en el mismo punto. */
export function htmlAgrupacion(cantidad: number): string {
  return `
<div class="lh-cluster">
  <svg class="lh-cluster__cuernos" viewBox="${CUERNOS_VIEWBOX}" aria-hidden="true">
    <path d="${CUERNOS_PATH}" fill="#fff"/>
  </svg>
  <span class="lh-cluster__n">${cantidad}</span>
</div>`.trim();
}

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
