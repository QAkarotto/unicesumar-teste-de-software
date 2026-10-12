import { test, expect } from '@playwright/test';


test('deve realizar login com sucesso', async ({ request }) => {

  const email = `login${Date.now()}@teste.com`;

  // Criar usuário
  await request.post('/usuarios', {
    data: {
      nome: 'Usuário Login',
      email,
      password: '123456',
      administrador: 'true'
    }
  });


  // Fazer login
  const resposta = await request.post('/login', {
    data: {
      email,
      password: '123456'
    }
  });


  expect(resposta.status()).toBe(200);

  const corpo = await resposta.json();

  expect(corpo.message).toBe('Login realizado com sucesso');
  expect(corpo.authorization).toBeTruthy();

});



test('não deve realizar login com senha inválida', async ({ request }) => {

  const email = `invalido${Date.now()}@teste.com`;

  await request.post('/usuarios', {
    data: {
      nome: 'Usuário Inválido',
      email,
      password: '123456',
      administrador: 'true'
    }
  });


  const resposta = await request.post('/login', {
    data: {
      email,
      password: 'senhaerrada'
    }
  });


  expect(resposta.status()).toBe(401);

  const corpo = await resposta.json();

  expect(corpo.message).toBe('Email e/ou senha inválidos');

});