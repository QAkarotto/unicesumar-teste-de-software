
import { test, expect } from '@playwright/test';
import { criarUsuario } from '../data/factories';

test.describe('API de Login', () => {
    test('deve rejeitar login com credenciais inválidas', async ({ request }) => {
        const resposta = await request.post('/login', {
            data: {
                email: `inexistente.${crypto.randomUUID()}@example.com`,
                password: 'SenhaIncorreta123!',
            },
        });

        expect(resposta.status()).toBe(401);

        const dados = await resposta.json();

        expect(dados.message).toBe('Email e/ou senha inválidos');
    });

    test('deve autenticar um usuário cadastrado', async ({ request }) => {
        const usuario = criarUsuario();

        const cadastro = await request.post('/usuarios', {
            data: usuario,
        });

        expect(cadastro.status()).toBe(201);

        const dadosCadastro = await cadastro.json();

        try {
            const resposta = await request.post('/login', {
                data: {
                    email: usuario.email,
                    password: usuario.password,
                },
            });

            expect(resposta.status()).toBe(200);

            const dadosLogin = await resposta.json();

            expect(dadosLogin.message).toBe('Login realizado com sucesso');
            expect(dadosLogin.authorization).toBeTruthy();
        } finally {
            const exclusao = await request.delete(
                `/usuarios/${dadosCadastro._id}`,
            );

            expect(exclusao.ok()).toBe(true);
        }
    });
});
