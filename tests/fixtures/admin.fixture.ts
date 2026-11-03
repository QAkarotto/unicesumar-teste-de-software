import { expect, test as base, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

const frontUrl = process.env.SERVEREST_FRONT_URL ?? 'https://front.serverest.dev';

type AdminFixtures = {
  adminPage: Page;
};

export const test = base.extend<AdminFixtures>({
  adminPage: async ({ page, request }, use) => {
    const admin = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 16 }),
      administrador: 'true',
    };

    const cadastro = await request.post('/usuarios', { data: admin });
    expect(cadastro.ok(), 'A pré-condição deve criar o administrador pela API').toBeTruthy();
    const usuarioCriado = await cadastro.json();

    const login = await request.post('/login', {
      data: { email: admin.email, password: admin.password },
    });
    expect(login.ok(), 'A pré-condição deve autenticar o administrador pela API').toBeTruthy();
    const { authorization } = await login.json();

    await page.addInitScript(({ email, token, nome }) => {
      localStorage.setItem('serverest/userEmail', email);
      localStorage.setItem('serverest/userToken', token);
      localStorage.setItem('serverest/userNome', nome);
    }, { email: admin.email, token: authorization, nome: admin.nome });

    await page.goto(`${frontUrl}/admin/home`);
    await expect(page.getByTestId('cadastrarProdutos')).toBeVisible();

    await use(page);

    if (usuarioCriado._id) {
      await request.delete(`/usuarios/${usuarioCriado._id}`, {
        headers: { Authorization: authorization },
      });
    }
  },
});

export { expect };
