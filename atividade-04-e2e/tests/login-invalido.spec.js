
const { test, expect } = require('@playwright/test');

test('Cenário 3 - Autenticação com credenciais inválidas', async ({ page }) => {
  // Gera um e-mail inexistente para evitar conflitos
  const id = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
  const emailInvalido = `invalido${id}@teste.com`;
  const senhaInvalida = 'SenhaIncorreta123';

  // Acessa a tela de login
  await page.goto('/login');

  // Informa credenciais inválidas
  await page.getByTestId('email').fill(emailInvalido);
  await page.getByTestId('senha').fill(senhaInvalida);

  // Tenta realizar a autenticação
  await page.getByTestId('entrar').click();

  // Valida a mensagem de erro apresentada
  await expect(
    page.getByText('Email e/ou senha inválidos')
  ).toBeVisible();

  // Verifica que o usuário permanece na tela de login
  await expect(page).toHaveURL(/login/);

  // Confirma que a área autenticada não foi acessada
  await expect(page).not.toHaveURL(/home|admin/);
});
