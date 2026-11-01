import { expect, type APIRequestContext } from '@playwright/test';
import type { Usuario } from '../data/factories';

export async function autenticar(
  request: APIRequestContext,
  usuario: Pick<Usuario, 'email' | 'password'>,
): Promise<{ Authorization: string }> {
  const response = await request.post('/login', {
    data: { email: usuario.email, password: usuario.password },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toBe('Login realizado com sucesso');
  expect(body.authorization).toMatch(/^Bearer\s+\S+$/);
  return { Authorization: body.authorization };
}
