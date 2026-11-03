
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/api',

    testMatch: '**/*.spec.ts',

    fullyParallel: false,
    workers: 1,

    timeout: 30 * 1000,

    expect: {
    timeout: 5000,
    },

    reporter: [
        ['list'],
        ['html', {
        outputFolder: 'playwright-api-report',
        open: 'never',
        }],
    ],

    use: {
        baseURL: 'https://serverest.dev',

        extraHTTPHeaders: {
        'Content-Type': 'application/json',
        },
    },
});
