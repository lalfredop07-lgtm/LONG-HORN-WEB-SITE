import Link from "next/link";

import { MARCA } from "@/data/marca";
import { NAV_FOOTER } from "@/data/navegacion";
import { Logo } from "@/components/ui/Logo";

function IconoRed({ nombre }: { nombre: string }) {
  const comun = { viewBox: "0 0 24 24", "aria-hidden": true as const, className: "h-5 w-5" };
  if (nombre === "Instagram") {
    return (
      <svg {...comun} fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg {...comun} fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

export function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="relative border-t border-lh-madera-700/60 bg-lh-carbon-800 veta-madera">
      <div className="contenedor-ancho py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          {/* Marca */}
          <div>
            <Logo alto={64} className="h-16 w-auto" />
            <p className="mt-6 max-w-sm text-apunte leading-relaxed text-lh-marfil/60">
              {MARCA.descripcionOficial}
            </p>

            <div className="mt-7 flex items-center gap-3">
              {MARCA.redes.map((red) => (
                <a
                  key={red.nombre}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-lh-madera-600 text-lh-marfil/70 transition-colors hover:border-lh-red hover:text-lh-red"
                >
                  <span className="solo-lectores">
                    {red.nombre} de LongHorn Perú ({red.usuario})
                  </span>
                  <IconoRed nombre={red.nombre} />
                </a>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div className="grid gap-10 sm:grid-cols-3">
            {NAV_FOOTER.map((columna) => (
              <nav key={columna.titulo} aria-label={columna.titulo}>
                <h2 className="eyebrow mb-5 font-sans text-lh-ambar-claro">{columna.titulo}</h2>
                <ul className="space-y-3">
                  {columna.enlaces.map((enlace) => (
                    <li key={enlace.href}>
                      <Link
                        href={enlace.href}
                        className="lh-inline text-apunte text-lh-marfil/70 transition-colors hover:text-lh-marfil"
                      >
                        {enlace.etiqueta}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Contacto directo */}
        <div className="mt-14 grid gap-4 border-t border-lh-madera-700/60 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="eyebrow mb-1.5 text-lh-marfil/60">WhatsApp</p>
            <a
              href={MARCA.contacto.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lh-inline text-apunte text-lh-marfil/85 transition-colors hover:text-lh-red"
            >
              {MARCA.contacto.whatsapp}
            </a>
          </div>
          <div>
            <p className="eyebrow mb-1.5 text-lh-marfil/60">Central</p>
            <a
              href="tel:+5114213916"
              className="lh-inline text-apunte text-lh-marfil/85 transition-colors hover:text-lh-red"
            >
              {MARCA.contacto.telefonoCentral}
            </a>
          </div>
          <div>
            <p className="eyebrow mb-1.5 text-lh-marfil/60">Pedidos</p>
            <a
              href={MARCA.enlaces.pedidos}
              target="_blank"
              rel="noopener noreferrer"
              className="lh-inline text-apunte text-lh-marfil/85 transition-colors hover:text-lh-red"
            >
              Delivery y recojo
            </a>
          </div>
          <div>
            <p className="eyebrow mb-1.5 text-lh-marfil/60">Sede corporativa</p>
            <p className="text-apunte text-lh-marfil/85">{MARCA.sedeCorporativa}</p>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-10 flex flex-col gap-4 border-t border-lh-madera-700/60 pt-8 text-[0.75rem] text-lh-marfil/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} {MARCA.nombreCompleto}. Todos los derechos reservados.
          </p>
          <p>
            Reservas y pedidos gestionados por{" "}
            <a
              href="https://www.mesa247.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className="lh-inline underline underline-offset-4 transition-colors hover:text-lh-marfil"
            >
              mesa 24/7
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
