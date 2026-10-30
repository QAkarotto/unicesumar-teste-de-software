import { test, expect } from '../fixtures/api.fixture';
import { gerarProduto } from '../data/factories';
import {
  atualizarProduto,
  buscarProduto,
  cadastrarProduto,
  excluirProduto,
} from '../helpers/api';

test.describe('API ServeRest - Produtos', () => {
  test('exige autenticação para cadastrar produto', async ({ request }) => {
    const resp = await request.post('/produtos', { data: gerarProduto() });

    expect(resp.status()).toBe(401);
    expect((await resp.json()).message).toContain('Token de acesso ausente');
  });

  test('regra de negócio: usuário não administrador não cadastra produto', async ({
    request,
    comum,
  }) => {
    const resp = await cadastrarProduto(request, comum.token, gerarProduto());

    expect(resp.status()).toBe(403);
    expect((await resp.json()).message).toBe('Rota exclusiva para administradores');
  });

  test('admin cadastra produto e os dados ficam persistidos', async ({ request, admin }) => {
    const produto = gerarProduto();

    const resp = await cadastrarProduto(request, admin.token, produto);
    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();

    try {
      const consulta = await buscarProduto(request, body._id);
      expect(consulta.status()).toBe(200);
      expect(await consulta.json()).toMatchObject({ ...produto, _id: body._id });
    } finally {
      await excluirProduto(request, admin.token, body._id);
    }
  });

  test('não cadastra produto com preço inválido', async ({ request, admin }) => {
    const resp = await cadastrarProduto(request, admin.token, gerarProduto({ preco: -10 }));

    expect(resp.status()).toBe(400);
    expect((await resp.json()).preco).toMatch(/preco/);
  });

  test('regra de negócio: não permite nome de produto duplicado', async ({
    request,
    admin,
    criarProduto,
  }) => {
    const existente = await criarProduto();

    const resp = await cadastrarProduto(request, admin.token, gerarProduto({ nome: existente.nome }));

    expect(resp.status()).toBe(400);
    expect((await resp.json()).message).toBe('Já existe produto com esse nome');
  });

  test('atualiza produto e o estado final reflete a alteração', async ({
    request,
    admin,
    criarProduto,
  }) => {
    const original = await criarProduto();
    const novo = gerarProduto();

    const resp = await atualizarProduto(request, admin.token, original.id, novo);
    expect(resp.status()).toBe(200);
    expect((await resp.json()).message).toBe('Registro alterado com sucesso');

    const consulta = await buscarProduto(request, original.id);
    expect(await consulta.json()).toMatchObject({ ...novo, _id: original.id });
  });
});
