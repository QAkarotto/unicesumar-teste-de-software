
const {
    test: base,
    expect,
    request,
} = require('@playwright/test');

const { preencherCampo } = require('../helpers/form');

const API_URL = 'https://serverest.dev';

const test = base.extend({

    adminPage: async ({ page }, use) => {

        const identificador = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`;

        const administrador = {
            nome: `Administrador E2E ${identificador}`,
            email: `admin-${identificador}@teste.com`,
            password: 'Teste@123',
            administrador: 'true',
        };

        const api = await request.newContext({
            baseURL: API_URL,
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
            },
        });

        try {

            const respostaCadastro = await api.post('/usuarios', {
                data: administrador,
            });

            expect(respostaCadastro.status()).toBe(201);

            await page.goto('/login');

            await preencherCampo(
                page,
                'email',
                administrador.email
            );

            await preencherCampo(
                page,
                'senha',
                administrador.password
            );

            await page.getByTestId('entrar').click();

            await expect(
                page.getByTestId('cadastrarProdutos')
            ).toBeVisible();

            await use(page);

        } finally {

            await api.dispose();
        }
    },
});

module.exports = {
    test,
    expect,
};
