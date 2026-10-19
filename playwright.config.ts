import { defineConfig, devices } from "@playwright/test";

/**
 * Configuración de pruebas end-to-end.
 *
 * Se usa el Chrome instalado en el sistema (`channel: "chrome"`) porque
 * esta máquina de desarrollo (macOS 12) no admite los binarios que
 * descarga Playwright. En CI puede eliminarse `channel` para usar los
 * navegadores propios de Playwright.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["html"], ["list"]] : [["list"]],

  use: {
    baseURL: process.env.URL_PRUEBAS ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "escritorio",
      use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 900 } },
    },
    {
      // Emulación móvil sobre Chrome. No se usa un perfil de iPhone porque
      // esos perfiles arrancan WebKit, y Playwright no puede instalar WebKit
      // en macOS 12 (ver docs/pruebas.md → limitaciones conocidas).
      name: "movil",
      use: { ...devices["Galaxy S24"], channel: "chrome" },
    },
  ],

  webServer: process.env.URL_PRUEBAS
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
