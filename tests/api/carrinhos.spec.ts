import { test, expect } from '../fixtures/api.fixture';
import {
  buscarCarrinho,
  buscarProduto,
  cadastrarCarrinho,
  cancelarCompra,
} from '../helpers/api';

test.describe('API ServeRest - Carrinhos', () => {
  test('exige autenticação para criar carrinho', async ({ request, criarProduto }) => {
    const produto = await criarProduto();

    const resp = await request.post('/carrinhos', {
      data: { produtos: [{ idProduto: produto.id, quantidade: 1 }] },
    });

    expect(resp.status()).toBe(401);
    expect((await resp.json()).message).toContain('Token de acesso ausente');
  });

  test('cria carrinho e valida totais, itens e dono (múltiplas requisições)', async ({
    request,
    comum,
    criarProduto,
    criarCarrinho,
  }) => {
    const produto = await criarProduto({ quantidade: 10 });

    const idCarrinho = await criarCarrinho([{ idProduto: produto.id, quantidade: 2 }]);

    const consulta = await buscarCarrinho(request, idCarrinho);
    expect(consulta.status()).toBe(200);
    const carrinho = await consulta.json();
    expect(carrinho.idUsuario).toBe(comum.id);
    expect(carrinho.quantidadeTotal).toBe(2);
    expect(carrinho.precoTotal).toBe(produto.preco * 2);
    expect(carrinho.produtos).toHaveLength(1);
    expect(carrinho.produtos[0]).toMatchObject({
      idProduto: produto.id,
      quantidade: 2,
      precoUnitario: produto.preco,
    });
  });

  test('regra de negócio: criar carrinho baixa o estoque do produto', async ({
    request,
    criarProduto,
    criarCarrinho,
  }) => {
    const produto = await criarProduto({ quantidade: 10 });

    await criarCarrinho([{ idProduto: produto.id, quantidade: 3 }]);

    const consulta = await buscarProduto(request, produto.id);
    expect((await consulta.json()).quantidade).toBe(7);
  });

  test('regra de negócio: não permite quantidade acima do estoque', async ({
    request,
    comum,
    criarProduto,
  }) => {
    const produto = await criarProduto({ quantidade: 2 });

    const resp = await cadastrarCarrinho(request, comum.token, [
      { idProduto: produto.id, quantidade: 5 },
    ]);

    expect(resp.status()).toBe(400);
    expect((await resp.json()).message).toBe('Produto não possui quantidade suficiente');
  });

  test('regra de negócio: usuário não pode ter mais de um carrinho', async ({
    request,
    comum,
    criarProduto,
    criarCarrinho,
  }) => {
    const produto = await criarProduto({ quantidade: 10 });
    await criarCarrinho([{ idProduto: produto.id, quantidade: 1 }]);

    const resp = await cadastrarCarrinho(request, comum.token, [
      { idProduto: produto.id, quantidade: 1 },
    ]);

    expect(resp.status()).toBe(400);
    expect((await resp.json()).message).toBe('Não é permitido ter mais de 1 carrinho');
  });

  test('cancelar compra remove o carrinho e reabastece o estoque', async ({
    request,
    comum,
    criarProduto,
    criarCarrinho,
  }) => {
    const produto = await criarProduto({ quantidade: 10 });
    const idCarrinho = await criarCarrinho([{ idProduto: produto.id, quantidade: 4 }]);

    const resp = await cancelarCompra(request, comum.token);
    expect(resp.status()).toBe(200);
    expect((await resp.json()).message).toBe(
      'Registro excluído com sucesso. Estoque dos produtos reabastecido',
    );

    const estoque = await buscarProduto(request, produto.id);
    expect((await estoque.json()).quantidade).toBe(10);

    const carrinho = await buscarCarrinho(request, idCarrinho);
    expect(carrinho.status()).toBe(400);
  });
});
