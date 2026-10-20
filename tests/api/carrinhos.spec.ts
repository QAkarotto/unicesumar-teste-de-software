import { test, expect } from '../../fixtures/api.fixture';

test.describe('Gerenciamento de Carrinhos', () => {
  
  test('não deve permitir cadastrar carrinho sem estar autenticado', async ({ request }) => {
    const response = await request.post('/carrinhos', {
      data: {
        produtos: [{ idProduct: "Fals0ID", quantidade: 1 }]
      }
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Token de acesso ausente, expirado, inválido ou usuário do token não existe mais');
  });

  test('deve listar carrinhos cadastrados com sucesso', async ({ request }) => {
    const response = await request.get('/carrinhos');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('carrinhos');
    expect(Array.isArray(body.carrinhos)).toBe(true);
  });
});