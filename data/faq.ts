/**
 * Preguntas frecuentes.
 *
 * Todas las respuestas se apoyan en datos verificados (carta oficial,
 * sistema de reservas, canales públicos de LongHorn). No se inventan
 * políticas comerciales: cuando algo no está publicado, la respuesta lo
 * dice y remite al local.
 */
export type Pregunta = { pregunta: string; respuesta: string };

export const PREGUNTAS: Pregunta[] = [
  {
    pregunta: "¿Cómo reservo una mesa en LongHorn?",
    respuesta:
      "Desde la página de Reservas eliges tu local y te llevamos al sistema oficial de reservas de LongHorn, donde escoges fecha, hora y número de personas. La reserva queda confirmada cuando ese sistema te lo indica.",
  },
  {
    pregunta: "¿Cuántos restaurantes LongHorn hay en el Perú?",
    respuesta:
      "LongHorn cuenta con 13 locales a nivel nacional: ocho en Lima más San Juan de Lurigancho, y uno en Chiclayo, Piura, Cajamarca y Huancayo. Puedes verlos todos con sus direcciones en la página de Locales.",
  },
  {
    pregunta: "¿Los precios de la carta incluyen IGV?",
    respuesta:
      "Sí. Tal y como indica la carta oficial, los precios están en soles e incluyen I.G.V. y servicio. El derecho de pan y mantequilla es de S/ 3.00 por persona y no aplica a delivery ni recojo.",
  },
  {
    pregunta: "¿Qué incluye un corte de la parrilla?",
    respuesta:
      "Los cortes del Grill LongHorn incluyen una guarnición a escoger entre papas fritas, papa al horno, camote frito, camote al horno o ensalada parrillera.",
  },
  {
    pregunta: "¿Tienen opciones para compartir?",
    respuesta:
      "Sí. En la carta hay varias opciones pensadas para dos o más personas, como la Parrilla 4 Carnes, la Parrilla para 2 Personas, el Festival de Cerdo y varios cortes en formato de 600 g.",
  },
  {
    pregunta: "¿Tienen menú para niños?",
    respuesta:
      "Sí, el Menú Kids es una promoción para niños hasta 12 años con seis opciones, todas acompañadas de chicha y un huevo de chocolate Kinder.",
  },
  {
    pregunta: "¿Hay platos bajos en calorías?",
    respuesta:
      "La carta marca con un corazón los platos bajos en calorías, como las ensaladas parrilleras, el salmón a la parrilla, la dieta de pollo y varias guarniciones de verduras.",
  },
  {
    pregunta: "¿Puedo pedir a domicilio?",
    respuesta:
      "Sí. LongHorn tiene delivery y recojo en local a través de su sistema oficial de pedidos online. Ten en cuenta que el derecho de pan y mantequilla no aplica en esos canales.",
  },
  {
    pregunta: "¿Dónde puedo ver la carta de bebidas y cócteles?",
    respuesta:
      "La carta de bebidas se consulta en el restaurante. LongHorn no publica todavía la lista de cócteles, vinos y cervezas con sus precios en sus canales digitales, así que preferimos no reproducirla aquí hasta tenerla confirmada.",
  },
  {
    pregunta: "¿Cuál es el horario de los restaurantes?",
    respuesta:
      "Los horarios varían por local y por centro comercial, y LongHorn no los publica de forma centralizada. En la ficha de cada local encontrarás un enlace directo a su Google Maps, donde el horario se mantiene actualizado.",
  },
  {
    pregunta: "¿Dónde presento un reclamo?",
    respuesta:
      "En la página del Libro de Reclamaciones encontrarás el acceso al libro virtual oficial de cada una de las empresas que operan los restaurantes LongHorn, según el local que quieras reportar.",
  },
];
