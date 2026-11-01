
import { test as base, expect, request } from '@playwright/test';
import { usuarioFactory } from '../data/factories';

type Fixtures = {
  adminPage: import('@playwright/test').Page;
};

export const test = base.extend<Fixtures>({
  adminPage: async ({ page }, use) => {
    const api = await request.newContext({
      baseURL: 'https://serverest.dev',
    });

    let usuarioId: string | undefined;

    try {
      const usuario = usuarioFactory({ administrador: 'true' });

      const cadastro = await api.post('/usuarios', {
        data: usuario,
      });

      expect(cadastro.status()).toBe(201);

      const dados = await cadastro.json();
      usuarioId = dados._id;

      await page.goto('/login');
      await page.getByTestId('email').fill(usuario.email);
      await page.getByTestId('senha').fill(usuario.password);
      await page.getByTestId('entrar').click();

      await expect(page).toHaveURL(/\/home/);

      await use(page);
    } finally {
      if (usuarioId) {
        await api.delete(`/usuarios/${usuarioId}`);
      }

      await api.dispose();
    }
  },
});

export { expect } from '@playwright/test';
