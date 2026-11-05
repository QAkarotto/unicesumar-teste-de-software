
const { test: base, expect } = require('@playwright/test');

const test = base.extend({
  adminPage: async ({ page, request }, use) => {
    // Gera dados únicos para o administrador
    const id = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

    const admin = {
      nome: `Administrador ${id}`,
      email: `admin${id}@teste.com`,
      password: 'Admin@123456',
      administrador: 'true',
    };

    // Prepara o administrador utilizando a API
    const response = await request.post(
      'https://serverest.dev/usuarios',
      { data: admin }
    );

    expect(response.status()).toBe(201);

    // Realiza a autenticação pela interface web
    await page.goto('/login');

    await page.getByTestId('email').fill(admin.email);
    await page.getByTestId('senha').fill(admin.password);
    await page.getByTestId('entrar').click();

    // Confirma o acesso à área administrativa
    await expect(page).toHaveURL(/admin/);

    // Disponibiliza a página autenticada ao teste
    await use(page);
  },
});

module.exports = { test, expect };
