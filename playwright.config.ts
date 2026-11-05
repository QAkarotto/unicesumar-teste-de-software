
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
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'api',
            testDir: './tests/api',
            testMatch: '**/*.spec.ts',
        },
        {
            name: 'web',
            testDir: './tests/web',
            testMatch: '**/*.spec.ts',
            use: {
                baseURL: 'https://front.serverest.dev',
            },
        },
    ],
});
