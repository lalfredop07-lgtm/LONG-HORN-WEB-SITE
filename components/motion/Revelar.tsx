"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

import { useMovimientoReducido } from "@/lib/hooks/navegador";

type Desde = "abajo" | "izquierda" | "derecha" | "escala";

type Props = {
  children: ReactNode;
  /** Retardo en segundos para escalonar elementos hermanos. */
  retardo?: number;
  desde?: Desde;
  como?: ElementType;
  className?: string;
};

/**
 * Revelado progresivo al entrar en pantalla.
 *
 * Mejora progresiva: el estado oculto lo aplica el CSS **solo** bajo
 * `html.js`, clase que añade un script en línea del layout. Si el
 * JavaScript no se ejecuta (fallo de red, navegador sin JS, rastreador
 * sin renderizado), el contenido se ve desde el primer pintado.
 *
 * Solo se animan `opacity` y `transform`, que el compositor resuelve sin
 * recalcular el layout.
 */
export function Revelar({
  children,
  retardo = 0,
  desde = "abajo",
  como: Como = "div",
  className = "",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [intersectado, setIntersectado] = useState(false);
  const movimientoReducido = useMovimientoReducido();

  // Con movimiento reducido el contenido está visible sin esperar a nada.
  const visible = intersectado || movimientoReducido;

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || movimientoReducido) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) {
          setIntersectado(true);
          observador.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, [movimientoReducido]);

  return (
    <Como
      ref={ref}
      data-revelar={visible ? "visible" : "pendiente"}
      data-desde={desde}
      className={className}
      style={retardo ? ({ "--revelar-retardo": `${retardo}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Como>
  );
}
