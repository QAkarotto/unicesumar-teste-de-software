
import { test, expect } from '@playwright/test';

test.describe('API ServeRest @api', () => {

  // Teste 1: listar usuários
  test('01 - Deve listar usuários e validar os dados', async ({ request }) => {
    const response = await request.get('/usuarios');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('quantidade');
    expect(typeof body.quantidade).toBe('number');
    expect(body).toHaveProperty('usuarios');
    expect(Array.isArray(body.usuarios)).toBe(true);

    if (body.usuarios.length > 0) {
      expect(body.usuarios[0]).toHaveProperty('nome');
      expect(body.usuarios[0]).toHaveProperty('email');
    }
  });

  // Teste 2: listar produtos
  test('02 - Deve listar produtos e validar os dados', async ({ request }) => {
    const response = await request.get('/produtos');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('quantidade');
    expect(typeof body.quantidade).toBe('number');
    expect(body).toHaveProperty('produtos');
    expect(Array.isArray(body.produtos)).toBe(true);

    if (body.produtos.length > 0) {
      expect(body.produtos[0]).toHaveProperty('nome');
      expect(body.produtos[0]).toHaveProperty('preco');
      expect(body.produtos[0]).toHaveProperty('quantidade');
    }
  });

  // Teste 3: pesquisar um usuário inexistente
  test('03 - Deve retornar lista vazia para usuário inexistente', async ({ request }) => {
    const response = await request.get('/usuarios', {
      params: {
        nome: 'usuario_inexistente_987654321'
      }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('quantidade', 0);
    expect(body.usuarios).toEqual([]);
  });

  // Teste 4: login com credenciais inválidas
  test('04 - Deve rejeitar login com credenciais inválidas', async ({ request }) => {
    const response = await request.post('/login', {
      data: {
        email: 'usuario.inexistente@example.com',
        password: 'senha_incorreta_123'
      }
    });

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body).toHaveProperty('message');
    expect(body.message).toBeTruthy();
    expect(body).not.toHaveProperty('authorization');
  });

  // Teste 5: cadastro incompleto
  test('05 - Deve rejeitar cadastro sem os campos obrigatórios', async ({ request }) => {
    const response = await request.post('/usuarios', {
      data: {}
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body).toHaveProperty('nome');
    expect(typeof body.nome).toBe('string');
    expect(body.nome.length).toBeGreaterThan(0);
  });

  // Teste 6: cadastro de produto sem autorização
  test('06 - Deve impedir cadastro de produto sem autorização', async ({ request }) => {
    const response = await request.post('/produtos', {
      data: {
        nome: 'Produto de teste automatizado',
        preco: 100,
        descricao: 'Produto usado em teste de API',
        quantidade: 10
      }
    });

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body).toHaveProperty('message');
    expect(body.message).toBeTruthy();
  });

});
