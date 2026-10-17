import type { ReactNode } from "react";

/**
 * Envoltorio de las páginas legales.
 *
 * Incluye siempre un aviso visible de que el texto es una base de trabajo
 * pendiente de validación legal: no se presenta como documento aprobado
 * por la empresa.
 */
export function DocumentoLegal({
  children,
  pendienteValidacion = true,
}: {
  children: ReactNode;
  pendienteValidacion?: boolean;
}) {
  return (
    <section className="contenedor py-seccion-sm">
      {pendienteValidacion ? (
        <div className="mb-10 rounded-lh border-l-2 border-lh-ambar bg-lh-carbon-800 px-5 py-4">
          <p className="text-apunte leading-relaxed text-lh-marfil/70">
            <strong className="text-lh-marfil">Documento pendiente de aprobación.</strong> Este
            texto es una base técnica preparada por el equipo de desarrollo. Debe ser revisado y
            aprobado por LongHorn y su asesoría legal antes de la publicación definitiva del sitio,
            incluyendo la razón social responsable, el RUC y el domicilio fiscal.
          </p>
        </div>
      ) : null}

      <div
        className="
          max-w-lectura
          [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-titulo [&_h2]:text-lh-marfil
          [&_h3]:mt-7 [&_h3]:font-sans [&_h3]:text-[0.95rem] [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-[0.1em] [&_h3]:text-lh-ambar-claro
          [&_p]:mt-4 [&_p]:text-[0.95rem] [&_p]:leading-relaxed [&_p]:text-lh-marfil/72
          [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc [&_li]:text-[0.95rem] [&_li]:leading-relaxed [&_li]:text-lh-marfil/72
          [&_a]:text-lh-ambar-claro [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-lh-red
          [&_strong]:text-lh-marfil
        "
      >
        {children}
      </div>
    </section>
  );
}
