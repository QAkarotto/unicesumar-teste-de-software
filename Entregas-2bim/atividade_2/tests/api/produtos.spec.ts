import { test, expect } from '../fixtures/api.fixture';
import { prepararProduto } from '../helpers/api';
import { novoProduto } from '../data/factories';

test.describe('Produtos - /produtos', () => {
  test('CT10 - administrador deve cadastrar produto e os dados devem ser persistidos', async ({ api, admin }) => {
    const produto = novoProduto();

    const cadastro = await api.cadastrarProduto(produto, admin.token);
    expect(cadastro.status()).toBe(201);
    const { message, _id } = await cadastro.json();
    expect(message).toBe('Cadastro realizado com sucesso');

    const consulta = await api.buscarProduto(_id);
    expect(consulta.status()).toBe(200);
    expect(await consulta.json()).toEqual({ ...produto, _id });
  });

  test('CT11 - não deve cadastrar produto sem token de acesso', async ({ api }) => {
    const produto = novoProduto();

    const response = await api.cadastrarProduto(produto);

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({
      message: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
    });
    // Estado final: nada foi criado
    expect((await (await api.listarProdutos({ nome: produto.nome })).json()).quantidade).toBe(0);
  });

  test('CT12 - usuário comum não pode cadastrar produto (regra de negócio)', async ({ api, usuarioComum }) => {
    const produto = novoProduto();

    const response = await api.cadastrarProduto(produto, usuarioComum.token);

    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({ message: 'Rota exclusiva para administradores' });
    expect((await (await api.listarProdutos({ nome: produto.nome })).json()).quantidade).toBe(0);
  });

  test('CT13 - não deve permitir dois produtos com o mesmo nome (regra de negócio)', async ({ api, admin }) => {
    const existente = await prepararProduto(api, admin.token);

    const response = await api.cadastrarProduto(novoProduto({ nome: existente.nome }), admin.token);

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ message: 'Já existe produto com esse nome' });
    expect((await (await api.listarProdutos({ nome: existente.nome })).json()).quantidade).toBe(1);
  });
});
