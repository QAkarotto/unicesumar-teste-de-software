import { test, expect } from '@playwright/test';
import { createUserFactory } from '../../data/factories';

test.describe('Autenticação da API do Serverest', () => {

    test('Deve realizar login com sucesso com credenciais válidas', async ({ request }) => {
        const userData = createUserFactory();
        await request.post('/usuarios', { data: userData });

        const response = await request.post('/login', {
            data: {
                email: userData.email,
                password: userData.password,
            },
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('authorization');
    });

    test('Deve retornar erro ao tentar realizar login com senha incorreta', async ({ request }) => {
        const response = await request.post('/login', {
            data: {
                email: 'emailinexistente@gmail.com', password: 'senhaincorreta123'
            },
        });

        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.message).toBe('Email e/ou senha inválidos');
    });
});
