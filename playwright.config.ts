import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Cada teste prepara e remove os próprios dados, então os de um mesmo arquivo também rodam em paralelo.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://serverest.dev',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
    {
      // Sem testes ainda: os de interface entram em tests/web e rodam contra o front do ServeRest.
      name: 'web',
      testDir: './tests/web',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://front.serverest.dev',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
      },
    },
  ],
});
