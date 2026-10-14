import { test, expect, APIRequestContext } from '@playwright/test';
import { cadastrarProduto, usuarioAutenticado } from './support/api';

async function estoqueDoProduto(request: APIRequestContext, id: string): Promise<number> {
  const response = await request.get(`/produtos/${id}`);
  expect(response.status()).toBe(200);
  return (await response.json()).quantidade;
}

test.describe('Carrinhos - /carrinhos', () => {
  test('CT12 - criar carrinho deve reservar o estoque e cancelar a compra deve devolvê-lo (regra de negócio)', async ({ request }) => {
    const { token } = await usuarioAutenticado(request, 'true');
    const produto = await cadastrarProduto(request, token, { preco: 100, quantidade: 10 });
    const headers = { Authorization: token };

    // Cria o carrinho com 3 unidades
    const criacao = await request.post('/carrinhos', {
      data: { produtos: [{ idProduto: produto._id, quantidade: 3 }] },
      headers,
    });
    expect(criacao.status()).toBe(201);
    const { _id: idCarrinho, message } = await criacao.json();
    expect(message).toBe('Cadastro realizado com sucesso');

    // O carrinho calcula total de itens e preço total
    const carrinho = await request.get(`/carrinhos/${idCarrinho}`);
    expect(carrinho.status()).toBe(200);
    expect(await carrinho.json()).toMatchObject({
      quantidadeTotal: 3,
      precoTotal: 300,
      produtos: [{ idProduto: produto._id, quantidade: 3, precoUnitario: 100 }],
    });

    // Estoque reduzido de 10 para 7
    expect(await estoqueDoProduto(request, produto._id)).toBe(7);

    // Cancelar a compra exclui o carrinho e devolve o estoque
    const cancelamento = await request.delete('/carrinhos/cancelar-compra', { headers });
    expect(cancelamento.status()).toBe(200);
    expect((await cancelamento.json()).message).toBe(
      'Registro excluído com sucesso. Estoque dos produtos reabastecido',
    );
    expect(await estoqueDoProduto(request, produto._id)).toBe(10);
  });

  test('CT13 - não deve criar carrinho com quantidade maior que o estoque', async ({ request }) => {
    const { token } = await usuarioAutenticado(request, 'true');
    const produto = await cadastrarProduto(request, token, { quantidade: 2 });

    const response = await request.post('/carrinhos', {
      data: { produtos: [{ idProduto: produto._id, quantidade: 5 }] },
      headers: { Authorization: token },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).message).toBe('Produto não possui quantidade suficiente');
    // O estoque não pode ser alterado por uma tentativa rejeitada
    expect(await estoqueDoProduto(request, produto._id)).toBe(2);
  });
});
