import { test, expect } from '@playwright/test';
import { autenticar, criarUsuario, novoProduto } from './helpers';

test.describe('API ServeRest - Produtos', () => {
  test('administrador cadastra produto e consulta por _id', async ({ request }) => {
    const admin = await criarUsuario(request, 'true');
    const token = await autenticar(request, admin.email, admin.password);
    const produto = novoProduto();

    const criado = await request.post('/produtos', {
      headers: { Authorization: token },
      data: produto,
    });
    expect(criado.status()).toBe(201);
    const corpoCriado = await criado.json();
    expect(corpoCriado.message).toBe('Cadastro realizado com sucesso');
    expect(corpoCriado._id).toBeTruthy();

    const consulta = await request.get(`/produtos/${corpoCriado._id}`);
    expect(consulta.status()).toBe(200);
    const body = await consulta.json();
    expect(body.nome).toBe(produto.nome);
    expect(body.preco).toBe(produto.preco);
    expect(body.quantidade).toBe(produto.quantidade);
  });

  test('regra de negócio: usuário não administrador não cadastra produto (403)', async ({ request }) => {
    const comum = await criarUsuario(request, 'false');
    const token = await autenticar(request, comum.email, comum.password);

    const resp = await request.post('/produtos', {
      headers: { Authorization: token },
      data: novoProduto(),
    });

    expect(resp.status()).toBe(403);
    expect((await resp.json()).message).toBe('Rota exclusiva para administradores');
  });

  test('cenário inválido: cadastro de produto sem token retorna 401', async ({ request }) => {
    const resp = await request.post('/produtos', { data: novoProduto() });

    expect(resp.status()).toBe(401);
    expect((await resp.json()).message).toContain('Token de acesso ausente');
  });

  test('regra de negócio: não permite produto com nome duplicado (400)', async ({ request }) => {
    const admin = await criarUsuario(request, 'true');
    const token = await autenticar(request, admin.email, admin.password);
    const produto = novoProduto();
    const headers = { Authorization: token };

    const primeiro = await request.post('/produtos', { headers, data: produto });
    expect(primeiro.status()).toBe(201);

    const duplicado = await request.post('/produtos', { headers, data: produto });
    expect(duplicado.status()).toBe(400);
    expect((await duplicado.json()).message).toBe('Já existe produto com esse nome');
  });

  test('lista produtos e valida estrutura da resposta (200)', async ({ request }) => {
    const resp = await request.get('/produtos');

    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(typeof body.quantidade).toBe('number');
    expect(Array.isArray(body.produtos)).toBe(true);
    expect(body.produtos.length).toBe(body.quantidade);
  });
});
