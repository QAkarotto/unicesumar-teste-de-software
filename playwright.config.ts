
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  testMatch: '**/api/**/*.spec.ts',

  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: 'https://serverest.dev',
    extraHTTPHeaders: {
      Accept: 'application/json'
    }
  },

  timeout: 30000
});
