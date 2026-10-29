import { test, expect } from '@playwright/test';
import { cadastrarUsuario } from './support/api';

test.describe('Login - /login', () => {
  test('CT06 - deve autenticar um usuário cadastrado e retornar um token Bearer', async ({ request }) => {
    const usuario = await cadastrarUsuario(request);

    const response = await request.post('/login', {
      data: { email: usuario.email, password: usuario.password },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Login realizado com sucesso');
    // Formato esperado: "Bearer <header>.<payload>.<assinatura>" (JWT)
    expect(body.authorization).toMatch(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/);
  });

  test('CT07 - não deve autenticar com senha incorreta', async ({ request }) => {
    const usuario = await cadastrarUsuario(request);

    const response = await request.post('/login', {
      data: { email: usuario.email, password: 'SenhaErrada!' },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ message: 'Email e/ou senha inválidos' });
    expect(body).not.toHaveProperty('authorization');
  });
});
