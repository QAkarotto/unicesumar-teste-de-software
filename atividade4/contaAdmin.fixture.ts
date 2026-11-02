import {test as base, expect, Page } from '@playwright/test';

type Fixtures = {
    fixturePage: Page;
}

const test = base.extend<Fixtures>({
    fixturePage: async ({ page, request }, use) => {
        const email = `teste.${Date.now()}@gmail.com`;

        await request.post('https://serverest.dev/usuarios', {
            data: {
                nome: 'AdminTeste',
                email: email,
                password: 'teste',
                administrador: 'true'
            }
        });

        await page.goto('https://front.serverest.dev/login');
        await page.getByTestId('email').fill(email);
        await page.getByTestId('senha').fill('teste');
        await page.getByTestId('entrar').click();
        await expect(page.getByTestId('cadastrarUsuarios')).toBeVisible();

        await use(page);

    }
});

export { test };