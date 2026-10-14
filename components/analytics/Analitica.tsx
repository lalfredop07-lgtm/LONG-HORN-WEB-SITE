"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import { CLAVE_CONSENTIMIENTO, leerConsentimiento } from "@/lib/analitica";
import { GA_MEASUREMENT_ID, HAY_ANALITICA } from "@/lib/site";

/**
 * Carga Google Analytics 4 únicamente si:
 *   1. hay un Measurement ID configurado, y
 *   2. la persona ha aceptado las cookies no esenciales.
 *
 * Sin ambas cosas no se descarga ni un byte de Google.
 */
export function Analitica() {
  const [permitido, setPermitido] = useState(false);

  useEffect(() => {
    const comprobar = () => setPermitido(leerConsentimiento() === "aceptado");
    comprobar();
    // El aviso de cookies emite este evento al aceptar.
    window.addEventListener(CLAVE_CONSENTIMIENTO, comprobar);
    return () => window.removeEventListener(CLAVE_CONSENTIMIENTO, comprobar);
  }, []);

  if (!HAY_ANALITICA || !permitido) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
