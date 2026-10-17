"use client";

import "leaflet/dist/leaflet.css";
import "@/styles/mapa.css";

import L from "leaflet";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";

import type { Local } from "@/lib/schemas";
import { htmlAgrupacion, htmlMarcador, MARCADOR } from "@/components/locations/marcador-cuernos";
import { useMovimientoReducido } from "@/lib/hooks/navegador";

/* ================================================================== *
 * MAPA DE LOCALES (Leaflet + OpenStreetMap)
 *
 * Sin Google Maps y sin clave de API.
 *
 *   · «Mapa»     Teselas estándar de OpenStreetMap, oscurecidas con un
 *                filtro CSS para que encajen con la paleta LongHorn.
 *                Gratuitas y aptas para uso comercial con atribución.
 *   · «Satélite» Esri World Imagery, también sin clave.
 *
 * Nota: se descartó CARTO Dark Matter porque sus teselas ya exigen una
 * clave de API («API KEY REQUIRED» impreso sobre el mapa).
 * Ver docs/integraciones.md.
 * ================================================================== */

export type CapaMapa = "mapa" | "satelite";

const CAPAS: Record<CapaMapa, { url: string; atribucion: string; zoomMax: number }> = {
  mapa: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    atribucion:
      '&copy; colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    zoomMax: 19,
  },
  satelite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    atribucion: "Imágenes &copy; Esri, Maxar, Earthstar Geographics",
    zoomMax: 18,
  },
};

/**
 * Separación mínima en píxeles antes de fundir dos marcadores.
 * En pantallas estrechas se reduce: con un umbral fijo, un móvil acabaría
 * mostrando un único grupo con todas las sedes de Lima.
 */
function umbralAgrupacion(anchoMapa: number): number {
  if (anchoMapa < 420) return 34;
  if (anchoMapa < 640) return 40;
  return 48;
}

type Props = {
  locales: Local[];
  seleccionado: string | null;
  alSeleccionar: (slug: string) => void;
  capa: CapaMapa;
  /** Contenido de la ventana emergente, renderizado por el contenedor. */
  alAbrirFicha?: (slug: string) => void;
  className?: string;
};

type Grupo = { lat: number; lng: number; locales: Local[] };

/* ------------------------------------------------------------------ *
 * Agrupación por proximidad en pantalla
 *
 * Con 13 sedes no hace falta una librería de clustering: basta con
 * proyectar los puntos a píxeles y fundir los que se solapen. Así se
 * controla por completo el aspecto de la pastilla y no se añaden 30 KB
 * de dependencia.
 * ------------------------------------------------------------------ */
function agrupar(mapa: L.Map, locales: Local[]): Grupo[] {
  /*
   * En móvil el mapa se monta dentro de la pestaña «Lista», oculta, así
   * que su contenedor mide 0. Proyectar coordenadas en ese estado devuelve
   * NaN y rompe Leaflet, de modo que no se agrupa hasta que tenga tamaño.
   */
  const tamano = mapa.getSize();
  if (tamano.x === 0 || tamano.y === 0) return [];

  const umbral = umbralAgrupacion(tamano.x);
  const puntos = locales
    .filter((l) => l.coordenadas)
    .map((l) => ({
      local: l,
      lat: l.coordenadas!.lat,
      lng: l.coordenadas!.lng,
      px: mapa.latLngToContainerPoint([l.coordenadas!.lat, l.coordenadas!.lng]),
    }));

  const grupos: { miembros: typeof puntos }[] = [];

  for (const punto of puntos) {
    const cercano = grupos.find((g) =>
      g.miembros.some((m) => m.px.distanceTo(punto.px) < umbral),
    );
    if (cercano) cercano.miembros.push(punto);
    else grupos.push({ miembros: [punto] });
  }

  return grupos.map((g) => ({
    lat: g.miembros.reduce((s, m) => s + m.lat, 0) / g.miembros.length,
    lng: g.miembros.reduce((s, m) => s + m.lng, 0) / g.miembros.length,
    locales: g.miembros.map((m) => m.local),
  }));
}

/* ------------------------------------------------------------------ *
 * Capa de marcadores
 * ------------------------------------------------------------------ */
