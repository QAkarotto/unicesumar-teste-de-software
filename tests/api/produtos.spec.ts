import { test, expect } from '@playwright/test';


test('deve criar produto com usuário autenticado', async ({ request }) => {

  const email = `produto${Date.now()}@teste.com`;

  // Criar usuário administrador
  await request.post('/usuarios', {
    data: {
      nome: 'Administrador Produto',
      email,
      password: '123456',
      administrador: 'true'
    }
  });


  // Login para obter token
  const login = await request.post('/login', {
    data: {
      email,
      password: '123456'
    }
  });


  expect(login.status()).toBe(200);

  const corpoLogin = await login.json();

  const token = corpoLogin.authorization;

  expect(token).toBeTruthy();


  // Criar produto autenticado
  const produto = await request.post('/produtos', {

    headers: {
      Authorization: token
    },

    data: {
      nome: `Produto Teste ${Date.now()}`,
      preco: 100,
      descricao: 'Produto criado pelo teste automatizado',
      quantidade: 10
    }

  });


  expect(produto.status()).toBe(201);


  const corpoProduto = await produto.json();

  expect(corpoProduto.message)
    .toBe('Cadastro realizado com sucesso');

  expect(corpoProduto._id).toBeTruthy();

});