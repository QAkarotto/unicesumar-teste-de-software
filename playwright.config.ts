import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'https://serverest.dev', extraHTTPHeaders: { Accept: 'application/json' } },
  projects: [
    { name: 'api', testMatch: /api\/.*\.spec\.ts/ },
    { name: 'web', testMatch: /web\/.*\.spec\.ts/ },
  ],
});
