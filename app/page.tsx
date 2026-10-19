import type { Metadata } from "next";

import { HeroCinematico } from "@/components/sections/HeroCinematico";
import { SeccionCarta } from "@/components/sections/SeccionCarta";
import { SeccionHistoria } from "@/components/sections/SeccionHistoria";
import { SeccionCortes } from "@/components/sections/SeccionCortes";
import { SeccionCompartir } from "@/components/sections/SeccionCompartir";
import { SeccionBebidas } from "@/components/sections/SeccionBebidas";
import { SeccionLocales } from "@/components/sections/SeccionLocales";
import { SeccionExperiencias } from "@/components/sections/SeccionExperiencias";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { construirMetadata } from "@/lib/seo";

export const metadata: Metadata = construirMetadata({
  titulo: "LongHorn Perú | Carnes, Parrillas y Restaurantes",
  descripcion:
    "Restaurante de carnes, parrillas y cócteles con 13 locales en todo el Perú. Descubre nuestra carta, encuentra tu local y reserva mesa.",
  ruta: "/",
  imagen: "/videos/hero-portada-fuego-poster.webp",
  imagenAlt: "Corte de res sellándose sobre la parrilla LongHorn",
});

export default function Inicio() {
  return (
    <>
      <HeroCinematico />
      <SeccionCarta />
      <SeccionHistoria />
      <SeccionCortes />
      <SeccionCompartir />
      <SeccionBebidas />
      <SeccionLocales />
      <SeccionExperiencias />
      <CtaFinal />
    </>
  );
}
