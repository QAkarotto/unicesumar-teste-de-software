
const { test, expect } = require('@playwright/test');
const { preencherCampo } = require('../../helpers/form');
const { randomUUID } = require('node:crypto');

test('Cenário 3 - impedir login com credenciais inválidas', async ({ page }) => {

    const emailInvalido = `inexistente-${randomUUID()}@teste.com`;

    const senhaInvalida = 'SenhaIncorreta123';

    await page.goto('/login');

    await preencherCampo(
        page,
        'email',
        emailInvalido
    );

    await preencherCampo(
        page,
        'senha',
        senhaInvalida
    );

    await page.getByTestId('entrar').click();

    await expect(
        page.getByText('Email e/ou senha inválidos', {
            exact: false,
        })
    ).toBeVisible();

    await expect(page).toHaveURL(/\/login/);

    await expect(
        page.getByTestId('home')
    ).toHaveCount(0);

    await expect(
        page.getByTestId('logout')
    ).toHaveCount(0);
});
