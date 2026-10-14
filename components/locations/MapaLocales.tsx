"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Local } from "@/lib/schemas";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_MAP_ID } from "@/lib/site";

type Props = {
  locales: Local[];
  seleccionado: string | null;
  alSeleccionar: (slug: string) => void;
};

type Estado = "inicial" | "cargando" | "listo" | "error";

/** Estilo de mapa alineado con la paleta LongHorn (madera, carbón y ámbar). */
const ESTILO_LONGHORN: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#231a15" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a08a76" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#15110f" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#352217" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a7260" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4a3122" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#14100e" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#1e1713" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#503323" }] },
];

/** Marcador personalizado: pin de marca con la cabeza de toro. */
function iconoMarcador(activo: boolean): google.maps.Symbol | google.maps.Icon {
  const relleno = activo ? "#FC1B2B" : "#15110F";
  const borde = activo ? "#FFFFFF" : "#C0803D";
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
  <path d="M20 51C20 51 37 32.8 37 20A17 17 0 1 0 3 20C3 32.8 20 51 20 51Z"
        fill="${relleno}" stroke="${borde}" stroke-width="2.5"/>
  <path d="M10 17c2.2-1.6 4.6-2.2 6.6-2.1.9-1.4 2-2 3.4-2s2.5.6 3.4 2c2-.1 4.4.5 6.6 2.1-2 .2-3.6.8-4.9 1.7.3.6.4 1.3.4 2 0 2.8-2.5 5.1-5.5 5.1s-5.5-2.3-5.5-5.1c0-.7.1-1.4.4-2-1.3-.9-2.9-1.5-4.9-1.7Z"
        fill="${activo ? "#FFFFFF" : "#F3EADF"}"/>
</svg>`.trim();
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(activo ? 40 : 32, activo ? 52 : 42),
    anchor: new google.maps.Point(activo ? 20 : 16, activo ? 51 : 41),
  };
}

/**
 * Mapa interactivo de locales.
 *
 * Reglas de diseño:
 *  · Solo se dibujan locales con coordenadas oficiales verificadas.
 *  · Sin clave de API el componente no se monta: la página sigue siendo
 *    plenamente utilizable con el listado (ver `MapaNoDisponible`).
 *  · `gestureHandling: "cooperative"` evita que el mapa secuestre el
 *    scroll de la página en móvil.
 */
export function MapaLocales({ locales, seleccionado, alSeleccionar }: Props) {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<google.maps.Map | null>(null);
  const marcadores = useRef<Map<string, google.maps.Marker>>(new Map());
  const [estado, setEstado] = useState<Estado>("inicial");

  const conCoordenadas = locales.filter((l) => l.coordenadas);

  useEffect(() => {
    if (!contenedor.current || !GOOGLE_MAPS_API_KEY || conCoordenadas.length === 0) return;

    let cancelado = false;
    // Copia local de la ref: es la instancia que debe limpiar este efecto,
    // aunque la ref haya cambiado cuando se ejecute la limpieza.
    const marcadoresDelEfecto = marcadores.current;
    setEstado("cargando");

    setOptions({
      key: GOOGLE_MAPS_API_KEY,
      v: "weekly",
      language: "es",
      region: "PE",
      ...(GOOGLE_MAPS_MAP_ID ? { mapIds: [GOOGLE_MAPS_MAP_ID] } : {}),
    });

    importLibrary("maps")
      .then(() => {
        if (cancelado || !contenedor.current) return;

        const instancia = new google.maps.Map(contenedor.current, {
          mapId: GOOGLE_MAPS_MAP_ID || undefined,
          // Los estilos en código solo aplican si no hay Map ID en la nube.
          ...(GOOGLE_MAPS_MAP_ID ? {} : { styles: ESTILO_LONGHORN }),
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          gestureHandling: "cooperative",
          backgroundColor: "#15110f",
        });
        mapa.current = instancia;

        const limites = new google.maps.LatLngBounds();
        for (const local of conCoordenadas) {
          const posicion = { lat: local.coordenadas!.lat, lng: local.coordenadas!.lng };
          limites.extend(posicion);

          const marcador = new google.maps.Marker({
            position: posicion,
            map: instancia,
            title: local.nombre,
            icon: iconoMarcador(false),
            optimized: false,
          });
          marcador.addListener("click", () => alSeleccionar(local.slug));
          marcadores.current.set(local.slug, marcador);
        }

        instancia.fitBounds(limites, { top: 64, right: 48, bottom: 64, left: 48 });
        setEstado("listo");
      })
      .catch(() => {
        if (!cancelado) setEstado("error");
      });

    return () => {
      cancelado = true;
      for (const m of marcadoresDelEfecto.values()) m.setMap(null);
      marcadoresDelEfecto.clear();
      mapa.current = null;
    };
    // Los locales con coordenadas son estáticos: el mapa se monta una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza la selección del listado con el mapa.
  const centrarEn = useCallback((slug: string | null) => {
    for (const [clave, marcador] of marcadores.current) {
      const activo = clave === slug;
      marcador.setIcon(iconoMarcador(activo));
      marcador.setZIndex(activo ? 999 : 1);
    }
    if (!slug || !mapa.current) return;
    const marcador = marcadores.current.get(slug);
    const posicion = marcador?.getPosition();
    if (posicion) {
      mapa.current.panTo(posicion);
      if ((mapa.current.getZoom() ?? 0) < 13) mapa.current.setZoom(14);
    }
  }, []);

  useEffect(() => {
    if (estado === "listo") centrarEn(seleccionado);
  }, [seleccionado, estado, centrarEn]);

  return (
    <div className="relative h-full min-h-[22rem] w-full overflow-hidden rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800">
      <div ref={contenedor} className="h-full w-full" aria-label="Mapa de locales LongHorn" role="application" />

      {estado !== "listo" ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-lh-carbon-800">
          <p className="text-apunte text-lh-marfil/60" role="status">
            {estado === "error" ? "No se pudo cargar el mapa." : "Cargando el mapa…"}
          </p>
        </div>
      ) : null}
    </div>
  );
}
