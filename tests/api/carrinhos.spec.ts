import { test, expect } from '../fixtures/api.fixture';
import { consultarEstoque, prepararProduto } from '../helpers/api';
import { itensDoCarrinho } from '../data/factories';

test.describe('Carrinhos - /carrinhos', () => {
  test('CT14 - criar carrinho reserva estoque e cancelar a compra devolve o estoque', async ({ api, admin }) => {
    const produto = await prepararProduto(api, admin.token, { preco: 100, quantidade: 10 });

    const criacao = await api.cadastrarCarrinho(itensDoCarrinho({ idProduto: produto._id, quantidade: 3 }), admin.token);
    expect(criacao.status()).toBe(201);
    const { _id: idCarrinho, message } = await criacao.json();
    expect(message).toBe('Cadastro realizado com sucesso');

    // O carrinho calcula os totais a partir do preço do produto
    const carrinho = await api.buscarCarrinho(idCarrinho);
    expect(await carrinho.json()).toMatchObject({
      quantidadeTotal: 3,
      precoTotal: 300,
      idUsuario: admin._id,
      produtos: [{ idProduto: produto._id, quantidade: 3, precoUnitario: 100 }],
    });
    expect(await consultarEstoque(api, produto._id)).toBe(7);

    const cancelamento = await api.cancelarCompra(admin.token);
    expect(cancelamento.status()).toBe(200);
    expect((await cancelamento.json()).message).toBe('Registro excluído com sucesso. Estoque dos produtos reabastecido');
    expect(await consultarEstoque(api, produto._id)).toBe(10);
  });

  test('CT15 - concluir a compra remove o carrinho e mantém o estoque baixado', async ({ api, admin }) => {
    const produto = await prepararProduto(api, admin.token, { quantidade: 10 });
    const criacao = await api.cadastrarCarrinho(itensDoCarrinho({ idProduto: produto._id, quantidade: 4 }), admin.token);
    const { _id: idCarrinho } = await criacao.json();

    const conclusao = await api.concluirCompra(admin.token);
    expect(conclusao.status()).toBe(200);
    expect((await conclusao.json()).message).toBe('Registro excluído com sucesso');

    // Estado final: carrinho não existe mais e o estoque não volta
    const carrinho = await api.buscarCarrinho(idCarrinho);
    expect(carrinho.status()).toBe(400);
    expect(await carrinho.json()).toEqual({ message: 'Carrinho não encontrado' });
    expect(await consultarEstoque(api, produto._id)).toBe(6);
  });

  test('CT16 - não deve criar carrinho com quantidade maior que o estoque', async ({ api, admin }) => {
    const produto = await prepararProduto(api, admin.token, { quantidade: 2 });

    const response = await api.cadastrarCarrinho(itensDoCarrinho({ idProduto: produto._id, quantidade: 5 }), admin.token);

    expect(response.status()).toBe(400);
    expect((await response.json()).message).toBe('Produto não possui quantidade suficiente');
    expect(await consultarEstoque(api, produto._id)).toBe(2);
  });

  test('CT17 - usuário não pode ter mais de um carrinho (regra de negócio)', async ({ api, admin }) => {
    const produto = await prepararProduto(api, admin.token, { quantidade: 10 });
    const item = itensDoCarrinho({ idProduto: produto._id, quantidade: 1 });
    expect((await api.cadastrarCarrinho(item, admin.token)).status()).toBe(201);

    const segundo = await api.cadastrarCarrinho(item, admin.token);

    expect(segundo.status()).toBe(400);
    expect((await segundo.json()).message).toBe('Não é permitido ter mais de 1 carrinho');
    expect(await consultarEstoque(api, produto._id)).toBe(9); // só o primeiro carrinho reservou
  });

  test('CT18 - não deve excluir produto que faz parte de um carrinho', async ({ api, admin }) => {
    const produto = await prepararProduto(api, admin.token);
    const criacao = await api.cadastrarCarrinho(itensDoCarrinho({ idProduto: produto._id, quantidade: 1 }), admin.token);
    const { _id: idCarrinho } = await criacao.json();

    const exclusao = await api.excluirProduto(produto._id, admin.token);

    expect(exclusao.status()).toBe(400);
    expect(await exclusao.json()).toEqual({
      message: 'Não é permitido excluir produto que faz parte de carrinho',
      idCarrinhos: [idCarrinho],
    });
    expect((await api.buscarProduto(produto._id)).status()).toBe(200);
  });
});
