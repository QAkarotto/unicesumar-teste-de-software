const base = require('@playwright/test');
const { gerarUsuario } = require('../support/data');

const API_URL = 'https://serverest.dev';

const test = base.test.extend({
  adminUser: async ({ request }, use) => {
    const admin = gerarUsuario({ administrador: true });
    const res = await request.post(`${API_URL}/usuarios`, {
      data: {
        nome: admin.nome,
        email: admin.email,
        password: admin.password,
        administrador: 'true',
      },
    });
    base.expect(res.status()).toBe(201);
    await use(admin);
  },

  adminPage: async ({ page, adminUser }, use) => {
    await page.goto('/login');
    await page.getByTestId('email').fill(adminUser.email);
    await page.getByTestId('senha').fill(adminUser.password);
    await page.getByTestId('entrar').click();
    await page.waitForURL('**/admin/home');
    await use(page);
  },
});

module.exports = { test, expect: base.expect };