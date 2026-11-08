import { test, expect } from '../fixtures/api.fixture';

test('cria carrinho, consulta e cancela restaurando o estoque', async ({ request, token, usuario, produto, limpezas }) => {
  const headers = { Authorization: token };
  const response = await request.post('/carrinhos', {
    headers, data: { produtos: [{ idProduto: produto._id, quantidade: 2 }] },
  });
  const body = await response.json();
  let cancelado = false;
  if (response.status() === 201 && body._id) {
    limpezas.push(async () => {
      if (!cancelado) {
        const exclusao = await request.delete('/carrinhos/cancelar-compra', { headers });
        expect(exclusao.status()).toBe(200);
        expect((await exclusao.json()).message).toBe('Registro excluído com sucesso. Estoque dos produtos reabastecido');
      }
    });
  }
  expect(response.status()).toBe(201);
  expect(body.message).toBe('Cadastro realizado com sucesso');
  expect(body._id).toEqual(expect.any(String));
  const consulta = await request.get(`/carrinhos/${body._id}`);
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({
    _id: body._id, idUsuario: usuario._id,
    produtos: [{ idProduto: produto._id, quantidade: 2, precoUnitario: produto.preco }],
    precoTotal: produto.preco * 2, quantidadeTotal: 2,
  });
  const estoque = await request.get(`/produtos/${produto._id}`);
  expect(estoque.status()).toBe(200);
  expect((await estoque.json()).quantidade).toBe(produto.quantidade - 2);
  const exclusao = await request.delete('/carrinhos/cancelar-compra', { headers });
  expect(exclusao.status()).toBe(200);
  cancelado = true;
  expect(await exclusao.json()).toEqual({ message: 'Registro excluído com sucesso. Estoque dos produtos reabastecido' });
  const consultaFinal = await request.get(`/carrinhos/${body._id}`);
  expect(consultaFinal.status()).toBe(400);
  expect(await consultaFinal.json()).toEqual({ message: 'Carrinho não encontrado' });
  const estoqueFinal = await request.get(`/produtos/${produto._id}`);
  expect(estoqueFinal.status()).toBe(200);
  expect(await estoqueFinal.json()).toEqual(produto);
});
