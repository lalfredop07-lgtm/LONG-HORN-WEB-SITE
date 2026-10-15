import { describe, expect, it } from "vitest";

import { AVISO_CARTA, CATEGORIAS, GRUPOS, PLATOS } from "@/data/carta";
import { LOCALES } from "@/data/locales";
import { EXPERIENCIAS } from "@/data/experiencias";
import { MARCA } from "@/data/marca";
import { FUENTES } from "@/data/fuentes";
import { cartaAgrupada, formatearPrecio, totalPlatosPublicados } from "@/lib/carta";
import { localesConMapa, localesPublicados, telefonoHref, urlComoLlegar } from "@/lib/locales";

describe("carta", () => {
  it("contiene las 103 referencias verificadas del PDF oficial", () => {
    expect(PLATOS).toHaveLength(103);
    expect(totalPlatosPublicados()).toBe(103);
  });

  it("no pierde ningún plato al agrupar para la interfaz", () => {
    const enGrupos = cartaAgrupada().reduce((n, g) => n + g.totalPlatos, 0);
    expect(enGrupos).toBe(PLATOS.length);
  });

  it("asigna identificadores únicos a cada plato", () => {
    expect(new Set(PLATOS.map((p) => p.id)).size).toBe(PLATOS.length);
  });

  it("toda categoría pertenece a un grupo declarado", () => {
    const grupos = new Set(GRUPOS.map((g) => g.id));
    for (const c of CATEGORIAS) expect(grupos.has(c.grupo)).toBe(true);
  });

  it("todo plato publicado tiene precio, fuente y fecha de verificación", () => {
    for (const p of PLATOS.filter((x) => x.estado === "publicado")) {
      expect(p.precio, `${p.nombre} sin precio`).toBeGreaterThan(0);
      expect(FUENTES[p.fuenteId as keyof typeof FUENTES]).toBeDefined();
      expect(p.verificadoEl).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("el grupo de bebidas no publica platos inventados", () => {
    const bebidas = cartaAgrupada().find((g) => g.id === "bebidas");
    expect(bebidas?.sinCartaPublicada).toBe(true);
    expect(bebidas?.totalPlatos).toBe(0);
    expect(bebidas?.notaSinCarta).toBeTruthy();
  });

  it("formatea precios en soles", () => {
    expect(formatearPrecio(155)).toBe("S/ 155");
    expect(formatearPrecio(undefined)).toBeNull();
  });

  it("conserva el aviso legal literal de la carta", () => {
    expect(AVISO_CARTA).toContain("I.G.V.");
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
