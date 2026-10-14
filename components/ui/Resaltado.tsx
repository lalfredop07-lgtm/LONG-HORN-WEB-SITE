import type { ReactNode } from "react";

/**
 * Palabra o fragmento en rojo de marca dentro de un titular.
 * Mantiene el acento cromático acotado al 3 % de la superficie.
 */
export function Rojo({ children }: { children: ReactNode }) {
  return <span className="text-lh-red">{children}</span>;
}
