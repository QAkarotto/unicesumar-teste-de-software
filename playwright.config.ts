
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    reporter: 'list',

    use: {
        baseURL: 'https://serverest.dev',
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
    },

    projects: [
        {
            name: 'api',
            testDir: './tests/api',
        },
        {
            name: 'web',
            testDir: './tests/web',
            testMatch: '**/*.spec.ts',
        },
    ],
});
