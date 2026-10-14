
import { test, expect } from '@playwright/test';

test.describe('API ServeRest', () => {
  test('1 - Deve listar os usuários', async ({ request }) => {
    const response = await request.get('/usuarios');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('quantidade');
    expect(body).toHaveProperty('usuarios');
    expect(Array.isArray(body.usuarios)).toBe(true);
    expect(body.quantidade).toBe(body.usuarios.length);
  });

  test('2 - Deve listar os produtos', async ({ request }) => {
    const response = await request.get('/produtos');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('quantidade');
    expect(body).toHaveProperty('produtos');
    expect(Array.isArray(body.produtos)).toBe(true);
    expect(body.quantidade).toBe(body.produtos.length);
  });

  test('3 - Deve listar as categorias', async ({ request }) => {
    const response = await request.get('/categorias');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('quantidade');
    expect(body).toHaveProperty('categorias');
    expect(Array.isArray(body.categorias)).toBe(true);
    expect(body.quantidade).toBe(body.categorias.length);
  });

  test('4 - Os produtos devem possuir os campos esperados', async ({ request }) => {
    const response = await request.get('/produtos');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.produtos.length).toBeGreaterThan(0);

    const produto = body.produtos[0];

    expect(produto).toHaveProperty('nome');
    expect(produto).toHaveProperty('preco');
    expect(produto).toHaveProperty('descricao');
    expect(produto).toHaveProperty('quantidade');
  });

  test('5 - Os usuários devem possuir os campos esperados', async ({ request }) => {
    const response = await request.get('/usuarios');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.usuarios.length).toBeGreaterThan(0);

    const usuario = body.usuarios[0];

    expect(usuario).toHaveProperty('nome');
    expect(usuario).toHaveProperty('email');
    expect(usuario).toHaveProperty('administrador');
  });

  test('6 - Deve rejeitar credenciais inválidas', async ({ request }) => {
    const response = await request.post('/login', {
      data: {
        email: 'usuario-inexistente@example.com',
        password: 'senha-incorreta',
      },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Email e/ou senha inválidos');
  });
});
