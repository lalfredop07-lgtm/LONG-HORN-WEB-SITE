"use client";

import { useEffect, useState } from "react";

/** Botón flotante para volver al inicio en páginas largas (carta, locales). */
export function VolverArriba() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alLeer = () => setVisible(window.scrollY > 1400);
    alLeer();
    window.addEventListener("scroll", alLeer, { passive: true });
    return () => window.removeEventListener("scroll", alLeer);
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={[
        "fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full",
        "border border-lh-madera-400 bg-lh-carbon/92 text-lh-marfil shadow-lh-md backdrop-blur",
        "transition-all duration-[420ms] ease-lh hover:border-lh-red hover:text-lh-red",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      ].join(" ")}
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
    >
      <span className="solo-lectores">Volver arriba</span>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M12 19V5m0 0-6 6m6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
