import { test, expect } from '../fixtures/api.fixture';

test.describe('Carrinhos', () => {
  test('fluxo completo: cria carrinho, baixa estoque e cancela compra devolvendo estoque', async ({
    request,
    produto,
    cliente,
  }) => {
    const auth = { Authorization: cliente.token };
    const quantidadeComprada = 2;
    const estoqueInicial = produto.produto.quantidade;

    const criacao = await request.post('/carrinhos', {
      data: { produtos: [{ idProduto: produto.id, quantidade: quantidadeComprada }] },
      headers: auth,
    });
    expect(criacao.status()).toBe(201);
    const { message, _id: idCarrinho } = await criacao.json();
    expect(message).toBe('Cadastro realizado com sucesso');

    const carrinho = await (await request.get(`/carrinhos/${idCarrinho}`)).json();
    expect(carrinho).toMatchObject({
      _id: idCarrinho,
      idUsuario: cliente.id,
      quantidadeTotal: quantidadeComprada,
      precoTotal: produto.produto.preco * quantidadeComprada,
      produtos: [{ idProduto: produto.id, quantidade: quantidadeComprada, precoUnitario: produto.produto.preco }],
    });

    const produtoReservado = await (await request.get(`/produtos/${produto.id}`)).json();
    expect(produtoReservado.quantidade).toBe(estoqueInicial - quantidadeComprada);

    const cancelamento = await request.delete('/carrinhos/cancelar-compra', { headers: auth });
    expect(cancelamento.status()).toBe(200);
    expect((await cancelamento.json()).message).toBe(
      'Registro excluído com sucesso. Estoque dos produtos reabastecido',
    );

    expect((await request.get(`/carrinhos/${idCarrinho}`)).status()).toBe(400);
    const produtoFinal = await (await request.get(`/produtos/${produto.id}`)).json();
    expect(produtoFinal.quantidade).toBe(estoqueInicial);
  });

  test('regra de negócio: não permite comprar mais que o estoque', async ({ request, produto, cliente }) => {
    const resposta = await request.post('/carrinhos', {
      data: { produtos: [{ idProduto: produto.id, quantidade: produto.produto.quantidade + 1 }] },
      headers: { Authorization: cliente.token },
    });

    expect(resposta.status()).toBe(400);
    expect((await resposta.json()).message).toBe('Produto não possui quantidade suficiente');

    const consulta = await (await request.get(`/produtos/${produto.id}`)).json();
    expect(consulta.quantidade).toBe(produto.produto.quantidade);
  });
});
