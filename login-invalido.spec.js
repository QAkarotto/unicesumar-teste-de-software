const { test, expect } = require('@playwright/test');
const { gerarUsuario } = require('../helpers/dados');

test.describe('Cenário 3: Autenticação com credenciais inválidas', () => {
  test('exibe mensagem de erro e não permite acesso à área autenticada', async ({ page }) => {
    // Preparação: e-mail único que certamente não existe na base
    const invalido = gerarUsuario();

    // Ação: tentar autenticar
    await page.goto('/login');
    await page.getByTestId('email').fill(invalido.email);
    await page.getByTestId('senha').fill(invalido.password);
    await page.getByTestId('entrar').click();

    // Validação 1: mensagem de erro (o front ajusta a capitalização do texto)
    await expect(page.locator('.alert-secondary')).toContainText(/email e\/ou senha inválidos/i);

    // Validação 2: permanece no login e não vê a área autenticada
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('cadastrarProdutos')).toHaveCount(0);

    // Validação 3: acesso direto à área de admin continua bloqueado
    await page.goto('/admin/home');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('cadastrarProdutos')).toHaveCount(0);
  });
});
