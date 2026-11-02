import { test as base, Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

type MyFixtures = {
  adminPage: Page;
};

export const test = base.extend<MyFixtures>({
  adminPage: async ({ page, request }, use) => {
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: nome,
        email: email,
        password: password,
        administrador: 'true'
      }
    });

    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.getByTestId('email').fill(email);
    await page.getByTestId('senha').fill(password);
    await page.getByTestId('entrar').click();

    await page.waitForURL('**/admin/home', { waitUntil: 'domcontentloaded' });

    await use(page);
  },
});

export { expect };