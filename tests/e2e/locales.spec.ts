import { expect, test } from "@playwright/test";

import { LOCALES } from "../../data/locales";

const publicados = LOCALES.filter((l) => l.publicado);

/**
 * Espera a que el directorio esté hidratado.
 *
 * El mapa se carga solo en cliente, así que su contenedor en el DOM es
 * la señal fiable de que React ya ha tomado el control: antes de eso,
 * cambiar un filtro no dispara ningún manejador.
 */
async function esperarHidratacion(page: import("@playwright/test").Page) {
  await page.waitForSelector(".leaflet-container", { state: "attached", timeout: 30_000 });
}

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

  test("el filtro por ciudad reduce el listado", async ({ page, isMobile }) => {
    await page.goto("/locales");
    await esperarHidratacion(page);
    // En móvil los selectores viven en un panel plegable.
    if (isMobile) await page.getByRole("button", { name: /^filtros/i }).click();

    await page.getByLabel("Ciudad").selectOption("Piura");
    await expect(page.locator("[data-slug]")).toHaveCount(1);
    await expect(page.locator('[data-slug="piura"]')).toBeVisible();
    await expect(page.locator('[data-slug="jockey-plaza"]')).toHaveCount(0);
  });

  test("el directorio ofrece sus acciones en cada ficha", async ({ page }) => {
    await page.goto("/locales");
    await expect(page.getByRole("link", { name: /cómo llegar/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /^ver local$/i }).first()).toBeVisible();
  });

  test("el buscador filtra por distrito, nombre o dirección", async ({ page }) => {
    await page.goto("/locales");
    await esperarHidratacion(page);
    await page.getByLabel(/buscar por distrito/i).fill("surco");
    await expect(page.locator("[data-slug]")).toHaveCount(1);
    await expect(page.locator('[data-slug="jockey-plaza"]')).toBeVisible();

    await page.getByLabel(/buscar por distrito/i).fill("");
    await expect(page.locator("[data-slug]")).toHaveCount(13);
  });

  test("el mapa Leaflet carga sus teselas y dibuja los cuernos", async ({ page, isMobile }) => {
    await page.goto("/locales");
    if (isMobile) await page.getByRole("button", { name: "Mapa", exact: true }).click();

    await page.waitForSelector(".leaflet-tile-loaded", { timeout: 30_000 });
    await page.waitForTimeout(2500);

    // Teselas de OpenStreetMap, sin clave de API.
    const src = await page.locator(".leaflet-tile").first().getAttribute("src");
    expect(src).toContain("tile.openstreetmap.org");

    // Los marcadores llevan el símbolo oficial, no un icono genérico.
    expect(await page.locator(".lh-pin").count()).toBeGreaterThan(0);
    expect(await page.locator(".lh-pin__cuernos").first().isVisible()).toBe(true);

    // Entre pines sueltos y grupos están representadas las 13 sedes.
    const pines = await page.locator(".lh-pin").count();
    const enGrupos = await page
      .locator(".lh-cluster__n")
      .allTextContents()
      .then((ns) => ns.reduce((t, n) => t + Number(n), 0));
    expect(pines + enGrupos).toBe(13);
  });

  test("elegir una sede en la lista la marca en el mapa", async ({ page, isMobile }) => {
    await page.goto("/locales");
    await esperarHidratacion(page);
    await page.waitForTimeout(2000);

    await page.locator('[data-slug="piura"] button').first().click();
    await page.waitForTimeout(2000);

    if (isMobile) {
      // En móvil, elegir en la lista lleva a la vista de mapa con su ficha.
      await expect(page.locator(".lh-mapa")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Piura", exact: true })).toBeVisible();
    } else {
      await expect(page.locator('[data-slug="piura"] article[data-activo]')).toHaveCount(1);
      expect(await page.locator(".lh-pin--activo").count()).toBeGreaterThan(0);
    }
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
    // Coordenada corregida el 2026-10-19 contra la ficha de Google Maps
    // verificada (antes: -12.101014, dato del JSON-LD interno de la marca).
    expect(restaurante.geo.latitude).toBeCloseTo(-12.1011127, 4);
    expect(restaurante.acceptsReservations).toBe("True");
    // Nunca se inventan valoraciones.
    expect(restaurante.aggregateRating).toBeUndefined();
    expect(restaurante.review).toBeUndefined();
  });

  test("el local sin reserva online ofrece una alternativa real", async ({ page }) => {
    await page.goto("/locales/san-juan-de-lurigancho");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("San Juan de Lurigancho");
    await expect(page.getByRole("link", { name: /cómo llegar/i }).first()).toBeVisible();
  });
});
