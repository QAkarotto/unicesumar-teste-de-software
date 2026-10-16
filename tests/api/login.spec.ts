import { test, expect } from '@playwright/test';
import { criarUsuario } from './helpers';

test.describe('API ServeRest - Login', () => {
  test('realiza login com credenciais válidas e retorna token Bearer (200)', async ({ request }) => {
    const usuario = await criarUsuario(request);
    const resp = await request.post('/login', {
      data: { email: usuario.email, password: usuario.password },
    });

    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body.authorization).toMatch(/^Bearer .+/);
  });

  test('cenário inválido: senha incorreta retorna 401', async ({ request }) => {
    const usuario = await criarUsuario(request);
    const resp = await request.post('/login', {
      data: { email: usuario.email, password: 'senha-errada' },
    });

    expect(resp.status()).toBe(401);
    const body = await resp.json();
    expect(body.message).toBe('Email e/ou senha inválidos');
    expect(body.authorization).toBeUndefined();
  });
});
