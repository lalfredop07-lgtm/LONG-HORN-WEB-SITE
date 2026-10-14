import { expect, test } from "@playwright/test";

test.describe("Navegación principal", () => {
  test("la portada carga con su titular y sus CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("El fuego");
    await expect(page.getByRole("link", { name: /ver nuestra carta/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /reservar mesa/i }).first()).toBeVisible();
  });

  test("el título y la descripción son específicos de cada página", async ({ page }) => {
    const vistos = new Map<string, string>();
    for (const ruta of ["/", "/carta", "/locales", "/nuestra-historia", "/experiencias", "/contacto"]) {
      await page.goto(ruta);
      const titulo = await page.title();
      const descripcion = await page
        .locator('meta[name="description"]')
        .getAttribute("content");

      expect(titulo.length, `${ruta} sin título`).toBeGreaterThan(10);
      expect(descripcion?.length ?? 0, `${ruta} sin descripción`).toBeGreaterThan(40);
      expect(vistos.has(titulo), `título duplicado en ${ruta}`).toBe(false);
      vistos.set(titulo, ruta);
    }
  });

  test("cada página declara su canonical absoluto", async ({ page }) => {
    for (const ruta of ["/", "/carta", "/locales", "/locales/san-isidro"]) {
      await page.goto(ruta);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical, `${ruta} sin canonical`).toBeTruthy();
      expect(canonical).toMatch(/^https?:\/\//);
      expect(canonical!.endsWith(ruta === "/" ? "" : ruta) || canonical!.endsWith("/")).toBe(true);
    }
  });

  test("el pie de página enlaza a las secciones legales", async ({ page }) => {
    await page.goto("/");
    const pie = page.getByRole("contentinfo");
    for (const nombre of [/libro de reclamaciones/i, /política de privacidad/i, /términos y condiciones/i]) {
      await expect(pie.getByRole("link", { name: nombre })).toBeVisible();
    }
  });

  test("una ruta inexistente muestra la página 404 en español", async ({ page }) => {
    const respuesta = await page.goto("/esta-ruta-no-existe");
    expect(respuesta?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/no existe/i);
    await expect(page.getByRole("link", { name: /volver al inicio/i })).toBeVisible();
  });
});

test.describe("Menú móvil", () => {
  test.skip(({ isMobile }) => !isMobile, "Solo aplica al proyecto móvil");

  test("se abre, navega y se cierra con Escape", async ({ page }) => {
    await page.goto("/");
    const boton = page.getByRole("button", { name: /abrir menú/i });
    await boton.click();

    const dialogo = page.getByRole("dialog", { name: /menú de navegación/i });
    await expect(dialogo).toBeVisible();
    await expect(dialogo.getByRole("link", { name: "Carta", exact: true })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialogo).toBeHidden();
  });

  test("desde el menú se llega a la carta", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /abrir menú/i }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Carta", exact: true }).click();
    await expect(page).toHaveURL(/\/carta$/);
  });
});
