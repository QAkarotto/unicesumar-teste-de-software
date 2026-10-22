import { defineConfig } from '@playwright/test';

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
});
