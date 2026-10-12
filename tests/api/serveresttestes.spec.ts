import { test, expect } from '@playwright/test';

test.describe('Testes de API do ServeRest', () => {
    
    test('Deve listar os usuários cadastrados com sucesso', async ({ request }) => {
    const response = await request.get('/usuarios');
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('usuarios');
    expect(body.quantidade).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(body.usuarios)).toBeTruthy();
  });

  test('Deve cadastrar um novo usuário com sucesso', async ({ request }) => {
    const emailUnico = `qa_teste_${Date.now()}@gmail.com`;
    const response = await request.post('/usuarios', {
      data: {
        nome: 'Aluno Teste',
        email: emailUnico,
        password: 'teste123',
        administrador: 'true'
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body).toHaveProperty('_id');
  });

  test('Não deve cadastrar um usuário com email já existente', async ({ request }) => {
    const emailDuplicado = `duplicado_${Date.now()}@gmail.com`;
    await request.post('/usuarios', {
      data: {
        nome: 'Usuário 1',
        email: emailDuplicado,
        password: 'senha123',
        administrador: 'true'
      }
    });

    const response = await request.post('/usuarios', {
      data: {
        nome: 'Usuário 2',
        email: emailDuplicado,
        password: 'senha123',
        administrador: 'true'
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Este email já está sendo usado');
  });

  test('Deve retornar erro ao buscar produto com ID invalido ou inexistente', async ({ request }) => {
    const produtoIdInvalido = 'idInexistente123';
    const response = await request.get(`/produtos/${produtoIdInvalido}`);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Produto não encontrado');
  });

  test('Deve listar os produtos com sucesso', async ({ request }) => {
    const response = await request.get('/produtos');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('produtos');
    if (body.quantidade > 0) {
      expect(body.produtos[0]).toHaveProperty('nome');
      expect(body.produtos[0]).toHaveProperty('preco');
      expect(body.produtos[0]).toHaveProperty('quantidade');
    }
  });

  test('Não deve permitir login com senha incorreta', async ({ request }) => {
    const response = await request.post('/login', {
      data: {
        email: 'fulano@qa.com.br',
        password: 'senhaerrada'
      }
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Email e/ou senha inválidos');
  });
  

});