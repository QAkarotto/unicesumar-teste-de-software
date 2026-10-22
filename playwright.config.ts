import { defineConfig, devices } from '@playwright/test';

// URLs centralizadas aqui. Os testes usam apenas caminhos relativos ('/usuarios', '/login'...).
const API_URL = process.env.API_URL ?? 'https://serverest.dev';
const WEB_URL = process.env.WEB_URL ?? 'https://front.serverest.dev';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: { timeout: 5_000 },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: API_URL,
        extraHTTPHeaders: { Accept: 'application/json' },
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
