
import { test as base, expect, request, type Page } from '@playwright/test';
import { criarUsuario } from '../data/factories';

type Fixtures = {
    adminPage: Page;
};

export const test = base.extend < Fixtures > ({
    adminPage: async ({ page }, use) => {
        const api = await request.newContext({
            baseURL: 'https://serverest.dev',
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
            },
        });

        const admin = criarUsuario('true');
        let adminId: string | undefined;

        try {
            const cadastro = await api.post('/usuarios', {
                data: admin,
            });

            if (cadastro.status() !== 201) {
                throw new Error(
                    `Falha ao criar administrador: ${await cadastro.text()}`,
                );
            }

            const resposta = await cadastro.json();
            adminId = resposta._id;

            // Autenticação realizada pela interface web.
            await page.goto('/login');

            await page.locator('input[type="email"]').fill(admin.email);
            await page.locator('input[type="password"]').fill(admin.password);

            await page.getByRole('button', {
                name: /entrar/i,
            }).click();

            await expect(page).toHaveURL(/admin/);

            await use(page);

        } finally {
            if (adminId) {
                await api.delete(`/usuarios/${adminId}`);
            }

            await api.dispose();
        }
    },
});

export { expect };
