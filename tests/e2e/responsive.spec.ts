import { expect, test } from "@playwright/test";

const ANCHOS = [320, 360, 375, 414, 430, 600, 768, 820, 1024, 1280, 1440, 1920, 2560];
const RUTAS = ["/", "/carta", "/locales", "/locales/san-isidro", "/reservas"];

test.describe("Responsive", () => {
  test.skip(({ isMobile }) => isMobile, "Este bloque controla el viewport manualmente");

  test("ninguna página desborda horizontalmente en ningún ancho", async ({ page }) => {
    // 13 anchos x 5 rutas = 65 cargas: necesita más que el timeout por defecto.
    test.setTimeout(240_000);

    for (const ancho of ANCHOS) {
      await page.setViewportSize({ width: ancho, height: 900 });
      for (const ruta of RUTAS) {
        await page.goto(ruta, { waitUntil: "networkidle" });
        // Da tiempo a que imágenes y fuentes asienten el layout definitivo.
        await page.waitForTimeout(350);
        const desborda = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        );
        expect(desborda, `${ruta} desborda a ${ancho}px`).toBe(false);
      }
    }
  });

  test("las áreas táctiles principales son cómodas en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const pequenos = await page.$$eval("header a, header button", (els) =>
      els
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.height < 44;
        })
        .map((el) => `${el.tagName}: ${(el.textContent ?? "").trim().slice(0, 30)}`),
    );
    expect(pequenos).toEqual([]);
  });

  test("los campos no provocan zoom involuntario en iOS", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const ruta of ["/carta", "/locales", "/reservas"]) {
      await page.goto(ruta);
      const pequenos = await page.$$eval("input, select, textarea", (els) =>
        els
          .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
          .map((el) => el.outerHTML.slice(0, 80)),
      );
      expect(pequenos, `${ruta}: campos con menos de 16px`).toEqual([]);
    }
  });

  test("la navegación de escritorio se oculta en móvil y aparece el menú", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: /abrir menú/i })).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByRole("navigation", { name: /navegación principal/i })).toBeVisible();
  });
});
