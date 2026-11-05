const { test, expect } = require('@playwright/test');

test.describe('Cenário 3 - Credenciais Inválidas', () => {
  test('Deve exibir mensagem de erro ao tentar logar com credenciais inválidas', async ({ page }) => {
    await page.goto('https://front.serverest.dev/login');

    await page.locator('#email').fill('invalido_inexistente@teste.com');
    await page.locator('#password').fill('senha_errada');
    await page.getByRole('button', { name: 'Entrar' }).click();

    const mensagemErro = page.locator('.alert-dismissible, .alert');
    await expect(mensagemErro).toBeVisible();

    await expect(page).not.toHaveURL(/.*home/);
  });
});
