
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Deve recusar login invalido', async ({ request }) => {

  const resposta = await request.post('/login', {
    data: {
      email: 'usuarioinexistente@teste.com',
      password: 'senhaerrada123'
    }
  });

  // Login incorreto deve retornar 401
  expect(resposta.status()).toBe(401);

  const dados = await resposta.json();

  expect(dados.message).toBe('Email e/ou senha inválidos');

  // Um login invalido nao deve retornar token
  expect(dados.authorization).toBeUndefined();

});
