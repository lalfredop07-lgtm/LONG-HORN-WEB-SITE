"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import {
  DISTANCIA_RELEVO_LOGO,
  useDesplazado,
  useMovimientoReducido,
  useProgresoScroll,
} from "@/lib/hooks/navegador";

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

  // Solo en inicio: el hero ya tiene su propio logotipo grande y centrado
  // como titular, así que el del header entra recién al hacer scroll — ver
  // la nota en HeroCinematico. En el resto de páginas, visible siempre.
  const enInicio = pathname === "/";
  const progresoLogo = useProgresoScroll(DISTANCIA_RELEVO_LOGO);
  const opacidadLogo = enInicio ? progresoLogo : 1;
  const movimientoReducido = useMovimientoReducido();

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
    // Fragment, no anidado: MenuMovil debe ser hermano de <header>, no su
    // hijo. Como hijo, su `position: fixed` con z-40 crea una capa dentro
    // del contexto de apilamiento propio del header y termina pintándose
    // por encima del logo y el botón de cerrar (z-50 solo gana frente al
    // resto de la página, no frente a sus propios descendientes
    // posicionados). Como hermano, ambos compiten en el mismo contexto de
    // apilamiento de <body> y el z-50 del header gana de verdad.
    <>
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
            // Ya en inicio, un <Link> normal no hace nada: la ruta no
            // cambia. El cliente quiere que el logo «reinicie» la portada,
            // pero sin el parpadeo de una recarga real: en vez de eso,
            // sube con scroll suave y avisa al hero (evento
            // `inicio:reiniciar`, escuchado en HeroCinematico) para que
            // repita su animación de entrada — mismo deslizamiento hacia
            // arriba que al cargar la página la primera vez.
            //
            // Viniendo de OTRA página, no hace falta nada especial aquí:
            // el <Link> navega de verdad, HeroCinematico se monta desde
            // cero en la ruta nueva y su animación de entrada ya se
            // reproduce sola, como la primera vez.
            onClick={(e) => {
              if (enInicio) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: movimientoReducido ? "auto" : "smooth" });
                window.dispatchEvent(new Event("inicio:reiniciar"));
              }
            }}
            className="flex min-h-11 shrink-0 items-center transition-opacity hover:opacity-85"
            aria-label="LongHorn Grill & Drinks — ir al inicio"
          >
            <Logo
              alto={desplazado ? 38 : 46}
              prioridad
              className="h-[38px] w-auto transition-[height] duration-[420ms] ease-lh lg:h-auto"
              style={{ opacity: opacidadLogo }}
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
                conviven logotipo, botón y menú sin que nada se parta. Con el
                menú abierto se oculta: ya está el mismo CTA dentro del
                propio menú y repetirlo en la barra es redundante. */}
            {!menuAbierto && (
              <BotonEnlace
                href={CTA_RESERVA.href}
                className="whitespace-nowrap px-3.5 text-[0.68rem] xs:px-5 sm:px-6 sm:text-[0.78rem]"
              >
                <span className="sm:hidden">Reservar</span>
                <span className="hidden sm:inline">{CTA_RESERVA.etiqueta}</span>
              </BotonEnlace>
            )}

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
      </header>

      <MenuMovil abierto={menuAbierto} alCerrar={cerrarMenu} rutaActual={pathname} />
    </>
  );
}
