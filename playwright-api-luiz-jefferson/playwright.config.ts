import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: process.env.API_BASE_URL ?? 'https://serverest.dev', extraHTTPHeaders: { Accept: 'application/json' } },
});
