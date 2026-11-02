import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://serverest.dev',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    testIdAttribute: 'data-testid',
  },
  reporter: 'html',
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
    },
    {
      name: 'web',
      testDir: './tests/web',
      use: {
        baseURL: 'https://front.serverest.dev',
        ...devices['Desktop Firefox'],
      },
    },
  ],
});