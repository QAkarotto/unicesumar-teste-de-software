const { test, expect } = require('@playwright/test');
const { gerarUsuario } = require('../support/data');

test('Cenário 3: login com credenciais inválidas exibe erro e bloqueia acesso', async ({ page }) => {
  const invalido = gerarUsuario(); // nunca foi cadastrado

  await page.goto('/login');
  await page.getByTestId('email').fill(invalido.email);
  await page.getByTestId('senha').fill(invalido.password);
  await page.getByTestId('entrar').click();

  await expect(page.getByText('Email e/ou senha inválidos')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);

  // Área autenticada continua inacessível
  await expect(page.getByTestId('logout')).toHaveCount(0);
  await page.goto('/admin/home');
  await expect(page.getByTestId('logout')).toHaveCount(0);
});