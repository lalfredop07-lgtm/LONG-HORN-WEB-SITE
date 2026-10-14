"use client";

import { useEffect, useRef, useState } from "react";

import type { Grupo } from "@/lib/schemas";
import { registrarEvento } from "@/lib/analitica";

/**
 * Navegación por categorías de la carta.
 *
 * Es sticky bajo la cabecera y marca el grupo visible mientras se hace
 * scroll. En móvil se convierte en una tira horizontal deslizable que
 * arrastra el chip activo a la vista: no depende de hover y funciona con
 * teclado (son enlaces reales a anclas existentes).
 */
export function NavegacionCarta({ grupos }: { grupos: Grupo[] }) {
  const [activo, setActivo] = useState<string>(grupos[0]?.id ?? "");
  const tira = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const secciones = grupos
      .map((g) => document.getElementById(g.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (secciones.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibles[0]) setActivo(visibles[0].target.id);
      },
      // La banda activa es la franja superior, justo bajo la navegación.
      { rootMargin: "-140px 0px -65% 0px", threshold: 0 },
    );

    secciones.forEach((s) => observador.observe(s));
    return () => observador.disconnect();
  }, [grupos]);

  // Mantiene el chip activo visible en la tira móvil.
  useEffect(() => {
    const contenedor = tira.current;
    if (!contenedor) return;
    const chip = contenedor.querySelector<HTMLElement>(`[data-grupo="${activo}"]`);
    if (!chip) return;
    const cx = chip.offsetLeft + chip.offsetWidth / 2 - contenedor.clientWidth / 2;
    contenedor.scrollTo({ left: Math.max(0, cx), behavior: "smooth" });
  }, [activo]);

  return (
    <nav
      aria-label="Categorías de la carta"
      className="sticky top-[4.4rem] z-30 -mx-[clamp(1.125rem,4vw,2.5rem)] border-y border-lh-madera-600/60 bg-lh-carbon/94 backdrop-blur-md"
    >
      <ul
        ref={tira}
        className="flex gap-1 overflow-x-auto px-[clamp(1.125rem,4vw,2.5rem)] py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-center"
      >
        {grupos.map((grupo) => {
          const seleccionado = activo === grupo.id;
          return (
            <li key={grupo.id} className="shrink-0">
              <a
                href={`#${grupo.id}`}
                data-grupo={grupo.id}
                onClick={() => registrarEvento("cambiar_categoria_carta", { categoria: grupo.id })}
                aria-current={seleccionado ? "true" : undefined}
                className={[
                  "lh-inline block whitespace-nowrap rounded-lh px-3.5 py-2 text-[0.76rem] font-semibold uppercase tracking-[0.13em] transition-colors duration-[180ms]",
                  seleccionado
                    ? "bg-lh-red-accion text-white"
                    : "text-lh-marfil/60 hover:bg-lh-marfil/10 hover:text-lh-marfil",
                ].join(" ")}
              >
                {grupo.nombreCorto}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
