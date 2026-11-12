import { test, expect } from '@playwright/test';
import { createUserPayload } from '../data/factories';

test.describe('Testes de Autenticação - ServeRest', () => {

  test('1. Autenticação com dados válidos', async ({ request }) => {
    const user = createUserPayload();
    await request.post('/usuarios', { data: user });

    const response = await request.post('/login', {
      data: {
        email: user.email,
        password: user.password,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('authorization');
    expect(body.message).toBe('Login realizado com sucesso');
  });

  test('2. Autenticação com dados inválidos', async ({ request }) => {
    const response = await request.post('/login', {
      data: {
        email: 'usuario_inexistente_12345@email.com',
        password: 'senha_errada',
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Email e/ou senha inválidos');
  });
});
