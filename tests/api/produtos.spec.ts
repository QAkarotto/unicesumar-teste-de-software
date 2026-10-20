import { test, expect } from '../../fixtures/api.fixture';
import { createProductFactory } from '../../data/factories';

test.describe('Gerenciamento de Produtos', () => {

  test('deve cadastrar um produto utilizando token de autenticação', async ({ request, authToken }) => {
    const productData = createProductFactory();

    const response = await request.post('/produtos', {
      headers: { authorization: authToken },
      data: productData,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe('Cadastro realizado com sucesso');
  });

  test('não deve cadastrar produto sem enviar token de autenticação', async ({ request }) => {
    const productData = createProductFactory();

    const response = await request.post('/produtos', {
      data: productData,
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Token de acesso ausente, expirado, inválido ou usuário do token não existe mais');
  });

  test('deve criar um produto, consultá-lo pelo ID e validar os dados persistidos', async ({ request, authToken }) => {
    const productData = createProductFactory();

    const createRes = await request.post('/produtos', {
      headers: { authorization: authToken },
      data: productData,
    });
    const createBody = await createRes.json();
    const productId = createBody._id;

    const getRes = await request.get(`/produtos/${productId}`);
    expect(getRes.status()).toBe(200);
    
    const getBody = await getRes.json();
    expect(getBody.nome).toBe(productData.nome);
    expect(getBody.preco).toBe(productData.preco);

    await request.delete(`/produtos/${productId}`, {
      headers: { authorization: authToken },
    });
  });
});