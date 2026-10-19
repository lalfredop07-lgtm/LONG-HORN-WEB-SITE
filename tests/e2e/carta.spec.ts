import { expect, test, type Page } from "@playwright/test";

import { PLATOS } from "../../data/carta";

const PLATOS_PUBLICADOS = PLATOS.filter((p) => p.estado === "publicado").length;

/**
 * Espera a que React haya hidratado la carta antes de interactuar con las
 * pestañas. Las pestañas existen en el HTML desde el servidor (por eso el
 * resto de pruebas de esta carta pueden leer contenido sin esperar nada),
 * pero su `onClick` no responde hasta que React termina de hidratar: un
 * clic disparado justo después de `goto` puede no hacer nada y la prueba
 * vería un falso fallo, no un fallo real de la app.
 */
async function irACartaInteractiva(page: Page, ruta = "/carta") {
  await page.goto(ruta, { waitUntil: "networkidle" });
}

test.describe("Carta", () => {
  test("muestra todas las referencias verificadas de la carta oficial", async ({ page }) => {
    await page.goto("/carta");
    const articulos = page.locator("article[id]");
    await expect(articulos).toHaveCount(PLATOS_PUBLICADOS);
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

  test("al entrar se muestra solo la categoría «Cortes», el resto oculta", async ({ page }) => {
    await page.goto("/carta");
    await expect(page.locator("section#grill")).toBeVisible();
    for (const id of ["piqueos", "ensaladas", "pastas", "mas-del-grill", "especialidades", "guarniciones", "menu-kids", "bebidas"]) {
      await expect(page.locator(`section#${id}`), `${id} debería estar oculta`).toBeHidden();
    }
  });

  test("nunca hay más de una categoría visible a la vez", async ({ page }) => {
    await irACartaInteractiva(page);
    for (const nombre of ["Piqueos", "Ensaladas", "Pastas", "Parrillas", "Especialidades", "Bebidas"]) {
      await page.getByRole("tab", { name: nombre, exact: true }).click();
      const visibles = page.locator("section[role=tabpanel]:not([hidden])");
      await expect(visibles, `tras elegir ${nombre}`).toHaveCount(1);
    }
  });

  test("elegir una pestaña filtra el contenido y conserva todos sus platos", async ({ page }) => {
    await irACartaInteractiva(page);
    await page.getByRole("tab", { name: "Piqueos", exact: true }).click();

    await expect(page.locator("section#piqueos")).toBeVisible();
    await expect(page.locator("section#grill")).toBeHidden();
    await expect(page).toHaveURL(/#piqueos$/);
    await expect(page.getByRole("tab", { name: "Piqueos", exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: "Cortes", exact: true })).toHaveAttribute("aria-selected", "false");

    // Todos los piqueos de la carta oficial siguen presentes, no una muestra.
    await expect(page.locator("section#piqueos article[id]")).toHaveCount(20);
  });

  test("el cambio de categoría no recarga la página", async ({ page }) => {
    await irACartaInteractiva(page);
    await page.evaluate(() => { (window as unknown as { __marca: boolean }).__marca = true; });
    await page.getByRole("tab", { name: "Pastas", exact: true }).click();
    await expect(page.locator("section#pastas")).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { __marca?: boolean }).__marca)).toBe(true);
  });

  test("las pestañas se navegan con el teclado (flechas, Home, End)", async ({ page }) => {
    await irACartaInteractiva(page);
    await page.getByRole("tab", { name: "Cortes", exact: true }).focus();

    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Parrillas", exact: true })).toBeFocused();
    await expect(page.locator("section#mas-del-grill")).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("tab", { name: "Cortes", exact: true })).toBeFocused();
    await expect(page.locator("section#grill")).toBeVisible();

    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: "Bebidas", exact: true })).toBeFocused();
    await expect(page.locator("section#bebidas")).toBeVisible();

    await page.keyboard.press("Home");
    await expect(page.getByRole("tab", { name: "Piqueos", exact: true })).toBeFocused();
    await expect(page.locator("section#piqueos")).toBeVisible();
  });

  test("un enlace con hash (/carta#bebidas) abre directamente esa categoría", async ({ page }) => {
    await irACartaInteractiva(page, "/carta#bebidas");
    await expect(page.locator("section#bebidas")).toBeVisible();
    await expect(page.locator("section#grill")).toBeHidden();
    await expect(page.getByRole("tab", { name: "Bebidas", exact: true })).toHaveAttribute("aria-selected", "true");
  });

  test("las categorías ocultas siguen en el HTML para el SEO", async ({ page }) => {
    await page.goto("/carta");
    // Todos los platos PUBLICADOS llegan en el HTML del servidor, aunque la
    // interfaz solo muestre la categoría (y, dentro de bebidas, la
    // subcategoría) activa. Los platos ocultos/históricos nunca se envían.
    await expect(page.locator("article[id]")).toHaveCount(PLATOS_PUBLICADOS);
    // Una categoría no activa está oculta mas no ausente del documento.
    await expect(page.locator("section#bebidas")).toBeHidden();
    await expect(page.locator("section#bebidas")).toHaveCount(1);
  });

  test("bebidas publica solo las subcategorías verificadas, con pestañas internas", async ({ page }) => {
    await irACartaInteractiva(page, "/carta#bebidas");
    const bebidas = page.locator("section#bebidas");
    await expect(bebidas).toBeVisible();

    // «Cócteles de Autor» no tiene ningún producto confirmado: su pestaña
    // no debe aparecer, y ninguno de los 8 nombres del recetario histórico
    // debe estar en la página (ni oculto: estado "oculto" no se renderiza).
    await expect(bebidas.getByRole("tab", { name: "Cócteles de autor" })).toHaveCount(0);
    await expect(page.getByText("Inkatexas Cocktail")).toHaveCount(0);
    await expect(page.getByText("Machupicchu")).toHaveCount(0);

    // Vinos es la subcategoría por defecto (primera con productos) y se ve
    // sin tener que pulsar nada.
    const tacama = bebidas.locator("article").filter({ hasText: "Tacama Blanco de Blancos" });
    await expect(tacama).toBeVisible();
    await expect(tacama).toContainText("S/ 20");

    // Cambiar de subpestaña filtra: Cervezas sustituye a Vinos.
    await bebidas.getByRole("tab", { name: "Cervezas", exact: true }).click();
    await expect(bebidas.getByText("Pilsen Callao")).toBeVisible();
    await expect(bebidas.getByText("Tacama Blanco de Blancos")).toBeHidden();

    // Un cóctel verificado pero sin precio unitario (solo precio de combo
    // 2x/3x) se publica igual, marcado explícitamente en vez de inventar
    // una cifra.
    await bebidas.getByRole("tab", { name: "Pisco Sours", exact: true }).click();
    const pisco = bebidas.locator("article").filter({ hasText: "Pisco Sour Clásico" });
    await expect(pisco).toContainText(/consultar precio/i);
  });

  test("el selector de local cambia el destino de la reserva", async ({ page }) => {
    await page.goto("/carta");
    await page.getByLabel("Tu local").selectOption("san-isidro");
    const reservar = page.getByRole("link", { name: /reservar aquí/i });
    await expect(reservar).toHaveAttribute("href", /longhorn_san_isidro/);
  });
});
