export type EnlaceNav = {
  href: string;
  etiqueta: string;
  descripcion?: string;
};

export const NAV_PRINCIPAL: EnlaceNav[] = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/nuestra-historia", etiqueta: "Nuestra historia" },
  { href: "/carta", etiqueta: "Carta" },
  { href: "/locales", etiqueta: "Locales" },
];

export const CTA_RESERVA: EnlaceNav = { href: "/reservas", etiqueta: "Reservar mesa" };

export const NAV_FOOTER: { titulo: string; enlaces: EnlaceNav[] }[] = [
  {
    titulo: "Descubre",
    enlaces: [
      { href: "/carta", etiqueta: "Nuestra carta" },
      { href: "/nuestra-historia", etiqueta: "Nuestra historia" },
      { href: "/experiencias", etiqueta: "Experiencias" },
    ],
  },
  {
    titulo: "Visítanos",
    enlaces: [
      { href: "/locales", etiqueta: "Todos los locales" },
      { href: "/reservas", etiqueta: "Reservar mesa" },
      { href: "/contacto", etiqueta: "Contacto" },
    ],
  },
  {
    titulo: "Información",
    enlaces: [
      { href: "/preguntas-frecuentes", etiqueta: "Preguntas frecuentes" },
      { href: "/libro-de-reclamaciones", etiqueta: "Libro de Reclamaciones" },
      { href: "/privacidad", etiqueta: "Política de privacidad" },
      { href: "/terminos-y-condiciones", etiqueta: "Términos y condiciones" },
      { href: "/cookies", etiqueta: "Cookies" },
    ],
  },
];
