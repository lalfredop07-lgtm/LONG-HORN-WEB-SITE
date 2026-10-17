/**
 * Las cinco puertas de entrada a la carta que se muestran en la portada.
 * Cada una enlaza con su sección real dentro de /carta.
 */
export type CategoriaPortada = {
  slug: string;
  nombre: string;
  gancho: string;
  href: string;
  imagen: string;
  imagenAlt: string;
  /** Clase de `object-position` cuando el recorte por defecto no funciona. */
  encuadre?: string;
};

export const CATEGORIAS_PORTADA: CategoriaPortada[] = [
  {
    slug: "cortes",
    nombre: "Cortes",
    gancho: "Los grandes protagonistas.",
    href: "/carta#grill",
    imagen: "/images/carta/bife-a-la-parrilla-flama.webp",
    imagenAlt: "Cortes de carne a la parrilla entre llamas vivas",
  },
  {
    slug: "parrillas",
    nombre: "Parrillas",
    gancho: "El auténtico sabor a la brasa.",
    href: "/carta#mas-del-grill",
    imagen: "/images/carta/parrilla-para-compartir-nueva.webp",
    imagenAlt: "Parrilla LongHorn para compartir con anticuchos, pollo, papas y ensalada",
  },
  {
    slug: "piqueos",
    nombre: "Entradas y piqueos",
    gancho: "El inicio perfecto.",
    href: "/carta#piqueos",
    imagen: "/images/carta/anticuchos-de-corazon.webp",
    imagenAlt: "Anticuchos de corazón LongHorn con choclo, papa a la parrilla y salsas",
  },
  {
    slug: "pastas",
    nombre: "Pastas y especialidades",
    gancho: "Recetas que sorprenden.",
    href: "/carta#pastas",
    imagen: "/images/carta/lomo-con-fettuccini-pesto.webp",
    imagenAlt: "Lomo a la parrilla con fettuccini al pesto y parmesano",
  },
  {
    slug: "bebidas",
    nombre: "Bebidas y cócteles",
    gancho: "Grandes sabores en cada brindis.",
    href: "/carta#bebidas",
    imagen: "/images/carta/pisco-sour-barra-v2.webp",
    imagenAlt: "Pisco sour servido en la barra de LongHorn",
  },
];
