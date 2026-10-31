const { test, expect } = require('@playwright/test');

test('Não deve logar com credenciais inválidas', async ({ page }) => {
  await page.goto('https://front.serverest.dev/login');
  
  await page.getByTestId('email').fill('invalido@teste.com');
  await page.getByTestId('senha').fill('senhaerrada');
  await page.getByTestId('entrar').click();
  
  await expect(page.getByText('Email e/ou senha inválidos')).toBeVisible();
  
  await expect(page.getByTestId('logout')).not.toBeVisible();
});