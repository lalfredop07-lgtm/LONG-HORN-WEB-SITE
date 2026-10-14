import { expect, test } from "@playwright/test";

test.describe("SEO técnico", () => {
  test("el sitemap incluye las páginas públicas y las fichas de local", async ({ request }) => {
    const respuesta = await request.get("/sitemap.xml");
    expect(respuesta.status()).toBe(200);
    const xml = await respuesta.text();

    for (const ruta of ["/carta", "/locales", "/reservas", "/locales/san-isidro", "/locales/jockey-plaza"]) {
      expect(xml, `el sitemap no incluye ${ruta}`).toContain(ruta);
    }
    // Nada despublicado debe aparecer.
    expect(xml).not.toContain("centro-civico");
  });

  test("robots.txt existe y es coherente con el entorno", async ({ request }) => {
    const respuesta = await request.get("/robots.txt");
    expect(respuesta.status()).toBe(200);
    const texto = await respuesta.text();
    expect(texto).toContain("User-Agent");
    // En previews se bloquea todo; en producción se abre y se declara el sitemap.
    if (texto.includes("Disallow: /")) {
      expect(texto).not.toContain("Sitemap:");
    } else {
      expect(texto).toContain("Sitemap:");
    }
  });

  test("la portada declara Organization y WebSite", async ({ page }) => {
    await page.goto("/");
    const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
    const tipos = bloques
      .flatMap((b) => {
        const dato = JSON.parse(b);
        return Array.isArray(dato) ? dato : [dato];
      })
      .map((d) => d["@type"]);
    expect(tipos).toContain("Organization");
    expect(tipos).toContain("WebSite");
  });

  test("la carta publica un Menu con secciones y precios", async ({ page }) => {
    await page.goto("/carta");
    const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
    const menu = bloques
      .flatMap((b) => {
        const dato = JSON.parse(b);
        return Array.isArray(dato) ? dato : [dato];
      })
      .find((d) => d["@type"] === "Menu");

    expect(menu).toBeTruthy();
    expect(menu.hasMenuSection.length).toBeGreaterThan(5);
    const platos = menu.hasMenuSection.flatMap((s: { hasMenuItem: unknown[] }) => s.hasMenuItem);
    expect(platos.length).toBe(103);
    for (const plato of platos) {
      if (plato.offers) expect(plato.offers.priceCurrency).toBe("PEN");
    }
  });

  test("todas las páginas declaran Open Graph completo", async ({ page }) => {
    for (const ruta of ["/", "/carta", "/locales"]) {
      await page.goto(ruta);
      for (const propiedad of ["og:title", "og:description", "og:image", "og:url", "og:type"]) {
        const valor = await page.locator(`meta[property="${propiedad}"]`).getAttribute("content");
        expect(valor, `${ruta} sin ${propiedad}`).toBeTruthy();
      }
    }
  });

  test("el idioma declarado es es-PE", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es-PE");
  });

  test("los enlaces internos de la portada resuelven correctamente", async ({ page, request }) => {
    await page.goto("/");
    const destinos = await page.$$eval("a[href^='/']", (els) =>
      [...new Set(els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!.split("#")[0]!))].filter(Boolean),
    );
    for (const destino of destinos) {
      const respuesta = await request.get(destino);
      expect(respuesta.status(), `${destino} devuelve ${respuesta.status()}`).toBeLessThan(400);
    }
  });

  test("las cabeceras de seguridad están presentes", async ({ request }) => {
    const respuesta = await request.get("/");
    const cabeceras = respuesta.headers();
    expect(cabeceras["x-content-type-options"]).toBe("nosniff");
    expect(cabeceras["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(cabeceras["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(cabeceras["content-security-policy"]).toContain("object-src 'none'");
  });
});
