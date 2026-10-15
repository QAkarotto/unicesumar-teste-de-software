
import { test, expect } from '@playwright/test';

test.describe('API ServeRest - Usuários, Produtos e Carrinhos', () => {
    test('01 - Deve listar usuários com sucesso', async ({ request }) => {
        const response = await request.get('/usuarios');

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('quantidade');
        expect(body).toHaveProperty('usuarios');
        expect(Array.isArray(body.usuarios)).toBe(true);
        expect(body.quantidade).toBe(body.usuarios.length);
    });

    test('02 - Deve listar produtos com sucesso', async ({ request }) => {
        const response = await request.get('/produtos');

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('quantidade');
        expect(body).toHaveProperty('produtos');
        expect(Array.isArray(body.produtos)).toBe(true);
        expect(body.quantidade).toBe(body.produtos.length);
    });

    test('03 - Deve listar carrinhos com sucesso', async ({ request }) => {
        const response = await request.get('/carrinhos');

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('quantidade');
        expect(body).toHaveProperty('carrinhos');
        expect(Array.isArray(body.carrinhos)).toBe(true);
        expect(body.quantidade).toBe(body.carrinhos.length);
    });

    test('04 - Deve rejeitar login com credenciais inválidas', async ({ request }) => {
        const response = await request.post('/login', {
            data: {
                email: 'usuario.inexistente.atividade01@example.com',
                password: 'senha_incorreta_123',
            },
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body.message).toBe('Email e/ou senha inválidos');
    });

    test('05 - Deve impedir cadastro de produto sem autenticação', async ({ request }) => {
        const response = await request.post('/produtos', {
            data: {
                nome: 'Produto Teste Playwright Sem Autenticacao',
                preco: 100,
                descricao: 'Produto utilizado em teste automatizado',
                quantidade: 10,
            },
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body.message).toContain('Token de acesso');
    });

    test('06 - Deve cadastrar um usuário com dados válidos', async ({ request }) => {
        const email = `playwright.${Date.now()}.${Math.random()
            .toString(36)
            .slice(2, 8)}@example.com`;

        const response = await request.post('/usuarios', {
            data: {
                nome: 'Usuario de Teste Playwright',
                email,
                password: 'SenhaTeste123',
                administrador: 'false',
            },
        });

        expect(response.status()).toBe(201);

        const body = await response.json();

        expect(body.message).toBe('Cadastro realizado com sucesso');
        expect(body._id).toBeTruthy();

        // Confirma que o usuário criado pode ser encontrado pelo e-mail.
        const consulta = await request.get('/usuarios', {
            params: { email },
        });

        expect(consulta.status()).toBe(200);

        const usuariosBody = await consulta.json();

        expect(usuariosBody.quantidade).toBe(1);
        expect(usuariosBody.usuarios[0].email).toBe(email);
        expect(usuariosBody.usuarios[0].nome).toBe('Usuario de Teste Playwright');
    });

    test('07 - Deve rejeitar cadastro de e-mail já utilizado', async ({ request }) => {
        const email = `duplicado.${Date.now()}.${Math.random()
            .toString(36)
            .slice(2, 8)}@example.com`;

        const usuario = {
            nome: 'Usuario para Teste de Duplicidade',
            email,
            password: 'SenhaTeste123',
            administrador: 'false',
        };

        const primeiroCadastro = await request.post('/usuarios', {
            data: usuario,
        });

        expect(primeiroCadastro.status()).toBe(201);

        const segundoCadastro = await request.post('/usuarios', {
            data: usuario,
        });

        expect(segundoCadastro.status()).toBe(400);

        const body = await segundoCadastro.json();

        expect(body.message).toBe('Este email já está sendo usado');
    });
});
