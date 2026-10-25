import { test, expect } from '@playwright/test';

test.describe('ServeRest API Tests', () => {

  const randomEmail = `teste.qa${Date.now()}@unicesumar.br`;

  test('1. [Sucesso] GET /usuarios - Deve retornar lista de usuários', async ({ request }) => {
    const response = await request.get('/usuarios');
    const body = await response.json();
    
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('quantidade');
    expect(Array.isArray(body.usuarios)).toBeTruthy();
  });

  test('2. [Sucesso] POST /usuarios - Deve cadastrar um novo usuário administrador', async ({ request }) => {
    const response = await request.post('/usuarios', {
      data: {
        nome: 'Aluno Unicesumar',
        email: randomEmail,
        password: 'senhaforte',
        administrador: 'true'
      }
    });
    const body = await response.json();
    
    expect(response.status()).toBe(201);
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body).toHaveProperty('_id');
  });

  test('3. [Inválido/Regra de Negócio] POST /usuarios - Não deve permitir cadastro com email já utilizado', async ({ request }) => {
   
    const response = await request.post('/usuarios', {
      data: {
        nome: 'Aluno Duplicado',
        email: randomEmail, 
        password: 'senhaforte',
        administrador: 'true'
      }
    });
    const body = await response.json();
    
    expect(response.status()).toBe(400);
    expect(body.message).toBe('Este email já está sendo usado');
  });

  test('4. [Sucesso] POST /login - Deve realizar login com sucesso', async ({ request }) => {
    const response = await request.post('/login', {
      data: {
        email: randomEmail,
        password: 'senhaforte'
      }
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body).toHaveProperty('authorization'); 
  });

  test('5. [Sucesso] GET /produtos - Deve retornar a lista de produtos', async ({ request }) => {
    const response = await request.get('/produtos');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('quantidade');
    expect(typeof body.quantidade).toBe('number');
  });

  test('6. [Inválido/Regra de Negócio] POST /produtos - Não deve permitir cadastro de produto sem token de autenticação', async ({ request }) => {
    const response = await request.post('/produtos', {
      data: {
        nome: 'Notebook Teste',
        preco: 3000,
        descricao: 'Notebook para automação',
        quantidade: 5
      }
    });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
  });
});