function Marcadores({
  locales,
  seleccionado,
  alSeleccionar,
}: Pick<Props, "locales" | "seleccionado" | "alSeleccionar">) {
  const mapa = useMap();

  /*
   * La agrupación depende del zoom y del encuadre, que son estado del
   * propio mapa. En vez de copiarlo a un `useState` desde un efecto
   * —lo que provocaría renders en cascada—, se recalcula durante el
   * render y se fuerza uno nuevo cuando el mapa se mueve. Con 13 sedes
   * el cálculo es trivial.
   */
  const [, revisar] = useReducer((n: number) => n + 1, 0);
  useMapEvents({ zoomend: revisar, moveend: revisar, resize: revisar });

  const grupos = agrupar(mapa, locales);

  return (
    <>
      {grupos.map((grupo) => {
        // Grupo de varias sedes: pastilla con el número.
        if (grupo.locales.length > 1) {
          const contiene = grupo.locales.some((l) => l.slug === seleccionado);
          return (
            <Marker
              key={`g-${grupo.locales.map((l) => l.slug).join("-")}`}
              position={[grupo.lat, grupo.lng]}
              zIndexOffset={contiene ? 900 : 0}
              icon={L.divIcon({
                html: htmlAgrupacion(grupo.locales.length),
                className: "lh-marcador lh-marcador--grupo",
                iconSize: [66, 34],
                iconAnchor: [33, 17],
              })}
              eventHandlers={{
                click: () => {
                  const limites = L.latLngBounds(
                    grupo.locales.map((l) => [l.coordenadas!.lat, l.coordenadas!.lng]),
                  );
                  mapa.flyToBounds(limites, { padding: [70, 70], maxZoom: 16, duration: 0.7 });
                },
              }}
            />
          );
        }

        const local = grupo.locales[0]!;
        const activo = local.slug === seleccionado;
        const ancho = activo ? MARCADOR.anchoActivo : MARCADOR.ancho;
        const alto = activo ? MARCADOR.altoActivo : MARCADOR.alto;

        return (
          <Marker
            key={local.slug}
            position={[local.coordenadas!.lat, local.coordenadas!.lng]}
            zIndexOffset={activo ? 1000 : 0}
            icon={L.divIcon({
              html: htmlMarcador({ activo, etiqueta: local.nombreCorto }),
              className: "lh-marcador",
              iconSize: [ancho, alto],
              iconAnchor: [ancho / 2, alto],
            })}
            // El marcador es un control real: accesible con teclado.
            keyboard
            alt={`LongHorn ${local.nombreCorto}`}
            eventHandlers={{ click: () => alSeleccionar(local.slug) }}
          />
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Sincronización con el listado
 * ------------------------------------------------------------------ */
function Sincronizador({
  locales,
  seleccionado,
  movimientoReducido,
  verTodo,
  reencuadre,
}: {
  locales: Local[];
  seleccionado: string | null;
  movimientoReducido: boolean;
  verTodo: boolean;
  reencuadre: number;
}) {
  const mapa = useMap();
  const primerAjuste = useRef(true);

  // Encuadra el conjunto cuando cambian los locales filtrados.
  useEffect(() => {
    const conCoordenadas = locales.filter((l) => l.coordenadas);
    if (conCoordenadas.length === 0) return;

    // Encuadrar un mapa de tamaño cero da centro y zoom NaN.
    const tamano = mapa.getSize();
    if (tamano.x === 0 || tamano.y === 0) return;

    /*
     * Encuadrar las 13 sedes a la vez obliga a un zoom nacional en el que
     * las 9 de Lima se amontonan en un punto. Por eso, mientras no se
     * pida «ver todo», se encuadra la ciudad con más locales —Lima—, que
     * es además la vista de la referencia de diseño.
     */
    let aEncuadrar = conCoordenadas;
    if (!verTodo) {
      const porCiudad = new Map<string, Local[]>();
      for (const l of conCoordenadas) {
        porCiudad.set(l.ciudad, [...(porCiudad.get(l.ciudad) ?? []), l]);
      }
      const mayor = [...porCiudad.values()].sort((a, b) => b.length - a.length)[0];
      if (mayor && mayor.length > 1) aEncuadrar = mayor;
    }

    const limites = L.latLngBounds(
      aEncuadrar.map((l) => [l.coordenadas!.lat, l.coordenadas!.lng]),
    );
    const estrecho = mapa.getSize().x < 640;
    const animar = !primerAjuste.current && !movimientoReducido;

    mapa.fitBounds(limites, {
      padding: estrecho ? [40, 40] : [70, 70],
      maxZoom: aEncuadrar.length === 1 ? 16 : 13,
      animate: animar,
    });

    /*
     * En pantallas estrechas el encuadre completo deja un zoom tan bajo
     * que todas las sedes de Lima caen en un único grupo. Se fija un
     * suelo de zoom para que se distingan varias, aunque alguna quede
     * fuera de la vista inicial: el usuario puede alejar o usar la lista.
     */
    if (estrecho && aEncuadrar.length > 1) {
      const suelo = 11;
      if (mapa.getZoom() < suelo) mapa.setZoom(suelo, { animate: animar });
    }

    primerAjuste.current = false;
  }, [mapa, locales, movimientoReducido, verTodo, reencuadre]);

  /*
   * Centra en la sede elegida desde el listado.
   *
   * Depende también de `reencuadre` porque en móvil la selección ocurre
   * mientras el mapa sigue oculto: hay que repetir el centrado cuando el
   * contenedor ya tiene tamaño. Volver a centrar en la misma sede es
   * inocuo, así que no hace falta memorizar la anterior.
   */
  useEffect(() => {
    if (!seleccionado) return;

    const local = locales.find((l) => l.slug === seleccionado);
    if (!local?.coordenadas) return;
    if (mapa.getSize().x === 0) return;

    const destino: L.LatLngExpression = [local.coordenadas.lat, local.coordenadas.lng];
    const zoom = Math.max(mapa.getZoom(), 15);

    if (movimientoReducido) mapa.setView(destino, zoom, { animate: false });
    else mapa.flyTo(destino, zoom, { duration: 0.85 });
  }, [mapa, seleccionado, locales, movimientoReducido, reencuadre]);

  return null;
}

/**
 * Gestos cooperativos.
 *
 * En táctil, un mapa que responde a un dedo atrapa el scroll vertical de
 * la página. Aquí se exige **dos dedos** para desplazarlo —igual que hace
 * Google Maps embebido— y se muestra un aviso si alguien lo intenta con
 * uno solo. Con ratón, se pide Ctrl/⌘ para hacer zoom con la rueda.
 */
function GestosCooperativos({ alAvisar }: { alAvisar: (visible: boolean) => void }) {
  const mapa = useMap();

  useEffect(() => {
    const contenedor = mapa.getContainer();
    const esTactil = window.matchMedia("(pointer: coarse)").matches;

    if (esTactil) mapa.dragging.disable();

    let temporizador = 0;
    const avisar = () => {
      alAvisar(true);
      window.clearTimeout(temporizador);
      temporizador = window.setTimeout(() => alAvisar(false), 1600);
    };

    const alTocar = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        mapa.dragging.enable();
        alAvisar(false);
      } else {
        mapa.dragging.disable();
        // Solo avisamos si el dedo se mueve: un toque simple es una selección.
        if (e.type === "touchmove") avisar();
      }
    };

    const alSoltar = (e: TouchEvent) => {
      if (e.touches.length < 2) mapa.dragging.disable();
    };

    const alRodar = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        mapa.scrollWheelZoom.enable();
        window.clearTimeout(temporizador);
        temporizador = window.setTimeout(() => mapa.scrollWheelZoom.disable(), 500);
      } else {
        avisar();
      }
    };

    contenedor.addEventListener("touchstart", alTocar, { passive: true });
    contenedor.addEventListener("touchmove", alTocar, { passive: true });
    contenedor.addEventListener("touchend", alSoltar, { passive: true });
    if (!esTactil) contenedor.addEventListener("wheel", alRodar, { passive: false });

    return () => {
      contenedor.removeEventListener("touchstart", alTocar);
      contenedor.removeEventListener("touchmove", alTocar);
      contenedor.removeEventListener("touchend", alSoltar);
      contenedor.removeEventListener("wheel", alRodar);
      window.clearTimeout(temporizador);
    };
  }, [mapa, alAvisar]);

  return null;
}

/**
 * Recalcula el tamaño del mapa cuando su contenedor cambia.
 *
 * Importante en móvil: el mapa se monta mientras la pestaña «Lista» está
 * activa, así que su contenedor mide 0 y cualquier encuadre calculado en
 * ese momento sale mal. Al cambiar de pestaña hay que invalidar el tamaño
 * **y volver a encuadrar**; por eso se avisa al componente padre.
 */
function AjustarTamano({ alRedimensionar }: { alRedimensionar: () => void }) {
  const mapa = useMap();

  useEffect(() => {
    const contenedor = mapa.getContainer();
    let ancho = contenedor.clientWidth;
    let alto = contenedor.clientHeight;

    const observador = new ResizeObserver(() => {
      const nuevoAncho = contenedor.clientWidth;
      const nuevoAlto = contenedor.clientHeight;
      if (nuevoAncho === ancho && nuevoAlto === alto) return;
      const veniaOculto = ancho === 0 || alto === 0;
      ancho = nuevoAncho;
      alto = nuevoAlto;

      mapa.invalidateSize();
      // Si estaba oculto, el encuadre anterior no valía: se rehace.
      if (veniaOculto && nuevoAncho > 0 && nuevoAlto > 0) alRedimensionar();
    });
    observador.observe(contenedor);

    const t = window.setTimeout(() => mapa.invalidateSize(), 180);
    return () => {
      observador.disconnect();
      window.clearTimeout(t);
    };
  }, [mapa, alRedimensionar]);

  return null;
}

/* ------------------------------------------------------------------ *
 * Componente principal
 * ------------------------------------------------------------------ */
export default function MapaLeaflet({
  locales,
  seleccionado,
  alSeleccionar,
  capa,
  className = "",
}: Props) {
  const movimientoReducido = useMovimientoReducido();
  const [avisoGesto, setAvisoGesto] = useState(false);
  const [verTodo, setVerTodo] = useState(false);
  const [reencuadre, reencuadrar] = useReducer((n: number) => n + 1, 0);
  const conCoordenadas = useMemo(() => locales.filter((l) => l.coordenadas), [locales]);
  const definicion = CAPAS[capa];

  // Centro inicial: el conjunto de sedes con coordenadas.
  const centro = useMemo<L.LatLngExpression>(() => {
    if (conCoordenadas.length === 0) return [-12.046, -77.043];
    const lat = conCoordenadas.reduce((s, l) => s + l.coordenadas!.lat, 0) / conCoordenadas.length;
    const lng = conCoordenadas.reduce((s, l) => s + l.coordenadas!.lng, 0) / conCoordenadas.length;
    return [lat, lng];
  }, [conCoordenadas]);

  return (
    <div className={`lh-mapa ${className}`} data-capa={capa}>
      <MapContainer
        center={centro}
        zoom={11}
        minZoom={4}
        maxZoom={definicion.zoomMax}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer key={capa} url={definicion.url} maxZoom={definicion.zoomMax} />
        <ZoomControl position="bottomright" />
        <AjustarTamano alRedimensionar={reencuadrar} />
        <GestosCooperativos alAvisar={setAvisoGesto} />
        <Sincronizador
          locales={conCoordenadas}
          seleccionado={seleccionado}
          movimientoReducido={movimientoReducido}
          verTodo={verTodo}
          reencuadre={reencuadre}
        />
        <Marcadores
          locales={conCoordenadas}
          seleccionado={seleccionado}
          alSeleccionar={alSeleccionar}
        />
      </MapContainer>

      {/* Encuadre: Lima por defecto, con acceso al conjunto del país */}
      {new Set(conCoordenadas.map((l) => l.ciudad)).size > 1 ? (
        <button
          type="button"
          onClick={() => setVerTodo((v) => !v)}
          className="absolute bottom-9 left-3 z-[500] inline-flex min-h-9 items-center gap-2 lg:bottom-auto lg:top-3 rounded-lh border border-lh-madera-500 bg-lh-carbon/92 px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-lh-marfil backdrop-blur-md transition-colors hover:border-lh-ambar hover:text-lh-ambar-claro"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <path
              d={verTodo ? "M9 3v6H3m12 12v-6h6" : "M4 9V4h5M20 15v5h-5"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="lg:hidden">{verTodo ? "Lima" : "Todo el Perú"}</span>
          <span className="hidden lg:inline">{verTodo ? "Centrar en Lima" : "Ver todo el Perú"}</span>
        </button>
      ) : null}

      {/* Aviso de gesto: aparece solo si se intenta mover con un dedo */}
      <div
        aria-hidden={!avisoGesto}
        className={[
          "pointer-events-none absolute inset-0 z-[500] grid place-items-center",
          "bg-lh-carbon/55 backdrop-blur-[2px] transition-opacity duration-300",
          avisoGesto ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <p className="rounded-lh-md border border-lh-madera-500 bg-lh-carbon/95 px-5 py-3 text-center text-[0.82rem] text-lh-marfil">
          <span className="lg:hidden">Usa dos dedos para mover el mapa</span>
          <span className="hidden lg:inline">Usa Ctrl + rueda para hacer zoom</span>
        </p>
      </div>
    </div>
  );
}
