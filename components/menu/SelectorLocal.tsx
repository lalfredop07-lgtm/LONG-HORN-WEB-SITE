"use client";

import { useState } from "react";
import Link from "next/link";

import { localesPublicados } from "@/lib/locales";
import { useAlmacenamientoLocal } from "@/lib/hooks/navegador";

const CLAVE = "longhorn:local-preferido";

/**
 * Selector de local para la carta.
 *
 * LongHorn no publica precios diferenciados por local en ninguna fuente
 * verificable, así que esto NO cambia precios: recuerda la sede preferida
 * y adapta los enlaces de reserva y pedido. Se dice de forma explícita
 * para no dar a entender una funcionalidad que no existe.
 */
export function SelectorLocal() {
  const locales = localesPublicados();
  // La preferencia guardada manda hasta que el usuario elige otra cosa.
  const guardado = useAlmacenamientoLocal(CLAVE);
  const [elegidoManual, setElegidoManual] = useState<string | null>(null);

  const preferido = guardado && locales.some((l) => l.slug === guardado) ? guardado : "";
  const slug = elegidoManual ?? preferido;

  const alCambiar = (nuevo: string) => {
    setElegidoManual(nuevo);
    try {
      if (nuevo) window.localStorage.setItem(CLAVE, nuevo);
      else window.localStorage.removeItem(CLAVE);
      window.dispatchEvent(new Event(CLAVE));
    } catch {
      /* almacenamiento bloqueado: la elección vale para esta sesión */
    }
  };

  const elegido = locales.find((l) => l.slug === slug);

  return (
    <div className="rounded-lh-md border border-lh-madera-600/70 bg-lh-carbon-800 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label
            htmlFor="selector-local"
            className="eyebrow mb-2.5 block text-lh-ambar-claro"
          >
            Tu local
          </label>
          <select
            id="selector-local"
            value={slug}
            onChange={(e) => alCambiar(e.target.value)}
            className="w-full rounded-lh border border-lh-madera-500 bg-lh-carbon px-4 py-3 text-lh-marfil transition-colors hover:border-lh-madera-300 focus:border-lh-ambar sm:max-w-sm"
          >
            <option value="">Todos los locales</option>
            {locales.map((local) => (
              <option key={local.slug} value={local.slug}>
                {local.nombreCorto} — {local.ciudad}
              </option>
            ))}
          </select>
        </div>

        {elegido ? (
          <div className="flex flex-wrap gap-3">
            {elegido.urlReservas ? (
              <a
                href={elegido.urlReservas}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-lh bg-lh-red-accion px-5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-lh-red-profundo"
              >
                Reservar aquí
              </a>
            ) : null}
            <Link
              href={`/locales/${elegido.slug}`}
              className="inline-flex min-h-11 items-center rounded-lh border border-lh-marfil/30 px-5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-lh-marfil transition-colors hover:border-lh-marfil/70"
            >
              Ver local
            </Link>
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-[0.78rem] leading-relaxed text-lh-marfil/60">
        {elegido
          ? `Tus enlaces de reserva apuntan ahora a ${elegido.nombre}. Los precios de la carta son los mismos en toda la red; si tu local tiene alguna variación, te la confirmarán en sala.`
          : "Elige tu local para que los botones de reserva te lleven directamente a esa sede."}
      </p>
    </div>
  );
}
