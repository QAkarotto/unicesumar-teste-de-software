import { test, expect } from '../fixtures/api.fixture';
import { criarProduto } from '../data/factories';

test('lista produtos e valida o formato da resposta', async ({ request }) => {
  const response = await request.get('/produtos');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body.produtos)).toBe(true);
  expect(body.quantidade).toBe(body.produtos.length);
});

test('rejeita cadastro de produto sem autenticação', async ({ request }) => {
  const response = await request.post('/produtos', { data: criarProduto() });
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({
    message: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
  });
});

test('cadastra produto autenticado e consulta os dados persistidos', async ({ request, produto }) => {
  const response = await request.get(`/produtos/${produto._id}`);
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(produto);
});

test('atualiza produto autenticado e valida o estado final', async ({ request, token, produto }) => {
  const novosDados = criarProduto();
  const response = await request.put(`/produtos/${produto._id}`, {
    headers: { Authorization: token }, data: novosDados,
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ message: 'Registro alterado com sucesso' });
  const consulta = await request.get(`/produtos/${produto._id}`);
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({ ...novosDados, _id: produto._id });
});
