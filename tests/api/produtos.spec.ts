import { test, expect } from '@playwright/test';
import { criarDadosProduto } from '../data/factories';
import { autenticarAdministrador } from '../helpers/api';

test('cria produto autenticado e consulta os dados persistidos', async ({ request }) => {
  const { token } = await autenticarAdministrador(request);
  const produto = criarDadosProduto();

  const cadastro = await request.post('/produtos', {
    data: produto,
    headers: {
      Authorization: token,
    },
  });

  const cadastroBody = await cadastro.json();

  expect(cadastro.status()).toBe(201);
  expect(cadastroBody.message).toContain('Cadastro realizado com sucesso');
  expect(cadastroBody._id).toBeTruthy();

  const consulta = await request.get(`/produtos/${cadastroBody._id}`);

  expect(consulta.status()).toBe(200);

  const produtoSalvo = await consulta.json();

  expect(produtoSalvo.nome).toBe(produto.nome);
  expect(produtoSalvo.preco).toBe(produto.preco);
  expect(produtoSalvo.descricao).toBe(produto.descricao);
  expect(produtoSalvo.quantidade).toBe(produto.quantidade);
});

test('lista produtos e valida os dados retornados', async ({ request }) => {
  const response = await request.get('/produtos');
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.quantidade).toBeGreaterThan(0);
  expect(Array.isArray(body.produtos)).toBe(true);
  expect(body.produtos[0]).toHaveProperty('_id');
  expect(body.produtos[0]).toHaveProperty('nome');
  expect(body.produtos[0].preco).toEqual(expect.any(Number));
});

test('rejeita criação de produto sem autenticação', async ({ request }) => {
  const produto = criarDadosProduto();

  const response = await request.post('/produtos', {
    data: produto,
  });
  const body = await response.json();

  expect(response.status()).toBe(401);
  expect(body.message).toBeTruthy();
});
