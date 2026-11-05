import { test, expect } from '@playwright/test';

test('não deve permitir login com credenciais inválidas', async ({
  page,
}) => {
  await page.goto('https://front.serverest.dev/');

  await page.getByPlaceholder('Digite seu email').fill(
    'usuario.inexistente@teste.com'
  );

  await page.getByPlaceholder('Digite sua senha').fill(
    'SenhaIncorreta123'
  );

  await page.getByRole('button', { name: 'Entrar' }).click();

  // Verifica a mensagem de erro.
  await expect(
    page.getByText(/email e\/ou senha inválidos/i)
  ).toBeVisible();

  // Confirma que não houve acesso à área autenticada.
  await expect(page.getByText(/logout/i)).not.toBeVisible();
});