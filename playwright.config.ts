import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
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
        baseURL: process.env.WEB_BASE_URL,
      },
    },
  ],
});
