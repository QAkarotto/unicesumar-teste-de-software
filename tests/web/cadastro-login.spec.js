
const { test, expect } = require('@playwright/test');
const { preencherCampo } = require('../../helpers/form');
const { randomUUID } = require('node:crypto');

test('Cenário 1 - cadastrar usuário e realizar login', async ({ page }) => {

    const identificador = randomUUID().slice(0, 8);

    const usuario = {
        nome: `Usuario E2E ${identificador}`,
        email: `usuario-${identificador}@teste.com`,
        senha: 'Teste@123',
    };

    await page.goto('/cadastrarusuarios');

    await preencherCampo(page, 'nome', usuario.nome);
    await preencherCampo(page, 'email', usuario.email);
    await preencherCampo(page, 'password', usuario.senha);

    const checkbox = page.getByTestId('checkbox');

    if (await checkbox.isChecked()) {
        await checkbox.uncheck();
    }

    const respostaCadastroPromise = page.waitForResponse(response => {
        const url = new URL(response.url());

        return (
            response.request().method() === 'POST' &&
            url.pathname.replace(/\/$/, '') === '/usuarios'
        );
    });

    await page.getByTestId('cadastrar').click();

    const respostaCadastro = await respostaCadastroPromise;

    expect(respostaCadastro.status()).toBe(201);

    await page.goto('/login');

    await preencherCampo(page, 'email', usuario.email);
    await preencherCampo(page, 'senha', usuario.senha);

    await page.getByTestId('entrar').click();

    await expect(page).toHaveURL(/\/home\/?$/);

    await expect(
        page.getByTestId('home')
    ).toBeVisible();

    await expect(
        page.getByTestId('logout')
    ).toBeVisible();
});
