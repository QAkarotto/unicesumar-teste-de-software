import {test, expect} from '@playwright/test';

test('deve falhar login ao usar credenciais inválidas', async ({ page }) => {
    await page.goto('https://front.serverest.dev/login');
    await page.getByTestId('email').fill('emailInvalido@gmail.com');
    await page.getByTestId('senha').fill('senhaInvalida');
    await page.getByTestId('entrar').click();
    await expect(page.getByText('Email e/ou senha inválidos')).toBeVisible();
});