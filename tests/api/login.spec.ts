import { test, expect } from '@playwright/test';
import { criarUsuario, excluirUsuario, gerarUsuario } from './helpers/serverest';

test.describe('API ServeRest - Login', () => {
  const usuario = gerarUsuario();
  let id: string;

  test.beforeAll(async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: process.env.API_URL ?? 'https://serverest.dev' });
    id = await criarUsuario(ctx, usuario);
    await ctx.dispose();
  });

  test.afterAll(async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: process.env.API_URL ?? 'https://serverest.dev' });
    await excluirUsuario(ctx, id);
    await ctx.dispose();
  });

  test('deve realizar login com credenciais válidas e retornar token Bearer', async ({ request }) => {
    const res = await request.post('/login', {
      data: { email: usuario.email, password: usuario.password },
    });
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body.authorization).toMatch(/^Bearer .+/);
  });

  test('cenário inválido: não deve logar com senha incorreta', async ({ request }) => {
    const res = await request.post('/login', {
      data: { email: usuario.email, password: 'senhaErrada' },
    });
    const body = await res.json();

    expect(res.status()).toBe(401);
    expect(body.message).toBe('Email e/ou senha inválidos');
    expect(body.authorization).toBeUndefined();
  });
});
