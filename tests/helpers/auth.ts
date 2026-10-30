import { expect, type APIRequestContext } from '@playwright/test';

export async function login(request: APIRequestContext, email: string, password: string): Promise<string> {
  const resposta = await request.post('/login', { data: { email, password } });
  expect(resposta.status(), 'pré-condição: login').toBe(200);
  return (await resposta.json()).authorization;
}

export function autorizacao(token: string) {
  return { Authorization: token };
}
