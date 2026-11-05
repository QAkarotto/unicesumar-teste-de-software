
import { test, expect } from '@playwright/test';

test('não deve permitir autenticação com credenciais inválidas', async ({
    page,
}) => {
    await page.goto('/login');

    // Informações inválidas.
    await page.locator('input[type="email"]').fill(
        'usuario.inexistente@example.com',
    );

    await page.locator('input[type="password"]').fill(
        'SenhaIncorreta123!',
    );

    // Tentativa de autenticação.
    await page.getByRole('button', {
        name: /entrar/i,
    }).click();

    // Valida a mensagem de erro.
    await expect(
        page.getByText(/email e\/ou senha inválidos/i),
    ).toBeVisible();

    // Verifica que o usuário continua fora da área autenticada.
    await expect(page).not.toHaveURL(/\/admin|\/home/);

    await expect(
        page.getByRole('button', { name: /entrar/i }),
    ).toBeVisible();
});
