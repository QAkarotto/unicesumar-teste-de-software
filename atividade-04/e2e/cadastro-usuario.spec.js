const { test, expect } = require('@playwright/test');

test('deve cadastrar e realizar login com usuário comum', async ({ page }) => {
  const usuario = {
    nome: 'Usuario E2E',
    email: `usuario${Date.now()}@teste.com`,
    senha: 'Teste@12345'
  };

  await page.goto('/cadastrarusuarios');


  const inputs = page.locator('input');

  await inputs.nth(0).fill(usuario.nome);
  await inputs.nth(1).fill(usuario.email);
  await inputs.nth(2).fill(usuario.senha);


  const checkboxAdmin = page.locator('input[type="checkbox"]');

  if (await checkboxAdmin.isVisible()) {
    await checkboxAdmin.uncheck();
  }

  await page.getByRole('button', { name: /cadastrar/i }).click();

  await page.goto('/');

  await page.locator('input[type="email"]').fill(usuario.email);
  await page.locator('input[type="password"]').fill(usuario.senha);

  await page.getByRole('button', { name: /entrar/i }).click();

  await expect(page).toHaveURL(/home/);
  await expect(page.getByText(/produtos/i).first()).toBeVisible();
});