
import { test, expect } from '@playwright/test';

test.describe('API de login', () => {
  test('deve rejeitar login com credenciais inválidas', async ({
    request
  }) => {
    const response = await request.post('/login', {
      data: {
        email: 'usuario-inexistente@exemplo.com',
        password: 'SenhaIncorreta123'
      }
    });

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.message).toBe('Email e/ou senha inválidos');
    expect(body).not.toHaveProperty('authorization');
  });
});
