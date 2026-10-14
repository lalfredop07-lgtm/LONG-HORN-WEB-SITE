import { expect, test } from "@playwright/test";

import { LOCALES } from "../../data/locales";

const publicados = LOCALES.filter((l) => l.publicado);

test.describe("Directorio de locales", () => {
  test("lista los 13 locales publicados", async ({ page }) => {
    await page.goto("/locales");
    await expect(page.getByText(`${publicados.length} locales`).first()).toBeVisible();
    for (const local of publicados) {
      await expect(
        page.getByRole("heading", { name: local.nombreCorto, exact: true }),
        `falta ${local.nombreCorto}`,
      ).toBeVisible();
    }
  });

  test("el filtro por ciudad reduce el listado", async ({ page }) => {
    await page.goto("/locales");
    await page.getByLabel("Ciudad").selectOption("Piura");
    await expect(page.getByRole("heading", { name: "Piura", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Jockey Plaza", exact: true })).toBeHidden();
  });

  test("sin clave de Google Maps el directorio sigue siendo utilizable", async ({ page }) => {
    await page.goto("/locales");
    // El listado y sus acciones existen con o sin mapa.
    await expect(page.getByRole("link", { name: /cómo llegar/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /^ver local$/i }).first()).toBeVisible();
  });

  test("«Cómo llegar» apunta a Google Maps en todas las fichas", async ({ page }) => {
    await page.goto("/locales");
    const enlaces = page.getByRole("link", { name: /cómo llegar/i });
    const total = await enlaces.count();
    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i += 1) {
      await expect(enlaces.nth(i)).toHaveAttribute("href", /^https:\/\/www\.google\.com\/maps\//);
    }
  });
});

test.describe("Ficha de local", () => {
  test("cada local publicado tiene su página con datos reales", async ({ page }) => {
    for (const local of publicados) {
      const respuesta = await page.goto(`/locales/${local.slug}`);
      expect(respuesta?.status(), `${local.slug} no responde 200`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(local.nombreCorto);
      await expect(page.getByText(local.direccion).first()).toBeVisible();
    }
  });

  test("publica datos estructurados Restaurant válidos", async ({ page }) => {
    await page.goto("/locales/san-isidro");
    const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
    const todos = bloques.flatMap((b) => {
      const dato = JSON.parse(b);
      return Array.isArray(dato) ? dato : [dato];
    });
    const restaurante = todos.find((d) => d["@type"] === "Restaurant");

    expect(restaurante).toBeTruthy();
    expect(restaurante.name).toContain("San Isidro");
    expect(restaurante.address.streetAddress).toBe("Calle Los Libertadores 302");
    expect(restaurante.geo.latitude).toBeCloseTo(-12.101014, 4);
    expect(restaurante.acceptsReservations).toBe("True");
    // Nunca se inventan valoraciones.
    expect(restaurante.aggregateRating).toBeUndefined();
    expect(restaurante.review).toBeUndefined();
  });

  test("un local sin horario verificado lo dice en vez de inventarlo", async ({ page }) => {
    await page.goto("/locales/san-isidro");
    await expect(page.getByText(/no publica el horario/i)).toBeVisible();
  });

  test("el local sin reserva online ofrece una alternativa real", async ({ page }) => {
    await page.goto("/locales/san-juan-de-lurigancho");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("San Juan de Lurigancho");
    await expect(page.getByRole("link", { name: /cómo llegar/i }).first()).toBeVisible();
  });
});
