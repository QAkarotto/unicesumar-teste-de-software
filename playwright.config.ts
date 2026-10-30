import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: 'list',
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'https://serverest.dev' }
    },
    {
      name: 'web',
      testDir: './tests/web',
      use: { browserName: 'chromium' }
    }
  ]
});
