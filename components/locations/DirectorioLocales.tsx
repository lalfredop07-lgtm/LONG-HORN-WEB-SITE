"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";

import type { Local } from "@/lib/schemas";
import type { CapaMapa } from "@/components/locations/MapaLeaflet";
import { FichaLocal } from "@/components/locations/FichaLocal";
import { TarjetaLocalMapa } from "@/components/locations/TarjetaLocalMapa";
import { registrarEvento } from "@/lib/analitica";
import { useMediaQuery } from "@/lib/hooks/navegador";

/*
 * Leaflet toca `window` al importarse, así que el mapa se carga solo en
 * cliente y bajo demanda: su JavaScript no entra en ninguna otra página.
 */
const MapaLeaflet = dynamic(() => import("@/components/locations/MapaLeaflet"), {
  ssr: false,
  loading: () => (
    <div
      className="grid h-full min-h-[22rem] place-items-center rounded-lh-lg border border-lh-madera-600/70 bg-lh-carbon-800"
      role="status"
    >
      <p className="text-apunte text-lh-marfil/60">Cargando el mapa…</p>
    </div>
  ),
});

type Vista = "lista" | "mapa";

/** Normaliza para que el buscador ignore tildes y mayúsculas. */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function IconoLupa() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function DirectorioLocales({ locales }: { locales: Local[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [ciudad, setCiudad] = useState("todas");
  const [distrito, setDistrito] = useState("todos");
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [vista, setVista] = useState<Vista>("lista");
  const [capa, setCapa] = useState<CapaMapa>("mapa");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const esEscritorio = useMediaQuery("(min-width: 1024px)", false);
  const listaRef = useRef<HTMLUListElement>(null);
  const hojaRef = useRef<HTMLDivElement>(null);

  /* ----------------------------- Datos ----------------------------- */

  const ciudades = useMemo(
    () =>
      [...new Set(locales.map((l) => l.ciudad))].sort((a, b) =>
        a === "Lima" ? -1 : b === "Lima" ? 1 : a.localeCompare(b, "es"),
      ),
    [locales],
  );

  const distritos = useMemo(() => {
    const base = ciudad === "todas" ? locales : locales.filter((l) => l.ciudad === ciudad);
    return [...new Set(base.map((l) => l.distrito))].sort((a, b) => a.localeCompare(b, "es"));
  }, [locales, ciudad]);

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda);
    return locales.filter((l) => {
      if (ciudad !== "todas" && l.ciudad !== ciudad) return false;
      if (distrito !== "todos" && l.distrito !== distrito) return false;
      if (!q) return true;
      return [l.nombreCorto, l.nombre, l.ciudad, l.distrito, l.direccion, l.centroComercial ?? ""]
        .some((campo) => normalizar(campo).includes(q));
    });
  }, [locales, busqueda, distrito, ciudad]);

  /*
   * Si un filtro deja fuera la sede elegida, deja de estar seleccionada.
   * Se deriva en lugar de corregirlo desde un efecto: así no hay un
   * render intermedio con una selección imposible.
   */
  const elegido = useMemo(
    () => filtrados.find((l) => l.slug === seleccionado) ?? null,
    [filtrados, seleccionado],
  );
  const seleccionEfectiva = elegido?.slug ?? null;

  /* --------------------------- Acciones ---------------------------- */

  const elegirLocal = useCallback(
    (slug: string) => {
      setSeleccionado(slug);
      registrarEvento("seleccionar_local", { local: slug });
      // En móvil, elegir desde la lista lleva al mapa manteniendo la sede.
      if (!esEscritorio) setVista("mapa");
    },
    [esEscritorio],
  );

  // Al elegir desde el mapa, la tarjeta correspondiente se trae a la vista.
  const elegirDesdeMapa = useCallback((slug: string) => {
    setSeleccionado(slug);
    registrarEvento("seleccionar_local", { local: slug });

    const suave = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? ("auto" as const)
      : ("smooth" as const);

    // Escritorio: la tarjeta correspondiente se trae a la vista en la lista.
    listaRef.current
      ?.querySelector<HTMLElement>(`[data-slug="${slug}"]`)
      ?.scrollIntoView({ behavior: suave, block: "nearest" });

    // Móvil: la ficha aparece bajo el mapa, así que la acercamos sola.
    window.setTimeout(() => {
      if (window.matchMedia("(min-width: 1024px)").matches) return;
      hojaRef.current?.scrollIntoView({ behavior: suave, block: "nearest" });
    }, 420);
  }, []);

  const cambiarCiudad = (valor: string) => {
    setCiudad(valor);
    setDistrito("todos");
    registrarEvento("usar_buscador_locales", { ciudad: valor });
  };

  const limpiar = () => {
    setBusqueda("");
    setCiudad("todas");
    setDistrito("todos");
  };

  const filtrosActivos = (ciudad !== "todas" ? 1 : 0) + (distrito !== "todos" ? 1 : 0);
  const hayFiltros = busqueda !== "" || filtrosActivos > 0;

  /* ---------------------------- Render ----------------------------- */

  const panelFiltros = (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor="filtro-ciudad" className="eyebrow mb-2 block text-[0.64rem] text-lh-marfil/60">
          Ciudad
        </label>
        <select
          id="filtro-ciudad"
          value={ciudad}
          onChange={(e) => cambiarCiudad(e.target.value)}
          className="w-full rounded-lh border border-lh-madera-500 bg-lh-carbon px-3.5 py-2.5 text-lh-marfil transition-colors hover:border-lh-madera-300 focus:border-lh-ambar"
        >
          <option value="todas">Todas las ciudades</option>
          {ciudades.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filtro-distrito" className="eyebrow mb-2 block text-[0.64rem] text-lh-marfil/60">
          Distrito
        </label>
        <select
          id="filtro-distrito"
          value={distrito}
          onChange={(e) => setDistrito(e.target.value)}
          className="w-full rounded-lh border border-lh-madera-500 bg-lh-carbon px-3.5 py-2.5 text-lh-marfil transition-colors hover:border-lh-madera-300 focus:border-lh-ambar"
        >
          <option value="todos">Todos los distritos</option>
          {distritos.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const listado = (
    <>
      <div className="flex items-center justify-between gap-4 pb-3">
        <p className="text-[0.78rem] text-lh-marfil/60" role="status" aria-live="polite">
          {filtrados.length} {filtrados.length === 1 ? "local" : "locales"}
        </p>
        {hayFiltros ? (
          <button
            type="button"
            onClick={limpiar}
            className="lh-inline text-[0.72rem] uppercase tracking-[0.12em] text-lh-ambar-claro underline underline-offset-4 transition-colors hover:text-lh-red"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      <h2 className="solo-lectores">Listado de locales</h2>

      {filtrados.length === 0 ? (
        <p className="rounded-lh-md border border-dashed border-lh-madera-500 bg-lh-carbon-800/60 p-8 text-center text-[0.88rem] text-lh-marfil/60">
          No encontramos locales con esa búsqueda. Prueba con otro distrito o
          <button type="button" onClick={limpiar} className="lh-inline ml-1 underline underline-offset-4 hover:text-lh-marfil">
            quita los filtros
          </button>
          .
        </p>
      ) : (
        // Una sola columna en todos los tamaños: a dos columnas las tarjetas
        // se estrechan tanto que la dirección parte en cuatro líneas y los
        // botones se apilan.
        <ul ref={listaRef} className="grid gap-3 lg:max-h-[42rem] lg:overflow-y-auto lg:pr-1.5">
          {filtrados.map((local) => (
            <li key={local.slug} data-slug={local.slug}>
              <TarjetaLocalMapa
                local={local}
                activo={seleccionEfectiva === local.slug}
                alElegir={elegirLocal}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const mapa = (
    <MapaLeaflet
      locales={filtrados}
      seleccionado={seleccionEfectiva}
      alSeleccionar={elegirDesdeMapa}
      capa={capa}
      className="h-full"
    />
  );

  const selectorCapa = (
    <div
      role="group"
      aria-label="Tipo de mapa"
      className="flex gap-0.5 rounded-lh border border-lh-madera-600/80 bg-lh-carbon/90 p-0.5 backdrop-blur-md"
    >
      {(["mapa", "satelite"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCapa(c)}
          aria-pressed={capa === c}
          className={[
            "rounded-[3px] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] transition-colors",
            capa === c ? "bg-lh-marfil text-lh-carbon" : "text-lh-marfil/70 hover:text-lh-marfil",
          ].join(" ")}
        >
          {c === "mapa" ? "Mapa" : "Satélite"}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {/* ---------------------- Buscador y filtros ---------------------- */}
      <h2 className="solo-lectores">Buscar y filtrar locales</h2>
      <div className="rounded-lh-lg border border-lh-madera-600/60 bg-lh-carbon-800/70 p-3.5 sm:p-5">
        <label htmlFor="buscador-locales" className="solo-lectores">
          Buscar por distrito, dirección o nombre del local
        </label>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lh-marfil/50"
            >
              <IconoLupa />
            </span>
            <input
              id="buscador-locales"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar local o distrito…"
              autoComplete="off"
              className="w-full rounded-lh border border-lh-madera-500 bg-lh-carbon py-3 pl-11 pr-4 text-lh-marfil placeholder:text-lh-marfil/40 transition-colors hover:border-lh-madera-300 focus:border-lh-ambar"
            />
          </div>

          {/* En móvil los selectores se pliegan para no empujar el mapa
              fuera de la pantalla; en escritorio están siempre a la vista. */}
          <button
            type="button"
            onClick={() => setFiltrosAbiertos((v) => !v)}
            aria-expanded={filtrosAbiertos}
            aria-controls="panel-filtros"
            className="inline-flex shrink-0 items-center gap-2 rounded-lh border border-lh-madera-500 px-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-lh-marfil transition-colors hover:border-lh-ambar sm:hidden"
          >
            Filtros
            {filtrosActivos > 0 ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-lh-red-accion px-1 text-[0.65rem] text-white">
                {filtrosActivos}
              </span>
            ) : null}
          </button>
        </div>

        <div
          id="panel-filtros"
          className={`mt-3.5 ${filtrosAbiertos ? "" : "hidden"} sm:mt-4 sm:block`}
        >
          {panelFiltros}
        </div>
      </div>

      {/* --------------- Conmutador de vista (móvil y tablet) ----------- */}
      <div className="mt-4 flex gap-1 rounded-lh border border-lh-madera-600/70 bg-lh-carbon-800/60 p-1 lg:hidden">
        {(["lista", "mapa"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVista(v)}
            aria-pressed={vista === v}
            className={[
              "flex-1 rounded-[4px] px-4 py-3 text-[0.76rem] font-semibold uppercase tracking-[0.13em] transition-colors",
              vista === v
                ? "bg-lh-red-accion text-white"
                : "text-lh-marfil/65 hover:bg-lh-marfil/8 hover:text-lh-marfil",
            ].join(" ")}
          >
            {v === "lista" ? "Lista" : "Mapa"}
          </button>
        ))}
      </div>

      {/* ----------------------- Listado + mapa ------------------------ */}
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
        <div className={vista === "mapa" ? "hidden lg:block" : ""}>{listado}</div>

        <div
          className={[
            vista === "lista" ? "hidden lg:block" : "",
            "relative lg:sticky lg:top-28",
          ].join(" ")}
        >
          {/* Altura generosa en escritorio; en móvil, cómoda sin comerse la pantalla */}
          <h2 className="solo-lectores">Mapa de locales</h2>
          <div className="relative h-[68svh] min-h-[26rem] lg:h-[42rem]">
            {mapa}

            {/* Selector Mapa/Satélite superpuesto, como en la referencia */}
            <div className="absolute right-3 top-3 z-[500]">{selectorCapa}</div>

            {/* Ficha emergente en escritorio */}
            {elegido && esEscritorio ? (
              <div className="absolute bottom-4 left-4 z-[500] w-[18rem] animate-[aparecer_380ms_var(--ease-lh-entrada)_forwards]">
                <FichaLocal local={elegido} alCerrar={() => setSeleccionado(null)} />
              </div>
            ) : null}
          </div>

          {/* Hoja inferior en móvil: no tapa el mapa entero y se cierra fácil */}
          {elegido && !esEscritorio && vista === "mapa" ? (
            <div
              ref={hojaRef}
              className="mt-3 animate-[aparecer_380ms_var(--ease-lh-entrada)_forwards]"
            >
              <FichaLocal local={elegido} variante="hoja" alCerrar={() => setSeleccionado(null)} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
