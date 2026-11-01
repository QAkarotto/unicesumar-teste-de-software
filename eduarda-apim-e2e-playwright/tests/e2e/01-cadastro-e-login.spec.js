const { test, expect } = require('@playwright/test');
const { gerarUsuario } = require('../support/dados');
const { cadastrarUsuarioPelaUI, fazerLogin } = require('../support/paginas');

test.describe('Cenário 1: cadastro e autenticação de usuário', () => {
  test('cadastra um usuário comum e autentica com as credenciais criadas', async ({ page }) => {
    // Preparação
    const usuario = gerarUsuario();

    // Ação 1: cadastro pela interface
    await cadastrarUsuarioPelaUI(page, usuario);
    await expect(page.getByText('Cadastro realizado com sucesso')).toBeVisible();

    // O front autentica automaticamente após o cadastro; encerra a sessão
    // para garantir que o login abaixo é feito de fato com as credenciais.
    await expect(page).toHaveURL(/\/home/);
    await page.getByTestId('logout').click();
    await expect(page).toHaveURL(/\/login/);

    // Ação 2: autenticação
    await fazerLogin(page, usuario);

    // Validação: área do perfil de usuário comum (não administrador)
    await expect(page).toHaveURL(/\/home$/);
    await expect(page).not.toHaveURL(/\/admin/);
    await expect(page.getByRole('heading', { name: 'Serverest Store' })).toBeVisible();
    await expect(page.getByTestId('logout')).toBeVisible();
  });
});
