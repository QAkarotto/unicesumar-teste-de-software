
import { test, expect } from '@playwright/test';

test('deve cadastrar e autenticar um usuario', async ({ page }) => {
  const email = `brunolaroca20.${Date.now()}@example.com`;
  const senha = 'sevstest';

  await page.goto('/cadastrarusuarios');

  await page.getByTestId('nome').fill('Sevs test');
  await page.getByTestId('email').fill(email);
  await page.getByTestId('password').fill(senha);
  await page.getByTestId('checkbox').uncheck();
  await page.getByTestId('cadastrar').click();

  await expect(page.getByText('Serverest Store')).toBeVisible();

  await page.getByText('Logout', { exact: true }).click();

  await page.goto('/login');

  await page.getByTestId('email').fill(email);
  await page.getByTestId('senha').fill(senha);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText('Serverest Store')).toBeVisible();
});
