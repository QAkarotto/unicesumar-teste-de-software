import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',

  use: {
    baseURL: process.env.SERVEREST_URL ?? 'https://serverest.dev',
  },

  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
    },
    {
      name: 'web',
      testMatch: '**/web/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});