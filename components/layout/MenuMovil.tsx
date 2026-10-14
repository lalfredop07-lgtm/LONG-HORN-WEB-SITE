"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { CTA_RESERVA, NAV_PRINCIPAL } from "@/data/navegacion";
import { MARCA } from "@/data/marca";
import { BotonEnlace, BotonExterno } from "@/components/ui/Boton";
import { Isotipo } from "@/components/ui/Logo";

type Props = {
  abierto: boolean;
  alCerrar: () => void;
  rutaActual: string;
};

/**
 * Navegación móvil a pantalla completa.
 *
 * No es una miniatura del menú de escritorio: usa jerarquía propia,
 * tipografía display, áreas táctiles amplias y accesos directos a las
 * acciones que de verdad importan en el móvil (reservar, pedir, llamar).
 */
export function MenuMovil({ abierto, alCerrar, rutaActual }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  // Bloquea el scroll del documento mientras el menú está abierto.
  useEffect(() => {
    if (!abierto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [abierto]);

  // Cierre con Escape y foco atrapado dentro del panel.
  useEffect(() => {
    if (!abierto) return;

    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        alCerrar();
        return;
      }
      if (evento.key !== "Tab" || !panel.current) return;

      const focusables = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const primero = focusables[0]!;
      const ultimo = focusables[focusables.length - 1]!;

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", alPulsar);
    // El primer enlace recibe el foco al abrir.
    const t = window.setTimeout(() => {
      panel.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 90);

    return () => {
      document.removeEventListener("keydown", alPulsar);
      window.clearTimeout(t);
    };
  }, [abierto, alCerrar]);

  return (
    // El rol de diálogo vive en el panel que realmente ocupa la pantalla:
    // un contenedor sin dimensiones se considera invisible para la API de
    // accesibilidad (y para las pruebas).
    <div
      id="menu-movil"
      ref={panel}
      role="dialog"
      aria-modal={abierto || undefined}
      aria-label="Menú de navegación"
      hidden={!abierto}
      className="fixed inset-0 top-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-lh-carbon lg:hidden"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 4.75rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)",
      }}
    >
      <div className="contents">
        {/* Resplandor de brasa como fondo, muy contenido */}
        <div aria-hidden="true" className="resplandor-brasa pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-45" />

        <nav aria-label="Navegación móvil" className="relative contenedor flex-1">
          <ul className="divide-y divide-lh-madera-700/50 border-y border-lh-madera-700/50">
            {NAV_PRINCIPAL.map((enlace, i) => {
              const activo =
                enlace.href === "/" ? rutaActual === "/" : rutaActual.startsWith(enlace.href);
              return (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    aria-current={activo ? "page" : undefined}
                    className="flex items-baseline gap-4 py-5 transition-colors active:bg-lh-marfil/5"
                  >
                    {/* Numeración decorativa: fuera del nombre accesible del
                        enlace, que debe ser solo el nombre de la sección. */}
                    <span aria-hidden="true" className="eyebrow w-7 shrink-0 text-lh-ambar-claro/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={[
                        "font-display text-display-sm leading-none",
                        activo ? "text-lh-red" : "text-lh-marfil",
                      ].join(" ")}
                    >
                      {enlace.etiqueta}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 grid gap-3">
            <BotonEnlace href={CTA_RESERVA.href} tamano="lg" className="w-full">
              {CTA_RESERVA.etiqueta}
            </BotonEnlace>
            <BotonExterno href={MARCA.enlaces.pedidos} variante="secundario" tamano="lg" className="w-full">
              Pedir delivery
            </BotonExterno>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 text-apunte text-lh-marfil/60">
            <a
              href={MARCA.contacto.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-lh-marfil"
            >
              WhatsApp {MARCA.contacto.whatsapp}
            </a>
            <Isotipo ancho={44} className="opacity-25" />
          </div>
        </nav>
      </div>
    </div>
  );
}
