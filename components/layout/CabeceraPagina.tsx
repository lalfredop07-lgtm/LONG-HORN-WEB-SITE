import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  eyebrow?: string;
  titulo: ReactNode;
  descripcion?: ReactNode;
  migas?: { nombre: string; ruta: string }[];
};

/** Cabecera común de las páginas interiores. */
export function CabeceraPagina({ eyebrow, titulo, descripcion, migas }: Props) {
  return (
    <section className="border-b border-lh-madera-700/50 bg-lh-carbon pb-12 pt-32 lg:pb-14 lg:pt-40">
      <div className="contenedor-ancho">
        {migas && migas.length > 0 ? (
          <nav aria-label="Migas de pan" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[0.75rem] uppercase tracking-[0.13em] text-lh-marfil/60">
              {migas.map((miga, i) => (
                <li key={miga.ruta} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden="true">/</span> : null}
                  {i === migas.length - 1 ? (
                    <span aria-current="page" className="text-lh-marfil/80">{miga.nombre}</span>
                  ) : (
                    <Link href={miga.ruta} className="lh-inline transition-colors hover:text-lh-marfil">
                      {miga.nombre}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? <p className="eyebrow mb-4 text-lh-ambar-claro">{eyebrow}</p> : null}
        <h1 className="max-w-3xl text-display-lg font-normal text-lh-marfil">{titulo}</h1>
        {descripcion ? (
          <div className="mt-5 max-w-2xl text-cuerpo-lg leading-relaxed text-lh-marfil/75">
            {descripcion}
          </div>
        ) : null}
      </div>
    </section>
  );
}
