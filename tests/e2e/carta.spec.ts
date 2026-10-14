import { expect, test } from "@playwright/test";

import { PLATOS } from "../../data/carta";

test.describe("Carta", () => {
  test("muestra todas las referencias verificadas de la carta oficial", async ({ page }) => {
    await page.goto("/carta");
    const articulos = page.locator("article[id]");
    await expect(articulos).toHaveCount(PLATOS.length);
  });

  test("los precios se muestran en soles y con el formato correcto", async ({ page }) => {
    await page.goto("/carta");
    const precios = await page.locator("article[id] p", { hasText: /^S\/\s?\d/ }).allTextContents();
    expect(precios.length).toBeGreaterThan(90);
    for (const precio of precios) expect(precio.trim()).toMatch(/^S\/\s?\d+(\.\d{1,2})?$/);
  });

  test("platos concretos aparecen con su precio exacto", async ({ page }) => {
    await page.goto("/carta");
    const casos: [string, string][] = [
      ["Tomahawk Nacional 1200g", "S/ 200"],
      ["Parrilla 4 Carnes", "S/ 255"],
      ["Piqueo LongHorn", "S/ 49"],
      ["Ensalada César", "S/ 31"],
      ["Choripapa + Chicha", "S/ 36"],
    ];
    for (const [nombre, precio] of casos) {
      const plato = page.locator("article[id]").filter({ hasText: nombre }).first();
      await expect(plato, `no se encontró ${nombre}`).toContainText(precio);
    }
  });

  test("todas las categorías tienen su sección y su ancla", async ({ page }) => {
    await page.goto("/carta");
    for (const id of ["piqueos", "ensaladas", "pastas", "grill", "mas-del-grill", "especialidades", "guarniciones", "menu-kids", "bebidas"]) {
      await expect(page.locator(`section#${id}`), `falta la sección ${id}`).toHaveCount(1);
    }
  });

  test("la navegación por categorías lleva a su sección", async ({ page }) => {
    await page.goto("/carta");
    await page.getByRole("navigation", { name: /categorías de la carta/i })
      .getByRole("link", { name: "Cortes", exact: true })
      .click();
    await expect(page).toHaveURL(/#grill$/);
    await expect(page.locator("section#grill")).toBeInViewport({ ratio: 0.01 });
  });

  test("bebidas no publica platos ni precios inventados", async ({ page }) => {
    await page.goto("/carta");
    const bebidas = page.locator("section#bebidas");
    await expect(bebidas).toContainText(/consulta|restaurante|equipo de sala/i);
    await expect(bebidas.locator("article[id]")).toHaveCount(0);
  });

  test("conserva el aviso legal literal de la carta impresa", async ({ page }) => {
    await page.goto("/carta");
    await expect(page.getByText(/incluyen I\.G\.V\. y servicio/i)).toBeVisible();
  });

  test("el selector de local cambia el destino de la reserva", async ({ page }) => {
    await page.goto("/carta");
    await page.getByLabel("Tu local").selectOption("san-isidro");
    const reservar = page.getByRole("link", { name: /reservar aquí/i });
    await expect(reservar).toHaveAttribute("href", /longhorn_san_isidro/);
  });
});
