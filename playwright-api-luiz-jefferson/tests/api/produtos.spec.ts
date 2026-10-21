import { test, expect } from '../fixtures/api.fixture';
import { createProduct, deleteProduct } from '../helpers/api';
import { makeProduct } from '../data/factories';

test('produto exige autenticação', async ({ request }) => {
  const response = await request.post('/produtos', { data: makeProduct() });
  expect(response.status()).toBe(401);
  expect((await response.json()).message).toBeTruthy();
});

test('admin cria e consulta produto com dados persistidos', async ({ request, admin }) => {
  const product = await createProduct(request, admin.token);
  try {
    const response = await request.get(`/produtos/${product.id}`);
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ ...product.data, _id: product.id });
  } finally { await deleteProduct(request, admin.token, product.id); }
});

test('produto com preço inválido é rejeitado', async ({ request, admin }) => {
  const response = await request.post('/produtos', { data: { ...makeProduct(), preco: -1 }, headers: { Authorization: admin.token } });
  expect(response.status()).toBe(400);
  expect((await response.json()).preco).toBeTruthy();
});

test('múltiplas requisições: criar, atualizar e consultar produto', async ({ request, admin }) => {
  const product = await createProduct(request, admin.token);
  try {
    const alterado = { ...product.data, preco: product.data.preco + 20 };
    const update = await request.put(`/produtos/${product.id}`, { data: alterado, headers: { Authorization: admin.token } });
    expect(update.status()).toBe(200);
    expect((await update.json()).message).toBe('Registro alterado com sucesso');
    const consulta = await request.get(`/produtos/${product.id}`);
    expect(consulta.status()).toBe(200);
    expect(await consulta.json()).toMatchObject({ ...alterado, _id: product.id });
  } finally { await deleteProduct(request, admin.token, product.id); }
});
