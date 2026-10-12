const { test, expect } = require('@playwright/test');

test('validar título da página Playwright', async ({ page }) => {

    await page.goto('/');

    await expect(page).toHaveTitle(/Playwright/);

});