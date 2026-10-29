import { test, expect } from '@playwright/test';
import { criarUsuarioDto, criarProdutoDto } from '../../data/factories';
import { obterTokenAutenticacao } from '../../helpers/auth';

test.describe('Testes de API - ServeRest (Usuários e Autenticação)', () => {

  test('1. Deve realizar autenticação com dados válidos', async ({ request }) => {
    const usuario = criarUsuarioDto();
    
    await request.post('/usuarios', { data: usuario });

    const resposta = await request.post('/login', {
      data: {
        email: usuario.email,
        password: usuario.password,
      },
    });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Login realizado com sucesso');
    expect(corpo.authorization).toBeDefined();
  });

  test('2. Deve falhar ao autenticar com dados inválidos', async ({ request }) => {
    const resposta = await request.post('/login', {
      data: {
        email: 'email_inexistente_123@teste.com',
        password: 'senhaerrada',
      },
    });

    expect(resposta.status()).toBe(401);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Email e/ou senha inválidos');
  });

  test('3. Deve cadastrar um usuário utilizando dados gerados dinamicamente', async ({ request }) => {
    const novoUsuario = criarUsuarioDto();

    const resposta = await request.post('/usuarios', {
      data: novoUsuario,
    });

    expect(resposta.status()).toBe(201);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Cadastro realizado com sucesso');
    expect(corpo._id).toBeDefined();
  });

  test('4. Deve validar erro ao tentar cadastrar usuário com e-mail já existente (Regra de negócio)', async ({ request }) => {
    const usuario = criarUsuarioDto();

    await request.post('/usuarios', { data: usuario });

    const resposta = await request.post('/usuarios', { data: usuario });

    expect(resposta.status()).toBe(400);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Este email já está sendo usado');
  });

  test('5. Deve realizar operação que exija autenticação (consultar dados protegidos ou criar produto com token)', async ({ request }) => {
    const token = await obterTokenAutenticacao(request);
    const produtoDto = criarProdutoDto();

    const resposta = await request.post('/produtos', {
      headers: {
        authorization: token,
      },
      data: produtoDto,
    });

    expect(resposta.status()).toBe(201);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Cadastro realizado com sucesso');
  });

});