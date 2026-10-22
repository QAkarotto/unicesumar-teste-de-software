import { MENSAGENS } from '../data/mensagens';
import { expect, test } from '../fixtures/api.fixture';

test.describe('API ServeRest - Carrinhos', () => {
  test('deve criar carrinho calculando os totais e baixando o estoque', async ({
    api,
    admin,
    criarProduto,
    criarCarrinho,
  }) => {
    const teclado = await criarProduto(admin.token, { preco: 150, quantidade: 10 });
    const mouse = await criarProduto(admin.token, { preco: 80, quantidade: 5 });

    const idCarrinho = await criarCarrinho(admin.token, [
      { idProduto: teclado._id, quantidade: 2 },
      { idProduto: mouse._id, quantidade: 3 },
    ]);

    const consulta = await api.carrinhos.buscar(idCarrinho);
    expect(consulta.status()).toBe(200);

    // Regra de negócio: totais calculados a partir do preço unitário de cada produto
    expect(await consulta.json()).toEqual({
      produtos: [
        { idProduto: teclado._id, quantidade: 2, precoUnitario: 150 },
        { idProduto: mouse._id, quantidade: 3, precoUnitario: 80 },
      ],
      precoTotal: 2 * 150 + 3 * 80,
      quantidadeTotal: 5,
      idUsuario: admin._id,
      _id: idCarrinho,
    });

    // Regra de negócio: o estoque é reservado ao criar o carrinho
    expect((await (await api.produtos.buscar(teclado._id)).json()).quantidade).toBe(8);
    expect((await (await api.produtos.buscar(mouse._id)).json()).quantidade).toBe(2);
  });

  test('deve cancelar a compra, remover o carrinho e reabastecer o estoque', async ({
    api,
    admin,
    criarProduto,
    criarCarrinho,
  }) => {
    const produto = await criarProduto(admin.token, { quantidade: 10 });
    const idCarrinho = await criarCarrinho(admin.token, [
      { idProduto: produto._id, quantidade: 4 },
    ]);

    const response = await api.carrinhos.cancelarCompra(admin.token);

    expect(response.status()).toBe(200);
    expect((await response.json()).message).toBe(MENSAGENS.compraCancelada);

    // Estado final: carrinho removido e estoque restaurado ao valor original
    const carrinho = await api.carrinhos.buscar(idCarrinho);
    expect(carrinho.status()).toBe(400);
    expect((await carrinho.json()).message).toBe(MENSAGENS.carrinhoNaoEncontrado);

    const estoque = await api.produtos.buscar(produto._id);
    expect((await estoque.json()).quantidade).toBe(10);
  });

  test('não deve permitir que o usuário tenha mais de um carrinho', async ({
    api,
    admin,
    criarProduto,
    criarCarrinho,
  }) => {
    const produto = await criarProduto(admin.token);
    await criarCarrinho(admin.token, [{ idProduto: produto._id, quantidade: 1 }]);

    const response = await api.carrinhos.cadastrar(
      [{ idProduto: produto._id, quantidade: 1 }],
      admin.token,
    );

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.message).toBe(MENSAGENS.maisDeUmCarrinho);
    expect(body._id).toBeUndefined();
  });

  test('não deve criar carrinho com quantidade maior que o estoque', async ({
    api,
    admin,
    criarProduto,
  }) => {
    const produto = await criarProduto(admin.token, { quantidade: 3 });

    const response = await api.carrinhos.cadastrar(
      [{ idProduto: produto._id, quantidade: 5 }],
      admin.token,
    );

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.message).toBe(MENSAGENS.estoqueInsuficiente);
    expect(body.item).toEqual(
      expect.objectContaining({ idProduto: produto._id, quantidade: 5, quantidadeEstoque: 3 }),
    );

    // O estoque não deve ser alterado por uma tentativa rejeitada
    expect((await (await api.produtos.buscar(produto._id)).json()).quantidade).toBe(3);
  });

  test('não deve permitir excluir produto que faz parte de um carrinho', async ({
    api,
    admin,
    criarProduto,
    criarCarrinho,
  }) => {
    const produto = await criarProduto(admin.token);
    const idCarrinho = await criarCarrinho(admin.token, [
      { idProduto: produto._id, quantidade: 1 },
    ]);

    const response = await api.produtos.excluir(produto._id, admin.token);

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.message).toBe(MENSAGENS.produtoEmCarrinho);
    expect(body.idCarrinhos).toContain(idCarrinho);

    // O produto continua cadastrado
    expect((await api.produtos.buscar(produto._id)).status()).toBe(200);
  });
});
