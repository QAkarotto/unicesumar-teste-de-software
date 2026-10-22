import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração central do Playwright.
 *
 * As URLs dos ambientes ficam definidas apenas aqui. Os testes utilizam
 * somente caminhos relativos (ex.: '/usuarios'), resolvidos a partir do baseURL.
 * Para apontar para outro ambiente basta definir as variáveis API_URL / WEB_URL.
 *
 * Os testes são separados em dois projetos:
 *  - api: testes de API do ServeRest (tests/api)
 *  - web: estrutura preparada para futuros testes Web (tests/web)
 */
const API_URL = process.env.API_URL ?? 'https://serverest.dev';
const WEB_URL = process.env.WEB_URL ?? 'https://front.serverest.dev';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  // Tempo máximo por teste (inclui setup/teardown das fixtures) e por asserção
  timeout: 30_000,
  expect: { timeout: 5_000 },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: API_URL,
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
    {
      name: 'web',
      testDir: './tests/web',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: WEB_URL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
      },
    },
  ],
});
