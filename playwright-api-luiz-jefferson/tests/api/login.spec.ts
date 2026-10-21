import { test, expect } from '@playwright/test';
import { createUser, deleteUser } from '../helpers/api';
import { login } from '../helpers/auth';

 test('login com credenciais válidas retorna token', async ({ request }) => {
  const user = await createUser(request);
  try {
    const response = await login(request, user.data.email, user.data.password);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body.authorization).toMatch(/^Bearer\s.+/);
  } finally { await deleteUser(request, user.id); }
});

test('login com senha inválida é rejeitado', async ({ request }) => {
  const user = await createUser(request);
  try {
    const response = await login(request, user.data.email, 'senha-errada');
    expect(response.status()).toBe(401);
    expect((await response.json()).message).toBe('Email e/ou senha inválidos');
  } finally { await deleteUser(request, user.id); }
});

test('login sem email retorna erro de validação', async ({ request }) => {
  const response = await request.post('/login', { data: { password: '123456' } });
  expect(response.status()).toBe(400);
  expect((await response.json()).email).toBeTruthy();
});
