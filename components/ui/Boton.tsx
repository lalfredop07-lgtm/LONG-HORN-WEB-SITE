import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primario" | "secundario" | "fantasma";
type Tamano = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2.5 font-sans font-semibold uppercase tracking-[0.14em] " +
  "transition-[background-color,border-color,color,transform,box-shadow] duration-[180ms] ease-lh " +
  "rounded-lh no-underline text-center text-balance " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-55";

const VARIANTES: Record<Variante, string> = {
  primario:
    "bg-lh-red-accion text-white shadow-lh-sm hover:bg-lh-red-profundo hover:shadow-lh-md",
  secundario:
    "border border-lh-marfil/35 text-lh-marfil hover:border-lh-marfil/80 hover:bg-lh-marfil/10",
  fantasma: "text-lh-marfil hover:text-lh-ambar-claro",
};

const TAMANOS: Record<Tamano, string> = {
  md: "min-h-11 px-6 py-3 text-[0.78rem]",
  lg: "min-h-13 px-8 py-4 text-[0.82rem]",
};

type BotonProps = {
  variante?: Variante;
  tamano?: Tamano;
  children: ReactNode;
  className?: string;
};

/** Flecha decorativa compartida por los CTA. */
export function FlechaCta() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-[0.95em] w-[0.95em] shrink-0 transition-transform duration-[180ms] ease-lh group-hover:translate-x-1"
    >
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BotonEnlace({
  variante = "primario",
  tamano = "md",
  className = "",
  children,
  ...props
}: BotonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={`group ${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

export function BotonExterno({
  variante = "primario",
  tamano = "md",
  className = "",
  children,
  ...props
}: BotonProps & ComponentProps<"a">) {
  return (
    <a
      className={`group ${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}

export function Boton({
  variante = "primario",
  tamano = "md",
  className = "",
  children,
  ...props
}: BotonProps & ComponentProps<"button">) {
  return (
    <button className={`group ${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`} {...props}>
      {children}
    </button>
  );
}
