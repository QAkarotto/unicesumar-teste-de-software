import { test, expect } from '@playwright/test';

test.describe('Testes de API - ServeRest (Usuários)', () => {

  const timestamp = Date.now();
  const emailUnico = `qa_teste_${timestamp}@qa.com`;

  // 1. Cenário de Sucesso: Cadastrar um novo usuário com sucesso
  test('Deve cadastrar um novo usuário com sucesso', async ({ request }) => {
    const resposta = await request.post('/usuarios', {
      data: {
        nome: "Fulano da Silva",
        email: emailUnico,
        password: "teste",
        administrador: "true"
      }
    });

    expect(resposta.status()).toBe(201);
    const corpo = await resposta.json();
    expect(corpo.message).toBe("Cadastro realizado com sucesso");
    expect(corpo).toHaveProperty('_id');
  });

  // 2. Regra de Negócio: Não permitir cadastro com e-mail já existente
  test('Não deve permitir cadastrar usuário com e-mail já utilizado', async ({ request }) => {
    const resposta = await request.post('/usuarios', {
      data: {
        nome: "Fulano Duplicado",
        email: emailUnico,
        password: "teste",
        administrador: "true"
      }
    });

    expect(resposta.status()).toBe(400);
    const corpo = await resposta.json();
    expect(corpo.message).toBe("Este email já está sendo usado");
  });

  // 3. Cenário de Sucesso: Listar todos os usuários cadastrados
  test('Deve listar todos os usuários com sucesso', async ({ request }) => {
    const resposta = await request.get('/usuarios');

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo).toHaveProperty('quantidade');
    expect(corpo).toHaveProperty('usuarios');
    expect(Array.isArray(corpo.usuarios)).toBeTruthy();
    expect(corpo.quantidade).toBeGreaterThan(0);
  });

  // 4. Cenário de Sucesso / Regra de Negócio: Buscar usuário específico por ID
  test('Deve buscar um usuário específico pelo ID', async ({ request }) => {
    const emailBusca = `busca_${Date.now()}@qa.com`;
    const novoUsuario = await request.post('/usuarios', {
      data: {
        nome: "Usuário Busca",
        email: emailBusca,
        password: "123",
        administrador: "false"
      }
    });
    const dadosCriacao = await novoUsuario.json();
    const idUsuario = dadosCriacao._id;

    const resposta = await request.get(`/usuarios/${idUsuario}`);

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.nome).toBe("Usuário Busca");
    expect(corpo.email).toBe(emailBusca);
    expect(corpo._id).toBe(idUsuario);
  });

  // 5. Cenário Inválido: Buscar usuário com ID inexistente
  test('Deve retornar erro ao buscar usuário com ID inexistente', async ({ request }) => {
    const idInexistente = "idInvalido123456";
    const resposta = await request.get(`/usuarios/${idInexistente}`);

    expect(resposta.status()).toBe(400);
    const corpo = await resposta.json();
    expect(corpo.message).toBe("Usuário não encontrado");
  });

  // 6. Cenário Inválido: Tentar cadastrar usuário com campos obrigatórios faltando
  test('Não deve permitir cadastrar usuário com campos faltando', async ({ request }) => {
    const resposta = await request.post('/usuarios', {
      data: {
        nome: "",
        email: "",
        password: "teste",
        administrador: "true"
      }
    });

    expect(resposta.status()).toBe(400);
    const corpo = await resposta.json();
    expect(corpo).toHaveProperty('email');
  });

});
