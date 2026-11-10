import { APIRequestContext } from '@playwright/test';
import { createUserFactory } from '../data/factories';

export async function getAuthToken(request: APIRequestContext): Promise<string> {
  const userData = createUserFactory();
  await request.post('/usuarios', { data: userData });

  const loginResponse = await request.post('/login', {
    data: {
      email: userData.email,
      password: userData.password,
    },
  });

  const loginBody = await loginResponse.json();
  return loginBody.authorization;
}