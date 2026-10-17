"use client";

import { useEffect } from "react";

import { registrarEvento, type EventoLongHorn } from "@/lib/analitica";

/**
 * Registro de eventos por delegación.
 *
 * Un único listener en `document` detecta los clics en enlaces relevantes
 * y los traduce a eventos de negocio. Evita salpicar `onClick` por decenas
 * de componentes y garantiza que no se dupliquen eventos.
 *
 * Los enlaces pueden marcarse explícitamente con `data-evento`; el resto se
 * deduce del destino, que es información que ya está en el DOM.
 */
function deducirEvento(enlace: HTMLAnchorElement): { evento: EventoLongHorn; params: Record<string, string> } | null {
  const explicito = enlace.dataset.evento as EventoLongHorn | undefined;
  if (explicito) {
    return { evento: explicito, params: { ...(enlace.dataset.eventoLocal ? { local: enlace.dataset.eventoLocal } : {}) } };
  }

  const href = enlace.getAttribute("href") ?? "";

  if (href.startsWith("tel:")) return { evento: "clic_telefono", params: {} };
  if (href.includes("api.whatsapp.com")) return { evento: "clic_whatsapp", params: {} };
  if (href.includes("google.com/maps")) return { evento: "clic_como_llegar", params: {} };
  if (href.includes("mesa247.pe/pideonline")) return { evento: "clic_delivery", params: {} };
  if (href.includes("mesa247.pe/reservas") || href === "/reservas") {
    return { evento: "clic_reservar", params: { origen: window.location.pathname } };
  }
  if (href === "/carta" || href.startsWith("/carta#")) {
    return { evento: "ver_carta", params: { origen: window.location.pathname } };
  }
  if (/^\/locales\/[a-z-]+$/.test(href)) {
    return { evento: "seleccionar_local", params: { local: href.replace("/locales/", "") } };
  }
  return null;
}

export function RegistroEventos() {
  useEffect(() => {
    const alPulsar = (e: MouseEvent) => {
      const destino = e.target as HTMLElement | null;
      const enlace = destino?.closest?.("a");
      if (!enlace) return;
      const deducido = deducirEvento(enlace as HTMLAnchorElement);
      if (deducido) registrarEvento(deducido.evento, deducido.params);
    };

    document.addEventListener("click", alPulsar, { passive: true });
    return () => document.removeEventListener("click", alPulsar);
  }, []);

  return null;
}
