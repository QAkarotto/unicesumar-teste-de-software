import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'https://serverest.dev',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  projects: [
    {
      name: 'api-tests',
      testDir: './tests/api',
    },
    {
      name: 'web-tests',
      testDir: './tests/web',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
