import { test, expect } from '@playwright/test';
import { getAuthToken } from '../helpers/auth';
import { createProductPayload } from '../data/factories';

test.describe('Testes de Produtos e Regras - ServeRest', () => {

  test('5. Operação que exija autenticação sem token (deve falhar)', async ({ request }) => {
    const product = createProductPayload();
    const response = await request.post('/produtos', { data: product });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Token de acesso ausente, expirado, inválido ou usuário do token não existe mais');
  });

  test('6. Validação de regra de negócio (cadastrar produto com nome duplicado)', async ({ request }) => {
    const { token } = await getAuthToken(request);
    const product = createProductPayload();

    // Primeiro cadastro do produto
    await request.post('/produtos', {
      headers: { Authorization: token },
      data: product,
    });

    // Tentativa de cadastrar produto com mesmo nome
    const response = await request.post('/produtos', {
      headers: { Authorization: token },
      data: product,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Já existe produto com esse nome');
  });

  test('7. Cenário com múltiplas requisições relacionadas (Criar e Consultar)', async ({ request }) => {
    const { token } = await getAuthToken(request);
    const productData = createProductPayload();

    // 1. Criar produto
    const createRes = await request.post('/produtos', {
      headers: { Authorization: token },
      data: productData,
    });

    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    const productId = createBody._id;

    // 2. Consultar o produto criado
    const getRes = await request.get(`/produtos/${productId}`);
    expect(getRes.status()).toBe(200);
    
    const getBody = await getRes.json();
    expect(getBody.nome).toBe(productData.nome);
    expect(getBody.preco).toBe(productData.preco);
    expect(getBody.descricao).toBe(productData.descricao);
  });

  test('8. Consulta e validação do estado final de um recurso (Ciclo completo com exclusão)', async ({ request }) => {
    const { token } = await getAuthToken(request);
    const productData = createProductPayload();

    // 1. Criar produto
    const createRes = await request.post('/produtos', {
      headers: { Authorization: token },
      data: productData,
    });
    const productId = (await createRes.json())._id;

    // 2. Remover recurso criado (Limpeza/Teardown)
    const deleteRes = await request.delete(`/produtos/${productId}`, {
      headers: { Authorization: token },
    });
    expect(deleteRes.status()).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody.message).toBe('Registro excluído com sucesso');

    // 3. Validar estado final (Confirmar que produto não existe mais)
    const checkRes = await request.get(`/produtos/${productId}`);
    expect(checkRes.status()).toBe(400);
    const checkBody = await checkRes.json();
    expect(checkBody.message).toBe('Produto não encontrado');
  });
});
