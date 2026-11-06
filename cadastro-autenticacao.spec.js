const { test, expect } = require('@playwright/test');
const { gerarUsuario } = require('../helpers/dados');

test.describe('Cenário 1: Cadastro e autenticação de usuário', () => {
  test('cadastra um usuário comum, autentica e acessa a área do seu perfil', async ({ page }) => {
    // Preparação: dados únicos
    const usuario = gerarUsuario({ administrador: false });

    // Ação 1: cadastrar pela interface
    await page.goto('/login');
    await page.getByTestId('cadastrar').click();
    await expect(page).toHaveURL(/\/cadastrarusuarios/);

    await page.getByTestId('nome').fill(usuario.nome);
    await page.getByTestId('email').fill(usuario.email);
    await page.getByTestId('password').fill(usuario.password);
    await page.getByTestId('cadastrar').click();

    // Após o cadastro o front já autentica o usuário. Para testar o login
    // de verdade, encerramos a sessão limpando o storage do navegador.
    await expect(page).toHaveURL(/\/home/);
    await page.evaluate(() => window.localStorage.clear());

    // Ação 2: autenticar com as credenciais cadastradas
    await page.goto('/login');
    await page.getByTestId('email').fill(usuario.email);
    await page.getByTestId('senha').fill(usuario.password);
    await page.getByTestId('entrar').click();

    // Validação: área de usuário comum (e não a de administrador)
    await expect(page).toHaveURL(/\/home$/);
    await expect(page).not.toHaveURL(/\/admin/);
    await expect(page.getByText(/Serverest Store/i)).toBeVisible();
    await expect(page.getByTestId('cadastrarUsuarios')).toHaveCount(0);
  });
});
