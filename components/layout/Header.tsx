"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { useDesplazado } from "@/lib/hooks/navegador";

import { CTA_RESERVA, NAV_PRINCIPAL } from "@/data/navegacion";
import { BotonEnlace } from "@/components/ui/Boton";
import { Logo } from "@/components/ui/Logo";
import { MenuMovil } from "@/components/layout/MenuMovil";

export function Header() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const botonMenu = useRef<HTMLButtonElement>(null);

  // La cabecera se compacta y opaca al separarse del hero.
  const desplazado = useDesplazado(24);

  // Cerrar al navegar. Se ajusta el estado durante el render (patrón
  // recomendado por React para reaccionar a un cambio de prop) en lugar de
  // usar un efecto, que provocaría un render en cascada.
  const [rutaDelMenu, setRutaDelMenu] = useState(pathname);
  if (rutaDelMenu !== pathname) {
    setRutaDelMenu(pathname);
    setMenuAbierto(false);
  }

  const cerrarMenu = useCallback(() => {
    setMenuAbierto(false);
    botonMenu.current?.focus();
  }, []);

  const esActivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 ease-lh",
        // Al aparecer (scroll hacia abajo) el fondo entra con una
        // transición suave; al volver arriba debe desaparecer de
        // inmediato, sin el mismo desvanecido, por eso la duración solo
        // se activa en el estado "desplazado".
        desplazado
          ? "border-b border-lh-madera-700/60 bg-lh-carbon/92 backdrop-blur-md transition-all duration-[420ms] supports-[backdrop-filter]:bg-lh-carbon/78"
          : "border-b-0 bg-gradient-to-b from-lh-carbon/80 to-lh-carbon/0 transition-none",
      ].join(" ")}
      data-desplazado={desplazado ? "true" : "false"}
    >
      <div className="contenedor-ancho flex items-center justify-between gap-6 py-3 lg:py-4">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center transition-opacity hover:opacity-85"
          aria-label="LongHorn Grill & Drinks — ir al inicio"
        >
          <Logo
            alto={desplazado ? 38 : 46}
            prioridad
            className="h-[38px] w-auto transition-[height] duration-[420ms] ease-lh lg:h-auto"
          />
        </Link>

        {/* Navegación de escritorio */}
        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_PRINCIPAL.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  aria-current={esActivo(enlace.href) ? "page" : undefined}
                  className="group relative inline-block py-2 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.17em] text-lh-marfil/82 transition-colors hover:text-lh-marfil"
                >
                  {enlace.etiqueta}
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-lh-red transition-transform duration-[180ms] ease-lh",
                      esActivo(enlace.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    ].join(" ")}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* En móvil el CTA se mantiene visible pero compacto: a 320 px
              conviven logotipo, botón y menú sin que nada se parta. */}
          <BotonEnlace
            href={CTA_RESERVA.href}
            className="whitespace-nowrap px-3.5 text-[0.68rem] xs:px-5 sm:px-6 sm:text-[0.78rem]"
          >
            <span className="sm:hidden">Reservar</span>
            <span className="hidden sm:inline">{CTA_RESERVA.etiqueta}</span>
          </BotonEnlace>

          <button
            ref={botonMenu}
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            className="flex h-11 w-11 items-center justify-center rounded-lh text-lh-marfil transition-colors hover:bg-lh-marfil/10 lg:hidden"
          >
            <span className="solo-lectores">{menuAbierto ? "Cerrar menú" : "Abrir menú"}</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
              <path
                d={menuAbierto ? "M6 6l12 12M18 6L6 18" : "M3 6h18M3 12h18M3 18h18"}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <MenuMovil abierto={menuAbierto} alCerrar={cerrarMenu} rutaActual={pathname} />
    </header>
  );
}
