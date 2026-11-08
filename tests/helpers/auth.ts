import { expect, type APIRequestContext } from '@playwright/test';

export async function autenticar(
  request: APIRequestContext,
  usuario: { email: string; password: string },
) {
  const response = await request.post('/login', {
    data: { email: usuario.email, password: usuario.password },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toBe('Login realizado com sucesso');
  expect(body.authorization).toMatch(/^Bearer \S+$/);
  return body.authorization as string;
}
