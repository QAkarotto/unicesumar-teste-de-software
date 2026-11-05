import { defineConfig, devices } from '@playwright/test';
import { WEB_URL } from './tests/support/ambiente';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // O ServeRest público é compartilhado por muita gente; uma nova tentativa evita falso negativo por instabilidade.
  retries: 1,
  // O ServeRest público limita requisições por IP; poucos workers evitam o bloqueio.
  workers: 2,
  timeout: 60_000,
  // Após o login, o front baixa a lista inteira de usuários para decidir a rota (admin x cliente),
  // o que pode demorar no servidor público. As asserções esperam até 15 s (sem esperas fixas).
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/resultados.json' }],
  ],

  use: {
    baseURL: WEB_URL,
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
