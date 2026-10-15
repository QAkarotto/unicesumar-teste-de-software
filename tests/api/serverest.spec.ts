import { test, expect } from '@playwright/test';

test.describe('Testes de API - ServeRest', () => {

  test('Deve listar todos os utilizadores com sucesso', async ({ request }) => {
    const response = await request.get('/usuarios');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('usuarios');
    expect(Array.isArray(body.usuarios)).toBeTruthy();
  });

  test('Deve cadastrar um novo utilizador com sucesso', async ({ request }) => {
    const uniqueEmail = `qa_user_${Date.now()}@qa.com`;
    const response = await request.post('/usuarios', {
      data: {
        nome: 'Fulano da Silva',
        email: uniqueEmail,
        password: 'teste',
        administrador: 'true'
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body).toHaveProperty('_id');
  });

  test('Não deve permitir o cadastro de um utilizador com e-mail já existente', async ({ request }) => {
    const emailDuplicado = `duplicado_${Date.now()}@qa.com`;

    await request.post('/usuarios', {
      data: {
        nome: 'Primeiro Usuario',
        email: emailDuplicado,
        password: 'teste',
        administrador: 'true'
      }
    });

    const response = await request.post('/usuarios', {
      data: {
        nome: 'Segundo Usuario',
        email: emailDuplicado,
        password: 'teste',
        administrador: 'true'
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Este email já está sendo usado');
  });

  test('Deve buscar um utilizador específico por ID', async ({ request }) => {
    const listResponse = await request.get('/usuarios');
    const listBody = await listResponse.json();
    const userId = listBody.usuarios[0]._id;

    const response = await request.get(`/usuarios/${userId}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('nome');
    expect(body).toHaveProperty('email');
  });

  test('Deve retornar 400 ao buscar um utilizador com ID inexistente', async ({ request }) => {
    const response = await request.get('/usuarios/idInexistente123');
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Usuário não encontrado');
  });

  test('Deve realizar login com sucesso', async ({ request }) => {
    const emailLogin = `login_${Date.now()}@qa.com`;
    const password = 'password123';

    await request.post('/usuarios', {
      data: {
        nome: 'Usuario Login',
        email: emailLogin,
        password: password,
        administrador: 'false'
      }
    });

    const response = await request.post('/login', {
      data: {
        email: emailLogin,
        password: password
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body).toHaveProperty('authorization');
  });

});
