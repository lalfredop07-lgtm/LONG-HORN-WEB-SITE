#!/usr/bin/env node
/**
 * Revisión visual automatizada.
 *
 * Recorre las páginas públicas en los anchos reales de prueba y guarda una
 * captura de página completa de cada combinación. Además detecta de forma
 * objetiva dos defectos clásicos del responsive:
 *   · desbordamiento horizontal,
 *   · elementos que se salen del viewport.
 *
 * Playwright usa el Chrome del sistema (`channel: "chrome"`) porque esta
 * máquina (macOS 12) no admite los binarios que descarga Playwright.
 *
 * Uso: node scripts/capturas.mjs [--url http://localhost:3000] [--filtro carta]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const leer = (bandera, pordefecto) => {
  const i = args.indexOf(bandera);
  return i >= 0 && args[i + 1] ? args[i + 1] : pordefecto;
};

const BASE = leer("--url", "http://localhost:3000").replace(/\/+$/, "");
const FILTRO = leer("--filtro", "");
const SALIDA = leer("--salida", "capturas");

const VIEWPORTS = [
  { nombre: "movil-320", ancho: 320, alto: 720, movil: true },
  { nombre: "movil-375", ancho: 375, alto: 812, movil: true },
  { nombre: "movil-390", ancho: 390, alto: 844, movil: true },
  { nombre: "movil-430", ancho: 430, alto: 932, movil: true },
  { nombre: "tablet-768", ancho: 768, alto: 1024, movil: true },
  { nombre: "tablet-1024", ancho: 1024, alto: 768, movil: true },
  { nombre: "desktop-1280", ancho: 1280, alto: 800, movil: false },
  { nombre: "desktop-1440", ancho: 1440, alto: 900, movil: false },
  { nombre: "desktop-1920", ancho: 1920, alto: 1080, movil: false },
];

const RUTAS = [
  { ruta: "/", nombre: "inicio" },
  { ruta: "/carta", nombre: "carta" },
  { ruta: "/locales", nombre: "locales" },
  { ruta: "/locales/san-isidro", nombre: "local-detalle" },
  { ruta: "/nuestra-historia", nombre: "historia" },
  { ruta: "/experiencias", nombre: "experiencias" },
  { ruta: "/reservas", nombre: "reservas" },
  { ruta: "/contacto", nombre: "contacto" },
  { ruta: "/preguntas-frecuentes", nombre: "faq" },
  { ruta: "/ruta-que-no-existe", nombre: "404" },
];

/** Comprueba desbordamientos reales en el DOM, no «a ojo». */
async function auditarDesbordes(page) {
  return page.evaluate(() => {
    const anchoViewport = document.documentElement.clientWidth;
    const culpables = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const estilo = getComputedStyle(el);
      if (estilo.position === "fixed") continue;
      if (r.right > anchoViewport + 1 || r.left < -1) {
        culpables.push({
          etiqueta: el.tagName.toLowerCase(),
          clase: (el.className?.toString?.() ?? "").slice(0, 90),
          izquierda: Math.round(r.left),
          derecha: Math.round(r.right),
        });
      }
    }
    return {
      scrollHorizontal: document.documentElement.scrollWidth > anchoViewport + 1,
      anchoDocumento: document.documentElement.scrollWidth,
      anchoViewport,
      culpables: culpables.slice(0, 6),
    };
  });
}

const navegador = await chromium.launch({ channel: "chrome" });
const informe = [];

for (const vp of VIEWPORTS) {
  const contexto = await navegador.newContext({
    viewport: { width: vp.ancho, height: vp.alto },
    deviceScaleFactor: 1,
    // Movimiento reducido: hace la captura determinista (todo el contenido
    // revelado) y de paso comprueba que esa variante del sitio está completa.
    reducedMotion: "reduce",
    isMobile: vp.movil,
    hasTouch: vp.movil,
    userAgent: vp.movil
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
      : undefined,
  });
  const page = await contexto.newPage();

  for (const r of RUTAS) {
    if (FILTRO && !r.nombre.includes(FILTRO)) continue;
    const dir = `${SALIDA}/${r.nombre}`;
    await mkdir(dir, { recursive: true });

    const respuesta = await page.goto(`${BASE}${r.ruta}`, {
      waitUntil: "networkidle",
      timeout: 45000,
    }).catch(() => null);

    // Fuerza la carga de las imágenes diferidas: en una captura de página
    // completa, una imagen `lazy` que nunca entró en el viewport saldría en
    // blanco y haría pensar en un fallo que no existe.
    await page.evaluate(async () => {
      for (const img of document.querySelectorAll("img[loading='lazy']")) {
        img.loading = "eager";
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 500));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 300));
      await Promise.all(
        [...document.images]
          .filter((i) => !i.complete)
          .map((i) => new Promise((res) => {
            i.addEventListener("load", res, { once: true });
            i.addEventListener("error", res, { once: true });
          })),
      );
    });
    await page.waitForTimeout(600);

    const desbordes = await auditarDesbordes(page);

    // En capturas de página completa, los elementos `fixed` se repiten en
    // cada tramo cosido. Se neutralizan solo para la foto.
    await page.addStyleTag({
      content: '[data-captura-fija]{position:absolute!important;top:0!important}',
    });
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("header, [data-volver-arriba]")) {
        if (getComputedStyle(el).position === "fixed") el.setAttribute("data-captura-fija", "");
      }
    });
    await page.screenshot({ path: `${dir}/${vp.nombre}.png`, fullPage: true });

    informe.push({
      pagina: r.nombre,
      ruta: r.ruta,
      viewport: vp.nombre,
      estado: respuesta?.status() ?? 0,
      ...desbordes,
    });

    const aviso = desbordes.scrollHorizontal ? "  ⚠ DESBORDE" : "";
    console.log(`${r.nombre.padEnd(16)} ${vp.nombre.padEnd(14)} ${respuesta?.status() ?? "ERR"}${aviso}`);
  }

  await contexto.close();
}

await navegador.close();
await writeFile(`${SALIDA}/informe.json`, JSON.stringify(informe, null, 2));

const problemas = informe.filter((i) => i.scrollHorizontal);
console.log(`\n${informe.length} capturas. Desbordes: ${problemas.length}`);
for (const p of problemas) {
  console.log(`  ⚠ ${p.pagina} @ ${p.viewport}: doc ${p.anchoDocumento}px > vp ${p.anchoViewport}px`);
  for (const c of p.culpables) console.log(`      <${c.etiqueta}> ${c.izquierda}→${c.derecha}  ${c.clase}`);
}
