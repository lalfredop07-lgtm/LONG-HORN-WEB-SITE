import { Isotipo } from "@/components/ui/Logo";

/**
 * Sustituto del mapa cuando no hay clave de Google Maps configurada.
 *
 * No finge ser un mapa: explica la situación y deja claro que el
 * directorio completo sigue disponible justo al lado.
 */
export function MapaNoDisponible({ totalLocales }: { totalLocales: number }) {
  return (
    <div className="relative grid h-full min-h-[22rem] place-items-center overflow-hidden rounded-lh-md border border-dashed border-lh-madera-500 bg-lh-madera-800/55 veta-madera p-8 text-center">
      <div className="max-w-sm">
        <Isotipo ancho={64} className="mx-auto opacity-35" />
        <p className="mt-5 font-display text-titulo text-lh-marfil">
          El mapa interactivo está listo para activarse
        </p>
        <p className="mt-3 text-apunte leading-relaxed text-lh-marfil/60">
          Falta configurar la clave de Google Maps Platform. Mientras tanto, los {totalLocales}{" "}
          locales con sus direcciones y botones «Cómo llegar» están disponibles en el listado.
        </p>
      </div>
    </div>
  );
}
