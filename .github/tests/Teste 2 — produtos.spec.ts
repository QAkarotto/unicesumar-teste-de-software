
import { test, expect } from '@playwright/test';

test.describe('API de produtos', () => {
  test('deve listar produtos com dados válidos', async ({ request }) => {
    const response = await request.get('/produtos');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('quantidade');
    expect(body).toHaveProperty('produtos');
    expect(Array.isArray(body.produtos)).toBe(true);
    expect(body.quantidade).toBe(body.produtos.length);

    if (body.produtos.length > 0) {
      const produto = body.produtos[0];

      expect(produto).toHaveProperty('_id');
      expect(produto).toHaveProperty('nome');
      expect(typeof produto.nome).toBe('string');
      expect(typeof produto.preco).toBe('number');
      expect(typeof produto.quantidade).toBe('number');
    }
  });

  test('deve consultar um produto existente', async ({ request }) => {
    const lista = await request.get('/produtos');
    expect(lista.status()).toBe(200);

    const body = await lista.json();
    expect(body.produtos.length).toBeGreaterThan(0);

    const produtoEsperado = body.produtos[0];

    const response = await request.get(
      `/produtos/${produtoEsperado._id}`
    );

    expect(response.status()).toBe(200);

    const produto = await response.json();

    expect(produto._id).toBe(produtoEsperado._id);
    expect(produto.nome).toBe(produtoEsperado.nome);
    expect(produto.preco).toBe(produtoEsperado.preco);
    expect(produto.quantidade).toBe(produtoEsperado.quantidade);
  });

  test('deve rejeitar consulta com ID inexistente', async ({ request }) => {
    const response = await request.get(
      '/produtos/id-inexistente-123'
    );

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.message).toBe('Produto não encontrado');
  });
});
