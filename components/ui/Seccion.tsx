import type { ElementType, ReactNode } from "react";

export function Contenedor({
  children,
  ancho = false,
  className = "",
}: {
  children: ReactNode;
  ancho?: boolean;
  className?: string;
}) {
  return <div className={`${ancho ? "contenedor-ancho" : "contenedor"} ${className}`}>{children}</div>;
}

type TituloProps = {
  eyebrow?: string;
  titulo: ReactNode;
  descripcion?: ReactNode;
  como?: ElementType;
  alineacion?: "izquierda" | "centro";
  className?: string;
  /** Tono del antetítulo: rojo de marca sobre fondos oscuros, ámbar sobre madera. */
  tonoEyebrow?: "rojo" | "ambar";
};

export function TituloSeccion({
  eyebrow,
  titulo,
  descripcion,
  como: Como = "h2",
  alineacion = "centro",
  className = "",
  tonoEyebrow = "rojo",
}: TituloProps) {
  const centro = alineacion === "centro";
  return (
    <div className={`${centro ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className}`}>
      {eyebrow ? (
        <p
          className={`eyebrow mb-4 ${tonoEyebrow === "rojo" ? "text-lh-red" : "text-lh-ambar-claro"}`}
          data-animar="eyebrow"
        >
          {eyebrow}
        </p>
      ) : null}
      <Como
        className="text-display-md font-normal text-lh-marfil"
        data-animar="titulo"
      >
        {titulo}
      </Como>
      {descripcion ? (
        <p
          className={`mt-5 text-cuerpo-lg leading-relaxed text-lh-marfil/72 ${centro ? "mx-auto max-w-prose" : ""}`}
          data-animar="parrafo"
        >
          {descripcion}
        </p>
      ) : null}
    </div>
  );
}

/** Filete corto de marca para separar bloques editoriales. */
export function Filete({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-px w-16 bg-lh-red ${className}`}
    />
  );
}
