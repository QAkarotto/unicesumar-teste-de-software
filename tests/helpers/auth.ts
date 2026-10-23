import { APIRequestContext } from '@playwright/test';
import { createUserPayload } from '../data/factories';

export async function getAuthToken(request: APIRequestContext): Promise<{ token: string; email: string; password: string }> {
  const userData = createUserPayload('true');

  // Cadastra usuário administrador
  await request.post('/usuarios', { data: userData });

  // Realiza login para obter o token
  const loginRes = await request.post('/login', {
    data: {
      email: userData.email,
      password: userData.password,
    },
  });

  const loginBody = await loginRes.json();

  return {
    token: loginBody.authorization,
    email: userData.email,
    password: userData.password,
  };
}
