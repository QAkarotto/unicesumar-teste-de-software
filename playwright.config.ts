
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Localiza arquivos de teste TypeScript.
  testMatch: '**/*.spec.ts',

  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: 'https://serverest.dev',
    trace: 'retain-on-failure',
  },
});
