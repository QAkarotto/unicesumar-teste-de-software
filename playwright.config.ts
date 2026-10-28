
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: 'list',

  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        baseURL: 'https://serverest.dev'
      }
    },
    {
      name: 'web',
      testMatch: '**/web/**/*.spec.ts',
      use: {
        browserName: 'chromium'
      }
    }
  ]
});
