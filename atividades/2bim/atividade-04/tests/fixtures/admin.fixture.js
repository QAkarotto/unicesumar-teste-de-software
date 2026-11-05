const { test: base, expect } = require('@playwright/test');

const test = base.extend({
  adminPage: async ({ page, request }, use) => {
    const identificador = Date.now();

    const administrador = {
      nome: `Administrador Teste ${identificador}`,
      email: `admin${identificador}@teste.com`,
      password: 'Admin@123',
      administrador: 'true'
    };

    // Preparação: criar administrador pela API
    const cadastro = await request.post(
      'https://serverest.dev/usuarios',
      { data: administrador }
    );

    expect(cadastro.status()).toBe(201);

    // Autenticação pela interface
    await page.goto('/login');

    await page.getByTestId('email').fill(administrador.email);
    await page.getByTestId('senha').fill(administrador.password);

    const respostaLogin = page.waitForResponse(resposta =>
      resposta.url().includes('/login') &&
      resposta.request().method() === 'POST'
    );

    await page.getByRole('button', { name: 'Entrar' }).click();

    const resposta = await respostaLogin;

    expect(resposta.status()).toBe(200);

    const dadosLogin = await resposta.json();
    expect(dadosLogin).toHaveProperty('authorization');

    // Disponibilizar a página autenticada ao teste
    await use(page);
  }
});

module.exports = { test, expect };