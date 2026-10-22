import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração central da suíte. A URL da API fica SOMENTE aqui: os testes usam
 * caminhos relativos ('/usuarios', '/login', ...) resolvidos a partir da baseURL.
 *
 * Para rodar contra outra instância (ex.: ServeRest local com `npx serverest`):
 *   SERVEREST_API_URL=http://localhost:3000 npx playwright test tests/api
 */
const API_URL = process.env.SERVEREST_API_URL ?? 'https://serverest.dev';
const WEB_URL = process.env.SERVEREST_WEB_URL ?? 'https://front.serverest.dev';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // A API pública é compartilhada; uma nova tentativa evita falso negativo por instabilidade de rede.
  retries: process.env.CI ? 2 : 1,
  // O ServeRest público bloqueia mais de 300 requisições/30s por IP; poucos workers evitam o bloqueio.
  workers: process.env.CI ? 2 : 4,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    trace: 'retain-on-failure',
  },

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
      // Estrutura preparada para os testes Web (front-end do ServeRest).
      name: 'web',
      testDir: './tests/web',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: WEB_URL,
        screenshot: 'only-on-failure',
      },
    },
  ],
});
