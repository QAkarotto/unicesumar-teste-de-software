
import { test, expect } from '@playwright/test';
import { criarUsuario } from '../data/factories';

test.describe('API de Usuários', () => {
    test('deve listar usuários com estrutura válida', async ({ request }) => {
        const resposta = await request.get('/usuarios');

        expect(resposta.status()).toBe(200);

        const dados = await resposta.json();

        expect(dados).toHaveProperty('quantidade');
        expect(dados).toHaveProperty('usuarios');
        expect(Array.isArray(dados.usuarios)).toBe(true);
        expect(dados.quantidade).toBe(dados.usuarios.length);
    });

    test('deve cadastrar um usuário com dados válidos', async ({ request }) => {
        const usuario = criarUsuario();

        const resposta = await request.post('/usuarios', {
            data: usuario,
        });

        expect(resposta.status()).toBe(201);

        const dados = await resposta.json();

        expect(dados.message).toBe('Cadastro realizado com sucesso');
        expect(dados._id).toBeTruthy();

        try {
            const consulta = await request.get(`/usuarios/${dados._id}`);

            expect(consulta.status()).toBe(200);

            const usuarioConsultado = await consulta.json();

            expect(usuarioConsultado.email).toBe(usuario.email);
        } finally {
            const exclusao = await request.delete(`/usuarios/${dados._id}`);
            expect(exclusao.ok()).toBe(true);
        }
    });

    test('não deve cadastrar dois usuários com o mesmo e-mail', async ({ request }) => {
        const usuario = criarUsuario();

        const primeiroCadastro = await request.post('/usuarios', {
            data: usuario,
        });

        expect(primeiroCadastro.status()).toBe(201);

        const dadosCadastro = await primeiroCadastro.json();

        try {
            const segundoCadastro = await request.post('/usuarios', {
                data: usuario,
            });

            expect(segundoCadastro.status()).toBe(400);

            const dadosErro = await segundoCadastro.json();

            expect(dadosErro.message).toContain('email');
        } finally {
            const exclusao = await request.delete(
                `/usuarios/${dadosCadastro._id}`,
            );

            expect(exclusao.ok()).toBe(true);
        }
    });

    test('deve rejeitar cadastro sem e-mail', async ({ request }) => {
        const usuario = criarUsuario();
        const { email: _email, ...usuarioSemEmail } = usuario;

        const resposta = await request.post('/usuarios', {
            data: usuarioSemEmail,
        });

        expect(resposta.status()).toBe(400);

        const dados = await resposta.json();

        expect(dados).toHaveProperty('email');
        expect(dados.email).toContain('obrigatório');
    });
});
