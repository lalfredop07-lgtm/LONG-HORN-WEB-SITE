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
    imagen: "/images/carta/bife-angosto.webp",
    imagenAlt: "Bife angosto LongHorn marcado a la parrilla sobre tabla de madera",
  },
  {
    slug: "parrillas",
    nombre: "Parrillas",
    gancho: "El auténtico sabor a la brasa.",
    href: "/carta#mas-del-grill",
    imagen: "/images/carta/parrilla-para-2.webp",
    imagenAlt: "Parrilla LongHorn para dos con anticuchos, chorizos y chuletas",
  },
  {
    slug: "piqueos",
    nombre: "Entradas y piqueos",
    gancho: "El inicio perfecto.",
    href: "/carta#piqueos",
    imagen: "/images/carta/alitas-de-pollo.webp",
    imagenAlt: "Alitas de pollo LongHorn glaseadas en salsa BBQ",
  },
  {
    slug: "pastas",
    nombre: "Pastas y especialidades",
    gancho: "Recetas que sorprenden.",
    href: "/carta#pastas",
    imagen: "/images/carta/fettuccini-lomo-funghi.webp",
    imagenAlt: "Fettuccini con trozos de lomo fino y hongos funghi",
  },
  {
    slug: "bebidas",
    nombre: "Bebidas y cócteles",
    gancho: "Grandes sabores en cada brindis.",
    href: "/carta#bebidas",
    imagen: "/images/marca/coctel-longhorn.webp",
    imagenAlt: "Cóctel servido en la barra de LongHorn con iluminación cálida",
    encuadre: "object-[50%_68%]",
  },
];
