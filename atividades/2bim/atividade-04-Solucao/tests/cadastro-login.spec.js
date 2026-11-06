const { test, expect } = require('@playwright/test');
const { gerarUsuario } = require('../support/data');

test('Cenário 1: cadastra usuário comum e autentica com as credenciais criadas', async ({ page }) => {
  const usuario = gerarUsuario();

  await test.step('Cadastrar novo usuário pela interface', async () => {
    await page.goto('/login');
    await page.getByTestId('cadastrar').click();
    await expect(page).toHaveURL(/cadastrarusuarios/);

    await page.getByTestId('nome').fill(usuario.nome);
    await page.getByTestId('email').fill(usuario.email);
    await page.getByTestId('password').fill(usuario.password);
    await page.getByTestId('cadastrar').click();

    // O front autentica automaticamente após o cadastro.
    await expect(page).toHaveURL(/\/home/);
    await expect(page.getByTestId('logout')).toBeVisible();
    await page.getByTestId('logout').click();
    await expect(page).toHaveURL(/\/login/);
  });

  await test.step('Autenticar com as credenciais cadastradas', async () => {
    await page.getByTestId('email').fill(usuario.email);
    await page.getByTestId('senha').fill(usuario.password);
    await page.getByTestId('entrar').click();
  });

  await test.step('Validar área do perfil de usuário comum', async () => {
    await expect(page).toHaveURL(/\/home$/);
    await expect(page).not.toHaveURL(/admin/);
    await expect(page.getByTestId('logout')).toBeVisible();
    await expect(page.getByTestId('cadastrarProdutos')).toHaveCount(0);
  });
})