import { test, expect } from '@playwright/test';
import {
  criarUsuario, excluirUsuario, fazerLogin, gerarProduto, gerarUsuario, Usuario,
} from './helpers/serverest';

test.describe('API ServeRest - Produtos', () => {
  const admin: Usuario = gerarUsuario(true);
  const comum: Usuario = gerarUsuario(false);
  let idAdmin: string;
  let idComum: string;
  let tokenAdmin: string;
  let tokenComum: string;

  test.beforeAll(async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: process.env.API_URL ?? 'https://serverest.dev' });
    idAdmin = await criarUsuario(ctx, admin);
    idComum = await criarUsuario(ctx, comum);
    tokenAdmin = await fazerLogin(ctx, admin);
    tokenComum = await fazerLogin(ctx, comum);
    await ctx.dispose();
  });

  test.afterAll(async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: process.env.API_URL ?? 'https://serverest.dev' });
    await excluirUsuario(ctx, idAdmin);
    await excluirUsuario(ctx, idComum);
    await ctx.dispose();
  });

  test('administrador deve cadastrar produto e consultá-lo em seguida', async ({ request }) => {
    const produto = gerarProduto();

    const criar = await request.post('/produtos', {
      data: produto,
      headers: { Authorization: tokenAdmin },
    });
    const criado = await criar.json();

    expect(criar.status()).toBe(201);
    expect(criado.message).toBe('Cadastro realizado com sucesso');
    expect(criado._id).toEqual(expect.any(String));

    const consulta = await request.get(`/produtos/${criado._id}`);
    const body = await consulta.json();

    expect(consulta.status()).toBe(200);
    expect(body).toMatchObject({ ...produto, _id: criado._id });

    await request.delete(`/produtos/${criado._id}`, { headers: { Authorization: tokenAdmin } });
  });

  test('regra de negócio: usuário não administrador não pode cadastrar produto', async ({ request }) => {
    const res = await request.post('/produtos', {
      data: gerarProduto(),
      headers: { Authorization: tokenComum },
    });
    const body = await res.json();

    expect(res.status()).toBe(403);
    expect(body.message).toBe('Rota exclusiva para administradores');
  });

  test('cenário inválido: não deve cadastrar produto sem token de autenticação', async ({ request }) => {
    const res = await request.post('/produtos', { data: gerarProduto() });
    const body = await res.json();

    expect(res.status()).toBe(401);
    expect(body.message).toContain('Token de acesso ausente');
  });

  test('regra de negócio: não deve permitir dois produtos com o mesmo nome', async ({ request }) => {
    const produto = gerarProduto();
    const headers = { Authorization: tokenAdmin };

    const primeiro = await request.post('/produtos', { data: produto, headers });
    expect(primeiro.status()).toBe(201);
    const { _id } = await primeiro.json();

    const duplicado = await request.post('/produtos', { data: produto, headers });
    const body = await duplicado.json();

    expect(duplicado.status()).toBe(400);
    expect(body.message).toBe('Já existe produto com esse nome');

    await request.delete(`/produtos/${_id}`, { headers });
  });
});
