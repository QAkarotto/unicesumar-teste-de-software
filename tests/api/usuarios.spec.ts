import { test, expect } from '@playwright/test';


test('deve criar um usuário com sucesso', async ({ request }) => {

  const novoUsuario = {
    nome: 'Charles Teste',
    email: `charles${Date.now()}@teste.com`,
    password: '123456',
    administrador: 'true'
  };

  const resposta = await request.post('/usuarios', {
    data: novoUsuario
  });

  expect(resposta.status()).toBe(201);

  const corpo = await resposta.json();

  expect(corpo.message).toBe('Cadastro realizado com sucesso');
  expect(corpo._id).toBeTruthy();

});


test('deve listar usuários cadastrados', async ({ request }) => {

  const resposta = await request.get('/usuarios');

  expect(resposta.status()).toBe(200);

  const corpo = await resposta.json();

  expect(corpo).toHaveProperty('usuarios');
  expect(Array.isArray(corpo.usuarios)).toBeTruthy();

});
test('não deve permitir cadastrar usuário com email duplicado', async ({ request }) => {

  const email = `duplicado${Date.now()}@teste.com`;

  const usuario = {
    nome: 'Usuário Duplicado',
    email,
    password: '123456',
    administrador: 'true'
  };


  // Primeiro cadastro
  const primeiroCadastro = await request.post('/usuarios', {
    data: usuario
  });

  expect(primeiroCadastro.status()).toBe(201);


  // Segundo cadastro com o mesmo email
  const segundoCadastro = await request.post('/usuarios', {
    data: usuario
  });


  expect(segundoCadastro.status()).toBe(400);


  const corpo = await segundoCadastro.json();

  expect(corpo.message).toBe('Este email já está sendo usado');

});