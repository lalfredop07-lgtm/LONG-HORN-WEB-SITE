import Image from "next/image";

type Props = {
  /** Alto en píxeles del lockup. El ancho se calcula por proporción. */
  alto?: number;
  className?: string;
  /**
   * Carga inmediata sin `<link rel="preload">`. El logotipo está sobre la
   * línea de flotación, pero precargarlo competía con la imagen que mide
   * el LCP; en modo eager se descarga igual de pronto sin adelantarse.
   */
  prioridad?: boolean;
};

/** Proporción exacta del logotipo oficial recortado (1717 × 864). */
const RATIO = 1717 / 864;

/**
 * Logotipo oficial de LongHorn.
 *
 * Se usa SIEMPRE el archivo original del cliente. No se recrea, no se
 * redibuja y no se altera su composición: solo se escala.
 */
export function Logo({ alto = 56, className, prioridad = false }: Props) {
  return (
    <Image
      src="/brand/longhorn-logo.png"
      alt="LongHorn Grill & Drinks"
      width={Math.round(alto * RATIO)}
      height={alto}
      loading={prioridad ? "eager" : "lazy"}
      className={className}
      sizes={`${Math.round(alto * RATIO)}px`}
    />
  );
}

/** Isotipo (cabeza de toro) para usos reducidos y ornamentales. */
export function Isotipo({
  ancho = 48,
  className,
  decorativo = true,
}: {
  ancho?: number;
  className?: string;
  decorativo?: boolean;
}) {
  return (
    <Image
      src="/brand/longhorn-isotipo.png"
      alt={decorativo ? "" : "LongHorn"}
      aria-hidden={decorativo || undefined}
      width={ancho}
      height={Math.round((ancho * 427) / 971)}
      className={className}
    />
  );
}
