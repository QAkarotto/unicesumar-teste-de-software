import {test, expect} from '@playwright/test';

test( 'deve cadastrar usuario', async ({ page }) => {

    const email = `teste${Date.now()}@gmail.com`;

    await page.goto('https://front.serverest.dev/cadastrarusuarios');
    await page.getByTestId('nome').fill('teste');
    await page.getByTestId('email').fill(email);
    await page.getByTestId('password').fill('teste');
    await page.getByTestId('cadastrar').click();

    await expect(page.getByTestId('pesquisar')).toBeVisible();
    await page.getByTestId('logout').click();
    await page.getByTestId('email').fill(email);
    await page.getByTestId('senha').fill('teste');
    await page.getByTestId('entrar').click();
    await expect(page.getByTestId('pesquisar')).toBeVisible();
});