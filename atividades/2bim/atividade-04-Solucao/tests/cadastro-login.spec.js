const { test, expect } = require('@playwright/test');

test('Deve cadastrar e autenticar usuário', async ({ page }) => {
  const email = `user${Date.now()}@teste.com`;
  
  
  await page.goto('https://front.serverest.dev/cadastrarusuarios');
  await page.getByTestId('nome').fill('Usuario Teste');
  await page.getByTestId('email').fill(email);
  await page.getByTestId('password').fill('senha123');
  await page.getByTestId('cadastrar').click();
  
  await expect(page).toHaveURL(/.*\/home/); 
  
  await page.getByTestId('logout').click();
  
  await page.getByTestId('email').fill(email);
  await page.getByTestId('senha').fill('senha123');
  await page.getByTestId('entrar').click();
  
  await expect(page.getByTestId('logout')).toBeVisible();
});