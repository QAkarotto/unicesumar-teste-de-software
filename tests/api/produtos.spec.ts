import { test, expect } from '../fixtures/api.fixture';
import { produtoFactory } from '../data/factories';

test('lista produtos com quantidade e campos coerentes', async ({ api, request, administrador }) => {
  const produto = await api.criarProduto(administrador.headers);
  const response = await request.get('/produtos', { params: { _id: produto._id } });

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ quantidade: 1, produtos: [produto] });
});

test('bloqueia cadastro de produto sem token', async ({ api, administrador }) => {
  const response = await api.cadastrarProduto(produtoFactory(), undefined, administrador.headers);

  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({
    message: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
  });
});

test('bloqueia cadastro de produto para usuário não administrador', async ({ api, cliente, administrador }) => {
  const response = await api.cadastrarProduto(produtoFactory(), cliente.headers, administrador.headers);

  expect(response.status()).toBe(403);
  expect(await response.json()).toEqual({ message: 'Rota exclusiva para administradores' });
});

test('administrador cadastra produto e consulta os dados persistidos', async ({ api, request, administrador }) => {
  const produto = await api.criarProduto(administrador.headers);
  const response = await request.get(`/produtos/${produto._id}`);

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(produto);
});

test('rejeita produto com preço negativo sem persistir cadastro', async ({ api, request, administrador }) => {
  const produto = produtoFactory({ preco: -1 });
  const response = await api.cadastrarProduto(produto, administrador.headers);

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ preco: 'preco deve ser um número positivo' });
  const consulta = await request.get('/produtos', { params: { nome: produto.nome } });
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({ quantidade: 0, produtos: [] });
});

test('edita produto e valida o estado final', async ({ api, request, administrador }) => {
  const produto = await api.criarProduto(administrador.headers);
  const alteracoes = produtoFactory({ quantidade: produto.quantidade + 1 });
  const response = await request.put(`/produtos/${produto._id}`, {
    data: alteracoes, headers: administrador.headers,
  });

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ message: 'Registro alterado com sucesso' });
  const consulta = await request.get(`/produtos/${produto._id}`);
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({ ...alteracoes, _id: produto._id });
});

test('exclui produto e confirma que não pode mais ser consultado', async ({ api, request, administrador }) => {
  const produto = await api.criarProduto(administrador.headers);
  const response = await request.delete(`/produtos/${produto._id}`, { headers: administrador.headers });

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ message: 'Registro excluído com sucesso' });
  const consulta = await request.get(`/produtos/${produto._id}`);
  expect(consulta.status()).toBe(400);
  expect(await consulta.json()).toEqual({ message: 'Produto não encontrado' });
});
