
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/web',

  testMatch: '**/*.spec.js',

  fullyParallel: false,
  workers: 1,

  timeout: 60 * 1000,

  expect: {
  timeout: 10 * 1000,
  },

  reporter: [
    ['list'],
    ['html', {
    outputFolder: 'playwright-report',
    open: 'never',
    }],
  ],

  use: {
    baseURL: 'https://front.serverest.dev',

    browserName: 'chromium',

    headless: false,

    launchOptions: {
      slowMo: 400,
    },

    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    viewport: {
      width: 1366,
      height: 768,
    },
  },

  outputDir: 'test-results',
});
