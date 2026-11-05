const { test: base, expect } = require('@playwright/test');

exports.test = base.extend({
  adminPage: async ({ page }, use) => {
    const emailAdmin = `admin_${Date.now()}@test.com`;

    await page.goto('https://front.serverest.dev/cadastrarusuarios');
    await page.locator('#nome').fill('Admin Teste');
    await page.locator('#email').fill(emailAdmin);
    await page.locator('#password').fill('123456');
    await page.locator('#administrador').check();
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page).toHaveURL(/.*home/);
    await use(page);
  },
});

exports.expect = expect;
