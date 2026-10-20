import { test, expect } from '@playwright/test';
import { createUserFactory } from '../../data/factories';

test.describe('Gerenciamento de usuários da API do Serverest', () => {

    test('Deve cadastrar um novo usuário com sucesso utilizando o Faker', async ({ request }) => {
        const newUser = createUserFactory();
        const response = await request.post('/usuarios', { data: newUser });

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.message).toBe('Cadastro realizado com sucesso');
        expect(body).toHaveProperty('_id');
    });

    test('Não deve permitir o cadastro de um usuário com email já existente', async ({ request }) => {
        const user = createUserFactory();
        await request.post('/usuarios', { data: user });

        const response = await request.post('/usuarios', { data: user });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.message).toBe('Este email já está sendo usado');
    });

    test('Deve retornar mensagem de usuário não encontrado ao buscar por um ID inexistente', async ({ request }) => {
        const response = await request.get('/usuarios/idInexistente123');

        const body = await response.json();
        console.log(body);
        expect(body.message).toBe('Usuário não encontrado');
    });
});
