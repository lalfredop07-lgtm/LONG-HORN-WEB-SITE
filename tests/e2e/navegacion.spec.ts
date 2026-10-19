import { expect, test } from "@playwright/test";

test.describe("Navegación principal", () => {
  test("la portada carga con el logotipo grande como titular", async ({ page }) => {
    // El titular ya no es la frase «El fuego nos une»: es el propio
    // logotipo, grande y centrado, sin botones alrededor (ver
    // HeroCinematico). Sigue siendo un <h1> real y visible, solo que su
    // nombre accesible ahora es el alt del logotipo.
    await page.goto("/");
    const titular = page.getByRole("heading", { level: 1 });
    await expect(titular).toBeVisible();
    await expect(titular.getByRole("img", { name: /longhorn/i })).toBeVisible();
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

  test("se cierra pulsando el propio botón (el caso real en táctil)", async ({ page }) => {
    // Regresión: MenuMovil se renderizaba como hijo de <header>, así que su
    // `position: fixed` con z-40 quedaba por delante del botón dentro del
    // contexto de apilamiento propio del header (z-50 solo protege frente
    // al resto de la página, no frente a los propios descendientes
    // posicionados). El botón de cerrar quedaba tapado e inalcanzable al
    // tocar, aunque Escape sí funcionara. Debe ser hermano de <header>.
    await page.goto("/");
    const boton = page.getByRole("button", { name: /abrir menú/i });
    await boton.click();

    const dialogo = page.getByRole("dialog", { name: /menú de navegación/i });
    await expect(dialogo).toBeVisible();

    await page.getByRole("button", { name: /cerrar menú/i }).click();
    await expect(dialogo).toBeHidden();
  });

  test("desde el menú se llega a la carta", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /abrir menú/i }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Carta", exact: true }).click();
    await expect(page).toHaveURL(/\/carta$/);
  });
});
