"use client";

import Link from "next/link";
import { useState } from "react";

import {
  CLAVE_CONSENTIMIENTO,
  guardarConsentimiento,
  type Consentimiento,
} from "@/lib/analitica";
import { useAlmacenamientoLocal } from "@/lib/hooks/navegador";
import { HAY_ANALITICA } from "@/lib/site";

/**
 * Aviso de cookies.
 *
 * Solo aparece si hay analítica configurada: sin ella el sitio no instala
 * cookies no esenciales y pedir consentimiento sería ruido. Rechazar es
 * tan fácil como aceptar, y el sitio funciona igual en ambos casos.
 */
export function AvisoCookies() {
  const consentimiento = useAlmacenamientoLocal(CLAVE_CONSENTIMIENTO);
  const [respondidoAhora, setRespondidoAhora] = useState(false);

  const responder = (valor: Consentimiento) => {
    guardarConsentimiento(valor);
    window.dispatchEvent(new Event(CLAVE_CONSENTIMIENTO));
    setRespondidoAhora(true);
  };

  // Solo se pregunta si hay analítica configurada y no hay respuesta previa.
  const visible = HAY_ANALITICA && consentimiento === null && !respondidoAhora;
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="titulo-cookies"
      aria-describedby="texto-cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-lh-madera-600 bg-lh-carbon/97 backdrop-blur-md"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0px)" }}
    >
      <div className="contenedor-ancho flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="max-w-2xl">
          <h2 id="titulo-cookies" className="font-sans text-[0.9rem] font-bold text-lh-marfil">
            Cookies de medición
          </h2>
          <p id="texto-cookies" className="mt-1.5 text-apunte leading-relaxed text-lh-marfil/65">
            Usamos cookies de analítica para entender cómo se usa la web. Son opcionales: si las
            rechazas, el sitio funciona exactamente igual. Más detalle en la{" "}
            <Link href="/cookies" className="lh-inline underline underline-offset-4 hover:text-lh-marfil">
              política de cookies
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => responder("rechazado")}
            className="min-h-11 flex-1 rounded-lh border border-lh-marfil/30 px-5 text-[0.76rem] font-semibold uppercase tracking-[0.13em] text-lh-marfil transition-colors hover:border-lh-marfil/70 lg:flex-none"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => responder("aceptado")}
            className="min-h-11 flex-1 rounded-lh bg-lh-red-accion px-5 text-[0.76rem] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-lh-red-profundo lg:flex-none"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
