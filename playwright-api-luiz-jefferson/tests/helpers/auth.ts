import { APIRequestContext, expect } from '@playwright/test';
import { createUser, deleteUser } from './api';
import { makeUser } from '../data/factories';

export async function login(request: APIRequestContext, email: string, password: string) {
  return request.post('/login', { data: { email, password } });
}
export async function createAuthenticatedUser(request: APIRequestContext, admin = true) {
  const user = await createUser(request, makeUser(admin));
  try {
    const response = await login(request, user.data.email, user.data.password);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body.authorization).toBeTruthy();
    return { ...user, token: body.authorization as string };
  } catch (error) {
    await deleteUser(request, user.id);
    throw error;
  }
}
