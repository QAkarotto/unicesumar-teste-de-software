
import { test as base, expect, Page } from '@playwright/test';

type AdminFixture = {
  adminPage: Page;
};

export const test = base.extend<AdminFixture>({
  adminPage: async ({ page, request }, use) => {
    const email = `admin.sevs.${Date.now()}@example.com`;
    const senha = 'sevstest';

    const resposta = await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: 'Admin Sevs Teste',
        email,
        password: senha,
        administrador: 'true'
      }
    });

    expect(resposta.status()).toBe(201);

    await page.goto('/login');

    await page.getByTestId('email').fill(email);
    await page.getByTestId('senha').fill(senha);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByTestId('cadastrar-produtos')).toBeVisible();

    await use(page);
  }
});

export { expect };
