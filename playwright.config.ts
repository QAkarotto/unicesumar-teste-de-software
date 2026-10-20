import { defineConfig } from '@playwright/test';

const API_URL = process.env.API_URL ?? 'https://serverest.dev';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL },
    },
    {
      name: 'web',
      testDir: './tests/web',
      use: { browserName: 'chromium' },
    },
  ],
});
