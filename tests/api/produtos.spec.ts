import { test, expect } from '../fixtures/api.fixture';
import { criarProdutoDto } from '../data/factories';
import { excluirProduto } from '../helpers/api';

test.describe('Produtos', () => {
  test('admin cadastra produto e os dados ficam persistidos', async ({ request, admin }) => {
    const produto = criarProdutoDto();

    const resposta = await request.post('/produtos', {
      data: produto,
      headers: { Authorization: admin.token },
    });
    expect(resposta.status()).toBe(201);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Cadastro realizado com sucesso');
    expect(corpo._id).toBeTruthy();

    try {
      const consulta = await request.get(`/produtos/${corpo._id}`);
      expect(consulta.status()).toBe(200);
      expect(await consulta.json()).toMatchObject({ ...produto, _id: corpo._id });
    } finally {
      await excluirProduto(request, admin.token, corpo._id);
    }
  });

  test('não cadastra produto sem token de autenticação', async ({ request }) => {
    const resposta = await request.post('/produtos', { data: criarProdutoDto() });

    expect(resposta.status()).toBe(401);
    expect((await resposta.json()).message).toBe(
      'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
    );
  });

  test('regra de negócio: apenas administradores cadastram produtos', async ({ request, cliente }) => {
    const resposta = await request.post('/produtos', {
      data: criarProdutoDto(),
      headers: { Authorization: cliente.token },
    });

    expect(resposta.status()).toBe(403);
    expect((await resposta.json()).message).toBe('Rota exclusiva para administradores');
  });

  test('regra de negócio: não permite produto com nome repetido', async ({ request, admin, produto }) => {
    const resposta = await request.post('/produtos', {
      data: { ...criarProdutoDto(), nome: produto.produto.nome },
      headers: { Authorization: admin.token },
    });

    expect(resposta.status()).toBe(400);
    expect((await resposta.json()).message).toBe('Já existe produto com esse nome');
  });

  test('edita produto e consulta o estado final', async ({ request, admin, produto }) => {
    const alteracoes = { ...produto.produto, preco: produto.produto.preco + 50, quantidade: 3 };

    const edicao = await request.put(`/produtos/${produto.id}`, {
      data: alteracoes,
      headers: { Authorization: admin.token },
    });
    expect(edicao.status()).toBe(200);
    expect((await edicao.json()).message).toBe('Registro alterado com sucesso');

    const consulta = await request.get(`/produtos/${produto.id}`);
    expect(consulta.status()).toBe(200);
    expect(await consulta.json()).toMatchObject({ ...alteracoes, _id: produto.id });
  });
});
