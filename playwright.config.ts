import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://serverest.dev',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
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
    },
  ],
});