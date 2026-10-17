"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { BotonExterno } from "@/components/ui/Boton";
import { PlatoCarta } from "@/components/menu/PlatoCarta";
import { MARCA } from "@/data/marca";
import { registrarEvento } from "@/lib/analitica";
import { useHash, useMovimientoReducido } from "@/lib/hooks/navegador";
import type { GrupoConPlatos } from "@/lib/carta";

/**
 * Subpestañas dentro de un grupo (hoy, solo «Bebidas y cócteles»: Vinos,
 * Pisco Sours, Chilcanos, Clásicos, Cervezas, Sin alcohol…). Reutiliza
 * exactamente el mismo mecanismo que las pestañas principales —`hidden`
 * nativo, nunca desmontar— para heredar gratis la animación de entrada,
 * el comportamiento sin JavaScript (se ve la primera subcategoría con
 * productos) y el motivo por el que no hace falta un `useEffect`.
 *
 * Solo aparece cuando el grupo tiene más de una subcategoría con productos
 * publicados: así «Cócteles de Autor» —hoy sin ninguno confirmado— no dejó
 * una pestaña vacía, y un grupo con una sola subcategoría (o ninguna
 * subdivisión) se ve exactamente igual que antes.
 */
function Subcategorias({ categorias }: { categorias: GrupoConPlatos["categorias"] }) {
  const conProductos = categorias.filter((c) => c.platos.length > 0);
  const [activa, setActiva] = useState(conProductos[0]?.id ?? "");
  const botonesRef = useRef<Array<HTMLButtonElement | null>>([]);
  const seleccionada = conProductos.find((c) => c.id === activa) ?? conProductos[0];

  function alPulsarTecla(evento: KeyboardEvent<HTMLButtonElement>, indice: number) {
    const total = conProductos.length;
    let siguiente: number | null = null;
    switch (evento.key) {
      case "ArrowRight":
        siguiente = (indice + 1) % total;
        break;
      case "ArrowLeft":
        siguiente = (indice - 1 + total) % total;
        break;
      case "Home":
        siguiente = 0;
        break;
      case "End":
        siguiente = total - 1;
        break;
      default:
        return;
    }
    evento.preventDefault();
    const categoria = conProductos[siguiente];
    if (!categoria) return;
    setActiva(categoria.id);
    botonesRef.current[siguiente]?.focus();
  }

  if (conProductos.length === 0) return null;

  return (
    <div>
      {conProductos.length > 1 ? (
        <div
          role="tablist"
          aria-label="Subcategorías"
          className="mb-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {conProductos.map((categoria, indice) => {
            const esta = categoria.id === seleccionada?.id;
            return (
              <button
                key={categoria.id}
                ref={(el) => {
                  botonesRef.current[indice] = el;
                }}
                type="button"
                role="tab"
                id={`subtab-${categoria.id}`}
                aria-selected={esta}
                aria-controls={`subpanel-${categoria.id}`}
                tabIndex={esta ? 0 : -1}
                onClick={() => setActiva(categoria.id)}
                onKeyDown={(e) => alPulsarTecla(e, indice)}
                className={[
                  "lh-inline shrink-0 whitespace-nowrap rounded-lh border px-3.5 py-2 text-[0.74rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-[180ms]",
                  esta
                    ? "border-lh-red-accion bg-lh-red-accion text-white"
                    : "border-lh-madera-600/60 text-lh-marfil/65 hover:bg-lh-marfil/10 hover:text-lh-marfil",
                ].join(" ")}
              >
                {categoria.subtitulo ?? categoria.nombre}
              </button>
            );
          })}
        </div>
      ) : null}

      {conProductos.map((categoria) => (
        <div
          key={categoria.id}
          id={`subpanel-${categoria.id}`}
          role="tabpanel"
          aria-labelledby={`subtab-${categoria.id}`}
          hidden={categoria.id !== seleccionada?.id}
          className="lh-sub-panel"
        >
          {categoria.platos.map((plato) => (
            <PlatoCarta key={plato.id} plato={plato} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Carta filtrada por categoría: solo se ve una a la vez.
 *
 * ARQUITECTURA
 * ------------
 * La categoría activa NO es un `useState` propio: se deriva del hash de
 * la URL (`useHash()`), que ya es la fuente de verdad que usa el resto
 * del sitio para enlazar a una categoría concreta (`/carta#piqueos`,
 * `/carta#bebidas`…). Derivarlo evita el patrón «leer el hash dentro de
 * un efecto y llamar a setState», que tanto desincroniza la hidratación
 * como dispara el aviso de ESLint sobre renders en cascada.
 *
 * Cambiar de categoría no actualiza ningún estado de React: solo mueve
 * el hash con `history.replaceState` (sin el salto que sí provoca
 * `location.hash = …`) y despacha un `hashchange` manual para que
 * `useHash()` se entere. El propio hook de React ya garantiza que esa
 * corrección llegue antes de pintar, así que no hay parpadeo.
 *
 * SEO Y SIN JAVASCRIPT
 * ---------------------
 * Los 9 grupos —y sus platos— se renderizan SIEMPRE en el HTML del
 * servidor. Lo único que cambia es el atributo `hidden` nativo del panel
 * que no corresponde a la categoría activa. Un rastreador (o el propio
 * JSON-LD `Menu`, que ya lista todo con independencia de esta interfaz)
 * sigue viendo la carta completa; un visitante sin JavaScript ve la
 * categoría por defecto («Cortes») con todos sus platos, que es el
 * comportamiento que pide el encargo para la primera visita.
 *
 * RENDIMIENTO
 * -----------
 * Como ningún panel se desmonta ni se vuelve a montar al cambiar de
 * categoría (solo se alterna `hidden`), las imágenes ya cargadas no se
 * repiten y no hay coste de reconciliación de React en cada cambio: es
 * el enfoque más barato posible sin sacrificar el HTML completo.
 */
export function CartaPorCategorias({ grupos }: { grupos: GrupoConPlatos[] }) {
  const prefiereReducido = useMovimientoReducido();
  const hash = useHash();

  // «Cortes» por defecto; si no existiera, la primera categoría real.
  const grupoPorDefecto = grupos.find((g) => g.id === "grill") ?? grupos[0];
  const idPorDefecto = grupoPorDefecto?.id ?? "";
  const activo = hash && grupos.some((g) => g.id === hash) ? hash : idPorDefecto;

  const tablistRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const botonesRef = useRef<Array<HTMLButtonElement | null>>([]);
  const primeraVez = useRef(true);

  function irA(id: string) {
    if (id === activo) return;
    const url = `${window.location.pathname}${window.location.search}#${id}`;
    window.history.replaceState(null, "", url);
    // `replaceState` no dispara `hashchange`: lo despachamos nosotros
    // para que `useHash()` recalcule la categoría activa.
    window.dispatchEvent(new Event("hashchange"));
    registrarEvento("cambiar_categoria_carta", { categoria: id });
  }

  function alPulsarTecla(evento: KeyboardEvent<HTMLButtonElement>, indice: number) {
    const total = grupos.length;
    let siguiente: number | null = null;
    switch (evento.key) {
      case "ArrowRight":
        siguiente = (indice + 1) % total;
        break;
      case "ArrowLeft":
        siguiente = (indice - 1 + total) % total;
        break;
      case "Home":
        siguiente = 0;
        break;
      case "End":
        siguiente = total - 1;
        break;
      default:
        return;
    }
    evento.preventDefault();
    const grupo = grupos[siguiente];
    if (!grupo) return;
    irA(grupo.id);
    botonesRef.current[siguiente]?.focus();
  }

  // Mantiene la pestaña activa visible dentro de la tira horizontal móvil.
  useEffect(() => {
    const contenedor = tablistRef.current;
    const boton = contenedor?.querySelector<HTMLElement>(`[data-grupo="${activo}"]`);
    if (!contenedor || !boton) return;
    const centro = boton.offsetLeft + boton.offsetWidth / 2 - contenedor.clientWidth / 2;
    contenedor.scrollTo({
      left: Math.max(0, centro),
      behavior: prefiereReducido ? "auto" : "smooth",
    });
  }, [activo, prefiereReducido]);

  // Recoloca el listado cuando conviene: siempre al llegar con un hash
  // distinto del de por defecto (enlace desde otra página o recarga con
  // `/carta#bebidas`), y solo si hace falta en los cambios posteriores
  // (si el usuario ya se había desplazado dentro del listado).
  useEffect(() => {
    const nodo = navRef.current;
    if (!nodo) return;

    const esLlegada = primeraVez.current;
    primeraVez.current = false;

    const haceFalta = esLlegada
      ? activo !== idPorDefecto
      : window.scrollY > nodo.offsetTop + 16;

    if (!haceFalta) return;
    requestAnimationFrame(() => {
      nodo.scrollIntoView({
        behavior: prefiereReducido ? "auto" : "smooth",
        block: "start",
      });
    });
    // Esta corrección solo depende de la categoría activa; `idPorDefecto`
    // y `prefiereReducido` se leen con su valor más reciente en cada
    // ejecución sin necesidad de volver a dispararla por ellos solos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo]);

  return (
    <div>
      {/* Pestañas / filtros */}
      <nav
        ref={navRef}
        aria-label="Categorías de la carta"
        className="sticky top-[4.4rem] z-30 -mx-[clamp(1.125rem,4vw,2.5rem)] border-y border-lh-madera-600/60 bg-lh-carbon/94 backdrop-blur-md"
      >
        <div
          ref={tablistRef}
          role="tablist"
          aria-orientation="horizontal"
          className="flex gap-1 overflow-x-auto px-[clamp(1.125rem,4vw,2.5rem)] py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-center"
        >
          {grupos.map((grupo, indice) => {
            const seleccionado = activo === grupo.id;
            return (
              <button
                key={grupo.id}
                ref={(el) => {
                  botonesRef.current[indice] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${grupo.id}`}
                data-grupo={grupo.id}
                aria-selected={seleccionado}
                aria-controls={`panel-${grupo.id}`}
                tabIndex={seleccionado ? 0 : -1}
                onClick={() => irA(grupo.id)}
                onKeyDown={(e) => alPulsarTecla(e, indice)}
                className={[
                  "lh-inline shrink-0 whitespace-nowrap rounded-lh px-3.5 py-2 text-[0.76rem] font-semibold uppercase tracking-[0.13em] transition-colors duration-[180ms]",
                  seleccionado
                    ? "bg-lh-red-accion text-white"
                    : "text-lh-marfil/60 hover:bg-lh-marfil/10 hover:text-lh-marfil",
                ].join(" ")}
              >
                {grupo.nombreCorto}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Paneles: todos presentes en el HTML, solo uno visible */}
      <div className="mt-12 lg:mt-16">
        {grupos.map((grupo, indice) => {
          const seleccionado = activo === grupo.id;
          return (
            <section
              key={grupo.id}
              id={grupo.id}
              role="tabpanel"
              aria-labelledby={`tab-${grupo.id}`}
              hidden={!seleccionado}
              className={[
                "lh-carta-panel scroll-mt-36 overflow-hidden rounded-lh-lg border p-6 sm:p-8 lg:p-10",
                indice % 2 === 0
                  ? "border-lh-madera-600/55 bg-lh-madera-800/55 veta-madera"
                  : "border-lh-madera-700/50 bg-lh-carbon-800/70",
              ].join(" ")}
            >
              <header className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-lh-red/45 pb-5">
                <div>
                  <p className="eyebrow mb-2 text-lh-ambar-claro">
                    {String(indice + 1).padStart(2, "0")}
                  </p>
                  <h2 className="text-display-sm font-normal text-lh-marfil">{grupo.nombre}</h2>
                  {grupo.descripcion ? (
                    <p className="mt-2.5 max-w-2xl text-[0.92rem] leading-relaxed text-lh-marfil/60">
                      {grupo.descripcion}
                    </p>
                  ) : null}
                </div>
                {grupo.totalPlatos > 0 ? (
                  <p className="shrink-0 text-[0.75rem] uppercase tracking-[0.14em] text-lh-marfil/60">
                    {grupo.totalPlatos} {grupo.totalPlatos === 1 ? "plato" : "platos"}
                  </p>
                ) : null}
              </header>

              {grupo.sinCartaPublicada ? (
                <div className="rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-6 sm:p-8">
                  <p className="max-w-2xl text-[0.95rem] leading-relaxed text-lh-marfil/72">
                    {grupo.notaSinCarta}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <BotonExterno href={MARCA.enlaces.reservas} variante="secundario">
                      Reservar mesa
                    </BotonExterno>
                    <BotonExterno href={MARCA.contacto.whatsappUrl} variante="fantasma">
                      Preguntar por WhatsApp
                    </BotonExterno>
                  </div>
                </div>
              ) : grupo.id === "bebidas" ? (
                <Subcategorias categorias={grupo.categorias} />
              ) : (
                <div className="space-y-10">
                  {grupo.categorias
                    .filter((c) => c.platos.length > 0)
                    .map((categoria) => (
                      <div key={categoria.id}>
                        {categoria.subtitulo ? (
                          <h3 className="eyebrow mb-4 text-lh-ambar-claro">
                            {categoria.subtitulo}
                          </h3>
                        ) : null}
                        <div>
                          {categoria.platos.map((plato) => (
                            <PlatoCarta key={plato.id} plato={plato} />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
