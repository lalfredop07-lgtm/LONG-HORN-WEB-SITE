import type { Metadata } from "next";

import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { Rojo } from "@/components/ui/Resaltado";
import { PREGUNTAS } from "@/data/faq";
import { construirMetadata, jsonLdMigas } from "@/lib/seo";

export const metadata: Metadata = construirMetadata({
  titulo: "Preguntas frecuentes | LongHorn Perú",
  descripcion:
    "Resolvemos las dudas más habituales sobre reservas, carta, precios, delivery, horarios y locales de LongHorn Perú.",
  ruta: "/preguntas-frecuentes",
});

export default function PaginaFaq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PREGUNTAS.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };

  return (
    <>
      <CabeceraPagina
        eyebrow="Preguntas frecuentes"
        titulo={<>Lo que más nos <Rojo>preguntan.</Rojo></>}
        migas={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: "Preguntas frecuentes", ruta: "/preguntas-frecuentes" },
        ]}
      />

      <section className="contenedor py-seccion-sm">
        <div className="divide-y divide-lh-madera-600/50 border-y border-lh-madera-600/50">
          {PREGUNTAS.map((p) => (
            <details key={p.pregunta} className="group py-1">
              <summary className="flex cursor-pointer items-center justify-between gap-5 py-5 font-sans text-[1rem] font-semibold text-lh-marfil transition-colors hover:text-lh-ambar-claro [&::-webkit-details-marker]:hidden">
                {p.pregunta}
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-lh-madera-400 transition-transform duration-[180ms] group-open:rotate-45"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-prose pb-6 text-[0.95rem] leading-relaxed text-lh-marfil/70">
                {p.respuesta}
              </p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            jsonLd,
            jsonLdMigas([
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Preguntas frecuentes", ruta: "/preguntas-frecuentes" },
            ]),
          ]),
        }}
      />
    </>
  );
}
