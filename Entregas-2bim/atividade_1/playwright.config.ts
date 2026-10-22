import { defineConfig, devices } from '@playwright/test';

/**
 * URLs base. Podem ser sobrescritas por variáveis de ambiente, por exemplo
 * para rodar contra uma instância local do ServeRest (`npx serverest`):
 *   SERVEREST_API_URL=http://localhost:3000 npx playwright test --project=api
 */
const API_URL = process.env.SERVEREST_API_URL ?? 'https://serverest.dev';
const WEB_URL = process.env.SERVEREST_WEB_URL ?? 'https://front.serverest.dev';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // A API pública é compartilhada por muita gente; uma nova tentativa evita falso negativo por instabilidade.
  retries: process.env.CI ? 2 : 1,
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],

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
      // Estrutura preparada para os próximos testes Web (front-end do ServeRest).
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
