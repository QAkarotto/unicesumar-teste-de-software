
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Deve listar produtos cadastrados', async ({ request }) => {

  const resposta = await request.get('/produtos');

  // Validar status HTTP
  expect(resposta.status()).toBe(200);

  const dados = await resposta.json();

  // Verificar se retornou uma lista
  expect(Array.isArray(dados.produtos)).toBe(true);

  // Validar quantidade de produtos
  expect(dados.quantidade).toBe(dados.produtos.length);

  // Verificar a estrutura de cada produto
  for (const produto of dados.produtos) {

    expect(produto._id).toEqual(expect.any(String));

    expect(produto.nome).toEqual(expect.any(String));

    expect(produto.preco).toEqual(expect.any(Number));

    expect(produto.quantidade).toEqual(expect.any(Number));

    // Regra: preco e estoque nao podem ser negativos
    expect(produto.preco).toBeGreaterThanOrEqual(0);

    expect(produto.quantidade).toBeGreaterThanOrEqual(0);
  }

});
