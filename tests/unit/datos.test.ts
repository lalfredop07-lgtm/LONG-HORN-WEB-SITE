import { describe, expect, it } from "vitest";

import { CATEGORIAS, GRUPOS, PLATOS } from "@/data/carta";
import { LOCALES } from "@/data/locales";
import { EXPERIENCIAS } from "@/data/experiencias";
import { MARCA } from "@/data/marca";
import { FUENTES } from "@/data/fuentes";
import { cartaAgrupada, formatearPrecio, totalPlatosPublicados } from "@/lib/carta";
import {
  googleMapsVerificado,
  localesConMapa,
  localesPublicados,
  telefonoHref,
  urlComoLlegar,
  urlVerEnMapa,
} from "@/lib/locales";

describe("carta", () => {
  it("contiene las 103 referencias de alimentos del PDF oficial más las 56 de bebidas (28 publicadas, 28 pendientes)", () => {
    expect(PLATOS).toHaveLength(159);
    expect(totalPlatosPublicados()).toBe(131);
    expect(PLATOS.filter((p) => p.estado === "oculto")).toHaveLength(28);
  });

  it("no pierde ningún plato publicado al agrupar para la interfaz (los ocultos no cuentan a propósito)", () => {
    const enGrupos = cartaAgrupada().reduce((n, g) => n + g.totalPlatos, 0);
    expect(enGrupos).toBe(totalPlatosPublicados());
  });

  it("asigna identificadores únicos a cada plato", () => {
    expect(new Set(PLATOS.map((p) => p.id)).size).toBe(PLATOS.length);
  });

  it("toda categoría pertenece a un grupo declarado", () => {
    const grupos = new Set(GRUPOS.map((g) => g.id));
    for (const c of CATEGORIAS) expect(grupos.has(c.grupo)).toBe(true);
  });

  it("todo plato publicado tiene fuente y fecha de verificación; si tiene precio, es positivo", () => {
    for (const p of PLATOS.filter((x) => x.estado === "publicado")) {
      if (p.precio !== undefined) expect(p.precio, `${p.nombre} precio inválido`).toBeGreaterThan(0);
      expect(FUENTES[p.fuenteId as keyof typeof FUENTES]).toBeDefined();
      expect(p.verificadoEl).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("todo plato oculto/histórico o sin precio lo documenta en notaFuente", () => {
    for (const p of PLATOS) {
      if (p.estado === "oculto" || p.precio === undefined) {
        expect(p.notaFuente, `${p.nombre} sin notaFuente`).toBeTruthy();
      }
    }
  });

  it("ningún plato histórico o pendiente de aprobación se publica", () => {
    for (const p of PLATOS) {
      if (p.estadoVerificacion === "historico" || p.estadoVerificacion === "pendiente-confirmar") {
        expect(p.estado, `${p.nombre} (${p.estadoVerificacion}) no debería estar publicado`).toBe("oculto");
      }
    }
  });

  it("el grupo de bebidas publica solo lo verificado, con subcategorías y sin huecos vacíos", () => {
    const agrupada = cartaAgrupada().find((g) => g.id === "bebidas");
    expect(agrupada?.sinCartaPublicada).toBe(false);
    expect(agrupada?.totalPlatos).toBe(28);
    // «Cócteles de Autor» no tiene ningún producto publicado: no debe
    // aparecer como subcategoría con contenido.
    const autor = agrupada?.categorias.find((c) => c.id === "bebidas-cocteles-autor");
    expect(autor?.platos.length).toBe(0);
    // El resto de subcategorías sí tienen al menos un producto.
    const conProductos = agrupada?.categorias.filter((c) => c.id !== "bebidas-cocteles-autor") ?? [];
    for (const c of conProductos) {
      expect(c.platos.length, `${c.id} sin productos`).toBeGreaterThan(0);
    }
  });

  it("formatea precios en soles", () => {
    expect(formatearPrecio(155)).toBe("S/ 155");
    expect(formatearPrecio(undefined)).toBeNull();
  });

});

describe("locales", () => {
  it("publica 13 locales, cuadrando con la cifra oficial de la marca", () => {
    expect(localesPublicados()).toHaveLength(13);
    expect(MARCA.totalLocalesDeclarado).toBe(13);
  });

  it("usa slugs únicos", () => {
    const slugs = LOCALES.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("todos los locales publicados se pueden situar en el mapa", () => {
    const conMapa = localesConMapa();
    expect(conMapa).toHaveLength(13);
    for (const l of conMapa) {
      expect(l.coordenadas!.lat).toBeLessThan(0); // hemisferio sur
      expect(l.coordenadas!.lng).toBeLessThan(-68); // Perú
      expect(l.coordenadas!.lng).toBeGreaterThan(-82);
    }
  });

  it("no inventa horarios", () => {
    for (const l of LOCALES) {
      expect(l.horarios === null || Array.isArray(l.horarios)).toBe(true);
    }
  });

  it("genera enlaces «Cómo llegar» válidos incluso sin coordenadas", () => {
    for (const l of localesPublicados()) {
      expect(urlComoLlegar(l)).toMatch(/^https:\/\/www\.google\.com\/maps\//);
    }
  });

  it("«Cómo llegar» y «Abrir en Google Maps» usan endpoints distintos de la API de URLs de Google Maps", () => {
    for (const l of localesPublicados()) {
      expect(urlComoLlegar(l)).toMatch(/^https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=/);
      expect(urlVerEnMapa(l)).toMatch(/^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
    }
  });

  it("nunca genera un enlace de Google Maps a partir de coordenadas sueltas (lat,lng): siempre nombre/dirección", () => {
    for (const l of localesPublicados()) {
      expect(urlComoLlegar(l)).not.toMatch(/destination=-?\d+\.\d+%2C-?\d+\.\d+/);
      expect(urlVerEnMapa(l)).not.toMatch(/query=-?\d+\.\d+%2C-?\d+\.\d+/);
    }
  });

  it("todo local con ficha de Google Maps verificada incluye destination_place_id/query_place_id, y ambos botones apuntan al mismo identificador", () => {
    for (const l of localesPublicados()) {
      if (!googleMapsVerificado(l)) continue;
      const cid = encodeURIComponent(l.googleMapsCid!);
      expect(urlComoLlegar(l)).toContain(`destination_place_id=${cid}`);
      expect(urlVerEnMapa(l)).toContain(`query_place_id=${cid}`);
    }
  });

  it("todo local sin ficha de Google Maps verificada lo deja explícito (sin inventar un identificador)", () => {
    const sinVerificar = localesPublicados().filter((l) => !googleMapsVerificado(l));
    for (const l of sinVerificar) {
      expect(l.googleMapsCid).toBeNull();
      expect(l.googleMapsNombre).toBeNull();
      expect(l.notas, `${l.nombreCorto} sin ficha de Google Maps debería explicarlo en notas`).toMatch(
        /pendiente|no se encontr/i,
      );
      expect(urlComoLlegar(l)).not.toContain("place_id");
      expect(urlVerEnMapa(l)).not.toContain("place_id");
    }
  });

  it("12 de los 13 locales tienen ficha de Google Maps verificada (Piura es el único pendiente)", () => {
    const verificados = localesPublicados().filter(googleMapsVerificado);
    const pendientes = localesPublicados().filter((l) => !googleMapsVerificado(l));
    expect(verificados).toHaveLength(12);
    expect(pendientes.map((l) => l.slug)).toEqual(["piura"]);
  });

  it("normaliza teléfonos a E.164", () => {
    expect(telefonoHref("01 4213916")).toBe("tel:+5114213916");
    expect(telefonoHref("945 186 438")).toBe("tel:+51945186438");
  });

  it("toda reserva apunta al sistema oficial de mesa 24/7", () => {
    for (const l of LOCALES) {
      if (l.urlReservas) expect(l.urlReservas).toContain("longhorn.mesa247.pe/reservas/");
    }
  });
});

describe("experiencias", () => {
  it("solo publica experiencias verificadas del catálogo oficial", () => {
    expect(EXPERIENCIAS.length).toBeGreaterThan(0);
    const slugs = new Set(localesPublicados().map((l) => l.slug));
    for (const e of EXPERIENCIAS) {
      expect(e.estadoVerificacion).toBe("verificado");
      for (const local of e.localesDisponibles) expect(slugs.has(local)).toBe(true);
    }
  });
});
