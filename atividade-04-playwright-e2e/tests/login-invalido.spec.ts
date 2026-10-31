
import { test, expect } from '@playwright/test';

test('deve impedir login com credenciais invalidas', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email').fill('invalido@example.com');
  await page.getByTestId('senha').fill('senhaerrada123');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText('Email e/ou senha inválidos')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});
