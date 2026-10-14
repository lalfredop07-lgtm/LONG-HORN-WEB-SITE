"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Local } from "@/lib/schemas";
import { MapaNoDisponible } from "@/components/locations/MapaNoDisponible";
import { HAY_MAPA } from "@/lib/site";
import { telefonoHref, urlComoLlegar } from "@/lib/locales";
import { registrarEvento } from "@/lib/analitica";

// El mapa solo se descarga en cliente y solo si hay clave configurada.
const MapaLocales = dynamic(
  () => import("@/components/locations/MapaLocales").then((m) => m.MapaLocales),
  { ssr: false, loading: () => <div className="h-full min-h-[22rem] rounded-lh-md bg-lh-carbon-800" /> },
);

type Vista = "lista" | "mapa";

export function DirectorioLocales({ locales }: { locales: Local[] }) {
  const [ciudad, setCiudad] = useState("todas");
  const [distrito, setDistrito] = useState("todos");
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [vista, setVista] = useState<Vista>("lista");

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

  const filtrados = useMemo(
    () =>
      locales.filter(
        (l) =>
          (ciudad === "todas" || l.ciudad === ciudad) &&
          (distrito === "todos" || l.distrito === distrito),
      ),
    [locales, ciudad, distrito],
  );

  const conCoordenadas = filtrados.filter((l) => l.coordenadas);

  const cambiarCiudad = (valor: string) => {
    registrarEvento("usar_buscador_locales", { ciudad: valor });
    setCiudad(valor);
    setDistrito("todos");
    setSeleccionado(null);
  };

  return (
    <div>
      {/* Filtros */}
      <h2 className="solo-lectores">Filtrar locales</h2>
      <div className="flex flex-col gap-4 rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-5 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="filtro-ciudad" className="eyebrow mb-2 block text-lh-ambar-claro">
            Ciudad
          </label>
          <select
            id="filtro-ciudad"
            value={ciudad}
            onChange={(e) => cambiarCiudad(e.target.value)}
            className="w-full rounded-lh border border-lh-madera-500 bg-lh-carbon px-4 py-3 text-lh-marfil transition-colors hover:border-lh-madera-300 focus:border-lh-ambar"
          >
            <option value="todas">Todas las ciudades</option>
            {ciudades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="filtro-distrito" className="eyebrow mb-2 block text-lh-ambar-claro">
            Distrito
          </label>
          <select
            id="filtro-distrito"
            value={distrito}
            onChange={(e) => {
              setDistrito(e.target.value);
              setSeleccionado(null);
            }}
            className="w-full rounded-lh border border-lh-madera-500 bg-lh-carbon px-4 py-3 text-lh-marfil transition-colors hover:border-lh-madera-300 focus:border-lh-ambar"
          >
            <option value="todos">Todos los distritos</option>
            {distritos.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <p className="text-apunte text-lh-marfil/60 sm:pb-3.5" role="status" aria-live="polite">
          {filtrados.length} {filtrados.length === 1 ? "local" : "locales"}
        </p>
      </div>

      {/* Conmutador lista/mapa — solo donde el espacio obliga a elegir */}
      <div className="mt-5 flex gap-1 rounded-lh border border-lh-madera-600/70 p-1 lg:hidden">
        {(["lista", "mapa"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVista(v)}
            aria-pressed={vista === v}
            className={[
              "flex-1 rounded-[3px] px-4 py-2.5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] transition-colors",
              vista === v ? "bg-lh-red-accion text-white" : "text-lh-marfil/65 hover:text-lh-marfil",
            ].join(" ")}
          >
            {v === "lista" ? "Lista" : "Ver en el mapa"}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-start">
        {/* Listado */}
        <div className={vista === "mapa" ? "hidden lg:block" : ""}>
          <h2 className="solo-lectores">Listado de locales</h2>
          <ul className="space-y-3 lg:max-h-[46rem] lg:overflow-y-auto lg:pr-2">
            {filtrados.map((local) => {
              const activo = seleccionado === local.slug;
              return (
                <li key={local.slug}>
                  <article
                    className={[
                      "rounded-lh-md border p-5 transition-colors duration-[180ms]",
                      activo
                        ? "border-lh-red bg-lh-madera-800"
                        : "border-lh-madera-600/70 bg-lh-carbon-800 hover:border-lh-madera-400",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSeleccionado(local.slug);
                        registrarEvento("seleccionar_local", { local: local.slug });
                        if (window.innerWidth < 1024 && local.coordenadas) setVista("mapa");
                      }}
                      aria-pressed={activo}
                      className="w-full text-left"
                    >
                      <p className="eyebrow text-lh-ambar-claro">{local.ciudad}</p>
                      <h3 className="mt-1.5 font-display text-titulo leading-tight text-lh-marfil">
                        {local.nombreCorto}
                      </h3>
                      <p className="mt-2 text-apunte leading-relaxed text-lh-marfil/62">
                        {local.direccion}
                      </p>
                      {!local.coordenadas ? (
                        <p className="mt-2 text-[0.73rem] leading-relaxed text-lh-ambar-claro">
                          Ubicación exacta pendiente de verificar: usa «Cómo llegar» para abrirla en
                          Google Maps.
                        </p>
                      ) : null}
                    </button>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/locales/${local.slug}`}
                        className="inline-flex min-h-10 items-center rounded-lh border border-lh-marfil/25 px-4 text-[0.72rem] font-semibold uppercase tracking-[0.13em] text-lh-marfil transition-colors hover:border-lh-marfil/60"
                      >
                        Ver local
                      </Link>
                      <a
                        href={urlComoLlegar(local)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center rounded-lh border border-lh-marfil/25 px-4 text-[0.72rem] font-semibold uppercase tracking-[0.13em] text-lh-marfil transition-colors hover:border-lh-marfil/60"
                      >
                        Cómo llegar
                      </a>
                      {local.urlReservas ? (
                        <a
                          href={local.urlReservas}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center rounded-lh bg-lh-red-accion px-4 text-[0.72rem] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-lh-red-profundo"
                        >
                          Reservar
                        </a>
                      ) : null}
                      {local.telefonos[0] ? (
                        <a
                          href={telefonoHref(local.telefonos[0])}
                          className="inline-flex min-h-10 items-center rounded-lh px-3 text-[0.72rem] font-semibold uppercase tracking-[0.13em] text-lh-marfil/60 transition-colors hover:text-lh-marfil"
                        >
                          Llamar
                          <span className="solo-lectores"> a LongHorn {local.nombreCorto}</span>
                        </a>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          {filtrados.length === 0 ? (
            <p className="rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-8 text-center text-lh-marfil/60">
              No hay locales con esos filtros. Prueba con otra ciudad.
            </p>
          ) : null}
        </div>

        {/* Mapa */}
        <div className={`${vista === "lista" ? "hidden lg:block" : ""} lg:sticky lg:top-28 lg:h-[46rem]`}>
          <h2 className="solo-lectores">Mapa de locales</h2>
          {HAY_MAPA && conCoordenadas.length > 0 ? (
            <MapaLocales
              locales={conCoordenadas}
              seleccionado={seleccionado}
              alSeleccionar={setSeleccionado}
            />
          ) : (
            <MapaNoDisponible totalLocales={filtrados.length} />
          )}
        </div>
      </div>
    </div>
  );
}
