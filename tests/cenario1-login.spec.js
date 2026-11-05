const { test, expect } = require('@playwright/test');

test.describe('Cenário 1 - Cadastro e Autenticação de Usuário', () => {
  test('Deve cadastrar um novo usuário e autenticar com sucesso', async ({ page }) => {
    const email = `user_${Date.now()}@teste.com`;
    const senha = '123456';

    // 1. Cadastro
    await page.goto('https://front.serverest.dev/cadastrarusuarios');
    await page.locator('#nome').fill('Usuário Comum');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(senha);
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    // Valida que entrou na área autenticada
    await expect(page).toHaveURL(/.*home/);

    // 2. Logout para testar a tela de login
    await page.getByRole('button', { name: 'Logout' }).click();

    // 3. Autenticação na tela de login
    await page.goto('https://front.serverest.dev/login');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(senha);
    await page.getByRole('button', { name: 'Entrar' }).click();

    // 4. Validação do acesso à área autenticada
    await expect(page).toHaveURL(/.*home/);
  });
});
