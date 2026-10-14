"use client";

import { useState } from "react";
import Link from "next/link";

import type { Local } from "@/lib/schemas";
import { MARCA } from "@/data/marca";

/**
 * Paso previo a la reserva.
 *
 * LongHorn gestiona sus reservas en mesa 24/7. Aquí NO se construye un
 * sistema de reservas paralelo ni se muestra ninguna confirmación: solo
 * se elige el local y se entrega al usuario al flujo oficial, diciéndolo
 * de forma explícita.
 */
export function SelectorReserva({ locales }: { locales: Local[] }) {
  const [slug, setSlug] = useState("");
  const elegido = locales.find((l) => l.slug === slug);

  const porCiudad = locales.reduce<Record<string, Local[]>>((acc, local) => {
    (acc[local.ciudad] ??= []).push(local);
    return acc;
  }, {});

  return (
    <div className="rounded-lh-lg border border-lh-madera-600/70 bg-lh-carbon-800 p-6 sm:p-8 lg:p-10">
      <div className="max-w-xl">
        <label htmlFor="local-reserva" className="eyebrow mb-3 block text-lh-ambar-claro">
          1. Elige tu local
        </label>
        <select
          id="local-reserva"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-lh border border-lh-madera-500 bg-lh-carbon px-4 py-3.5 text-lh-marfil transition-colors hover:border-lh-madera-300 focus:border-lh-ambar"
        >
          <option value="">Selecciona un restaurante…</option>
          {Object.entries(porCiudad).map(([ciudad, lista]) => (
            <optgroup key={ciudad} label={ciudad}>
              {lista.map((local) => (
                <option key={local.slug} value={local.slug}>
                  {local.nombreCorto} — {local.distrito}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="mt-8 border-t border-lh-madera-600/60 pt-8" aria-live="polite">
        <p className="eyebrow mb-3 text-lh-ambar-claro">2. Completa tu reserva</p>

        {!elegido ? (
          <p className="text-apunte leading-relaxed text-lh-marfil/60">
            Selecciona un local para continuar.
          </p>
        ) : elegido.urlReservas ? (
          <div>
            <p className="max-w-xl text-[0.95rem] leading-relaxed text-lh-marfil/75">
              Vas a reservar en <strong className="text-lh-marfil">{elegido.nombre}</strong> (
              {elegido.direccion}). El siguiente paso se completa en el sistema oficial de reservas
              de LongHorn, donde elegirás fecha, hora y número de personas.
            </p>
            <p className="mt-3 text-[0.78rem] leading-relaxed text-lh-marfil/60">
              Tu reserva solo queda confirmada cuando ese sistema te lo indique y te envíe el correo
              de confirmación. Desde esta página no se confirma ninguna reserva.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={elegido.urlReservas}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-13 items-center gap-2.5 rounded-lh bg-lh-red-accion px-8 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-lh-red-profundo"
              >
                Reservar en {elegido.nombreCorto}
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                  <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="solo-lectores">(se abre en una pestaña nueva)</span>
              </a>
              <Link
                href={`/locales/${elegido.slug}`}
                className="inline-flex min-h-13 items-center rounded-lh border border-lh-marfil/30 px-6 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-lh-marfil transition-colors hover:border-lh-marfil/70"
              >
                Ver el local
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="max-w-xl text-[0.95rem] leading-relaxed text-lh-marfil/75">
              <strong className="text-lh-marfil">{elegido.nombre}</strong> todavía no admite reserva
              online en el sistema oficial de LongHorn. Para reservar en esta sede, escríbenos por
              WhatsApp y te atenderemos directamente.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={MARCA.contacto.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-13 items-center rounded-lh bg-lh-red-accion px-8 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-lh-red-profundo"
              >
                Escribir por WhatsApp
              </a>
              <Link
                href={`/locales/${elegido.slug}`}
                className="inline-flex min-h-13 items-center rounded-lh border border-lh-marfil/30 px-6 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-lh-marfil transition-colors hover:border-lh-marfil/70"
              >
                Ver el local
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
