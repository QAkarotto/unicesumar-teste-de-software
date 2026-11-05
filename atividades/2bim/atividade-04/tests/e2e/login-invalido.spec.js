const { test, expect } = require('@playwright/test');

test('não deve permitir login com credenciais inválidas', async ({ page }) => {

  await page.goto('/login');


  await page.getByTestId('email').fill('usuario.inexistente@teste.com');
  await page.getByTestId('senha').fill('SenhaErrada@123');

  const respostaLogin = page.waitForResponse(resposta =>
    resposta.url().includes('/login') &&
    resposta.request().method() === 'POST'
  );

  await page.getByRole('button', { name: 'Entrar' }).click();

  const resposta = await respostaLogin;

  expect(resposta.status()).toBe(401);

  await expect(
    page.getByText('Email e/ou senha inválidos')
  ).toBeVisible();

  await expect(page).toHaveURL(/\/login$/);
});