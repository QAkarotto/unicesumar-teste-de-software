import { test, expect } from '../fixtures/api.fixture';

test('cria carrinho, calcula totais e restaura estoque ao cancelar a compra', async ({ api, request, administrador }) => {
  const produto = await api.criarProduto(administrador.headers);
  const response = await api.cadastrarCarrinho(administrador.headers, [{ idProduto: produto._id, quantidade: 2 }]);

  expect(response.status()).toBe(201);
  const cadastro = await response.json();
  expect(cadastro).toEqual({ message: 'Cadastro realizado com sucesso', _id: expect.any(String) });
  expect(cadastro._id).not.toBe('');
  const consulta = await request.get(`/carrinhos/${cadastro._id}`);
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({
    _id: cadastro._id,
    idUsuario: administrador.usuario._id,
    produtos: [{ idProduto: produto._id, quantidade: 2, precoUnitario: produto.preco }],
    quantidadeTotal: 2,
    precoTotal: produto.preco * 2,
  });
  const estoque = await request.get(`/produtos/${produto._id}`);
  expect(estoque.status()).toBe(200);
  expect(await estoque.json()).toEqual({ ...produto, quantidade: produto.quantidade - 2 });

  const cancelamento = await request.delete('/carrinhos/cancelar-compra', { headers: administrador.headers });
  expect(cancelamento.status()).toBe(200);
  expect(await cancelamento.json()).toEqual({ message: 'Registro excluído com sucesso. Estoque dos produtos reabastecido' });
  const carrinhoFinal = await request.get(`/carrinhos/${cadastro._id}`);
  expect(carrinhoFinal.status()).toBe(400);
  expect(await carrinhoFinal.json()).toEqual({ message: 'Carrinho não encontrado' });
  const estoqueFinal = await request.get(`/produtos/${produto._id}`);
  expect(estoqueFinal.status()).toBe(200);
  expect(await estoqueFinal.json()).toEqual(produto);
});

test('bloqueia compra acima do estoque e mantém os recursos inalterados', async ({ api, request, administrador }) => {
  const produto = await api.criarProduto(administrador.headers);
  const response = await api.cadastrarCarrinho(administrador.headers, [{
    idProduto: produto._id, quantidade: produto.quantidade + 1,
  }]);

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({
    message: 'Produto não possui quantidade suficiente',
    item: { idProduto: produto._id, index: 0, quantidade: produto.quantidade + 1, quantidadeEstoque: produto.quantidade },
  });
  const estoque = await request.get(`/produtos/${produto._id}`);
  expect(estoque.status()).toBe(200);
  expect(await estoque.json()).toEqual(produto);
  const carrinhos = await request.get('/carrinhos', { params: { idUsuario: administrador.usuario._id } });
  expect(carrinhos.status()).toBe(200);
  expect(await carrinhos.json()).toEqual({ quantidade: 0, carrinhos: [] });
});
