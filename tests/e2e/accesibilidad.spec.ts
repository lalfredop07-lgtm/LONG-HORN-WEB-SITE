import { expect, test } from "@playwright/test";

import { PLATOS } from "../../data/carta";

const RUTAS = ["/", "/carta", "/locales", "/locales/san-isidro", "/reservas", "/preguntas-frecuentes"];
const PLATOS_PUBLICADOS = PLATOS.filter((p) => p.estado === "publicado").length;

test.describe("Accesibilidad", () => {
  test("cada página tiene exactamente un h1 y jerarquía de encabezados sin saltos", async ({ page }) => {
    for (const ruta of RUTAS) {
      await page.goto(ruta);

      const h1 = page.locator("h1");
      await expect(h1, `${ruta} debe tener un solo h1`).toHaveCount(1);

      const niveles = await page.$$eval("h1,h2,h3,h4,h5,h6", (els) =>
        els.map((el) => Number(el.tagName[1])),
      );
      for (let i = 1; i < niveles.length; i += 1) {
        const salto = niveles[i]! - niveles[i - 1]!;
        expect(salto, `${ruta}: salto de h${niveles[i - 1]} a h${niveles[i]}`).toBeLessThanOrEqual(1);
      }
    }
  });

  test("toda imagen tiene atributo alt", async ({ page }) => {
    for (const ruta of RUTAS) {
      await page.goto(ruta);
      const sinAlt = await page.$$eval("img:not([alt])", (els) =>
        els.map((e) => (e as HTMLImageElement).src),
      );
      expect(sinAlt, `${ruta} tiene imágenes sin alt`).toEqual([]);
    }
  });

  test("todo control interactivo tiene nombre accesible", async ({ page }) => {
    for (const ruta of RUTAS) {
      await page.goto(ruta);
      const anonimos = await page.$$eval("a[href], button", (els) =>
        els
          .filter((el) => {
            const estilo = getComputedStyle(el);
            if (estilo.display === "none" || estilo.visibility === "hidden") return false;
            const texto = (el.textContent ?? "").trim();
            const etiqueta = el.getAttribute("aria-label") ?? "";
            const etiquetadoPor = el.getAttribute("aria-labelledby") ?? "";
            const titulo = el.getAttribute("title") ?? "";
            return !texto && !etiqueta && !etiquetadoPor && !titulo;
          })
          .map((el) => el.outerHTML.slice(0, 120)),
      );
      expect(anonimos, `${ruta} tiene controles sin nombre accesible`).toEqual([]);
    }
  });

  test("todo campo de formulario tiene etiqueta asociada", async ({ page }) => {
    for (const ruta of ["/carta", "/locales", "/reservas"]) {
      await page.goto(ruta);
      const sinEtiqueta = await page.$$eval("input, select, textarea", (els) =>
        els
          .filter((el) => {
            const id = el.getAttribute("id");
            const tieneLabel = id ? !!document.querySelector(`label[for="${id}"]`) : false;
            return !tieneLabel && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby");
          })
          .map((el) => el.outerHTML.slice(0, 120)),
      );
      expect(sinEtiqueta, `${ruta} tiene campos sin etiqueta`).toEqual([]);
    }
  });

  test("existe un enlace para saltar al contenido principal", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const enfocado = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(enfocado).toMatch(/saltar al contenido/i);
  });

  test("se puede navegar con teclado hasta un enlace de la navegación", async ({ page, isMobile }) => {
    test.skip(isMobile, "La navegación de escritorio está oculta en móvil");
    await page.goto("/");
    for (let i = 0; i < 6; i += 1) await page.keyboard.press("Tab");
    const visible = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    expect(visible).toBe(true);
  });

  test("con movimiento reducido el contenido permanece visible", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    // El contenido revelado por scroll no puede quedar invisible.
    const invisibles = await page.$$eval("[data-revelar]", (els) =>
      els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length,
    );
    expect(invisibles).toBe(0);
    await ctx.close();
  });

  test("sin JavaScript el contenido principal sigue siendo visible", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // El hero ya no lleva CTA propios (ver HeroCinematico): el enlace a la
    // carta que sigue en la portada es el de la sección «Nuestra carta».
    await expect(page.getByRole("link", { name: /ver la carta completa/i })).toBeVisible();

    await page.goto("/carta");
    // El filtro de categorías necesita JavaScript para cambiar de pestaña,
    // pero sin él la carta no queda vacía: el servidor ya decide mostrar
    // la categoría por defecto («Cortes»), con todos sus platos.
    const cortes = page.locator("section#grill");
    await expect(cortes).toBeVisible();
    await expect(cortes.locator("article[id]").first()).toBeVisible();

    // El resto de la carta no desaparece del documento: sigue presente
    // (oculta) para que un buscador la rastree, solo que sin JS no hay
    // forma de alternar a ella desde la interfaz.
    await expect(page.locator("article[id]")).toHaveCount(PLATOS_PUBLICADOS);
    await ctx.close();
  });
});
