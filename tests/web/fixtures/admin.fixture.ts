import { test as base, expect, Page } from '@playwright/test';

const FRONT_URL = 'https://front.serverest.dev';
const API_URL = 'https://serverest.dev';

type Fixtures = {
  adminPage: Page;
};

export const test = base.extend<Fixtures>({
  adminPage: async ({ page, request }, use) => {
    const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const admin = {
      nome: `Administrador E2E ${id}`,
      email: `admin.e2e.${id}@teste.com`,
      password: 'TesteE2E123',
      administrador: 'true',
    };

    const cadastro = await request.post(`${API_URL}/usuarios`, {
      data: admin,
    });

    expect(cadastro.status()).toBe(201);

    await page.goto(FRONT_URL);

    await page.getByPlaceholder('Digite seu email').fill(admin.email);
    await page.getByPlaceholder('Digite sua senha').fill(admin.password);

    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(
      page.getByTestId('cadastrar-produtos')
    ).toBeVisible();

    await use(page);
  },
});

export { expect };