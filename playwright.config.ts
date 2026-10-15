import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright.
 *
 * Os testes são separados em dois projetos:
 *  - api: testes de API do ServeRest (tests/api)
 *  - web: estrutura preparada para futuros testes Web (tests/web)
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://serverest.dev',
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
        baseURL: 'https://front.serverest.dev',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
      },
    },
  ],
});
