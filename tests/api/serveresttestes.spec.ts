import { test, expect } from '@playwright/test';

test.describe('Testes de API do ServeRest', () => {
    
    test('Deve listar os usuários cadastrados com sucesso', async ({ request }) => {
    const response = await request.get('/usuarios');
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('usuarios');
    expect(body.quantidade).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(body.usuarios)).toBeTruthy();
  });

  test('Deve cadastrar um novo usuário com sucesso', async ({ request }) => {
    const emailUnico = `qa_teste_${Date.now()}@gmail.com`;
    const response = await request.post('/usuarios', {
      data: {
        nome: 'Aluno Teste',
        email: emailUnico,
        password: 'teste123',
        administrador: 'true'
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body).toHaveProperty('_id');
  });

  test('Não deve cadastrar um usuário com email já existente', async ({ request }) => {
    const emailDuplicado = `duplicado_${Date.now()}@gmail.com`;
    await request.post('/usuarios', {
      data: {
        nome: 'Usuário 1',
        email: emailDuplicado,
        password: 'senha123',
        administrador: 'true'
      }
    });

    const response = await request.post('/usuarios', {
      data: {
        nome: 'Usuário 2',
        email: emailDuplicado,
        password: 'senha123',
        administrador: 'true'
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Este email já está sendo usado');
  });

  
});