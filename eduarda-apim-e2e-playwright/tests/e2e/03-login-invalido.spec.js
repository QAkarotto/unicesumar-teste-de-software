const { test, expect } = require('@playwright/test');
const { gerarUsuario } = require('../support/dados');
const { fazerLogin } = require('../support/paginas');

test.describe('Cenário 3: autenticação com credenciais inválidas', () => {
  test('exibe mensagem de erro e bloqueia o acesso à área autenticada', async ({ page }) => {
    // Preparação: credenciais que nunca foram cadastradas
    const inexistente = gerarUsuario();

    // Ação
    await fazerLogin(page, inexistente);

    // Validação: mensagem de erro
    await expect(page.getByText('Email e/ou senha inválidos')).toBeVisible();

    // Validação: permanece em /login e não há sessão
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('logout')).toHaveCount(0);

    // Acesso direto à área autenticada deve ser negado
    await page.goto('/admin/home');
    await expect(page).not.toHaveURL(/\/admin\/home/);
    await expect(page.getByTestId('entrar')).toBeVisible();
  });
});
