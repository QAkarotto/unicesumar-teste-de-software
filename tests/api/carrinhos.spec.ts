import { test, expect } from '../fixtures/api.fixture';
import { estoqueDoProduto } from '../helpers/api';
import { autorizacao } from '../helpers/auth';

test('reservar no carrinho baixa o estoque e cancelar a compra o devolve', async ({ request, cliente, criarProduto }) => {
  const produto = await criarProduto({ quantidade: 10 });

  const cadastro = await request.post('/carrinhos', {
    data: { produtos: [{ idProduto: produto._id, quantidade: 3 }] },
    headers: autorizacao(cliente.token),
  });
  expect(cadastro.status()).toBe(201);
  expect(await cadastro.json()).toEqual({ message: 'Cadastro realizado com sucesso', _id: expect.any(String) });
  expect(await estoqueDoProduto(request, produto._id)).toBe(7);

  const cancelamento = await request.delete('/carrinhos/cancelar-compra', { headers: autorizacao(cliente.token) });
  expect(cancelamento.status()).toBe(200);
  expect(await cancelamento.json()).toEqual({ message: 'Registro excluído com sucesso. Estoque dos produtos reabastecido' });
  expect(await estoqueDoProduto(request, produto._id)).toBe(10);
});

test('calcula os totais do carrinho a partir do preço e da quantidade de cada produto', async ({ request, cliente, criarProduto }) => {
  const primeiro = await criarProduto();
  const segundo = await criarProduto();

  const cadastro = await request.post('/carrinhos', {
    data: { produtos: [{ idProduto: primeiro._id, quantidade: 2 }, { idProduto: segundo._id, quantidade: 3 }] },
    headers: autorizacao(cliente.token),
  });
  expect(cadastro.status()).toBe(201);
  const { _id } = await cadastro.json();

  const consulta = await request.get(`/carrinhos/${_id}`);
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({
    produtos: [
      { idProduto: primeiro._id, quantidade: 2, precoUnitario: primeiro.preco },
      { idProduto: segundo._id, quantidade: 3, precoUnitario: segundo.preco },
    ],
    precoTotal: primeiro.preco * 2 + segundo.preco * 3,
    quantidadeTotal: 5,
    idUsuario: cliente._id,
    _id,
  });
});

test('concluir a compra encerra o carrinho e mantém o estoque baixado', async ({ request, cliente, criarProduto }) => {
  const produto = await criarProduto({ quantidade: 10 });
  const cadastro = await request.post('/carrinhos', {
    data: { produtos: [{ idProduto: produto._id, quantidade: 4 }] },
    headers: autorizacao(cliente.token),
  });
  expect(cadastro.status()).toBe(201);

  const conclusao = await request.delete('/carrinhos/concluir-compra', { headers: autorizacao(cliente.token) });
  expect(conclusao.status()).toBe(200);
  expect(await conclusao.json()).toEqual({ message: 'Registro excluído com sucesso' });

  const carrinhos = await request.get('/carrinhos', { params: { idUsuario: cliente._id } });
  expect(await carrinhos.json()).toEqual({ quantidade: 0, carrinhos: [] });
  expect(await estoqueDoProduto(request, produto._id)).toBe(6);
});

test('não aceita quantidade acima do estoque disponível', async ({ request, cliente, criarProduto }) => {
  const produto = await criarProduto({ quantidade: 5 });

  const resposta = await request.post('/carrinhos', {
    data: { produtos: [{ idProduto: produto._id, quantidade: 6 }] },
    headers: autorizacao(cliente.token),
  });
  expect(resposta.status()).toBe(400);
  expect(await resposta.json()).toEqual({
    message: 'Produto não possui quantidade suficiente',
    item: { idProduto: produto._id, quantidade: 6, quantidadeEstoque: 5, index: 0 },
  });

  const carrinhos = await request.get('/carrinhos', { params: { idUsuario: cliente._id } });
  expect(await carrinhos.json()).toEqual({ quantidade: 0, carrinhos: [] });
  expect(await estoqueDoProduto(request, produto._id)).toBe(5);
});
