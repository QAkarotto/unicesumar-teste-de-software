
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.SERVEREST_BASE_URL ?? 'https://serverest.dev',
      },
    },
    {
      name: 'web',
      testDir: './tests/web',
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.WEB_BASE_URL
          ? { baseURL: process.env.WEB_BASE_URL }
          : {}),
      },
    },
  ],
});
